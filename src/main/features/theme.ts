import { get_ytd_app } from "../modules/main";
// @ts-ignore
import ColorThief from "colorthief";

export function setup_theme_by_video() {
	const color_thief = new ColorThief();

	const update_theme = async () => {
		const video_id = new URLSearchParams(window.location.search).get("v");
		if (!video_id) return;

		// Use mqdefault for faster loading, sufficient for color extraction
		const thumb_url = `https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`;

		try {
			const img = new Image();
			img.crossOrigin = "Anonymous";
			img.src = thumb_url;

			await new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = reject;
			});

			// Get dominant color [r, g, b]
			const color = color_thief.getColor(img);
			const ytd_app = await get_ytd_app();

			if (ytd_app && color) {
				const [r, g, b] = color;
				const color_string = `rgba(${r}, ${g}, ${b}, 0.8)`;

				ytd_app.style.setProperty("--newtube-bg-tint-color", color_string);
				ytd_app.style.setProperty("--theme-color-r", r.toString());
				ytd_app.style.setProperty("--theme-color-g", g.toString());
				ytd_app.style.setProperty("--theme-color-b", b.toString());
			}
		} catch (e) {
			// console.warn("Theme extraction failed", e);
		}
	};

	update_theme();
	window.addEventListener("yt-navigate-finish", update_theme);
}
