export interface ImageTransformParams {
	scale?: number;
	positionX?: number;
	positionY?: number;
	cropTop?: number;
	cropBottom?: number;
	cropLeft?: number;
	cropRight?: number;
	flip?: boolean;
}

export function computeImageTransformStyles(params: ImageTransformParams): Record<string, string> {
	const scale = params.scale ?? 1;
	const posX = params.positionX ?? 50;
	const posY = params.positionY ?? 50;
	const cropTop = params.cropTop ?? 0;
	const cropBottom = params.cropBottom ?? 0;
	const cropLeft = params.cropLeft ?? 0;
	const cropRight = params.cropRight ?? 0;
	const flip = params.flip ?? false;

	return {
		scale: `${scale}`,
		translate: `${posX}% ${posY}%`,
		clipPath: `inset(${cropTop}% ${cropRight}% ${cropBottom}% ${cropLeft}%)`,
		transform: flip ? "scaleX(-1)" : "scaleX(1)",
	};
}
