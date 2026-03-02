import ColorThief from "colorthief";
import { rgbToHsv, hsvToRgb, getDocumentBody } from "../../styleshift/shared/normal";
import { getUserSetting } from "../../styleshift/core/storageManager";
import { onYoutubeNavigate, getYoutubeVideoId, onYoutubeFullscreen } from "../modules/youtube";
import { shouldFeatureShow } from "./helpers";
import { registerSettingListener, unregisterSettingListener } from "../../styleshift/settings/functions";

const state = {
	enabled: false,
	navigateCleanup: null as (() => void) | null,
	fullscreenCleanup: null as (() => void) | null,
	settingListeners: [] as (() => void)[],
};

function getSortedPalette(palette: [number, number, number][]) {
	function calScore(color: [number, number, number]) {
		const hsv = rgbToHsv({ r: color[0], g: color[1], b: color[2] });
		// score = (s * 1.5) + (v / 100 * 100) -> using 0-100 scale
		const score = hsv.s * 1.5 + hsv.v;
		return score;
	}

	return palette
		.map((color) => ({ color, score: calScore(color) }))
		.sort((a, b) => b.score - a.score)
		.map((item) => item.color);
}

async function getSampleColor(img: HTMLImageElement): Promise<[number, number, number]> {
	const colorThief = new ColorThief();
	const dominant = colorThief.getColor(img) as [number, number, number];
	const hsv = rgbToHsv({ r: dominant[0], g: dominant[1], b: dominant[2] });

	// Legacy: s > 0.2 (20) and v > 100 (39.2 on 100 scale)
	if (hsv.s > 20 && hsv.v > 39.2) {
		return dominant;
	} else {
		const palette = (colorThief.getPalette(img, 10) as [number, number, number][]) || [];
		const sorted = getSortedPalette(palette);
		return sorted[0] || dominant;
	}
}

export async function clearTheme() {
	const body = await getDocumentBody();
	if (!body) return;

	const props = [
		"--nt-theme-color",
		"--nt-theme-transparent",
		"--nt-theme-accent",
		"--nt-playlist-hover-bg",
		"--nt-text-link",
		"--nt-text-channel",
		"--nt-topbar-bg",
		"--nt-search-bg-hover",
		"--nt-timestamp-bg",
		"--nt-text-secondary",
		"--nt-text-timestamp",
		"--nt-text-primary",
		"--nt-bg-main",
		"--nt-timeline-bg",
		"--nt-timeline-load",
		"--nt-player-bg",
	];

	props.forEach((prop) => body.style.removeProperty(prop));
}

export function enableThemeByVideo() {
	state.enabled = true;

	const updateTheme = async () => {
		if (!state.enabled) return;

		const videoId = getYoutubeVideoId();
		if (!videoId) {
			clearTheme();
			return;
		}

		// Use stick: true to avoid clearing the theme during navigation
		// while the video element is being recreated.
		if (!shouldFeatureShow(false, true)) {
			clearTheme();
			return;
		}

		// Use mqdefault first, try maxres if possible?
		// Actually legacy used maxresdefault then 0.jpg as fallback
		const thumbUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

		try {
			const img = new Image();
			img.crossOrigin = "Anonymous";
			img.src = thumbUrl;

			await new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = async () => {
					img.src = `https://i.ytimg.com/vi/${videoId}/0.jpg`;
					img.onerror = reject;
				};
			});

			let color = await getSampleColor(img);

			// Grayscale check: if r == g == b, it might be a black frame or weird thumb
			if (color[0] === color[1] && color[1] === color[2]) {
				// Try first frame thumb
				img.src = `https://i.ytimg.com/vi/${videoId}/0.jpg`;
				await new Promise((resolve) => {
					img.onload = resolve;
					img.onerror = resolve; // just continue if fails
				});
				color = await getSampleColor(img);
			}

			// Legacy Normalization
			const maxVal = Math.max(color[0], color[1], color[2]);
			const getAdd = 255 - maxVal;
			color = [color[0] + getAdd, color[1] + getAdd, color[2] + getAdd];

			const body = await getDocumentBody();
			if (!body || !state.enabled) return;

			const setProp = (name: string, val: string, priority?: string) => body.style.setProperty(name, val, priority);

			// HSV Adjustments
			const hsv = rgbToHsv({ r: color[0], g: color[1], b: color[2] });
			hsv.s *= 1.5;
			if (hsv.s > 60) hsv.s = 60;

			const themeRgb = hsvToRgb(hsv);
			const themeRgba = (a: number) => `rgba(${themeRgb.r}, ${themeRgb.g}, ${themeRgb.b}, ${a})`;

			setProp("--nt-theme-color", themeRgba(1));
			setProp("--nt-theme-transparent", themeRgba(0.3));
			setProp("--nt-theme-accent", themeRgba(0.3));
			setProp("--nt-playlist-hover-bg", themeRgba(0.3));
			setProp("--nt-text-link", themeRgba(1));
			setProp("--nt-text-channel", themeRgba(1));
			setProp("--nt-topbar-bg", themeRgba(0.3));
			setProp("--nt-search-bg-hover", themeRgba(0.3));

			// Derived Colors
			const timeBgHsv = { ...hsv, v: hsv.v * 0.4 };
			const timeBgRgb = hsvToRgb(timeBgHsv);
			setProp("--nt-timestamp-bg", `rgba(${timeBgRgb.r}, ${timeBgRgb.g}, ${timeBgRgb.b}, 0.8)`);

			const text2Hsv = { ...hsv, s: hsv.s * 0.8 };
			const text2Rgb = hsvToRgb(text2Hsv);
			setProp("--nt-text-secondary", `rgba(${text2Rgb.r}, ${text2Rgb.g}, ${text2Rgb.b}, 1)`, "important");

			const timetextHsv = { ...hsv, s: hsv.s * 0.5 };
			const timetextRgb = hsvToRgb(timetextHsv);
			setProp("--nt-text-timestamp", `rgba(${timetextRgb.r}, ${timetextRgb.g}, ${timetextRgb.b}, 1)`, "important");

			const textHsv = { ...hsv, s: hsv.s * 0.4 };
			const textRgb = hsvToRgb(textHsv);
			setProp("--nt-text-primary", `rgba(${textRgb.r}, ${textRgb.g}, ${textRgb.b}, 1)`, "important");

			// Background Background
			const bgHsv = { ...hsv, v: hsv.v * 0.15 };
			const bgRgb = hsvToRgb(bgHsv);
			const isSolid = await getUserSetting("EnableSolidThemeByVideo");
			const bgOpacity = isSolid ? 1 : (await getUserSetting("BackgroundOpacity")) / 100;
			setProp("--nt-bg-main", `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity})`);

			// Timeline
			const timelineHsv = { ...hsv, v: hsv.v * 0.4 };
			const timelineRgb = hsvToRgb(timelineHsv);
			setProp("--nt-timeline-bg", `rgba(${timelineRgb.r}, ${timelineRgb.g}, ${timelineRgb.b}, 1)`);

			const loadedHsv = { ...hsv, s: hsv.s * 0.5, v: hsv.v * 0.6 };
			const loadedRgb = hsvToRgb(loadedHsv);
			setProp("--nt-timeline-load", `rgba(${loadedRgb.r}, ${loadedRgb.g}, ${loadedRgb.b}, 1)`);

			// Control Panel
			const cpHsv = { ...hsv, v: hsv.v * 0.2 };
			const cpRgb = hsvToRgb(cpHsv);
			setProp("--nt-player-bg", `rgba(${cpRgb.r}, ${cpRgb.g}, ${cpRgb.b}, 0.7)`);
		} catch (_e) {
			// logger.warn("theme", "Theme extraction failed", e);
		}
	};

	updateTheme();
	state.navigateCleanup = onYoutubeNavigate(updateTheme);
	state.fullscreenCleanup = onYoutubeFullscreen(updateTheme);

	const solidListener = () => updateTheme();

	registerSettingListener("EnableSolidThemeByVideo", solidListener);

	state.settingListeners.push(() => unregisterSettingListener("EnableSolidThemeByVideo", solidListener));
}

export function disableThemeByVideo() {
	state.enabled = false;
	if (state.navigateCleanup) {
		state.navigateCleanup();
		state.navigateCleanup = null;
	}
	if (state.fullscreenCleanup) {
		state.fullscreenCleanup();
		state.fullscreenCleanup = null;
	}

	state.settingListeners.forEach((cleanup) => cleanup());
	state.settingListeners = [];

	clearTheme();
}
