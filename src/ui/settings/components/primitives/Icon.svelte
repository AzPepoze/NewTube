<script lang="ts">
	const edit = "assets/icons/edit.svg";
	const del = "assets/icons/delete.svg";
	const drag = "assets/icons/drag.svg";
	const add = "assets/icons/add.svg";
	const close = "assets/icons/close.svg";
	const code = "assets/icons/code.svg";
	const arrowUp = "assets/icons/arrowUp.svg";
	const arrowDown = "assets/icons/arrowDown.svg";
	const minimize = "assets/icons/minimize.svg";
	const maximize = "assets/icons/maximize.svg";
	const restore = "assets/icons/restore.svg";
	const exportIcon = "assets/icons/export.svg";
	const openInNew = "assets/icons/openInNew.svg";

	import { getAssetUrl } from "@ui/window/utils";

	const icons: Record<string, string> = {
		edit,
		delete: del,
		drag,
		add,
		close,
		code,
		arrowUp,
		arrowDown,
		minimize,
		maximize,
		restore,
		export: exportIcon,
		openInNew: openInNew,
	};

	let {
		name = "",
		className = "",
		style = "",
		color = "",
		applyFilter = true,
		size = 20,
		scale = 1,
	}: {
		name: string;
		className?: string;
		style?: string;
		color?: string;
		applyFilter?: boolean;
		size?: number;
		scale?: number;
	} = $props();

	const isUrl = $derived(name.includes("://") || name.startsWith("data:"));
	const iconPath = $derived(icons[name]);
	const src = $derived(
		iconPath ? getAssetUrl(iconPath) : isUrl ? getAssetUrl(name) : "",
	);
	const isMaterialIcon = $derived(
		!iconPath &&
			!isUrl &&
			typeof name === "string" &&
			/^[a-z_0-9]+$/.test(name),
	);
	const isEmoji = $derived(
		!iconPath && !isUrl && !isMaterialIcon && name.length > 0,
	);
</script>

{#if src}
	<img
		{src}
		alt={name}
		class="STYLESHIFT-Icon {className}"
		class:with-filter={applyFilter && !color}
		style="transform: scale({Math.min(
			scale,
			2,
		)}); width: {size}px; height: {size}px; {color
			? `filter: none;`
			: ''}{style}"
		style:color={color || undefined}
	/>
{:else if isMaterialIcon}
	<i
		class="material-icons STYLESHIFT-Icon STYLESHIFT-Material-Icon {className}"
		style="font-size: {size}px; line-height: {size}px; width: {size}px; height: {size}px; {style}"
		style:color={color || undefined}
	>
		{name}
	</i>
{:else if isEmoji}
	<span
		class="STYLESHIFT-Icon STYLESHIFT-Text-Icon {className}"
		style="font-size: {size}px; line-height: {size}px; width: {size}px; height: {size}px; {style}"
	>
		{name}
	</span>
{/if}

<style lang="scss">
	.STYLESHIFT-Icon {
		display: inline-block;
		vertical-align: middle;
		pointer-events: none;
		object-fit: contain;
		border-radius: 5px;

		&.with-filter {
			filter: brightness(0) invert(1);
		}
	}

	.STYLESHIFT-Text-Icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-style: normal;
	}

	.STYLESHIFT-Material-Icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-style: normal;
		font-weight: normal;
		font-family: "Material Icons" !important;
		font-size: inherit;
		font-feature-settings: "liga" 1;
		line-height: 1;
		text-transform: none;
		letter-spacing: normal;
		word-wrap: normal;
		white-space: nowrap;
		direction: ltr;
	}
</style>
