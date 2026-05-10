<script lang="ts">
	import Icon from "@primitives/Icon.svelte";
	import Search from "@ui/settings/components/primitives/Search.svelte";
	import CapsuleTabs from "@ui/window/components/CapsuleTabs.svelte";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import ThemeCard from "./ThemeCard.svelte";
	import { ThemeManagerController } from "./ThemeManagerController.svelte";

	let { closeWindow }: { closeWindow?: () => void } = $props();

	const controller = new ThemeManagerController({ closeWindow: () => closeWindow?.() });

	let currentView = $state<"installed" | "store">("installed");
	let searchQuery = $state("");

	let filteredLocalThemes = $derived.by(() => {
		if (!searchQuery) return controller.themes;
		const query = searchQuery.toLowerCase();
		return controller.themes.filter((t) => t.themeName.toLowerCase().includes(query));
	});

	const tabOptions = [
		{ id: "installed", label: "Installed", icon: "folder_open" },
		{ id: "store", label: "Store", icon: "storefront" },
	];

	$effect(() => {
		if (currentView === "store") {
			const timer = setTimeout(() => controller.fetchStoreThemes(searchQuery), 300);
			return () => clearTimeout(timer);
		}
	});

	async function applyTheme(id: string) {
		const success = await controller.applyTheme(id, currentView);
		if (success && currentView === "store") {
			currentView = "installed";
		}
	}

	onMount(() => {
		controller.loadThemes();
		const storageListener = (_: any, area: string) => area === "local" && controller.refreshActiveTheme();
		chrome.storage.onChanged.addListener(storageListener);
		return () => chrome.storage.onChanged.removeListener(storageListener);
	});
</script>

{#snippet emptyState(icon, text, sub)}
	<div class="empty-state">
		<div class="empty-icon"><Icon name={icon} size={48} /></div>
		<p>{text}</p>
		<p class="sub">{sub}</p>
	</div>
{/snippet}

<div class="styleshift-theme-manager styleshift-main">
	<div class="manager-topbar">
		<CapsuleTabs options={tabOptions} bind:activeId={currentView} />
		<div class="search-box">
			<Search
				bind:value={searchQuery}
				placeholder="Search {currentView === 'installed' ? 'installed' : 'store'} themes..."
			/>
		</div>
	</div>

	<div
		class="theme-grid"
		class:has-themes={(currentView === "installed" ? filteredLocalThemes : controller.storeThemes).length > 0}
	>
		{#key currentView}
			<div class="view-container" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
				{#if currentView === "installed"}
					{#each filteredLocalThemes as theme, i (theme.themeId)}
						<ThemeCard
							id={theme.themeId}
							name={theme.themeName}
							preview={controller.getThemePreview(theme)}
							isActive={controller.activeThemeId === theme.themeId}
							isLoading={controller.loadingThemeId === theme.themeId}
							animationDelay={i * 50}
							onApply={applyTheme}
							onExport={controller.exportTheme.bind(controller)}
							onDelete={controller.deleteTheme.bind(controller)}
						/>
					{/each}
					{#if controller.themes.length === 0}
						{@render emptyState("palette", "Your collection is empty.", "Save your current setup to see it here!")}
					{/if}
				{:else}
					{#each controller.storeThemes as theme, i (theme.themeId)}
						<ThemeCard
							id={theme.themeId}
							name={theme.themeName}
							preview={controller.getThemePreview(theme)}
							isActive={controller.activeThemeId === theme.themeId}
							isLoading={controller.loadingThemeId === theme.themeId}
							isStoreItem={true}
							isInstalled={controller.installedThemeIds.has(theme.themeId)}
							animationDelay={i * 50}
							onApply={applyTheme}
							onSave={controller.saveStoreTheme.bind(controller)}
						/>
					{/each}

					{#if controller.isLoadingStore}
						<div class="store-loading" transition:fade={{ duration: 300 }}>
							<div class="spinner"></div>
							<p>Fetching themes from store...</p>
						</div>
					{:else if controller.storeThemes.length === 0}
						{@render emptyState("cloud_off", "Could not load store themes.", "Check your connection and try again.")}
					{/if}
				{/if}
			</div>
		{/key}
	</div>

	<div class="manager-footer">
		<div class="actions-left">
			<button class="footer-btn store" onclick={() => controller.openStore()} title="Explore Themes">
				<Icon name="storefront" size={16} /><span>Store</span>
			</button>
			<button class="footer-btn save" onclick={() => controller.saveCurrentAsTheme()} title="Save Current Theme">
				<Icon name="save" size={16} /><span>Save</span>
			</button>
			<button class="footer-btn import" onclick={() => controller.importTheme()} title="Import Theme ZIP">
				<Icon name="publish" size={16} /><span>Import</span>
			</button>
		</div>
		<div class="divider"></div>
		<div class="actions-right">
			<button class="footer-btn ok" onclick={() => controller.handleOk()}>OK</button>
			<button class="footer-btn cancel" onclick={() => controller.handleCancel()}>Cancel</button>
		</div>
	</div>
</div>

<style lang="scss">
	.styleshift-theme-manager {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		min-height: 480px;
		position: relative;
		overflow: hidden;
	}

	.manager-topbar {
		display: flex;
		align-items: center;
		margin-bottom: 25px;
		padding: 0 5px;
		gap: 15px;

		.search-box {
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
		flex: 1;

		&::-webkit-scrollbar {
			width: 6px;
		}
		&::-webkit-scrollbar-thumb {
			background: var(--fg-opacity-10);
			border-radius: 10px;
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

	.manager-footer {
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
		gap: 2px;

		.actions-left,
		.actions-right {
			display: flex;
			gap: 2px;
		}
		.divider {
			width: 1px;
			height: 20px;
			background: var(--border-color);
			margin: 0 6px;
		}

		.footer-btn {
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
			font: inherit;
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
				color: var(--theme-info, #a7ffff);
				&:hover {
					background: rgba(109, 245, 255, 0.15);
				}
			}

			&.save {
				color: var(--theme-0-light);
				&:hover {
					background: var(--theme-0-15);
				}
			}

			&.import {
				color: var(--theme-success-text, #a7ffbe);
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
			}

			:global(.styleshift-icon) {
				margin: 0;
				opacity: 0.9;
			}
		}
	}
</style>
