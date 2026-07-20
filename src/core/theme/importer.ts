import { deepClone, sleep, sortObjectKeys } from "@/core/shared/utilities";
import { jszipInstance, loadJSZip } from "@core/runtime/controller";
import { alertPrompt, chooseSelection, enterPrompt, enterTextPrompt } from "@core/shared/dialogs";
import { downloadFile, getFiles } from "@core/shared/extensionHelpers";
import { parseStyleShiftZip } from "@core/shared/importExport";
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
import { applyTheme, saveTheme, type Theme } from "@core/theme/manager";
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
	return sortObjectKeys(await getRootValue("currentSettings"));
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

type ThemeCandidate = { data: unknown; source: string; suggestedName?: string };
export type ThemeBatchImportResult = {
	successful: Theme[];
	failures: { source: string; reason: string }[];
};

function candidatesFromJson(value: unknown, source: string, suggestedName?: string): ThemeCandidate[] {
	const values = Array.isArray(value) ? value : [value];
	return values.map((data, index) => ({
		data,
		source: values.length > 1 ? `${source} (item ${index + 1})` : source,
		suggestedName,
	}));
}

async function importThemeCandidates(candidates: ThemeCandidate[]): Promise<ThemeBatchImportResult> {
	const result: ThemeBatchImportResult = { successful: [], failures: [] };
	for (const candidate of candidates) {
		try {
			if (!candidate.data || typeof candidate.data !== "object" || Array.isArray(candidate.data)) {
				throw new Error("Theme must be a JSON object");
			}
			const data = candidate.data as Record<string, unknown>;
			const hasSettings =
				data.currentSettings !== null &&
				typeof data.currentSettings === "object" &&
				!Array.isArray(data.currentSettings);
			const hasAddOns = Array.isArray(data.addOnStyleShiftItems);
			if (!hasSettings && !hasAddOns) {
				throw new Error("Missing valid currentSettings and addOnStyleShiftItems");
			}

			let themeName = typeof data.themeName === "string" ? data.themeName.trim() : "";
			if (!themeName) {
				const enteredName = await enterPrompt({
					title: "Theme Name",
					placeholder: "Enter a name for this theme...",
					value: candidate.suggestedName || "Imported Theme",
				});
				themeName = enteredName?.trim() || "";
				if (!themeName) {
					result.failures.push({ source: candidate.source, reason: "Theme naming canceled" });
					continue;
				}
			}

			const themeId = typeof data.themeId === "string" && data.themeId.trim() ? data.themeId.trim() : themeName;
			const success = await saveTheme(themeName, data as Theme, "EXTENSION", themeId, false);
			if (!success) {
				result.failures.push({ source: candidate.source, reason: "Save failed or was canceled" });
				continue;
			}
			result.successful.push({
				themeId,
				themeName,
				currentSettings: data.currentSettings as Theme["currentSettings"],
				addOnStyleShiftItems: data.addOnStyleShiftItems as Theme["addOnStyleShiftItems"],
			});
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			logger.error("import", `Failed to import ${candidate.source}`, error);
			result.failures.push({ source: candidate.source, reason });
		}
	}
	return result;
}

async function finishThemeBatchImport(result: ThemeBatchImportResult) {
	const imported = result.successful.map((theme) => theme.themeName);
	const summary = [
		`Imported (${imported.length}): ${imported.length ? imported.join(", ") : "None"}`,
		`Skipped (${result.failures.length}): ${
			result.failures.length ? result.failures.map(({ source, reason }) => `${source} — ${reason}`).join("\n") : "None"
		}`,
	].join("\n\n");
	await alertPrompt({ title: "Theme Import Summary", message: summary });

	if (result.successful.length === 0) return;
	const applyChoices = result.successful.map((theme) => {
		const duplicateName = result.successful.filter(({ themeName }) => themeName === theme.themeName).length > 1;
		return {
			label: duplicateName ? `${theme.themeName} (${theme.themeId})` : theme.themeName,
			theme,
		};
	});
	const choice = await chooseSelection({
		title: "Apply Imported Theme",
		message: "Choose an imported theme to apply, or keep your current theme.",
		buttons: [
			{ label: "Keep current", color: "var(--fg-opacity-20)" },
			...applyChoices.map(({ label }) => ({ label, color: "var(--theme-0)" })),
		],
		vertical: true,
	});
	if (choice !== null && choice !== "Keep current") {
		const theme = applyChoices.find(({ label }) => label === choice)?.theme;
		if (!theme) return;
		await applyTheme(theme.themeId, theme.themeName, "EXTENSION");
	}
}

async function importJsonFiles(): Promise<ThemeBatchImportResult> {
	const result: ThemeBatchImportResult = { successful: [], failures: [] };
	const candidates: ThemeCandidate[] = [];
	for (const file of await getFiles(".json,application/json")) {
		try {
			const parsed = JSON.parse(await file.text());
			candidates.push(...candidatesFromJson(parsed, file.name, file.name.replace(/\.json$/i, "")));
		} catch (error) {
			result.failures.push({
				source: file.name,
				reason: error instanceof Error ? error.message : String(error),
			});
		}
	}
	const imported = await importThemeCandidates(candidates);
	return { successful: imported.successful, failures: [...result.failures, ...imported.failures] };
}

export async function importThemeZipWithWorkflow() {
	try {
		const candidates: ThemeCandidate[] = [];
		const failures: ThemeBatchImportResult["failures"] = [];
		for (const file of await getFiles(".zip,application/zip")) {
			try {
				const data = await parseStyleShiftZip(file);
				if (!data.currentSettings && data.addOnStyleShiftItems?.length === 0) {
					throw new Error("Archive contains no importable theme content");
				}
				candidates.push({
					data,
					source: file.name,
					suggestedName: file.name.replace(/\.zip$/i, ""),
				});
			} catch (error) {
				failures.push({ source: file.name, reason: error instanceof Error ? error.message : String(error) });
			}
		}
		const imported = await importThemeCandidates(candidates);
		await finishThemeBatchImport({ successful: imported.successful, failures: [...failures, ...imported.failures] });
	} catch {}
}

export async function importThemeFromTextWorkflow() {
	try {
		const rawText = await enterTextPrompt({
			title: "Import Theme JSON",
			placeholder: "Paste one theme object or an array of themes...",
		});
		if (!rawText?.trim()) return;
		let result: ThemeBatchImportResult;
		try {
			result = await importThemeCandidates(candidatesFromJson(JSON.parse(rawText), "Pasted JSON"));
		} catch (error) {
			result = {
				successful: [],
				failures: [{ source: "Pasted JSON", reason: error instanceof Error ? error.message : String(error) }],
			};
		}
		await finishThemeBatchImport(result);
	} catch {}
}

export async function importThemeWorkflow() {
	const choice = await chooseSelection({
		title: "Import Theme",
		message: "How would you like to import this theme?",
		buttons: [
			{ label: "Paste", color: "var(--theme-0)" },
			{ label: "JSON Files", color: "var(--theme-0)" },
			{ label: "ZIP Files", color: "var(--theme-0)" },
		],
		vertical: true,
	});
	if (choice === null) return;
	if (choice === "Paste") {
		await importThemeFromTextWorkflow();
	} else if (choice === "JSON Files") {
		try {
			await finishThemeBatchImport(await importJsonFiles());
		} catch {}
	} else if (choice === "ZIP Files") {
		await importThemeZipWithWorkflow();
	}
}
