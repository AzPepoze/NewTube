import { logger } from "../utils/logger";
import { show_user_confirmation } from "../ui/extension";
import { persist_cached_data_to_storage, save_user_setting, get_root_value } from "./storage-manager";
import { update_styleshift_items } from "../settings/items";
import { perform_storage_garbage_collection } from "./storage-maintenance";

/**
 * Resolves a stored color ID into a CSS-ready RGBA string.
 */
export async function resolve_rgba_from_storage(color_base_id: string): Promise<string> {
	let hex_value = (await get_root_value(color_base_id + "C")) as string;
	if (!hex_value) return "rgba(0,0,0,1)";

	hex_value = hex_value.replace("#", "");
	const hex_parts = hex_value.match(/.{1,2}/g);
	if (!hex_parts) return "rgba(0,0,0,1)";

	const red = parseInt(hex_parts[0], 16);
	const green = parseInt(hex_parts[1], 16);
	const blue = parseInt(hex_parts[2], 16);
	const alpha = Number(await get_root_value(color_base_id + "O")) / 100;

	return `rgba(${red},${green},${blue},${alpha})`;
}

/**
 * Imports preset data into the current user settings.
 */
export async function import_preset_to_settings(preset_data: any): Promise<void> {
	let changes_detected = false;

	const process_entry = async (key: string, value: any) => {
		let processed_value = value;
		if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
			try {
				processed_value = JSON.parse(value);
			} catch (_ignore) {}
		}

		if (key === "ADDScript" && typeof processed_value === "string" && processed_value.trim() !== "") {
			const user_approved = await show_user_confirmation(
				`⚠️*WARNING*⚠️
This preset/Theme contains JS code.
You could be compromised if you continue.

Do you want to get_root_value the JS code?`,
			);
			await save_user_setting(key, user_approved ? processed_value : "", true);
		} else {
			await save_user_setting(key, processed_value, true);
		}
		changes_detected = true;
	};

	if (Object.prototype.toString.call(preset_data) === "[object Object]") {
		for (const [key, value] of Object.entries(preset_data)) {
			await process_entry(key, value);
		}
	} else if (Array.isArray(preset_data)) {
		for (let i = 0; i < preset_data.length; i += 2) {
			await process_entry(preset_data[i], preset_data[i + 1]);
		}
	}

	if (changes_detected) {
		await persist_cached_data_to_storage();
	}
}

/**
 * Parses a string and imports it as a preset.
 */
export async function import_preset_from_string(preset_string: string): Promise<void> {
	try {
		const preset_data = JSON.parse(preset_string);
		logger.info("presets", "Importing preset from string");
		await import_preset_to_settings(preset_data);
	} catch (error) {
		logger.error("presets", "Failed to parse preset string:", error);
	}
}

/**
 * Exports the current user settings as a data object.
 */
export async function export_current_settings_object(): Promise<any> {
	await update_styleshift_items();
	await perform_storage_garbage_collection();
	return await get_root_value("current_settings");
}

/**
 * Exports the current user settings as a formatted JSON string.
 */
export async function export_current_settings_as_string(): Promise<string> {
	const settings_obj = await export_current_settings_object();
	return JSON.stringify(settings_obj, null, 2);
}

/**
 * Migrates legacy data formats to the current storage schema.
 */
export async function migrate_legacy_storage_data(legacy_data: any): Promise<any> {
	const migrated_data = { ...legacy_data };

	for (const id of Object.keys(migrated_data)) {
		if (migrated_data[id] === "true") migrated_data[id] = true;
		if (migrated_data[id] === "false") migrated_data[id] = false;

		// Handle legacy 'T' suffix for boolean toggles
		if (id.endsWith("T") && typeof migrated_data[id] === "boolean") {
			migrated_data[id.slice(0, -1)] = migrated_data[id];
			delete migrated_data[id];
		}
	}

	return migrated_data;
}
