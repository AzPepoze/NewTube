<script lang="ts">
	import type {
		Category,
		SeparateCategory,
	} from "@settings/types/styleshiftTypes";
	import Title from "@ui/settings/components/primitives/Title.svelte";
	import { getCategoryParts } from "@ui/window/utils";
	import SettingRenderer from "@renderers/setting/SettingRenderer.svelte";

	let {
		items = [],
		searchQuery = "",
		isDeveloperMode = false,
	}: {
		items: (Category | SeparateCategory)[];
		searchQuery?: string;
		isDeveloperMode?: boolean;
	} = $props();

	function isHeaderItem(
		item: Category | SeparateCategory,
	): item is SeparateCategory {
		return "isHeader" in item;
	}
</script>

{#each items as item, i (i)}
	{#if isHeaderItem(item)}
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
				{isDeveloperMode}
				editable={category.editable}
			/>
			{#each category.settings as setting, j (j)}
				<SettingRenderer {setting} highlight={searchQuery} />
			{/each}
		</div>
	{/if}
{/each}

<style lang="scss">
	.STYLESHIFT-Category-Separator {
		height: 1px;
		background: var(--fg-opacity-10);
		margin: 20px 0 10px;
	}

	.STYLESHIFT-Settings-Group {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px;
		background: var(--fg-opacity-05);
		border-radius: 20px;
	}
</style>
