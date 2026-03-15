import { logger } from "../../shared/logger";
import { showUserConfirmation } from "../ui/extension";
import { persistCachedDataToStorage, saveRootValue, suppressStoragePersistence, getRootValue, saveUserSetting, saveCustomStyleshiftItems } from "./storageManager";
import { updateStyleshiftItems } from "../settings/items";
import { performStorageGarbageCollection } from "./storageMaintenance";
import { triggerSettingsUpdateBatch } from "../settings/functions";
import { createNotification } from "../shared/extension";
import { sleep } from "../shared/normal";

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
 * Validates an array of custom Styleshift items for potential JavaScript code.
 */
export async function validateCustomItemsForJs(items: any[]): Promise<boolean> {
	let hasJs = false;
	for (const item of items) {
		const jsProperties = ["clickFunction", "setupFunction", "updateFunction", "enableFunction", "disableFunction", "constantCss", "uiFunction"];
		for (const prop of jsProperties) {
			if (item[prop] && (typeof item[prop] === "function" || (typeof item[prop] === "string" && item[prop].trim() !== ""))) {
				hasJs = true;
				break;
			}
		}
		if (hasJs) break;
	}

	if (hasJs) {
		return await showUserConfirmation(
			`⚠️*WARNING*⚠️
These custom items contain JS code.
You could be compromised if you continue.

Do you want to install these items?`,
		);
	}
	return true;
}

/**
 * Imports preset data into the current user settings.
 */
/**
 * Imports preset data into the current user settings.
 */
export async function importPresetToSettings(presetData: any, persist = true, themeName: string | null = null): Promise<void> {
	if (!persist) suppressStoragePersistence(true);
	let loaderUi: any = null;

	if (themeName) {
		const isReverting =
			themeName.toLowerCase().includes("setting") || themeName.toLowerCase().includes("previous");
		loaderUi = await createNotification({
			icon: "palette",
			title: isReverting ? `Restoring: ${themeName}` : `Applying Theme: ${themeName}`,
			content: "Preparing settings...",
			timeout: -1,
		});
	}

	let changesDetected = false;
	const changedKeys: string[] = [];

	const processEntry = async (key: string, value: any) => {
		if (key === "currentSettings" && typeof value === "object") {
			for (const [subKey, subValue] of Object.entries(value)) {
				await saveUserSetting(subKey, subValue, true);
				changedKeys.push(subKey);
			}
			changesDetected = true;
			return;
		}

		if (key === "customStyleshiftItems" && Array.isArray(value)) {
			const approved = await validateCustomItemsForJs(value);
			if (approved) {
				await saveCustomStyleshiftItems(value, true);
				changedKeys.push(key);
				changesDetected = true;
			}
			return;
		}

		let processedValue = value;
		if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
			try {
				processedValue = JSON.parse(value);
			} catch (_ignore) { }
		}

		await saveUserSetting(key, processedValue, true);

		changedKeys.push(key);
		changesDetected = true;
	};


	if (loaderUi) loaderUi.setContent("Parsing theme data...");

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
		if (themeName !== undefined) {
			await saveRootValue("activeTheme", themeName, !persist);
		}

		if (loaderUi) loaderUi.setContent("Applying visual changes...");

		if (persist) {
			await persistCachedDataToStorage();
		}
		await triggerSettingsUpdateBatch(changedKeys);

		if (loaderUi) {
			loaderUi.setIcon("check_circle");
			loaderUi.setContent("Theme applied successfully!");
			await sleep(1500);
			loaderUi.close();
		}
	} else if (loaderUi) {
		loaderUi.close();
	}

	if (!persist) suppressStoragePersistence(false);
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
export async function exportCurrentSettingsObject(includeMaintenance = true): Promise<any> {
	await updateStyleshiftItems();
	if (includeMaintenance) {
		await performStorageGarbageCollection();
	}
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
