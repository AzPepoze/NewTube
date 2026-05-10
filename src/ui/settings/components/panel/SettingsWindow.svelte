<script lang="ts">
	import SettingsListRenderer from "@renderers/list/SettingsListRenderer.svelte";
	import type {
		Category,
		SeparateCategory,
	} from "@settings/types/styleshiftTypes";
	import LeftTitle from "@ui/settings/components/primitives/LeftTitle.svelte";
	import { getCategoryParts } from "@ui/window/utils";
	import Search from "../primitives/Search.svelte";
	import { SettingsWindowController } from "./SettingsWindowController.svelte";

	let {
		internalSettings = [],
		externalSettings = [],
		showCategoryList = true,
		devOnlyItems = [],
		isDeveloperMode = false,
		isDevModulesLoaded = false,
		skipAnimation = false,
		onClose: _onClose = () => {},
		onAddCategory = (_name: string) => {},
	}: {
		internalSettings: (Category | SeparateCategory)[];
		externalSettings?: Category[];
		showCategoryList?: boolean;
		devOnlyItems?: Category[];
		isDeveloperMode?: boolean;
		isDevModulesLoaded?: boolean;
		skipAnimation?: boolean;
		onClose?: () => void;
		onAddCategory?: (name: string) => void;
	} = $props();

	const controller = new SettingsWindowController({
		get internalSettings() {
			return internalSettings;
		},
		get externalSettings() {
			return externalSettings || [];
		},
		get devOnlyItems() {
			return devOnlyItems || [];
		},
		get isDeveloperMode() {
			return isDeveloperMode;
		},
		get isDevModulesLoaded() {
			return isDevModulesLoaded;
		},
		get onAddCategory() {
			return onAddCategory;
		},
	});

	$effect(() => {
		if (controller.leftSidebar) {
			controller.clearTargets();
		}
	});
</script>

<div class="styleshift-settings-main" class:skip-animation={skipAnimation}>
	{#if showCategoryList}
		<div
			bind:this={controller.leftSidebar}
			class="styleshift-sidebar styleshift-scrollable"
			data-left="true"
			style:width={`${controller.sidebarWidth}px`}
		>
			{#each controller.sidebarData as item, i (i)}
				{#if controller.isHeaderItem(item)}
					<div
						class="styleshift-sidebar-header"
						class:centered={item.label === "BUILD-IN" ||
							item.label === "ADD-ON"}
						style="animation-delay: {skipAnimation
							? '0ms'
							: i * 50 + 'ms'};"
					>
						{item.label}
					</div>
				{:else}
					{@const category = item}
					{@const parts = getCategoryParts(category.category)}
					<button
						class="styleshift-sidebar-item-wrapper"
						use:controller.setupDragAndDrop={category}
						style="animation-delay: {skipAnimation
							? '0ms'
							: i * 50 + 'ms'};"
						onclick={() => controller.scrollToCategory(parts)}
					>
						<LeftTitle
							category={category.category}
							selected={controller.activeCategoryLabel ===
								parts.text}
							{isDeveloperMode}
							editable={category.editable}
							onMove={(dir) =>
								controller.moveCategory(category, dir)}
						/>
					</button>
				{/if}
			{/each}

			{#if isDeveloperMode && isDevModulesLoaded}
				<button
					class="styleshift-add-category-button"
					onclick={controller.handleAddCategory}
				>
					+
				</button>
			{/if}
		</div>
		<div
			class="styleshift-resize-handle"
			role="button"
			tabindex="0"
			aria-label="Resize sidebar"
			title="Drag to resize sidebar"
			onmousedown={controller.handleResizeStart}
		></div>
	{/if}

	<div class="styleshift-content">
		<Search bind:value={controller.searchQuery} />

		<div
			bind:this={controller.scrollContainer}
			class="styleshift-scrollable styleshift-settings-list"
			onscroll={controller.handleScroll}
		>
			{#if controller.buildInItemsData.length > 0}
				<div class="styleshift-section-header">BUILD-IN</div>
				<SettingsListRenderer
					items={controller.buildInItemsData}
					searchQuery={controller.searchQuery}
					{isDeveloperMode}
				/>
			{/if}

			{#if controller.addOnItemsData.length > 0}
				<div class="styleshift-section-header">ADD-ON</div>
				<SettingsListRenderer
					items={controller.addOnItemsData}
					searchQuery={controller.searchQuery}
					{isDeveloperMode}
				/>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	@keyframes sidebar-animation {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.styleshift-settings-main {
		display: flex;
		flex-direction: row;
		gap: 5px;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.styleshift-resize-handle {
		width: 5px;
		cursor: col-resize;
		background: var(--border-color);
		user-select: none;
		border-radius: 10px;
		transition: all 0.2s;

		&:hover {
			background: var(--fg-opacity-90);
		}
	}

	.styleshift-sidebar {
		min-width: 150px;
		width: 250px;
		background: var(--category-left-bg);
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.styleshift-sidebar-item-wrapper {
		background: transparent;
		border: none;
		padding: 0;
		text-align: left;
		cursor: pointer;
		width: 100%;
		display: block;
		animation: sidebar-animation 0.2s both;

		:global(.skip-animation) & {
			animation: none;
		}
	}

	.styleshift-add-category-button {
		background: var(--fg-opacity-05);
		border: 1px solid var(--fg-opacity-10);
		color: var(--text-primary);
		padding: 8px 5px;
		margin: 3px 10px;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
		font-size: 16px;
		transition: background-color 0.2s;
	}

	.styleshift-add-category-button:hover {
		background: var(--fg-opacity-10);
	}

	.styleshift-sidebar-header {
		padding: 12px 10px 8px;
		font-size: 14px;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 700;
		margin-bottom: 4px;
		border-top: 2px solid var(--fg-opacity-10);
		animation: sidebar-animation 1s both;

		:global(.styleshift-main[data-theme="light"]) & {
			color: var(--text-primary);
		}

		&.centered {
			font-size: 12px;
			color: var(--text-muted);
			letter-spacing: 2px;
			font-weight: 800;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10px;
			margin-top: 20px;
			margin-bottom: 10px;
			border-top: none;

			&::before,
			&::after {
				content: "";
				flex: 1;
				height: 1px;
				background: linear-gradient(
					to var(--direction, right),
					var(--fg-opacity-10),
					transparent
				);
			}

			&::before {
				--direction: left;
			}

			&::after {
				--direction: right;
			}
		}

		:global(.skip-animation) & {
			animation: none;
		}
	}

	.styleshift-sidebar-header:first-child {
		border-top: none;
		margin-top: 0;
	}

	.styleshift-section-header {
		font-size: 28px;
		font-weight: 900;
		color: var(--fg-opacity-60);
		letter-spacing: 6px;
		margin-top: 40px;
		margin-bottom: 25px;
		text-transform: uppercase;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 25px;

		&::before,
		&::after {
			content: "";
			flex: 1;
			height: 1px;
			background: linear-gradient(
				to var(--direction, right),
				var(--fg-opacity-10),
				transparent
			);
		}

		&::before {
			--direction: left;
		}

		&::after {
			--direction: right;
		}
	}

	.styleshift-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		overflow: hidden;
		min-width: 300px;
	}

	.styleshift-settings-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
		overflow-y: auto;
		padding-inline: 20px;
		padding-bottom: 50px;
	}
</style>
