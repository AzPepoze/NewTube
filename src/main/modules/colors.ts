export function RGBtoHSV(color: [number, number, number]): [number, number, number] {
	let r, g, b, h, s, v;
	r = color[0];
	g = color[1];
	b = color[2];
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);

	v = max;
	const delta = max - min;
	if (max !== 0)
		s = delta / max; // s
	else {
		// r = g = b = 0        // s = 0, v is undefined
		s = 0;
		h = -1;
		return [h, s, 0];
	}
	if (r === max)
		h = (g - b) / delta; // between yellow & magenta
	else if (g === max)
		h = 2 + (b - r) / delta; // between cyan & yellow
	else h = 4 + (r - g) / delta; // between magenta & cyan
	h *= 60; // degrees
	if (h < 0) h += 360;
	if (isNaN(h)) h = 0;
	return [h, s, v];
}

export function HSVtoRGB(color: [number, number, number]): [number, number, number] {
	let i;
	let h, s, v, r, g, b;
	h = color[0];
	s = color[1];
	v = color[2];
	if (s === 0) {
		// achromatic (grey)
		r = g = b = v;
		return [r, g, b];
	}
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	const f = h - i; // factorial part of h
	const p = v * (1 - s);
	const q = v * (1 - s * f);
	const t = v * (1 - s * (1 - f));
	switch (i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		default: // case 5:
			r = v;
			g = p;
			b = q;
			break;
	}
	return [r, g, b];
}

export function hexToRgb(hex: string): [number, number, number] | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
	return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
