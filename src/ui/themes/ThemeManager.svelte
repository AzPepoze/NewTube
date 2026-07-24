<script lang="ts">
	import Icon from "@primitives/Icon.svelte";
	import Button from "@ui/settings/components/controls/Button.svelte";
	import Search from "@ui/settings/components/primitives/Search.svelte";
	import CapsuleTabs from "@ui/window/components/CapsuleTabs.svelte";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import GroupedTagDropdown from "./GroupedTagDropdown.svelte";
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
			controller.fetchTags();
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

	let pageInput = $state(1);

	function handleJumpPage() {
		let page = Math.floor(Number(pageInput));
		if (isNaN(page) || page < 1) page = 1;
		if (page > controller.totalPages) page = controller.totalPages;
		pageInput = page;
		if (page !== controller.currentPage) {
			controller.goToPage(page, searchQuery);
		}
	}

	async function prevPage() {
		await controller.prevPage(searchQuery);
		pageInput = controller.currentPage;
	}

	async function nextPage() {
		await controller.nextPage(searchQuery);
		pageInput = controller.currentPage;
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
		{#if currentView === "store"}
			<div class="tag-filter-wrapper" transition:fade={{ duration: 150 }}>
				<GroupedTagDropdown
					selectedTag={controller.selectedTag}
					groupedTags={controller.groupedTags}
					onSelect={(tag) => controller.setSelectedTag(tag, searchQuery)}
				/>
			</div>
		{/if}
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
					{:else if filteredLocalThemes.length === 0}
						{@render emptyState("search_off", "No themes found.", "Try a different search query.")}
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
					{:else if controller.storeError}
						{@render emptyState("cloud_off", "Could not load store themes.", controller.storeError)}
					{:else if controller.storeThemes.length === 0}
						{@render emptyState("search_off", "No themes found.", "Try adjusting your search query or filters.")}
					{/if}
				{/if}
			</div>
		{/key}
	</div>

	<div class="manager-footer">
		<div class="actions-left">
			<Button
				class="footer-btn"
				variant="subtle"
				iconSize={18}
				fontSize={13.5}
				setting={{
					type: "button",
					name: "Store",
					icon: "storefront",
					color: "var(--theme-info, #a7ffff)",
					clickFunction: () => controller.openStore(),
				}}
			/>
			<Button
				class="footer-btn"
				variant="subtle"
				iconSize={18}
				fontSize={13.5}
				setting={{
					type: "button",
					name: "Save",
					icon: "save",
					color: "var(--theme-0)",
					clickFunction: () => controller.saveCurrentAsTheme(),
				}}
			/>
			<Button
				class="footer-btn"
				variant="subtle"
				iconSize={18}
				fontSize={13.5}
				setting={{
					type: "button",
					name: "Import",
					icon: "publish",
					color: "var(--theme-success)",
					clickFunction: () => controller.importTheme(),
				}}
			/>
		</div>

		{#if currentView === "store" && controller.storeTotal > 0}
			<div class="actions-center" transition:fade={{ duration: 150 }}>
				<button
					class="page-nav-btn"
					disabled={controller.currentPage <= 1 || controller.isLoadingStore}
					onclick={prevPage}
					title="Previous Page"
				>
					<Icon name="chevron_left" size={18} />
				</button>

				<div class="page-input-wrapper">
					<span class="label">Page</span>
					<input
						type="number"
						class="page-number-input"
						min="1"
						max={controller.totalPages}
						disabled={controller.isLoadingStore}
						bind:value={pageInput}
						onkeydown={(e) => e.key === "Enter" && handleJumpPage()}
						onblur={handleJumpPage}
					/>
					<span class="total-pages">/ {controller.totalPages}</span>
				</div>

				<button
					class="page-nav-btn"
					disabled={controller.currentPage >= controller.totalPages || controller.isLoadingStore}
					onclick={nextPage}
					title="Next Page"
				>
					<Icon name="chevron_right" size={18} />
				</button>
			</div>
		{/if}

		<div class="actions-right">
			<Button
				class="footer-btn"
				fontSize={13.5}
				setting={{
					type: "button",
					name: "OK",
					color: "var(--theme-0)",
					clickFunction: () => controller.handleOk(),
				}}
			/>
			<Button
				class="footer-btn"
				fontSize={13.5}
				setting={{
					type: "button",
					name: "Cancel",
					color: "var(--fg-opacity-20)",
					clickFunction: () => controller.handleCancel(),
				}}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.styleshift-theme-manager {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		min-height: 520px;
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

		.tag-filter-wrapper {
			display: flex;
			align-items: center;
		}
	}

	.view-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
		width: 100%;
	}

	.theme-grid {
		padding-bottom: 20px;
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 12px;
		margin-top: 20px;
		z-index: 100;
		position: relative;
		border: 1px solid var(--fg-opacity-10);
		border-radius: 16px;
		background: var(--bg-main, #111);

		.actions-left,
		.actions-right,
		.actions-center {
			display: flex;
			gap: 8px;
			align-items: center;
		}

		.actions-left {
			min-width: 0;
		}

		.actions-center {
			flex: 1;
			justify-content: center;
			gap: 10px;

			.page-nav-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 32px;
				height: 32px;
				border-radius: 8px;
				background: var(--fg-opacity-05);
				border: 1px solid var(--fg-opacity-10);
				color: var(--font-color);
				cursor: pointer;
				transition: all 160ms ease;

				&:hover:not(:disabled) {
					background: var(--fg-opacity-15);
					border-color: var(--theme-0);
					color: var(--theme-0);
					transform: translateY(-1px);
				}

				&:disabled {
					opacity: 0.35;
					cursor: not-allowed;
				}
			}

			.page-input-wrapper {
				display: flex;
				align-items: center;
				gap: 6px;
				font-size: 13.5px;
				font-weight: 500;
				color: var(--font-color-dim);

				.label {
					font-size: 13px;
				}

				.page-number-input {
					width: 48px;
					height: 30px;
					text-align: center;
					font-size: 13.5px;
					font-weight: 600;
					color: var(--font-color);
					background: var(--fg-opacity-05);
					border: 1px solid var(--fg-opacity-15);
					border-radius: 8px;
					outline: none;
					transition: all 160ms ease;
					appearance: none;
					-moz-appearance: textfield;

					&::-webkit-outer-spin-button,
					&::-webkit-inner-spin-button {
						-webkit-appearance: none;
						margin: 0;
					}

					&:focus {
						border-color: var(--theme-0);
						background: var(--fg-opacity-10);
						box-shadow: 0 0 0 2px rgba(162, 96, 215, 0.2);
					}

					&:disabled {
						opacity: 0.5;
					}
				}

				.total-pages {
					font-weight: 600;
					color: var(--font-color);
				}
			}
		}

		.actions-right {
			padding-left: 12px;
			border-left: 1px solid var(--fg-opacity-10);
		}

		:global(.footer-btn) {
			height: 40px;
			padding: 0 14px !important;
			border-radius: 11px !important;
			font: inherit;
			font-weight: 600;
			width: auto !important;
			box-shadow: none;
			transition:
				transform 160ms ease,
				filter 160ms ease,
				background 160ms ease;
		}

		:global(.footer-btn:hover) {
			transform: translateY(-1px) !important;
			filter: none;
		}

		@media (max-width: 720px) {
			gap: 10px;

			:global(.footer-btn) {
				padding: 0 11px !important;
			}
		}

		@media (max-width: 580px) {
			align-items: stretch;
			flex-direction: column;

			.actions-left,
			.actions-right {
				justify-content: flex-end;
			}

			.actions-right {
				padding: 10px 0 0;
				border-top: 1px solid var(--fg-opacity-10);
				border-left: 0;
			}
		}
	}
</style>
