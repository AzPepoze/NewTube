import { waitOneFrame } from "../../styleshift/shared/normal";
import { loadWorker } from "../../styleshift/core/runtimeController";
import { getFromStorage, getUserSetting } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";
import { calculateVdoHeight, detectBlackBars } from "./removeBlackBarsLogic";

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

const ultraWideRatio = (21 / 9).toFixed(2);
let isUltraWideMode = false;

async function initWorker() {
	if (worker || workerLoadAttempted) return;
	workerLoadAttempted = true;
	worker = await loadWorker("removeBlackBarsWorker.js");
}

async function handleDetectedHeight(finalDetectedHeight: number, vHeight: number) {
	const debug = await getUserSetting("DelBarDebug");
	const dropFrame = await getUserSetting("DropFrame");
	const lazyAmount = await getUserSetting("LazyAmount");

	if (Math.abs(finalDetectedHeight - lastHeight) > 10 || (finalDetectedHeight > 10 && lastHeight === 0)) {
		const player = document.querySelector(".html5-video-container") as HTMLElement;
		if (player) {
			if (finalDetectedHeight > lastHeight) {
				player.style.transition = "none";
			} else {
				player.style.transition = "all 0.5s ease-out";
			}
		}
		lastHeight = finalDetectedHeight;
		applyCrop(finalDetectedHeight, vHeight);
	}

	if (debug && ctx) {
		ctx.fillStyle = "yellow";
		ctx.fillRect(0, 10, 5, 1);
		ctx.fillStyle = "green";
		ctx.fillRect(0, lastHeight, 5, 1);
		ctx.fillRect(0, vHeight - lastHeight, 5, 1);
	}

	const ultraWideEnabled = await getUserSetting("UltraWide");
	if (ultraWideEnabled) {
		checkUltraWide();
	} else {
		disableUltraWide();
	}

	isChecking = false;
	const cooldown = dropFrame ? lazyAmount : 0;

	const nextCall = () => {
		if (video && enabled) {
			if ("requestVideoFrameCallback" in video) {
				vfcId = video.requestVideoFrameCallback(checkBlackBars);
			} else {
				animationId = requestAnimationFrame(checkBlackBars);
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
	if (!enabled || !video || isChecking) return;

	if (video.ended || video.paused) {
		if ("requestVideoFrameCallback" in video) {
			vfcId = video.requestVideoFrameCallback(checkBlackBars);
		} else {
			animationId = requestAnimationFrame(checkBlackBars);
		}
		return;
	}

	isChecking = true;
	await initWorker();

	const debug = await getUserSetting("DelBarDebug");

	if (!canvas) {
		canvas = document.createElement("canvas");
		canvas.width = 5;
		ctx = canvas.getContext("2d", { alpha: false });
		canvas.id = "NewtubeVDOCanvas";
	}

	if (debug) {
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
			video.requestVideoFrameCallback(checkBlackBars);
		} else {
			animationId = requestAnimationFrame(checkBlackBars);
		}
		return;
	}

	if (canvas.height !== vHeight) {
		canvas.height = vHeight;
	}

	if (ctx) ctx.drawImage(video, 0, 0, 5, vHeight);

	const sampleColor = ctx!.getImageData(1, 3, 1, 1).data;
	const [sR, sG, sB] = [sampleColor[0], sampleColor[1], sampleColor[2]];
	const threshold = 20;

	const dropFrame = await getUserSetting("DropFrame");
	const lazyAmount = await getUserSetting("LazyAmount");
	const checkStep = dropFrame ? Math.max(1, Math.floor(lazyAmount / 10)) : 1;

	const imgData = ctx!.getImageData(0, 0, 5, vHeight).data;

	if (worker) {
		worker.onmessage = async (e) => {
			const { type, data } = e.data;
			if (type === "detected") {
				const { heightsFound } = data;
				worker!.postMessage({
					type: "calculate",
					data: { heights: heightsFound, currentLastHeight: lastHeight },
				});
			} else if (type === "calculated") {
				handleDetectedHeight(data.result, vHeight);
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
		// Fallback to main thread
		const heightsFound = detectBlackBars({
			imgData,
			vHeight,
			checkStep,
			threshold,
			sR,
			sG,
			sB,
		});
		const result = calculateVdoHeight(heightsFound, lastHeight);
		handleDetectedHeight(result, vHeight);
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

	if (barHeight <= 10) {
		player.style.transform = "";
		player.style.height = "";
		video.style.transform = "";
		disableUltraWide();
	} else {
		const contentHeight = totalHeight - barHeight * 2;
		const scale = totalHeight / contentHeight;
		player.style.transform = `scale(${scale})`;
		player.style.height = "100%";

		// Ensure the video is centered within the scaled container
		video.style.position = "absolute";
		video.style.top = "50%";
		video.style.left = "50%";
		video.style.transform = "translate(-50%, -50%)";
	}
}

export async function setupRemoveBlackBars() {
	if ((await getFromStorage("Enable_Extension")) === false) return;
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
	lastHeight = 0;
	disableUltraWide();
}

registerSettingListener("Enable_Extension", (val) => {
	if (!val) {
		destroyRemoveBlackBars();
	} else {
		getUserSetting("DelBar").then((enabled) => {
			if (enabled) {
				setupRemoveBlackBars();
			}
		});
	}
});
