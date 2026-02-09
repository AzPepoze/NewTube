import { Color_obj } from "../types/store";
import { logger } from "./logger";

export function color_obj_to_hex({ hex, alpha }: Color_obj): string {
	const processed_alpha = Math.round((alpha / 100) * 255)
		.toString(16)
		.padStart(2, "0");
	return `${hex}${processed_alpha}`;
}

export function hex_to_color_obj(hex: string): { hex: string; alpha: number } {
	if (typeof hex !== "string") {
		logger.warn("colors", "hex_to_color_obj received non-string hex value:", hex);
		return { hex: "#000000", alpha: 100 };
	}
	const clean_hex = hex.startsWith("#") ? hex.slice(1) : hex;
	const rgb_hex = clean_hex.length === 8 ? clean_hex.slice(0, 6) : clean_hex;
	const alpha_hex = clean_hex.length === 8 ? clean_hex.slice(6) : "FF";

	return {
		hex: `#${rgb_hex}`,
		alpha: Math.round((parseInt(alpha_hex, 16) / 255) * 100),
	};
}
