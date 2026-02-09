import { create_error } from "../build-in-functions/extension";
import { sleep } from "../build-in-functions/normal";
import { current_context_domain } from "../run";
import { logger } from "../utils/logger";

export let cached_storage_data: any = {};
let is_storage_initialized = false;

export const EXTERNAL_STORAGE_KEYS = [
	"current_settings",
	"default_styleshift_items",
	"custom_styleshift_items",
	"Themes",
	"Enabled_Extension",
	"Realtime_Extension",
	"Developer_mode",
];

export const ALLOWED_DATA_KEYS = ["current_settings", "custom_styleshift_items"];

/**
 * Loads all data from Chrome local storage for the current domain context.
 */
export async function initialize_storage_connection(): Promise<void> {
	return new Promise((resolve) => {
		chrome.storage.local.get(null, (all_data) => {
			logger.info("STORAGE", "RAW_STORAGE_DUMP", all_data);
		});

		logger.info("STORAGE", "Attempting to get_root_value data for domain:", current_context_domain);

		chrome.storage.local.get(current_context_domain, (result: Record<string, any>) => {
			if (result[current_context_domain]) {
				try {
					cached_storage_data = result[current_context_domain];
					logger.info("STORAGE", "Data successfully loaded:", current_context_domain);
				} catch (_error) {
					create_error(`Failed to parse storage data for: <b>${current_context_domain}</b>`);
					cached_storage_data = {};
				}
			} else {
				cached_storage_data = {};
			}
			is_storage_initialized = true;
			resolve();
		});
	});
}

/**
 * Persists a value to the root of the storage object.
 */
export async function save_root_value(key: string, value: any, delay_persistence = false): Promise<boolean> {
	if (!is_storage_initialized) {
		await sleep(100);
		return save_root_value(key, value, delay_persistence);
	}
	cached_storage_data[key] = value;
	logger.info("STORAGE", "Updating root key:", key, value);

	if (!delay_persistence) {
		return await persist_cached_data_to_storage();
	}
	return true;
}

/**
 * Saves a setting into the 'current_settings' nested object.
 */
export async function save_user_setting(setting_id: string, value: any, delay_persistence = false): Promise<boolean> {
	if (cached_storage_data["current_settings"] == null) {
		cached_storage_data["current_settings"] = {};
	}
	cached_storage_data["current_settings"][setting_id] = value;
	logger.info("STORAGE", "Updating user setting:", setting_id, value);

	if (!delay_persistence) {
		return await persist_cached_data_to_storage();
	}
	return true;
}

/**
 * Routes a save_root_value request to either root storage or user settings based on the key.
 */
export async function save_to_storage(key: string, value: any, delay_persistence = false): Promise<boolean> {
	if (EXTERNAL_STORAGE_KEYS.includes(key)) {
		return await save_root_value(key, value, delay_persistence);
	} else {
		return await save_user_setting(key, value, delay_persistence);
	}
}

/**
 * Writes the entire cached data object to Chrome local storage.
 */
export async function persist_cached_data_to_storage(): Promise<boolean> {
	logger.info("STORAGE", "Persisting data to disk:", current_context_domain);
	await chrome.storage.local.set({ [current_context_domain]: cached_storage_data });
	return true;
}

/**
 * Retrieves a value from the root of the storage object.
 */
export async function get_root_value(key?: string): Promise<any> {
	if (!is_storage_initialized) {
		await sleep(100);
		return await get_root_value(key);
	}
	return key == null ? cached_storage_data : cached_storage_data[key];
}

/**
 * Retrieves a setting from the 'current_settings' nested object.
 */
export async function get_user_setting(setting_id: string): Promise<any> {
	if (!is_storage_initialized) {
		await sleep(100);
		return await get_user_setting(setting_id);
	}
	return cached_storage_data["current_settings"]?.[setting_id] ?? null;
}

/**
 * Attempts to retrieve a value from settings first, then from root storage.
 */
export async function get_from_storage(key: string): Promise<any> {
	const setting_value = await get_user_setting(key);
	return setting_value !== null ? setting_value : await get_root_value(key);
}

/**
 * Completely clears the extension's local storage.
 */
export async function wipe_all_extension_storage(): Promise<void> {
	await chrome.storage.local.clear();
}
