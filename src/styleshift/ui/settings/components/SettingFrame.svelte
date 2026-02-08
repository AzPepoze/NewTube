<script lang="ts">
	let {
		id = "",
		type = "",
		vertical = false,
		clickable = false,
		padding = true,
		transparent = false,
		children,
		onClick = undefined,
		onKeyDown = undefined,
		role: roleProp = undefined,
		tabindex: tabindexProp = undefined,
		style = "",
		useAction = undefined,
		className = "",
	}: {
		id?: string;
		type?: string;
		vertical?: boolean;
		clickable?: boolean;
		padding?: boolean;
		transparent?: boolean;
		children: any;
		onClick?: (event: MouseEvent) => void;
		onKeyDown?: (event: KeyboardEvent) => void;
		role?: string;
		tabindex?: number;
		style?: string;
		useAction?: (node: HTMLElement) => any;
		className?: string;
	} = $props();

	const role = $derived(roleProp ?? (clickable ? "button" : undefined));
	const tabindex = $derived(tabindexProp ?? (clickable ? 0 : undefined));

	function applyAction(node: HTMLElement) {
		if (useAction) return useAction(node);
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="STYLESHIFT-Setting-Frame {className}"
	{id}
	data-settingtype={type}
	class:vertical
	class:clickable
	class:no-padding={!padding}
	class:transparent
	onclick={onClick}
	onkeydown={onKeyDown}
	{role}
	{tabindex}
	{style}
	use:applyAction
>
	{@render children()}
</div>

<style lang="scss">
	.STYLESHIFT-Setting-Frame {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20px;
		gap: 10px;
		width: -webkit-fill-available;
		transition: all 0.3s;
		user-select: none;
		border-radius: 20px;
		position: relative;

		&.no-padding {
			padding: 0;
		}

		&.transparent {
			background: transparent !important;
			border: none !important;
		}

		&.vertical {
			flex-direction: column;
			align-items: stretch;
		}

		&.clickable {
			cursor: pointer;
			transition: all 0.2s;

			&:hover {
				filter: brightness(1.5) drop-shadow(2px 2px 3px black) drop-shadow(-2px -2px 3px var(--White-40));
			}

			&:active {
				transform: scale(0.98);
			}
		}
	}
</style>
