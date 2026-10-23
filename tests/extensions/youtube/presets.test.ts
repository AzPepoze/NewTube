// @ts-nocheck
import { expect, test } from "bun:test";
import { currentLookSettings, defaultSetting } from "../../../src/extensions/youtube/defaultSettings";
import { mergeBundledPresets, PRESET_THEMES, refreshBundledPresetList } from "../../../src/extensions/youtube/presets";

test("preset ids and names are unique and filled", () => {
	const ids = PRESET_THEMES.map((preset) => preset.themeId);
	const names = PRESET_THEMES.map((preset) => preset.themeName);

	expect(new Set(ids).size).toBe(ids.length);
	expect(new Set(names).size).toBe(names.length);
	for (const preset of PRESET_THEMES) {
		expect(preset.themeId.startsWith("preset-")).toBe(true);
		expect(preset.themeName.trim()).not.toBe("");
	}
});

test("every preset only sets keys that exist in the settings map", () => {
	for (const preset of PRESET_THEMES) {
		for (const key of Object.keys(preset.currentSettings)) {
			expect(Object.hasOwn(currentLookSettings, key)).toBe(true);
		}
	}
});

test("fresh install default is the Normal YouTube preset", () => {
	const normal = PRESET_THEMES.find((preset) => preset.themeId === "preset-normal-youtube");

	expect(normal).toBeDefined();
	expect(defaultSetting.currentSettings).toEqual(normal.currentSettings);
	expect(defaultSetting.currentSettings.EnableBackground).toBe(false);
});

test("merge gives a fresh install every bundled preset", () => {
	const merged = mergeBundledPresets(undefined);

	expect(merged.map((theme) => theme.themeId)).toEqual(PRESET_THEMES.map((theme) => theme.themeId));
});

test("merge replaces an old empty object with the preset list", () => {
	expect(mergeBundledPresets({}).length).toBe(PRESET_THEMES.length);
});

test("merge keeps the user's own themes first and adds missing presets once", () => {
	const merged = mergeBundledPresets([{ themeId: "my-theme", themeName: "Mine" }]);

	expect(merged[0].themeId).toBe("my-theme");
	expect(merged.length).toBe(PRESET_THEMES.length + 1);
	expect(mergeBundledPresets(merged).length).toBe(merged.length);
});

test("Normal YouTube resets hover and scrollbar to stock values", () => {
	const normal = PRESET_THEMES.find((preset) => preset.themeId === "preset-normal-youtube");

	expect(normal.currentSettings.GlobalHoverBackgroundColor).toBe("#ffffff1a");
	expect(normal.currentSettings.PlaylistHoverBackgroundColor).toBe("#ffffff1a");
	expect(normal.currentSettings.ScrollbarWidthStandard).toBe("auto");
	expect(normal.currentSettings.EnableModernScrollbars).toBe(false);
});

test("refresh replaces bundled presets and keeps user themes", () => {
	const userTheme = { themeId: "mine", themeName: "Mine", currentSettings: { MainThemeColor: "#123456ff" } };
	const stalePreset = { themeId: "preset-normal-youtube", themeName: "Normal YouTube", currentSettings: {} };
	const refreshed = refreshBundledPresetList([userTheme, stalePreset]);

	expect(refreshed[0]).toBe(userTheme);
	expect(refreshed[1]).toEqual(PRESET_THEMES.find((preset) => preset.themeId === "preset-normal-youtube"));
});

test("refresh does not bring back a deleted preset", () => {
	const refreshed = refreshBundledPresetList([{ themeId: "mine", themeName: "Mine" }]);

	expect(refreshed.map((theme) => theme.themeId)).toEqual(["mine"]);
});
