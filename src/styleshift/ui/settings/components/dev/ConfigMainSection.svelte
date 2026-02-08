<script lang="ts">
	import { save_all } from "../../../../core/save";
	import { settings_ui } from "../../setting-components";

	let { setting, props, updateUI = () => {} } = $props();

	async function handleUpdate(property: string, value: any, customUpdate?: Function) {
		setting[property] = value;
		if (typeof customUpdate === "function") {
			customUpdate(value);
		} else {
			updateUI();
		}
		await save_all();
	}

	function mountWrapper(node: HTMLElement, params: { type: string; config: any; update_fn?: any }) {
		const { type, config, update_fn } = params;
		(async () => {
			const res = await settings_ui[type](config, update_fn);
			const frame = res.frame || res.button || res;
			if (frame instanceof HTMLElement) {
				frame.classList.add("STYLESHIFT-Config-Sub-Frame");
				node.replaceWith(frame);
			}
		})();
	}

	function renderEditor(node: HTMLElement, params: { title: string; property: string; update: any }) {
		const { title, property, update } = params;
		(async () => {
			const text_editor = await settings_ui["setting_developer_text_editor"](node, setting, {
				[title]: property,
			});
			const main_ui = text_editor.main_ui;
			node.replaceWith(main_ui);

			let update_function;
			if (typeof update === "function") {
				update_function = update;
			} else {
				update_function = (value: any) => {
					setting[property] = value;
					updateUI();
					save_all();
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

		{#if Array.isArray(update)}
			<div
				use:mountWrapper={{
					type: "dropdown",
					config: {
						name: title,
						value: setting[property],
						options: Object.fromEntries(
							update.map((v) => [v, { enable_function: () => handleUpdate(property, v) }]),
						),
					},
				}}
			></div>
		{:else if property === "Rainbow"}
			<div
				use:mountWrapper={{
					type: "checkbox",
					config: { name: title, value: setting.Rainbow },
					update_fn: (val) => handleUpdate("Rainbow", val),
				}}
			></div>
		{:else if property === "color"}
			<div
				use:mountWrapper={{
					type: "color",
					config: {
						name: title,
						value: setting.color,
						show_alpha_slider: false,
						update_function: (val) => handleUpdate("color", val),
					},
				}}
			></div>
		{:else if property === "font_size"}
			<div
				use:mountWrapper={{
					type: "number_slide",
					config: {
						name: title,
						value: setting.font_size,
						update_function: (val) => handleUpdate("font_size", val),
					},
				}}
			></div>
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
