import { getDocumentBody } from "../../styleshift/shared/normal";
import { loadWorker } from "../../styleshift/core/runtimeController";
import { getUserSetting } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";
import { hideBg, showBg } from "./background";
import { logger } from "../../styleshift/utils/logger";

// --- State Management ---
interface VideoBgState {
	enabled: boolean;
	container: HTMLDivElement | null;
	wrapper: HTMLDivElement | null;
	canvas: HTMLCanvasElement | null;
	worker: Worker | null;
	overlay: HTMLDivElement | null;

	animationFrame: number | null;
	frameCount: number;
	lastTime: number;
	laggedFrames: number;
	isStatic: boolean;
	lastFrameData: Uint8ClampedArray | null;
	isFadedIn: boolean;
}

const state: VideoBgState = {
	enabled: false,
	container: null,
	wrapper: null,
	canvas: null,
	worker: null,
	overlay: null,
	animationFrame: null,
	frameCount: 0,
	lastTime: 0,
	laggedFrames: 0,
	isStatic: false,
	lastFrameData: null,
	isFadedIn: false,
};

const settings = {
	blur: 30,
	quality: 0.5,
	brightness: 100,
	contrast: 100,
	opacity: 100,
	scale: 2.2,
	smooth: 1,
	engine: "GPU",
	stick: false,
	checkLag: true,
};

const MAX_LAGGED_FRAMES = 10;

function findVideo() {
	return (
		(document.querySelector("#player-container video") as HTMLVideoElement) ||
		(document.querySelector("video") as HTMLVideoElement)
	);
}

function isMainVideoActive(video: HTMLVideoElement): boolean {
	if (!video || !video.src) return false;
	let parent = video.parentElement;
	while (parent && parent.tagName !== "BODY") {
		if (parent.classList.contains("ytp-player-minimized")) return false;
		if (parent.classList.contains("ytp-fullscreen")) return false;
		parent = parent.parentElement;
	}
	return true;
}

function getVideoID(): string | null {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get("v");
}

let lastStaticCheckVideoID: string | null = null;
let cachedStaticResult = false;

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
	const videoID = getVideoID();
	if (!videoID) return false;
	if (videoID === lastStaticCheckVideoID) return cachedStaticResult;

	logger.debug("video-bg", `Checking if video is static for ID: ${videoID}...`);
	lastStaticCheckVideoID = videoID;

	const frames = await Promise.all([
		getImageColor(`https://i.ytimg.com/vi/${videoID}/1.jpg`),
		getImageColor(`https://i.ytimg.com/vi/${videoID}/2.jpg`),
		getImageColor(`https://i.ytimg.com/vi/${videoID}/3.jpg`),
	]);

	if (frames.some((f) => f === null)) {
		logger.debug("video-bg", "Static check failed due to fetch error, assuming NOT static");
		cachedStaticResult = false;
		return false;
	}

	const f1 = frames[0]!,
		f2 = frames[1]!,
		f3 = frames[2]!;
	let maxR = Math.max(f1[0], f2[0], f3[0]),
		minR = Math.min(f1[0], f2[0], f3[0]);
	let maxG = Math.max(f1[1], f2[1], f3[1]),
		minG = Math.min(f1[1], f2[1], f3[1]);
	let maxB = Math.max(f1[2], f2[2], f3[2]),
		minB = Math.min(f1[2], f2[2], f3[2]);

	const diff = maxR - minR + (maxG - minG) + (maxB - minB);
	cachedStaticResult = diff <= 5;
	logger.debug("video-bg", `Static check complete. Result: ${cachedStaticResult} (Diff: ${diff})`);
	return cachedStaticResult;
}

export async function updateVideoBgSettings() {
	logger.debug("video-bg", "updateVideoBgSettings() called - fetching from storage");
	settings.blur = (await getUserSetting("VideoBGBlur")) ?? 30;
	settings.quality = ((await getUserSetting("VideoBGQuality")) ?? 50) / 100;
	settings.brightness = (await getUserSetting("VideoBGBrightness")) ?? 100;
	settings.contrast = (await getUserSetting("VideoBGContrast")) ?? 100;
	settings.opacity = (await getUserSetting("VideoBGOpacity")) ?? 100;
	settings.scale = (await getUserSetting("VideoBGSize")) ?? 2.2;
	settings.smooth = (await getUserSetting("VideoBGSmooth")) ?? 1;
	settings.stick = (await getUserSetting("VideoBGStick")) ?? false;
	settings.checkLag = (await getUserSetting("VideoBGCheckLag")) ?? true;

	logger.debug(
		"video-bg",
		`Current Settings: blur=${settings.blur}, quality=${settings.quality}, opacity=${settings.opacity}, engine=${settings.engine}, stick=${settings.stick}`,
	);

	const oldEngine = settings.engine;
	settings.engine = (await getUserSetting("VideoBGRenderEngine")) ?? "GPU";

	if (state.worker) {
		state.worker.postMessage({
			type: "updateSettings",
			data: {
				blur: settings.blur,
				quality: settings.quality,
				smooth: settings.smooth,
				engine: settings.engine,
			},
		});
	}

	if (oldEngine !== settings.engine && state.enabled) {
		logger.info("video-bg", `Restarting: Engine changed ${oldEngine} -> ${settings.engine}`);
		state.enabled = false;
		await disableVideoBackground(true);
		setupVideoBackground();
		return;
	}

	if (state.canvas && state.wrapper) {
		logger.debug(
			"video-bg",
			`Applying filters: brightness(${settings.brightness}) contrast(${settings.contrast})`,
		);
		state.canvas.style.filter = `brightness(${settings.brightness}) contrast(${settings.contrast})`;
		state.wrapper.style.transform = `scale(${settings.scale})`;
		if (state.isFadedIn && state.container) {
			state.container.style.opacity = (settings.opacity / 100).toString();
		}
	}
}

const render = async () => {
	if (!state.enabled || !state.canvas || !state.worker) {
		if (!state.enabled && state.frameCount % 60 === 0)
			logger.debug("video-bg", "render loop running but feature is disabled.");
		return;
	}

	const video = findVideo();

	if (state.frameCount % 100 === 0) {
		logger.debug(
			"video-bg",
			`Render status: videoFound=${!!video}, readyState=${video?.readyState}, paused=${video?.paused}, isStatic=${state.isStatic}`,
		);
	}

	if (video && "requestVideoFrameCallback" in video) {
		(video as any).requestVideoFrameCallback(render);
	} else {
		state.animationFrame = requestAnimationFrame(render);
	}

	if (!video) return;

	const now = performance.now();
	const frameTime = now - state.lastTime;
	state.lastTime = now;

	if (settings.checkLag && frameTime > 150 && !state.isStatic && state.frameCount > 60) {
		state.laggedFrames++;
		if (state.laggedFrames > MAX_LAGGED_FRAMES) {
			if (confirm("NewTube: Background Video is causing lag. Disable it?")) disableVideoBackground();
			state.laggedFrames = 0;
		}
	} else {
		state.laggedFrames = Math.max(0, state.laggedFrames - 1);
	}

	state.frameCount++;

	const shouldBeVisible = isMainVideoActive(video) || settings.stick;

	if (shouldBeVisible) {
		if (state.container && !state.isFadedIn) {
			logger.debug(
				"video-bg",
				`Showing background: isMainActive=${isMainVideoActive(video)}, stick=${settings.stick}`,
			);
			state.container.style.opacity = (settings.opacity / 100).toString();
			state.isFadedIn = true;
			hideBg();
		}

		if (state.wrapper) {
			const rect = video.getBoundingClientRect();
			state.wrapper.style.marginTop = rect.top + window.scrollY + "px";
			state.wrapper.style.marginLeft = rect.left + window.scrollX + "px";
			state.wrapper.style.width = rect.width + "px";
			state.wrapper.style.height = rect.height + "px";

			if (state.canvas.style.width !== rect.width + "px") {
				state.canvas.style.width = rect.width + "px";
				state.canvas.style.height = rect.height + "px";
			}

			if (state.overlay) {
				const vignetteSize = rect.height <= rect.width ? rect.height * 0.2 : rect.width * 0.2;
				state.overlay.style.boxShadow = `inset black 0px 0px ${vignetteSize}px ${vignetteSize}px`;
			}
		}

		if (video.readyState >= 2) {
			const isPaused = video.paused || video.ended;

			if (state.frameCount % 120 === 0) {
				const wasStatic = state.isStatic;
				checkStaticVDO().then((result) => {
					state.isStatic = result;
					if (state.isStatic !== wasStatic) {
						logger.debug("video-bg", `Static video state changed: ${state.isStatic}`);
					}
				});
			}

			if (state.isStatic && !isPaused && state.frameCount % 60 !== 0) return;
			if (isPaused && state.frameCount % 60 !== 0) return;

			if (video.videoWidth === 0 || video.videoHeight === 0) return;

			const tw = Math.max(64, Math.floor(video.videoWidth * settings.quality));
			const th = Math.max(36, Math.floor(video.videoHeight * settings.quality));

			const bitmap = await createImageBitmap(video, {
				resizeWidth: tw,
				resizeHeight: th,
				resizeQuality: "low",
			});

			state.worker.postMessage({ type: "render", data: { bitmap } }, [bitmap]);

			if (state.frameCount % 100 === 0) logger.debug("video-bg", "Sent frame to worker");
		}
	} else {
		if (state.container && state.isFadedIn) {
			state.container.style.opacity = "0";
			state.isFadedIn = false;
			showBg();
		}
	}
};

export function setupVideoBackground() {
	state.enabled = true;
	logger.info("video-bg", "Starting setup...");
	updateVideoBgSettings();

	const init = async () => {
		if (document.getElementById("newtube-bg-container") || !state.enabled) return;
		const app = (await getDocumentBody()) || document.body;
		if (!app) return;

		app.style.backgroundColor = "transparent";
		app.style.backgroundImage = "none";

		state.container = document.createElement("div");
		state.container.id = "newtube-bg-container";
		const containerStyle = state.container.style;
		containerStyle.position = "absolute";
		containerStyle.top = "0";
		containerStyle.left = "0";
		containerStyle.width = "100%";
		containerStyle.height = "100%";
		containerStyle.zIndex = "-1";
		containerStyle.pointerEvents = "none";
		containerStyle.transition = "opacity 0.5s ease";
		containerStyle.opacity = "0";

		state.wrapper = document.createElement("div");
		state.wrapper.id = "newtube-canvas-wraper";
		const wrapperStyle = state.wrapper.style;
		wrapperStyle.position = "relative";
		wrapperStyle.background = "black";

		state.canvas = document.createElement("canvas");
		state.canvas.id = "newtube-blur-bg";
		state.canvas.style.position = "absolute";
		state.canvas.style.zIndex = "0";
		state.canvas.width = 128;
		state.canvas.height = 72;

		state.overlay = document.createElement("div");
		state.overlay.id = "newtube-black-overlay";
		const overlayStyle = state.overlay.style;
		overlayStyle.position = "absolute";
		overlayStyle.top = "0";
		overlayStyle.left = "0";
		overlayStyle.width = "100%";
		overlayStyle.height = "100%";
		overlayStyle.zIndex = "1";
		overlayStyle.pointerEvents = "none";

		state.worker = loadWorker("videoBackgroundWorker.js");

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

		state.wrapper.appendChild(state.canvas);
		state.wrapper.appendChild(state.overlay);
		state.container.appendChild(state.wrapper);
		app.appendChild(state.container);
		updateVideoBgSettings();
		render();
	};

	init();
	window.addEventListener("yt-navigate-finish", init);
}

export async function disableVideoBackground(force = false) {
	logger.info("video-bg", `Disabling background (force=${force})`);
	state.enabled = false;
	const container = state.container;
	if (container) {
		container.style.opacity = "0";
		if (!force) await new Promise((r) => setTimeout(r, 500));
		if (container.parentNode) container.remove();
	}
	if (state.animationFrame) cancelAnimationFrame(state.animationFrame);
	if (state.worker) state.worker.terminate();

	state.container = null;
	state.wrapper = null;
	state.canvas = null;
	state.worker = null;
	state.isStatic = false;
	state.lastFrameData = null;
	state.isFadedIn = false;
	showBg();
}

registerSettingListener("VideoBGBlur", updateVideoBgSettings);
registerSettingListener("VideoBGQuality", updateVideoBgSettings);
registerSettingListener("VideoBGBrightness", updateVideoBgSettings);
registerSettingListener("VideoBGContrast", updateVideoBgSettings);
registerSettingListener("VideoBGOpacity", updateVideoBgSettings);
registerSettingListener("VideoBGSize", updateVideoBgSettings);
registerSettingListener("VideoBGSmooth", updateVideoBgSettings);
registerSettingListener("VideoBGRenderEngine", updateVideoBgSettings);
registerSettingListener("VideoBGStick", updateVideoBgSettings);
registerSettingListener("VideoBGCheckLag", updateVideoBgSettings);
