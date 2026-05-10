<script lang="ts">
	import { createUniqueId } from "@/core/shared/utilities";
	import { getFromStorage } from "@core/storage/manager";
	import { triggerSettingUpdate } from "@settings/engine/functions";
	import type { Setting } from "@settings/types/styleshiftTypes";
	import Button from "@ui/settings/components/controls/Button.svelte";
	import Checkbox from "@ui/settings/components/controls/Checkbox.svelte";
	import Description from "@ui/settings/components/primitives/Description.svelte";
	import IconButton from "@ui/settings/components/primitives/IconButton.svelte";
	import TextEditor from "@ui/settings/components/primitives/TextEditor.svelte";
	import { setAndSave } from "@ui/settings/settingsApi";
	import { showUserConfirmation } from "@ui/window/windowFactory";

	type FontEntry = {
		id: string;
		fontName: string;
		importUrl: string;
		enabled: boolean;
	};

	let { setting }: { setting: Extract<Setting, { type: "custom" }> } = $props();

	let fonts = $state<FontEntry[]>([]);
	let pasteText = $state("");

	function extractFontsFromText(text: string): FontEntry[] {
		const found: FontEntry[] = [];
		const importRegex = /@import\s+url\(['"]?([^'"]+)['"]?\)/g;
		let match;

		while ((match = importRegex.exec(text)) !== null) {
			const urlStr = match[1];
			const names = extractFontNames(urlStr);
			for (const name of names) {
				found.push({
					id: createUniqueId(8),
					fontName: name,
					importUrl: urlStr,
					enabled: true,
				});
			}
		}

		if (found.length === 0 && text.trim().startsWith("http")) {
			const lines = text.trim().split(/\n+/);
			for (const line of lines) {
				const trimmed = line.trim();
				if (trimmed.startsWith("http")) {
					const names = extractFontNames(trimmed);
					for (const name of names) {
						found.push({
							id: createUniqueId(8),
							fontName: name,
							importUrl: trimmed,
							enabled: true,
						});
					}
				}
			}
		}
		return found;
	}

	function extractFontNames(urlStr: string): string[] {
		try {
			const url = new URL(urlStr);
			const families = url.searchParams.getAll("family");
			if (families.length > 0) {
				return families.map((f) => f.split(":")[0].replace(/\+/g, " "));
			}
		} catch (_e) {}
		return [];
	}

	async function handleAdd() {
		const newFonts = extractFontsFromText(pasteText);
		if (newFonts.length > 0) {
			fonts = [...fonts, ...newFonts];
			pasteText = "";
			await saveFonts();
		}
	}

	async function handleToggle(_id: string) {
		// The value is already updated via bind:value={font.enabled}
		await saveFonts();
	}

	async function handleRemove(id: string, name: string) {
		if (await showUserConfirmation(`Are you sure you want to remove the font "${name}"?`, "Remove Font")) {
			fonts = fonts.filter((f) => f.id !== id);
			await saveFonts();
		}
	}

	async function moveUp(index: number) {
		if (index === 0) return;
		const newFonts = [...fonts];
		[newFonts[index - 1], newFonts[index]] = [newFonts[index], newFonts[index - 1]];
		fonts = newFonts;
		await saveFonts();
	}

	async function moveDown(index: number) {
		if (index === fonts.length - 1) return;
		const newFonts = [...fonts];
		[newFonts[index], newFonts[index + 1]] = [newFonts[index + 1], newFonts[index]];
		fonts = newFonts;
		await saveFonts();
	}

	async function saveFonts() {
		const plainFonts = JSON.parse(JSON.stringify(fonts));
		await setAndSave(setting, plainFonts);
		triggerSettingUpdate(setting.id);
	}

	async function init() {
		const val = await getFromStorage(setting.id);
		if (Array.isArray(val)) {
			fonts = val;
		}
	}
	init();
</script>

<div class="NEWTUBE-FontManager">
	<!-- 1. Paste Section -->
	<div class="section paste-section">
		<Description name="Paste Section" description="Paste Google Fonts style or URL here." />
		<TextEditor bind:value={pasteText} />
		<div class="add-button-container">
			<Button
				setting={{
					type: "button",
					name: "Add Font",
					color: "#7f5db7",
					align: "center",
					clickFunction: handleAdd,
				}}
			/>
		</div>
	</div>

	<!-- 2. Manage Section -->
	<div class="section manage-section">
		<Description name="Manage Section" description="Enable, reorder, or delete fonts from your library." />
		{#if fonts.length > 0}
			<div class="font-list">
				{#each fonts as font, i (font.id)}
					<div class="font-item">
						<div class="sort-buttons">
							<IconButton icon="arrowUp" onClick={() => moveUp(i)} className="sort-btn" size={14} />
							<IconButton icon="arrowDown" onClick={() => moveDown(i)} className="sort-btn" size={14} />
						</div>
						<div class="font-info">
							<span class="name">{font.fontName}</span>
						</div>
						<div class="actions">
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
							<IconButton
								icon="delete"
								onClick={() => handleRemove(font.id, font.fontName)}
								className="delete-btn"
								size={20}
							/>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="empty-state">No fonts added yet.</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.NEWTUBE-FontManager {
		display: flex;
		flex-direction: column;
		gap: 30px;
		padding: 5px;
		width: 100%;
		box-sizing: border-box;

		:global(.styleshift-input-wrapper) {
			max-width: none !important;
		}
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.add-button-container {
		margin-top: 5px;
		:global(.styleshift-button) {
			padding: 12px !important;
		}
	}

	.font-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.font-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;
		background: var(--fg-opacity-05);
		border-radius: 15px;
		border: 1px solid var(--fg-opacity-10);
		transition: all 0.2s;
		gap: 15px;
	}

	.font-info {
		flex: 1;
		.name {
			font-size: 16px;
			font-weight: 600;
			color: white;
		}
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.sort-buttons {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-right: 5px;

		:global(.sort-btn) {
			padding: 4px !important;
			height: 24px !important;
			width: 32px !important;
			background: var(--fg-opacity-05);
			border: 1px solid var(--fg-opacity-10);
			border-radius: 6px;
			opacity: 0.8;

			&:hover {
				opacity: 1;
				background: var(--fg-opacity-10);
				border-color: var(--fg-opacity-20);
			}
		}
	}

	:global(.delete-btn) {
		padding: 6px !important;
		height: 36px !important;
		width: 36px !important;
		background: rgba(255, 0, 0, 0.1);
		border-radius: 10px;
		border: 1px solid rgba(255, 0, 0, 0.2);
		transition: all 0.2s;

		&:hover {
			background: rgba(255, 0, 0, 0.2);
			border-color: rgba(255, 0, 0, 0.4);
			transform: scale(1.1);
		}
	}

	.empty-state {
		padding: 20px;
		text-align: center;
		color: var(--fg-opacity-20);
		background: var(--fg-opacity-02);
		border: 1px dashed var(--fg-opacity-10);
		border-radius: 15px;
		font-style: italic;
	}

	:global(.styleshift-text-editor) {
		min-height: 100px !important;
	}
</style>
