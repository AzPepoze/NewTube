<script lang="ts">
	import { uiPreset } from "../../../../settings/defaultItems";
	import { addSetting } from "../../../../settings/items";
	import * as mainSettingUi from "../main/main";
	import Button from "../main/Button.svelte";
	import Dropdown from "../main/Dropdown.svelte";

	let { categorySettings } = $props();
	let isOpen = $state(false);
	let triggerEl = $state<HTMLElement | null>(null);

	const options = Object.keys(mainSettingUi).filter((key) => key !== "search");

	async function handleSelect(selected: string) {
		const preset = uiPreset.find((p) => p.type === selected);
		if (preset) {
			await addSetting(categorySettings, { ...preset, editable: true });
		} else {
			await addSetting(categorySettings, {
				type: selected,
				id: `new_${selected}`,
				name: `New ${selected}`,
				editable: true,
			} as any);
		}
	}
</script>

<div bind:this={triggerEl} class="STYLESHIFT-Add-Setting-Button-Wrapper">
	<Button
		setting={{
			type: "button",
			name: "+",
			color: "#FFFFFF",
			clickFunction: () => (isOpen = !isOpen)
		}}
		style="border-radius: 1000px; padding: 10px; width: 100%;"
	/>
	<Dropdown
		justMenu={true}
		bind:isOpen
		{triggerEl}
		setting={{
			type: "dropdown",
			id: "addSettingDropdown",
			name: "Add Setting",
			value: "",
			options: Object.fromEntries(options.map(opt => [opt, {}])),
			updateFunction: handleSelect
		}}
	/>
</div>

<style lang="scss">
	.STYLESHIFT-Add-Setting-Button-Wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		position: relative;
	}
</style>
