import { logger } from "../utils/logger";
import { showUserConfirmation } from "../ui/extension";
import { persistCachedDataToStorage, saveUserSetting, getRootValue } from "./storageManager";
import { updateStyleshiftItems } from "../settings/items";
import { performStorageGarbageCollection } from "./storageMaintenance";

/**
 * Resolves a stored color ID into a CSS-ready RGBA string.
 */
export async function resolveRgbaFromStorage(colorBaseId: string): Promise<string> {
	let hexValue = (await getRootValue(colorBaseId + "C")) as string;
	if (!hexValue) return "rgba(0,0,0,1)";

	hexValue = hexValue.replace("#", "");
	const hexParts = hexValue.match(/.{1,2}/g);
	if (!hexParts) return "rgba(0,0,0,1)";

	const red = parseInt(hexParts[0], 16);
	const green = parseInt(hexParts[1], 16);
	const blue = parseInt(hexParts[2], 16);
	const alpha = Number(await getRootValue(colorBaseId + "O")) / 100;

	return `rgba(${red},${green},${blue},${alpha})`;
}

/**
 * Imports preset data into the current user settings.
 */
export async function importPresetToSettings(presetData: any): Promise<void> {
	let changesDetected = false;

	const processEntry = async (key: string, value: any) => {
		let processedValue = value;
		if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
			try {
				processedValue = JSON.parse(value);
			} catch (_ignore) {}
		}

		if (key === "ADDScript" && typeof processedValue === "string" && processedValue.trim() !== "") {
			const userApproved = await showUserConfirmation(
				`⚠️*WARNING*⚠️
This preset/Theme contains JS code.
You could be compromised if you continue.

Do you want to execute the JS code?`,
			);
			await saveUserSetting(key, userApproved ? processedValue : "", true);
		} else {
			await saveUserSetting(key, processedValue, true);
		}
		changesDetected = true;
	};

	if (Object.prototype.toString.call(presetData) === "[object Object]") {
		for (const [key, value] of Object.entries(presetData)) {
			await processEntry(key, value);
		}
	} else if (Array.isArray(presetData)) {
		for (let i = 0; i < presetData.length; i += 2) {
			await processEntry(presetData[i], presetData[i + 1]);
		}
	}

	if (changesDetected) {
		await persistCachedDataToStorage();
	}
}

/**
 * Parses a string and imports it as a preset.
 */
export async function importPresetFromString(presetString: string): Promise<void> {
	try {
		const presetData = JSON.parse(presetString);
		logger.info("presets", "Importing preset from string");
		await importPresetToSettings(presetData);
	} catch (error) {
		logger.error("presets", "Failed to parse preset string:", error);
	}
}

/**
 * Exports the current user settings as a data object.
 */
export async function exportCurrentSettingsObject(): Promise<any> {
	await updateStyleshiftItems();
	await performStorageGarbageCollection();
	return await getRootValue("currentSettings");
}

/**
 * Exports the current user settings as a formatted JSON string.
 */
export async function exportCurrentSettingsAsString(): Promise<string> {
	const settingsObj = await exportCurrentSettingsObject();
	return JSON.stringify(settingsObj, null, 2);
}

/**
 * Migrates legacy data formats to the current storage schema.
 */
export async function migrateLegacyStorageData(legacyData: any): Promise<any> {
	const migratedData = { ...legacyData };

	for (const id of Object.keys(migratedData)) {
		if (migratedData[id] === "true") migratedData[id] = true;
		if (migratedData[id] === "false") migratedData[id] = false;

		// Handle legacy 'T' suffix for boolean toggles
		if (id.endsWith("T") && typeof migratedData[id] === "boolean") {
			migratedData[id.slice(0, -1)] = migratedData[id];
			delete migratedData[id];
		}
	}

	return migratedData;
}
