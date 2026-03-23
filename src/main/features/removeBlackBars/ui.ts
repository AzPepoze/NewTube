import { isYoutubeFullscreen, getVideoElement } from "../../modules/youtube";
import { state } from "./state";
import { settings } from "./settings";

const ultraWideRatio = (21 / 9).toFixed(2);

export async function createDebugUI() {
	if (!state.enabled || !settings.debugInfo) return;
	if (state.debugContainer) return;

	state.debugContainer = document.createElement("div");
	state.debugContainer.id = "newtube-bars-debug";
	Object.assign(state.debugContainer.style, {
		position: "absolute",
		top: "10px",
		right: "10px",
		padding: "12px",
		background: "rgba(0, 0, 0, 0.6)",
		color: "white",
		fontFamily: "inherit",
		fontSize: "13px",
		zIndex: "2000000",
		pointerEvents: "none",
		borderRadius: "8px",
		lineHeight: "1.4",
		boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
		display: "none",
	});

	const video = await getVideoElement();
	const container = video?.parentElement;
	if (container) {
		container.appendChild(state.debugContainer);
	}
}

export async function updateDebugUI(finalDetectedHeight?: number, vHeight?: number) {
	if (!state.enabled || !settings.debugInfo) {
		removeDebugUI();
		return;
	}

	if (!state.debugContainer) {
		await createDebugUI();
		if (!state.debugContainer) return;
	}

	if (vHeight !== undefined) state.vHeight = vHeight;

	const video = await getVideoElement();
	const container = video?.parentElement;
	if (container && state.debugContainer.parentElement !== container) {
		container.appendChild(state.debugContainer);
	}

	const currentVHeight = vHeight || state.vHeight || video?.videoHeight || 0;
	const currentDetectedHeight = finalDetectedHeight !== undefined ? finalDetectedHeight : state.lastHeight;

	const needCrop = currentDetectedHeight > 10;
	const cropPercent = currentVHeight > 0 ? ((currentDetectedHeight * 2) / currentVHeight) * 100 : 0;

	state.debugContainer.innerHTML = `
		<div style="font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 5px; padding-bottom: 2px;">NewTube Remove Bars Debug</div>
		<div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 5px 15px;">
			<span>Interval:</span> <span>${state.currentInterval}ms</span>
			<span>Latency:</span> <span>${state.processLatency.toFixed(2)}ms</span>
			<span>Worker:</span> <span>${state.worker ? "Yes" : "No"}</span>
			<span>Dropped:</span> <span>${state.droppedFrames}</span>
			<span>Sample:</span> <span>
				<div style="width: 100%; height: 16px; background: ${state.lastSampleColor}; border: 1px solid rgba(255,255,255,0.8); border-radius: 4px; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>
			</span>
			<span>Detected:</span> <span>${currentDetectedHeight}px</span>
			<span>Need Crop:</span> <span style="color: ${needCrop ? "#00ff00" : "#ff4444"}">${needCrop}</span>
			<span>Crop:</span> <span>${cropPercent.toFixed(1)}%</span>
			<span>vHeight:</span> <span>${currentVHeight}px</span>
			<span>UltraWide:</span> <span>${state.isUltraWideMode}</span>
			<span>Fullscreen:</span> <span>${isYoutubeFullscreen}</span>
		</div>
	`;
	state.debugContainer.style.display = "block";
}

export function removeDebugUI() {
	if (state.debugContainer) {
		state.debugContainer.remove();
		state.debugContainer = null;
	}
}

export async function createDebugCanvas() {
	if (!state.enabled || !settings.debugCanvas) return;
	const video = await getVideoElement();
	if (!video || !video.parentElement) return;

	if (!state.canvas) {
		state.canvas = document.createElement("canvas");
		state.canvas.width = 5;
		state.ctx = state.canvas.getContext("2d", { alpha: false });
		state.canvas.id = "NewtubeVDOCanvas";
	}

	const vHeight = video.videoHeight;
	if (state.canvas.height !== vHeight) {
		state.canvas.height = vHeight;
	}

	const videoRect = video.getBoundingClientRect();
	if (!state.canvas.parentElement) {
		const container = video.parentElement;
		container.appendChild(state.canvas);
		state.canvas.style.position = "absolute";
		state.canvas.style.top = "0px";
		state.canvas.style.left = "0px";
		state.canvas.style.width = "50px";
		state.canvas.style.zIndex = "1000";
		state.canvas.style.imageRendering = "pixelated";
		state.canvas.style.pointerEvents = "none";
	}

	if (state.canvas.style.height !== `${videoRect.height}px`) {
		state.canvas.style.height = `${videoRect.height}px`;
	}
	state.canvas.style.display = "block";
}

export function hideDebugCanvas() {
	if (state.canvas) {
		state.canvas.style.display = "none";
		if (state.canvas.parentNode) state.canvas.remove();
	}
}

export function removeDebugCanvas() {
	hideDebugCanvas();
	state.canvas = null;
	state.ctx = null;
}

export async function enableUltraWide(ratio: number) {
	const video = await getVideoElement();
	if (!video || !video.parentElement) return;

	const container = video.parentElement;
	if (state.isUltraWideMode && container.style.aspectRatio) return;

	state.isUltraWideMode = true;
	const mainContainer = container.parentElement;
	if (!mainContainer) return;

	const mainRect = mainContainer.getBoundingClientRect();
	const imagineWidth = ratio * mainRect.height;

	if (imagineWidth > mainRect.width) {
		container.style.width = "100%";
		container.style.height = "auto";
	} else {
		container.style.width = "auto";
		container.style.height = "100%";
	}
	container.style.aspectRatio = `${ratio} / 1`;
	video.style.width = "100%";
}

export async function disableUltraWide() {
	const video = await getVideoElement();
	const container = video?.parentElement;

	if (!state.isUltraWideMode && (!container || !container.style.aspectRatio)) {
		return;
	}

	state.isUltraWideMode = false;
	if (!video || !container) return;

	container.style.width = "";
	container.style.aspectRatio = "";
	video.style.width = "";
	state.lastHeight = 0;
}

export async function checkUltraWide() {
	const video = await getVideoElement();
	if (!video || !video.parentElement) return;
	const parent = video.parentElement;
	const rect = parent.getBoundingClientRect();
	const currentRatio = rect.width / rect.height;

	if (Math.abs(parseFloat(ultraWideRatio) - currentRatio) < 0.15) {
		enableUltraWide(currentRatio);
	} else {
		disableUltraWide();
	}
}

export async function applyCrop(barHeight: number, totalHeight: number) {
	const video = await getVideoElement();
	const videoContainer = video?.parentElement;
	if (!videoContainer || !video) return;

	// Bar bigger than before, snap immediately to avoid showing bars during transition
	if (barHeight > state.lastHeight) {
		videoContainer.style.transition = "none";
	} else {
		videoContainer.style.transition = "all 0.5s ease-out";
	}

	if (barHeight <= 10) {
		videoContainer.style.height = "100%";
		if (!settings.ultrawide) {
			disableUltraWide();
		}
	} else {
		const contentHeight = totalHeight - barHeight * 2;
		const scale = contentHeight / totalHeight;
		videoContainer.style.height = `${scale * 100}%`;
	}

	if (!state.isUltraWideMode) {
		videoContainer.style.aspectRatio = "";
	}
	state.lastHeight = barHeight;
}
