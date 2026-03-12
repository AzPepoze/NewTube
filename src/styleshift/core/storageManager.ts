import { createError } from "../shared/extension";
import { sleep } from "../shared/normal";
import { currentContextDomain } from "../run";
import { logger } from "../../shared/logger";

export let cachedStorageData: any = {};
let isStorageInitialized = false;
let isPersistenceSuppressed = false;

export function suppressStoragePersistence(suppress: boolean) {
	isPersistenceSuppressed = suppress;
	if (suppress) {
		logger.info("STORAGE", "Persistence suppressed (Preview Mode)");
	} else {
		logger.info("STORAGE", "Persistence restored");
	}
}

import { getOptionalExternalStorageKeys } from "../../main/main";

const INTERNAL_STORAGE_KEYS = [
	"currentSettings",
	"defaultStyleshiftItems",
	"customStyleshiftItems",
	"enableExtension",
	"enableRealtimeExtension",
	"developerMode",
];

const externalKeys = getOptionalExternalStorageKeys() || [];
export const EXTERNAL_STORAGE_KEYS = [...INTERNAL_STORAGE_KEYS, ...externalKeys];

export const ALLOWED_STORAGE_KEYS = ["currentSettings", "customStyleshiftItems"];

/**
 * Loads all data from Chrome local storage for the current domain context.
 */
export async function initializeStorageConnection(): Promise<void> {
	return new Promise((resolve) => {
		chrome.storage.local.get(null, (allData) => {
			logger.info("STORAGE", "RAW_STORAGE_DUMP", allData);
		});

		logger.info("STORAGE", "Attempting to load data for domain:", currentContextDomain);

		chrome.storage.local.get(currentContextDomain, (result: Record<string, any>) => {
			if (result[currentContextDomain]) {
				try {
					cachedStorageData = result[currentContextDomain];
					logger.info("STORAGE", "Data successfully loaded:", currentContextDomain);
				} catch (_error) {
					createError(`Failed to parse storage data for: <b>${currentContextDomain}</b>`);
					cachedStorageData = {};
				}
			} else {
				cachedStorageData = {};
			}
			isStorageInitialized = true;
			resolve();
		});
	});
}

/**
 * Persists a value to the root of the storage object.
 */
export async function saveRootValue(key: string, value: any, delayPersistence = false): Promise<boolean> {
	if (!isStorageInitialized) {
		await sleep(100);
		return saveRootValue(key, value, delayPersistence);
	}
	cachedStorageData[key] = value;
	logger.info("STORAGE", "Updating root key:", key, value);

	if (!delayPersistence) {
		return await persistCachedDataToStorage();
	}
	return true;
}

/**
 * Saves a setting into the 'currentSettings' nested object.
 */
export async function saveUserSetting(settingId: string, value: any, delayPersistence = false): Promise<boolean> {
	if (cachedStorageData["currentSettings"] == null) {
		cachedStorageData["currentSettings"] = {};
	}
	cachedStorageData["currentSettings"][settingId] = value;
	cachedStorageData["activeTheme"] = null;
	logger.info("STORAGE", "Updating user setting:", settingId, value);

	if (!delayPersistence) {
		return await persistCachedDataToStorage();
	}
	return true;
}

/**
 * Routes a saveRootValue request to either root storage or user settings based on the key.
 */
export async function saveToStorage(key: string, value: any, delayPersistence = false): Promise<boolean> {
	if (EXTERNAL_STORAGE_KEYS.includes(key)) {
		return await saveRootValue(key, value, delayPersistence);
	} else {
		return await saveUserSetting(key, value, delayPersistence);
	}
}

/**
 * Specialized function to save custom items to the root of storage.
 */
export async function saveCustomStyleshiftItems(items: any[], delayPersistence = false): Promise<boolean> {
	return await saveRootValue("customStyleshiftItems", items, delayPersistence);
}



/**
 * Writes the entire cached data object to Chrome local storage.
 */
export async function persistCachedDataToStorage(): Promise<boolean> {
	if (!isStorageInitialized || isPersistenceSuppressed) return false;
	logger.info("STORAGE", "Persisting data to disk:", currentContextDomain);
	await chrome.storage.local.set({ [currentContextDomain]: cachedStorageData });
	return true;
}

/**
 * Retrieves a value from the root of the storage object.
 */
export async function getRootValue(key?: string): Promise<any> {
	if (!isStorageInitialized) {
		await sleep(100);
		return await getRootValue(key);
	}
	return key == null ? cachedStorageData : cachedStorageData[key];
}

/**
 * Retrieves a setting from the 'currentSettings' nested object.
 */
export async function getUserSetting(settingId: string): Promise<any> {
	if (!isStorageInitialized) {
		await sleep(100);
		return await getUserSetting(settingId);
	}
	return cachedStorageData["currentSettings"]?.[settingId] ?? null;
}

/**
 * Attempts to retrieve a value from settings first, then from root storage.
 */
export async function getFromStorage(key: string): Promise<any> {
	const settingValue = await getUserSetting(key);
	return settingValue !== null ? settingValue : await getRootValue(key);
}

/**
 * Completely clears the extension's local storage.
 */
export async function wipeAllExtensionStorage(): Promise<void> {
	await chrome.storage.local.clear();
}


