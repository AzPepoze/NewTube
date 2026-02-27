import { logger } from "@/shared/logger";
import { isYoutubeFullscreen, getVideoElement } from "../../modules/youtube";
import { state } from "./state";

const ultraWideRatio = (21 / 9).toFixed(2);

export async function updateDebugUI(finalDetectedHeight?: number, vHeight?: number) {
	if (vHeight !== undefined) state.vHeight = vHeight;

	if (!state.debugContainer) {
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
		});
	}

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

export async function enableUltraWide(ratio: number) {
	if (state.isUltraWideMode) return;
	const video = await getVideoElement();
	if (!video || !video.parentElement) return;

	state.isUltraWideMode = true;
	const container = video.parentElement;
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
	if (!state.isUltraWideMode) return;
	state.isUltraWideMode = false;
	const video = await getVideoElement();
	if (!video || !video.parentElement) return;

	const container = video.parentElement;
	container.style.width = "";
	container.style.height = "";
	container.style.aspectRatio = "";
	video.style.width = "";
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
		disableUltraWide();
	} else {
		const contentHeight = totalHeight - barHeight * 2;
		const scale = contentHeight / totalHeight;
		videoContainer.style.height = `${scale * 100}%`;
	}

	videoContainer.style.aspectRatio = "";
	state.lastHeight = barHeight;
}
