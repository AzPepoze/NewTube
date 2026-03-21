<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import WindowResizer from "./WindowResizer.svelte";
	import { applyThemeToElement } from "../../theme";
	import { WindowLogic } from "./windowLogic.svelte";
	import { constrainWindowPosition } from "./windowUtils";
	import WindowTitlebar from "./WindowTitlebar.svelte";

	let {
		title = "StyleShift",
		onClose = () => {},
		width = "600px",
		height = "400px",
		fullscreen = false,
		center = false,
		mini = false,
		aspectRatio = 0,
		autoHideTopbar = false,
		noPadding = false,
		minVisibleRatio = 0.1,
		disableBackdropFilter = false,
		topbarChildren,
		children,
		el = $bindable(null),
		onPositionChange = () => {},
		translate = "",
	}: {
		title?: string;
		onClose?: () => void;
		width?: string;
		height?: string;
		fullscreen?: boolean;
		center?: boolean;
		mini?: boolean;
		aspectRatio?: number;
		autoHideTopbar?: boolean;
		noPadding?: boolean;
		minVisibleRatio?: number;
		disableBackdropFilter?: boolean;
		topbarChildren?: any;
		children: any;
		el?: HTMLElement | null;
		onPositionChange?: (pos: {
			translate: string;
			width: string;
			height: string;
		}) => void;
		translate?: string;
	} = $props();

	const windowId = Math.random().toString(36).substring(2, 9);
	let windowEl = $state<HTMLElement | null>(null);
	let contentEl = $state<HTMLElement | null>(null);

	const logic = new WindowLogic({
		windowId,
		onClose: () => onClose(),
		onPositionChange: (pos) => onPositionChange(pos),
	});

	onMount(() => {
		if (windowEl) {
			if (fullscreen) {
				windowEl.style.width = "100vw";
				windowEl.style.height = "100vh";
				windowEl.style.translate = "0px 0px";
			} else {
				windowEl.style.width = width;
				windowEl.style.height = height;

				let initialLeft = 0;
				let initialTop = 0;

				if (translate) {
					const [x, y] = translate.split(" ");
					initialLeft = parseInt(x) || 0;
					initialTop = parseInt(y) || 0;
				} else if (center) {
					const vw = Math.max(
						document.documentElement.clientWidth || 0,
						window.innerWidth || 0,
					);
					const vh = Math.max(
						document.documentElement.clientHeight || 0,
						window.innerHeight || 0,
					);

					initialLeft = Math.round(
						vw / 2 - windowEl.offsetWidth / 2,
					);
					initialTop = Math.round(
						vh / 2 - windowEl.offsetHeight / 2,
					);
				} else {
					initialLeft = window.innerWidth * 0.25;
					initialTop = window.innerHeight * 0.1;
				}

				const constrained = constrainWindowPosition(
					initialLeft,
					initialTop,
					windowEl.offsetWidth || parseInt(width),
					windowEl.offsetHeight || parseInt(height),
					minVisibleRatio,
				);

				const finalTranslate = `${constrained.left}px ${constrained.top}px`;
				windowEl.style.translate = finalTranslate;

				if (initialLeft !== constrained.left || initialTop !== constrained.top) {
					onPositionChange({
						translate: finalTranslate,
						width: windowEl.style.width,
						height: windowEl.style.height,
					});
				}
			}
			applyThemeToElement(windowEl);
			window.addEventListener("resize", handleViewportResize);
		}
	});

	function handleViewportResize() {
		if (!windowEl || logic.isMaximized || logic.isDragging || logic.isResizing || fullscreen) return;

		const currentTranslate = windowEl.style.translate || "0px 0px";
		const [x, y] = currentTranslate.split(" ");
		const currentLeft = parseInt(x) || 0;
		const currentTop = parseInt(y) || 0;

		const constrained = constrainWindowPosition(
			currentLeft,
			currentTop,
			windowEl.offsetWidth,
			windowEl.offsetHeight,
			minVisibleRatio,
		);

		if (currentLeft !== constrained.left || currentTop !== constrained.top) {
			const finalTranslate = `${constrained.left}px ${constrained.top}px`;
			windowEl.style.translate = finalTranslate;
			onPositionChange({
				translate: finalTranslate,
				width: windowEl.style.width,
				height: windowEl.style.height,
			});
		}
	}

	onDestroy(() => {
		window.removeEventListener("resize", handleViewportResize);
		logic.destroy();
	});

	$effect(() => {
		logic.title = title;
		logic.autoHideTopbar = autoHideTopbar;
	});

	$effect(() => {
		if (
			!logic.isMinimized &&
			contentEl &&
			contentEl.childElementCount === 0 &&
			typeof children === "function"
		) {
			try {
				children(contentEl);
			} catch (_e) {}
		}
	});
</script>

<div
	class="STYLESHIFT-Window-Container STYLESHIFT-Window STYLESHIFT-Main"
	class:maximized={logic.isMaximized || fullscreen}
	class:fullscreen
	class:dragging={logic.isDragging}
	class:resizing={logic.isResizing}
	class:minimized={logic.isMinimized}
	class:mini
	class:auto-hide-topbar={autoHideTopbar}
	class:disable-backdrop-filter={disableBackdropFilter}
	class:hide-topbar={autoHideTopbar &&
		!logic.isHovering &&
		!logic.isDragging &&
		!logic.isResizing}
	onmousemove={logic.handleActivity}
	bind:this={windowEl}
	bind:this={el}
	data-window-id={windowId}
	role="presentation"
>
	{#if windowEl && !logic.isMaximized && !fullscreen}
		<WindowResizer
			target={windowEl}
			{aspectRatio}
			onResizeStart={() => (logic.isResizing = true)}
			onResizeEnd={() => {
				logic.isResizing = false;
				if (windowEl) {
					onPositionChange({
						translate: windowEl.style.translate,
						width: windowEl.style.width,
						height: windowEl.style.height,
					});
				}
			}}
		/>
	{/if}

	<div class="STYLESHIFT-Window-Clipper">
		{#if !fullscreen}
			<WindowTitlebar
				{title}
				isMaximized={logic.isMaximized}
				onDragStart={(e) => logic.handleDrag(e, minVisibleRatio)}
				onMaximize={logic.toggleMaximize}
				onMinimize={logic.toggleMinimize}
				onClose={logic.handleClose}
				{topbarChildren}
			/>
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
		top: 0;
		left: 0;
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
			:global(.STYLESHIFT-Window-Topbar) {
				transform: translateY(-100%);
				opacity: 0;
				pointer-events: none;
			}
		}

		&.auto-hide-topbar {
			.STYLESHIFT-Window-Content {
				height: 100%;
				padding-top: 0;
			}
		}

		&.mini {
			border-radius: 8px;
			.STYLESHIFT-Window-Clipper {
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

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
