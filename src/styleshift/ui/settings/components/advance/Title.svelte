<script lang="ts">
	let { text, subtitle = false, rainbow = false, className = "" } = $props();
</script>

{#if subtitle}
	<div class="STYLESHIFT-Sub-Title {className}">
		{@html text}
	</div>
{:else}
	<div class="STYLESHIFT-Category-Title {rainbow ? 'STYLESHIFT-Category-title-Rainbow' : ''} {className}">
		{text}
	</div>
{/if}

<style lang="scss">
	.STYLESHIFT-Category-Title {
		position: relative;
		width: calc(100% - 6px);
		font-size: 20px;
		padding-block: 5px;
		font-weight: 500;
		background: var(--Category-Title-BG);
		color: black;
		text-align: center;
		border-radius: 20px;
		margin: 3px;
		user-select: text;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

		&[selected] {
			background: white;
			box-shadow: 0 4px 15px var(--Black-10);
			transform: scale(1.02);
			font-weight: 700;
		}
	}

	.STYLESHIFT-Sub-Title {
		margin-block: 10px;
		font-size: 15px;
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
