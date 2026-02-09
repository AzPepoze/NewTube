import { logger } from "../build-in-functions/logger";
import { get_settings_list } from "../settings/items";
import {
	persist_cached_data_to_storage,
	save_to_storage,
	save_root_value,
	get_root_value,
	cached_storage_data,
	EXTERNAL_STORAGE_KEYS,
} from "./storage-manager";

/**
 * Ensures all available settings have a value in storage, applying defaults where missing.
 */
export async function populate_missing_default_settings(): Promise<void> {
	const available_settings = await get_settings_list(true);
	const current_settings = cached_storage_data["current_settings"] || {};

	for (const [setting_id, config] of Object.entries(available_settings) as [string, any]) {
		if ("value" in config && current_settings[setting_id] == null) {
			current_settings[setting_id] = config.value;
			logger.info("maintenance", "Populated default for:", setting_id, config.value);
		}
	}

	cached_storage_data["current_settings"] = current_settings;
}

/**
 * Removes data from storage that is no longer associated with any active settings or core keys.
 */
export async function perform_storage_garbage_collection(): Promise<void> {
	if (cached_storage_data["current_settings"] == null) {
		cached_storage_data["current_settings"] = {};
	}

	logger.info("maintenance", "Starting storage garbage collection");

	const active_setting_ids = Object.keys(await get_settings_list(true));
	const user_settings = cached_storage_data["current_settings"];

	// Remove obsolete user settings
	for (const key of Object.keys(user_settings)) {
		if (!active_setting_ids.includes(key)) {
			logger.info("maintenance", "Removing obsolete setting:", key);
			delete user_settings[key];
		}
	}

	// Remove obsolete root keys
	for (const key of Object.keys(cached_storage_data)) {
		if (!EXTERNAL_STORAGE_KEYS.includes(key)) {
			logger.info("maintenance", "Removing obsolete root key:", key);
			delete cached_storage_data[key];
		}
	}

	await persist_cached_data_to_storage();
	logger.info("maintenance", "Storage garbage collection complete");
}

/**
 * Initializes critical storage keys if they are missing.
 */
export async function initialize_required_storage_structures(): Promise<void> {
	let structural_changes_made = false;

	if ((await get_root_value("current_settings")) == null) {
		await save_root_value("current_settings", {}, true);
		structural_changes_made = true;
	}

	if ((await get_root_value("Themes")) == null) {
		await save_root_value("Themes", {}, true);
		structural_changes_made = true;
	}

	const current_settings = (await get_root_value("current_settings")) || {};
	const available_settings = await get_settings_list(true);

	for (const [id, config] of Object.entries(available_settings) as [string, any]) {
		if (EXTERNAL_STORAGE_KEYS.includes(id)) continue;

		if (current_settings[id] === undefined || current_settings[id] === null) {
			logger.info("maintenance", "Initializing missing setting:", id, config.value);
			await save_to_storage(id, config.value, true);
			structural_changes_made = true;
		}
	}

	if (structural_changes_made) {
		await persist_cached_data_to_storage();
	}
}
