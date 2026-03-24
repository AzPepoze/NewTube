import { logger } from "../../shared/logger";
import { showUserConfirmation } from "../ui/extension";
import { persistCachedDataToStorage, saveRootValue, suppressStoragePersistence, getRootValue, saveUserSetting, saveCustomStyleshiftItems } from "./storageManager";
import { updateStyleshiftItems } from "../settings/items";
import { performStorageGarbageCollection } from "./storageMaintenance";
import { triggerSettingsUpdateBatch } from "../settings/functions";
import { createNotification, createError, downloadFile } from "../shared/extension";
import { sleep, deepClone } from "../shared/normal";
import { initializeDeveloperEnvironment, jszipInstance } from "./runtimeController";
import { styleshiftCategoryList } from "../settings/defaultItems";
import { convertToExportSetting } from "./exportConverter";

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

		if (key === "customStyleShiftItems" && Array.isArray(value)) {
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
 * Common utility for generating and downloading a ZIP file with a notification.
 */
export async function downloadZip(
	zipName: string,
	folderName: string,
	files: Record<string, string | Blob>,
) {
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

		let folder = zip;
		if (folderName && folderName.trim() !== "") {
			folder = zip.folder(folderName.replace(/\/|\n/g, "_"));
		}

		for (const [path, content] of Object.entries(files)) {
			// Handle nested folders if slashes are present in path
			folder.file(path, content);
		}

		const zipBlob = await zip.generateAsync({ type: "blob" });
		downloadFile(zipBlob, zipName);

		notification.setIcon("check_circle");
		notification.setTitle("Export Complete");
		notification.setContent(`"${zipName}" has been downloaded.`);
		setTimeout(() => notification.close(), 3000);
	} catch (error) {
		notification.close();
		logger.error("export", "ZIP Export Failed", error);
		createError(
			`Failed to generate ZIP: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Recursively adds Styleshift items (categories and settings) to a ZIP file structure.
 * Uses a manifest-based ordering system (order.json) for clean folder names.
 */
export async function addItemsToZip(
	items: any[],
	files: Record<string, string | Blob>,
	baseFolder: string = "",
) {
	const prefix = baseFolder ? (baseFolder.endsWith("/") ? baseFolder : `${baseFolder}/`) : "";
	const categoryOrder: string[] = [];

	for (const thisCategory of items) {
		const categoryName = (
			thisCategory.category?.label ||
			thisCategory.label ||
			"Untitled Category"
		).replace(/\/|\n/g, "_");
		categoryOrder.push(categoryName);

		const categoryPath = `${prefix}${categoryName}`;

		// Category config
		const categoryConfig: any = {};
		for (const [key, value] of Object.entries(styleshiftCategoryList)) {
			if (key !== "settings") {
				categoryConfig[key] = thisCategory[key] ?? value;
			}
		}

		files[`${categoryPath}/config.json`] = JSON.stringify(categoryConfig, null, 2);

		if (thisCategory.settings) {
			const settingOrder: string[] = [];
			for (const originalSetting of thisCategory.settings) {
				const settingName = (
					originalSetting.name ||
					originalSetting.id ||
					"Untitled Setting"
				).replace(/\/|\n/g, "_");
				settingOrder.push(settingName);

				const settingPath = `${categoryPath}/${settingName}`;
				const thisSetting = deepClone(originalSetting);

				// Extract JS/CSS files
				await convertToExportSetting(thisSetting, async (fileName, fileData) => {
					files[`${settingPath}/${fileName}`] = fileData;
				});

				// Setting config
				files[`${settingPath}/config.json`] = JSON.stringify(thisSetting, null, 2);
			}

			// Setting manifest
			files[`${categoryPath}/order.json`] = JSON.stringify(settingOrder, null, 2);
		}
	}

	// Category manifest
	files[`${prefix}order.json`] = JSON.stringify(categoryOrder, null, 2);
}

/**
 * Packs multiple custom Styleshift items into a ZIP file using the high-fidelity structure.
 */
export async function exportStyleshiftZip(
	styleshiftData: any[],
	zipFileName: string,
) {
	const files: Record<string, string | Blob> = {};
	await addItemsToZip(styleshiftData, files);
	await downloadZip(zipFileName, "", files);
}

