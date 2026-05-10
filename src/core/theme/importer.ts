import { deepClone, sleep } from "@/core/shared/utilities";
import { loadJSZip, jszipInstance } from "@core/runtime/controller";
import { downloadFile } from "@core/shared/extensionHelpers";
import { createError, createNotification } from "@core/shared/notifications";
import { performStorageGarbageCollection } from "@core/storage/maintenance";
import {
	getRootValue,
	persistCachedDataToStorage,
	saveAddOnStyleShiftItems,
	saveRootValue,
	saveUserSetting,
	suppressStoragePersistence,
} from "@core/storage/manager";
import { triggerSettingsUpdateBatch } from "@settings/engine/functions";
import { styleshiftCategoryList } from "@settings/registry/defaultItems";
import { updateStyleShiftItems } from "@settings/registry/items";
import { logger } from "@shared/logger";
import { showUserConfirmation } from "@ui/window/windowFactory";

import { convertToExportSetting } from "./exportConverter";

export async function resolveRgbaFromStorage(colorId: string): Promise<string> {
	const hex = (await getRootValue(colorId + "C"))?.replace("#", "");
	if (!hex || hex.length !== 6) return "rgba(0,0,0,1)";

	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);
	const a = Number(await getRootValue(colorId + "O")) / 100;

	return `rgba(${r},${g},${b},${a})`;
}

export async function validateAddOnItemsForJs(items: any[]): Promise<boolean> {
	const JS_PROPS = [
		"clickFunction",
		"setupFunction",
		"updateFunction",
		"enableFunction",
		"disableFunction",
		"constantCss",
		"uiFunction",
	];
	const hasJs = items.some((item) =>
		JS_PROPS.some((prop) => item[prop] && (typeof item[prop] === "function" || item[prop].trim() !== "")),
	);

	if (hasJs) {
		return await showUserConfirmation(
			"⚠️WARNING⚠️\nThese add-on items contain JS code.\nYou could be compromised if you continue.\n\nDo you want to install these items?",
		);
	}
	return true;
}

export async function importPresetToSettings(
	presetData: any,
	persist = true,
	themeName: string | null = null,
): Promise<void> {
	if (!persist) suppressStoragePersistence(true);
	let loaderUi: any = null;

	if (themeName) {
		const isReverting = /setting|previous/i.test(themeName);
		loaderUi = await createNotification({
			icon: "palette",
			title: isReverting ? `Restoring: ${themeName}` : `Applying Theme: ${themeName}`,
			content: "Preparing settings...",
			timeout: -1,
		});
	}

	const changedKeys: string[] = [];
	const entries = Array.isArray(presetData)
		? presetData.reduce((acc, val, i, arr) => (i % 2 === 0 ? [...acc, [val, arr[i + 1]]] : acc), [])
		: Object.entries(presetData);

	if (loaderUi) loaderUi.setContent("Parsing theme data...");

	for (const [key, value] of entries) {
		if (key === "currentSettings" && typeof value === "object") {
			for (const [subKey, subValue] of Object.entries(value as object)) {
				await saveUserSetting(subKey, subValue, true);
				changedKeys.push(subKey);
			}
		} else if (key === "addOnStyleShiftItems" && Array.isArray(value)) {
			if (await validateAddOnItemsForJs(value)) {
				await saveAddOnStyleShiftItems(value, true);
				changedKeys.push(key);
			}
		} else {
			let processedValue = value;
			if (typeof value === "string" && /^[{\[]/.test(value)) {
				try {
					processedValue = JSON.parse(value);
				} catch {}
			}
			await saveUserSetting(key, processedValue, true);
			changedKeys.push(key);
		}
	}

	if (changedKeys.length > 0) {
		if (themeName) await saveRootValue("activeTheme", themeName, !persist);
		if (loaderUi) loaderUi.setContent("Applying visual changes...");
		if (persist) await persistCachedDataToStorage();
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

export async function importPresetFromString(presetString: string): Promise<void> {
	try {
		const presetData = JSON.parse(presetString);
		logger.info("presets", "Importing preset from string");
		await importPresetToSettings(presetData);
	} catch (error) {
		logger.error("presets", "Failed to parse preset string:", error);
	}
}

export async function exportCurrentSettingsObject(includeMaintenance = true): Promise<any> {
	await updateStyleShiftItems();
	if (includeMaintenance) {
		await performStorageGarbageCollection();
	}
	return await getRootValue("currentSettings");
}

export async function exportCurrentSettingsAsString(): Promise<string> {
	const settingsObj = await exportCurrentSettingsObject();
	return JSON.stringify(settingsObj, null, 2);
}

export async function downloadZip(zipName: string, folderName: string, files: Record<string, string | Blob>) {
	const notification = await createNotification({
		icon: "inventory_2",
		title: "Preparing Export",
		content: "Initializing ZIP generation...",
		timeout: -1,
	});

	try {
		await loadJSZip();

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
		createError(`Failed to generate ZIP: ${error instanceof Error ? error.message : String(error)}`);
	}
}

// Add items to ZIP
export async function addItemsToZip(items: any[], files: Record<string, string | Blob>, baseFolder: string = "") {
	const prefix = baseFolder ? (baseFolder.endsWith("/") ? baseFolder : `${baseFolder}/`) : "";
	const categoryOrder: string[] = [];

	for (const thisCategory of items) {
		const categoryName = (thisCategory.category?.label || thisCategory.label || "Untitled Category").replace(
			/\/|\n/g,
			"_",
		);
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
				const settingName = (originalSetting.name || originalSetting.id || "Untitled Setting").replace(/\/|\n/g, "_");
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

export async function exportStyleShiftZip(styleshiftData: any[], zipFileName: string) {
	const files: Record<string, string | Blob> = {};
	await addItemsToZip(styleshiftData, files);
	await downloadZip(zipFileName, "", files);
}
