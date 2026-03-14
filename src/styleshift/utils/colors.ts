import { Color_obj } from "../types/styleshiftTypes";
import { logger } from "../../shared/logger";

export function colorObjToHex({ hex, alpha }: Color_obj): string {
	const processedAlpha = Math.round((alpha / 100) * 255)
		.toString(16)
		.padStart(2, "0");
	return `${hex}${processedAlpha}`;
}

export function hexToColorObj(hex: string): { hex: string; alpha: number } {
	if (typeof hex !== "string") {
		logger.warn("colors", "hexToColorObj received non-string hex value:", hex);
		return { hex: "#000000", alpha: 100 };
	}
	const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
	const rgbHex = cleanHex.length === 8 ? cleanHex.slice(0, 6) : cleanHex;
	const alphaHex = cleanHex.length === 8 ? cleanHex.slice(6) : "FF";

	return {
		hex: `#${rgbHex}`,
		alpha: Math.round((parseInt(alphaHex, 16) / 255) * 100),
	};
}
