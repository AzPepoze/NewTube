<script lang="ts">
	import { applyThemeToElement } from "@ui/themes/theme";
	import { onMount } from "svelte";
	import { backdropFade, holdOpen, modalPop } from "../modalTransition";

	let {
		children,
		onClose,
		width = "400px",
		isOpen = true,
	}: {
		children: any;
		onClose: () => void;
		width?: string;
		isOpen?: boolean;
	} = $props();

	let mounted = $state(false);
	let overlayEl = $state<HTMLElement | null>(null);
	let backdropBlur = $state(true);

	// Rendering after mount lets Svelte play the intro transitions.
	onMount(() => {
		mounted = true;
	});

	$effect(() => {
		const el = overlayEl;
		if (!el) return;

		let cancelled = false;
		(async () => {
			await applyThemeToElement(el);
			if (cancelled) return;

			const amount = parseFloat(getComputedStyle(el).getPropertyValue("--modal-blur")) || 0;
			// A fullscreen window already blurs the page behind it, so a second full-viewport
			// blur would only cost frames without changing what you see.
			backdropBlur = amount > 0 && !document.querySelector(".styleshift-window-container.fullscreen");
		})();

		return () => {
			cancelled = true;
		};
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Escape" && isOpen) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen && mounted}
	<div
		bind:this={overlayEl}
		class="styleshift-modal-overlay styleshift-main"
		transition:holdOpen
		onclick={onClose}
		onkeydown={handleKeyDown}
		role="button"
		tabindex="-1"
	>
		<div class="styleshift-modal-backdrop" class:no-blur={!backdropBlur} transition:backdropFade></div>
		<div
			class="styleshift-modal-content"
			style="width: {width};"
			transition:modalPop
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			{@render children()}
		</div>
	</div>
{/if}

<style lang="scss">
	.styleshift-modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000000;
	}

	.styleshift-modal-backdrop {
		position: absolute;
		inset: 0;
		background: var(--bg-overlay-20);
		backdrop-filter: blur(var(--modal-blur));
		-webkit-backdrop-filter: blur(var(--modal-blur));
		will-change: opacity;

		&.no-blur {
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
		}
	}

	.styleshift-modal-content {
		position: relative;
		z-index: 1;
		background: var(--window-bg);
		backdrop-filter: var(--window-blur);
		-webkit-backdrop-filter: var(--window-blur);
		border: 1px solid var(--fg-opacity-10);
		border-radius: 25px;
		padding: 30px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		box-shadow: 0 20px 50px var(--shadow-color);
		overflow: visible;
	}
</style>
