/**
 * Converts a hex color string to an RGBA object.
 *
 * @param {string} hex - A hex string like "#ff0000" or "#ff000080", with or without a leading "#".
 * @returns {{ r: number; g: number; b: number; a: number }} Values 0-255, except alpha (0-1).
 * @throws {Error} If the hex string is not 6 or 8 digits long.
 *
 * @example
 * const color = hexToRgba("#ff000080");
 * // result: { r: 255, g: 0, b: 0, a: 0.5019... }
 */
export function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
	hex = hex.replace(/^#/, "");

	if (hex.length === 6) {
		hex += "ff";
	} else if (hex.length !== 8) {
		throw new Error("Invalid hex color format");
	}

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const a = parseInt(hex.substring(6, 8), 16) / 255;

	return { r, g, b, a };
}

/**
 * Converts a hex color string to an RGB object without alpha.
 *
 * @param {string} hex - A hex string like "#f00" or "#ff0000", with or without a leading "#".
 * @returns {{ r: number; g: number; b: number }} Red, green and blue values from 0 to 255.
 *
 * @example
 * const color = hexToRgb("#f00");
 * // result: { r: 255, g: 0, b: 0 }
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
	hex = hex.replace(/^#/, "");

	if (hex.length === 3) {
		hex = hex
			.split("")
			.map(function (char) {
				return char + char;
			})
			.join("");
	}

	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	return { r, g, b };
}

/**
 * Converts red, green, blue and alpha numbers to a hex color string.
 *
 * @param {number} r - Red from 0 to 255. Values outside the range are clamped.
 * @param {number} g - Green from 0 to 255. Values outside the range are clamped.
 * @param {number} b - Blue from 0 to 255. Values outside the range are clamped.
 * @param {number} [a=1] - Alpha from 0 to 1. Defaults to 1 (fully opaque).
 * @returns {string} A hex string like "#ff0000", or "#ff000080" when alpha is below 1.
 *
 * @example
 * const hex = rgbaToHex(255, 0, 0, 0.5);
 * // result: "#ff000080"
 */
export function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
	r = Math.round(Math.min(255, Math.max(0, r)));
	g = Math.round(Math.min(255, Math.max(0, g)));
	b = Math.round(Math.min(255, Math.max(0, b)));
	a = Math.min(1, Math.max(0, a));

	let hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	if (a < 1) {
		hex += Math.round(a * 255)
			.toString(16)
			.padStart(2, "0");
	}

	return hex;
}

/**
 * Converts an RGB object to an HSV object.
 *
 * @param {{ r: number; g: number; b: number }} rgb - Red, green and blue, each from 0 to 255.
 * @returns {{ h: number; s: number; v: number }} Hue (0-360), saturation (0-100) and value (0-100).
 *
 * @example
 * const hsv = rgbToHsv({ r: 255, g: 0, b: 0 });
 * // result: { h: 0, s: 100, v: 100 }
 */
export function rgbToHsv(rgb: { r: number; g: number; b: number }): { h: number; s: number; v: number } {
	let r = rgb.r,
		g = rgb.g,
		b = rgb.b;
	r /= 255;
	g /= 255;
	b /= 255;
	const v = Math.max(r, g, b),
		c = v - Math.min(r, g, b);
	const h = c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
	return {
		h: Math.round(60 * (h < 0 ? h + 6 : h)),
		s: v && Math.round((c / v) * 100),
		v: Math.round(v * 100),
	};
}

/**
 * Converts an HSV object to an RGB object.
 *
 * @param {{ h: number; s: number; v: number }} hsv - Hue 0-360, saturation 0-100, value 0-100.
 * @returns {{ r: number; g: number; b: number }} Red, green and blue values from 0 to 255.
 *
 * @example
 * const rgb = hsvToRgb({ h: 0, s: 100, v: 100 });
 * // result: { r: 255, g: 0, b: 0 }
 */
export function hsvToRgb(hsv: { h: number; s: number; v: number }): { r: number; g: number; b: number } {
	const h = hsv.h;
	let s = hsv.s,
		v = hsv.v;
	s /= 100;
	v /= 100;
	const f = (n: number) => (v - v * s * Math.max(Math.min((n + h / 60) % 6, 4 - ((n + h / 60) % 6), 1), 0)) * 255;
	return { r: Math.round(f(5)), g: Math.round(f(3)), b: Math.round(f(1)) };
}
