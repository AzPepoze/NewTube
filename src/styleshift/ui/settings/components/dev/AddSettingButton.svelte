<script lang="ts">
	import { ui_preset } from "../../../../settings/default-items";
	import { add_setting } from "../../../../settings/items";
	import { main_setting_ui } from "../main/main";
	import Button from "../main/Button.svelte";
	import Dropdown from "../main/Dropdown.svelte";

	let { categorySettings } = $props();
	let isOpen = $state(false);
	let triggerEl = $state<HTMLElement | null>(null);

	const options = Object.keys(main_setting_ui).filter((key) => key !== "search");

	async function handleSelect(selected: string) {
		const preset = ui_preset.find((p) => p.type === selected);
		if (preset) {
			await add_setting(categorySettings, { ...preset, editable: true });
		} else {
			await add_setting(categorySettings, {
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
			click_function: () => (isOpen = !isOpen)
		}}
		style="border-radius: 1000px; padding: 10px; width: 100%;"
	/>
	<Dropdown
		justMenu={true}
		bind:isOpen
		{triggerEl}
		setting={{
			type: "dropdown",
			id: "add_setting_dropdown",
			name: "Add Setting",
			value: "",
			options: Object.fromEntries(options.map(opt => [opt, {}])),
			update_function: handleSelect
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
