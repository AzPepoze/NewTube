<script lang="ts">
	import Description from "../main/Description.svelte";
	let { text, align = "left" }: { text: string; align?: "left" | "center" | "right" } = $props();
</script>

<Description {text} {align} style="color: var(--Font-Color, white);" />
