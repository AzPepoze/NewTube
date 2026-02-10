<script lang="ts">
	import search from "@ui/assets/icons/search.svg";
	import edit from "@ui/assets/icons/edit.svg";
	import del from "@ui/assets/icons/delete.svg";
	import drag from "@ui/assets/icons/drag.svg";
	import add from "@ui/assets/icons/add.svg";
	import close from "@ui/assets/icons/close.svg";
	import settings from "@ui/assets/icons/settings.svg";
	import code from "@ui/assets/icons/code.svg";
	import arrow_up from "@ui/assets/icons/arrow_up.svg";
	import arrow_down from "@ui/assets/icons/arrow_down.svg";
	import minimize from "@ui/assets/icons/minimize.svg";
	import maximize from "@ui/assets/icons/maximize.svg";
	import restore from "@ui/assets/icons/restore.svg";

	import { get_asset_url } from "@ui/utils";

	const icons: Record<string, string> = {
		search,
		edit,
		delete: del,
		drag,
		add,
		close,
		settings,
		code,
		arrow_up,
		arrow_down,
		minimize,
		maximize,
		restore,
	};

	let {
		name = "",
		className = "",
		style = "",
		color = "",
		applyFilter = true,
		size = 20,
	}: {
		name: string;
		className?: string;
		style?: string;
		color?: string;
		applyFilter?: boolean;
		size?: number;
	} = $props();

	const src = $derived(get_asset_url(icons[name] || name));
</script>

{#if src}
	<img
		{src}
		alt={name}
		class="STYLESHIFT-Icon {className}"
		class:with-filter={applyFilter && !color}
		style="width: {size}px; height: {size}px; {color ? `filter: none;` : ''}{style}"
		style:color={color || undefined}
	/>
{/if}

<style lang="scss">
	.STYLESHIFT-Icon {
		display: inline-block;
		vertical-align: middle;
		pointer-events: none;
		object-fit: contain;

		&.with-filter {
			filter: brightness(0) invert(1);
		}
	}
</style>
