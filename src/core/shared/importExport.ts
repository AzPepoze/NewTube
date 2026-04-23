import { jszipInstance as jszip, saveAndRefreshAll } from '@core/runtime/controller';
import { initializeRequiredStorageStructures as setNullSave } from '@core/storage/maintenance';
import { ALLOWED_STORAGE_KEYS, cachedStorageData as savedData } from '@core/storage/manager';
import type { Category, Setting } from '@settings/types/styleshiftTypes';
import { logger } from '@shared/logger';

import { createError, createNotification, createWarning } from './notifications';
import { deepClone, sleep } from './utilities';

/**
 * Imports StyleShift data and updates the saved data.
 */
export async function importStyleShiftData(styleshiftData: object) {
	const notification = await createNotification({
		icon: "sync",
		title: "StyleShift - Importing data",
		content: "Please wait...",
		timeout: -1,
	});

	try {
		for (const thisKey of ALLOWED_STORAGE_KEYS) {
			savedData[thisKey] = styleshiftData[thisKey];
		}

		await setNullSave();
		saveAndRefreshAll();

		notification.setIcon("check_circle");
		notification.setTitle("StyleShift - Imported data");
		notification.setContent("Imported successfully!");

		await sleep(3000);

		notification.close();
	} catch (error) {
		notification.close();

		createError(error).then((notification: any) => {
			notification.setTitle("StyleShift - Import Failed");
		});
	}
}

/**
 * Exports add-on items.
 */
export function exportStyleShiftData() {
	const exportData: any = {};

	for (const thisKey of ALLOWED_STORAGE_KEYS) {
		if (savedData[thisKey]) {
			exportData[thisKey] = deepClone(savedData[thisKey]);
		}
	}

	const addOnItems = exportData["addOnStyleShiftItems"];
 
	if (addOnItems) {
		for (const thisCategory of addOnItems) {
			delete thisCategory.Highlight_color;
			delete thisCategory.editable;

			for (const thisSetting of thisCategory.settings) {
				delete thisSetting.editable;
			}
		}
	} else {
		createWarning("No add-on items found. Skipping...");
	}

	return exportData;
}

/**
 * Imports StyleShift data from a JSON string.
 */
export async function importStyleShiftJsonText(text: string) {
	await importStyleShiftData(JSON.parse(text));
}

/**
 * Exports add-on items as a JSON string.
 */
export function exportStyleShiftJsonText() {
	return JSON.stringify(exportStyleShiftData(), null, 2);
}

/**
 * Parses a StyleShift ZIP file into a data object.
 */
export async function parseStyleShiftZip(zipFile: File | Blob): Promise<any> {
	if (!jszip) {
		throw new Error("JSZip not loaded!");
	}
	const zip = new (jszip as any)();

	const loadedZip = await zip.loadAsync(zipFile, {
		createFolders: true,
	});

	let addOnStyleShiftItems: Category[] = [];
	let currentSettings: any = null;

	const settingsFile = loadedZip.file("currentSettings.json");
	if (settingsFile) {
		currentSettings = JSON.parse(await settingsFile.async("string"));
	}

	let itemsBasePath = "";
	if (Object.keys(loadedZip.files).some(f => f.startsWith("addOnStyleShiftItems/"))) {
		itemsBasePath = "addOnStyleShiftItems/";
	}

	const categoryFolders: string[] = [];
	const categoriesOrderFile = loadedZip.file(`${itemsBasePath}order.json`);

	if (categoriesOrderFile) {
		const order = JSON.parse(await categoriesOrderFile.async("string")) as string[];
		for (const name of order) {
			const path = `${itemsBasePath}${name}/`;
			if (loadedZip.files[path]) {
				categoryFolders.push(path);
			}
		}
	} else {
		const folders = Object.keys(loadedZip.files).filter((path) => {
			const pathArray = path.split("/");
			const depth = itemsBasePath ? 2 : 1;
			return path.startsWith(itemsBasePath) && pathArray.length === depth + 1 && pathArray[depth] === "";
		});
		categoryFolders.push(...folders.sort());
	}

	for (let i = 0; i < categoryFolders.length; i++) {
		const categoryPath = categoryFolders[i];
		const categoryPathName = categoryPath.slice(0, -1);

		const categoryFolderBaseName = categoryPathName.split("/").pop() || "";
		let categoryIndex = i;
		if (categoryFolderBaseName.includes(" - ")) {
			const indexPart = parseInt(categoryFolderBaseName.split(" - ")[0]);
			if (!isNaN(indexPart)) categoryIndex = indexPart;
		}

		const categoryConfig = loadedZip.file(`${categoryPathName}/config.json`) ||
			loadedZip.file(`${categoryPathName}/Config.json`);

		if (!categoryConfig) continue;

		const categoryData = JSON.parse(await categoryConfig.async("string"));
		const settings: Setting[] = [];

		const settingFolders: string[] = [];
		const settingsOrderFile = loadedZip.file(`${categoryPathName}/order.json`);

		if (settingsOrderFile) {
			const order = JSON.parse(await settingsOrderFile.async("string")) as string[];
			for (const name of order) {
				const path = `${categoryPathName}/${name}/`;
				if (loadedZip.files[path]) {
					settingFolders.push(path);
				}
			}
		} else {
			const folders = Object.keys(loadedZip.files).filter((path) => {
				const pathArray = path.split("/");
				const depth = categoryPathName.split("/").length;
				return path.startsWith(`${categoryPathName}/`) && pathArray.length === depth + 2 && pathArray[depth + 1] === "";
			});
			settingFolders.push(...folders.sort());
		}

		for (let j = 0; j < settingFolders.length; j++) {
			const settingPath = settingFolders[j];
			const settingPathName = settingPath.slice(0, -1);

			const settingFolderBaseName = settingPathName.split("/").pop() || "";
			let settingIndex = j;
			if (settingFolderBaseName.includes(" - ")) {
				const indexPart = parseInt(settingFolderBaseName.split(" - ")[0]);
				if (!isNaN(indexPart)) settingIndex = indexPart;
			}

			const settingConfig = loadedZip.file(`${settingPathName}/config.json`) ||
				loadedZip.file(`${settingPathName}/Config.json`);
			if (!settingConfig) continue;

			const settingData = JSON.parse(await settingConfig.async("string")) || {};

			for (const filePath of Object.keys(loadedZip.files)) {
				const isPropertyFile = filePath.startsWith(settingPath) &&
					!filePath.endsWith("/") &&
					!filePath.toLowerCase().endsWith("/config.json") &&
					!filePath.toLowerCase().endsWith("/order.json");

				if (isPropertyFile) {
					const fileName = filePath.split("/").pop() || "";
					const propertyName = fileName.slice(0, fileName.lastIndexOf("."));
					settingData[propertyName] = await loadedZip.file(filePath).async("string");
				}
			}

			settings[settingIndex] = settingData;
		}

		categoryData["settings"] = settings.filter((s) => s !== null);
		addOnStyleShiftItems[categoryIndex] = categoryData;
	}
 
	const styleshiftData: any = {
		addOnStyleShiftItems: addOnStyleShiftItems.filter(c => c !== null),
	};

	if (currentSettings) {
		styleshiftData.currentSettings = currentSettings;
	}

	return styleshiftData;
}

/**
 * Imports StyleShift data from a ZIP file and applies it immediately.
 */
export async function importStyleShiftZip(zipFile: File | Blob) {
	const styleshiftData = await parseStyleShiftZip(zipFile);
	logger.info("extension", "Importing StyleShift ZIP Data", styleshiftData);
	await importStyleShiftData(styleshiftData);
}
