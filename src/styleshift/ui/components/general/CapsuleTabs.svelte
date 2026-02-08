<script lang="ts">
	interface TabOption {
		id: string;
		label: string;
		icon?: string;
	}

	import Icon from "../../settings/components/main/Icon.svelte";

	let {
		options = [] as TabOption[],
		activeId = $bindable(""),
		className = "",
		style = "",
	} = $props();

	const activeIndex = $derived(options.findIndex((opt) => opt.id === activeId));
	// Calculate the width of a single tab area (total width minus container padding divided by count)
	// We use percentage for width and translate to keep it responsive
	const slideWidth = $derived(options.length > 0 ? 100 / options.length : 0);
	const slideTransform = $derived(`translateX(${activeIndex * 100}%)`);
</script>

<div class="STYLESHIFT-Capsule-Toggle {className}" {style}>
	{#if options.length > 0}
		<div
			class="capsule-slide"
			style:width="calc((100% - 6px) / {options.length})"
			style:transform={slideTransform}
		></div>
		{#each options as option}
			<button
				class="capsule-button"
				class:active={activeId === option.id}
				onclick={() => (activeId = option.id)}
				type="button"
			>
				{#if option.icon}
					<Icon name={option.icon} size={14} />
				{/if}
				<span>{option.label}</span>
			</button>
		{/each}
	{/if}
</div>

<style lang="scss">
	.STYLESHIFT-Capsule-Toggle {
		display: flex;
		align-items: center;
		background: var(--BG-Surface);
		padding: 3px;
		border-radius: 100px;
		position: relative;
		border: 1px solid var(--Border-Color);
		width: fit-content;
		min-width: 160px; // Ensure a reasonable base size
	}

	.capsule-slide {
		position: absolute;
		top: 3px;
		left: 3px;
		height: calc(100% - 6px);
		background: var(--Theme-0);
		border-radius: 100px;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1;
		border: 1px solid var(--Border-Color);
		box-shadow: 0 2px 8px var(--Shadow-Color);
	}

	.capsule-button {
		position: relative;
		z-index: 2;
		background: transparent;
		border: none;
		color: var(--Font-Color-Dim);
		font-size: 12px;
		font-weight: 700;
		padding: 8px 20px;
		border-radius: 100px;
		cursor: pointer;
		transition: color 0.3s;
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap; // Explicitly prevent wrapping
		align-items: center;
		justify-content: center;
		gap: 8px;
		line-height: 1;

		&.active {
			color: white;
		}

		&:hover:not(.active) {
			color: var(--Font-Color);
		}

		span {
			white-space: nowrap;
			flex-shrink: 0;
		}
	}
</style>
