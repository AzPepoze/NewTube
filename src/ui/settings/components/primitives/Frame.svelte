<script lang="ts">
	let {
		padding = true,
		vertical = true,
		centerX = false,
		centerY = false,
		transparent = false,
		children = undefined,
		className = "",
		style = "",
	} = $props();
</script>

<div
	class="STYLESHIFT-Setting-Frame {className}"
	style:padding={padding ? "" : "0px"}
	style:flex-direction={vertical ? "column" : "row"}
	style:justify-content={centerX ? "center" : ""}
	style:align-items={centerY ? "center" : ""}
	style:background={transparent ? "transparent" : ""}
	{style}
>
	{@render children?.()}
</div>

<style lang="scss">
	.STYLESHIFT-Setting-Frame {
		display: flex;
		transition: all 0.3s;
	}
</style>
