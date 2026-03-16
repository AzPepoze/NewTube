import { getRootValue, saveRootValue } from "./storageManager";
import { importPresetToSettings } from "./settingsImporter";
import { showUserConfirmation } from "../ui/extension";
import { logger } from "../../shared/logger";
import { STORE_TARGET_SITES } from "../../main/constants";
import { STYLESHIFT_STORE_ORIGINS, STYLESHIFT_STORE_API_URL } from "./themeConfig";
import { copyToClipboard, createNotification, createError } from "../shared/extension";
import { downloadFile } from "../shared/normal";
import { initializeDeveloperEnvironment, jszipInstance } from "./runtimeController";

export type Theme = {
	themeId: string;
	themeName: string;
	currentSettings?: { [key: string]: string };
	customStyleshiftItems?: any[];
};

/**
 * Broadcast theme update to all tabs via chrome.runtime.sendMessage
 */
export function broadcastThemeUpdate(): void {
	try {
		chrome.runtime.sendMessage({ Command: "broadcastThemeUpdate" });
		logger.info("themeManager", "Theme update broadcast sent");
	} catch (error) {
		logger.warn("themeManager", "Failed to broadcast theme update", error);
	}
}

/**
 * Validate if origin is allowed to send theme events
 */
export function validateOrigin(origin: string): boolean {
	const isAllowed = STYLESHIFT_STORE_ORIGINS.includes(origin);
	if (!isAllowed) {
		logger.warn("themeManager", `Unauthorized origin attempted theme operation: ${origin}`);
	}
	return isAllowed;
}

/**
 * Validate if domain is in target sites whitelist
 * Special case: "EXTENSION" is allowed for extension-internal operations
 */
export function validateDomain(domain: string): boolean {
	// Allow "EXTENSION" as a special marker for extension-internal operations
	if (domain === "EXTENSION") {
		return true;
	}

	const isValid = STORE_TARGET_SITES.includes(domain);
	if (!isValid) {
		logger.warn("themeManager", `Invalid target domain: ${domain}`);
	}
	return isValid;
}

/**
 * Validate array of domains
 */
export function validateDomains(domains: string[]): boolean {
	if (!Array.isArray(domains) || domains.length === 0) {
		logger.warn("themeManager", "Invalid domains: must be non-empty array");
		return false;
	}
	return domains.every(domain => validateDomain(domain));
}

/**
 * Apply a theme to a specific domain's storage.
 * Used for cross-domain theme distribution.
 */
export async function applyThemeToDomainStorage(
	domain: string,
	themeId: string,
	themeName: string,
	themeData: any
): Promise<void> {
	const result = await chrome.storage.local.get(domain);
	const domainStorage = (result[domain] || {}) as Record<string, any>;

	// Update theme registry (Array based)
	const themes = (domainStorage.themes || []) as Theme[];
	const existingIndex = themes.findIndex(t => t.themeId === themeId);

	const updatedTheme: Theme = {
		themeId,
		themeName,
		currentSettings: themeData.currentSettings,
		customStyleshiftItems: themeData.customStyleshiftItems,
	};

	if (existingIndex > -1) {
		themes[existingIndex] = updatedTheme;
	} else {
		themes.push(updatedTheme);
	}
	domainStorage.themes = themes;

	// Set as active theme
	domainStorage.activeTheme = themeId;

	// Merge theme settings
	if (themeData.currentSettings) {
		domainStorage.currentSettings = {
			...(domainStorage.currentSettings || {}),
			...themeData.currentSettings,
		};
	}

	// Store custom items
	if (themeData.customStyleshiftItems) {
		domainStorage.customStyleshiftItems = themeData.customStyleshiftItems;
	}

	await chrome.storage.local.set({ [domain]: domainStorage });
	logger.info("themeManager", `Theme applied to domain: ${domain}`);
}

/**
 * Delete a theme from the global theme registry.
 * Used when removing a saved theme.
 */
export async function deleteThemeFromStorage(themeId: string): Promise<void> {
	const themes = (await getRootValue("themes")) || [];
	if (!Array.isArray(themes)) {
		logger.warn("themeManager", "themes storage is not an array, resetting");
		await saveRootValue("themes", [], true);
		return;
	}

	const updatedThemes = themes.filter((t: Theme) => t.themeId !== themeId);
	await saveRootValue("themes", updatedThemes, true);
	logger.info("themeManager", `Theme removed from registry: ${themeId}`);
}

/**
 * Fetch theme data from the StyleShift Store API
 * No confirmation needed - read-only operation
 */
export async function fetchThemeFromApi(themeId: string): Promise<Theme | null> {
	try {
		const res = await fetch(`${STYLESHIFT_STORE_API_URL}/themes/${themeId}`);
		if (!res.ok) return null;

		const data = await res.json();
		if (!data?.settings) return null;

		const theme: Theme = {
			themeId: data.id || themeId,
			themeName: data.name,
			currentSettings: data.settings,
			customStyleshiftItems: data.customStyleshiftItems,
		};

		return theme;
	} catch (error) {
		logger.error("themeManager", `Failed to fetch theme ${themeId}`, error);
		return null;
	}
}

/**
 * Save a theme with user confirmation
 * Prompts: "Save as '{name}' to '{targetDomain}'?"
 */
export async function saveTheme(name: string, data: Theme, targetDomain: string): Promise<boolean> {
	if (!validateDomain(targetDomain)) {
		return false;
	}

	const confirmed = await showUserConfirmation(
		`Save as "${name}" to ${targetDomain}?`,
		"Save Theme"
	);

	if (!confirmed) {
		logger.info("themeManager", `Theme save cancelled: ${name}`);
		return false;
	}

	try {
		const themes = (await getRootValue("themes")) || [];
		if (!Array.isArray(themes)) {
			logger.warn("themeManager", "themes storage is not an array, fixing");
		}

		const themeArray = Array.isArray(themes) ? themes : [];
		const themeId = data.themeId || `local-${Date.now()}`;
		const existingIndex = themeArray.findIndex((t: Theme) => t.themeId === themeId);

		const updatedTheme: Theme = {
			themeId,
			themeName: name,
			currentSettings: data.currentSettings,
			customStyleshiftItems: data.customStyleshiftItems,
		};

		if (existingIndex > -1) {
			themeArray[existingIndex] = updatedTheme;
		} else {
			themeArray.push(updatedTheme);
		}

		await saveRootValue("themes", themeArray, true);

		// Set as active if no theme selected yet
		const activeThemeId = await getRootValue("activeTheme");
		if (!activeThemeId || activeThemeId === "Previous Settings") {
			await saveRootValue("activeTheme", themeId);
		}

		logger.info("themeManager", `Theme saved: ${name}`);
		broadcastThemeUpdate();
		return true;
	} catch (error) {
		logger.error("themeManager", "Failed to save theme", error);
		return false;
	}
}

/**
 * Apply a theme to a domain with user confirmation
 * Prompts: "Apply '{name}' to '{targetDomain}'?"
 */
export async function applyTheme(id: string, name: string, targetDomain: string): Promise<boolean> {
	if (!validateDomain(targetDomain)) {
		return false;
	}

	const confirmed = await showUserConfirmation(
		`Apply "${name}" to ${targetDomain}?`,
		"Apply Theme"
	);

	if (!confirmed) {
		logger.info("themeManager", `Theme apply cancelled: ${name}`);
		return false;
	}

	try {
		const themes = (await getRootValue("themes")) || [];
		const themeData = Array.isArray(themes) ? themes.find((t: Theme) => t.themeId === id) : null;

		if (!themeData) {
			logger.warn("themeManager", `Theme not found: ${id}`);
			return false;
		}

		await importPresetToSettings(themeData, true, name);

		logger.info("themeManager", `Theme applied: ${name}`);
		broadcastThemeUpdate();
		return true;
	} catch (error) {
		logger.error("themeManager", "Failed to apply theme", error);
		return false;
	}
}

/**
 * Update a theme to latest version with confirmation
 * Prompts: "Update '{name}' to latest version?"
 */
export async function updateTheme(
	id: string,
	name: string,
	latestData: Theme,
	targetDomain: string
): Promise<boolean> {
	if (!validateDomain(targetDomain)) {
		return false;
	}

	const confirmed = await showUserConfirmation(
		`Update "${name}" to the latest version?`,
		"Update Theme"
	);

	if (!confirmed) {
		logger.info("themeManager", `Theme update cancelled: ${name}`);
		return false;
	}

	try {
		latestData.themeId = id;
		latestData.themeName = name;

		await importPresetToSettings(latestData, true, name);

		const themes = (await getRootValue("themes")) || [];
		if (Array.isArray(themes)) {
			const index = themes.findIndex((t: Theme) => t.themeId === id);
			if (index > -1) {
				themes[index] = latestData;
				await saveRootValue("themes", themes, true);
			}
		}

		logger.info("themeManager", `Theme updated: ${name}`);
		broadcastThemeUpdate();
		return true;
	} catch (error) {
		logger.error("themeManager", "Failed to update theme", error);
		return false;
	}
}

/**
 * Install a theme to multiple domains with confirmation
 * Prompts: "Install '{name}' to {domain list}?"
 */
export async function installTheme(
	id: string,
	name: string,
	targetDomains: string[]
): Promise<boolean> {
	if (!validateDomains(targetDomains)) {
		return false;
	}

	const domainList = targetDomains.join(", ");
	const confirmed = await showUserConfirmation(
		`Install "${name}" to ${domainList}?`,
		"Install Theme"
	);

	if (!confirmed) {
		logger.info("themeManager", `Theme install cancelled: ${name}`);
		return false;
	}

	try {
		const themeData = await fetchThemeFromApi(id);
		if (!themeData) {
			logger.error("themeManager", `Failed to fetch theme for install: ${id}`);
			return false;
		}

		// Apply to all target domains
		await Promise.all(
			targetDomains.map(domain => applyThemeToDomainStorage(domain, id, name, themeData))
		);

		logger.info("themeManager", `Theme installed to ${targetDomains.length} domain(s): ${name}`);
		broadcastThemeUpdate();
		return true;
	} catch (error) {
		logger.error("themeManager", "Failed to install theme", error);
		return false;
	}
}

/**
 * Delete a theme with confirmation
 * Prompts: "Delete '{name}' from '{targetDomain}'?"
 */
export async function deleteTheme(id: string, name: string, targetDomain: string): Promise<boolean> {
	if (!validateDomain(targetDomain)) {
		return false;
	}

	const confirmed = await showUserConfirmation(
		`Delete "${name}" from ${targetDomain}?`,
		"Delete Theme"
	);

	if (!confirmed) {
		logger.info("themeManager", `Theme delete cancelled: ${name}`);
		return false;
	}

	try {
		await deleteThemeFromStorage(id);

		logger.info("themeManager", `Theme deleted: ${name}`);
		broadcastThemeUpdate();
		return true;
	} catch (error) {
		logger.error("themeManager", "Failed to delete theme", error);
		return false;
	}
}

/**
 * Check if a theme is installed in a specific domain
 * No confirmation needed - read-only operation
 */
export async function isThemeInstalled(id: string, targetDomain: string): Promise<boolean> {
	if (!validateDomain(targetDomain)) {
		return false;
	}

	try {
		const result = await chrome.storage.local.get(targetDomain);
		const domainStorage = (result[targetDomain] || {}) as Record<string, any>;
		const themes = domainStorage.themes || [];
		if (Array.isArray(themes)) {
			return themes.some((t: Theme) => t.themeId === id);
		}
		return false;
	} catch (error) {
		logger.warn("themeManager", `Failed to check theme installation: ${id}`, error);
		return false;
	}
}

/**
 * Get active theme data for a target domain
 * Note: Active theme is global, not per-domain, but kept for API consistency
 */
async function getActivethemeData(_targetDomain: string) {
	const activeThemeId = await getRootValue("activeTheme");
	if (!activeThemeId || activeThemeId === "Previous Settings") {
		return null;
	}

	const themes = (await getRootValue("themes")) || [];
	if (!Array.isArray(themes)) return null;

	const themeData = themes.find((t: Theme) => t.themeId === activeThemeId);

	if (!themeData) {
		return null;
	}

	return {
		data: themeData,
		id: themeData.themeId,
		name: themeData.themeName || activeThemeId,
	};
}

/**
 * Check for theme updates with optional manual prompt
 * Delegates to updateTheme which handles confirmation
 */
export async function checkAndUpdateTheme(manual: boolean = false, targetDomain: string): Promise<void> {
	const autoUpdate = await getRootValue("AutoUpdateTheme");
	if (!manual && !autoUpdate) return;

	const theme = await getActivethemeData(targetDomain);
	if (!theme) {
		if (manual) {
			logger.info("themeManager", "No custom theme active for update check");
		}
		return;
	}

	try {
		const latestThemeData = await fetchThemeFromApi(theme.id);
		if (!latestThemeData) {
			if (manual) {
				logger.warn("themeManager", "Could not reach update server");
			}
			return;
		}

		await updateTheme(theme.id, theme.name, latestThemeData, targetDomain);
	} catch (error) {
		logger.error("themeManager", "Failed to check for theme updates", error);
	}
}


/**
 * Copies a single theme's data to the clipboard as a JSON string.
 */
export function exportThemeToClipboard(name: string, themeData: any) {
	const jsonText = JSON.stringify(themeData, null, 2);
	copyToClipboard(jsonText);

	createNotification({
		icon: "content_copy",
		title: "Theme Exported",
		content: `"${name}" copied to clipboard.`,
	});
}

/**
 * Downloads a single theme as a ZIP file.
 */
export async function exportThemeAsZip(name: string, themeData: any) {
	const notification = await createNotification({
		icon: "inventory_2",
		title: "Preparing Export",
		content: "Initializing ZIP generation...",
		timeout: -1,
	});

	try {
		await initializeDeveloperEnvironment();

		if (!jszipInstance) {
			throw new Error("JSZip failed to load.");
		}

		const zip = new (jszipInstance as any)();
		const rootFolder = zip.folder(name.replace(/\/|\n/g, "_"));

		const configJson = JSON.stringify(themeData, null, 2);
		rootFolder.file("ThemeConfig.json", configJson);

		for (const [key, value] of Object.entries(themeData)) {
			if (typeof value === "string" && (key.endsWith("Css") || key.endsWith("Function") || key.endsWith("Script"))) {
				rootFolder.file(`${key}.js`, value);
			}
		}

		const zipBlob = await zip.generateAsync({ type: "blob" });
		downloadFile(zipBlob, `${name}.zip`);

		notification.setIcon("check_circle");
		notification.setTitle("Theme Exported");
		notification.setContent(`"${name}.zip" has been downloaded.`);
		setTimeout(() => notification.close(), 3000);

	} catch (error) {
		notification.close();
		logger.error("export", "ZIP Export Failed", error);
		createError(`Failed to export theme as ZIP: ${error instanceof Error ? error.message : String(error)}`);
	}
}



