<script lang="ts">
	import type { Snippet } from "svelte";

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

	const textAlign = $derived.by(() => {
		switch (align) {
			case "left":
				return "start";
			case "center":
				return "center";
			case "right":
				return "end";
			default:
				return undefined;
		}
	});
</script>

<div
	class="STYLESHIFT-Main-Description"
	class:no-description={!description && !children && !text}
	style:text-align={textAlign}
	{style}
>
	{#if name}
		<div class="setting-name">{name}</div>
	{/if}
	{#if description}
		<div class="setting-description">{description}</div>
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

		&.no-description {
			justify-content: center;
		}
	}

	.setting-name {
		font-weight: 500;
		user-select: text;
	}

	.setting-description {
		font-size: 12px;
		opacity: 0.6;
		user-select: text;
	}
</style>
