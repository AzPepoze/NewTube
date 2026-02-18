import { getDocumentBody } from "../../../styleshift/shared/normal";
import { loadWorker } from "../../../styleshift/core/runtimeController";
import { registerSettingListener } from "../../../styleshift/settings/functions";
import { showBg } from "../background";
import { logger } from "../../../shared/logger";
import { VideoBGRenderer } from "./renderer";
import { onYoutubeNavigate, onYoutubeFullscreen, onYoutubeSmallMode, videoElement } from "../../modules/youtube";
import { state } from "./state";
import { settings, loadInitialSettings } from "./settings";
import { fadeOut, resetLastRect } from "./ui";
import { render, updatePositionLoop } from "./logic";
import { sendToWorker } from "./helpers";

export async function updateVideoBgSettings(value?: any, settingId?: string) {
	if (typeof settingId === "string") {
		const oldEngine = settings.engine;
		switch (settingId) {
			case "VideoBackgroundBlur":
				settings.blur = value;
				break;
			case "VideoBackgroundQuality":
				settings.quality = value / 100;
				break;
			case "VideoBackgroundBrightness":
				settings.brightness = value;
				break;
			case "VideoBackgroundContrast":
				settings.contrast = value;
				break;
			case "VideoBackgroundOpacity":
				settings.opacity = value;
				break;
			case "VideoBackgroundSize":
				settings.scale = value;
				break;
			case "VideoBackgroundSmooth":
				settings.smooth = value;
				break;
			case "VideoBackgroundStick":
				settings.stick = value;
				break;
			case "VideoBackgroundCheckLag":
				settings.checkLag = value;
				break;
			case "VideoBackgroundDebug":
				settings.debug = value;
				break;
			case "VideoBackgroundDisableFullscreen":
				settings.disableFullscreen = value;
				break;
			case "VideoBackgroundRenderEngine":
				settings.engine = value;
				break;
			case "VideoBackgroundWorker":
				settings.worker = value;
				break;
		}

		if (
			(settingId === "VideoBackgroundRenderEngine" && oldEngine !== settings.engine && state.enabled) ||
			(settingId === "VideoBackgroundWorker" && state.enabled)
		) {
			logger.info("video-bg", `Setting ${settingId} changed. Restarting...`);
			await disableVideoBackground(true);
			enableVideoBackground();
			return;
		}
	} else {
		await loadInitialSettings();
	}

	const updateData = {
		blur: settings.blur,
		quality: settings.quality,
		smooth: settings.smooth,
		engine: settings.engine,
	};
	state.worker?.postMessage({ type: "updateSettings", data: updateData });
	state.localRenderer?.updateSettings({ ...updateData, engine: settings.engine as any });

	if (state.canvas && state.wrapper) {
		state.canvas.style.filter = `brightness(${settings.brightness}) contrast(${settings.contrast})`;
		state.wrapper.style.transform = `scale(${settings.scale})`;
		if (state.isFadedIn && state.container) {
			state.container.style.opacity = (settings.opacity / 100).toString();
		}
	}
}

export async function enableVideoBackground() {
	state.enabled = true;
	const mySession = state.sessionId;
	await updateVideoBgSettings();

	const init = async () => {
		if (document.getElementById("newtube-bg-container") || !state.enabled || state.sessionId !== mySession)
			return;
		logger.info("video-bg", "Initializing background video...", { engine: settings.engine, session: mySession });
		const app = (await getDocumentBody()) || document.body;
		if (!app || state.sessionId !== mySession) return;

		app.style.backgroundColor = "transparent";
		app.style.backgroundImage = "none";

		state.container = document.createElement("div");
		state.container.id = "newtube-bg-container";
		Object.assign(state.container.style, {
			position: "absolute",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			zIndex: "-1",
			pointerEvents: "none",
			transition: "opacity 0.5s ease",
			opacity: "0",
		});

		state.wrapper = document.createElement("div");
		state.wrapper.id = "newtube-canvas-wraper";
		state.wrapper.style.position = "relative";
		state.wrapper.style.background = "black";

		state.canvas = document.createElement("canvas");
		state.canvas.id = "newtube-blur-bg";
		state.canvas.style.position = "absolute";
		state.canvas.style.zIndex = "0";
		state.canvas.width = 128;
		state.canvas.height = 72;

		state.overlay = document.createElement("div");
		state.overlay.id = "newtube-black-overlay";
		Object.assign(state.overlay.style, {
			position: "absolute",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			zIndex: "1",
			pointerEvents: "none",
		});

		state.worker?.terminate();
		if (settings.worker) {
			state.worker = await loadWorker("videoBackgroundWorker.js");
		} else {
			state.worker = null;
		}

		if (state.sessionId !== mySession || !state.enabled) {
			state.worker?.terminate();
			state.worker = null;
			return;
		}

		if (state.worker) {
			state.worker.onmessage = (e) => {
				if (e.data.type === "rendered") {
					state.isProcessing = false;
					if (state.pendingBitmap) {
						const next = state.pendingBitmap;
						state.pendingBitmap = null;
						sendToWorker(next);
					}
				}
			};
			const offscreen = state.canvas.transferControlToOffscreen();
			state.worker.postMessage(
				{
					type: "init",
					data: {
						canvas: offscreen,
						settings: {
							blur: settings.blur,
							quality: settings.quality,
							smooth: settings.smooth,
							engine: settings.engine,
						},
					},
				},
				[offscreen],
			);
		} else {
			state.localRenderer = new VideoBGRenderer();
			state.localRenderer.init(state.canvas, {
				blur: settings.blur,
				quality: settings.quality,
				smooth: settings.smooth,
				engine: settings.engine as any,
			});
		}

		state.wrapper.appendChild(state.canvas);
		state.wrapper.appendChild(state.overlay);
		state.container.appendChild(state.wrapper);
		app.appendChild(state.container);

		updateVideoBgSettings();
		render();
		updatePositionLoop();
	};

	init();
	state.navigateCleanup = onYoutubeNavigate(init);
	state.fullscreenCleanup = onYoutubeFullscreen((fullscreen) => {
		if (fullscreen && settings.disableFullscreen) {
			fadeOut();
		} else if (state.enabled && state.sessionId === mySession) {
			render();
		}
	});
	state.smallModeCleanup = onYoutubeSmallMode((smallMode) => {
		if (smallMode) {
			fadeOut();
		} else if (state.enabled && state.sessionId === mySession) {
			render();
		}
	});
}

export async function disableVideoBackground(force = false) {
	if (state.enabled) logger.info("video-bg", "Disabling background video...", { force });
	state.enabled = false;

	const container = state.container;
	if (container) {
		container.style.opacity = "0";
		if (!force) await new Promise((r) => setTimeout(r, 500));
		if (container.parentNode) container.remove();
	}

	if (state.animationFrame) cancelAnimationFrame(state.animationFrame);
	if (state.videoFrameCallbackId && videoElement && "cancelVideoFrameCallback" in videoElement) {
		videoElement.cancelVideoFrameCallback(state.videoFrameCallbackId);
	}
	if (state.renderTimeout) clearTimeout(state.renderTimeout);
	if (state.layoutAnimationFrame) cancelAnimationFrame(state.layoutAnimationFrame);

	state.worker?.terminate();
	state.sessionId++;

	if (state.pendingBitmap) {
		state.pendingBitmap.close();
		state.pendingBitmap = null;
	}

	if (state.debugContainer) {
		state.debugContainer.remove();
		state.debugContainer = null;
	}

	if (state.navigateCleanup) {
		state.navigateCleanup();
		state.navigateCleanup = null;
	}

	if (state.fullscreenCleanup) {
		state.fullscreenCleanup();
		state.fullscreenCleanup = null;
	}

	if (state.smallModeCleanup) {
		state.smallModeCleanup();
		state.smallModeCleanup = null;
	}

	resetLastRect();

	Object.assign(state, {
		container: null,
		wrapper: null,
		canvas: null,
		worker: null,
		localRenderer: null,
		overlay: null,
		isStatic: false,
		isFadedIn: false,
		isProcessing: false,
		isCapturing: false,
		navigateCleanup: null,
		fullscreenCleanup: null,
		smallModeCleanup: null,
		layoutAnimationFrame: null,
		renderTimeout: null,
		animationFrame: null,
		videoFrameCallbackId: null,
		frameCount: 0,
		lastTime: 0,
		laggedFrames: 0,
		droppedFrames: 0,
		lastProcessTime: 0,
		renderMethod: "Unknown",
	});

	showBg();
}

export function registerVideoBgListeners() {
	[
		"VideoBackgroundBlur",
		"VideoBackgroundQuality",
		"VideoBackgroundBrightness",
		"VideoBackgroundContrast",
		"VideoBackgroundOpacity",
		"VideoBackgroundSize",
		"VideoBackgroundSmooth",
		"VideoBackgroundRenderEngine",
		"VideoBackgroundWorker",
		"VideoBackgroundStick",
		"VideoBackgroundCheckLag",
		"VideoBackgroundDebug",
		"VideoBackgroundDisableFullscreen",
	].forEach((id) => registerSettingListener(id, (val) => updateVideoBgSettings(val, id)));
}
