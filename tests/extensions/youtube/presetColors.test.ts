// @ts-nocheck
import { expect, test } from "bun:test";
import { currentLookSettings } from "../../../src/extensions/youtube/defaultSettings";
import { PRESET_THEMES } from "../../../src/extensions/youtube/presets";
import { presetColors } from "../../../src/extensions/youtube/presets/colors";

const themedPresets = PRESET_THEMES.filter((preset) => preset.themeId !== "preset-normal-youtube");

function rgb(hex) {
	return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
}

function composite(hex, background) {
	const alpha = parseInt(hex.slice(7, 9) || "ff", 16) / 255;
	return rgb(hex).map((channel, index) => channel * alpha + background[index] * (1 - alpha));
}

function luminance(color) {
	const linear = color.map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
	return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(foreground, background) {
	const first = luminance(rgb(foreground));
	const second = luminance(background);
	return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test("a preset palette supplies every color setting instead of inheriting the original look", () => {
	const colorIds = Object.keys(currentLookSettings).filter((id) => /^#[a-f0-9]{6,8}$/i.test(currentLookSettings[id]));
	const palette = presetColors({ accent: "#3ea6ff", surface: "#0f0f0f" });

	expect(Object.keys(palette).sort()).toEqual(colorIds.sort());
	for (const value of Object.values(palette)) expect(value).toMatch(/^#[a-f0-9]{8}$/i);
});

for (const preset of themedPresets) {
	test(`${preset.themeName} has readable text, links, player controls, and badges`, () => {
		const settings = preset.currentSettings;
		const page = rgb(settings.BackgroundTintColor);
		for (const id of ["PrimaryTextColor", "SecondaryTextColor", "LinkTextColor", "MainThemeColor"]) {
			expect(contrast(settings[id], page)).toBeGreaterThanOrEqual(4.5);
		}
		for (const background of [
			[0, 0, 0],
			[1, 1, 1],
		]) {
			const panel = composite(settings.ControlPanelBackgroundColor, background);
			expect(contrast(settings.ControlPanelTextColor, panel)).toBeGreaterThanOrEqual(4.5);
		}
		expect(contrast(settings.PrimaryTextColor, rgb(settings.ControlPanelPopupBackgroundColor))).toBeGreaterThanOrEqual(
			4.5,
		);
		expect(
			contrast(settings.ThumbnailLiveBadgeTextColor, rgb(settings.ThumbnailLiveBadgeBackgroundColor)),
		).toBeGreaterThanOrEqual(4.5);
		expect([settings.MainThemeColor, settings.PrimaryTextColor]).toContain(settings.ControlPanelTextColor);
	});
}
