import { state } from "./state";
import { settings } from "./settings";
import { hideBg, showBg } from "../background";

export function fadeIn() {
	if (!state.container || state.isFadedIn) return;
	state.isFadedIn = true;
	requestAnimationFrame(() => {
		if (state.container) {
			state.container.style.opacity = (settings.opacity / 100).toString();
			hideBg();
		}
	});
}

export function fadeOut() {
	if (!state.container || !state.isFadedIn) return;
	state.isFadedIn = false;
	requestAnimationFrame(() => {
		if (state.container) {
			state.container.style.opacity = "0";
			showBg();
		}
	});
}

let lastRect = { top: -1, left: -1, width: -1, height: -1, scrollY: -1, scrollX: -1 };

export function updateLayout(video: HTMLVideoElement) {
	if (!state.wrapper || !state.canvas || !state.overlay) return;

	const rect = video.getBoundingClientRect();
	const { scrollY, scrollX } = window;

	if (
		rect.top === lastRect.top &&
		rect.left === lastRect.left &&
		rect.width === lastRect.width &&
		rect.height === lastRect.height &&
		scrollY === lastRect.scrollY &&
		scrollX === lastRect.scrollX
	)
		return;

	Object.assign(lastRect, {
		top: rect.top,
		left: rect.left,
		width: rect.width,
		height: rect.height,
		scrollY,
		scrollX,
	});

	const { style: wStyle } = state.wrapper;
	wStyle.marginTop = `${rect.top + scrollY}px`;
	wStyle.marginLeft = `${rect.left + scrollX}px`;
	wStyle.width = `${rect.width}px`;
	wStyle.height = `${rect.height}px`;

	const { style: cStyle } = state.canvas;
	cStyle.width = `${rect.width}px`;
	cStyle.height = `${rect.height}px`;

	const vSize = Math.min(rect.width, rect.height) * 0.2;
	state.overlay.style.boxShadow = `inset black 0px 0px ${vSize}px ${vSize}px`;
}

export function resetLastRect() {
	Object.assign(lastRect, { top: -1, left: -1, width: -1, height: -1, scrollY: -1, scrollX: -1 });
}

export function updateDebugInfo(video: HTMLVideoElement, frameTime: number) {
	if (!settings.debug) {
		if (state.debugContainer) {
			state.debugContainer.style.display = "none";
		}
		return;
	}

	if (!state.debugContainer) {
		state.debugContainer = document.createElement("div");
		state.debugContainer.id = "newtube-bg-debug";
		Object.assign(state.debugContainer.style, {
			position: "absolute",
			top: "10px",
			left: "10px",
			padding: "12px",
			background: "rgba(0, 0, 0, 0.6)",
			color: "white",
			fontFamily: "inherit",
			fontSize: "13px",
			zIndex: "10000",
			pointerEvents: "none",
			borderRadius: "8px",
			lineHeight: "1.4",
			boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
		});
		video.parentElement?.appendChild(state.debugContainer);
	}

	state.debugContainer.style.display = "block";
	const fps = frameTime > 0 ? Math.round(1000 / frameTime) : 0;
	const engineDisplay = settings.engine === "GPU" ? "WebGL" : "2d canvas";

	state.debugContainer.innerHTML = `
		<div style="font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 5px; padding-bottom: 2px;">NewTube Background Video Debug</div>
		<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px 15px;">
			<span>FPS:</span> <span>${fps} (${Math.round(frameTime)}ms)</span>
			<span>Method:</span> <span>${state.renderMethod}</span>
			<span>Worker:</span> <span>${state.worker ? "Yes" : "No"}</span>
			<span>Latency:</span> <span>${state.lastProcessTime.toFixed(2)}ms</span>
			<span>Dropped (BG):</span> <span>${state.droppedFrames}</span>
			<span>Lagged (BG):</span> <span>${state.laggedFrames}/10</span>
			<span>Engine:</span> <span>${engineDisplay}</span>
			<span>Quality:</span> <span>${settings.quality * 100}%</span>
			<span>Static:</span> <span>${state.isStatic}</span>

			<span>Capturing:</span> <span>${state.isCapturing}</span>
			<span>Rendering:</span> <span>${state.isProcessing}</span>
		</div>
	`;
}
