<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import { hex_to_rgb, rgb_to_hsv, hsv_to_rgb } from "../../../../build-in-functions/normal";
	import Description from "./Description.svelte";
	import Icon from "./Icon.svelte";
	import { get_justify_content } from "../../utils";

	import { execute_setting_script } from "@/styleshift/core/runtime-controller";

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
	const font_size = $derived(setting.font_size || 15);
	const justifyContent = $derived(get_justify_content(align));

	let scale = $state(1);

	const colors = $derived.by(() => {
		const { r, g, b } = hex_to_rgb(color);

		const bg_hsv = rgb_to_hsv({ r, g, b });
		bg_hsv.s /= 2;
		bg_hsv.v /= 3;
		const bg_color = hsv_to_rgb(bg_hsv);

		const bgt_hsv = rgb_to_hsv({ r, g, b });
		bgt_hsv.s /= 1.5;
		bgt_hsv.v /= 2;
		const bgt_color = hsv_to_rgb(bgt_hsv);

		const background_top_color = `${bgt_color.r},${bgt_color.g},${bgt_color.b}`;
		const background_color = `${bg_color.r},${bg_color.g},${bg_color.b}`;
		const border_color = `${r + 150},${g + 150},${b + 150}`;

		return {
			background: `radial-gradient(at center top, rgb(${background_top_color}), rgb(${background_color}, 0.5))`,
			borderColor: `rgb(${border_color})`,
			textColor: `rgb(${border_color})`,
		};
	});

	function handleClick(e: MouseEvent) {
		scale = 0.95;
		setTimeout(() => {
			scale = 1;
		}, 100);

		if (!setting.click_function) return;
		if (typeof setting.click_function === "string") {
			execute_setting_script(setting, "click_function");
		} else {
			(setting.click_function as Function)();
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="STYLESHIFT-Button"
	style="justify-content: {justifyContent}; background: {colors.background}; border: 1px solid {colors.borderColor}; transform: scale({scale}); {style}"
	onclick={handleClick}
>
	{#if icon}
		<Icon name={icon} size={50} className="STYLESHIFT-Button-Icon" applyFilter={false} />
	{/if}
	<Description
		{name}
		{description}
		{align}
		style="display: flex; color: {colors.textColor}; font-size: {font_size}px;"
	/>
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
