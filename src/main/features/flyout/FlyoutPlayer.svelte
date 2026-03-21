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
		top?: string;
		left?: string;
		bottom?: string;
		right?: string;
		width?: string;
		height?: string;
	}>(
		untrack(() => initialPos) ?? {
			width: "420px",
			height: "236px",
			bottom: "24px",
			right: "24px",
		},
	);

	function handlePositionChange(newPos: typeof pos) {
		const filteredPos = {
			top: newPos.top,
			left: newPos.left,
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
	top={pos.top}
	left={pos.left}
	bottom={pos.bottom}
	right={pos.right}
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
