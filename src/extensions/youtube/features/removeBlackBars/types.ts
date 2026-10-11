// ---------------------------------
// Detection modes and sample data
// ---------------------------------

export type BlackBarMode = "vertical" | "horizontal" | "both";
export type BarSample = number | "inf";

export interface BarEdgeSamples {
	start: BarSample[];
	end: BarSample[];
}

// ---------------------------------
// Detection request
// ---------------------------------

export interface BarDetectionData {
	verticalImgData: Uint8ClampedArray;
	horizontalImgData?: Uint8ClampedArray;
	videoHeight: number;
	videoWidth?: number;
	mode?: BlackBarMode;
	threshold: number;
	verticalR: number;
	verticalG: number;
	verticalB: number;
	horizontalR?: number;
	horizontalG?: number;
	horizontalB?: number;
	pixelBudget?: number;
	currentLastHeight?: number;
	currentLastWidth?: number;
}
