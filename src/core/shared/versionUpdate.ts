import { createNotification } from "./notifications";
import { getRootValue, saveRootValue } from "@core/storage/manager";
import { STYLESHIFT_VERSION } from "@core/theme/config";

/**
 * Displays a notification informing the user that the extension was updated.
 * Uses the existing createNotification function with 128.png as the icon.
 */
export async function showExtensionUpdateNotification(version?: string): Promise<void> {
	const currentVersion = version || STYLESHIFT_VERSION || chrome.runtime.getManifest()?.version || "";
	await createNotification({
		icon: "128.png",
		title: "Extension Updated",
		content: `Updated to version v${currentVersion}`,
		timeout: 5000,
	});
}

/**
 * Checks if the extension was updated since last launch.
 * Displays update notification if a version mismatch is detected.
 */
export async function checkAndShowUpdateNotification(): Promise<void> {
	const currentVersion = STYLESHIFT_VERSION || chrome.runtime.getManifest()?.version || "";
	if (!currentVersion) return;

	const lastSeenVersion = await getRootValue("lastSeenVersion");

	if (lastSeenVersion) {
		if (lastSeenVersion !== currentVersion) {
			await showExtensionUpdateNotification(currentVersion);
			await saveRootValue("lastSeenVersion", currentVersion);
		}
	} else {
		await saveRootValue("lastSeenVersion", currentVersion);
	}
}
