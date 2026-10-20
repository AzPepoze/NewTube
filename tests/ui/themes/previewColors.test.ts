// @ts-nocheck
import { expect, test } from "bun:test";
import { getPreviewColors, toCssColor } from "../../../src/ui/themes/previewColors";
import { defaultSetting } from "../../../src/extensions/youtube/defaultSettings";

test("stock colors when there are no settings", () => {
	const colors = getPreviewColors();

	expect(colors.page).toBe("#0f0f0f");
	expect(colors.text).toBe("#ffffff");
	expect(colors.accent).toBe("#ff0000");
	expect(colors.radius).toBe(12);
});

test("Normal YouTube keeps the stock page color", () => {
	const colors = getPreviewColors(defaultSetting.currentSettings);

	expect(colors.page).toBe("#0f0f0f");
});

test("a solid background uses its tint as the page color", () => {
	const colors = getPreviewColors({
		EnableBackground: true,
		BackgroundMode: "Solid",
		BackgroundTintColor: "#14082eff",
	});

	expect(colors.page).toBe("rgba(20, 8, 46, 1.000)");
});

test("the tint is ignored when the background is not solid", () => {
	const colors = getPreviewColors({
		EnableBackground: true,
		BackgroundMode: "Image",
		BackgroundTintColor: "#14082eff",
	});

	expect(colors.page).toBe("#0f0f0f");
});

test("a light theme flips the default page and text colors", () => {
	const colors = getPreviewColors({ EnableAppLightTheme: true });

	expect(colors.page).toBe("#ffffff");
	expect(colors.text).toBe("#0f0f0f");
});

test("8-digit hex keeps its alpha", () => {
	expect(toCssColor("#ff000080")).toBe("rgba(255, 0, 0, 0.502)");
	expect(toCssColor("#ffffffff")).toBe("rgba(255, 255, 255, 1.000)");
});

test("values that are not hex are passed through", () => {
	expect(toCssColor("var(--theme-0)")).toBe("var(--theme-0)");
});

test("a missing key falls back to the stock color", () => {
	const colors = getPreviewColors({ MainThemeColor: "#00e5ffff" });

	expect(colors.accent).toBe("rgba(0, 229, 255, 1.000)");
	expect(colors.border).toBe("#303030");
});
