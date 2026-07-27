export interface BarDetectionData {
	imgData: Uint8ClampedArray;
	vHeight: number;
	vWidth?: number;
	mode?: "vertical" | "horizontal" | "both";
	threshold: number;
	vR: number;
	vG: number;
	vB: number;
	hR?: number;
	hG?: number;
	hB?: number;
	pixelBudget?: number;
	currentLastHeight?: number;
	currentLastWidth?: number;
	horizontalImgData?: Uint8ClampedArray;
}

export function checkPixelDiff(
	r1: number,
	g1: number,
	b1: number,
	r2: number,
	g2: number,
	b2: number,
	threshold: number,
) {
	return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) > threshold;
}

export function calculateVdoHeight(heights: (number | "inf")[], currentLastHeight: number) {
	const validHeights = heights.filter((h): h is number => typeof h === "number");
	if (validHeights.length < 3) return currentLastHeight;

	const frequencyMap = new Map<number, number>();
	for (const height of validHeights) {
		const rounded = Math.round(height / 5) * 5; // Group in 5px bins
		frequencyMap.set(rounded, (frequencyMap.get(rounded) || 0) + 1);
	}

	let maxFreq = 0;
	let bestHeight = currentLastHeight;

	for (const [height, freq] of frequencyMap.entries()) {
		if (freq > maxFreq || (freq === maxFreq && height > bestHeight)) {
			maxFreq = freq;
			bestHeight = height;
		}
	}

	return maxFreq >= 3 ? bestHeight : currentLastHeight;
}

export function calculateVdoWidth(widths: (number | "inf")[], currentLastWidth: number) {
	const validWidths = widths.filter((w): w is number => typeof w === "number");
	if (validWidths.length < 3) return currentLastWidth;

	const frequencyMap = new Map<number, number>();
	for (const width of validWidths) {
		const rounded = Math.round(width / 5) * 5;
		frequencyMap.set(rounded, (frequencyMap.get(rounded) || 0) + 1);
	}

	let maxFreq = 0;
	let bestWidth = currentLastWidth;

	for (const [width, freq] of frequencyMap.entries()) {
		if (freq > maxFreq || (freq === maxFreq && width > bestWidth)) {
			maxFreq = freq;
			bestWidth = width;
		}
	}

	return maxFreq >= 3 ? bestWidth : currentLastWidth;
}

export async function detectBlackBars(data: BarDetectionData, ctx?: CanvasRenderingContext2D | null) {
	const {
		imgData,
		vHeight,
		vWidth = 0,
		mode = "vertical",
		threshold,
		vR,
		vG,
		vB,
		hR = vR,
		hG = vG,
		hB = vB,
		pixelBudget,
		horizontalImgData,
	} = data;
	const heightsFound: (number | "inf")[] = [];
	const widthsFound: (number | "inf")[] = [];
	let pixelsChecked = 0;

	const isDifferentVertical = (dataArray: Uint8ClampedArray, base: number) =>
		checkPixelDiff(dataArray[base], dataArray[base + 1], dataArray[base + 2], vR, vG, vB, threshold);

	const isDifferentHorizontal = (dataArray: Uint8ClampedArray, base: number) =>
		checkPixelDiff(dataArray[base], dataArray[base + 1], dataArray[base + 2], hR, hG, hB, threshold);

	if (mode === "vertical" || mode === "both") {
		if (ctx) ctx.fillStyle = "red";

		for (let x = 0; x < 5; x++) {
			let top = -1;
			let bottom = -1;

			// Top scan (skip first 5 pixels)
			for (let i = 5; i < vHeight / 2; i++) {
				pixelsChecked++;
				if (isDifferentVertical(imgData, (i * 5 + x) * 4)) {
					top = i;
					break;
				}
				if (ctx) ctx.fillRect(x, i, 1, 1);
				if (pixelBudget && pixelBudget > 0 && pixelsChecked >= pixelBudget) {
					await new Promise((r) => setTimeout(r, 1));
					pixelsChecked = 0;
				}
			}

			// Bottom scan (skip last 5 pixels)
			for (let i = vHeight - 5; i > vHeight / 2; i--) {
				pixelsChecked++;
				if (isDifferentVertical(imgData, (i * 5 + x) * 4)) {
					bottom = vHeight - i;
					break;
				}
				if (ctx) ctx.fillRect(x, i, 1, 1);
				if (pixelBudget && pixelBudget > 0 && pixelsChecked >= pixelBudget) {
					await new Promise((r) => setTimeout(r, 1));
					pixelsChecked = 0;
				}
			}

			if (top !== -1 && bottom !== -1) {
				heightsFound.push(Math.max(top, bottom));
			} else {
				heightsFound.push("inf");
			}
		}
	}

	if ((mode === "horizontal" || mode === "both") && horizontalImgData && vWidth > 0) {
		for (let y = 0; y < 5; y++) {
			let left = -1;
			let right = -1;

			// Left scan (skip first 5 pixels)
			for (let i = 5; i < vWidth / 2; i++) {
				pixelsChecked++;
				if (isDifferentHorizontal(horizontalImgData, (y * vWidth + i) * 4)) {
					left = i;
					break;
				}
				if (pixelBudget && pixelBudget > 0 && pixelsChecked >= pixelBudget) {
					await new Promise((r) => setTimeout(r, 1));
					pixelsChecked = 0;
				}
			}

			// Right scan (skip last 5 pixels)
			for (let i = vWidth - 5; i > vWidth / 2; i--) {
				pixelsChecked++;
				if (isDifferentHorizontal(horizontalImgData, (y * vWidth + i) * 4)) {
					right = vWidth - i;
					break;
				}
				if (pixelBudget && pixelBudget > 0 && pixelsChecked >= pixelBudget) {
					await new Promise((r) => setTimeout(r, 1));
					pixelsChecked = 0;
				}
			}

			if (left !== -1 && right !== -1) {
				widthsFound.push(Math.max(left, right));
			} else {
				widthsFound.push("inf");
			}
		}
	}

	return { heightsFound, widthsFound };
}
