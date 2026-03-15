import { logger } from "../../../shared/logger";
import { getYoutubeVideoId } from "../../modules/youtube";
import { settings } from "./settings";
import { state } from "./state";

export function sendToWorker(bitmap: ImageBitmap) {
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

export async function getImageColor(src: string): Promise<Uint8ClampedArray | null> {
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

let lastStaticCheckVideoID: string | null = null;
let cachedStaticResult = false;

export async function checkStaticVDO(): Promise<boolean> {
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
