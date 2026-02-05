<script lang="ts">
	import search from "@ui/assets/icons/search.svg";
	import edit from "@ui/assets/icons/edit.svg";
	import del from "@ui/assets/icons/delete.svg";
	import drag from "@ui/assets/icons/drag.svg";
	import add from "@ui/assets/icons/add.svg";
	import close from "@ui/assets/icons/close.svg";

	import { getAssetUrl } from "@ui/utils";

	const icons: Record<string, string> = {
		search,
		edit,
		delete: del,
		drag,
		add,
		close,
	};

	let {
		name = "",
		className = "",
		style = "",
		color = "",
		applyFilter = true,
	}: {
		name: string;
		className?: string;
		style?: string;
		color?: string;
		applyFilter?: boolean;
	} = $props();

	const src = $derived(getAssetUrl(icons[name] || name));
</script>

{#if src}
	<img
		{src}
		alt={name}
		class="STYLESHIFT-Icon {className}"
		class:with-filter={applyFilter && !color}
		style="{color ? `filter: none;` : ""}{style}"
		style:color={color || undefined}
	/>
{/if}

<style lang="scss">
	.STYLESHIFT-Icon {
		width: 1.2em;
		height: 1.2em;
		display: inline-block;
		vertical-align: middle;
		pointer-events: none;
		object-fit: contain;

		&.with-filter {
			filter: brightness(0) invert(1);
		}

		:global(&.STYLESHIFT-Button-Icon) {
			height: 1.5em;
			width: auto;
		}
	}
</style>
