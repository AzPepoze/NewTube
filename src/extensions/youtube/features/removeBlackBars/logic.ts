import { getVideoElement, isYoutubeFullscreen } from "@extensions/youtube/modules/youtube";
import { shouldFeatureShow } from "../helpers";
import { calculateVdoHeight, calculateVdoWidth, detectBlackBars } from "./helpers";
import { settings } from "./settings";
import { state } from "./state";
import { applyCrop, createDebugCanvas, hideDebugCanvas, updateDebugUI } from "./ui";

async function handleDetectedResults(
	finalDetectedHeight: number,
	vHeight: number,
	finalDetectedWidth: number,
	vWidth: number,
	mySession: number,
) {
	if (state.sessionId !== mySession) return;
	state.processLatency = performance.now() - state.startTime;
	updateDebugUI(finalDetectedHeight, vHeight, finalDetectedWidth, vWidth);

	if (finalDetectedHeight > 0 || state.lastHeight > 0 || finalDetectedWidth > 0 || state.lastWidth > 0) {
		applyCrop(finalDetectedHeight, vHeight, finalDetectedWidth, vWidth);
	}

	if (settings.debugCanvas && state.ctx && (settings.mode === "vertical" || settings.mode === "both")) {
		const ctx = state.ctx;
		ctx.fillStyle = "yellow";
		ctx.fillRect(0, 10, 5, 1);
		ctx.fillStyle = "green";
		ctx.fillRect(0, finalDetectedHeight, 5, 1);
		ctx.fillRect(0, vHeight - finalDetectedHeight, 5, 1);
		ctx.fillRect(0, state.lastHeight, 5, 1);
		ctx.fillRect(0, vHeight - state.lastHeight, 5, 1);
	}

	if (settings.debugCanvas && state.hCtx && (settings.mode === "horizontal" || settings.mode === "both")) {
		const ctxH = state.hCtx;
		ctxH.fillStyle = "yellow";
		ctxH.fillRect(10, 0, 1, 5);
		ctxH.fillStyle = "green";
		ctxH.fillRect(finalDetectedWidth, 0, 1, 5);
		ctxH.fillRect(vWidth - finalDetectedWidth, 0, 1, 5);
		ctxH.fillRect(state.lastWidth, 0, 1, 5);
		ctxH.fillRect(vWidth - state.lastWidth, 0, 1, 5);
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
		if (settings.disableFullscreen && isYoutubeFullscreen && (state.lastHeight !== 0 || state.lastWidth !== 0)) {
			applyCrop(0, video.videoHeight, 0, video.videoWidth);
		}
		return schedule();
	}

	if (video.ended || video.paused) return schedule();

	const vHeight = video.videoHeight;
	const vWidth = video.videoWidth;
	state.vHeight = vHeight;
	state.vWidth = vWidth;

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

	if (state.ctx && (settings.mode === "vertical" || settings.mode === "both")) {
		state.ctx.drawImage(video, 0, 0, 5, vHeight);
	}

	let sampleColor: Uint8ClampedArray;
	if (state.ctx) {
		sampleColor = state.ctx.getImageData(1, 3, 1, 1).data;
	} else {
		sampleColor = new Uint8ClampedArray([0, 0, 0, 255]);
	}
	const [vR, vG, vB] = [sampleColor[0], sampleColor[1], sampleColor[2]];
	state.lastSampleColorV = `rgb(${vR},${vG},${vB})`;

	const imgData = state.ctx ? state.ctx.getImageData(0, 0, 5, vHeight).data : new Uint8ClampedArray(5 * vHeight * 4);

	let horizontalImgData: Uint8ClampedArray | undefined;
	let hR = vR,
		hG = vG,
		hB = vB;

	if ((settings.mode === "horizontal" || settings.mode === "both") && vWidth > 0) {
		if (!state.hCanvas) {
			state.hCanvas = document.createElement("canvas");
			state.hCanvas.height = 5;
			state.hCtx = state.hCanvas.getContext("2d", { alpha: false });
		}
		if (state.hCanvas.width !== vWidth) {
			state.hCanvas.width = vWidth;
		}
		if (state.hCtx) {
			state.hCtx.drawImage(video, 0, 0, vWidth, 5);
			horizontalImgData = state.hCtx.getImageData(0, 0, vWidth, 5).data;

			const hSampleColor = state.hCtx.getImageData(3, 1, 1, 1).data;
			hR = hSampleColor[0];
			hG = hSampleColor[1];
			hB = hSampleColor[2];
			state.lastSampleColorH = `rgb(${hR},${hG},${hB})`;
		}
	}

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

		const transferables: Transferable[] = [imgData.buffer];
		if (horizontalImgData) transferables.push(horizontalImgData.buffer);

		state.worker.postMessage(
			{
				type: "detect",
				data: {
					imgData,
					horizontalImgData,
					vHeight,
					vWidth,
					mode: settings.mode,
					threshold: 20,
					vR,
					vG,
					vB,
					hR,
					hG,
					hB,
					pixelBudget: settings.lazyCheck ? settings.lazyAmount : 0,
					currentLastHeight: state.lastHeight,
					currentLastWidth: state.lastWidth,
				},
			},
			transferables,
		);
		return schedule();
	}

	const { heightsFound, widthsFound } = await detectBlackBars(
		{
			imgData,
			horizontalImgData,
			vHeight,
			vWidth,
			mode: settings.mode,
			threshold: 20,
			vR,
			vG,
			vB,
			hR,
			hG,
			hB,
			pixelBudget: settings.lazyCheck ? settings.lazyAmount : 0,
		},
		settings.debugCanvas ? state.ctx : null,
	);

	if (state.sessionId === mySession) {
		const heightResult = calculateVdoHeight(heightsFound, state.lastHeight);
		const widthResult = calculateVdoWidth(widthsFound, state.lastWidth);
		state.isChecking = false;
		handleDetectedResults(heightResult, vHeight, widthResult, vWidth, mySession);
	}
	state.isChecking = false;
	schedule();
}
