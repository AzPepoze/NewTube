<script lang="ts">
	import { ui_preset } from "../../../../settings/default-items";
	import { add_setting } from "../../../../settings/items";
	import { settings_ui } from "../../setting-components";
	import Button from "../main/Button.svelte";
	import { main_setting_ui } from "../main/main";

	let { categorySettings } = $props();
	let selecting = $state(false);
	let currentDropdown = $state<any>(null);
	let container = $state<HTMLElement>();

	async function handleClick() {
		selecting = true;
		if (currentDropdown) {
			currentDropdown.Cancel();
			return;
		}

		const options = Object.keys(main_setting_ui);
		currentDropdown = settings_ui["show_dropdown"](options, container);

		const selected = await currentDropdown.Selection;
		if (selected) {
			const preset = ui_preset.find((p) => p.type === selected);
			if (preset) {
				await add_setting(categorySettings, preset);
			}
		}

		currentDropdown = null;
		selecting = false;
	}
</script>

<div bind:this={container} class="STYLESHIFT-Add-Setting-Button-Wrapper">
	<Button
		name="+"
		color="#FFFFFF"
		onClick={handleClick}
		style="border-radius: 1000px; padding: 10px; width: 100%;"
	/>
</div>

<style lang="scss">
	.STYLESHIFT-Add-Setting-Button-Wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 10px;
	}
</style>
