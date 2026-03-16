import { createStyleshiftWindow } from "../extension";
import { settingsUi } from "../settings/settingComponents";
import ThemeManager from "./ThemeManager.svelte";

/**
 * Opens the modern Theme Collection window.
 */
export async function showThemeManager() {
	const themeWindow = await createStyleshiftWindow({
		title: "Theme Manager",
		width: "80%",
		height: "85%",
		center: true,
	});

	// Style adjustments for the container to work better with grid
	themeWindow.contentElement.style.padding = "20px";
	themeWindow.contentElement.style.overflowY = "auto";

	settingsUi.renderComponent(ThemeManager, {
		closeWindow: themeWindow.closeWindowHandler
	}, themeWindow.contentElement);
}