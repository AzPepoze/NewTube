<script lang="ts">
	import Slider from "./Slider.svelte";
	import SettingFrame from "../SettingFrame.svelte";
	import Description from "./Description.svelte";

	let {
		id = "",
		name = "",
		description = "",
		hex = $bindable("#ffffff"),
		alpha = $bindable(100),
		onUpdate = () => {},
	} = $props();

	function handleHexChange() {
		onUpdate(hex, alpha);
	}

	function handleAlphaChange(newAlpha: number) {
		alpha = newAlpha;
		onUpdate(hex, alpha);
	}
</script>

<SettingFrame {id} type="color" vertical={true}>
	<div class="STYLESHIFT-Color-Top-Section">
		<Description {name} {description} />
		<div class="STYLESHIFT-Color-Preview-Wrapper">
			<div class="STYLESHIFT-Color-Preview" style="background-color: {hex}; opacity: {alpha / 100}"></div>
			<input type="color" class="STYLESHIFT-Color-Input" bind:value={hex} oninput={handleHexChange} />
		</div>
	</div>

	<div class="STYLESHIFT-Color-Alpha-Section">
		<Slider name="Opacity" bind:value={alpha} min={0} max={100} unit="%" onUpdate={handleAlphaChange} />
	</div>
</SettingFrame>

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
