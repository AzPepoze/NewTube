// @ts-nocheck
import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { currentLookSettings } from "../../../src/extensions/youtube/defaultSettings";
import { normalYoutubeSettings } from "../../../src/extensions/youtube/presets/normalYoutube";

const CATEGORIES_DIR = path.join(import.meta.dir, "../../../src/extensions/youtube/categories");

// Controls that store no value of their own: buttons, custom panels, and condition wrappers.
const NO_STORED_VALUE = new Set([
	"AnimationVideoControlsPanelAutohide",
	"FontManager",
	"ThumbnailSlideOnHoverAnimationPadding",
	"YouTubeSetCurrentVideoAsBackground",
]);

// Settings that only act when their parent toggle is on, so Normal YouTube can leave them as they are.
const GATED_PREFIXES = ["RemoveBlackBars", "VideoAmbient", "YouTubeBackground"];

function categorySettingIds(): string[] {
	return readdirSync(CATEGORIES_DIR)
		.filter((file) => file.endsWith(".ts"))
		.flatMap((file) => [...readFileSync(path.join(CATEGORIES_DIR, file), "utf8").matchAll(/id: "([A-Za-z0-9_]+)"/g)])
		.map((match) => match[1]);
}

function isGated(key: string): boolean {
	return GATED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

test("every stored setting id has a default in the look map", () => {
	const missing = categorySettingIds().filter(
		(id) => !NO_STORED_VALUE.has(id) && !Object.hasOwn(currentLookSettings, id),
	);

	expect(missing).toEqual([]);
});

test("Normal YouTube turns off every ungated look toggle that is on by default", () => {
	const stillOn = Object.keys(currentLookSettings).filter(
		(key) => currentLookSettings[key] === true && !Object.hasOwn(normalYoutubeSettings, key) && !isGated(key),
	);

	// AutoUpdateTheme is a behaviour, not a look. FadeBorder only applies under EnhancementIndependentScroll (off).
	expect(stillOn).toEqual(["AutoUpdateTheme", "EnhancementIndependentScrollFadeBorder"]);
});
