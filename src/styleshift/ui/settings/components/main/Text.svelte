<script lang="ts">
	let {
		html = "",
		text = "",
		fontSize = 14,
		textAlign = "start",
		color = "inherit",
		id = "",
		className = "",
	} = $props();
</script>

<div {id} class="STYLESHIFT-Text {className}" style:font-size="{fontSize}px" style:text-align={textAlign} style:color>
	{#if html}
		{@html html}
	{:else}
		{text}
	{/if}
</div>

<style lang="scss">
	.STYLESHIFT-Text {
		width: 100%;
		transition: all 0.2s ease;
		line-height: 1.5;
	}
</style>
