<script lang="ts">
	import { onMount } from "svelte";
	let { category = "", skipAnimation = false } = $props();
	let titleEl: HTMLDivElement;

	let parts = $derived.by(() => {
		const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji})/u;
		const match = category.match(emojiRegex);
		if (match) {
			const icon = match[0];
			const text = category.slice(icon.length).trim();
			return { icon, text };
		}
		return { icon: "", text: category };
	});

	onMount(() => {
		if (titleEl && !skipAnimation) {
			// Trigger any legacy animation logic if needed,
			// or implement it here with Svelte transitions.
		}
	});
</script>

<div bind:this={titleEl} class="STYLESHIFT-Left-Category-Title">
	{#if parts.icon}
		<span class="STYLESHIFT-Left-Category-Icon">{parts.icon}</span>
	{/if}
	<div class="STYLESHIFT-Left-Category-Text">
		{parts.text}
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Left-Category-Title {
		display: flex;
		align-items: center;
		padding: 12px 15px;
		cursor: pointer;
		transition: all 0.2s;
		border-radius: 20px;
		gap: 12px;
		position: relative;
		margin-block: -10px;
		margin-left: 10px;
		color: var(--White-70);

		&:global([selected]) {
			background: white;
			margin-left: 0px;
			box-shadow: 0 4px 15px var(--Black-20);

			.STYLESHIFT-Left-Category-Icon {
				transform: scale(1.3) rotate(10deg);
				filter: drop-shadow(0 0 5px var(--Black-40));
			}

			.STYLESHIFT-Left-Category-Text {
				color: black;
				font-weight: 600;
			}
		}

		&:hover:not([selected]) {
			background: var(--White-10);
			color: white;
			margin-left: 0px;
			transform: translateX(4px);
		}

		&:active {
			scale: 0.95;
		}
	}

	.STYLESHIFT-Left-Category-Icon {
		font-size: 18px;
		transition: transform 0.3s ease;
		display: inline-block;
		filter: drop-shadow(0 0 5px var(--Black-20));
	}

	.STYLESHIFT-Left-Category-Text {
		font-weight: 500;
		font-size: 15px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
