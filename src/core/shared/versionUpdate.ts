import { createNotification } from "./notifications";
import { getRootValue, saveRootValue } from "@core/storage/manager";
import { refreshBundledPresets } from "@core/storage/maintenance";
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
 * Refreshes bundled presets before settings initialize, then records the version and notifies.
 */
export async function checkAndShowUpdateNotification(): Promise<void> {
	const currentVersion = STYLESHIFT_VERSION || chrome.runtime.getManifest()?.version || "";
	if (!currentVersion) return;

	const lastSeenVersion = await getRootValue("lastSeenVersion");

	if (lastSeenVersion === currentVersion) return;

	await refreshBundledPresets();
	await saveRootValue("lastSeenVersion", currentVersion);

	if (lastSeenVersion) {
		await showExtensionUpdateNotification(currentVersion);
	}
}
