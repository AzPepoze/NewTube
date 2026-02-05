<script lang="ts">
	import { onMount } from "svelte";
	import { getAssetUrl } from "@ui/utils";

	let { src = "" } = $props();

	let canvas: HTMLCanvasElement | null = $state(null);
	let container: HTMLDivElement | null = $state(null);
	let observer: IntersectionObserver;
	let isVisible = $state(false);
	let isLoading = $state(false);

	function drawImage(url: string) {
		if (!url || !canvas) return;
		isLoading = true;

		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			// Clear previous content
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Calculate size
			const maxWidth = 500;
			const maxHeight = 400;
			let width = img.width || 1;
			let height = img.height || 1;

			if (width > maxWidth) {
				height = (maxWidth / width) * height;
				width = maxWidth;
			}
			if (height > maxHeight) {
				width = (maxHeight / height) * width;
				height = maxHeight;
			}

			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(img, 0, 0, width, height);
			isLoading = false;
		};
		img.onerror = () => {
			isLoading = false;
			console.warn("Failed to load image for preview:", url);
			// Optionally clear canvas or show error
		};
		img.src = getAssetUrl(url);
	}

	$effect(() => {
		if (isVisible && src) {
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
		<canvas
			bind:this={canvas}
			class="STYLESHIFT-Preview-Canvas"
			style:display={isVisible && !isLoading ? "block" : "none"}
		></canvas>
	{:else}
		<div class="STYLESHIFT-No-Image">No image selected</div>
	{/if}
</div>

<style lang="scss">
	.STYLESHIFT-Preview-Image-Container {
		width: fit-content;
		max-width: 100%;
		min-height: 50px;
		max-height: 400px;
		background: var(--Black-40);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 2px solid var(--White-10);
		box-shadow:
			0 10px 30px var(--Black-50),
			0 0 0 1px var(--White-05);
		transition: transform 0.3s;

		&:hover {
			border-color: var(--Theme-0, #7f5db7);
		}
	}

	.STYLESHIFT-Preview-Canvas {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.STYLESHIFT-No-Image,
	.STYLESHIFT-Loading {
		font-size: 13px;
		opacity: 0.5;
		padding: 20px;
	}
</style>
