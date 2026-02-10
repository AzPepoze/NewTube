<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { backOut } from "svelte/easing";
	import { apply_theme_to_element } from "../../theme";
	import { onMount } from "svelte";

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

	onMount(() => {
		mounted = true;
		if (overlayEl) {
			apply_theme_to_element(overlayEl);
		}
	});
</script>

{#if isOpen && mounted}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={overlayEl}
		class="STYLESHIFT-Modal-Overlay STYLESHIFT-Main"
		transition:fade={{ duration: 200 }}
		onclick={onClose}
	>
		<div
			class="STYLESHIFT-Modal-Content"
			style="width: {width};"
			transition:scale={{ duration: 300, start: 0.9, easing: backOut }}
			onclick={(e) => e.stopPropagation()}
		>
			{@render children()}
		</div>
	</div>
{/if}

<style lang="scss">
	.STYLESHIFT-Modal-Overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(5px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 20000;
	}

	.STYLESHIFT-Modal-Content {
		background: var(--Window-BG, var(--BG-Dark));
		backdrop-filter: var(--Window-Blur) var(--Window-Saturate);
		-webkit-backdrop-filter: var(--Window-Blur) var(--Window-Saturate);
		border: 1px solid var(--White-10);
		border-radius: 25px;
		padding: 30px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
	}
</style>
