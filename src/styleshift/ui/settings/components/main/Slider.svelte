<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import Description from "./Description.svelte";
	import { load } from "@core/save";
	let {
		setting,
		name: nameProp = "",
		description: descriptionProp = "",
		min: minProp = 0,
		max: maxProp = 100,
		step: stepProp = 1,
		unit: unitProp = "",
		value = $bindable(0),
		onUpdate = () => {},
	}: {
		setting?: Extract<Setting, { type: "number_slide" }>;
		name?: string;
		description?: string;
		min?: number;
		max?: number;
		step?: number;
		unit?: string;
		value: number;
		onUpdate?: (val: number) => void;
	} = $props();

	// Derived values that fallback to props if setting object is missing
	const name = $derived(setting?.name ?? nameProp);
	const description = $derived(setting?.description ?? descriptionProp);
	const min = $derived(setting?.min ?? minProp);
	const max = $derived(setting?.max ?? maxProp);
	const step = $derived(setting?.step ?? stepProp);
	const unit = $derived(setting?.unit ?? unitProp);

	async function handleInput() {
		if (await load("Realtime_Extension")) {
			onUpdate(value);
		}
	}

	function handleChange() {
		onUpdate(value);
	}
</script>

<div class="STYLESHIFT-Slider-Container">
	<div class="STYLESHIFT-Slider-Header">
		<Description {name} {description} />
		<div class="STYLESHIFT-Slider-Value-Wrapper">
			<input
				type="number"
				class="STYLESHIFT-Slider-Number-Input"
				bind:value
				oninput={handleInput}
				onchange={handleChange}
				{min}
				{max}
				{step}
			/>
			{#if unit}
				<span class="STYLESHIFT-Slider-Unit">{unit}</span>
			{/if}
		</div>
	</div>

	<input
		type="range"
		class="STYLESHIFT-Slider-Range"
		{min}
		{max}
		{step}
		bind:value
		oninput={handleInput}
		onchange={handleChange}
	/>
</div>

<style lang="scss">
	.STYLESHIFT-Slider-Container {
		width: 100%;
	}

	.STYLESHIFT-Slider-Header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		gap: 10px;
	}

	.STYLESHIFT-Slider-Value-Wrapper {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.STYLESHIFT-Slider-Number-Input {
		width: 50px;
		height: 18px;
		background: var(--BG-Input);
		border: none;
		box-shadow: 0px 0px 3px white;
		padding-inline: 8px;
		padding-block: 4px;
		text-align: center;
		color: var(--Theme-0, #7f5db7);
		font-family: inherit;
		font-size: 14px;
		font-weight: bold;
		outline: none;
		border-radius: 20px;
		appearance: textfield;
		-moz-appearance: textfield;

		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
	}

	.STYLESHIFT-Slider-Unit {
		font-size: 12px;
		opacity: 0.6;
		font-weight: bold;
		color: white;
	}

	.STYLESHIFT-Slider-Range {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		height: 15px;
		border-radius: 20px;
		background: var(--Slider-Track);
		outline: none;
		overflow: hidden;
		transition: all 0.2s;
		filter: brightness(1) drop-shadow(1px 1px 4px var(--Black-40));
		margin-top: 10px;

		&:hover {
			filter: brightness(1.3) drop-shadow(1px 1px 4px var(--Black-40));
		}

		&::-webkit-slider-runnable-track {
			height: 15px;
			background: var(--Slider-Track);
			border-radius: 20px;
		}

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			appearance: none;
			width: 15px;
			height: 15px;
			background-color: white;
			border-radius: 50%;
			border: 2px solid var(--Theme-0);
			cursor: pointer;
			box-shadow: -1907px 0 0 1900px var(--Theme-0);
		}
	}
</style>
