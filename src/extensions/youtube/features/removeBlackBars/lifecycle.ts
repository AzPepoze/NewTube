import { loadWorker } from "@core/runtime/controller";
import { waitOneFrame } from "@core/shared/eventHelpers";
import { getFromStorage, getUserSetting } from "@core/storage/manager";
import { getVideoElement, onYoutubeFullscreen, videoElement } from "@extensions/youtube/modules/youtube";
import { registerSettingListener } from "@settings/engine/functions";
import { checkBlackBars } from "./logic";
import { loadInitialSettings, settings } from "./settings";
import { state } from "./state";
import { applyCrop, checkUltraWide, createDebugCanvas, createDebugUI, disableUltraWide, removeDebugCanvas, removeDebugUI } from "./ui";

async function initWorkerState() {
	if (state.worker) {
		state.worker.terminate();
		state.worker = null;
		state.workerLoadAttempted = false;
	}

	if (settings.worker && state.enabled) {
		state.worker = await loadWorker("removeBlackBarsWorker.js");
		if (state.worker) {
			state.worker.onmessage = (_e) => {
				state.isChecking = false;
			};
			state.worker.onerror = () => {
				state.isChecking = false;
			};
		}
	}
}

export async function updateRemoveBlackBarsSettings(value?: any, settingId?: string) {
	if (typeof settingId === "string") {
		switch (settingId) {
			case "RemoveBlackBars":
				settings.enabled = value;
				break;
			case "RemoveBlackBarsDebugCanvas":
				settings.debugCanvas = value;
				if (value) createDebugCanvas();
				else removeDebugCanvas();
				break;
			case "RemoveBlackBarsDebugInfo":
				settings.debugInfo = value;
				if (value) createDebugUI();
				else removeDebugUI();
				break;
			case "RemoveBlackBarsLazyCheck":
				settings.lazyCheck = value;
				break;
			case "RemoveBlackBarsLazyAmount":
				settings.lazyAmount = value;
				break;
			case "RemoveBlackBarsUltrawide":
				settings.ultrawide = value;
				if (value) checkUltraWide();
				else disableUltraWide();
				break;
			case "RemoveBlackBarsWorker":
				settings.worker = value;
				initWorkerState();
				break;
			case "RemoveBlackBarsDisableFullscreen":
				settings.disableFullscreen = value;
				break;
		}
	} else {
		await loadInitialSettings();
	}
}

export async function enableRemoveBlackBars() {
	if ((await getFromStorage("enableExtension")) === false) return;
	if (state.enabled) return;
	state.enabled = true;
	const mySession = state.sessionId;

	await initWorkerState();

	const init = async () => {
		state.lastHeight = 0;
		if (!state.enabled || state.sessionId !== mySession) return;

		const video = await getVideoElement();
		if (video) {
			applyCrop(0, video.videoHeight);
			checkBlackBars();
		} else {
			await waitOneFrame();
			init();
		}
	};
	init();

	window.addEventListener("yt-navigate-finish", init);
	state.fullscreenCleanup = onYoutubeFullscreen(async () => {
		if (state.enabled && state.sessionId === mySession) {
			const video = await getVideoElement();
			if (video) checkBlackBars();
		}
	});
}

export function disableRemoveBlackBars() {
	state.enabled = false;

	if (state.animationId) {
		cancelAnimationFrame(state.animationId);
		clearTimeout(state.animationId);
	}
	if (state.videoFrameCallbackId && videoElement && "cancelVideoFrameCallback" in videoElement) {
		videoElement.cancelVideoFrameCallback(state.videoFrameCallbackId);
	}

	if (state.worker) {
		state.worker.terminate();
		state.worker = null;
		state.workerLoadAttempted = false;
	}

	if (state.fullscreenCleanup) {
		state.fullscreenCleanup();
		state.fullscreenCleanup = null;
	}

	const player = document.querySelector(".html5-video-container") as HTMLElement;
	if (player) {
		player.style.transform = "";
		player.style.height = "";
		player.style.transition = "";
	}

	if (videoElement) {
		videoElement.style.transform = "";
		videoElement.style.top = "";
		videoElement.style.left = "";
		videoElement.style.position = "";
	}

	removeDebugCanvas();
	removeDebugUI();

	state.lastHeight = 0;
	state.droppedFrames = 0;
	state.vHeight = 0;
	state.processLatency = 0;
	state.startTime = 0;
	state.lastIntervalTime = 0;
	state.currentInterval = 0;
	state.sessionId++;
	disableUltraWide();
}

export function registerRemoveBlackBarsListeners() {
	const settingsList = [
		"RemoveBlackBars",
		"RemoveBlackBarsDebugCanvas",
		"RemoveBlackBarsDebugInfo",
		"RemoveBlackBarsLazyCheck",
		"RemoveBlackBarsLazyAmount",
		"RemoveBlackBarsUltrawide",
		"RemoveBlackBarsWorker",
		"RemoveBlackBarsDisableFullscreen",
	];

	settingsList.forEach((id) =>
		registerSettingListener(id, (val) => {
			updateRemoveBlackBarsSettings(val, id);
			if (id === "RemoveBlackBars") {
				if (val) enableRemoveBlackBars();
				else disableRemoveBlackBars();
			}
		}),
	);

	registerSettingListener("enableExtension", (val) => {
		if (!val) {
			disableRemoveBlackBars();
		} else {
			getUserSetting("RemoveBlackBars").then((enabled) => {
				if (enabled) {
					enableRemoveBlackBars();
				}
			});
		}
	});
}
