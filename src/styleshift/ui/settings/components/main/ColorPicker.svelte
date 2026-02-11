<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import Slider from "./Slider.svelte";
	import Description from "./Description.svelte";
	import { getFromStorage, getRootValue } from "@/styleshift/core/storageManager";
	import { setAndSave } from "@ui/settings/settingComponents";
	import { triggerSettingUpdate } from "@settings/functions";
	import { hexToColorObj, colorObjToHex } from "@styleshift/utils/colors";
	import { sequencedTask } from "@/styleshift/shared/normal";

	let {
		setting,
	}: {
		setting: Extract<Setting, { type: "color" }>;
	} = $props();

	let hex = $state("#ffffff");
	let alpha = $state(100);

	async function init() {
		let value;
		if (setting.id) {
			value = await getFromStorage(setting.id);
		} else {
			value = setting.value;
		}
		const colorObj = hexToColorObj(value || "#ffffff");
		hex = colorObj.hex;
		alpha = colorObj.alpha;
	}
	init();

	const name = $derived(setting.name);
	const description = $derived(setting.description);

	async function handleUpdate() {
		const hexValue = colorObjToHex({ hex, alpha });
		if (setting.id) {
			await setAndSave(setting, hexValue);
			await triggerSettingUpdate(setting.id);
		} else if (typeof (setting as any).updateFunction === "function") {
			await (setting as any).updateFunction(hexValue);
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

	async function handleAlphaChange(newAlpha: number) {
		alpha = newAlpha;
		await sequencedUpdate();
	}
</script>

<div class="STYLESHIFT-Color-Top-Section">
	<Description {name} {description} />
	<div class="STYLESHIFT-Color-Preview-Wrapper">
		<div class="STYLESHIFT-Color-Preview" style="background-color: {hex}; opacity: {alpha / 100}"></div>
		<input
			type="color"
			class="STYLESHIFT-Color-Input"
			bind:value={hex}
			oninput={handleInput}
			onchange={handleChange}
		/>
	</div>
</div>

<div class="STYLESHIFT-Color-Alpha-Section">
	<Slider
		setting={{
			type: "numberSlide",
			name: "Opacity",
			min: 0,
			max: 100,
			unit: "%",
			value: alpha,
			id: "",
			updateFunction: handleAlphaChange,
		}}
	/>
</div>

<style lang="scss">
	.STYLESHIFT-Color-Top-Section {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
	}

	.STYLESHIFT-Color-Preview-Wrapper {
		position: relative;
		min-width: 50px;
		width: 50px;
		min-height: 50px;
		height: 50px;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: rgba(0, 0, 0, 0.34) 1px 1px 7px;
		transition: all 0.2s;
		background-image: linear-gradient(45deg, #111 25%, transparent 25%),
			linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%),
			linear-gradient(-45deg, transparent 75%, #111 75%);
		background-size: 10px 10px;

		&:hover {
			transform: scale(1.1);
		}
	}

	.STYLESHIFT-Color-Preview {
		width: 100%;
		height: 100%;
	}

	.STYLESHIFT-Color-Input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
		-webkit-appearance: none;
		appearance: none;
	}

	.STYLESHIFT-Color-Alpha-Section {
		width: 100%;

		:global(.STYLESHIFT-Setting-Frame) {
			background: transparent !important;
			border: none !important;
			padding: 0 !important;
			margin: 0 !important;
		}

		:global(.setting-name) {
			font-size: 14px !important;
			opacity: 0.7 !important;
		}
	}
</style>
