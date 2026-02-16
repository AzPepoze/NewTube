import { logger } from "../../shared/logger";
import { getSettingsList } from "../settings/items";
import { getStyleshiftCustomItems } from "../../main/itemsStyleshiftCustom";
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
	const currentCustom = await getRootValue("customStyleshiftItems");
	if (currentCustom == null || (Array.isArray(currentCustom) && currentCustom.length === 0)) {
		logger.info("maintenance", "Initializing default custom items for new user");
		await saveRootValue("customStyleshiftItems", getStyleshiftCustomItems(), true);
		await persistCachedDataToStorage();
	}
}

/**
 * Ensures all available settings have a value in storage, applying defaults where missing.
 */
export async function populateMissingDefaultSettings(): Promise<void> {
	const availableSettings = await getSettingsList(true);
	let changed = false;

	for (const [settingId, config] of Object.entries(availableSettings) as [string, any]) {
		if ("value" in config) {
			const isExternal = EXTERNAL_STORAGE_KEYS.includes(settingId);
			const currentValue = isExternal ? cachedStorageData[settingId] : (cachedStorageData["currentSettings"] || {})[settingId];

			if (currentValue == null) {
				if (isExternal) {
					cachedStorageData[settingId] = config.value;
					logger.info("maintenance", "Populated default root key for:", settingId, config.value);
				} else {
					if (!cachedStorageData["currentSettings"]) cachedStorageData["currentSettings"] = {};
					cachedStorageData["currentSettings"][settingId] = config.value;
					logger.info("maintenance", "Populated default user setting for:", settingId, config.value);
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
		await saveRootValue("currentSettings", {}, true);
		structuralChangesMade = true;
	}

	if ((await getRootValue("Themes")) == null) {
		await saveRootValue("Themes", {}, true);
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
