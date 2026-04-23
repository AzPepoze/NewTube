<script lang="ts">
	import { onMount } from "svelte";

	let {
		innerContentFunction,
		onClose: _onClose = () => {},
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

<div class="STYLESHIFT-Config-Window-Wrapper">
	<div class="STYLESHIFT-Config-Window-Content STYLESHIFT-Scrollable">
		<div
			bind:this={container}
			class="STYLESHIFT-Config-Container-Inner"
		></div>
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Config-Window-Wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.STYLESHIFT-Config-Window-Content {
		flex: 1;
		width: 100%;
		box-sizing: border-box;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 8px;
		}
		&::-webkit-scrollbar-track {
			background: transparent;
		}
		&::-webkit-scrollbar-thumb {
			background: var(--White-10);
			border-radius: 10px;
			&:hover {
				background: var(--White-20);
			}
		}
	}

	.STYLESHIFT-Config-Container-Inner {
		height: 100%;
	}
</style>
