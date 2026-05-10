<script lang="ts">
	import Icon from "@ui/settings/components/primitives/Icon.svelte";

	let {
		isMaximized,
		onMinimize,
		onMaximize,
		onClose,
	}: {
		isMaximized: boolean;
		onMinimize: (e: MouseEvent) => void;
		onMaximize: (e: MouseEvent) => void;
		onClose: (e: MouseEvent) => void;
	} = $props();
</script>

<div class="STYLESHIFT-Window-Controls">
	<button
		class="control-btn minimize"
		onclick={(e) => onMinimize(e)}
		title="Minimize"
	>
		<Icon name="minimize" size={14} />
	</button>
	<button
		class="control-btn maximize"
		onclick={(e) => onMaximize(e)}
		title={isMaximized ? "Restore" : "Maximize"}
	>
		<Icon name={isMaximized ? "restore" : "maximize"} size={14} />
	</button>
	<button
		class="control-btn close"
		onclick={(e) => onClose(e)}
		title="Close"
	>
		<Icon name="close" size={16} />
	</button>
</div>

<style lang="scss">
	.STYLESHIFT-Window-Controls {
		display: flex;
		gap: 5px;
		flex-shrink: 0;
	}

	.control-btn {
		width: 30px;
		height: 30px;
		border-radius: 6px;
		border: none;
		background: transparent;
		color: var(--fg-opacity-60);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background: var(--fg-opacity-10);
			color: white;
		}

		&.close:hover {
			background: #e81123;
		}
	}

	:global(.mini) .control-btn {
		width: 24px;
		height: 24px;
		border-radius: 4px;
	}
</style>
