import type { BarSample } from "./types";

// ---------------------------------
// Feature runtime state
// ---------------------------------

export const state = {
	enabled: false,
	verticalCanvas: null as HTMLCanvasElement | null,
	verticalCtx: null as CanvasRenderingContext2D | null,
	horizontalCanvas: null as HTMLCanvasElement | null,
	horizontalCtx: null as CanvasRenderingContext2D | null,
	animationId: null as number | null,
	videoFrameCallbackId: null as number | null,
	lastHeight: 0,
	lastWidth: 0,
	videoHeight: 0,
	videoWidth: 0,
	isChecking: false,
	worker: null as Worker | null,
	workerLoadAttempted: false,
	droppedFrames: 0,
	lastSampleColorVertical: "transparent",
	lastSampleColorHorizontal: "transparent",
	// ---------------------------------
	// Legacy incremental scan state
	// ---------------------------------
	scanProgress: {
		x: 0,
		y: 5,
		isBottom: false,
		topResult: -1,
		bottomResult: -1,
		heightsFound: [] as BarSample[],
	},
	// ---------------------------------
	// Diagnostics and cleanup
	// ---------------------------------
	processLatency: 0,
	startTime: 0,
	lastIntervalTime: 0,
	currentInterval: 0,
	debugContainer: null as HTMLDivElement | null,
	sessionId: 0,
	fullscreenCleanup: null as (() => void) | null,
	navCleanup: null as (() => void) | null,
	isScheduled: false,
	isUltraWideMode: false,
};
