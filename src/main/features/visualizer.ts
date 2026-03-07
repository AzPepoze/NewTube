import { getFromStorage, getUserSetting } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";
import { getYtdApp, getVideoElement, onYoutubeNavigate } from "../modules/youtube";

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;
let canvas: HTMLCanvasElement | null = null;
let canvasCtx: CanvasRenderingContext2D | null = null;
let animationFrame: number | null = null;
let navigateCleanup: (() => void) | null = null;

export function setupAudioVisualizer() {
	const init = async () => {
		if ((await getFromStorage("enableExtension")) === false) return;
		if (audioCtx) return; // Already running

		const video = await getVideoElement();
		if (!video) return;

		if (!video.crossOrigin) {
			video.crossOrigin = "anonymous";
		}

		try {
			audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			analyser = audioCtx.createAnalyser();
			analyser.fftSize = 512;

			source = audioCtx.createMediaElementSource(video);
			source.connect(analyser);
			analyser.connect(audioCtx.destination);

			await createCanvas();
			visualize();
		} catch {
			// logger.warn("visualizer", "Visualizer setup failed");
		}
	};

	const createCanvas = async () => {
		if (document.getElementById("newtube-visualizer")) return;

		const ytdApp = await getYtdApp();

		canvas = document.createElement("canvas");
		canvas.id = "newtube-visualizer";
		canvas.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 250px;
            z-index: 500; 
            pointer-events: none;
            filter: drop-shadow(0px 0px 3px white);
        `;
		canvas.width = window.innerWidth;
		canvas.height = 250;

		if (ytdApp) {
			ytdApp.appendChild(canvas);
		} else {
			document.body.appendChild(canvas);
		}

		canvasCtx = canvas.getContext("2d");
	};

	const visualize = () => {
		if (!analyser || !canvas || !canvasCtx) return;

		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		// Cap logic
		const capYPositions: number[] = [];
		const capHeight = 2;
		const capStyle = "#fff";

		const draw = () => {
			if (!analyser || !canvasCtx || !canvas) return;

			animationFrame = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray);

			canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

			const barWidth = (canvas.width / bufferLength) * 2.5;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				// Calculate bar height, scaling it to look nice
				// Value is 0-255
				let barHeight = (dataArray[i] * dataArray[i]) / 500;
				if (barHeight < 0) barHeight = 0;

				// Initialize cap position
				if (capYPositions.length < bufferLength) {
					capYPositions.push(barHeight);
				}

				const currentCapY = capYPositions[i];

				// Draw Cap
				canvasCtx.fillStyle = capStyle;

				if (barHeight < currentCapY) {
					// Drop cap (Gravity)
					capYPositions[i] = Math.max(0, currentCapY - 1.5);
					canvasCtx.fillRect(x, canvas.height - capYPositions[i], barWidth, capHeight);
				} else {
					// Push cap up
					capYPositions[i] = barHeight;
					canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, capHeight);
				}

				// Draw Bar with Gradient
				const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
				gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
				gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
				canvasCtx.fillStyle = gradient;

				// Draw bar slightly below cap
				canvasCtx.fillRect(x, canvas.height - barHeight + capHeight + 4, barWidth, barHeight);

				x += barWidth + 1;
			}
		};

		draw();
	};

	setTimeout(init, 2000);
	if (!navigateCleanup) {
		navigateCleanup = onYoutubeNavigate(() => setTimeout(init, 1000));
	}

	window.addEventListener("resize", () => {
		if (canvas) {
			canvas.width = window.innerWidth;
		}
	});
}

export function destroyAudioVisualizer() {
	if (animationFrame) cancelAnimationFrame(animationFrame);
	if (canvas) canvas.remove();
	if (audioCtx) audioCtx.close();
	if (navigateCleanup) {
		navigateCleanup();
		navigateCleanup = null;
	}
	audioCtx = null;
	analyser = null;
	source = null;
	canvas = null;
	canvasCtx = null;
	animationFrame = null;
}

registerSettingListener("enableExtension", (val) => {
	if (!val) {
		destroyAudioVisualizer();
	} else {
		getUserSetting("ExperimentalAudioVisualizer").then((enabled) => {
			if (enabled) {
				setupAudioVisualizer();
			}
		});
	}
});
