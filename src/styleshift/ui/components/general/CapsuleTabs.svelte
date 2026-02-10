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
	// Using percentage of the container's internal width for the slide
	const slideTransform = $derived(`translateX(${activeIndex * 100}%)`);
</script>

<div
	class="STYLESHIFT-Capsule-Toggle {className}"
	style:--options-count={options.length}
	{style}
>
	{#if options.length > 0}
		<div
			class="capsule-slide"
			style:transform={slideTransform}
		></div>
		{#each options as option (option.id)}
			<button
				class="capsule-button"
				class:active={activeId === option.id}
				onclick={() => (activeId = option.id)}
				type="button"
			>
				{#if option.icon}
					<div class="icon-wrapper">
						<Icon name={option.icon} size={14} />
					</div>
				{/if}
				<span class="label">{option.label}</span>
			</button>
		{/each}
	{/if}
</div>

<style lang="scss">
	.STYLESHIFT-Capsule-Toggle {
		display: grid;
		grid-template-columns: repeat(var(--options-count), 1fr);
		background: var(--BG-Surface);
		padding: 3px;
		border-radius: 100px;
		position: relative;
		border: 1px solid var(--Border-Color);
		width: fit-content;
		min-width: 180px;
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
		width: calc((100% - 6px) / var(--options-count)) !important;
	}

	.capsule-button {
		position: relative;
		z-index: 2;
		background: transparent;
		border: none;
		color: var(--Font-Color-Dim);
		font-size: 12px;
		font-weight: 700;
		padding: 8px 16px;
		border-radius: 100px;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		line-height: 1;
		white-space: nowrap;

		&:hover:not(.active) {
			color: var(--Font-Color);
			background: var(--White-05);
		}

		&.active {
			color: white;
		}

		.icon-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.label {
			flex-shrink: 0;
		}
	}
</style>
