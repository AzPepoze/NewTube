<script lang="ts">
	import type { Setting } from "@settings/types/styleshiftTypes";
	import Button from "@controls/Button.svelte";
	import Checkbox from "@controls/Checkbox.svelte";
	import IconButton from "@base/IconButton.svelte";
	import TextEditor from "@base/TextEditor.svelte";
	import { showUserConfirmation } from "@ui/window/windowFactory";
	import {
		detectPageFonts,
		extractFontsFromText,
		loadFonts,
		moveFont,
		saveFonts,
		type FontEntry,
	} from "../fontService";

	let { setting }: { setting: Extract<Setting, { type: "custom" }> } = $props();

	const PREVIEW_TEXT = "Pack my box with five dozen liquor jugs";

	let fonts = $state<FontEntry[]>([]);
	let pasteText = $state("");

	async function handleAdd() {
		const newFonts = extractFontsFromText(pasteText);
		if (newFonts.length > 0) {
			fonts = [...fonts, ...newFonts];
			pasteText = "";
			await saveFonts(setting, fonts);
		}
	}

	async function handleDetectPageFonts() {
		const newDetected = detectPageFonts(fonts);
		if (newDetected.length > 0) {
			fonts = [...fonts, ...newDetected];
			await saveFonts(setting, fonts);
		}
	}

	async function handleToggle(_id: string) {
		await saveFonts(setting, fonts);
	}

	async function handleRemove(id: string, name: string) {
		const target = fonts.find((f) => f.id === id);
		if (target?.isDefault) return;

		if (await showUserConfirmation(`Are you sure you want to remove the font "${name}"?`, "Remove Font")) {
			fonts = fonts.filter((f) => f.id !== id);
			await saveFonts(setting, fonts);
		}
	}

	async function handleMove(index: number, direction: "up" | "down") {
		fonts = moveFont(fonts, index, direction);
		await saveFonts(setting, fonts);
	}

	// Position among enabled fonts, which is the order the page uses as its fallback stack.
	function getLoadOrder(list: FontEntry[], index: number): number {
		return list.slice(0, index).filter((font) => font.enabled).length + 1;
	}

	function getPreviewFamily(font: FontEntry): string | undefined {
		return font.isDefault ? undefined : `"${font.fontName}", system-ui`;
	}

	async function init() {
		fonts = await loadFonts(setting.id);
		await handleDetectPageFonts();
	}
	init();
</script>

<div class="NEWTUBE-FontManager">
	<div class="add-bar">
		<p class="helper">Paste a Google Fonts link or @import.</p>
		<TextEditor
			bind:value={pasteText}
			placeholder="@import url(https://fonts.googleapis.com/css2?family=Roboto&display=swap);"
		/>
		<div class="add-actions">
			<Button
				setting={{
					type: "button",
					name: "Add font",
					color: "#7f5db7",
					align: "center",
					clickFunction: handleAdd,
				}}
			/>
			<button type="button" class="text-action" onclick={handleDetectPageFonts}>Detect page fonts</button>
		</div>
	</div>

	{#if fonts.length > 0}
		<div class="font-list">
			{#each fonts as font, i (font.id)}
				<div class="font-item" class:is-default={font.isDefault} class:is-enabled={font.enabled}>
					<div class="reorder">
						<IconButton icon="arrowUp" onClick={() => handleMove(i, "up")} className="sort-btn" size={14} />
						<IconButton icon="arrowDown" onClick={() => handleMove(i, "down")} className="sort-btn" size={14} />
					</div>
					<div class="font-info">
						<div class="name-row">
							<span class="name">{font.fontName}</span>
							{#if font.isDefault}
								<span class="default-badge">Built-in</span>
							{/if}
						</div>
						<span class="sample" style:font-family={getPreviewFamily(font)}>{PREVIEW_TEXT}</span>
					</div>
					<div class="actions">
						{#if font.enabled}
							<span class="order" title="Load order">{getLoadOrder(fonts, i)}</span>
						{/if}
						{#if !font.isDefault}
							<div class="delete-slot">
								<IconButton
									icon="delete"
									onClick={() => handleRemove(font.id, font.fontName)}
									className="delete-btn"
									size={20}
								/>
							</div>
						{/if}
						<Checkbox
							setting={{
								type: "checkbox",
								id: "", // Empty ID to use bind:value and avoid global storage
								name: "",
								value: font.enabled,
								updateFunction: () => handleToggle(font.id),
							}}
							bind:value={font.enabled}
						/>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-state">No fonts yet. Add one above.</div>
	{/if}
</div>

<style lang="scss">
	.NEWTUBE-FontManager {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 5px;
		width: 100%;
		box-sizing: border-box;

		:global(.styleshift-input-wrapper) {
			max-width: none !important;
		}
	}

	.add-bar {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 16px;
		background: var(--fg-opacity-03);
		border: 1px solid var(--fg-opacity-08);
		border-radius: 14px;
	}

	.helper {
		margin: 0;
		font-size: 13px;
		color: var(--fg-opacity-60);
	}

	.add-actions {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;

		:global(.styleshift-button) {
			padding: 10px 18px !important;
		}
	}

	.text-action {
		background: none;
		border: none;
		padding: 6px 2px;
		font: inherit;
		font-size: 13px;
		color: var(--theme-0-text);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;

		&:focus-visible {
			outline: 2px solid var(--theme-0-light);
			outline-offset: 2px;
			border-radius: 4px;
		}
	}

	.font-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.font-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 16px;
		background: var(--setting-frame-bg);
		border: 1px solid var(--fg-opacity-08);
		border-radius: 12px;
		transition:
			background 0.2s,
			border-color 0.2s;

		&:hover {
			background: var(--fg-opacity-05);
		}

		&.is-enabled {
			box-shadow: inset 3px 0 0 var(--theme-0);
		}

		&:focus-within {
			border-color: var(--theme-0-30);
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	.reorder {
		display: flex;
		flex-direction: column;
		gap: 4px;
		opacity: 0.6;
		transition: opacity 0.2s;

		.font-item:hover &,
		.font-item:focus-within & {
			opacity: 1;
		}

		:global(.sort-btn) {
			padding: 2px !important;
			height: 22px !important;
			width: 28px !important;
			background: transparent;
			border: 1px solid var(--fg-opacity-10);
			border-radius: 6px;
		}
	}

	.font-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
		min-width: 0;
	}

	.name-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.name {
		font-size: 18px;
		font-weight: 600;
		color: var(--fg-opacity-100);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sample {
		font-size: 14px;
		color: var(--fg-opacity-60);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.default-badge {
		font-size: 11px;
		font-weight: 500;
		padding: 2px 8px;
		background: var(--fg-opacity-08);
		border-radius: 10px;
		color: var(--fg-opacity-70);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-shrink: 0;
	}

	.order {
		min-width: 24px;
		text-align: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
		font-size: 12px;
		font-weight: 700;
		color: var(--theme-1);
	}

	.delete-slot {
		display: flex;
		width: 0;
		overflow: hidden;
		flex-shrink: 0;
		transition: width 0.2s;

		.font-item:hover &,
		.font-item:focus-within & {
			width: 32px;
		}

		@media (hover: none) {
			width: 32px;
		}

		:global(.delete-btn) {
			padding: 6px !important;
			height: 32px !important;
			width: 32px !important;
			flex-shrink: 0;
			background: transparent;
			border: 1px solid transparent;
			border-radius: 8px;

			&:hover {
				background: rgba(255, 0, 0, 0.15);
				border-color: rgba(255, 0, 0, 0.3);
			}
		}

		:global(button:focus-visible) {
			outline-offset: -2px;
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	.font-item :global(button:focus-visible) {
		outline: 2px solid var(--theme-0-light);
		outline-offset: 2px;
	}

	.empty-state {
		padding: 24px;
		text-align: center;
		font-size: 14px;
		color: var(--fg-opacity-50);
		border: 1px dashed var(--fg-opacity-15);
		border-radius: 12px;
	}

	:global(.styleshift-text-editor) {
		min-height: 44px !important;
		transition: min-height 0.2s;
	}

	.add-bar:focus-within :global(.styleshift-text-editor) {
		min-height: 96px !important;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.styleshift-text-editor),
		.reorder {
			transition: none;
		}
	}
</style>
