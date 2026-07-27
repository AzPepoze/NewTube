import { loadWorker } from "@core/runtime/controller";
import { getDocumentBody } from "@core/shared/domHelpers";
import {
	onYoutubeFullscreen,
	onYoutubeNavigate,
	onYoutubeSmallMode,
	videoElement,
} from "@extensions/youtube/modules/youtube";
import { registerSettingListener } from "@settings/engine/functions";
import { logger } from "@shared/logger";
import { showBg } from "../background/main";
import { createAmbientCanvas, fallbackToLocalRenderer, initLocalRenderer, sendToWorker } from "./helpers";
import { render, updatePositionLoop } from "./logic";
import { loadInitialSettings, settings } from "./settings";
import { state } from "./state";
import { fadeOut, resetLastRect } from "./ui";

export async function updateVideoAmbientSettings(value?: any, settingId?: string) {
	if (typeof settingId === "string") {
		const oldEngine = settings.engine;
		switch (settingId) {
			case "VideoAmbientBlur":
				settings.blur = value;
				break;
			case "VideoAmbientQuality":
				settings.quality = value / 100;
				break;
			case "VideoAmbientBrightness":
				settings.brightness = value;
				break;
			case "VideoAmbientContrast":
				settings.contrast = value;
				break;
			case "VideoAmbientOpacity":
				settings.opacity = value;
				break;
			case "VideoAmbientSize":
				settings.scale = value;
				break;
			case "VideoAmbientSmooth":
				settings.smooth = value;
				break;
			case "VideoAmbientStick":
				settings.stick = value;
				break;
			case "VideoAmbientCheckLag":
				settings.checkLag = value;
				break;
			case "VideoAmbientDebug":
				settings.debug = value;
				break;
			case "VideoAmbientDisableFullscreen":
				settings.disableFullscreen = value;
				break;
			case "VideoAmbientRenderEngine":
				settings.engine = value;
				break;
			case "VideoAmbientWorker":
				settings.worker = value;
				break;
		}

		if (
			(settingId === "VideoAmbientRenderEngine" && oldEngine !== settings.engine && state.enabled) ||
			(settingId === "VideoAmbientWorker" && state.enabled)
		) {
			logger.info("video-ambient", `Setting ${settingId} changed. Restarting...`);
			await disableVideoAmbient(true);
			enableVideoAmbient();
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

export async function enableVideoAmbient() {
	state.enabled = true;
	const mySession = state.sessionId;
	await updateVideoAmbientSettings();

	const init = async () => {
		if (document.getElementById("newtube-bg-container") || !state.enabled || state.sessionId !== mySession) return;
		logger.info("video-ambient", "Initializing Video Ambient...", { engine: settings.engine, session: mySession });
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

		createAmbientCanvas();

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
			state.worker = await loadWorker("videoAmbientWorker.js");
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
				const { type, data } = e.data;
				if (type === "initialized") {
					logger.info("video-ambient", "Worker initialization acknowledged");
				} else if (type === "log") {
					const { level, category, args } = data;
					(logger as any)[level]?.(category, ...args);
				} else if (type === "rendered") {
					state.isProcessing = false;
					if (state.pendingBitmap) {
						const next = state.pendingBitmap;
						state.pendingBitmap = null;
						sendToWorker(next);
					}
				}
			};
			state.worker.onerror = (err) => {
				logger.warn("video-ambient", "Worker error, terminating worker and falling back to local renderer:", err);
				fallbackToLocalRenderer();
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
			initLocalRenderer();
		}

		state.wrapper.appendChild(state.canvas);
		state.wrapper.appendChild(state.overlay);
		state.container.appendChild(state.wrapper);
		app.appendChild(state.container);

		updateVideoAmbientSettings();
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

export async function disableVideoAmbient(force = false) {
	if (state.enabled) logger.info("video-ambient", "Disabling Video Ambient...");
	state.enabled = false;
	showBg();

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
}

export function registerVideoBgListeners() {
	[
		"VideoAmbientBlur",
		"VideoAmbientQuality",
		"VideoAmbientBrightness",
		"VideoAmbientContrast",
		"VideoAmbientOpacity",
		"VideoAmbientSize",
		"VideoAmbientSmooth",
		"VideoAmbientRenderEngine",
		"VideoAmbientWorker",
		"VideoAmbientStick",
		"VideoAmbientCheckLag",
		"VideoAmbientDebug",
		"VideoAmbientDisableFullscreen",
	].forEach((id) => registerSettingListener(id, (val) => updateVideoAmbientSettings(val, id)));
}
