import { checkAndUpdateTheme, initWebsiteIntegration } from "@core/theme/storeIntegration";
import { validateOrigin } from "@core/theme/manager";
import { enableSettingsButton } from "./features/newtubeSettingsButton";
import { initControlPanelSync } from "./features/controlPanelSync";
import { checkAndShowWelcome } from "./welcome";
import { checkAndShowUpdateNotification } from "@core/shared/versionUpdate";

/**
 * Checks if the extension logic should run on this URL.
 * Prevents injecting heavy features into the NewTube theme store itself.
 */
export function shouldEnableExtension(): boolean {
	const origin = window.location.origin;
	// Don't run extension logic on the store site
	if (validateOrigin(origin)) {
		// Still init website integration so the store communicates properly
		initWebsiteIntegration();
		return false;
	}
	return true;
}

/**
 * Main application bootstrap logic.
 * This is called by the StyleShift core after it has initialized.
 */
export async function appBootstrap() {
	enableSettingsButton();
	initControlPanelSync();
	await checkAndShowWelcome();
	await checkAndShowUpdateNotification();
	await checkAndUpdateTheme();
}

/**
 * Provides optional external storage keys to the StyleShift storage manager.
 */
export function getOptionalExternalStorageKeys(): string[] {
	return ["themes", "welcomeShown", "activeTheme", "lastSeenVersion"];
}
