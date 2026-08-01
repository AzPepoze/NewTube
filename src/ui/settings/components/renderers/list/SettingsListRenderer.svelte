<script lang="ts">
	import type { Category, SeparateCategory, Setting } from "@settings/types/styleshiftTypes";
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

	function isHeaderItem(item: Category | SeparateCategory): item is SeparateCategory {
		return "isHeader" in item;
	}

	function getSettingKey(setting: Setting, index: number): string {
		if (setting.id) return setting.id;
		if ("name" in setting && setting.name) return setting.name;
		if ("text" in setting && setting.text) return setting.text;
		if ("html" in setting && setting.html) return setting.html;
		return String(index);
	}
</script>

{#each items as item (isHeaderItem(item) ? item.label : getCategoryParts(item.category).text)}
	{#if isHeaderItem(item)}
		<div class="styleshift-category-separator"></div>
	{:else}
		{@const category = item}
		{@const parts = getCategoryParts(category.category)}
		<div class="styleshift-category-frame styleshift-settings-group" data-category={parts.text}>
			<Title
				text={parts.text}
				icon={parts.icon}
				rainbow={category.rainbow}
				{isDeveloperMode}
				editable={category.editable}
			/>
			<div class="styleshift-settings-items" class:grid={category.layout === "grid"}>
				{#each category.settings as setting, j (getSettingKey(setting, j))}
					<SettingRenderer {setting} {category} highlight={searchQuery} layout={category.layout} />
				{/each}
			</div>
		</div>
	{/if}
{/each}

<style lang="scss">
	.styleshift-category-separator {
		height: 1px;
		background: var(--fg-opacity-10);
		margin: 20px 0 10px;
	}

	.styleshift-settings-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px;
		background: var(--fg-opacity-05);
		border-radius: 20px;
		container: settings-group / inline-size;
	}

	.styleshift-settings-items {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	@container settings-group (min-width: 520px) {
		.styleshift-settings-items.grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			align-items: stretch;
		}
	}
</style>
