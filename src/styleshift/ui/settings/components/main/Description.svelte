<script lang="ts">
	import type { Snippet } from "svelte";
	import Icon from "./Icon.svelte";
	import { getAssetUrl } from "@ui/utils";
	import { getTextAlign, getFlexAlign } from "../../utils";

	let {
		name = "",
		description = "",
		text = "",
		style = "",
		align = "",
		children,
	}: {
		name?: string;
		description?: string;
		text?: string;
		style?: string;
		align?: "left" | "center" | "right" | "";
		children?: Snippet;
	} = $props();

	const textAlign = $derived(getTextAlign(align));
	const flexAlign = $derived(getFlexAlign(align));
</script>

<div
	class="STYLESHIFT-Main-Description"
	class:no-description={!description && !children && !text}
	style:text-align={textAlign}
	style:align-items={flexAlign}
	{style}
>
	{#if name}
		<div class="setting-name" style:justify-content={flexAlign}>
			{#if name.includes(".svg") || name.includes("data:image/svg+xml") || name.startsWith("chrome-extension://")}
				<Icon
					name={getAssetUrl(name)}
					size={20}
					className="STYLESHIFT-Description-Icon"
					applyFilter={true}
				/>
			{:else}
				{name}
			{/if}
		</div>
	{/if}
	{#if description}
		<div class="setting-description">
			{description}
		</div>
	{/if}
	{#if text}
		{text}
	{/if}
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="scss">
	.STYLESHIFT-Main-Description {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		text-wrap: wrap;
		font-size: 17px;
		white-space: break-spaces;
		color: var(--Font-Color);

		&.no-description {
			justify-content: center;
		}
	}

	.setting-name {
		font-weight: 500;
		user-select: text;
		display: flex;
		align-items: center;

		:global(.STYLESHIFT-Description-Icon) {
			filter: brightness(0) invert(1);
		}
	}

	.setting-description {
		font-size: 12px;
		opacity: 0.6;
		user-select: text;
	}
</style>
