<script lang="ts">
	import type {
		Category,
		SeparateCategory,
	} from "@settings/types/styleshiftTypes";
	import LeftTitle from "@ui/settings/components/primitives/LeftTitle.svelte";
	import Title from "@ui/settings/components/primitives/Title.svelte";
	import { getCategoryParts } from "@ui/window/utils";
	import Search from "../primitives/Search.svelte";
	import SettingsListRenderer from "../renderers/SettingsListRenderer.svelte";

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

	let searchQuery = $state("");
	let scrollContainer = $state<HTMLElement | null>(null);
	let leftSidebar = $state<HTMLElement | null>(null);
	let activeCategoryLabel = $state("");
	let sidebarWidth = $state(200);

	function isHeaderItem(
		item: Category | SeparateCategory,
	): item is SeparateCategory {
		return "isHeader" in item;
	}

	function mergeDevItems(allCategories: (Category | SeparateCategory)[]) {
		if (!isDevModulesLoaded || !isDeveloperMode) return allCategories;

		const devOnlyCategories = devOnlyItems.filter(
			(item) => !isHeaderItem(item),
		);

		for (const devCategory of devOnlyCategories) {
			const devCategoryJson = JSON.stringify(devCategory.category);
			const existingIdx = allCategories.findIndex(
				(item) =>
					!isHeaderItem(item) &&
					JSON.stringify(item.category) === devCategoryJson,
			);

			if (existingIdx > -1) {
				const item = allCategories[existingIdx];
				if (!isHeaderItem(item)) {
					const category = item as Category;
					category.settings = [
						...category.settings,
						...devCategory.settings,
					];
				}
			} else {
				allCategories.push(devCategory);
			}
		}
		return allCategories;
	}

	function filterBySearch(
		allCategories: (Category | SeparateCategory)[],
		searchTerm: string,
	) {
		const query = searchTerm.toLowerCase();

		return allCategories
			.map((item) => {
				if (isHeaderItem(item)) return item;

				const category = item as Category;
				const settings = category.settings.filter((s: any) => {
					const name = s.name?.toLowerCase() || "";
					const desc = s.description?.toLowerCase() || "";
					return name.includes(query) || desc.includes(query);
				});

				return { ...category, settings };
			})
			.filter(
				(item) => isHeaderItem(item) || item.settings.length > 0,
			);
	}

	function getVisibleSettings(settings: any[], isDev: boolean) {
		return settings.filter((s) => s.type !== "conditionSetting" || isDev);
	}

	let internalData = $derived.by(() => {
		let result: (Category | SeparateCategory)[] = internalSettings.map(
			(c) =>
				isHeaderItem(c)
					? c
					: {
							...c,
							settings: getVisibleSettings(
								c.settings,
								isDeveloperMode,
							),
						},
		);

		result = mergeDevItems(result);

		if (searchQuery) {
			result = filterBySearch(result, searchQuery);
		}

		return result as (Category | SeparateCategory)[];
	});

	let externalCategoriesData = $derived.by(() => {
		let result = externalSettings.map((c) => ({
			...c,
			settings: getVisibleSettings(c.settings, isDeveloperMode),
		}));

		if (searchQuery) {
			result = filterBySearch(result, searchQuery) as Category[];
		}

		return result;
	});

	let sidebarData = $derived.by(() => {
		const result = [...internalData];
		if (externalCategoriesData.length > 0) {
			result.push({ isHeader: true, label: "EXTERNAL" });
			result.push(...externalCategoriesData);
		}
		return result;
	});

	function handleScroll() {
		if (!scrollContainer) return;
		const frames = scrollContainer.querySelectorAll(
			".STYLESHIFT-Category-Frame",
		);
		const containerRect = scrollContainer.getBoundingClientRect();

		frames.forEach((frame) => {
			const rect = frame.getBoundingClientRect();
			if (
				rect.top <= containerRect.top + 100 &&
				rect.bottom > containerRect.top + 100
			) {
				const label = (frame as HTMLElement).dataset.category;
				if (label) activeCategoryLabel = label;
			}
		});
	}

	function handleResizeStart(e: MouseEvent) {
		e.preventDefault();
		const startX = e.clientX;
		const startWidth = sidebarWidth;

		function handleMouseMove(moveEvent: MouseEvent) {
			const delta = moveEvent.clientX - startX;
			sidebarWidth = Math.max(100, startWidth + delta);
			if (leftSidebar) {
				leftSidebar.style.width = `${sidebarWidth}px`;
			}
		}

		function handleMouseUp() {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		}

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	}
</script>

<div class="STYLESHIFT-Settings-Main" class:skip-animation={skipAnimation}>
	{#if showCategoryList}
		<div
			bind:this={leftSidebar}
			class="STYLESHIFT-Sidebar STYLESHIFT-Scrollable"
			data-left="true"
			style:width={`${sidebarWidth}px`}
		>
			{#each sidebarData as item, i (i)}
				{#if isHeaderItem(item)}
					<div
						class="STYLESHIFT-Sidebar-Header"
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
						class="STYLESHIFT-Sidebar-Item-Wrapper"
						style="animation-delay: {skipAnimation
							? '0ms'
							: i * 50 + 'ms'};"
						onclick={() => {
							const target =
								scrollContainer?.querySelector(
									`.STYLESHIFT-Category-Frame[data-category="${parts.text}"]`,
								);
							if (target) {
								target.scrollIntoView({
									behavior: "smooth",
								});
								activeCategoryLabel = parts.text;
							}
						}}
					>
						<LeftTitle
							category={category.category}
							selected={activeCategoryLabel === parts.text}
						/>
					</button>
				{/if}
			{/each}

			{#if isDeveloperMode && isDevModulesLoaded}
				<button
					class="STYLESHIFT-Add-Category-button"
					onclick={() => {
						const categoryName = prompt(
							"Enter category name:",
						);
						if (categoryName) {
							onAddCategory(categoryName);
						}
					}}
				>
					+
				</button>
			{/if}
		</div>
		<div
			class="STYLESHIFT-Resize-Handle"
			role="button"
			tabindex="0"
			aria-label="Resize sidebar"
			title="Drag to resize sidebar"
			onmousedown={handleResizeStart}
		></div>
	{/if}

	<div class="STYLESHIFT-Content">
		<Search bind:value={searchQuery} />

		<div
			bind:this={scrollContainer}
			class="STYLESHIFT-Scrollable STYLESHIFT-Settings-List"
			onscroll={handleScroll}
		>
			<SettingsListRenderer items={internalData} {searchQuery} />

			{#if externalCategoriesData.length > 0}
				<div class="STYLESHIFT-Category-Separator"></div>
				<div
					class="STYLESHIFT-Category-Frame STYLESHIFT-Settings-Group"
				>
					<Title
						text="EXTERNAL"
						icon="extension"
						rainbow={true}
					/>
					<SettingsListRenderer
						items={externalCategoriesData}
						{searchQuery}
					/>
				</div>
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

	.STYLESHIFT-Settings-Main {
		display: flex;
		flex-direction: row;
		gap: 5px;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.STYLESHIFT-Resize-Handle {
		width: 5px;
		cursor: col-resize;
		background: var(--Border-Color);
		user-select: none;
		border-radius: 10px;
		transition: all 0.2s;

		&:hover {
			background: var(--White-90);
		}
	}

	.STYLESHIFT-Sidebar {
		min-width: 150px;
		width: 250px;
		background: var(--Category-Left-BG);
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.STYLESHIFT-Sidebar-Item-Wrapper {
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

	.STYLESHIFT-Add-Category-button {
		background: var(--category-left-bg-hover, rgba(255, 255, 255, 0.1));
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: #ffffff;
		padding: 8px 5px;
		margin: 3px 10px;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
		font-size: 16px;
		transition: background-color 0.2s;
	}

	.STYLESHIFT-Add-Category-button:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.STYLESHIFT-Sidebar-Header {
		padding: 12px 10px 8px;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 700;

		:global(.skip-animation) & {
			animation: none;
		}
		margin-top: 8px;
		margin-bottom: 4px;
		border-top: 2px solid rgba(255, 255, 255, 0.1);
		animation: sidebar-animation 1s both;
	}

	.STYLESHIFT-Sidebar-Header:first-child {
		border-top: none;
		margin-top: 0;
	}

	.STYLESHIFT-Category-Separator {
		height: 1px;
		background: var(--White-10);
		margin: 20px 0 10px;
	}

	.STYLESHIFT-Content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		overflow: hidden;
		min-width: 300px;
	}

	.STYLESHIFT-Settings-List {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
		overflow-y: auto;
		padding-inline: 20px;
		padding-bottom: 50px;
	}

	.STYLESHIFT-Settings-Group {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px;
		background: var(--White-05);
		border-radius: 20px;
	}
</style>
