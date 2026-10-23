import {
	cachedStorageData,
	EXTERNAL_STORAGE_KEYS,
	getRootValue,
	persistCachedDataToStorage,
	saveRootValue,
	saveToStorage,
	saveUserSetting,
} from "@core/storage/manager";
import { getStyleShiftAddOnItems } from "@extensions/youtube/addOnItems";
import { defaultSetting } from "@extensions/youtube/defaultSettings";
import { mergeBundledPresets, PRESET_THEMES, refreshBundledPresetList } from "@extensions/youtube/presets";
import { getSettingsList } from "@settings/registry/items";
import { logger } from "@shared/logger";

/**
 * Ensures add-on items are initialized for new users.
 */
export async function initializeDefaultAddOnItems(): Promise<void> {
	const currentAddOn = await getRootValue("addOnStyleShiftItems");
	if (currentAddOn == null || (Array.isArray(currentAddOn) && currentAddOn.length === 0)) {
		logger.info("maintenance", "Initializing default add-on items for new user");
		await saveRootValue("addOnStyleShiftItems", getStyleShiftAddOnItems(), true);
		await persistCachedDataToStorage();
	}
}

/**
 * Ensures all available settings have a value in storage, applying defaults where missing.
 */
export async function populateMissingDefaultSettings(): Promise<void> {
	const availableSettings = getSettingsList();
	let changed = false;

	const defaultSettingsConfig = defaultSetting.currentSettings || {};

	for (const [settingId, config] of Object.entries(availableSettings) as [string, any]) {
		if ("value" in config) {
			const isExternal = EXTERNAL_STORAGE_KEYS.includes(settingId);
			const currentValue = isExternal
				? cachedStorageData[settingId]
				: (cachedStorageData["currentSettings"] || {})[settingId];

			if (currentValue == null) {
				const isFoundInDefault = defaultSettingsConfig[settingId] !== undefined;
				const defaultValue = isFoundInDefault ? defaultSettingsConfig[settingId] : config.value;

				if (isFoundInDefault) {
					logger.info("maintenance", `Setting found in defaultSetting.ts: ${settingId}`, defaultValue);
				} else {
					logger.info(
						"maintenance",
						`Setting not found in defaultSetting.ts, using internal default for: ${settingId}`,
						defaultValue,
					);
				}

				if (isExternal) {
					cachedStorageData[settingId] = defaultValue;
				} else {
					if (!cachedStorageData["currentSettings"]) cachedStorageData["currentSettings"] = {};
					cachedStorageData["currentSettings"][settingId] = defaultValue;
				}
				changed = true;
			}
		}
	}

	if (changed) {
		await persistCachedDataToStorage();
	}
}

/**
 * Removes data from storage that is no longer associated with any active settings or core keys.
 */
export async function performStorageGarbageCollection(): Promise<void> {
	if (cachedStorageData["currentSettings"] == null) {
		cachedStorageData["currentSettings"] = {};
	}

	logger.info("maintenance", "Starting storage garbage collection");

	const activeSettingIds = Object.keys(getSettingsList());
	const userSettings = cachedStorageData["currentSettings"];

	for (const key of Object.keys(userSettings)) {
		if (!activeSettingIds.includes(key) || EXTERNAL_STORAGE_KEYS.includes(key)) {
			logger.info(
				"maintenance",
				`Removing ${EXTERNAL_STORAGE_KEYS.includes(key) ? "duplicated" : "obsolete"} setting from currentSettings:`,
				key,
			);
			delete userSettings[key];
		}
	}

	for (const key of Object.keys(cachedStorageData)) {
		if (key !== "currentSettings" && !EXTERNAL_STORAGE_KEYS.includes(key)) {
			logger.info("maintenance", "Removing obsolete root key:", key);
			delete cachedStorageData[key];
		}
	}

	await persistCachedDataToStorage();
	logger.info("maintenance", "Storage garbage collection complete");
}

/**
 * Adds the bundled presets once, so a preset the user deletes does not come back.
 */
export async function seedBundledPresets(): Promise<boolean> {
	if (await getRootValue("presetsSeeded")) return false;

	await saveRootValue("themes", mergeBundledPresets(await getRootValue("themes")), true);
	await saveRootValue("presetsSeeded", true, true);
	return true;
}

/** Writes a preset's settings into the live settings without touching the UI. */
async function applyPresetSettings(settings: Record<string, string | number | boolean>): Promise<void> {
	for (const [key, value] of Object.entries(settings)) {
		await saveUserSetting(key, value, true);
	}
}

/**
 * Refreshes the saved bundled presets after an extension update.
 * If the user still has a bundled preset applied, its new values are applied too.
 */
export async function refreshBundledPresets(): Promise<void> {
	const savedThemes = await getRootValue("themes");
	if (Array.isArray(savedThemes)) {
		await saveRootValue("themes", refreshBundledPresetList(savedThemes), true);
	}

	const activeTheme = await getRootValue("activeTheme");
	const activePreset = PRESET_THEMES.find(
		(preset) => preset.themeId === activeTheme || preset.themeName === activeTheme,
	);

	if (activePreset?.currentSettings) {
		// Still on a bundled preset, so the refreshed look replaces the saved one.
		await applyPresetSettings(activePreset.currentSettings);
		await saveRootValue("activeTheme", activePreset.themeName, true);
	} else if (!activeTheme) {
		// Never applied or tweaked a theme, so the live settings are the default look.
		await applyPresetSettings(defaultSetting.currentSettings);
		await saveRootValue("activeTheme", "", true);
	}
}

/**
 * Initializes critical storage keys if they are missing.
 */
export async function initializeRequiredStorageStructures(): Promise<void> {
	let structuralChangesMade = false;

	if ((await getRootValue("currentSettings")) == null) {
		await saveRootValue("currentSettings", { ...defaultSetting.currentSettings }, true);
		structuralChangesMade = true;
	}

	if (await seedBundledPresets()) {
		structuralChangesMade = true;
	}

	const currentSettings = (await getRootValue("currentSettings")) || {};
	const availableSettings = getSettingsList();

	for (const [id, config] of Object.entries(availableSettings) as [string, any]) {
		if (EXTERNAL_STORAGE_KEYS.includes(id)) continue;

		if (currentSettings[id] === undefined || currentSettings[id] === null) {
			logger.info("maintenance", "Initializing missing setting:", id, config.value);
			await saveToStorage(id, config.value, true);
			structuralChangesMade = true;
		}
	}

	if (structuralChangesMade) {
		await persistCachedDataToStorage();
	}
}
