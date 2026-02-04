<script lang="ts">
	import { onMount } from "svelte";
	let {
		title,
		color = "#999999",
		children = undefined,
		collapsed = $bindable(true),
		onToggle = undefined,
	} = $props();

	let contentContainer: HTMLDivElement;

	onMount(() => {
		if (typeof children === "function" && contentContainer) {
			const result = children();
			if (result instanceof HTMLElement) {
				contentContainer.appendChild(result);
			}
		}
	});

	function handleToggle() {
		collapsed = !collapsed;
		onToggle?.(collapsed);
	}
</script>

<div class="STYLESHIFT-Dev-Card {collapsed ? 'collapsed' : ''}" style:--card-color={color}>
	<button class="STYLESHIFT-Dev-Card-Header" onclick={handleToggle}>
		<span class="STYLESHIFT-Dev-Card-Title">{title}</span>
		<div class="STYLESHIFT-Dev-Card-Chevrons">
			<span class="STYLESHIFT-Dev-Card-Chevron">{collapsed ? "▼" : "▲"}</span>
		</div>
	</button>

	<div bind:this={contentContainer} class="STYLESHIFT-Dev-Card-Content">
		{#if typeof children !== "function"}
			{@render children?.()}
		{/if}
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Dev-Card {
		width: 100%;
		border-radius: 12px;
		margin-bottom: 12px;
		overflow: hidden;
		background: var(--White-05);
		border: 1px solid var(--White-10);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		&.collapsed {
			.STYLESHIFT-Dev-Card-Content {
				max-height: 0;
				padding: 0;
				opacity: 0;
				pointer-events: none;
			}
		}

		&:not(.collapsed) {
			background: var(--White-08);
			border-color: var(--card-color);
			box-shadow: 0 4px 20px var(--Black-30);
		}
	}

	.STYLESHIFT-Dev-Card-Header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		font-weight: 600;
		font-size: 14px;
		letter-spacing: 0.5px;
		text-align: left;

		&:hover {
			background: var(--White-05);
		}
	}

	.STYLESHIFT-Dev-Card-Title {
		border-left: 3px solid var(--card-color);
		padding-left: 10px;
	}

	.STYLESHIFT-Dev-Card-Content {
		padding: 10px;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		gap: 12px;
		background: var(--Black-20);
	}

	.STYLESHIFT-Dev-Card-Chevron {
		font-size: 10px;
		opacity: 0.5;
	}
</style>
