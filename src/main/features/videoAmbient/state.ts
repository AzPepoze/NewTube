import { VideoBGRenderer } from "./renderer";

export interface VideoBgState {
	enabled: boolean;
	container: HTMLDivElement | null;
	wrapper: HTMLDivElement | null;
	canvas: HTMLCanvasElement | null;
	worker: Worker | null;
	localRenderer: VideoBGRenderer | null;
	overlay: HTMLDivElement | null;

	animationFrame: number | null;
	videoFrameCallbackId: number | null;
	renderTimeout: number | null;
	layoutAnimationFrame: number | null;
	frameCount: number;
	lastTime: number;
	laggedFrames: number;
	isStatic: boolean;
	isFadedIn: boolean;
	navigateCleanup: (() => void) | null;
	fullscreenCleanup: (() => void) | null;
	smallModeCleanup: (() => void) | null;

	debugContainer: HTMLDivElement | null;
	lastProcessTime: number;
	renderMethod: string;
	isProcessing: boolean;
	isCapturing: boolean;
	droppedFrames: number;
	pendingBitmap: ImageBitmap | null;
	sessionId: number;
}

export const state: VideoBgState = {
	enabled: false,
	container: null,
	wrapper: null,
	canvas: null,
	worker: null,
	localRenderer: null,
	overlay: null,
	animationFrame: null,
	videoFrameCallbackId: null,
	renderTimeout: null,
	layoutAnimationFrame: null,
	frameCount: 0,
	lastTime: 0,
	laggedFrames: 0,
	isStatic: false,
	isFadedIn: false,
	navigateCleanup: null,
	fullscreenCleanup: null,
	smallModeCleanup: null,

	debugContainer: null,
	lastProcessTime: 0,
	renderMethod: "Unknown",
	isProcessing: false,
	isCapturing: false,
	droppedFrames: 0,
	pendingBitmap: null,
	sessionId: 0,
};
