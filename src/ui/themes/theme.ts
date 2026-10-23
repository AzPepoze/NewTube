import { logger } from "@/shared/logger";
import { getFromStorage } from "@core/storage/manager";

/**
 * Sets the glass blur amount on an element. It lives on the element, not in the stylesheet,
 * so it still applies after the extension stylesheet is hidden.
 */
function setBlurAmount(element: HTMLElement, amount: number) {
	element.style.setProperty("--setting-bg-blur-amount", `${amount}px`);
}

export async function applyThemeToElement(element: HTMLElement) {
	const isLightTheme = await getFromStorage("EnableAppLightTheme");
	const isTransparent = await getFromStorage("EnableSettingsBackgroundBlur");
	const blurAmount = await getFromStorage("SettingsBackgroundBlurAmount");

	element.setAttribute("data-theme", isLightTheme ? "light" : "dark");
	element.setAttribute("data-transparent", isTransparent ? "true" : "false");
	setBlurAmount(element, blurAmount);
}

export async function syncAllThemes() {
	const elements = document.querySelectorAll<HTMLElement>(".styleshift-main");

	const isLightTheme = await getFromStorage("EnableAppLightTheme");
	const isTransparent = await getFromStorage("EnableSettingsBackgroundBlur");
	const blurAmount = await getFromStorage("SettingsBackgroundBlurAmount");

	const theme = isLightTheme ? "light" : "dark";
	const transparent = isTransparent ? "true" : "false";

	logger.info("theme", "Syncing all themes...", { theme, transparent, blurAmount });

	elements.forEach((el) => {
		el.setAttribute("data-theme", theme);
		el.setAttribute("data-transparent", transparent);
		setBlurAmount(el, blurAmount);
	});
}
