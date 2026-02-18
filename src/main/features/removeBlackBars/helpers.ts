export interface BarDetectionData {
	imgData: Uint8ClampedArray;
	vHeight: number;
	threshold: number;
	sR: number;
	sG: number;
	sB: number;
	pixelBudget?: number;
	currentLastHeight?: number;
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
	let maxFrequency = 0;
	let mostCommonHeight: number | "inf" = "inf";

	for (let i = 0; i < heights.length; i++) {
		let frequency = 0;
		const candidate = heights[i];
		for (let j = i; j < heights.length; j++) {
			const target = heights[j];
			if (
				candidate === target ||
				(typeof candidate === "number" && typeof target === "number" && Math.abs(candidate - target) < 5)
			) {
				frequency++;
			}
		}

		if (
			frequency > maxFrequency ||
			(frequency === maxFrequency &&
				typeof candidate === "number" &&
				(typeof mostCommonHeight !== "number" || candidate > mostCommonHeight))
		) {
			maxFrequency = frequency;
			mostCommonHeight = candidate;
		}
	}

	if (maxFrequency < 3 || mostCommonHeight === "inf") {
		return currentLastHeight;
	}

	return mostCommonHeight;
}

export async function detectBlackBars(data: BarDetectionData, ctx?: any) {
	const { imgData, vHeight, threshold, sR, sG, sB, pixelBudget } = data;
	const heightsFound: (number | "inf")[] = [];
	let pixelsChecked = 0;

	if (ctx) ctx.fillStyle = "red";

	for (let x = 0; x < 5; x++) {
		let top = -1;
		let bottom = -1;

		// Top scan
		for (let i = 5; i < vHeight / 2; i++) {
			pixelsChecked++;
			const base = (i * 5 + x) * 4;
			if (checkPixelDiff(imgData[base], imgData[base + 1], imgData[base + 2], sR, sG, sB, threshold)) {
				top = i;
				break;
			}
			if (ctx) ctx.fillRect(x, i, 1, 1);
			
			if (pixelBudget && pixelsChecked >= pixelBudget) {
				await new Promise((resolve) => setTimeout(resolve, 1));
				pixelsChecked = 0;
			}
		}

		// Bottom scan
		for (let i = vHeight - 5; i > vHeight / 2; i--) {
			pixelsChecked++;
			const base = (i * 5 + x) * 4;
			if (checkPixelDiff(imgData[base], imgData[base + 1], imgData[base + 2], sR, sG, sB, threshold)) {
				bottom = vHeight - i;
				break;
			}
			if (ctx) ctx.fillRect(x, i, 1, 1);

			if (pixelBudget && pixelsChecked >= pixelBudget) {
				await new Promise((resolve) => setTimeout(resolve, 1));
				pixelsChecked = 0;
			}
		}

		if (top !== -1 && bottom !== -1) {
			heightsFound.push(Math.max(top, bottom));
		} else {
			heightsFound.push("inf");
		}
	}

	return heightsFound;
}
