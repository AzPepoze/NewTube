<script lang="ts">
	import { onMount } from "svelte";
	import type { Setting } from "../../../../types/store";
	import Icon from "../main/Icon.svelte";

	let {
		innerContentFunction,
		onClose = () => {},
	}: {
		innerContentFunction: (parent: HTMLElement) => void | Promise<void>;
		onClose?: () => void;
	} = $props();

	let container = $state<HTMLElement | null>(null);

	onMount(async () => {
		if (container && innerContentFunction) {
			await innerContentFunction(container);
		}
	});
</script>

<div class="STYLESHIFT-Config-Window-Content STYLESHIFT-Scrollable">
	<div bind:this={container}></div>
</div>

<style lang="scss">
	.STYLESHIFT-Config-Window-Content {
		width: 100%;
		height: 100%;
		padding: 20px;
		box-sizing: border-box;
	}
</style>
