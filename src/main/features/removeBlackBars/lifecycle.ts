import { waitOneFrame } from "../../../styleshift/shared/normal";
import { getFromStorage, getUserSetting } from "../../../styleshift/core/storageManager";
import { registerSettingListener } from "../../../styleshift/settings/functions";
import { onYoutubeFullscreen, getVideoElement, videoElement } from "../../modules/youtube";
import { state } from "./state";
import { settings, loadInitialSettings } from "./settings";
import { checkBlackBars } from "./logic";
import { disableUltraWide } from "./ui";
import { logger } from "@/shared/logger";

export async function updateRemoveBlackBarsSettings(value?: any, settingId?: string) {
	if (typeof settingId === "string") {
		switch (settingId) {
			case "RemoveBlackBars":
				settings.enabled = value;
				break;
			case "RemoveBlackBarsDebugCanvas":
				settings.debugCanvas = value;
				break;
			case "RemoveBlackBarsDebugInfo":
				logger.info("RemoveBlackBars", "Updating debug info setting", { value });
				settings.debugInfo = value;
				break;
			case "RemoveBlackBarsLazyCheck":
				settings.lazyCheck = value;
				break;
			case "RemoveBlackBarsLazyAmount":
				settings.lazyAmount = value;
				break;
			case "RemoveBlackBarsUltrawide":
				settings.ultrawide = value;
				break;
			case "RemoveBlackBarsWorker":
				settings.worker = value;
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
	if ((await getFromStorage("EnableExtension")) === false) return;
	if (state.enabled) return;
	state.enabled = true;
	const mySession = state.sessionId;

	const init = async () => {
		if (!state.enabled || state.sessionId !== mySession) return;

		const video = await getVideoElement();
		if (video) {
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

	if (state.animationId) cancelAnimationFrame(state.animationId);
	if (state.videoFrameCallbackId && videoElement && "cancelVideoFrameCallback" in videoElement) {
		videoElement.cancelVideoFrameCallback(state.videoFrameCallbackId);
	}

	if (state.worker) {
		state.worker.terminate();
		state.worker = null;
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

	if (state.canvas) {
		state.canvas.style.display = "none";
		if (state.canvas.parentNode) state.canvas.remove();
		state.canvas = null;
	}

	if (state.debugContainer) {
		state.debugContainer.remove();
		state.debugContainer = null;
	}

	state.lastHeight = 0;
	state.droppedFrames = 0;
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

	registerSettingListener("EnableExtension", (val) => {
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
