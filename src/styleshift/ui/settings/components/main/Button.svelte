<script lang="ts">
			import { hex_to_rgb, rgb_to_hsv, hsv_to_rgb } from "../../../../build-in-functions/normal";
			import Description from "./Description.svelte";
			import Icon from "./Icon.svelte";
			import { getAssetUrl } from "@ui/utils";
		
			let {
				name = "",
				description = "",
				icon = "",
				color = "#ffffff",
				align = "center",
				font_size = 15,
				onClick = () => {},
			} = $props();
		
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

	function handleClick() {
		scale = 0.95;
		setTimeout(() => {
			scale = 1;
		}, 100);
		onClick();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
	class="STYLESHIFT-Button" 
	style="justify-content: {align}; background: {colors.background}; border: 1px solid {colors.borderColor}; transform: scale({scale});"
	onclick={handleClick}
>
	{#if icon}
		<Icon name={getAssetUrl(icon)} className="STYLESHIFT-Button-Icon" applyFilter={false} />
	{/if}
	<Description
		{name}
		{description}
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
		// background: white !important;

		.STYLESHIFT-Button-Text {
			// color: black !important;
			font-weight: 400;
		}
	}

	.STYLESHIFT-Button-Icon {
		height: 40px;
		margin-right: 10px;
		object-fit: contain;
	}

	.STYLESHIFT-Button-Text {
		display: flex;
		width: 100%;
	}
</style>
