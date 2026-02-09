<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import Slider from "./Slider.svelte";
	import Description from "./Description.svelte";
	import { get_from_storage, get_root_value } from "@/styleshift/core/storage-manager";
	import { set_and_save } from "@ui/settings/setting-components";
	import { trigger_setting_update } from "@settings/functions";
	import { hex_to_color_obj, color_obj_to_hex } from "@styleshift/utils/colors";
	import { sequenced_task } from "@functions/normal";

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
			value = await get_from_storage(setting.id);
		} else {
			value = setting.value;
		}
		const colorObj = hex_to_color_obj(value || "#ffffff");
		hex = colorObj.hex;
		alpha = colorObj.alpha;
	}
	init();

	const name = $derived(setting.name);
	const description = $derived(setting.description);

	async function handleUpdate() {
		const hexValue = color_obj_to_hex({ hex, alpha });
		if (setting.id) {
			await set_and_save(setting, hexValue);
			await trigger_setting_update(setting.id);
		} else if (typeof (setting as any).update_function === "function") {
			await (setting as any).update_function(hexValue);
		}
	}

	const sequencedUpdate = sequenced_task(handleUpdate);

	async function handleInput() {
		if (await get_root_value("Realtime_Extension")) {
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
			type: "number_slide",
			name: "Opacity",
			min: 0,
			max: 100,
			unit: "%",
			value: alpha,
			id: "",
			update_function: handleAlphaChange,
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
