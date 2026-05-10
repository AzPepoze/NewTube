<script lang="ts">
	import { logger } from "@/shared/logger";
	import { getAssetUrl } from "@ui/window/utils";
	import { onMount } from "svelte";

	let { src = "" } = $props();

	let canvas: HTMLCanvasElement | null = $state(null);
	let container: HTMLDivElement | null = $state(null);
	let observer: IntersectionObserver;
	let isVisible = $state(false);
	let isLoading = $state(false);
	let hasError = $state(false);

	function drawImage(url: string) {
		if (!url || !canvas) return;
		isLoading = true;
		hasError = false;

		const img = new Image();

		img.onload = () => {
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const maxWidth = 800;
			const maxHeight = 600;
			let width = img.width || 1;
			let height = img.height || 1;

			const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
			width = Math.floor(width * ratio);
			height = Math.floor(height * ratio);

			canvas.width = width;
			canvas.height = height;

			ctx.drawImage(img, 0, 0, width, height);
			isLoading = false;

			logger.debug(
				"ui",
				`Rendered preview: ${img.width}x${img.height} -> ${width}x${height}`,
			);
		};

		img.onerror = () => {
			isLoading = false;
			hasError = true;
			logger.warn("ui", "Failed to load image for preview:", url);
		};

		img.src = getAssetUrl(url);
	}

	$effect(() => {
		if (isVisible && src && canvas) {
			drawImage(src);
		}
	});

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					isVisible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.1 },
		);

		if (container) {
			observer.observe(container);
		}

		return () => {
			if (observer) observer.disconnect();
		};
	});
</script>

<div class="STYLESHIFT-Preview-Image-Container" bind:this={container}>
	{#if src}
		{#if !isVisible || isLoading}
			<div class="STYLESHIFT-Loading">Loading preview...</div>
		{/if}

		{#if hasError}
			<div class="STYLESHIFT-No-Image">Failed to load preview</div>
		{/if}

		<canvas
			bind:this={canvas}
			class="STYLESHIFT-Preview-Canvas"
			style:display={isVisible && !isLoading && !hasError
				? "block"
				: "none"}
		></canvas>
	{:else}
		<div class="STYLESHIFT-No-Image">No image selected</div>
	{/if}
</div>

<style lang="scss">
	.STYLESHIFT-Preview-Image-Container {
		width: fit-content;
		min-width: 200px;
		max-width: 100%;
		min-height: 100px;
		max-height: 600px;
		background: var(--bg-overlay-40);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 2px solid var(--fg-opacity-10);
		box-shadow:
			0 10px 30px var(--bg-overlay-50),
			0 0 0 1px var(--fg-opacity-05);
		transition: transform 0.3s;

		&:hover {
			border-color: var(--theme-0, #7f5db7);
		}
	}

	.STYLESHIFT-Preview-Canvas {
		max-width: 100%;
		max-height: 600px;
		object-fit: contain;
		display: block;
	}

	.STYLESHIFT-No-Image,
	.STYLESHIFT-Loading {
		font-size: 13px;
		opacity: 0.5;
		padding: 20px;
		text-align: center;
	}
</style>
