import { state } from "./state";
import { settings } from "./settings";
import { fadeIn, fadeOut, updateDebugInfo, updateLayout } from "./ui";
import { checkStaticVDO, sendToWorker } from "./helpers";
import { getVideoElement } from "../../modules/youtube";
import { disableVideoBackground } from "./lifecycle";
import { shouldFeatureShow } from "../helpers";

export function handleLagMonitoring(frameTime: number, disableCallback: () => void) {
	const isSlow = frameTime > 100 || state.lastProcessTime > 120;
	const isHealthy = frameTime < 30 && state.lastProcessTime < 60;

	if (isHealthy) {
		state.laggedFrames = 0;
		return;
	}

	if (isSlow && !state.isStatic && state.frameCount > 60) {
		state.laggedFrames++;
		if (state.laggedFrames > 10) {
			const LAG_WARNING_MESSAGE = `NEWTUBE : I see that you so laggy.
(I guess it cause by Background Video)
                
Solution to fix this laggy:
1.Try enable "Use hardware acceleration when available" in your browser setting.
2.If your graphic card is quite poor try change Background Video to renders by CPU.
3.Try decrease quality of Background Video

Are you want to disable Background Video?
(You can turn it back on later)`;
			if (confirm(LAG_WARNING_MESSAGE)) {
				disableCallback();
			}
			state.laggedFrames = 0;
		}
	} else if (state.laggedFrames > 0) {
		state.laggedFrames--;
	}
}

export const render = async () => {
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
		state.renderMethod = "videoFrameCallback";
		state.videoFrameCallbackId = video.requestVideoFrameCallback(() => {
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

	// Exit if hidden or fullscreen or small mode
	const shouldShow = shouldFeatureShow(settings.disableFullscreen, settings.stick);
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

	if (settings.checkLag) handleLagMonitoring(frameTime, disableVideoBackground);
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

export const updatePositionLoop = async () => {
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
