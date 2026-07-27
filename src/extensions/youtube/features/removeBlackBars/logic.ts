import { getVideoElement, isYoutubeFullscreen } from "@extensions/youtube/modules/youtube";
import { shouldFeatureShow } from "../helpers";
import { detectBlackBars } from "./helpers";
import { settings } from "./settings";
import { state } from "./state";
import { applyCrop, createDebugCanvas, hideDebugCanvas, updateDebugUI } from "./ui";

async function handleDetectedResults(
	finalDetectedHeight: number,
	videoHeight: number,
	finalDetectedWidth: number,
	videoWidth: number,
	mySession: number,
) {
	if (state.sessionId !== mySession) return;
	state.processLatency = performance.now() - state.startTime;
	updateDebugUI(finalDetectedHeight, videoHeight, finalDetectedWidth, videoWidth);

	if (finalDetectedHeight > 0 || state.lastHeight > 0 || finalDetectedWidth > 0 || state.lastWidth > 0) {
		applyCrop(finalDetectedHeight, videoHeight, finalDetectedWidth, videoWidth);
	}

	if (settings.debugCanvas && state.verticalCtx && (settings.mode === "vertical" || settings.mode === "both")) {
		const verticalCtx = state.verticalCtx;
		verticalCtx.fillStyle = "yellow";
		verticalCtx.fillRect(0, 5, 5, 1);
		verticalCtx.fillStyle = "green";
		verticalCtx.fillRect(0, finalDetectedHeight, 5, 1);
		verticalCtx.fillRect(0, videoHeight - finalDetectedHeight, 5, 1);
		verticalCtx.fillRect(0, state.lastHeight, 5, 1);
		verticalCtx.fillRect(0, videoHeight - state.lastHeight, 5, 1);
	}

	if (settings.debugCanvas && state.horizontalCtx && (settings.mode === "horizontal" || settings.mode === "both")) {
		const horizontalCtx = state.horizontalCtx;
		horizontalCtx.fillStyle = "yellow";
		horizontalCtx.fillRect(5, 0, 1, 5);
		horizontalCtx.fillStyle = "green";
		horizontalCtx.fillRect(finalDetectedWidth, 0, 1, 5);
		horizontalCtx.fillRect(videoWidth - finalDetectedWidth, 0, 1, 5);
		horizontalCtx.fillRect(state.lastWidth, 0, 1, 5);
		horizontalCtx.fillRect(videoWidth - state.lastWidth, 0, 1, 5);
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

	const videoHeight = video.videoHeight;
	const videoWidth = video.videoWidth;
	state.videoHeight = videoHeight;
	state.videoWidth = videoWidth;

	const now = performance.now();
	if (state.lastIntervalTime !== 0) state.currentInterval = Math.round(now - state.lastIntervalTime);
	state.lastIntervalTime = now;

	if (settings.debugCanvas) {
		await createDebugCanvas();
	} else {
		hideDebugCanvas();
		if (!state.verticalCanvas) {
			state.verticalCanvas = document.createElement("canvas");
			state.verticalCanvas.width = 5;
			state.verticalCtx = state.verticalCanvas.getContext("2d", { alpha: false });
		}
		if (state.verticalCanvas.height !== videoHeight) state.verticalCanvas.height = videoHeight;
	}

	if (state.verticalCtx && (settings.mode === "vertical" || settings.mode === "both")) {
		state.verticalCtx.drawImage(video, 0, 0, 5, videoHeight);
	}

	let sampleColor: Uint8ClampedArray;
	if (state.verticalCtx) {
		sampleColor = state.verticalCtx.getImageData(1, 3, 1, 1).data;
	} else {
		sampleColor = new Uint8ClampedArray([0, 0, 0, 255]);
	}
	const [verticalR, verticalG, verticalB] = [sampleColor[0], sampleColor[1], sampleColor[2]];
	state.lastSampleColorVertical = `rgb(${verticalR},${verticalG},${verticalB})`;

	const verticalImgData = state.verticalCtx
		? state.verticalCtx.getImageData(0, 0, 5, videoHeight).data
		: new Uint8ClampedArray(5 * videoHeight * 4);

	let horizontalImgData: Uint8ClampedArray | undefined;
	let horizontalR = verticalR,
		horizontalG = verticalG,
		horizontalB = verticalB;

	if ((settings.mode === "horizontal" || settings.mode === "both") && videoWidth > 0) {
		if (!state.horizontalCanvas) {
			state.horizontalCanvas = document.createElement("canvas");
			state.horizontalCanvas.height = 5;
			state.horizontalCtx = state.horizontalCanvas.getContext("2d", { alpha: false });
		}
		if (state.horizontalCanvas.width !== videoWidth) {
			state.horizontalCanvas.width = videoWidth;
		}
		if (state.horizontalCtx) {
			state.horizontalCtx.drawImage(video, 0, 0, videoWidth, 5);
			horizontalImgData = state.horizontalCtx.getImageData(0, 0, videoWidth, 5).data;

			const hSampleColor = state.horizontalCtx.getImageData(3, 1, 1, 1).data;
			horizontalR = hSampleColor[0];
			horizontalG = hSampleColor[1];
			horizontalB = hSampleColor[2];
			state.lastSampleColorHorizontal = `rgb(${horizontalR},${horizontalG},${horizontalB})`;
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

		const transferables: Transferable[] = [verticalImgData.buffer];
		if (horizontalImgData) transferables.push(horizontalImgData.buffer);

		state.worker.postMessage(
			{
				type: "detect",
				data: {
					verticalImgData,
					horizontalImgData,
					videoHeight,
					videoWidth,
					mode: settings.mode,
					threshold: 20,
					verticalR,
					verticalG,
					verticalB,
					horizontalR,
					horizontalG,
					horizontalB,
					pixelBudget: settings.lazyCheck ? settings.lazyAmount : 0,
					currentLastHeight: state.lastHeight,
					currentLastWidth: state.lastWidth,
				},
			},
			transferables,
		);
		return schedule();
	}

	const { heightResult, widthResult } = await detectBlackBars(
		{
			verticalImgData,
			horizontalImgData,
			videoHeight,
			videoWidth,
			mode: settings.mode,
			threshold: 20,
			verticalR,
			verticalG,
			verticalB,
			horizontalR,
			horizontalG,
			horizontalB,
			pixelBudget: settings.lazyCheck ? settings.lazyAmount : 0,
			currentLastHeight: state.lastHeight,
			currentLastWidth: state.lastWidth,
		},
		settings.debugCanvas ? state.verticalCtx : null,
		settings.debugCanvas ? state.horizontalCtx : null,
	);

	if (state.sessionId === mySession) {
		state.isChecking = false;
		handleDetectedResults(heightResult, videoHeight, widthResult, videoWidth, mySession);
	}
	state.isChecking = false;
	schedule();
}
