<script lang="ts">
	import { hexToRgb, hsvToRgb, rgbToHsv } from "@/core/shared/colorConversion";
	import { executeSettingScript } from "@core/runtime/controller";
	import type { Setting } from "@settings/types/styleshiftTypes";
	import { getJustifyContent } from "../../utils";
	import Description from "../primitives/Description.svelte";
	import Icon from "../primitives/Icon.svelte";

	let {
		setting,
		style = "",
		showHelpIcon = false,
	}: {
		setting: Extract<Setting, { type: "button" }>;
		style?: string;
		showHelpIcon?: boolean;
	} = $props();

	const name = $derived(setting.name);
	const description = $derived(setting.description);
	const icon = $derived(setting.icon);
	const iconSize = $derived(setting.iconSize || 50);
	const iconScale = $derived(setting.iconScale || 1);
	const color = $derived(setting.color || "#ffffff");
	const align = $derived(setting.align || "center");
	const fontSize = $derived(setting.fontSize || 15);
	const justifyContent = $derived(getJustifyContent(align));

	let scale = $state(1);
	let isHelpVisible = $state(false);

	const buttonStyles = $derived.by(() => {
		if (!color.startsWith("#")) {
			return {
				background: color,
				border: "1px solid var(--border-color)",
				color: "var(--font-color)",
			};
		}

		const { r, g, b } = hexToRgb(color);

		const bgHsv = rgbToHsv({ r, g, b });
		const bgColor = hsvToRgb({ ...bgHsv, s: bgHsv.s / 2, v: bgHsv.v / 3 });
		const bgtColor = hsvToRgb({ ...bgHsv, s: bgHsv.s / 1.5, v: bgHsv.v / 2 });

		const top = `rgb(${bgtColor.r}, ${bgtColor.g}, ${bgtColor.b})`;
		const bottom = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.5)`;
		const border = `rgb(${Math.min(255, r + 150)}, ${Math.min(255, g + 150)}, ${Math.min(255, b + 150)})`;

		return {
			background: `radial-gradient(at center top, ${top}, ${bottom})`,
			border: `1px solid ${border}`,
			color: border,
		};
	});

	function handleClick(_e: MouseEvent | KeyboardEvent) {
		scale = 0.95;
		setTimeout(() => (scale = 1), 100);

		if (!setting.clickFunction) return;

		if (typeof setting.clickFunction === "string") {
			executeSettingScript(setting, "clickFunction");
		} else {
			setting.clickFunction();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick(e);
		}
	}

	function showHelp() {
		isHelpVisible = true;
	}

	function hideHelp() {
		isHelpVisible = false;
	}

	function handleHelpKeyDown(e: KeyboardEvent) {
		if (e.key === "Enter") {
			isHelpVisible = !isHelpVisible;
		}
	}
</script>

<div
	class="styleshift-button"
	class:has-icon={!!icon}
	style:justify-content={justifyContent}
	style:background={buttonStyles.background}
	style:border={buttonStyles.border}
	style:color={buttonStyles.color}
	style:transform="scale({scale})"
	{style}
	onclick={handleClick}
	onkeydown={handleKeyDown}
	role="button"
	tabindex="0"
>
	{#if icon}
		<Icon name={icon} size={iconSize} scale={iconScale} className="styleshift-button-icon" applyFilter={false} />
	{/if}

	<Description
		{name}
		description={showHelpIcon ? "" : description}
		{align}
		style="display: flex; color: inherit; font-size: {fontSize}px;"
	/>

	{#if showHelpIcon && description}
		<div
			class="help-trigger"
			onmouseenter={showHelp}
			onmouseleave={hideHelp}
			onkeydown={handleHelpKeyDown}
			role="button"
			tabindex="0"
		>
			<Icon name="help_outline" size={20} />
			{#if isHelpVisible}
				<div class="styleshift-tooltip">
					{description}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.styleshift-button {
		display: flex;
		align-items: center;
		font-size: 15px;
		transition: all 0.2s;
		user-select: none;
		width: -webkit-fill-available;
		flex-direction: row;
		padding: 20px;
		border-radius: 20px;
		cursor: pointer;
		position: relative;
	}

	.styleshift-button:hover {
		filter: drop-shadow(2px 2px 3px black);

		:global(.styleshift-main-description .setting-name) {
			font-weight: 400;
		}
	}

	:global(.styleshift-icon.styleshift-button-icon) {
		margin-right: 20px !important;
		object-fit: contain;
	}

	.help-trigger {
		margin-left: 10px;
		opacity: 0.5;
		transition: opacity 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px;
		border-radius: 50%;
		position: relative;

		&:hover {
			opacity: 1;
			background: var(--surface-hover);
		}
	}

	.styleshift-tooltip {
		position: absolute;
		bottom: 125%;
		right: 0;
		background: var(--bg-main);
		border: 1px solid var(--border-subtle);
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 12px;
		color: var(--text-primary);
		width: 200px;
		box-shadow: 0 4px 15px var(--shadow-strong);
		z-index: 100;
		pointer-events: none;
		animation: fadeIn 0.2s ease-out;
		white-space: break-spaces;
		line-height: 1.4;
		text-align: left;

		&::after {
			content: "";
			position: absolute;
			top: 100%;
			right: 12px;
			border: 6px solid transparent;
			border-top-color: var(--bg-main);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
