import { get_from_storage } from "@/styleshift/core/storage-manager";
import { logger } from "@functions/logger";

/**
 * Applies the current theme and transparency settings to a specific element.
 * @param element The HTMLElement to apply attributes to.
 */
export async function apply_theme_to_element(element: HTMLElement) {
	const is_light_theme = await get_from_storage("App_Light_Theme");
	const is_transparent = await get_from_storage("Setting_BG_Transparent");

	element.setAttribute("data-theme", is_light_theme ? "light" : "dark");
	element.setAttribute("data-transparent", is_transparent ? "true" : "false");
}

/**
 * Synchronizes theme and transparency attributes across all active .STYLESHIFT-Main elements.
 */
export async function sync_all_themes() {
	const elements = document.querySelectorAll<HTMLElement>(".STYLESHIFT-Main");

	const is_light_theme = await get_from_storage("App_Light_Theme");
	const is_transparent = await get_from_storage("Setting_BG_Transparent");

	const theme = is_light_theme ? "light" : "dark";
	const transparent = is_transparent ? "true" : "false";

	logger.info("theme", "Syncing all themes...", { theme, transparent });

	elements.forEach((el) => {
		el.setAttribute("data-theme", theme);
		el.setAttribute("data-transparent", transparent);
	});
}
