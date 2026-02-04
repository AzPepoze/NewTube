<script lang="ts">
	let {
		icon,
		onClick = () => {},
		className = "",
		style = "",
	}: {
		icon: any;
		onClick?: (event: MouseEvent) => void;
		className?: string;
		style?: string;
	} = $props();
</script>

<button
	class="STYLESHIFT-Icon-Button STYLESHIFT-Glow-Hover {className}"
	onclick={onClick}
	{style}
	type="button"
>
	{icon}
</button>

<style lang="scss">
	.STYLESHIFT-Icon-Button {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		user-select: none;
		border-radius: 4px;
		background: transparent;
		border: none;
		color: inherit;
		padding: 0;
		font: inherit;

		&:hover {
			background: var(--White-10);
			transform: scale(1.1);
		}

		&:active {
			transform: scale(0.9);
		}
	}
</style>
