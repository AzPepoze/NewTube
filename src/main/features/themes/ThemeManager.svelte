<script lang="ts">
	import { getRootValue, saveRootValue, persistCachedDataToStorage } from "@/styleshift/core/storageManager";
	import { exportCurrentSettingsObject, importPresetToSettings } from "@/styleshift/core/presetManager";
	import { showUserConfirmation } from "@ui/extension";
	import { chooseSelection, createNotification } from "@/styleshift/shared/extension";
	import Icon from "@ui/settings/components/main/Icon.svelte";
	import { enterPrompt } from "@/styleshift/shared/extension";
	import { exportThemeToClipboard, exportThemeAsZip } from "./themeExportService";
	import Button from "@ui/settings/components/main/Button.svelte";
	import { onMount } from "svelte";
	import ThemeCard from "./ThemeCard.svelte";

	let {
		closeWindow,
	}: {
		closeWindow?: () => void;
	} = $props();

	type ThemeLibrary = Record<string, any>;

	let themes = $state<ThemeLibrary>({});
	let themeNames = $derived(Object.keys(themes));
	let activeThemeName = $state<string | null>(null);
	let loadingThemeName = $state<string | null>(null);
	let backupSettings = $state<any>(null);
	let originalActiveTheme = $state<string | null>(null);
	let wasThemeModified = $state(false);

	async function refreshActiveTheme() {
		activeThemeName = await getRootValue("ActiveTheme");
	}

	async function loadThemes() {
		const storedThemes = await getRootValue("Themes");
		if (storedThemes && typeof storedThemes === "object") {
			themes = storedThemes;
		}

		// Backup current settings for "Cancel" functionality
		const currentSettings = await getRootValue("currentSettings");
		backupSettings = JSON.parse(JSON.stringify(currentSettings));
		originalActiveTheme = await getRootValue("ActiveTheme");

		refreshActiveTheme();
	}

	async function saveCurrentAsTheme() {
		const name = await enterPrompt({
			title: "Save Current Theme",
			placeholder: "Enter theme name...",
		});

		if (!name || name.trim() === "") return;

		const currentSettings = await exportCurrentSettingsObject();
		const updatedThemes = { ...themes, [name]: currentSettings };

		await saveRootValue("Themes", $state.snapshot(updatedThemes), true);
		await saveRootValue("ActiveTheme", name);
		themes = updatedThemes;
		activeThemeName = name;
		wasThemeModified = true;

		createNotification({
			icon: "✨",
			title: "Theme Saved",
			content: `"${name}" has been added to your collection.`,
		});
	}

	async function applyTheme(name: string) {
		const themeData = themes[name];
		if (!themeData) return;

		loadingThemeName = name;
		activeThemeName = name; // Instant feedback

		// Apply without saving to disk for instant preview
		await importPresetToSettings($state.snapshot(themeData), false, name);
		wasThemeModified = true;

		loadingThemeName = null;
	}

	async function deleteTheme(name: string) {
		if (await showUserConfirmation(`Are you sure you want to delete "${name}"?`, "Delete Theme")) {
			const updatedThemes = { ...themes };
			delete updatedThemes[name];

			await saveRootValue("Themes", $state.snapshot(updatedThemes));
			themes = updatedThemes;

			createNotification({
				icon: "🗑️",
				title: "Theme Deleted",
				content: `"${name}" removed from collection.`,
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
	async function exportTheme(name: string) {
		const themeData = themes[name];
		if (!themeData) return;

		const selection = await chooseSelection({
			title: `Export "${name}"`,
			message: "How would you like to export this theme?\n(Click outside to cancel)",
			buttons: [
				{ label: "Clipboard", color: "var(--Theme-0)" },
				{ label: "ZIP File", color: "var(--Theme-0)" },
			],
		});

		if (selection === "Clipboard") {
			exportThemeToClipboard(name, $state.snapshot(themeData));
		} else if (selection === "ZIP File") {
			await exportThemeAsZip(name, $state.snapshot(themeData));
		}
	}

	function getThemePreview(themeData: any) {
		let bgColor = themeData["MainThemeColor"] || themeData["MainThemeColorC"] || "var(--Theme-0)";
		const bgImg = themeData["BackgroundImageUrl"] || "";

		// Ensure hex color doesn't have double alpha when appending
		if (bgColor.startsWith("#") && bgColor.length > 7) {
			bgColor = bgColor.slice(0, 7);
		}

		return { bgColor, bgImg };
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

<div class="NEWTUBE-ThemeManager">
	<div class="theme-grid" class:has-themes={themeNames.length > 0}>
		{#each themeNames as name (name)}
			{@const preview = getThemePreview(themes[name])}
			<ThemeCard
				{name}
				{preview}
				isActive={activeThemeName === name}
				isLoading={loadingThemeName === name}
				onApply={applyTheme}
				onExport={exportTheme}
				onDelete={deleteTheme}
			/>
		{/each}

		{#if themeNames.length === 0}
			<div class="empty-state">
				<div class="empty-icon">🛍️</div>
				<p>Your theme collection is empty.</p>
				<p class="sub">Save your current setup to see it here!</p>
			</div>
		{/if}
	</div>

	<!-- Floating Action Button for Saving -->
	<button class="fab-save-btn" onclick={saveCurrentAsTheme} title="Save Current Settings">
		<Icon name="save" size={20} />
	</button>

	<!-- Floating Footer for OK/Cancel -->
	<div class="floating-manager-footer">
		<Button
			setting={{
				type: "button",
				name: "OK",
				color: "var(--Theme-0)",
				clickFunction: handleOk,
			}}
		/>
		<Button
			setting={{
				type: "button",
				name: "Cancel",
				color: "var(--White-20, #646464)",
				clickFunction: handleCancel,
			} as any}
		/>
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
		padding-bottom: 80px; /* Space for the floating footer */
		align-content: start;

		/* If we have themes, don't shrink */
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

	.fab-save-btn {
		position: absolute;
		bottom: 25px;
		right: 25px;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: var(--Theme-0, #7f5db7);
		color: white;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bounce effect */
		z-index: 100;

		&:hover {
			transform: scale(1.15) translateY(-5px);
			box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
			filter: brightness(1.2);
		}

		&:active {
			transform: scale(0.95);
		}
	}

	.floating-manager-footer {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 15px;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(15px);
		padding: 12px 20px;
		border-radius: 30px;
		border: 1px solid var(--White-10);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		z-index: 90;
		width: 300px;

		:global(.STYLESHIFT-Button) {
			flex: 1;
			margin: 0 !important;

			:global(button) {
				border-radius: 20px !important;
				padding: 8px 0 !important;
				min-height: 36px !important;
			}
		}
	}
</style>
