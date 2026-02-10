import { getFromStorage } from "@/styleshift/core/storageManager";
import { logger } from "@/styleshift/utils/logger";

/**
 * Applies the current theme and transparency settings to a specific element.
 * @param element The HTMLElement to apply attributes to.
 */
export async function applyThemeToElement(element: HTMLElement) {
	const isLightTheme = await getFromStorage("App_Light_Theme");
	const isTransparent = await getFromStorage("Setting_BG_Transparent");

	element.setAttribute("data-theme", isLightTheme ? "light" : "dark");
	element.setAttribute("data-transparent", isTransparent ? "true" : "false");
}

/**
 * Synchronizes theme and transparency attributes across all active .STYLESHIFT-Main elements.
 */
export async function syncAllThemes() {
	const elements = document.querySelectorAll<HTMLElement>(".STYLESHIFT-Main");

	const isLightTheme = await getFromStorage("App_Light_Theme");
	const isTransparent = await getFromStorage("Setting_BG_Transparent");

	const theme = isLightTheme ? "light" : "dark";
	const transparent = isTransparent ? "true" : "false";

	logger.info("theme", "Syncing all themes...", { theme, transparent });

	elements.forEach((el) => {
		el.setAttribute("data-theme", theme);
		el.setAttribute("data-transparent", transparent);
	});
}
