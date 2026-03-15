<script lang="ts">
	import {
		getRootValue,
		persistCachedDataToStorage,
	} from "@/styleshift/core/storageManager";
	import {
		exportCurrentSettingsObject,
		importPresetToSettings,
	} from "@/styleshift/core/settingsImporter";
	import {
		saveTheme as saveThemeManager,
		applyTheme as applyThemeManager,
		deleteTheme as deleteThemeManager,
		type Theme,
	} from "@/styleshift/core/themeManager";
	import {
		chooseSelection,
		createNotification,
	} from "@/styleshift/shared/extension";
	import Icon from "@ui/settings/components/main/Icon.svelte";
	import { enterPrompt } from "@/styleshift/shared/extension";
	import {
		exportThemeToClipboard,
		exportThemeAsZip,
	} from "./themeExportService";
	import { openThemeStore } from "./themeManagerService";
	import { onMount } from "svelte";
	import ThemeCard from "./ThemeCard.svelte";

	let {
		closeWindow,
	}: {
		closeWindow?: () => void;
	} = $props();

	let themes = $state<Theme[]>([]);
	let activeThemeId = $state<string | null>(null);
	let loadingThemeId = $state<string | null>(null);
	let backupSettings = $state<any>(null);
	let originalActiveTheme = $state<string | null>(null);
	let wasThemeModified = $state(false);

	async function refreshActiveTheme() {
		activeThemeId = await getRootValue("activeTheme");
	}

	async function loadThemes() {
		const storedThemes = await getRootValue("themes");
		if (Array.isArray(storedThemes)) {
			themes = storedThemes;
		} else {
			themes = [];
		}

		const currentSettings = await getRootValue("currentSettings");
		backupSettings = JSON.parse(JSON.stringify(currentSettings));
		originalActiveTheme = await getRootValue("activeTheme");

		refreshActiveTheme();
	}

	async function saveCurrentAsTheme() {
		const name = await enterPrompt({
			title: "Save Current Theme",
			placeholder: "Enter theme name...",
		});

		if (!name || name.trim() === "") return;

		const currentSettings = await exportCurrentSettingsObject();

		const themeData: Partial<Theme> = {
			currentSettings,
		};

		const success = await saveThemeManager(
			name,
			themeData as Theme,
			"EXTENSION",
		);

		if (success) {
			await loadThemes();
			wasThemeModified = true;
		}
	}

	async function applyTheme(id: string) {
		const theme = themes.find((t) => t.themeId === id);
		if (!theme) return;

		const displayName = theme.themeName || id;

		loadingThemeId = id;
		activeThemeId = id;

		await applyThemeManager(id, displayName, "EXTENSION");
		await importPresetToSettings(
			$state.snapshot(theme),
			false,
			displayName,
		);

		wasThemeModified = true;
		loadingThemeId = null;
	}

	async function deleteTheme(id: string) {
		const theme = themes.find((t) => t.themeId === id);
		if (!theme) return;

		const displayName = theme.themeName || id;

		const success = await deleteThemeManager(
			id,
			displayName,
			"EXTENSION",
		);

		if (success) {
			themes = themes.filter((t) => t.themeId !== id);

			createNotification({
				icon: "delete",
				title: "Theme Deleted",
				content: `"${displayName}" removed from collection.`,
			});
		}
	}

	async function handleOk() {
		await persistCachedDataToStorage();
		closeWindow?.();
	}

	async function handleCancel() {
		if (wasThemeModified && backupSettings) {
			await importPresetToSettings(
				$state.snapshot(backupSettings),
				false,
				originalActiveTheme || "Previous Settings",
			);
		}
		closeWindow?.();
	}

	async function exportTheme(id: string) {
		const theme = themes.find((t) => t.themeId === id);
		if (!theme) return;

		const displayName = theme.themeName || id;

		const selection = await chooseSelection({
			title: `Export "${displayName}"`,
			message: "How would you like to export this theme?\n(Click outside to cancel)",
			buttons: [
				{ label: "Clipboard", color: "var(--Theme-0)" },
				{ label: "ZIP File", color: "var(--Theme-0)" },
			],
		});

		if (selection === "Clipboard") {
			exportThemeToClipboard(displayName, $state.snapshot(theme));
		} else if (selection === "ZIP File") {
			await exportThemeAsZip(displayName, $state.snapshot(theme));
		}
	}

	function getThemePreview(theme: Theme) {
		let bgColor =
			theme.currentSettings?.["MainThemeColor"] ||
			theme.currentSettings?.["MainThemeColorC"] ||
			"var(--Theme-0)";
		const bgImg = theme.currentSettings?.["BackgroundImageUrl"] || "";
		const themeId = theme.themeId || null;

		if (bgColor.startsWith("#") && bgColor.length > 7) {
			bgColor = bgColor.slice(0, 7);
		}

		return { bgColor, bgImg, themeId };
	}

	onMount(() => {
		loadThemes();

		let debounceTimer: any;
		const storageListener = (changes: any, area: string) => {
			if (area === "local") {
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => {
					refreshActiveTheme();
				}, 100);
			}
		};

		chrome.storage.onChanged.addListener(storageListener);
		return () => {
			clearTimeout(debounceTimer);
			chrome.storage.onChanged.removeListener(storageListener);
		};
	});
</script>

<div class="NEWTUBE-ThemeManager STYLESHIFT-Main">
	<div class="theme-grid" class:has-themes={themes.length > 0}>
		{#each themes as theme (theme.themeId)}
			{@const preview = getThemePreview(theme)}
			<ThemeCard
				id={theme.themeId}
				name={theme.themeName}
				{preview}
				themeId={theme.themeId}
				isActive={activeThemeId === theme.themeId}
				isLoading={loadingThemeId === theme.themeId}
				onApply={applyTheme}
				onExport={exportTheme}
				onDelete={deleteTheme}
			/>
		{/each}

		{#if themes.length === 0}
			<div class="empty-state">
				<div class="empty-icon">
					<Icon name="storefront" size={48} />
				</div>
				<p>Your theme collection is empty.</p>
				<p class="sub">Save your current setup to see it here!</p>
			</div>
		{/if}
	</div>

	<div class="floating-manager-footer">
		<div class="left-actions">
			<button
				class="minimal-footer-btn store"
				onclick={openThemeStore}
				title="Explore Themes"
			>
				<Icon name="storefront" size={16} />
				<span>Store</span>
			</button>
			<button
				class="minimal-footer-btn save"
				onclick={saveCurrentAsTheme}
				title="Save Current Theme"
			>
				<Icon name="save" size={16} />
				<span>Save</span>
			</button>
		</div>
		<div class="footer-divider"></div>
		<div class="right-actions">
			<button class="minimal-footer-btn ok" onclick={handleOk}>
				OK
			</button>
			<button class="minimal-footer-btn cancel" onclick={handleCancel}>
				Cancel
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	.NEWTUBE-ThemeManager {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 10px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		min-height: 400px;
		position: relative;
	}

	.theme-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
		padding-bottom: 80px;
		align-content: start;

		&.has-themes {
			flex: 1;
		}
	}

	.empty-state {
		grid-column: 1 / -1;
		padding: 60px 20px;
		text-align: center;
		color: var(--White-40);
		background: var(--White-02);
		border: 2px dashed var(--White-10);
		border-radius: 20px;

		.empty-icon {
			font-size: 48px;
			margin-bottom: 10px;
		}

		p {
			margin: 5px 0;
			font-size: 18px;
			font-weight: 500;
		}

		.sub {
			font-size: 14px;
			opacity: 0.7;
		}
	}

	.floating-manager-footer {
		position: absolute;
		bottom: 25px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		background: var(--BG-Dark);
		backdrop-filter: var(--Window-Blur);
		padding: 4px;
		border-radius: 40px;
		border: 1px solid var(--Border-Color);
		box-shadow: 0 15px 45px var(--Shadow-Color);
		z-index: 1000;
		width: fit-content;
		gap: 2px;

		.left-actions,
		.right-actions {
			display: flex;
			gap: 2px;
		}

		.footer-divider {
			width: 1px;
			height: 20px;
			background: var(--Border-Color);
			margin: 0 6px;
		}

		.minimal-footer-btn {
			display: flex;
			align-items: center;
			gap: 8px;
			height: 32px;
			padding: 0 14px;
			margin: 3px;
			border-radius: 30px;
			border: none;
			background: transparent;
			color: var(--Font-Color-Dim);
			font-family: inherit;
			font-size: 16px;
			font-weight: 500;
			cursor: pointer;
			transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
			white-space: nowrap;

			&:hover {
				background: var(--White-08);
				color: var(--Font-Color);
				transform: translateY(-1px);
			}

			&:active {
				transform: scale(0.96);
			}

			&.store {
				color: #a7ffff;
				&:hover {
					background: rgba(109, 245, 255, 0.15);
				}
			}

			&.save {
				color: var(--Theme-0-Light);
				&:hover {
					background: var(--Theme-0-15);
				}
			}

			&.ok {
				background: var(--Theme-0);
				color: white;
				padding: 0 18px;
				font-weight: 600;

				&:hover {
					filter: brightness(1.2);
					box-shadow: 0 4px 15px var(--Theme-0-30);
				}
			}

			&.cancel {
				padding: 0 12px;
				color: var(--Font-Color-Dim);
				&:hover {
					color: var(--Font-Color);
				}
			}

			:global(.STYLESHIFT-Icon) {
				margin: 0;
				opacity: 0.9;
			}
		}
	}
</style>
