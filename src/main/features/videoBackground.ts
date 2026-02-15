import { getDocumentBody } from "../../styleshift/shared/normal";
import { loadWorker } from "../../styleshift/core/runtimeController";
import { getUserSetting } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";
import { hideBg, showBg } from "./background";
import { logger } from "../../shared/logger";
import { VideoBGRenderer } from "./videoBackgroundRenderer";
import {
	getVideoElement,
	getYoutubeVideoId,
	onYoutubeNavigate,
	onYoutubeFullscreen,
	isYoutubeFullscreen,
} from "../modules/youtube";

// --- Types & State ---

interface VideoBgState {
	enabled: boolean;
	container: HTMLDivElement | null;
	wrapper: HTMLDivElement | null;
	canvas: HTMLCanvasElement | null;
	worker: Worker | null;
	localRenderer: VideoBGRenderer | null;
	overlay: HTMLDivElement | null;

	animationFrame: number | null;
	renderTimeout: number | null;
	layoutAnimationFrame: number | null;
	frameCount: number;
	lastTime: number;
	laggedFrames: number;
	isStatic: boolean;
	isFadedIn: boolean;
	navigateCleanup: (() => void) | null;
	fullscreenCleanup: (() => void) | null;

	debugContainer: HTMLDivElement | null;
	lastProcessTime: number;
	renderMethod: string;
	isProcessing: boolean;
	isCapturing: boolean;
	droppedFrames: number;
	pendingBitmap: ImageBitmap | null;
	sessionId: number;
}

const state: VideoBgState = {
	enabled: false,
	container: null,
	wrapper: null,
	canvas: null,
	worker: null,
	localRenderer: null,
	overlay: null,
	animationFrame: null,
	renderTimeout: null,
	layoutAnimationFrame: null,
	frameCount: 0,
	lastTime: 0,
	laggedFrames: 0,
	isStatic: false,
	isFadedIn: false,
	navigateCleanup: null,
	fullscreenCleanup: null,

	debugContainer: null,
	lastProcessTime: 0,
	renderMethod: "Unknown",
	isProcessing: false,
	isCapturing: false,
	droppedFrames: 0,
	pendingBitmap: null,
	sessionId: 0,
};

const settings = {
	blur: 30,
	quality: 0.5,
	brightness: 1,
	contrast: 1,
	opacity: 100,
	scale: 2.2,
	smooth: 1,
	engine: "GPU",
	worker: true,
	stick: false,
	checkLag: true,
	debug: false,
};

function sendToWorker(bitmap: ImageBitmap) {
	if (!state.enabled) {
		bitmap.close();
		return;
	}

	state.isProcessing = true;
	if (state.worker && settings.worker) {
		state.worker.postMessage({ type: "render", data: { bitmap } }, [bitmap]);
	} else {
		state.localRenderer?.render(bitmap);
		state.isProcessing = false;
		if (state.pendingBitmap) {
			const next = state.pendingBitmap;
			state.pendingBitmap = null;
			sendToWorker(next);
		}
	}
}

const MAX_LAGGED_FRAMES = 10;
const LAG_WARNING_MESSAGE = `NEWTUBE : I see that you so laggy.
(I guess it cause by Background Video)
                
Solution to fix this laggy:
1.Try enable "Use hardware acceleration when available" in your browser setting.
2.If your graphic card is quite poor try change Background Video to renders by CPU.
3.Try decrease quality of Background Video

Are you want to disable Background Video?
(You can turn it back on later)`;

let lastStaticCheckVideoID: string | null = null;
let cachedStaticResult = false;
let lastRect = { top: -1, left: -1, width: -1, height: -1, scrollY: -1, scrollX: -1 };

// --- Helper Functions ---

function isMainVideoActive(video: HTMLVideoElement): boolean {
	if (!video?.src) return false;
	let parent = video.parentElement;
	while (parent && parent.tagName !== "BODY") {
		if (parent.classList.contains("ytp-player-minimized")) return false;
		if (parent.classList.contains("ytp-fullscreen")) return false;
		parent = parent.parentElement;
	}
	return true;
}

async function getImageColor(src: string): Promise<Uint8ClampedArray | null> {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const canvas = new OffscreenCanvas(1, 1);
			const ctx = canvas.getContext("2d");
			if (!ctx) return resolve(null);
			ctx.drawImage(img, 0, 0, 1, 1);
			resolve(ctx.getImageData(0, 0, 1, 1).data);
		};
		img.onerror = () => {
			logger.warn("video-bg", `Failed to fetch static check image: ${src}`);
			resolve(null);
		};
		img.src = src;
	});
}

async function checkStaticVDO(): Promise<boolean> {
	const videoID = getYoutubeVideoId();
	if (!videoID) return false;
	if (videoID === lastStaticCheckVideoID) return cachedStaticResult;

	lastStaticCheckVideoID = videoID;
	const frames = await Promise.all(
		[1, 2, 3].map((i) => getImageColor(`https://i.ytimg.com/vi/${videoID}/${i}.jpg`)),
	);

	if (frames.some((f) => f === null)) {
		cachedStaticResult = false;
		return false;
	}

	const [f1, f2, f3] = frames as Uint8ClampedArray[];
	const diff =
		Math.abs(f1[0] - f2[0]) +
		Math.abs(f2[0] - f3[0]) +
		(Math.abs(f1[1] - f2[1]) + Math.abs(f2[1] - f3[1])) +
		(Math.abs(f1[2] - f2[2]) + Math.abs(f2[2] - f3[2]));

	cachedStaticResult = diff <= 10;
	logger.debug("video-bg", `Static check result for ${videoID}: ${cachedStaticResult} (diff: ${diff})`);
	return cachedStaticResult;
}

function fadeIn() {
	if (!state.container || state.isFadedIn) return;
	state.isFadedIn = true;
	requestAnimationFrame(() => {
		if (state.container) {
			state.container.style.opacity = (settings.opacity / 100).toString();
			hideBg();
		}
	});
}

function fadeOut() {
	if (!state.container || !state.isFadedIn) return;
	state.isFadedIn = false;
	requestAnimationFrame(() => {
		if (state.container) {
			state.container.style.opacity = "0";
			showBg();
		}
	});
}

function updateLayout(video: HTMLVideoElement) {
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

function updateDebugInfo(video: HTMLVideoElement, frameTime: number) {
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
			<span>Lagged (BG):</span> <span>${state.laggedFrames}/${MAX_LAGGED_FRAMES}</span>
			<span>Engine:</span> <span>${engineDisplay}</span>
			<span>Quality:</span> <span>${settings.quality * 100}%</span>
			<span>Static:</span> <span>${state.isStatic}</span>
			<span>Paused:</span> <span>${video.paused}</span>
			<span>Capturing:</span> <span>${state.isCapturing}</span>
			<span>Rendering:</span> <span>${state.isProcessing}</span>
		</div>
	`;
}

function handleLagMonitoring(frameTime: number) {
	// Lag is detected if:
	// 1. Browser stutter (frameTime > 100ms)
	// 2. Processing is consistently very slow (> 120ms)
	// 3. We are dropping frames from the pipeline (tracked via state.droppedFrames)

	const isSlow = frameTime > 100 || state.lastProcessTime > 120;
	const isHealthy = frameTime < 30 && state.lastProcessTime < 60;

	if (isHealthy) {
		state.laggedFrames = 0;
		return;
	}

	if (isSlow && !state.isStatic && state.frameCount > 60) {
		state.laggedFrames++;
		if (state.laggedFrames > MAX_LAGGED_FRAMES) {
			if (confirm(LAG_WARNING_MESSAGE)) {
				disableVideoBackground();
			}
			state.laggedFrames = 0;
		}
	} else if (state.laggedFrames > 0) {
		state.laggedFrames--;
	}
}

// --- Main Logic ---

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
			case "VideoBackgroundRenderEngine":
				settings.engine = value;
				break;
			case "VideoBackgroundWorker":
				settings.worker = value;
				break;
		}

		// Full restart if engine or worker setting changes
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
		settings.blur = await getUserSetting("VideoBackgroundBlur");
		settings.quality = (await getUserSetting("VideoBackgroundQuality")) / 100;
		settings.brightness = await getUserSetting("VideoBackgroundBrightness");
		settings.contrast = await getUserSetting("VideoBackgroundContrast");
		settings.opacity = await getUserSetting("VideoBackgroundOpacity");
		settings.scale = await getUserSetting("VideoBackgroundSize");
		settings.smooth = await getUserSetting("VideoBackgroundSmooth");
		settings.stick = await getUserSetting("VideoBackgroundStick");
		settings.checkLag = await getUserSetting("VideoBackgroundCheckLag");
		settings.debug = await getUserSetting("VideoBackgroundDebug");
		settings.engine = await getUserSetting("VideoBackgroundRenderEngine");
		settings.worker = await getUserSetting("VideoBackgroundWorker");
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

const render = async () => {
	const mySession = state.sessionId;
	if (!state.enabled || !state.canvas) return;

	const video = await getVideoElement();
	if (!video || !state.enabled || state.sessionId !== mySession) {
		if (state.enabled && state.sessionId === mySession) {
			state.animationFrame = requestAnimationFrame(render);
		}
		return;
	}

	// Schedule next frame (Priority: rVFC > 30fps Fallback)
	if ("requestVideoFrameCallback" in video) {
		state.renderMethod = "rVFC";
		(video as any).requestVideoFrameCallback(() => {
			if (state.enabled && state.sessionId === mySession) render();
		});
	} else {
		state.renderMethod = "30fps";
		state.renderTimeout = setTimeout(() => {
			state.animationFrame = requestAnimationFrame(() => {
				if (state.enabled && state.sessionId === mySession) render();
			});
		}, 33) as any;
	}

	// Exit if hidden or fullscreen
	const shouldShow = (isMainVideoActive(video) || settings.stick) && !isYoutubeFullscreen;
	if (!shouldShow) {
		if (state.isFadedIn) fadeOut();
		return;
	}

	if (!state.isFadedIn) fadeIn();

	// Performance Tracking
	const now = performance.now();
	if (state.lastTime === 0) state.lastTime = now;
	const frameTime = now - state.lastTime;
	state.lastTime = now;
	state.frameCount++;

	if (settings.checkLag) handleLagMonitoring(frameTime);
	updateDebugInfo(video, frameTime);

	// Processing logic
	if (video.readyState < 2 || video.videoWidth === 0) return;

	if (state.frameCount % 120 === 0) {
		checkStaticVDO().then((res) => (state.isStatic = res));
	}

	// Skip if capture is busy (rare)
	if (state.isCapturing) {
		state.droppedFrames++;
		return;
	}

	// Skip processing if static or paused
	const isPaused = video.paused || video.ended;
	if ((state.isStatic || isPaused) && state.frameCount % 60 !== 0) return;

	// FIRE AND FORGET: Move async work out of the rVFC callback path
	(async () => {
		if (!state.enabled) return;
		state.isCapturing = true;
		const processStart = performance.now();
		try {
			// Fast capture without resizing (Browser can usually do this zero-copy)
			const bitmap = await createImageBitmap(video);
			state.lastProcessTime = performance.now() - processStart;
			state.isCapturing = false;

			if (state.isProcessing) {
				if (state.pendingBitmap) {
					state.pendingBitmap.close();
					state.droppedFrames++;
					if (settings.checkLag) state.laggedFrames++;
				}
				state.pendingBitmap = bitmap;
				return;
			}

			sendToWorker(bitmap);
		} catch (_e) {
			state.isCapturing = false;
			state.droppedFrames++;
		}
	})();
};

const updatePositionLoop = async () => {
	const mySession = state.sessionId;
	if (!state.enabled || state.sessionId !== mySession) return;

	const video = await getVideoElement();
	if (video) {
		updateLayout(video);
	}

	state.layoutAnimationFrame = requestAnimationFrame(() => {
		if (state.enabled && state.sessionId === mySession) {
			updatePositionLoop();
		}
	});
};

export async function enableVideoBackground() {
	state.enabled = true;
	const mySession = state.sessionId;
	await updateVideoBgSettings(); // Await settings loading

	const init = async () => {
		if (document.getElementById("newtube-bg-container") || !state.enabled || state.sessionId !== mySession) return;
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
		if (fullscreen) {
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

	Object.assign(lastRect, { top: -1, left: -1, width: -1, height: -1, scrollY: -1, scrollX: -1 });

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
		layoutAnimationFrame: null,
		renderTimeout: null,
		animationFrame: null,
		frameCount: 0,
		lastTime: 0,
		laggedFrames: 0,
		droppedFrames: 0,
		lastProcessTime: 0,
		renderMethod: "Unknown",
	});

	showBg();
}

// --- Listeners ---

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
].forEach((id) => registerSettingListener(id, (val) => updateVideoBgSettings(val, id)));
