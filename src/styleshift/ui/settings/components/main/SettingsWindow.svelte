<script lang="ts">
	import { onMount } from "svelte";
	import type { Category, Setting } from "@styleshift/types/store";
	import Search from "./Search.svelte";
	import Icon from "./Icon.svelte";
	import SettingRenderer from "./SettingRenderer.svelte";
	import { scroll_on_click } from "@functions/normal";

	let {
		categories = [],
		showCategoryList = true,
		onClose = () => {},
	}: {
		categories: Category[];
		showCategoryList?: boolean;
		onClose?: () => void;
	} = $props();

	let searchQuery = $state("");
	let scrollContainer = $state<HTMLElement | null>(null);
	let currentCategoryIndex = $state(0);

	// Filtered categories and settings
	let filteredData = $derived.by(() => {
		if (!searchQuery) return categories;

		const query = searchQuery.toLowerCase();
		return categories
			.map((cat) => ({
				...cat,
				settings: cat.settings.filter(
					(s) =>
						("name" in s && s.name.toLowerCase().includes(query)) ||
						("description" in s && s.description?.toLowerCase().includes(query)),
				),
			}))
			.filter((cat) => cat.settings.length > 0);
	});

	function handleScroll() {
		if (!scrollContainer) return;
		const frames = scrollContainer.querySelectorAll(".STYLESHIFT-Category-Frame");
		const containerRect = scrollContainer.getBoundingClientRect();

		frames.forEach((frame, index) => {
			const rect = frame.getBoundingClientRect();
			if (rect.top <= containerRect.top + 50 && rect.bottom > containerRect.top + 50) {
				currentCategoryIndex = index;
			}
		});
	}
</script>

<div class="STYLESHIFT-Settings-Main">
	{#if showCategoryList}
		<div class="STYLESHIFT-Sidebar STYLESHIFT-Scrollable" data-left="true">
			{#each categories as category, i}
				<button
					class="STYLESHIFT-Sidebar-Item"
					class:selected={currentCategoryIndex === i}
					onclick={() => {
						const target = scrollContainer?.querySelectorAll(".STYLESHIFT-Category-Frame")[i];
						if (target) target.scrollIntoView({ behavior: "smooth" });
					}}
				>
					{category.category}
				</button>
			{/each}
		</div>
	{/if}

	<div class="STYLESHIFT-Content">
		<Search bind:value={searchQuery} />

		<div
			bind:this={scrollContainer}
			class="STYLESHIFT-Scrollable STYLESHIFT-Settings-List"
			onscroll={handleScroll}
		>
			{#each filteredData as category}
				<div class="STYLESHIFT-Category-Frame">
					<div class="STYLESHIFT-Category-Title">
						{category.category}
					</div>
					<div class="STYLESHIFT-Settings-Group">
						{#each category.settings as setting}
							<SettingRenderer {setting} highlight={searchQuery} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
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
	}

	.STYLESHIFT-Sidebar-Item {
		background: transparent;
		border: none;
		padding: 10px;
		text-align: left;
		color: var(--Category-Left-Title-Text-Color);
		cursor: pointer;
		border-radius: 10px;
		transition: all 0.2s;

		&:hover {
			background: var(--Category-Left-Title-BG-Hover);
			color: var(--Category-Left-Title-Text-Color-Hover);
		}

		&.selected {
			background: var(--Category-Left-Title-BG-Selected);
			color: var(--Category-Left-Title-Text-Color-Selected);
		}
	}

	.STYLESHIFT-Content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		overflow: hidden;
	}

	.STYLESHIFT-Settings-List {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.STYLESHIFT-Category-Title {
		font-size: 24px;
		font-weight: 600;
		padding: 10px;
		background: var(--Category-Title-BG);
		color: var(--Category-Title-Text-Color);
		border-radius: 10px;
		margin-bottom: 10px;
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
