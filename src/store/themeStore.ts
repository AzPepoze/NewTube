import { getRootValue, saveRootValue } from "../styleshift/core/storageManager";
import { importPresetToSettings } from "../styleshift/core/presetManager";
import { createNotification } from "../styleshift/shared/extension";
import { logger } from "../shared/logger";
import { NEWTUBE_STORE_ORIGINS, NEWTUBE_STORE_API_URL, STORE_TARGET_SITES } from "../main/constants";
import { sleep } from "@/styleshift/shared/normal";
import { Setting } from "@/styleshift/types/store";

type Theme = {
	ThemeId: string;
	ThemeName: string;
	currentSettings: { [key: string]: string };
	customStyleshiftItems: Setting[];
}


async function fetchThemeFromApi(themeId: string): Promise<Theme | null> {
	try {
		const res = await fetch(`${NEWTUBE_STORE_API_URL}/themes/${themeId}`);
		if (!res.ok) return null;
		const data = await res.json();
		if (data && data.settings) {
			const themeData = data.settings;
			themeData.ThemeId = data.id || themeId;
			themeData.ThemeName = data.name;
			return themeData;
		}
		return null;
	} catch (error) {
		logger.error("themeStore", `Failed to fetch theme ${themeId} from API`, error);
		return null;
	}
}

export async function installTheme(themeData: Theme) {
	try {
		if (!themeData) throw new Error("Could not retrieve valid theme data from API.");
		const themeName = themeData.ThemeName;

		await importPresetToSettings(themeData, true, themeName);

		chrome.runtime.sendMessage({
			Command: "broadcastThemeUpdate"
		});

		createNotification({
			icon: "✅",
			title: "Theme Installed",
			content: `Successfully applied: ${themeName || themeData.ThemeName}`
		});
	} catch (error) {
		logger.error("themeStore", "Failed to install theme", error);
		createNotification({
			icon: "❌",
			title: "Theme Install Failed",
			content: `Could not apply ${themeData}`
		});
	}
}

export async function saveTheme(themeData: Theme) {
	try {
		if (!themeData) throw new Error("Could not retrieve valid theme data from API.");
		const themeId = themeData.ThemeId;
		const themeName = themeData.ThemeName;

		const themes = (await getRootValue("themes")) || {};
		themes[themeId] = {
			name: themeName,
			settings: themeData
		};

		await saveRootValue("themes", themes, true);

		const active = await getRootValue("activeTheme");
		if (!active || active === "Previous Settings") {
			await saveRootValue("activeTheme", themeId);
		}

		createNotification({
			icon: "💾",
			title: "Theme Saved",
			content: `"${themeName}" added to collection.`
		});
	} catch (error) {
		logger.error("themeStore", "Failed to save theme", error);
		createNotification({
			icon: "❌",
			title: "Save Failed",
			content: `Could not save ${themeData}`
		});
	}
}

export async function checkAndUpdateTheme(manual: boolean = false) {
	const autoUpdate = await getRootValue("AutoUpdateTheme");
	if (!manual && !autoUpdate) return;

	const activeThemeName = await getRootValue("activeTheme");
	if (!activeThemeName || activeThemeName === "Previous Settings") {
		if (manual) {
			createNotification({ icon: "ℹ️", title: "Update Check", content: "No custom theme active." });
		}
		return;
	}

	const themes = (await getRootValue("themes")) || {};

	let activeThemeData;
	let themeId;
	let displayThemeName = activeThemeName;

	if (themes[activeThemeName]) {
		const record = themes[activeThemeName];
		if (record.settings) {
			activeThemeData = record.settings;
			themeId = activeThemeName;
			displayThemeName = record.name || activeThemeName;
		} else {
			activeThemeData = record;
			themeId = activeThemeData.ThemeId;
			displayThemeName = activeThemeName;
		}
	} else {
		activeThemeData = await getRootValue("currentSettings");
		themeId = activeThemeData?.ThemeId;
	}

	if (!themeId) {
		if (manual) {
			createNotification({ icon: "ℹ️", title: "Update Check", content: "Current theme is not linked to the store." });
		}
		return;
	}

	try {
		if (manual) {
			createNotification({ icon: "🔄", title: "Checking for updates...", timeout: 2000 });
		}

		const latestThemeData = await fetchThemeFromApi(themeId);
		if (!latestThemeData) {
			if (manual) {
				createNotification({ icon: "❌", title: "Update Failed", content: "Could not reach the update server." });
			}
			return;
		}

		if (latestThemeData) {
			latestThemeData.ThemeId = themeId;
			await importPresetToSettings(latestThemeData, true, displayThemeName);
			if (themes[themeId]) {
				themes[themeId].settings = latestThemeData;
				await saveRootValue("themes", themes, true);
			} else if (themes[displayThemeName]) {
				themes[displayThemeName] = latestThemeData;
				await saveRootValue("themes", themes, true);
			}

			chrome.runtime.sendMessage({
				Command: "broadcastThemeUpdate"
			});

			logger.info("themeStore", `Successfully updated theme: ${displayThemeName}`);

			createNotification({
				icon: "✨",
				title: "Theme Updated",
				content: `Theme "${displayThemeName}" has updated.`
			});
		}

	} catch (error) {
		logger.warn("themeStore", "Failed to update theme", error);
		if (manual) {
			createNotification({ icon: "❌", title: "Update Failed", content: "An error occurred while checking for updates." });
		}
	}
}

async function saveThemeToDomain(domain: string, themeData: Theme) {
	const result = await chrome.storage.local.get(domain);
	const domainStorage = result[domain] || {};
	const themes = domainStorage["themes"] || {};
	themes[themeData.ThemeId] = {
		name: themeData.ThemeName,
		settings: themeData
	};
	domainStorage["themes"] = themes;
	if (!domainStorage["activeTheme"] || domainStorage["activeTheme"] === "Previous Settings") {
		domainStorage["activeTheme"] = themeData.ThemeId;
	}
	await chrome.storage.local.set({ [domain]: domainStorage });
}

async function isThemeInstalledInDomain(domain: string, themeId: string): Promise<boolean> {
	const result = await chrome.storage.local.get(domain);
	const domainStorage = result[domain] || {};
	const themes = domainStorage["themes"] || {};
	return !!themes[themeId];
}

export async function initWebsiteIntegration() {
	const origin = window.location.origin;
	if (NEWTUBE_STORE_ORIGINS.includes(origin)) {
		window.addEventListener("install_newtube_theme", async (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail && detail.themeId) {
				const themeData = await fetchThemeFromApi(detail.themeId);
				if (themeData) {
					for (const domain of STORE_TARGET_SITES) {
						await saveThemeToDomain(domain, themeData);
					}
					createNotification({
						icon: "✅",
						title: "Theme Installed",
						content: `Successfully saved: ${themeData.ThemeName}`
					});
				}
			}
		});

		window.addEventListener("save_newtube_theme", async (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail && detail.themeId) {
				const themeData = await fetchThemeFromApi(detail.themeId);
				if (themeData) {
					for (const domain of STORE_TARGET_SITES) {
						await saveThemeToDomain(domain, themeData);
					}
					createNotification({
						icon: "💾",
						title: "Theme Saved",
						content: `"${themeData.ThemeName}" added to collection.`
					});
				}
			}
		});

		window.addEventListener("is_theme_installed", async (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail && detail.themeId) {
				let isInstalled = false;
				for (const domain of STORE_TARGET_SITES) {
					if (await isThemeInstalledInDomain(domain, detail.themeId)) {
						isInstalled = true;
						break;
					}
				}

				window.dispatchEvent(new CustomEvent("installed_theme", {
					detail: {
						themeId: detail.themeId,
						isInstalled: isInstalled
					}
				}));
			}
		});

		for (let i = 0; i < 10; i++) {
			window.dispatchEvent(new CustomEvent("newtube_is_here"));
			await sleep(100);
		}
	}
}

