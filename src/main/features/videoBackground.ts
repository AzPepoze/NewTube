import { getDocumentBody } from "../../styleshift/buildInFunctions/normal";
import { getUserSetting } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";

let videoBgEnabled = false;
let videoBgCanvas: HTMLCanvasElement | null = null;
let videoBgCtx: CanvasRenderingContext2D | null = null;
let animationFrame: number | null = null;

// Default values
let bgBlur = 30;
let bgQuality = 0.5;
let bgBrightness = 100;
let bgContrast = 100;
let bgScale = 2.2;
let bgSmooth = 1;

// State
let frameCount = 0;
let lastFrameData: Uint8ClampedArray | null = null;
let staticFrameCounter = 0;
let isStatic = false;

export async function updateVideoBgSettings() {
	const blur = await getUserSetting("VideoBGBlur");
	const qual = await getUserSetting("VideoBGQuality");
	const brit = await getUserSetting("VideoBGBrightness");
	const cont = await getUserSetting("VideoBGContrast");
	const scale = await getUserSetting("VideoBGSize");
	const smooth = await getUserSetting("VideoBGSmooth");

	if (blur !== undefined) bgBlur = blur;
	if (qual !== undefined) bgQuality = qual / 100;
	if (brit !== undefined) bgBrightness = brit;
	if (cont !== undefined) bgContrast = cont;
	if (scale !== undefined) bgScale = scale;
	if (smooth !== undefined) bgSmooth = smooth;

	if (videoBgCanvas) {
		videoBgCanvas.style.filter = `blur(${bgBlur}px) brightness(${bgBrightness}%) contrast(${bgContrast}%)`;
		videoBgCanvas.style.transform = `scale(${bgScale})`;
	}
}

// Simple pixel comparison to check if video is static
function checkStatic(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
	try {
		// Sample center 10x10 pixels
		const sampleSize = 10;
		const centerX = Math.floor(Math.max(0, width / 2 - sampleSize / 2));
		const centerY = Math.floor(Math.max(0, height / 2 - sampleSize / 2));

		const frameData = ctx.getImageData(centerX, centerY, sampleSize, sampleSize).data;

		if (!lastFrameData) {
			lastFrameData = frameData;
			return false;
		}

		let diff = 0;
		// Check every 4th pixel to saveRootValue cpu
		for (let i = 0; i < frameData.length; i += 16) {
			diff += Math.abs(frameData[i] - lastFrameData[i]);
		}

		lastFrameData = frameData;

		if (diff < 50) {
			return true;
		}
		return false;
	} catch (_e) {
		return false;
	}
}

export function setupVideoBackground() {
	videoBgEnabled = true;
	updateVideoBgSettings();

	const updateCanvas = () => {
		if (!videoBgEnabled || !videoBgCanvas || !videoBgCtx) return;

		animationFrame = requestAnimationFrame(updateCanvas);

		frameCount++;
		// Smoothness check
		if (frameCount % bgSmooth !== 0) return;

		const video = document.querySelector("video");
		if (video && !video.paused && !video.ended && video.readyState >= 2) {
			// Static check optimization
			if (isStatic) {
				// Re-check occasionally
				if (frameCount % 60 !== 0) return;
			}

			const targetWidth = Math.max(64, Math.floor(video.videoWidth * bgQuality));
			const targetHeight = Math.max(36, Math.floor(video.videoHeight * bgQuality));

			if (videoBgCanvas.width !== targetWidth && targetWidth > 0) {
				videoBgCanvas.width = targetWidth;
				videoBgCanvas.height = targetHeight;
			}

			videoBgCtx.drawImage(video, 0, 0, videoBgCanvas.width, videoBgCanvas.height);

			if (checkStatic(videoBgCtx, videoBgCanvas.width, videoBgCanvas.height)) {
				staticFrameCounter++;
				if (staticFrameCounter > 30) isStatic = true;
			} else {
				staticFrameCounter = 0;
				isStatic = false;
			}
		}
	};

	const init = async () => {
		if (document.getElementById("newtube-bg-canvas") || !videoBgEnabled) return;

		const app = (await getDocumentBody()) || document.body;

		videoBgCanvas = document.createElement("canvas");
		videoBgCanvas.id = "newtube-bg-canvas";
		videoBgCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            object-fit: cover;
            transition: opacity 0.5s;
            pointer-events: none;
        `;
		// Initial style
		videoBgCanvas.style.filter = `blur(${bgBlur}px) brightness(${bgBrightness}%) contrast(${bgContrast}%)`;
		videoBgCanvas.style.transform = `scale(${bgScale})`;

		videoBgCanvas.width = 128;
		videoBgCanvas.height = 72;

		videoBgCtx = videoBgCanvas.getContext("2d", { alpha: false });

		app.appendChild(videoBgCanvas);
		updateCanvas();
	};

	init();
	window.addEventListener("yt-navigate-finish", init);
}

export function disableVideoBackground() {
	videoBgEnabled = false;
	if (animationFrame) cancelAnimationFrame(animationFrame);
	const canvas = document.getElementById("newtube-bg-canvas");
	if (canvas) canvas.remove();
	videoBgCanvas = null;
	videoBgCtx = null;
	isStatic = false;
}

registerSettingListener("VideoBGBlur", updateVideoBgSettings);
registerSettingListener("VideoBGQuality", updateVideoBgSettings);
registerSettingListener("VideoBGBrightness", updateVideoBgSettings);
registerSettingListener("VideoBGContrast", updateVideoBgSettings);
registerSettingListener("VideoBGSize", updateVideoBgSettings);
registerSettingListener("VideoBGSmooth", updateVideoBgSettings);
