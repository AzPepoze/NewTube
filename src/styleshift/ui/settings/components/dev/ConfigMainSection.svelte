<script lang="ts">
	import { persist_items } from "../../../../core/runtime-controller";
	import { settings_ui } from "../../setting-components";
	import { trigger_setting_update } from "@settings/functions";
	import { logger } from "@/styleshift/utils/logger";
	import { refresh_setting_ui } from "../../settings";
	import { get_settings_list } from "@settings/items";

	let { setting, props, updateUI = () => {} } = $props();

	/**
	 * Centralized handler for all property updates in the config UI.
	 * Handles persistence, UI refresh, and optional custom callbacks.
	 */
	async function applyPropertyUpdate(property: string, newValue: any, customCallback?: Function) {
		let finalValue = newValue;

		// Handle JSON parsing if the original value was an object and the new value is a string
		if (typeof setting[property] === "object" && setting[property] !== null && typeof newValue === "string") {
			try {
				finalValue = JSON.parse(newValue);
			} catch (e) {
				logger.warn("config", `[ConfigMainSection] JSON parse failed for ${property}, using raw string`, e);
			}
		}

		// Check if the value has actually changed to avoid unnecessary updates/refreshes
		const isObject = typeof finalValue === "object" && finalValue !== null;
		const hasChanged = isObject
			? JSON.stringify(setting[property]) !== JSON.stringify(finalValue)
			: setting[property] !== finalValue;

		if (!hasChanged) {
			logger.debug(
				"config",
				`[ConfigMainSection] No change detected for property "${property}", skipping update.`,
			);
			return;
		}

		logger.debug("config", `[ConfigMainSection] Property Change: "${property}" ->`, finalValue);

		const oldId = setting.id;
		setting[property] = finalValue;

		// If the ID was changed, we need to rebuild the internal settings list cache
		if (property === "id" && oldId !== finalValue) {
			await get_settings_list(true);
		}

		// Execute custom callback if provided and it's not the default updateUI
		if (typeof customCallback === "function" && customCallback !== updateUI) {
			await customCallback(finalValue);
		}

		// Refresh the setting UI or call the general updateUI fallback
		if (setting.id) {
			await refresh_setting_ui(setting.id);
			await trigger_setting_update(setting.id);
		} else if (typeof updateUI === "function") {
			updateUI();
		}

		// Persist items without triggering a full UI refresh (to avoid lag)
		await persist_items();

		logger.info(
			"STORAGE",
			`[ConfigMainSection] Property update and persistence complete for: ${setting.id || "custom-item"}`,
		);
	}

	function mountWrapper(node: HTMLElement, params: { type: string; config: any; update_function?: any }) {
		const { type, config, update_function } = params;
		(async () => {
			const res = await settings_ui[type](config, update_function);
			const frame = res.frame || res.button || res;
			if (frame instanceof HTMLElement) {
				frame.classList.add("STYLESHIFT-Config-Sub-Frame");
				node.replaceWith(frame);
			}
		})();
	}

	function getComponentConfig(title: string, property: string, update: any) {
		const propertyValue = setting[property];
		const isBooleanValue = typeof propertyValue === "boolean" && property === "value";
		const isColorValue = property === "color" || (property === "value" && setting.type === "color");
		const isNumberValue =
			property === "font_size" ||
			property === "min" ||
			property === "max" ||
			property === "step" ||
			(property === "value" && setting.type === "number_slide");

		// Helper to create update function with optional custom callback
		const createUpdateFunc = (prop: string) => (val: any) =>
			applyPropertyUpdate(prop, val, typeof update === "function" ? update : undefined);

		if (Array.isArray(update)) {
			const update_func = (val) => applyPropertyUpdate(property, val);
			return {
				type: "dropdown",
				config: {
					type: "dropdown",
					name: title,
					value: propertyValue,
					options: Object.fromEntries(update.map((v) => [v, {}])),
					update_function: update_func,
				},
				update_function: update_func,
			};
		}

		if (property === "Rainbow" || isBooleanValue) {
			const update_func = createUpdateFunc(property);
			return {
				type: "checkbox",
				config: { type: "checkbox", name: title, value: propertyValue, update_function: update_func },
				update_function: update_func,
			};
		}

		if (isColorValue) {
			const update_func = createUpdateFunc(property);
			return {
				type: "color",
				config: {
					type: "color",
					name: title,
					value: propertyValue,
					show_alpha_slider: true,
					update_function: update_func,
				},
				update_function: update_func,
			};
		}

		if (isNumberValue) {
			const update_func = createUpdateFunc(property);
			return {
				type: "number_slide",
				config: {
					type: "number_slide",
					name: title,
					value: propertyValue,
					min: property === "max" ? propertyValue : property === "step" ? 0.1 : 0,
					max:
						property === "font_size"
							? 50
							: property === "min"
								? propertyValue
								: property === "step"
									? 10
									: 1000,
					step: property === "step" ? 0.1 : 1,
					update_function: update_func,
				},
				update_function: update_func,
			};
		}

		return null;
	}

	function renderEditor(node: HTMLElement, params: { title: string; property: string; update: any }) {
		const { title, property, update } = params;
		(async () => {
			// Pre-process object properties to string for the editor
			const temp_obj = { ...setting };
			if (typeof temp_obj[property] === "object" && temp_obj[property] !== null) {
				temp_obj[property] = JSON.stringify(temp_obj[property], null, 2);
			}

			const text_editor = await settings_ui.setting_developer_text_editor(node, temp_obj, {
				[title]: property,
			});
			const main_ui = text_editor.main_ui;
			node.replaceWith(main_ui);

			const editorWrapper = text_editor.text_editors[title];
			const textarea = editorWrapper.text_editor;

			// Add focus and blur logging
			textarea.addEventListener("focus", () => {
				logger.debug("ui", `[ConfigMainSection] Text editor focused for property "${property}"`);
			});

			textarea.addEventListener("blur", () => {
				logger.debug("ui", `[ConfigMainSection] Text editor blurred for property "${property}"`);
			});

			// Centralized update function for the text editor
			const onUpdate = async (value: any) => {
				logger.debug("ui", `[ConfigMainSection] Text editor update for "${property}":`, value);
				temp_obj[property] = value;
				await applyPropertyUpdate(property, value, typeof update === "function" ? update : undefined);
			};

			editorWrapper.on_change(onUpdate);
		})();
	}
</script>

<div class="STYLESHIFT-Config-Main-Section">
	{#each Object.entries(props) as [title, propertyValue]}
		{@const property = Array.isArray(propertyValue) ? propertyValue[0] : propertyValue}
		{@const update = Array.isArray(propertyValue) ? propertyValue[1] : updateUI}
		{@const componentConfig = getComponentConfig(title, property, update)}

		{#if componentConfig}
			<div use:mountWrapper={componentConfig}></div>
		{:else}
			<div class="full-width" use:renderEditor={{ title, property, update }}></div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.STYLESHIFT-Config-Main-Section {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 16px;
		width: 100%;

		.full-width {
			grid-column: 1 / -1;
		}

		:global(.STYLESHIFT-Config-Sub-Frame) {
			margin-bottom: 0 !important;
			background: var(--BG-Surface) !important;
			border: 1px solid var(--Border-Color) !important;
			box-shadow: none !important;

			&:focus-within {
				border-color: var(--Theme-0) !important;
				background: var(--BG-Surface-Hover) !important;
			}
		}
	}
</style>
