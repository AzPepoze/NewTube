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
		center = false,
		mini = false,
		aspectRatio = 0,
		top = "",
		left = "",
		bottom = "",
		right = "",
		autoHideTopbar = false,
		noPadding = false,
		minVisibleRatio = 0.1,
		disableBackdropFilter = false,
		topbarChildren,
		children,
		el = $bindable(null),
		onPositionChange = () => {},
	}: {
		title?: string;
		onClose?: () => void;
		width?: string;
		height?: string;
		fullscreen?: boolean;
		center?: boolean;
		mini?: boolean;
		aspectRatio?: number;
		top?: string;
		left?: string;
		bottom?: string;
		right?: string;
		autoHideTopbar?: boolean;
		noPadding?: boolean;
		minVisibleRatio?: number;
		disableBackdropFilter?: boolean;
		topbarChildren?: any;
		children: any;
		el?: HTMLElement | null;
		onPositionChange?: (pos: {
			top: string;
			left: string;
			bottom: string;
			right: string;
			width: string;
			height: string;
		}) => void;
	} = $props();

	const windowId = Math.random().toString(36).substring(2, 9);
	let windowEl = $state<HTMLElement | null>(null);
	let contentEl = $state<HTMLElement | null>(null);
	let isMaximized = $state(false);
	let isMinimized = $state(false);
	let isDragging = $state(false);
	let isResizing = $state(false);
	let isHovering = $state(false);
	let activityTimeout: any;

	function handleActivity() {
		if (!autoHideTopbar) return;
		isHovering = true;
		clearTimeout(activityTimeout);
		activityTimeout = setTimeout(() => {
			if (!isDragging && !isResizing) {
				isHovering = false;
			}
		}, 2000);
	}
	let previousRect = $state({
		top: "10%",
		left: "25%",
		width: "50%",
		height: "80%",
	});

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

			const minVisibleWidth = windowWidth * minVisibleRatio;
			const minVisibleHeight = Math.max(
				40,
				windowHeight * minVisibleRatio,
			);

			if (newLeft < -windowWidth + minVisibleWidth)
				newLeft = -windowWidth + minVisibleWidth;
			if (newTop < 0) newTop = 0;
			if (newLeft > viewportWidth - minVisibleWidth)
				newLeft = viewportWidth - minVisibleWidth;
			if (newTop > viewportHeight - minVisibleHeight)
				newTop = viewportHeight - minVisibleHeight;

			windowEl.style.left = `${newLeft}px`;
			windowEl.style.top = `${newTop}px`;
		}

		function onMouseUp() {
			isDragging = false;
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			if (windowEl) {
				onPositionChange({
					top: windowEl.style.top,
					left: windowEl.style.left,
					bottom: windowEl.style.bottom,
					right: windowEl.style.right,
					width: windowEl.style.width,
					height: windowEl.style.height,
				});
			}
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

				if (center) {
					const vw = Math.max(
						document.documentElement.clientWidth || 0,
						window.innerWidth || 0,
					);
					const vh = Math.max(
						document.documentElement.clientHeight || 0,
						window.innerHeight || 0,
					);

					windowEl.style.top = `calc(${vh / 2}px - (${height} / 2))`;
					windowEl.style.left = `calc(${vw / 2}px - (${width} / 2))`;
				} else {
					if (top) {
						windowEl.style.top = top;
						windowEl.style.bottom = "auto";
					}
					if (left) {
						windowEl.style.left = left;
						windowEl.style.right = "auto";
					}
					if (bottom) {
						windowEl.style.bottom = bottom;
						windowEl.style.top = "auto";
					}
					if (right) {
						windowEl.style.right = right;
						windowEl.style.left = "auto";
					}

					if (!top && !left && !bottom && !right) {
						windowEl.style.top = "10%";
						windowEl.style.left = "25%";
					}
				}
			}
			applyThemeToElement(windowEl);
		}
	});

	onDestroy(() => {
		windowManager.removeWindow(windowId);
		clearTimeout(activityTimeout);
	});

	$effect(() => {
		if (
			!isMinimized &&
			contentEl &&
			contentEl.childElementCount === 0 &&
			typeof children === "function"
		) {
			try {
				children(contentEl);
			} catch (e) {}
		}
	});
</script>

<div
	class="STYLESHIFT-Window-Container STYLESHIFT-Window STYLESHIFT-Main"
	class:maximized={isMaximized || fullscreen}
	class:fullscreen
	class:dragging={isDragging}
	class:resizing={isResizing}
	class:minimized={isMinimized}
	class:mini
	class:auto-hide-topbar={autoHideTopbar}
	class:disable-backdrop-filter={disableBackdropFilter}
	class:hide-topbar={autoHideTopbar &&
		!isHovering &&
		!isDragging &&
		!isResizing}
	onmousemove={handleActivity}
	bind:this={windowEl}
	bind:this={el}
	role="presentation"
>
	{#if windowEl && !isMaximized && !fullscreen}
		<WindowResizer
			target={windowEl}
			{aspectRatio}
			onResizeStart={() => (isResizing = true)}
			onResizeEnd={() => {
				isResizing = false;
				if (windowEl) {
					onPositionChange({
						top: windowEl.style.top,
						left: windowEl.style.left,
						bottom: windowEl.style.bottom,
						right: windowEl.style.right,
						width: windowEl.style.width,
						height: windowEl.style.height,
					});
				}
			}}
		/>
	{/if}

	<div class="STYLESHIFT-Window-Clipper">
		{#if !fullscreen}
			<div
				class="STYLESHIFT-Window-Topbar"
				onmousedown={handleDrag}
				ondblclick={toggleMaximize}
				role="presentation"
			>
				<div class="STYLESHIFT-Window-Title">
					<img
						src={getAssetUrl("icon/32.png")}
						alt=""
						class="title-icon"
					/>
					<span>{title}</span>
				</div>
				<div class="STYLESHIFT-Window-Topbar-Right">
					{#if topbarChildren}
						<div class="topbar-extra">
							{@render topbarChildren()}
						</div>
					{/if}
					<div class="STYLESHIFT-Window-Controls">
						<button
							class="control-btn minimize"
							onclick={(e) => toggleMinimize(e)}
							title="Minimize"
						>
							<Icon name="minimize" size={14} />
						</button>
						<button
							class="control-btn maximize"
							onclick={(e) => toggleMaximize(e)}
							title={isMaximized ? "Restore" : "Maximize"}
						>
							<Icon
								name={isMaximized ? "restore" : "maximize"}
								size={14}
							/>
						</button>
						<button
							class="control-btn close"
							onclick={(e) => handleClose(e)}
							title="Close"
						>
							<Icon name="close" size={16} />
						</button>
					</div>
				</div>
			</div>
		{/if}

		<div
			class="STYLESHIFT-Window-Content"
			class:no-padding={noPadding}
			bind:this={contentEl}
		>
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Window-Container {
		position: fixed;
		background: var(--Window-BG, #1e1e1e);
		backdrop-filter: var(--Window-Blur) var(--Window-Saturate);
		-webkit-backdrop-filter: var(--Window-Blur) var(--Window-Saturate);

		&.disable-backdrop-filter {
			backdrop-filter: none !important;
			-webkit-backdrop-filter: none !important;
		}

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

		&.hide-topbar {
			.STYLESHIFT-Window-Topbar {
				transform: translateY(-100%);
				opacity: 0;
				pointer-events: none;
			}
		}

		&.auto-hide-topbar {
			.STYLESHIFT-Window-Topbar {
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

			.STYLESHIFT-Window-Content {
				height: 100%;
				padding-top: 0;
			}
		}

		&.mini {
			border-radius: 8px;
			.STYLESHIFT-Window-Clipper {
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

				.STYLESHIFT-Window-Topbar {
					height: 32px;
					padding: 0 8px;
					border-top-left-radius: 8px;
					border-top-right-radius: 8px;
				}

				.STYLESHIFT-Window-Title {
					font-size: 11px;
					gap: 6px;
					.title-icon {
						width: 14px;
						height: 14px;
					}
				}

				.control-btn {
					width: 24px;
					height: 24px;
					border-radius: 4px;
				}

				.STYLESHIFT-Window-Content {
					padding: 0;
					border-bottom-left-radius: 8px;
					border-bottom-right-radius: 8px;
				}
			}
		}
	}

	.STYLESHIFT-Window-Clipper {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: inherit;
		display: flex;
		flex-direction: column;
		position: relative;
		background: var(--Window-BG, #1e1e1e);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
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

		&.no-padding {
			padding: 0 !important;
		}

		:global(.fullscreen) & {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			padding: 0;
		}
	}
</style>
