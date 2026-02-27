import { loadWorker } from "../../../styleshift/core/runtimeController";
import { state } from "./state";
import { settings } from "./settings";
import { updateDebugUI, applyCrop, checkUltraWide, disableUltraWide } from "./ui";
import { calculateVdoHeight, detectBlackBars } from "./helpers";
import { isYoutubeFullscreen, getVideoElement } from "../../modules/youtube";
import { shouldFeatureShow } from "../helpers";
import { logger } from "@/shared/logger";

async function initWorker() {
	if (state.worker || state.workerLoadAttempted) return;
	state.workerLoadAttempted = true;
	state.worker = await loadWorker("removeBlackBarsWorker.js");
}

async function handleDetectedHeight(finalDetectedHeight: number, vHeight: number, mySession: number) {
	if (state.sessionId !== mySession) return;
	state.processLatency = performance.now() - state.startTime;

	if (settings.debugInfo) {
		updateDebugUI(finalDetectedHeight, vHeight);
	} else if (state.debugContainer) {
		state.debugContainer.style.display = "none";
	}

	if (
		Math.abs(finalDetectedHeight - state.lastHeight) > 10 ||
		(finalDetectedHeight > 10 && state.lastHeight === 0)
	) {
		applyCrop(finalDetectedHeight, vHeight);
	}

	if (settings.debugCanvas && state.ctx) {
		state.ctx.fillStyle = "yellow";
		state.ctx.fillRect(0, 10, 5, 1);
		state.ctx.fillStyle = "green";
		state.ctx.fillRect(0, finalDetectedHeight, 5, 1);
		state.ctx.fillRect(0, vHeight - finalDetectedHeight, 5, 1);
		state.ctx.fillStyle = "green";
		state.ctx.fillRect(0, state.lastHeight, 5, 1);
		state.ctx.fillRect(0, vHeight - state.lastHeight, 5, 1);
	}

	if (settings.ultrawide) {
		checkUltraWide();
	} else {
		disableUltraWide();
	}
}

export async function checkBlackBars() {
	const mySession = state.sessionId;
	if (!state.enabled || state.sessionId !== mySession) return;

	const video = await getVideoElement();
	if (!video) {
		state.animationId = window.setTimeout(() => {
			if (state.enabled && state.sessionId === mySession) checkBlackBars();
		}, 33) as any;
		return;
	}

	const scheduleNext = () => {
		if (state.enabled && state.sessionId === mySession) {
			if ("requestVideoFrameCallback" in video) {
				state.videoFrameCallbackId = video.requestVideoFrameCallback(() => {
					if (state.sessionId === mySession) checkBlackBars();
				});
			} else {
				state.animationId = window.setTimeout(() => {
					if (state.sessionId === mySession) checkBlackBars();
				}, 33) as any;
			}
		}
	};

	if (!shouldFeatureShow(settings.disableFullscreen)) {
		if (settings.disableFullscreen && isYoutubeFullscreen && state.lastHeight !== 0) {
			applyCrop(0, video.videoHeight);
		}
		scheduleNext();
		return;
	}

	if (video.ended || video.paused) {
		scheduleNext();
		return;
	}

	// Busy Checking (Worker is running async)
	if (state.isChecking) {
		state.droppedFrames++;
		if (settings.debugInfo) updateDebugUI();
		scheduleNext();
		logger.info("RemoveBlackBars", "Busy - Dropped Frame", { dropped: state.droppedFrames });
		return;
	}

	const vHeight = video.videoHeight;
	state.vHeight = vHeight;

	// Prepare for NEW scan
	state.startTime = performance.now();
	if (!state.canvas) {
		state.canvas = document.createElement("canvas");
		state.canvas.width = 5;
		state.ctx = state.canvas.getContext("2d", { alpha: false });
		state.canvas.id = "NewtubeVDOCanvas";
	}
	if (state.canvas.height !== vHeight) {
		state.canvas.height = vHeight;
	}

	if (settings.debugCanvas) {
		const videoRect = video.getBoundingClientRect();
		if (!state.canvas.parentElement) {
			const container = video.parentElement;
			if (container) {
				container.appendChild(state.canvas);
				state.canvas.style.position = "absolute";
				state.canvas.style.top = "0px";
				state.canvas.style.left = "0px";
				state.canvas.style.width = "50px";
				state.canvas.style.zIndex = "1000";
				state.canvas.style.imageRendering = "pixelated";
				state.canvas.style.pointerEvents = "none";
			}
		}
		if (state.canvas.style.height !== `${videoRect.height}px`) {
			state.canvas.style.height = `${videoRect.height}px`;
		}
		state.canvas.style.display = "block";
	} else {
		state.canvas.style.display = "none";
	}

	if (state.ctx) state.ctx.drawImage(video, 0, 0, 5, vHeight);

	const ctx = state.ctx!;
	const imgData = ctx.getImageData(0, 0, 5, vHeight).data;
	const sampleColor = ctx.getImageData(1, 3, 1, 1).data;
	const [sR, sG, sB] = [sampleColor[0], sampleColor[1], sampleColor[2]];
	const threshold = 20;
	const pixelBudget = settings.lazyCheck ? settings.lazyAmount : 0; // 0 means no limit/sleep

	state.isChecking = true;

	// WORKER BRANCH
	if (settings.worker && !settings.debugCanvas) {
		await initWorker();
		if (state.worker) {
			state.worker.onmessage = (e) => {
				if (state.sessionId !== mySession) {
					state.isChecking = false;
					return;
				}
				const { type, data } = e.data;
				if (type === "result") {
					state.isChecking = false;
					handleDetectedHeight(data.result, vHeight, mySession);
				}
			};

			state.worker.postMessage({
				type: "detect",
				data: {
					imgData, vHeight, threshold, sR, sG, sB,
					pixelBudget,
					currentLastHeight: state.lastHeight
				},
			}, [imgData.buffer]);

			// Schedule next immediately to start counting drops while worker works
			scheduleNext();
			return;
		}
	}

	// MAIN THREAD BRANCH
	const heightsFound = await detectBlackBars({
		imgData, vHeight, threshold, sR, sG, sB,
		pixelBudget
	}, settings.debugCanvas ? ctx : null);

	if (state.sessionId !== mySession) {
		state.isChecking = false;
		return;
	}

	const result = calculateVdoHeight(heightsFound, state.lastHeight);
	state.isChecking = false;
	handleDetectedHeight(result, vHeight, mySession);
	scheduleNext();
}
