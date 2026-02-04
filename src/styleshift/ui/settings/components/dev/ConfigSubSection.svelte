<script lang="ts">
	import DevSettingSection from "./DevSettingSection.svelte";

	let { setting, props } = $props();

	const propertyTypeMap = {
		0: ["css", "function"],
		1: ["var"],
		2: ["css"],
		3: ["function"],
	};

	function getExtArray(property: any) {
		if (typeof property === "number") {
			return propertyTypeMap[property as keyof typeof propertyTypeMap];
		}
		return property;
	}
</script>

<div class="STYLESHIFT-Config-Sub-Section">
	{#each Object.entries(props) as [title, property]}
		{#if title !== "update_config"}
			<DevSettingSection
				{setting}
				runType={title}
				extArray={getExtArray(property)}
				onUpdateConfig={props.update_config}
			/>
		{/if}
	{/each}
</div>
