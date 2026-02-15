<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import { hexToRgb, rgbToHsv, hsvToRgb } from "../../../../shared/normal";
	import Description from "./Description.svelte";
	import Icon from "./Icon.svelte";
	import { getJustifyContent } from "../../utils";

	import { executeSettingScript } from "@/styleshift/core/runtimeController";

	let {
		setting,
		style = "",
	}: {
		setting: Extract<Setting, { type: "button" }>;
		style?: string;
	} = $props();

	// Derived values that rely on the setting object
	const name = $derived(setting.name);
	const description = $derived(setting.description);
	const icon = $derived(setting.icon);
	const color = $derived(setting.color || "#ffffff");
	const align = $derived(setting.align || "center");
	const fontSize = $derived(setting.fontSize || 15);
	const justifyContent = $derived(getJustifyContent(align));

	let scale = $state(1);

	const buttonStyles = $derived.by(() => {
		const isHex = color.startsWith("#");

		if (!isHex) {
			return {
				background: color,
				border: "1px solid var(--Border-Color)",
				color: "var(--Font-Color)",
			};
		}

		const { r, g, b } = hexToRgb(color);

		// Calculate background shades
		const bgHsv = rgbToHsv({ r, g, b });
		bgHsv.s /= 2;
		bgHsv.v /= 3;
		const bgColor = hsvToRgb(bgHsv);

		const bgtHsv = rgbToHsv({ r, g, b });
		bgtHsv.s /= 1.5;
		bgtHsv.v /= 2;
		const bgtColor = hsvToRgb(bgtHsv);

		const top = `rgb(${bgtColor.r}, ${bgtColor.g}, ${bgtColor.b})`;
		const bottom = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.5)`;
		const border = `rgb(${r + 150}, ${g + 150}, ${b + 150})`;

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
</script>

<div
	class="STYLESHIFT-Button"
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
		<Icon name={icon} size={50} className="STYLESHIFT-Button-Icon" applyFilter={false} />
	{/if}

	<Description {name} {description} {align} style="display: flex; color: inherit; font-size: {fontSize}px;" />
</div>

<style lang="scss">
	.STYLESHIFT-Button {
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
	}

	.STYLESHIFT-Button:hover {
		filter: brightness(1.5) drop-shadow(2px 2px 3px black) drop-shadow(-2px -2px 3px rgba(255, 255, 255, 0.37));

		:global(.STYLESHIFT-Main-Description .setting-name) {
			font-weight: 400;
		}
	}

	:global(.STYLESHIFT-Icon.STYLESHIFT-Button-Icon) {
		margin-right: 20px !important;
		object-fit: contain;
	}
</style>
