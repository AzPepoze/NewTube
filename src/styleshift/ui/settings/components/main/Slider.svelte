<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import Description from "./Description.svelte";
	import { getFromStorage, getRootValue } from "@/styleshift/core/storageManager";
	import { setAndSave } from "@ui/settings/settingComponents";
	import { triggerSettingUpdate } from "@settings/functions";
	import { sequencedTask } from "@/styleshift/shared/normal";

	let {
		setting,
	}: {
		setting: Extract<Setting, { type: "numberSlide" }>;
	} = $props();

	let value = $state(0);

	async function init() {
		if (setting.id) {
			value = await getFromStorage(setting.id);
		} else {
			value = setting.value;
		}
	}
	init();

	// Derived values that fallback to defaults if setting properties are missing
	const name = $derived(setting.name);
	const description = $derived(setting.description);
	const min = $derived(setting.min ?? 0);
	const max = $derived(setting.max ?? 100);
	const step = $derived(setting.step ?? 1);
	const unit = $derived(setting.unit ?? "");

	async function handleUpdate() {
		if (setting.id) {
			await setAndSave(setting, value);
			await triggerSettingUpdate(setting.id);
		} else if (typeof setting.updateFunction === "function") {
			await setting.updateFunction(value);
		}
	}

	const sequencedUpdate = sequencedTask(handleUpdate);

	async function handleInput() {
		if (await getRootValue("Realtime_Extension")) {
			sequencedUpdate();
		}
	}

	async function handleChange() {
		await sequencedUpdate();
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
