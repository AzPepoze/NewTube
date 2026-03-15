import {
	saveTheme,
	installTheme,
	isThemeInstalled,
	fetchThemeFromApi,
	checkAndUpdateTheme as themeManagerCheckAndUpdate,
	validateOrigin,
} from "./themeManager";
import { createNotification } from "../shared/extension";
import { logger } from "../../shared/logger";
import { sleep } from "../shared/normal";

export async function initWebsiteIntegration(): Promise<void> {
	if (!validateOrigin(window.location.origin)) {
		logger.warn("themeStore", `Rejecting theme events from unauthorized origin: ${window.location.origin}`);
		return;
	}

	logger.info("themeStore", `Website integration initialized for origin: ${window.location.origin}`);

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
				icon: "check_circle",
				title: "Theme Installed",
				content: `${detail.themeName || "Theme"} installed to ${detail.targetDomains.length} site(s).`,
			});
		}
	});

	window.addEventListener("save_styleshift_theme", async (e) => {
		const detail = (e as CustomEvent).detail;
		if (!detail?.themeId || !detail?.targetDomain) {
			logger.warn("themeStore", "save_styleshift_theme: Missing required parameters");
			return;
		}

		logger.info("themeStore", `Save event received for theme: ${detail.themeId} to domain: ${detail.targetDomain}`);

		const themeData = await fetchThemeFromApi(detail.themeId);
		if (!themeData) {
			logger.error("themeStore", `Failed to fetch theme data for save: ${detail.themeId}`);
			return;
		}

		const success = await saveTheme(detail.themeName || themeData.themeName, themeData, detail.targetDomain);

		if (success) {
			createNotification({
				icon: "save",
				title: "Theme Saved",
				content: `"${detail.themeName || themeData.themeName}" saved to collection.`,
			});
		}
	});

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

	for (let i = 0; i < 10; i++) {
		window.dispatchEvent(new CustomEvent("styleshift_is_ready"));
		await sleep(100);
	}

	logger.info("themeStore", "Website integration ready");
}

export async function checkAndUpdateTheme(manual: boolean = false, targetDomain?: string): Promise<void> {
	await themeManagerCheckAndUpdate(manual, targetDomain);
}
