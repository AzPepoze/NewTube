import { getVideoElement, isYoutubeFullscreen } from "@extensions/youtube/modules/youtube";
import { shouldFeatureShow } from "../helpers";
import { calculateVdoHeight, detectBlackBars } from "./helpers";
import { settings } from "./settings";
import { state } from "./state";
import { applyCrop, createDebugCanvas, hideDebugCanvas, updateDebugUI } from "./ui";

async function handleDetectedHeight(finalDetectedHeight: number, vHeight: number, mySession: number) {
	if (state.sessionId !== mySession) return;
	state.processLatency = performance.now() - state.startTime;
	updateDebugUI(finalDetectedHeight, vHeight);

	if (finalDetectedHeight > 0 || state.lastHeight > 0) applyCrop(finalDetectedHeight, vHeight);

	if (settings.debugCanvas && state.ctx) {
		const ctx = state.ctx;
		ctx.fillStyle = "yellow";
		ctx.fillRect(0, 10, 5, 1);
		ctx.fillStyle = "green";
		ctx.fillRect(0, finalDetectedHeight, 5, 1);
		ctx.fillRect(0, vHeight - finalDetectedHeight, 5, 1);
		ctx.fillRect(0, state.lastHeight, 5, 1);
		ctx.fillRect(0, vHeight - state.lastHeight, 5, 1);
	}
}

export async function checkBlackBars() {
	const mySession = state.sessionId;
	if (!state.enabled || state.sessionId !== mySession) return;

	const video = await getVideoElement();
	const schedule = () => {
		if (!state.enabled || state.sessionId !== mySession) return;
		if (state.isScheduled) return;
		state.isScheduled = true;
		if ("requestVideoFrameCallback" in video!) {
			state.videoFrameCallbackId = video.requestVideoFrameCallback(() => {
				state.isScheduled = false;
				checkBlackBars();
			});
		} else {
			state.animationId = window.setTimeout(() => {
				state.isScheduled = false;
				checkBlackBars();
			}, 33) as any;
		}
	};

	if (!video) return schedule();

	if (!shouldFeatureShow(settings.disableFullscreen)) {
		if (settings.disableFullscreen && isYoutubeFullscreen && state.lastHeight !== 0) applyCrop(0, video.videoHeight);
		return schedule();
	}

	if (video.ended || video.paused) return schedule();

	const vHeight = video.videoHeight;
	state.vHeight = vHeight;

	const now = performance.now();
	if (state.lastIntervalTime !== 0) state.currentInterval = Math.round(now - state.lastIntervalTime);
	state.lastIntervalTime = now;

	if (settings.debugCanvas) {
		await createDebugCanvas();
	} else {
		hideDebugCanvas();
		if (!state.canvas) {
			state.canvas = document.createElement("canvas");
			state.canvas.width = 5;
			state.ctx = state.canvas.getContext("2d", { alpha: false });
		}
		if (state.canvas.height !== vHeight) state.canvas.height = vHeight;
	}

	if (state.ctx) state.ctx.drawImage(video, 0, 0, 5, vHeight);

	const ctx = state.ctx!;
	const imgData = ctx.getImageData(0, 0, 5, vHeight).data;
	const sampleColor = ctx.getImageData(1, 3, 1, 1).data;
	const [sR, sG, sB] = [sampleColor[0], sampleColor[1], sampleColor[2]];
	state.lastSampleColor = `rgb(${sR},${sG},${sB})`;

	if (state.isChecking) {
		state.droppedFrames++;
		updateDebugUI();
		return schedule();
	}

	state.startTime = performance.now();
	state.isChecking = true;

	if (settings.worker && !settings.debugCanvas && state.worker) {
		const currentWorker = state.worker;
		setTimeout(() => {
			if (state.isChecking && state.worker === currentWorker) {
				state.isChecking = false;
				state.worker?.terminate();
				state.worker = null;
			}
		}, 1000);

		state.worker.postMessage(
			{
				type: "detect",
				data: {
					imgData,
					vHeight,
					threshold: 20,
					sR,
					sG,
					sB,
					pixelBudget: settings.lazyCheck ? settings.lazyAmount : 0,
					currentLastHeight: state.lastHeight,
				},
			},
			[imgData.buffer],
		);
		return schedule();
	}

	const heightsFound = await detectBlackBars(
		{
			imgData,
			vHeight,
			threshold: 20,
			sR,
			sG,
			sB,
			pixelBudget: settings.lazyCheck ? settings.lazyAmount : 0,
		},
		settings.debugCanvas ? ctx : null,
	);

	if (state.sessionId === mySession) {
		const result = calculateVdoHeight(heightsFound, state.lastHeight);
		state.isChecking = false;
		handleDetectedHeight(result, vHeight, mySession);
	}
	state.isChecking = false;
	schedule();
}
