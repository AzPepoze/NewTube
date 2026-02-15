<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import WindowResizer from "./WindowResizer.svelte";
	import Icon from "@ui/settings/components/main/Icon.svelte";
	import { getAssetUrl } from "@ui/utils";
	import { applyThemeToElement } from "../../theme";
	import { windowManager } from "../../windowManager.svelte";

	let {
		title = "StyleShift",
		onClose = () => {},
		width = "600px",
		height = "400px",
		fullscreen = false,
		children,
	}: {
		title?: string;
		onClose?: () => void;
		width?: string;
		height?: string;
		fullscreen?: boolean;
		children: any;
	} = $props();

	const windowId = Math.random().toString(36).substring(2, 9);
	let windowEl = $state<HTMLElement | null>(null);
	let contentEl = $state<HTMLElement | null>(null);
	let isMaximized = $state(false);
	let isMinimized = $state(false);
	let isDragging = $state(false);
	let isResizing = $state(false);
	let previousRect = $state({ top: "10%", left: "25%", width: "50%", height: "80%" });

	function handleClose(e?: MouseEvent) {
		if (e) e.stopPropagation();
		onClose();
	}

	function toggleMaximize(e?: MouseEvent) {
		if (e) e.stopPropagation();
		if (!windowEl) return;
		if (isMaximized) {
			windowEl.style.top = previousRect.top;
			windowEl.style.left = previousRect.left;
			windowEl.style.width = previousRect.width;
			windowEl.style.height = previousRect.height;
			isMaximized = false;
		} else {
			previousRect = {
				top: windowEl.style.top || "10%",
				left: windowEl.style.left || "25%",
				width: windowEl.style.width || "50%",
				height: windowEl.style.height || "80%",
			};
			windowEl.style.top = "0";
			windowEl.style.left = "0";
			windowEl.style.width = "100vw";
			windowEl.style.height = "100vh";
			isMaximized = true;
		}
	}

	function toggleMinimize(e?: MouseEvent) {
		if (e) e.stopPropagation();
		isMinimized = true;
		windowManager.addWindow({
			id: windowId,
			title,
			restore: () => restoreFromTaskbar(),
		});
	}

	function restoreFromTaskbar(e?: MouseEvent) {
		if (e) e.stopPropagation();
		isMinimized = false;
		windowManager.removeWindow(windowId);
	}

	function handleDrag(e: MouseEvent) {
		if (isMaximized || !windowEl) return;
		const target = e.target as HTMLElement;
		if (target.closest("button") || target.closest(".control-btn")) return;

		isDragging = true;
		const startX = e.clientX;
		const startY = e.clientY;
		const startLeft = windowEl.offsetLeft;
		const startTop = windowEl.offsetTop;

		function onMouseMove(e: MouseEvent) {
			if (!windowEl) return;

			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const windowWidth = windowEl.offsetWidth;
			const windowHeight = windowEl.offsetHeight;

			let newLeft = startLeft + (e.clientX - startX);
			let newTop = startTop + (e.clientY - startY);

			// Boundary checks: Allow 90% of the window to go off-screen
			// But keep the top bar (40px) or at least 10% of height always reachable at the top
			const minVisibleWidth = windowWidth * 0.1;
			const minVisibleHeight = Math.max(40, windowHeight * 0.1);

			if (newLeft < -windowWidth + minVisibleWidth) newLeft = -windowWidth + minVisibleWidth;
			if (newTop < 0) newTop = 0; // Keep top bar on screen for dragging back
			if (newLeft > viewportWidth - minVisibleWidth) newLeft = viewportWidth - minVisibleWidth;
			if (newTop > viewportHeight - minVisibleHeight) newTop = viewportHeight - minVisibleHeight;

			windowEl.style.left = `${newLeft}px`;
			windowEl.style.top = `${newTop}px`;
		}

		function onMouseUp() {
			isDragging = false;
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		}

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	}

	onMount(() => {
		if (windowEl) {
			if (fullscreen) {
				windowEl.style.width = "100vw";
				windowEl.style.height = "100vh";
				windowEl.style.top = "0";
				windowEl.style.left = "0";
			} else {
				windowEl.style.width = width;
				windowEl.style.height = height;
				windowEl.style.top = "10%";
				windowEl.style.left = "25%";
			}
			applyThemeToElement(windowEl);
		}
	});

	onDestroy(() => {
		windowManager.removeWindow(windowId);
	});

	$effect(() => {
		if (!isMinimized && contentEl && contentEl.innerHTML === "" && typeof children === "function") {
			children(contentEl);
		}
	});
</script>

<div
	class="STYLESHIFT-Window-Container STYLESHIFT-Window STYLESHIFT-Main"
	class:maximized={isMaximized || fullscreen}
	class:fullscreen={fullscreen}
	class:dragging={isDragging}
	class:resizing={isResizing}
	class:minimized={isMinimized}
	bind:this={windowEl}
>
	{#if windowEl && !isMaximized && !fullscreen}
		<WindowResizer
			target={windowEl}
			onResizeStart={() => (isResizing = true)}
			onResizeEnd={() => (isResizing = false)}
		/>
	{/if}

	{#if !fullscreen}
		<div
			class="STYLESHIFT-Window-Topbar"
			onmousedown={handleDrag}
			ondblclick={toggleMaximize}
			role="presentation"
		>
			<div class="STYLESHIFT-Window-Title">
				<img src={getAssetUrl("icon/32.png")} alt="" class="title-icon" />
				<span>{title}</span>
			</div>
			<div class="STYLESHIFT-Window-Controls">
				<button class="control-btn minimize" onclick={(e) => toggleMinimize(e)} title="Minimize">
					<Icon name="minimize" size={14} />
				</button>
				<button
					class="control-btn maximize"
					onclick={(e) => toggleMaximize(e)}
					title={isMaximized ? "Restore" : "Maximize"}
				>
					<Icon name={isMaximized ? "restore" : "maximize"} size={14} />
				</button>
				<button class="control-btn close" onclick={(e) => handleClose(e)} title="Close">
					<Icon name="close" size={16} />
				</button>
			</div>
		</div>
	{/if}

	<div class="STYLESHIFT-Window-Content" bind:this={contentEl}>
		{#if typeof children !== "function"}
			{@render children()}
		{/if}
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Window-Container {
		position: fixed;
		background: var(--Window-BG, #1e1e1e);
		backdrop-filter: var(--Window-Blur) var(--Window-Saturate);
		-webkit-backdrop-filter: var(--Window-Blur) var(--Window-Saturate);
		border: 1px solid var(--White-10);
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
		z-index: 10000;
		overflow: visible;
		transition:
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.3s,
			width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			top 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			border-radius 0.3s;
		pointer-events: all;
		opacity: 0;
		transform: scale(0.95);

		&.maximized {
			border-radius: 0;
			border: none;
		}

		&.fullscreen {
			border-radius: 0;
			border: none;
			box-shadow: none;
			opacity: 1;
			transform: scale(1);
		}

		&.dragging,
		&.resizing {
			transition: none !important;
		}

		&.minimized {
			transform: translateY(100px) scale(0.8) !important;
			opacity: 0 !important;
			pointer-events: none !important;
		}
	}

	.STYLESHIFT-Window-Topbar {
		height: 40px;
		background: var(--Black-20);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10px;
		cursor: move;
		user-select: none;
		border-bottom: 1px solid var(--White-05);
		flex-shrink: 0;
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
	}

	.STYLESHIFT-Window-Title {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		font-weight: 600;
		color: var(--White-80);
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
		color: var(--White-60);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background: var(--White-10);
			color: white;
		}

		&.close:hover {
			background: #e81123;
		}
	}

	.STYLESHIFT-Window-Content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		padding: 10px;
		border-bottom-left-radius: 12px;
		border-bottom-right-radius: 12px;

		:global(.fullscreen) & {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			padding: 0;
		}
	}
</style>
