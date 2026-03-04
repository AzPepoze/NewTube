<script lang="ts">
	import { onMount } from "svelte";
	import { logger } from "@/shared/logger";

	interface ChromeCommand {
		name: string;
		description: string;
		shortcut?: string;
	}

	let commands = $state<ChromeCommand[]>([]);

	onMount(() => {
		fetchCommands();
	});

	async function fetchCommands() {
		try {
			logger.info("shortcuts", "Fetching keyboard shortcuts");
			const response = await chrome.runtime.sendMessage({
				Command: "getCommands",
			});

			if (Array.isArray(response)) {
				commands = response.filter((cmd) => cmd.shortcut);
				logger.info("shortcuts", "Loaded commands:", commands);
			}
		} catch (e) {
			logger.error("shortcuts", "Failed to fetch commands:", e);
		}
	}
</script>

<div class="shortcuts-container">
	<div class="shortcuts-title">⌨️ Keyboard Shortcuts</div>
	{#if commands.length > 0}
		<div class="shortcuts-list">
			{#each commands as cmd (cmd.name)}
				<div class="shortcut-item">
					<span class="shortcut-desc">{cmd.description}</span>
					<span class="shortcut-key">{cmd.shortcut}</span>
				</div>
			{/each}
		</div>
	{:else}
		<div class="shortcuts-empty">No shortcuts configured</div>
	{/if}
</div>

<style lang="scss">
	.shortcuts-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 16px;
		background: rgba(255, 255, 255, 0.02);
		border-radius: 8px;
		width: 100%;
	}

	.shortcuts-title {
		font-size: 14px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.shortcuts-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.shortcut-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 6px;
		transition: all 0.2s ease;

		&:hover {
			background: rgba(255, 255, 255, 0.08);
			border-color: rgba(127, 93, 183, 0.3);
		}
	}

	.shortcut-desc {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.7);
		flex: 1;
	}

	.shortcut-key {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
			"Roboto Mono", "Courier New", monospace;
		font-size: 12px;
		font-weight: 700;
		background: rgba(127, 93, 183, 0.2);
		border: 1px solid rgba(127, 93, 183, 0.4);
		color: #b39dd9;
		padding: 4px 8px;
		border-radius: 4px;
		white-space: nowrap;
		margin-left: 12px;
	}

	.shortcuts-empty {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.4);
		text-align: center;
		padding: 20px;
	}
</style>
