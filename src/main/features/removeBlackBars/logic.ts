import { loadWorker } from "../../../styleshift/core/runtimeController";
import { state } from "./state";
import { settings } from "./settings";
import { updateDebugUI, applyCrop, checkUltraWide, disableUltraWide } from "./ui";
import { detectBlackBars, calculateVdoHeight } from "./helpers";
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

	state.isChecking = false;
	const cooldown = settings.lazyCheck ? settings.lazyAmount : 0;

	const nextCall = async () => {
		if (state.enabled && state.sessionId === mySession) {
			const video = await getVideoElement();
			if (video) {
				if ("requestVideoFrameCallback" in video) {
					state.videoFrameCallbackId = video.requestVideoFrameCallback(() => {
						if (state.sessionId === mySession) checkBlackBars();
					});
				} else {
					state.animationId = requestAnimationFrame(() => {
						if (state.sessionId === mySession) checkBlackBars();
					});
				}
			}
		}
	};

	if (cooldown > 0) {
		setTimeout(nextCall, cooldown);
	} else {
		nextCall();
	}
}

export async function checkBlackBars() {
	const mySession = state.sessionId;
	if (!state.enabled || state.sessionId !== mySession) return;

	const video = await getVideoElement();
	if (!video) {
		state.animationId = requestAnimationFrame(() => {
			if (state.enabled && state.sessionId === mySession) checkBlackBars();
		});
		return;
	}

	if (!shouldFeatureShow(settings.disableFullscreen)) {
		if (settings.disableFullscreen && isYoutubeFullscreen && state.lastHeight !== 0) {
			applyCrop(0, video.videoHeight);
		}
		// Continue waiting for next frame, but don't process
		if ("requestVideoFrameCallback" in video) {
			state.videoFrameCallbackId = video.requestVideoFrameCallback(() => {
				if (state.sessionId === mySession) checkBlackBars();
			});
		} else {
			state.animationId = requestAnimationFrame(() => {
				if (state.sessionId === mySession) checkBlackBars();
			});
		}
		return;
	}

	if (state.isChecking) {
		state.droppedFrames++;
		return;
	}

	if (video.ended || video.paused) {
		if ("requestVideoFrameCallback" in video) {
			state.videoFrameCallbackId = video.requestVideoFrameCallback(() => {
				if (state.sessionId === mySession) checkBlackBars();
			});
		} else {
			state.animationId = requestAnimationFrame(() => {
				if (state.sessionId === mySession) checkBlackBars();
			});
		}
		return;
	}

	const now = performance.now();
	if (state.lastIntervalTime > 0) {
		state.currentInterval = Math.round(now - state.lastIntervalTime);
	}
	state.lastIntervalTime = now;
	state.startTime = now;

	state.isChecking = true;
	if (settings.worker) {
		await initWorker();
	} else if (state.worker) {
		state.worker.terminate();
		state.worker = null;
		state.workerLoadAttempted = false;
	}

	if (state.sessionId !== mySession) return;

	if (!state.canvas) {
		state.canvas = document.createElement("canvas");
		state.canvas.width = 5;
		state.ctx = state.canvas.getContext("2d", { alpha: false });
		state.canvas.id = "NewtubeVDOCanvas";
	}

	if (settings.debugCanvas) {
		const videoRect = video.getBoundingClientRect();
		if (!state.canvas.parentElement) {
			const container = video.parentElement;
			logger.info("RemoveBlackBars", "Appending debug canvas to video container", { container });
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

	const vHeight = video.videoHeight;
	if (vHeight === 0) {
		state.isChecking = false;
		if ("requestVideoFrameCallback" in video) {
			video.requestVideoFrameCallback(() => {
				if (state.sessionId === mySession) checkBlackBars();
			});
		} else {
			state.animationId = requestAnimationFrame(() => {
				if (state.sessionId === mySession) checkBlackBars();
			});
		}
		return;
	}

	if (state.canvas.height !== vHeight) {
		state.canvas.height = vHeight;
	}

	if (state.ctx) state.ctx.drawImage(video, 0, 0, 5, vHeight);

	const sampleColor = state.ctx!.getImageData(1, 3, 1, 1).data;
	const [sR, sG, sB] = [sampleColor[0], sampleColor[1], sampleColor[2]];
	state.lastSampleColor = `rgb(${sR}, ${sG}, ${sB})`;
	const threshold = 20;

	const checkStep = settings.lazyCheck ? Math.max(1, Math.floor(settings.lazyAmount / 10)) : 1;

	const imgData = state.ctx!.getImageData(0, 0, 5, vHeight).data;

	if (state.worker && !settings.debugCanvas) {
		state.worker.onmessage = async (e) => {
			if (state.sessionId !== mySession) return;
			const { type, data } = e.data;
			if (type === "detected") {
				const { heightsFound } = data;
				state.worker!.postMessage({
					type: "calculate",
					data: { heights: heightsFound, currentLastHeight: state.lastHeight },
				});
			} else if (type === "calculated") {
				handleDetectedHeight(data.result, vHeight, mySession);
			}
		};

		state.worker.postMessage(
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
			settings.debugCanvas ? state.ctx : null,
		);
		const result = calculateVdoHeight(heightsFound, state.lastHeight);
		handleDetectedHeight(result, vHeight, mySession);
	}
}
