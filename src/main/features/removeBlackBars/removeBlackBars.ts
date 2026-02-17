import { waitOneFrame } from "../../../styleshift/shared/normal";
import { loadWorker } from "../../../styleshift/core/runtimeController";
import { getFromStorage, getUserSetting } from "../../../styleshift/core/storageManager";
import { registerSettingListener } from "../../../styleshift/settings/functions";
import { calculateVdoHeight, detectBlackBars } from "./removeBlackBarsLogic";
import { isYoutubeSmallMode, isYoutubeFullscreen, onYoutubeFullscreen } from "../../modules/youtube";

let video: HTMLVideoElement | null = null;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;
let vfcId: number | null = null;
let lastHeight = 0;
let enabled = false;
let isChecking = false;
let worker: Worker | null = null;
let workerLoadAttempted = false;

let droppedFrames = 0;
let lastSampleColor = "transparent";
let processLatency = 0;
let startTime = 0;
let lastIntervalTime = 0;
let currentInterval = 0;
let debugContainer: HTMLDivElement | null = null;
let sessionId = 0;
let fullscreenCleanup: (() => void) | null = null;

const ultraWideRatio = (21 / 9).toFixed(2);
let isUltraWideMode = false;

async function initWorker() {
	if (worker || workerLoadAttempted) return;
	workerLoadAttempted = true;
	worker = await loadWorker("removeBlackBarsWorker.js");
}

function updateDebugUI(finalDetectedHeight: number, vHeight: number) {
	if (!debugContainer) {
		debugContainer = document.createElement("div");
		debugContainer.id = "newtube-bars-debug";
		Object.assign(debugContainer.style, {
			position: "absolute",
			top: "10px",
			right: "10px",
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
		video?.parentElement?.appendChild(debugContainer);
	}

	const needCrop = finalDetectedHeight > 10;
	const cropPercent = ((finalDetectedHeight * 2) / vHeight) * 100;

	debugContainer.innerHTML = `
		<div style="font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 5px; padding-bottom: 2px;">NewTube Remove Bars Debug</div>
		<div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 5px 15px;">
			<span>Interval:</span> <span>${currentInterval}ms</span>
			<span>Latency:</span> <span>${processLatency.toFixed(2)}ms</span>
			<span>Worker:</span> <span>${worker ? "Yes" : "No"}</span>
			<span>Dropped:</span> <span>${droppedFrames}</span>
			<span>Sample:</span> <span>
				<div style="width: 100%; height: 16px; background: ${lastSampleColor}; border: 1px solid rgba(255,255,255,0.8); border-radius: 4px; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>
			</span>
			<span>Detected:</span> <span>${finalDetectedHeight}px</span>
			<span>Need Crop:</span> <span style="color: ${needCrop ? "#00ff00" : "#ff4444"}">${needCrop}</span>
			<span>Crop:</span> <span>${cropPercent.toFixed(1)}%</span>
			<span>vHeight:</span> <span>${vHeight}px</span>
			<span>UltraWide:</span> <span>${isUltraWideMode}</span>
			<span>Fullscreen:</span> <span>${isYoutubeFullscreen}</span>
		</div>
	`;
	debugContainer.style.display = "block";
}

async function handleDetectedHeight(finalDetectedHeight: number, vHeight: number, mySession: number) {
	if (sessionId !== mySession) return;
	const debugCanvas = await getUserSetting("RemoveBlackBarsDebugCanvas");
	const debugInfo = await getUserSetting("RemoveBlackBarsDebugInfo");
	processLatency = performance.now() - startTime;

	if (debugInfo) {
		updateDebugUI(finalDetectedHeight, vHeight);
	} else if (debugContainer) {
		debugContainer.style.display = "none";
	}

	const dropFrame = await getUserSetting("RemoveBlackBarsLazyCheck");
	const lazyAmount = await getUserSetting("RemoveBlackBarsLazyAmount");

	if (Math.abs(finalDetectedHeight - lastHeight) > 10 || (finalDetectedHeight > 10 && lastHeight === 0)) {
		applyCrop(finalDetectedHeight, vHeight);
	}

	if (debugCanvas && ctx) {
		ctx.fillStyle = "yellow";
		ctx.fillRect(0, 10, 5, 1);
		ctx.fillStyle = "green";
		ctx.fillRect(0, finalDetectedHeight, 5, 1);
		ctx.fillRect(0, vHeight - finalDetectedHeight, 5, 1);
		ctx.fillStyle = "green";
		ctx.fillRect(0, lastHeight, 5, 1);
		ctx.fillRect(0, vHeight - lastHeight, 5, 1);
	}

	const ultraWideEnabled = await getUserSetting("RemoveBlackBarsUltrawide");
	if (ultraWideEnabled) {
		checkUltraWide();
	} else {
		disableUltraWide();
	}

	isChecking = false;
	const cooldown = dropFrame ? lazyAmount : 0;

	const nextCall = () => {
		if (video && enabled && sessionId === mySession) {
			if ("requestVideoFrameCallback" in video) {
				vfcId = video.requestVideoFrameCallback(() => {
					if (sessionId === mySession) checkBlackBars();
				});
			} else {
				animationId = requestAnimationFrame(() => {
					if (sessionId === mySession) checkBlackBars();
				});
			}
		}
	};

	if (cooldown > 0) {
		setTimeout(nextCall, cooldown);
	} else {
		nextCall();
	}
}

async function checkBlackBars() {
	const mySession = sessionId;
	if (!enabled || !video || sessionId !== mySession || isYoutubeSmallMode) return;

	const disableInFullscreen = await getUserSetting("RemoveBlackBarsDisableFullscreen");
	if (disableInFullscreen && isYoutubeFullscreen) {
		if (lastHeight !== 0) {
			applyCrop(0, video.videoHeight);
		}
		// Continue waiting for next frame, but don't process
		if ("requestVideoFrameCallback" in video) {
			vfcId = video.requestVideoFrameCallback(() => {
				if (sessionId === mySession) checkBlackBars();
			});
		} else {
			animationId = requestAnimationFrame(() => {
				if (sessionId === mySession) checkBlackBars();
			});
		}
		return;
	}

	if (isChecking) {
		droppedFrames++;
		return;
	}

	if (video.ended || video.paused) {
		if ("requestVideoFrameCallback" in video) {
			vfcId = video.requestVideoFrameCallback(() => {
				if (sessionId === mySession) checkBlackBars();
			});
		} else {
			animationId = requestAnimationFrame(() => {
				if (sessionId === mySession) checkBlackBars();
			});
		}
		return;
	}

	const now = performance.now();
	if (lastIntervalTime > 0) {
		currentInterval = Math.round(now - lastIntervalTime);
	}
	lastIntervalTime = now;
	startTime = now;

	isChecking = true;
	const useWorker = await getUserSetting("RemoveBlackBarsWorker");
	if (useWorker) {
		await initWorker();
	} else if (worker) {
		worker.terminate();
		worker = null;
		workerLoadAttempted = false;
	}

	if (sessionId !== mySession) return;

	const debugCanvas = await getUserSetting("RemoveBlackBarsDebugCanvas");

	if (!canvas) {
		canvas = document.createElement("canvas");
		canvas.width = 5;
		ctx = canvas.getContext("2d", { alpha: false });
		canvas.id = "NewtubeVDOCanvas";
	}

	if (debugCanvas) {
		const videoRect = video.getBoundingClientRect();
		if (!canvas.parentElement) {
			const container = video.parentElement;
			if (container) {
				container.appendChild(canvas);
				canvas.style.position = "absolute";
				canvas.style.top = "0px";
				canvas.style.left = "0px";
				canvas.style.width = "50px";
				canvas.style.zIndex = "1000";
				canvas.style.imageRendering = "pixelated";
				canvas.style.pointerEvents = "none";
			}
		}
		if (canvas.style.height !== `${videoRect.height}px`) {
			canvas.style.height = `${videoRect.height}px`;
		}
		canvas.style.display = "block";
	} else {
		canvas.style.display = "none";
	}

	const vHeight = video.videoHeight;
	if (vHeight === 0) {
		isChecking = false;
		if ("requestVideoFrameCallback" in video) {
			video.requestVideoFrameCallback(() => {
				if (sessionId === mySession) checkBlackBars();
			});
		} else {
			animationId = requestAnimationFrame(() => {
				if (sessionId === mySession) checkBlackBars();
			});
		}
		return;
	}

	if (canvas.height !== vHeight) {
		canvas.height = vHeight;
	}

	if (ctx) ctx.drawImage(video, 0, 0, 5, vHeight);

	const sampleColor = ctx!.getImageData(1, 3, 1, 1).data;
	const [sR, sG, sB] = [sampleColor[0], sampleColor[1], sampleColor[2]];
	lastSampleColor = `rgb(${sR}, ${sG}, ${sB})`;
	const threshold = 20;

	const dropFrame = await getUserSetting("RemoveBlackBarsLazyCheck");
	const lazyAmount = await getUserSetting("RemoveBlackBarsLazyAmount");
	const checkStep = dropFrame ? Math.max(1, Math.floor(lazyAmount / 10)) : 1;

	const imgData = ctx!.getImageData(0, 0, 5, vHeight).data;

	if (worker && !debugCanvas) {
		worker.onmessage = async (e) => {
			if (sessionId !== mySession) return;
			const { type, data } = e.data;
			if (type === "detected") {
				const { heightsFound } = data;
				worker!.postMessage({
					type: "calculate",
					data: { heights: heightsFound, currentLastHeight: lastHeight },
				});
			} else if (type === "calculated") {
				handleDetectedHeight(data.result, vHeight, mySession);
			}
		};

		worker.postMessage(
			{
				type: "detect",
				data: {
					imgData,
					vHeight,
					checkStep,
					threshold,
					sR,
					sG,
					sB,
				},
			},
			[imgData.buffer],
		);
	} else {
		// Fallback to main thread or forced by debugCanvas
		const heightsFound = detectBlackBars(
			{
				imgData,
				vHeight,
				checkStep,
				threshold,
				sR,
				sG,
				sB,
			},
			debugCanvas ? ctx : null,
		);
		const result = calculateVdoHeight(heightsFound, lastHeight);
		handleDetectedHeight(result, vHeight, mySession);
	}
}

function checkUltraWide() {
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

function enableUltraWide(ratio: number) {
	if (isUltraWideMode) return;
	isUltraWideMode = true;
	if (!video || !video.parentElement) return;

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

function disableUltraWide() {
	if (!isUltraWideMode) return;
	isUltraWideMode = false;
	if (!video || !video.parentElement) return;

	const container = video.parentElement;
	container.style.width = "";
	container.style.height = "";
	container.style.aspectRatio = "";
	video.style.width = "";
}

function applyCrop(barHeight: number, totalHeight: number) {
	const player = document.querySelector(".html5-video-container") as HTMLElement;
	if (!player || !video) return;
	player.style.aspectRatio = "";

	// Bar bigger than before, snap immediately to avoid showing bars during transition
	if (barHeight > lastHeight) {
		player.style.transition = "none";
	} else {
		player.style.transition = "all 0.5s ease-out";
	}

	if (barHeight <= 10) {
		player.style.height = "100%";
		disableUltraWide();
	} else {
		const contentHeight = totalHeight - barHeight * 2;
		const scale = contentHeight / totalHeight;
		player.style.height = `${scale * 100}%`;
	}

	lastHeight = barHeight;
}

export async function setupRemoveBlackBars() {
	if ((await getFromStorage("EnableExtension")) === false) return;
	if (enabled) return;
	enabled = true;
	const findVideo = async () => {
		video = document.querySelector("video");
		if (video) {
			checkBlackBars();
		} else {
			if (enabled) {
				await waitOneFrame();
				findVideo();
			}
		}
	};
	findVideo();
	window.addEventListener("yt-navigate-finish", findVideo);
	fullscreenCleanup = onYoutubeFullscreen(() => {
		if (enabled && video) {
			checkBlackBars();
		}
	});
}

export function destroyRemoveBlackBars() {
	enabled = false;
	if (animationId) cancelAnimationFrame(animationId);
	if (vfcId && video && "cancelVideoFrameCallback" in video) {
		video.cancelVideoFrameCallback(vfcId);
	}
	if (worker) {
		worker.terminate();
		worker = null;
	}

	if (fullscreenCleanup) {
		fullscreenCleanup();
		fullscreenCleanup = null;
	}

	const player = document.querySelector(".html5-video-container") as HTMLElement;
	if (player) {
		player.style.transform = "";
		player.style.height = "";
		player.style.transition = "";
	}
	if (video) {
		video.style.transform = "";
		video.style.top = "";
		video.style.left = "";
		video.style.position = "";
	}
	if (canvas) canvas.style.display = "none";
	if (debugContainer) {
		debugContainer.remove();
		debugContainer = null;
	}
	lastHeight = 0;
	droppedFrames = 0;
	processLatency = 0;
	startTime = 0;
	lastIntervalTime = 0;
	currentInterval = 0;
	disableUltraWide();
}

registerSettingListener("EnableExtension", (val) => {
	if (!val) {
		destroyRemoveBlackBars();
	} else {
		getUserSetting("RemoveBlackBars").then((enabled) => {
			if (enabled) {
				setupRemoveBlackBars();
			}
		});
	}
});
