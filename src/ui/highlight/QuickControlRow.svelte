<script lang="ts">
	import Checkbox from "../settings/components/controls/Checkbox.svelte";
	import ColorPicker from "../settings/components/controls/ColorPicker.svelte";
	import Slider from "../settings/components/controls/Slider.svelte";
	import TextInput from "../settings/components/controls/TextInput.svelte";
	import Dropdown from "../settings/components/controls/Dropdown.svelte";

	let {
		ctrl,
		enabled = $bindable(false),
		value = $bindable(""),
	}: {
		ctrl: any;
		enabled: boolean;
		value: any;
	} = $props();

	const currentSetting = $derived({
		...ctrl,
		name: ctrl.label,
		value: value,
		id: "",
		updateFunction: (val: any) => (value = val),
	});
</script>

<div class="control-row">
	<div class="toggle-side">
		<Checkbox
			hideLabel={true}
			setting={{
				type: "checkbox",
				id: "",
				name: "",
				value: enabled,
				updateFunction: (v) => (enabled = v),
			}}
		/>
	</div>
	<div class="input-side">
		{#if ctrl.type === "color"}
			<ColorPicker setting={currentSetting} />
		{:else if ctrl.type === "textInput"}
			<TextInput setting={currentSetting} placeholder={ctrl.placeholder} />
		{:else if ctrl.type === "numberSlide"}
			<Slider setting={currentSetting} />
		{:else if ctrl.type === "dropdown"}
			<Dropdown setting={currentSetting} />
		{/if}
	</div>
</div>

<style lang="scss">
	.control-row {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--fg-opacity-03);
		padding: 10px 12px;
		border-radius: 15px;
		transition: all 0.2s ease;
		border: 1px solid transparent;

		&:hover {
			background: var(--fg-opacity-05);
			border-color: var(--fg-opacity-10);
		}

		.toggle-side {
			flex-shrink: 0;
		}

		.input-side {
			flex: 1;
			min-width: 0;
		}
	}
</style>
