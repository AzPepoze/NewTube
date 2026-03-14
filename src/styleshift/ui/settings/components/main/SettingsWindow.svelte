<script lang="ts">
	import type { Category } from "@/styleshift/types/styleshiftTypes";
	import { getCategoryParts } from "@ui/utils";
	import Search from "./Search.svelte";
	import LeftTitle from "../advance/LeftTitle.svelte";
	import SettingRenderer from "./SettingRenderer.svelte";
	import Title from "../advance/Title.svelte";

	let {
		categories = [],
		showCategoryList = true,
		devOnlyItems = [],
		isDeveloperMode = false,
		isDevModulesLoaded = false,
		skipAnimation = false,
		onClose: _onClose = () => {},
		onAddCategory = (_name: string) => {},
	}: {
		categories: Category[];
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

	function isHeaderItem(item: any) {
		return "isHeader" in item;
	}

	function mergeDevItems(allCategories: any[]) {
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
				allCategories[existingIdx].settings = [
					...allCategories[existingIdx].settings,
					...devCategory.settings,
				];
			} else {
				allCategories.push(devCategory);
			}
		}
		return allCategories;
	}

	function filterBySearch(allCategories: any[], searchTerm: string) {
		const lowerQuery = searchTerm.toLowerCase();

		return allCategories
			.map((item) => {
				if (isHeaderItem(item)) return item;

				return {
					...item,
					settings: item.settings.filter((setting) => {
						const nameMatch =
							"name" in setting &&
							setting.name
								.toLowerCase()
								.includes(lowerQuery);
						const descMatch =
							"description" in setting &&
							setting.description
								?.toLowerCase()
								.includes(lowerQuery);
						return nameMatch || descMatch;
					}),
				};
			})
			.filter(
				(item) => isHeaderItem(item) || item.settings.length > 0,
			);
	}

	let filteredData = $derived.by(() => {
		let result = categories.map((c) => {
			return isHeaderItem(c) ? c : { ...(c as any) };
		});

		result = mergeDevItems(result);

		if (searchQuery) {
			result = filterBySearch(result, searchQuery);
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
			{#each filteredData as item, i (i)}
				{#if "isHeader" in item}
					<div
						class="STYLESHIFT-Sidebar-Header"
						style="animation-delay: {skipAnimation
							? '0ms'
							: i * 50 + 'ms'};"
					>
						{(item as any).label}
					</div>
				{:else}
					{@const category = item as any}
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
			style="cursor: col-resize; width: 4px; background: var(--Category-Left-BG); user-select: none;"
		></div>
	{/if}

	<div class="STYLESHIFT-Content">
		<Search bind:value={searchQuery} />

		<div
			bind:this={scrollContainer}
			class="STYLESHIFT-Scrollable STYLESHIFT-Settings-List"
			onscroll={handleScroll}
		>
			{#each filteredData as item, i (i)}
				{#if "isHeader" in item}
					<div class="STYLESHIFT-Category-Separator"></div>
				{:else}
					{@const category = item}
					{@const parts = getCategoryParts(category.category)}
					<div
						class="STYLESHIFT-Category-Frame STYLESHIFT-Settings-Group"
						data-category={parts.text}
					>
						<Title
							text={parts.text}
							icon={parts.icon}
							rainbow={category.rainbow}
						/>
						{#each category.settings as setting, j (j)}
							<SettingRenderer
								{setting}
								highlight={searchQuery}
							/>
						{/each}
					</div>
				{/if}
			{/each}
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
		gap: 10px;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.STYLESHIFT-Sidebar {
		min-width: 100px;
		width: 250px;
		background: var(--Category-Left-BG);
		display: flex;
		flex-direction: column;
		gap: 5px;
		transition: width 0.2s ease-out;
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
		min-width: 0;
	}

	.STYLESHIFT-Settings-List {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
		overflow-y: auto;
		padding-inline: 20px;
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
