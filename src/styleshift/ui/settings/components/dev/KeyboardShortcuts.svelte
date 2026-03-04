<script lang="ts">
	import { onMount } from "svelte";
	import { logger } from "@/shared/logger";
	import Button from "../main/Button.svelte";
	import { IS_FIREFOX } from "@/styleshift/run";
	import { alertPrompt } from "@/styleshift/shared/extension";

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

<div class="shortcuts-container STYLESHIFT-Setting-Frame">
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
	<Button
		setting={{
			type: "button",
			name: "Edit Shortcuts",
			color: "#7f5db7",
			align: "center",
			clickFunction: () => {
				if (IS_FIREFOX) {
					alertPrompt({
						title: "Shortcuts Management",
						message: `Cannot open shortcut settings in Firefox.\nPlease navigate to "about:addons" manually to manage shortcuts.`,
					});
				} else {
					window.open("chrome://extensions/shortcuts", "_blank");
				}
			},
		}}
	/>
</div>

<style lang="scss">
	.shortcuts-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 16px;
		background: var(--White-02);
		border-radius: 8px;
	}

	.shortcuts-title {
		font-size: 14px;
		font-weight: 600;
		color: var(--White-90);
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
		gap: 12px;
		padding: 12px;
		background: var(--White-05);
		border: 1px solid var(--White-06);
		border-radius: 6px;
		transition: all 0.2s ease;
		overflow: hidden;
		box-sizing: border-box;

		&:hover {
			background: var(--White-08);
			border-color: var(--Theme-0-30);
		}
	}

	.shortcut-desc {
		font-size: 15px;
		font-weight: 700;
		color: var(--Font-Color);
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.shortcut-key {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
			"Roboto Mono", "Courier New", monospace;
		font-size: 12px;
		font-weight: 700;
		background: var(--Theme-0-20);
		border: 1px solid var(--Theme-0-40);
		color: var(--Theme-1);
		padding: 4px 8px;
		border-radius: 4px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.shortcuts-empty {
		font-size: 13px;
		color: var(--White-40);
		text-align: center;
		padding: 20px;
	}
</style>
