<script lang="ts">
	import { persist_and_refresh_all } from "../../../../core/runtime-controller";
	import { settings_ui } from "../../setting-components";
	import { trigger_setting_update } from "@settings/functions";
	import { logger } from "@/styleshift/utils/logger";
	import { refresh_setting_ui } from "../../settings";

	let { setting, props, updateUI = () => {} } = $props();

	/**
	 * Centralized handler for all property updates in the config UI.
	 */
	async function processPropertyChange(property: string, value: any, customUpdate?: Function) {
		logger.debug("config", `[ConfigMainSection] Property Change Attempt: "${property}" ->`, value);
		
		setting[property] = value;
		
		if (typeof customUpdate === "function") {
			customUpdate(value);
		} else {
			if (setting.id) {
				await refresh_setting_ui(setting.id);
			} else {
				updateUI();
			}
		}
		
		if (setting.id) {
			await trigger_setting_update(setting.id);
		}

		await persist_and_refresh_all();
		logger.info("STORAGE", `[ConfigMainSection] Property update and persistence complete for: ${setting.id || 'custom-item'}`);
	}

	async function handleUpdate(property: string, value: any, customUpdate?: Function) {
		await processPropertyChange(property, value, customUpdate);
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

		if (Array.isArray(update)) {
			const update_func = (val) => handleUpdate(property, val);
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
			const update_func = (val) => handleUpdate(property, val);
			return {
				type: "checkbox",
				config: { type: "checkbox", name: title, value: propertyValue, update_function: update_func },
				update_function: update_func,
			};
		}

		if (isColorValue) {
			const update_func = (val) => handleUpdate(property, val);
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
			const update_func = (val) => handleUpdate(property, val);
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

			const text_editor = await settings_ui["setting_developer_text_editor"](node, temp_obj, {
				[title]: property,
			});
			const main_ui = text_editor.main_ui;
			node.replaceWith(main_ui);

			let update_function;
			if (typeof update === "function") {
				update_function = update;
			} else {
				update_function = async (value: any) => {
					await processPropertyChange(property, value);
				};
			}
			text_editor.text_editors[title].additinal_onchange(update_function);
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
