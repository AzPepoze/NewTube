<script lang="ts">
	import { localStorageUtil } from "@/styleshift/shared/localStorage";
	import Window from "@ui/components/general/Window.svelte";
	import FlyoutCanvas from "./FlyoutCanvas.svelte";
	import { untrack } from "svelte";

	let {
		onClose = () => {},
		initialPos,
		disableBackdropFilter = false,
	}: {
		onClose?: () => void;
		initialPos?: any;
		disableBackdropFilter?: boolean;
	} = $props();

	let pos = $state<{
		translate?: string;
		width?: string;
		height?: string;
	}>(
		untrack(() => initialPos) ?? {
			width: "420px",
			height: "236px",
			translate: "0px 0px",
		},
	);

	function handlePositionChange(newPos: any) {
		const filteredPos = {
			translate: newPos.translate,
			width: newPos.width,
			height: newPos.height,
		};
		pos = filteredPos;
		localStorageUtil.set("flyoutPosition", filteredPos);
	}
</script>

<Window
	title="Flyout Player"
	onPositionChange={handlePositionChange}
	width={pos.width}
	height={pos.height}
	translate={pos.translate}
	mini={true}
	aspectRatio={16 / 9}
	autoHideTopbar={true}
	noPadding={true}
	minVisibleRatio={0.4}
	{disableBackdropFilter}
	{onClose}
>
	<FlyoutCanvas />
</Window>

<style lang="scss">
</style>
