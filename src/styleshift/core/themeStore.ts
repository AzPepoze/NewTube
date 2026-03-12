import {
	saveTheme,
	installTheme,
	isThemeInstalled,
	checkAndUpdateTheme as themeManagerCheckAndUpdate,
	validateOrigin,
} from "./themeManager";
import { createNotification } from "../shared/extension";
import { logger } from "../../shared/logger";
import { sleep } from "../shared/normal";

/**
 * Initialize website integration for StyleShift theme store
 * Listens for events from the store website and delegates to themeManager
 * This runs on all authorized store domain pages
 */
export async function initWebsiteIntegration(): Promise<void> {
	// Validate origin before processing any events
	if (!validateOrigin(window.location.origin)) {
		logger.warn("themeStore", `Rejecting theme events from unauthorized origin: ${window.location.origin}`);
		return;
	}

	logger.info("themeStore", `Website integration initialized for origin: ${window.location.origin}`);

	/**
	 * Handle install theme event from website
	 * Expected detail: { themeId: string, targetDomains: string[] }
	 */
	window.addEventListener("install_styleshift_theme", async (e) => {
		const detail = (e as CustomEvent).detail;
		if (!detail?.themeId || !detail?.targetDomains) {
			logger.warn("themeStore", "install_styleshift_theme: Missing required parameters");
			return;
		}

		logger.info("themeStore", `Install event received: ${detail.themeId} to domains: ${detail.targetDomains.join(", ")}`);
		const success = await installTheme(detail.themeId, detail.themeName || detail.themeId, detail.targetDomains);

		if (success) {
			createNotification({
				icon: "✅",
				title: "Theme Installed",
				content: `${detail.themeName || "Theme"} installed to ${detail.targetDomains.length} site(s).`,
			});
		}
	});

	/**
	 * Handle save theme event from website
	 * Expected detail: { themeName: string, themeData: object, targetDomain: string }
	 */
	window.addEventListener("save_styleshift_theme", async (e) => {
		const detail = (e as CustomEvent).detail;
		if (!detail?.themeName || !detail?.themeData || !detail?.targetDomain) {
			logger.warn("themeStore", "save_styleshift_theme: Missing required parameters");
			return;
		}

		logger.info("themeStore", `Save event received: ${detail.themeName} to domain: ${detail.targetDomain}`);
		const success = await saveTheme(detail.themeName, detail.themeData, detail.targetDomain);

		if (success) {
			createNotification({
				icon: "💾",
				title: "Theme Saved",
				content: `"${detail.themeName}" saved to collection.`,
			});
		}
	});

	/**
	 * Handle check theme installation event from website
	 * Expected detail: { themeId: string, targetDomain: string }
	 * Responds with: { themeId, isInstalled }
	 */
	window.addEventListener("is_styleshift_theme_installed", async (e) => {
		const detail = (e as CustomEvent).detail;
		if (!detail?.themeId || !detail?.targetDomain) {
			logger.warn("themeStore", "is_styleshift_theme_installed: Missing required parameters");
			return;
		}

		logger.info("themeStore", `Check install event: ${detail.themeId} in domain: ${detail.targetDomain}`);
		const isInstalled = await isThemeInstalled(detail.themeId, detail.targetDomain);

		window.dispatchEvent(
			new CustomEvent("styleshift_theme_install_status", {
				detail: { themeId: detail.themeId, isInstalled },
			})
		);
	});

	/**
	 * Signal that the extension is loaded and ready to receive events
	 */
	for (let i = 0; i < 10; i++) {
		window.dispatchEvent(new CustomEvent("styleshift_is_ready"));
		await sleep(100);
	}

	logger.info("themeStore", "Website integration ready");
}

/**
 * Delegate to themeManager's checkAndUpdateTheme function
 * Maintains backward compatibility with existing code
 */
export async function checkAndUpdateTheme(manual: boolean = false, targetDomain?: string): Promise<void> {
	await themeManagerCheckAndUpdate(manual, targetDomain);
}
