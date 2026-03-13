<script lang="ts">
	import Icon from "../main/Icon.svelte";

	let {
		text,
		icon = "",
		subtitle = false,
		rainbow = false,
		className = "",
		leftSeparator = false,
		editable = false,
	} = $props();
</script>

{#if subtitle}
	<div class="STYLESHIFT-Sub-Title {className}" class:STYLESHIFT-Left-Separator={leftSeparator}>
		{#if editable}
			<div class="STYLESHIFT-Group-Drag drag-handle">
				<Icon name="drag" size={14} />
			</div>
		{/if}
		{@html text}
	</div>
{:else}
	<div class="STYLESHIFT-Category-Title {rainbow ? 'STYLESHIFT-Category-title-Rainbow' : ''} {className}">
		{#if icon}
			<span class="STYLESHIFT-Category-Title-Icon">
				<Icon name={icon} size={24} color="black" />
			</span>
		{/if}
		{text}
	</div>
{/if}

<style lang="scss">
	.STYLESHIFT-Category-Title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		position: relative;
		width: calc(100% - 6px);
		font-size: 20px;
		padding-block: 10px;
		font-weight: 600;
		background: var(--Category-Title-BG);
		color: black;
		text-align: center;
		border-radius: 20px;
		margin: 3px;
		margin-bottom: 10px;
		user-select: text;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		box-shadow: 0 4px 15px var(--Black-10);
	}

	.STYLESHIFT-Category-Title-Icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.STYLESHIFT-Sub-Title {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 25px;
		margin-bottom: 15px;
		margin-inline: 10px;
		font-size: 16px;
		font-weight: 600;
		color: var(--White-80);
		opacity: 0.9;
		position: relative;

		&.STYLESHIFT-Left-Separator {
			padding-left: 12px;
			&::before {
				content: "";
				position: absolute;
				left: 0;
				top: 2px;
				bottom: 2px;
				width: 4px;
				background: var(--Theme-0);
				border-radius: 4px;
				box-shadow: 0 0 10px var(--Theme-0);
			}
		}
	}

	.STYLESHIFT-Group-Drag {
		cursor: grab;
		opacity: 0;
		transition: opacity 0.2s;
		color: var(--White-40);

		&:hover {
			color: var(--White-100);
		}

		:global(.STYLESHIFT-Sub-Title:hover) & {
			opacity: 1;
		}
	}

	.STYLESHIFT-Category-title-Rainbow {
		&::before {
			z-index: -1;
			width: 100%;
			height: 100%;
			position: absolute;
			top: -3px;
			left: -3px;
			content: "";
			border-radius: 20px;
			padding: 3px;

			background: linear-gradient(
					45deg,
					rgb(255, 0, 0),
					rgb(255, 115, 0),
					rgb(255, 251, 0),
					rgb(72, 255, 0),
					rgb(0, 255, 213),
					rgb(0, 43, 255),
					rgb(122, 0, 255),
					rgb(255, 0, 200),
					rgb(255, 0, 0)
				)
				0% 0% / 400%;
			animation: 20s STYLESHIFT-slide-rainbow linear infinite;
		}
	}

	@keyframes STYLESHIFT-slide-rainbow {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 400% 50%;
		}
	}
</style>
