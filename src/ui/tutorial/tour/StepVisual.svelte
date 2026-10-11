<script lang="ts">
	import type { ShortcutMap } from "../tutorialShortcuts";
	import { shortcutKeys } from "../tutorialShortcuts";
	import type { TutorialVisual } from "../tutorialSteps";

	let { visual, shortcuts }: { visual: TutorialVisual; shortcuts: ShortcutMap } = $props();
</script>

{#if visual.kind === "keys"}
	<ul class="keys">
		{#each visual.items as item (item.command)}
			{@const keys = shortcutKeys(shortcuts, item.command)}
			<li class="key-row">
				<span class="keycaps">
					{#if keys.length}
						{#each keys as key, keyIndex (keyIndex)}
							{#if keyIndex > 0}<span class="plus">+</span>{/if}
							<kbd>{key}</kbd>
						{/each}
					{:else}
						<span class="unset">Not set</span>
					{/if}
				</span>
				<span class="key-label">{item.label}</span>
			</li>
		{/each}
	</ul>
{:else if visual.kind === "flow"}
	<div class="flow">
		{#each visual.items as item, itemIndex (itemIndex)}
			{#if itemIndex > 0}<span class="arrow">→</span>{/if}
			<span class="chip">{item}</span>
		{/each}
	</div>
{:else}
	<div class="layout" aria-hidden="true">
		<div class="box search">Search</div>
		<div class="box sidebar">Sidebar</div>
		<div class="box main">Settings</div>
	</div>
{/if}

<style lang="scss">
	ul,
	li {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.keys {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.key-row {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 12px;
		color: var(--font-color-dim);
	}

	.keycaps {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-width: 120px;
	}

	kbd {
		min-width: 22px;
		padding: 2px 6px;
		border-radius: 6px;
		border: 1px solid var(--fg-opacity-15);
		border-bottom-width: 2px;
		background: var(--fg-opacity-05);
		font-family: inherit;
		font-size: 11px;
		font-weight: 700;
		text-align: center;
		color: var(--font-color);
	}

	.plus {
		font-size: 11px;
		color: var(--font-color-dim);
	}

	.unset {
		font-size: 11px;
		font-weight: 600;
		color: var(--font-color-dim);
		font-style: italic;
	}

	.key-label {
		font-weight: 600;
		color: var(--font-color);
	}

	.flow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}

	.chip {
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
		background: color-mix(in srgb, var(--accent) 16%, transparent);
		font-size: 12px;
		font-weight: 700;
		color: var(--font-color);
	}

	.arrow {
		font-size: 12px;
		color: var(--accent);
	}

	.layout {
		display: grid;
		grid-template-columns: 1fr 2.5fr;
		grid-template-rows: 28px 1fr;
		gap: 6px;
		height: 180px;
	}

	.box {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		border: 1px solid var(--fg-opacity-15);
		background: var(--fg-opacity-05);
		font-size: 11px;
		font-weight: 600;
		color: var(--font-color-dim);

		&.search {
			grid-column: 1 / -1;
			border-color: color-mix(in srgb, var(--accent) 60%, transparent);
			color: var(--font-color);
		}

		&.sidebar {
			border-color: color-mix(in srgb, var(--accent) 60%, transparent);
		}

		&.main {
			border-color: color-mix(in srgb, var(--accent) 60%, transparent);
		}
	}
</style>
