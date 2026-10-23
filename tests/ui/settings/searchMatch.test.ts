// @ts-nocheck -- Bun's test globals are not part of the extension TypeScript program.
import { expect, test } from "bun:test";
import { searchSettings } from "../../../src/ui/settings/searchMatch";

const settings = [
	{
		id: "EnableControlPanelAutohide",
		name: "Auto-Hide Bar",
		description: "Hides the control bar when the mouse is idle.",
	},
	{ id: "EnableControlPanelBlur", name: "Glass Effect", description: "Applies a frosted-glass blur effect." },
	{ id: "ControlPanelBlurAmount", name: "Glass Intensity", description: "Adjusts the strength of the glass effect." },
	{ id: "EnableCenteredControls", name: "Center Buttons", description: "Re-aligns the play and volume buttons." },
];

function names(query, label = "Video Control Bar") {
	return searchSettings(query, settings, label).map((setting) => setting.name);
}

test("finds a setting with words in any order", () => {
	expect(names("auto hide")).toEqual(["Auto-Hide Bar"]);
	expect(names("hide auto")).toEqual(["Auto-Hide Bar"]);
});

test("finds a setting when separators are left out", () => {
	expect(names("autohide")).toEqual(["Auto-Hide Bar"]);
	expect(names("Auto-Hide Bar")).toEqual(["Auto-Hide Bar"]);
});

test("finds a setting by a partial word", () => {
	expect(names("hid")).toContain("Auto-Hide Bar");
});

test("finds a setting by its id", () => {
	expect(names("controlpanelautohide")).toEqual(["Auto-Hide Bar"]);
});

test("ignores case and accents", () => {
	expect(names("GLÁSS")).toEqual(["Glass Effect", "Glass Intensity"]);
});

test("ranks name matches above description matches", () => {
	expect(names("glass")).toEqual(["Glass Effect", "Glass Intensity"]);
});

test("matches the category label", () => {
	expect(names("video")).toEqual(settings.map((setting) => setting.name));
});

test("returns nothing when a word is not found", () => {
	expect(names("auto zebra")).toEqual([]);
});

test("returns every setting for an empty query", () => {
	expect(names("   ")).toHaveLength(settings.length);
});
