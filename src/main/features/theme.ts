import { get_ytd_app } from "../modules/youtube";
import ColorThief from "colorthief";
import { rgb_to_hsv, hsv_to_rgb } from "../../styleshift/build-in-functions/normal";
import { get_user_setting } from "../../styleshift/core/storage-manager";

function get_sorted_palette(palette: [number, number, number][]) {
	function cal_score(color: [number, number, number]) {
		const hsv = rgb_to_hsv({ r: color[0], g: color[1], b: color[2] });
		// score = (s * 1.5) + (v / 100 * 100) -> using 0-100 scale
		const score = hsv.s * 1.5 + hsv.v;
		return score;
	}

	return palette
		.map((color) => ({ color, score: cal_score(color) }))
		.sort((a, b) => b.score - a.score)
		.map((item) => item.color);
}

async function get_sample_color(img: HTMLImageElement): Promise<[number, number, number]> {
	const color_thief = new ColorThief();
	const dominant = color_thief.getColor(img) as [number, number, number];
	const hsv = rgb_to_hsv({ r: dominant[0], g: dominant[1], b: dominant[2] });

	// Legacy: s > 0.2 (20) and v > 100 (39.2 on 100 scale)
	if (hsv.s > 20 && hsv.v > 39.2) {
		return dominant;
	} else {
		const palette = (color_thief.getPalette(img, 10) as [number, number, number][]) || [];
		const sorted = get_sorted_palette(palette);
		return sorted[0] || dominant;
	}
}

export function setup_theme_by_video() {
	const update_theme = async () => {
		const video_id = new URLSearchParams(window.location.search).get("v");
		if (!video_id) return;

		// Use mqdefault first, try maxres if possible?
		// Actually legacy used maxresdefault then 0.jpg as fallback
		const thumb_url = `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`;

		try {
			const img = new Image();
			img.crossOrigin = "Anonymous";
			img.src = thumb_url;

			await new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = async () => {
					img.src = `https://i.ytimg.com/vi/${video_id}/0.jpg`;
					img.onerror = reject;
				};
			});

			let color = await get_sample_color(img);

			// Grayscale check: if r == g == b, it might be a black frame or weird thumb
			if (color[0] === color[1] && color[1] === color[2]) {
				// Try first frame thumb
				img.src = `https://i.ytimg.com/vi/${video_id}/0.jpg`;
				await new Promise((resolve) => {
					img.onload = resolve;
					img.onerror = resolve; // just continue if fails
				});
				color = await get_sample_color(img);
			}

			// Legacy Normalization
			const max_val = Math.max(color[0], color[1], color[2]);
			const get_add = 255 - max_val;
			color = [color[0] + get_add, color[1] + get_add, color[2] + get_add];

			const ytd_app = await get_ytd_app();
			if (!ytd_app) return;

			const set_prop = (name: string, val: string) => ytd_app.style.setProperty(name, val);

			// HSV Adjustments
			const hsv = rgb_to_hsv({ r: color[0], g: color[1], b: color[2] });
			hsv.s *= 1.5;
			if (hsv.s > 60) hsv.s = 60;

			const theme_rgb = hsv_to_rgb(hsv);
			const theme_rgba = (a: number) => `rgba(${theme_rgb.r}, ${theme_rgb.g}, ${theme_rgb.b}, ${a})`;

			set_prop("--nt-theme-color", theme_rgba(1));
			set_prop("--nt-theme-transparent", theme_rgba(0.3));
			set_prop("--nt-theme-accent", theme_rgba(0.3));
			set_prop("--nt-playlist-hover-bg", theme_rgba(0.3));
			set_prop("--nt-text-link", theme_rgba(1));
			set_prop("--nt-text-channel", theme_rgba(1));
			set_prop("--nt-topbar-bg", theme_rgba(0.3));
			set_prop("--nt-search-bg-hover", theme_rgba(0.3));

			// Derived Colors
			const time_bg_hsv = { ...hsv, v: hsv.v * 0.4 };
			const time_bg_rgb = hsv_to_rgb(time_bg_hsv);
			set_prop("--nt-timestamp-bg", `rgba(${time_bg_rgb.r}, ${time_bg_rgb.g}, ${time_bg_rgb.b}, 0.8)`);

			const text2_hsv = { ...hsv, s: hsv.s * 0.8 };
			const text2_rgb = hsv_to_rgb(text2_hsv);
			set_prop("--nt-text-secondary", `rgba(${text2_rgb.r}, ${text2_rgb.g}, ${text2_rgb.b}, 1)`);

			const timetext_hsv = { ...hsv, s: hsv.s * 0.5 };
			const timetext_rgb = hsv_to_rgb(timetext_hsv);
			set_prop("--nt-text-timestamp", `rgba(${timetext_rgb.r}, ${timetext_rgb.g}, ${timetext_rgb.b}, 1)`);

			const text_hsv = { ...hsv, s: hsv.s * 0.4 };
			const text_rgb = hsv_to_rgb(text_hsv);
			set_prop("--nt-text-primary", `rgba(${text_rgb.r}, ${text_rgb.g}, ${text_rgb.b}, 1)`);

			// Background Background
			const bg_hsv = { ...hsv, v: hsv.v * 0.15 };
			const bg_rgb = hsv_to_rgb(bg_hsv);
			const is_solid = await get_user_setting("Solid_BG_Theme_by_video");
			const bg_opacity = is_solid ? 1 : (await get_user_setting("BGO")) / 100;
			set_prop("--nt-bg-main", `rgba(${bg_rgb.r}, ${bg_rgb.g}, ${bg_rgb.b}, ${bg_opacity})`);

			// Timeline
			const timeline_hsv = { ...hsv, v: hsv.v * 0.4 };
			const timeline_rgb = hsv_to_rgb(timeline_hsv);
			set_prop("--nt-timeline-bg", `rgba(${timeline_rgb.r}, ${timeline_rgb.g}, ${timeline_rgb.b}, 1)`);

			const loaded_hsv = { ...hsv, s: hsv.s * 0.5, v: hsv.v * 0.6 };
			const loaded_rgb = hsv_to_rgb(loaded_hsv);
			set_prop("--nt-timeline-load", `rgba(${loaded_rgb.r}, ${loaded_rgb.g}, ${loaded_rgb.b}, 1)`);

			// Control Panel
			const cp_hsv = { ...hsv, v: hsv.v * 0.2 };
			const cp_rgb = hsv_to_rgb(cp_hsv);
			set_prop("--nt-player-bg", `rgba(${cp_rgb.r}, ${cp_rgb.g}, ${cp_rgb.b}, 0.7)`);
		} catch (_e) {
			// logger.warn("theme", "Theme extraction failed", e);
		}
	};

	update_theme();
	window.addEventListener("yt-navigate-finish", update_theme);
}
