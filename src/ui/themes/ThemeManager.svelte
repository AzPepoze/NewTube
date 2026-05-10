<script lang="ts">
	import { enterPrompt } from "@core/shared/dialogs";
	import { createNotification } from "@core/shared/notifications";
	import {
		getRootValue,
		persistCachedDataToStorage,
	} from "@core/storage/manager";
	import {
		exportThemeWithSelection,
		importThemeZipWithWorkflow,
	} from "@core/theme/exporter";
	import {
		exportCurrentSettingsObject,
		importPresetToSettings,
	} from "@core/theme/importer";
	import {
		applyTheme as applyThemeManager,
		deleteTheme as deleteThemeManager,
		saveTheme as saveThemeManager,
		type Theme,
	} from "@core/theme/manager";
	import { openThemeStore } from "@core/theme/storeIntegration";
	import { NEWTUBE_STORE_API_URL } from "@extensions/youtube/constants";
	import Icon from "@ui/settings/components/primitives/Icon.svelte";
	import Search from "@ui/settings/components/primitives/Search.svelte";
	import CapsuleTabs from "@ui/window/components/CapsuleTabs.svelte";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
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

	let currentView = $state<"installed" | "store">("installed");
	let storeThemes = $state<Theme[]>([]);
	let isLoadingStore = $state(false);
	let searchQuery = $state("");

	let filteredLocalThemes = $derived.by(() => {
		if (!searchQuery) return themes;
		const query = searchQuery.toLowerCase();
		return themes.filter((t) => t.themeName.toLowerCase().includes(query));
	});

	const tabOptions = [
		{ id: "installed", label: "Installed", icon: "folder_open" },
		{ id: "store", label: "Store", icon: "storefront" },
	];

	$effect(() => {
		if (currentView === "store") {
			const debounceTimer = setTimeout(() => {
				fetchStoreThemes(searchQuery);
			}, 300);
			return () => clearTimeout(debounceTimer);
		}
	});

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

	async function fetchStoreThemes(query: string = "") {
		isLoadingStore = true;
		try {
			const res = await fetch(
				`${NEWTUBE_STORE_API_URL}/themes?q=${encodeURIComponent(query)}&sort=popular`,
			);
			if (res.ok) {
				const data = await res.json();
				storeThemes = data.map((t: any) => ({
					themeId: t.themeId,
					themeName: t.themeName,
					currentSettings: t.settings?.currentSettings,
					addOnStyleShiftItems: t.settings?.addOnStyleShiftItems,
				}));
			}
		} catch (e) {
			console.error("Failed to fetch store themes", e);
		} finally {
			isLoadingStore = false;
		}
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

	async function handleImportThemeZip() {
		await importThemeZipWithWorkflow();
		await loadThemes();
	}

	async function applyTheme(id: string) {
		const theme = (currentView === "installed" ? themes : storeThemes).find(
			(t) => t.themeId === id,
		);
		if (!theme) return;

		const displayName = theme.themeName || id;

		if (currentView === "store") {
			loadingThemeId = id;
			const success = await saveThemeManager(
				displayName,
				$state.snapshot(theme),
				"EXTENSION",
				theme.themeId,
			);
			if (success) {
				await loadThemes();
				currentView = "installed";
				createNotification({
					icon: "download_done",
					title: "Theme Installed",
					content: `"${displayName}" added to your collection.`,
				});
			}
			loadingThemeId = null;
		}

		loadingThemeId = id;
		const success = await applyThemeManager(id, displayName, "EXTENSION");

		if (success) {
			activeThemeId = id;
			wasThemeModified = true;
		}

		loadingThemeId = null;
	}

	async function saveStoreTheme(id: string) {
		const theme = storeThemes.find((t) => t.themeId === id);
		if (!theme) return;

		const displayName = theme.themeName || id;

		loadingThemeId = id;
		const success = await saveThemeManager(
			displayName,
			$state.snapshot(theme),
			"EXTENSION",
			theme.themeId, // Pass UUID from store
		);
		if (success) {
			await loadThemes();
			createNotification({
				icon: "save",
				title: "Theme Saved",
				content: `"${displayName}" added to your collection.`,
			});
		}
		loadingThemeId = null;
	}

	async function deleteTheme(id: string) {
		const theme = themes.find((t) => t.themeId === id);
		if (!theme) return;

		const displayName = theme.themeName || id;

		const success = await deleteThemeManager(id, displayName, "EXTENSION");

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

		await exportThemeWithSelection(
			theme.themeId,
			theme.themeName,
			$state.snapshot(theme),
		);
	}

	function getThemePreview(theme: Theme) {
		let bgColor =
			theme.currentSettings?.["MainThemeColor"] ||
			theme.currentSettings?.["MainThemeColorC"] ||
			"var(--theme-0)";
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

<div class="NEWTUBE-ThemeManager styleshift-main">
	<div class="manager-topbar">
		<CapsuleTabs options={tabOptions} bind:activeId={currentView} />
		<div class="search-flex-filler">
			<Search
				bind:value={searchQuery}
				placeholder="Search {currentView === 'installed'
					? 'installed themes'
					: 'store themes'}..."
			/>
		</div>
	</div>

	<div
		class="theme-grid"
		class:has-themes={(currentView === "installed"
			? filteredLocalThemes
			: storeThemes
		).length > 0}
	>
		{#key currentView}
			<div
				class="view-container"
				in:fly={{ y: 20, duration: 400, delay: 200 }}
				out:fade={{ duration: 200 }}
			>
				{#if currentView === "installed"}
					{#each filteredLocalThemes as theme, i (theme.themeId)}
						{@const preview = getThemePreview(theme)}
						<ThemeCard
							id={theme.themeId}
							name={theme.themeName}
							{preview}
							themeId={theme.themeId}
							isActive={activeThemeId === theme.themeId}
							isLoading={loadingThemeId === theme.themeId}
							animationDelay={i * 50}
							onApply={applyTheme}
							onExport={exportTheme}
							onDelete={deleteTheme}
						/>
					{/each}

					{#if themes.length === 0}
						<div class="empty-state">
							<div class="empty-icon">
								<Icon name="palette" size={48} />
							</div>
							<p>Your theme collection is empty.</p>
							<p class="sub">
								Save your current setup to see it here!
							</p>
						</div>
					{/if}
				{:else}
					{#each storeThemes as theme, i (theme.themeId)}
						{@const preview = getThemePreview(theme)}
						{@const isInstalled = themes.some(
							(t) => t.themeId === theme.themeId,
						)}
						<ThemeCard
							id={theme.themeId}
							name={theme.themeName}
							{preview}
							themeId={theme.themeId}
							isActive={activeThemeId === theme.themeId}
							isLoading={loadingThemeId === theme.themeId}
							isStoreItem={true}
							{isInstalled}
							animationDelay={i * 50}
							onApply={applyTheme}
							onSave={saveStoreTheme}
						/>
					{/each}

					{#if isLoadingStore}
						<div
							class="store-loading"
							transition:fade={{ duration: 300 }}
						>
							<div class="spinner"></div>
							<p>Fetching themes from store...</p>
						</div>
					{:else if storeThemes.length === 0}
						<div class="empty-state">
							<div class="empty-icon">
								<Icon name="cloud_off" size={48} />
							</div>
							<p>Could not load store themes.</p>
							<p class="sub">
								Check your connection and try again.
							</p>
						</div>
					{/if}
				{/if}
			</div>
		{/key}
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
			<button
				class="minimal-footer-btn import"
				onclick={handleImportThemeZip}
				title="Import Theme ZIP"
			>
				<Icon name="publish" size={16} />
				<span>Import</span>
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
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		min-height: 480px;
		position: relative;
		overflow: hidden;
	}

	.manager-topbar {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 25px;
		padding: 0 5px;
		gap: 15px;

		.search-flex-filler {
			flex: 1;
			min-width: 200px;
		}
	}

	.view-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
		width: 100%;
	}

	.theme-grid {
		padding-bottom: 90px;
		overflow-y: auto;
		padding-right: 5px;
		display: block;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-thumb {
			background: var(--fg-opacity-10);
			border-radius: 10px;
		}

		&.has-themes {
			flex: 1;
		}
	}

	.store-loading {
		grid-column: 1 / -1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 0;
		color: var(--font-color-dim);
		gap: 15px;

		.spinner {
			width: 40px;
			height: 40px;
			border: 3px solid var(--fg-opacity-10);
			border-top-color: var(--theme-0);
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}

		p {
			font-size: 14px;
			font-weight: 500;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.empty-state {
		grid-column: 1 / -1;
		padding: 60px 20px;
		text-align: center;
		color: var(--fg-opacity-40);
		background: var(--fg-opacity-02);
		border: 2px dashed var(--fg-opacity-10);
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
		background: var(--bg-main);
		backdrop-filter: var(--window-blur);
		padding: 4px;
		border-radius: 40px;
		border: 1px solid var(--border-color);
		box-shadow: 0 15px 45px var(--shadow-color);
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
			background: var(--border-color);
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
			color: var(--font-color-dim);
			font-family: inherit;
			font-size: 16px;
			font-weight: 500;
			cursor: pointer;
			transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
			white-space: nowrap;

			&:hover {
				background: var(--fg-opacity-08);
				color: var(--font-color);
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
				color: var(--theme-0-Light);
				&:hover {
					background: var(--theme-0-15);
				}
			}

			&.import {
				color: #a7ffbe;
				&:hover {
					background: rgba(167, 255, 190, 0.15);
				}
			}

			&.ok {
				background: var(--theme-0);
				color: white;
				padding: 0 18px;
				font-weight: 600;

				&:hover {
					filter: brightness(1.2);
					box-shadow: 0 4px 15px var(--theme-0-30);
				}
			}

			&.cancel {
				padding: 0 12px;
				color: var(--font-color-dim);
				&:hover {
					color: var(--font-color);
				}
			}

			:global(.styleshift-icon) {
				margin: 0;
				opacity: 0.9;
			}
		}
	}
</style>
