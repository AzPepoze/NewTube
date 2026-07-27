import { getVideoElement, isYoutubeFullscreen } from "@extensions/youtube/modules/youtube";
import { settings } from "./settings";
import { state } from "./state";

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

export async function updateDebugUI(
	finalDetectedHeight?: number,
	vHeight?: number,
	finalDetectedWidth?: number,
	vWidth?: number,
) {
	if (!state.enabled || !settings.debugInfo) {
		removeDebugUI();
		return;
	}

	if (!state.debugContainer) {
		await createDebugUI();
		if (!state.debugContainer) return;
	}

	if (vHeight !== undefined) state.vHeight = vHeight;
	if (vWidth !== undefined) state.vWidth = vWidth;

	const video = await getVideoElement();
	const container = video?.parentElement;
	if (container && state.debugContainer.parentElement !== container) {
		container.appendChild(state.debugContainer);
	}

	const currentVHeight = vHeight || state.vHeight || video?.videoHeight || 0;
	const currentVWidth = vWidth || state.vWidth || video?.videoWidth || 0;
	const currentDetectedHeight = finalDetectedHeight !== undefined ? finalDetectedHeight : state.lastHeight;
	const currentDetectedWidth = finalDetectedWidth !== undefined ? finalDetectedWidth : state.lastWidth;

	const needCropV = currentDetectedHeight > 10;
	const needCropH = currentDetectedWidth > 10;
	const cropPercentV = currentVHeight > 0 ? ((currentDetectedHeight * 2) / currentVHeight) * 100 : 0;
	const cropPercentH = currentVWidth > 0 ? ((currentDetectedWidth * 2) / currentVWidth) * 100 : 0;

	state.debugContainer.innerHTML = `
		<div style="font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 5px; padding-bottom: 2px;">NewTube Remove Bars Debug</div>
		<div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 5px 15px;">
			<span>Mode:</span> <span style="text-transform: capitalize;">${settings.mode}</span>
			<span>Interval:</span> <span>${state.currentInterval}ms</span>
			<span>Latency:</span> <span>${state.processLatency.toFixed(2)}ms</span>
			<span>Worker:</span> <span>${state.worker ? "Yes" : "No"}</span>
			<span>Dropped:</span> <span>${state.droppedFrames}</span>
			<span>Sample (V/H):</span> <span style="display: flex; gap: 5px;">
				<div style="width: 100%; height: 16px; background: ${state.lastSampleColorV}; border: 1px solid rgba(255,255,255,0.8); border-radius: 4px; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>
				<div style="width: 100%; height: 16px; background: ${state.lastSampleColorH}; border: 1px solid rgba(255,255,255,0.8); border-radius: 4px; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>
			</span>
			<span>V-Detected:</span> <span>${currentDetectedHeight}px (${cropPercentV.toFixed(1)}%)</span>
			<span>H-Detected:</span> <span>${currentDetectedWidth}px (${cropPercentH.toFixed(1)}%)</span>
			<span>Need Crop (V/H):</span> <span><span style="color: ${needCropV ? "#00ff00" : "#ff4444"}">${needCropV}</span> / <span style="color: ${needCropH ? "#00ff00" : "#ff4444"}">${needCropH}</span></span>
			<span>vSize:</span> <span>${currentVWidth}x${currentVHeight}</span>
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

	const container = video.parentElement;
	const vHeight = video.videoHeight;
	const vWidth = video.videoWidth;

	// Vertical Debug Canvas (Left side)
	if (settings.mode === "vertical" || settings.mode === "both") {
		if (!state.canvas) {
			state.canvas = document.createElement("canvas");
			state.canvas.width = 5;
			state.ctx = state.canvas.getContext("2d", { alpha: false });
			state.canvas.id = "NewtubeVDOCanvas";
		}
		if (state.canvas.height !== vHeight) {
			state.canvas.height = vHeight;
		}

		if (state.canvas.parentElement !== container) {
			container.appendChild(state.canvas);
			state.canvas.style.position = "absolute";
			state.canvas.style.width = "50px";
			state.canvas.style.zIndex = "1000";
			state.canvas.style.imageRendering = "pixelated";
			state.canvas.style.pointerEvents = "none";
		}

		const videoRect = video.getBoundingClientRect();
		if (state.canvas.style.height !== `${videoRect.height}px`) {
			state.canvas.style.height = `${videoRect.height}px`;
		}

		// Align with video element position
		if (state.canvas.style.top !== video.style.top) state.canvas.style.top = video.style.top;
		if (state.canvas.style.left !== video.style.left) state.canvas.style.left = video.style.left;

		state.canvas.style.display = "block";
	} else if (state.canvas) {
		state.canvas.style.display = "none";
	}

	// Horizontal Debug Canvas (Top side)
	if (settings.mode === "horizontal" || settings.mode === "both") {
		if (!state.hCanvas) {
			state.hCanvas = document.createElement("canvas");
			state.hCanvas.height = 5;
			state.hCtx = state.hCanvas.getContext("2d", { alpha: false });
			state.hCanvas.id = "NewtubeVDOCanvasH";
		}
		if (state.hCanvas.width !== vWidth) {
			state.hCanvas.width = vWidth;
		}

		if (state.hCanvas.parentElement !== container) {
			container.appendChild(state.hCanvas);
			state.hCanvas.style.position = "absolute";
			state.hCanvas.style.height = "50px";
			state.hCanvas.style.zIndex = "1000";
			state.hCanvas.style.imageRendering = "pixelated";
			state.hCanvas.style.pointerEvents = "none";
		}

		const videoRect = video.getBoundingClientRect();
		if (state.hCanvas.style.width !== `${videoRect.width}px`) {
			state.hCanvas.style.width = `${videoRect.width}px`;
		}

		// Align with video element position
		if (state.hCanvas.style.top !== video.style.top) state.hCanvas.style.top = video.style.top;
		if (state.hCanvas.style.left !== video.style.left) state.hCanvas.style.left = video.style.left;

		state.hCanvas.style.display = "block";
	} else if (state.hCanvas) {
		state.hCanvas.style.display = "none";
	}
}

export function hideDebugCanvas() {
	if (state.canvas) {
		state.canvas.style.display = "none";
		if (state.canvas.parentNode) state.canvas.remove();
	}
	if (state.hCanvas) {
		state.hCanvas.style.display = "none";
		if (state.hCanvas.parentNode) state.hCanvas.remove();
	}
}

export function removeDebugCanvas() {
	hideDebugCanvas();
	state.canvas = null;
	state.ctx = null;
	state.hCanvas = null;
	state.hCtx = null;
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
	state.lastWidth = 0;
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

export async function applyCrop(barHeight: number, totalHeight: number, barWidth: number = 0, totalWidth: number = 0) {
	const video = await getVideoElement();
	const videoContainer = video?.parentElement;
	if (!videoContainer || !video) return;

	const mode = settings.mode;

	const isGrowingV = (mode === "vertical" || mode === "both") && barHeight > state.lastHeight;
	const isGrowingH = (mode === "horizontal" || mode === "both") && barWidth > state.lastWidth;

	const isShrinkingV = (mode === "vertical" || mode === "both") && barHeight < state.lastHeight;
	const isShrinkingH = (mode === "horizontal" || mode === "both") && barWidth < state.lastWidth;

	if (isShrinkingV || isShrinkingH) {
		videoContainer.style.setProperty("transition", "all 0.5s ease-out", "important");
	} else if (isGrowingV || isGrowingH) {
		videoContainer.style.setProperty("transition", "none", "important");
	} else {
		videoContainer.style.setProperty("transition", "all 0.5s ease-out", "important");
	}

	videoContainer.style.transform = "";

	// 1. Vertical crop (top & bottom black bars)
	if ((mode === "vertical" || mode === "both") && barHeight > 10 && totalHeight > 0) {
		const contentHeight = totalHeight - barHeight * 2;
		const scaleY = contentHeight / totalHeight;
		videoContainer.style.setProperty("height", `${scaleY * 100}%`, "important");
	} else {
		videoContainer.style.setProperty("height", "100%", "important");
	}

	// 2. Horizontal crop (left & right black bars)
	if ((mode === "horizontal" || mode === "both") && barWidth > 10 && totalWidth > 0) {
		const contentWidth = totalWidth - barWidth * 2;
		const scaleX = contentWidth / totalWidth;
		videoContainer.style.setProperty("width", `${scaleX * 100}%`, "important");
		videoContainer.style.setProperty("margin-left", "auto", "important");
		videoContainer.style.setProperty("margin-right", "auto", "important");
		videoContainer.style.setProperty("left", "0px", "important");
	} else {
		videoContainer.style.setProperty("width", "100%", "important");
		videoContainer.style.setProperty("margin-left", "auto", "important");
		videoContainer.style.setProperty("margin-right", "auto", "important");
		videoContainer.style.setProperty("left", "0px", "important");
	}

	if (!settings.ultrawide && mode !== "horizontal") {
		disableUltraWide();
	}

	if (!state.isUltraWideMode) {
		videoContainer.style.aspectRatio = "";
	}
	state.lastHeight = barHeight;
	state.lastWidth = barWidth;
}
