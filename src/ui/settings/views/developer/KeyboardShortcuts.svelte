<script lang="ts">
	import { logger } from "@/shared/logger";
	import { IS_FIREFOX } from "@core/index";
	import { alertPrompt } from "@core/shared/dialogs";
	import { onMount } from "svelte";

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

	function splitKeys(shortcut: string): string[] {
		return shortcut.split("+").map((key) => key.trim());
	}

	function openEditor() {
		if (IS_FIREFOX) {
			alertPrompt({
				title: "Shortcuts Management",
				message: `Cannot open shortcut settings in Firefox.\nPlease navigate to "about:addons" manually to manage shortcuts.`,
			});
		} else {
			chrome.runtime.sendMessage({
				Command: "editCommands",
			});
		}
	}
</script>

<div class="shortcuts-container">
	<div class="shortcuts-header">
		<h3 class="shortcuts-title">Keyboard shortcuts</h3>
		<button type="button" class="edit-btn" onclick={openEditor}>Edit shortcuts</button>
	</div>
	{#if commands.length > 0}
		<div class="shortcuts-list">
			{#each commands as cmd (cmd.name)}
				<div class="shortcut-item">
					<span class="shortcut-desc">{cmd.description}</span>
					<span class="keys">
						{#each splitKeys(cmd.shortcut ?? "") as key (key)}
							<kbd>{key}</kbd>
						{/each}
					</span>
				</div>
			{/each}
		</div>
	{:else}
		<div class="shortcuts-empty">No shortcuts set. Use Edit shortcuts to add one.</div>
	{/if}
</div>

<style lang="scss">
	.shortcuts-container {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.shortcuts-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.shortcuts-title {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: var(--font-color);
	}

	.edit-btn {
		padding: 8px 16px;
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		color: var(--fg-opacity-100);
		background: var(--theme-0);
		border: 1px solid var(--theme-0-light);
		border-radius: 8px;
		box-shadow: 0 2px 8px var(--theme-0-30);
		cursor: pointer;
		transition:
			background 0.2s,
			box-shadow 0.2s;

		&:hover {
			background: var(--theme-0-light);
			box-shadow: 0 4px 12px var(--theme-0-50);
		}

		&:focus-visible {
			outline: 2px solid var(--theme-0-light);
			outline-offset: 2px;
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	.shortcuts-list {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--fg-opacity-08);
	}

	.shortcut-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 12px 4px;
		border-bottom: 1px solid var(--fg-opacity-08);
		transition: background 0.2s ease;

		&:hover {
			background: var(--fg-opacity-03);
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	.shortcut-desc {
		font-size: 14px;
		font-weight: 400;
		color: var(--fg-opacity-90);
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.keys {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}

	kbd {
		display: inline-block;
		min-width: 24px;
		padding: 3px 7px 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
		font-size: 12px;
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
		color: var(--fg-opacity-90);
		background: var(--fg-opacity-08);
		border: 1px solid var(--fg-opacity-15);
		border-bottom-width: 2px;
		border-radius: 6px;
		white-space: nowrap;
	}

	.shortcuts-empty {
		font-size: 13px;
		color: var(--fg-opacity-50);
		text-align: center;
		padding: 20px;
		border: 1px dashed var(--fg-opacity-15);
		border-radius: 12px;
	}
</style>
