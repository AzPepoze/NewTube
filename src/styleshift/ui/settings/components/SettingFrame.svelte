<script lang="ts">
	let {
		id = "",
		type = "",
		vertical = false,
		clickable = false,
		children,
		onClick = undefined,
		onKeyDown = undefined,
		role = undefined,
		tabindex = undefined,
		style = "",
	} = $props();
</script>

<div
	class="STYLESHIFT-Setting-Frame"
	{id}
	data-settingtype={type}
	class:vertical
class:clickable
	onclick={onClick}
	onkeydown={onKeyDown}
	{role}
	{tabindex}
	{style}
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

		&.vertical {
			flex-direction: column;
			align-items: stretch;
		}

		&.clickable {
			cursor: pointer;
			transition: all 0.2s;

			&:hover {
				filter: brightness(1.5) drop-shadow(2px 2px 3px black)
					drop-shadow(-2px -2px 3px var(--White-40));
			}

			&:active {
				transform: scale(0.98);
			}
		}
	}
</style>
