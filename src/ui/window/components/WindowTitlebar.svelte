<script lang="ts">
	import { getAssetUrl } from "@ui/window/utils";
	import WindowControls from "./WindowControls.svelte";

	let {
		title,
		isMaximized,
		onDragStart,
		onMaximize,
		onMinimize,
		onClose,
		topbarChildren,
	}: {
		title: string;
		isMaximized: boolean;
		onDragStart: (e: MouseEvent) => void;
		onMaximize: (e: MouseEvent) => void;
		onMinimize: (e: MouseEvent) => void;
		onClose: (e: MouseEvent) => void;
		topbarChildren?: any;
	} = $props();
</script>

<div
	class="STYLESHIFT-Window-Topbar"
	onmousedown={onDragStart}
	ondblclick={onMaximize}
	role="presentation"
>
	<div class="STYLESHIFT-Window-Title">
		<img src={getAssetUrl("icon/32.png")} alt="" class="title-icon" />
		<span>{title}</span>
	</div>
	<div class="STYLESHIFT-Window-Topbar-Right">
		{#if topbarChildren}
			<div class="topbar-extra">
				{@render topbarChildren()}
			</div>
		{/if}
		<WindowControls {isMaximized} {onMinimize} {onMaximize} {onClose} />
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Window-Topbar {
		height: 40px;
		background: var(--bg-overlay-20);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10px;
		cursor: move;
		user-select: none;
		border-bottom: 1px solid var(--fg-opacity-05);
		flex-shrink: 0;
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
		z-index: 10;
		transition:
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.3s;
	}

	.STYLESHIFT-Window-Topbar-Right {
		display: flex;
		align-items: center;
		gap: 15px;
	}

	.topbar-extra {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.STYLESHIFT-Window-Title {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		font-weight: 600;
		color: var(--fg-opacity-80);
		flex: 1;
		min-width: 0;

		span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.title-icon {
			width: 16px;
			height: 16px;
			flex-shrink: 0;
		}
	}

	:global(.mini) .STYLESHIFT-Window-Topbar {
		height: 32px;
		padding: 0 8px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	:global(.mini) .STYLESHIFT-Window-Title {
		font-size: 11px;
		gap: 6px;
		.title-icon {
			width: 14px;
			height: 14px;
		}
	}

	:global(.auto-hide-topbar) .STYLESHIFT-Window-Topbar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.8),
			rgba(0, 0, 0, 0.4),
			transparent
		);
		border-bottom: none;
	}
</style>
