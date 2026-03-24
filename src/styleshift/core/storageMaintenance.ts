import { logger } from "../../shared/logger";
import { getSettingsList } from "../settings/items";
import { getStyleshiftCustomItems } from "../../main/itemsStyleshiftCustom";
import { defaultSetting } from "../../main/defaultSetting";
import {
	persistCachedDataToStorage,
	saveToStorage,
	saveRootValue,
	getRootValue,
	cachedStorageData,
	EXTERNAL_STORAGE_KEYS,
} from "./storageManager";

/**
 * Ensures custom items are initialized for new users.
 */
export async function initializeDefaultCustomItems(): Promise<void> {
	const currentCustom = await getRootValue("customStyleShiftItems");
	if (currentCustom == null || (Array.isArray(currentCustom) && currentCustom.length === 0)) {
		logger.info("maintenance", "Initializing default custom items for new user");
		await saveRootValue("customStyleShiftItems", getStyleshiftCustomItems(), true);
		await persistCachedDataToStorage();
	}
}

/**
 * Ensures all available settings have a value in storage, applying defaults where missing.
 */
export async function populateMissingDefaultSettings(): Promise<void> {
	const availableSettings = await getSettingsList(true);
	let changed = false;

	const defaultSettingsConfig = defaultSetting.currentSettings || {};

	for (const [settingId, config] of Object.entries(availableSettings) as [string, any]) {
		if ("value" in config) {
			const isExternal = EXTERNAL_STORAGE_KEYS.includes(settingId);
			const currentValue = isExternal ? cachedStorageData[settingId] : (cachedStorageData["currentSettings"] || {})[settingId];

			if (currentValue == null) {
				const isFoundInDefault = defaultSettingsConfig[settingId] !== undefined;
				const defaultValue = isFoundInDefault ? defaultSettingsConfig[settingId] : config.value;

				if (isFoundInDefault) {
					logger.info("maintenance", `Setting found in defaultSetting.ts: ${settingId}`, defaultValue);
				} else {
					logger.info("maintenance", `Setting not found in defaultSetting.ts, using internal default for: ${settingId}`, defaultValue);
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

	const activeSettingIds = Object.keys(await getSettingsList(true));
	const userSettings = cachedStorageData["currentSettings"];

	// Remove obsolete user settings
	for (const key of Object.keys(userSettings)) {
		if (!activeSettingIds.includes(key) || EXTERNAL_STORAGE_KEYS.includes(key)) {
			logger.info("maintenance", `Removing ${EXTERNAL_STORAGE_KEYS.includes(key) ? "duplicated" : "obsolete"} setting from currentSettings:`, key);
			delete userSettings[key];
		}
	}

	// Remove obsolete root keys
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
 * Initializes critical storage keys if they are missing.
 */
export async function initializeRequiredStorageStructures(): Promise<void> {
	let structuralChangesMade = false;

	if ((await getRootValue("currentSettings")) == null) {
		await saveRootValue("currentSettings", { ...defaultSetting.currentSettings }, true);
		structuralChangesMade = true;
	}

	if ((await getRootValue("themes")) == null) {
		await saveRootValue("themes", {}, true);
		structuralChangesMade = true;
	}

	const currentSettings = (await getRootValue("currentSettings")) || {};
	const availableSettings = await getSettingsList(true);

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
