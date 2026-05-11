import { getVideoElement, isYoutubeFullscreen } from "@extensions/youtube/modules/youtube";
import { logger } from "@shared/logger";
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

	if (state.canvas.style.height !== "100%") {
		state.canvas.style.height = "100%";
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

	const newAspectRatio = `${ratio} / 1`;
	if (container.style.aspectRatio !== newAspectRatio) {
		container.style.setProperty("display", "flex", "important");
		container.style.setProperty("align-items", "center", "important");
		container.style.setProperty("justify-content", "center", "important");
		container.style.setProperty("align-self", "center", "important");
		container.style.setProperty("width", "100%", "important");
		container.style.setProperty("height", "100%", "important");
		container.style.setProperty("aspect-ratio", newAspectRatio, "important");
		container.style.setProperty("overflow", "hidden", "important");
	}

	if (video.style.objectFit !== "cover") {
		video.style.setProperty("width", "100%", "important");
		video.style.setProperty("height", "100%", "important");
		video.style.setProperty("top", "0", "important");
		video.style.setProperty("left", "0", "important");
		video.style.setProperty("margin", "0", "important");
		video.style.setProperty("object-fit", "cover", "important");
	}

	if (settings.debugInfo) {
		logger.debug("RemoveBlackBars", `enableUltraWide: ratio=${ratio.toFixed(2)}`);
	}
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
	container.style.height = "";
	container.style.aspectRatio = "";
	container.style.overflow = "";
	video.style.width = "";
	video.style.height = "";
	video.style.objectFit = "";
	if (settings.debugInfo) {
		logger.debug("RemoveBlackBars", "disableUltraWide");
	}
}

export async function checkUltraWide() {
	const video = await getVideoElement();
	if (!video || !video.parentElement || !video.parentElement.parentElement) return;
	const player = video.parentElement.parentElement;
	const rect = player.getBoundingClientRect();
	const currentRatio = rect.width / rect.height;

	if (settings.debugInfo) {
		logger.debug("RemoveBlackBars", `checkUltraWide: playerRatio=${currentRatio.toFixed(2)}`);
	}

	if (Math.abs(parseFloat(ultraWideRatio) - currentRatio) < 0.15) {
		enableUltraWide(currentRatio);
	} else if (state.isUltraWideMode) {
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
		video.style.transition = "none";
	} else {
		const transition = "all 0.5s ease-out";
		videoContainer.style.transition = transition;
		video.style.transition = transition;
	}

	if (barHeight <= 10) {
		videoContainer.style.setProperty("height", "100%", "important");
		videoContainer.style.setProperty("width", "100%", "important");
		videoContainer.style.aspectRatio = "";
		video.style.transform = "";
		video.style.objectFit = "";
		if (!settings.ultrawide) {
			disableUltraWide();
		}
	} else {
		const contentHeight = totalHeight - barHeight * 2;
		const contentWidth = video.videoWidth || (totalHeight * (16 / 9));
		const ratio = contentWidth / contentHeight;
		const newAspectRatio = `${ratio} / 1`;

		// Apply consistent sizing regardless of monitor type.
		// Aspect-ratio and align-self:center will handle the rest.
		videoContainer.style.setProperty("display", "flex", "important");
		videoContainer.style.setProperty("align-items", "center", "important");
		videoContainer.style.setProperty("justify-content", "center", "important");
		videoContainer.style.setProperty("align-self", "center", "important");
		videoContainer.style.setProperty("width", "100%", "important");
		videoContainer.style.setProperty("height", "auto", "important");
		videoContainer.style.setProperty("min-height", "0", "important");
		videoContainer.style.setProperty("max-height", "100%", "important");
		videoContainer.style.setProperty("aspect-ratio", newAspectRatio, "important");
		videoContainer.style.setProperty("overflow", "hidden", "important");

		// Force video to fill container and crop bars via object-fit
		video.style.setProperty("width", "100%", "important");
		video.style.setProperty("height", "100%", "important");
		video.style.setProperty("top", "0", "important");
		video.style.setProperty("left", "0", "important");
		video.style.setProperty("margin", "0", "important");
		video.style.setProperty("object-fit", "cover", "important");
		video.style.transform = "";
	}

	state.lastHeight = barHeight;
}
