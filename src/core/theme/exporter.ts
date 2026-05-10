import { chooseSelection } from '@core/shared/dialogs';
import { copyToClipboard } from '@core/shared/extensionHelpers';
import { parseStyleShiftZip } from '@core/shared/importExport';
import { createNotification } from '@core/shared/notifications';
import { addItemsToZip, downloadZip } from '@core/theme/importer';
import { saveTheme } from '@core/theme/manager';
import { logger } from '@shared/logger';

/**
 * Handles the theme export process with user selection for content and format.
 */
export async function exportThemeWithSelection(themeId: string, themeName: string, themeData: any) {
	const displayName = themeName || themeId;

	const exportType = await chooseSelection({
		title: `Export "${displayName}"`,
		message: "What would you like to export?",
		buttons: [
			{
				label: "Build-in settings only",
				color: "var(--theme-0)",
				description: "Exports only the settings that come by default with NewTube.",
			},
			{
				label: "Add-ons settings only",
				color: "var(--theme-0)",
				description: "Exports only the add-ons settings.",
			},
			{
				label: "Both",
				color: "var(--theme-0)",
				description: "Exports both default and add-ons settings.",
			},
		],
		vertical: true,
	});

	if (!exportType) return;

	const method = await chooseSelection({
		title: `Export "${displayName}"`,
		message: "How would you like to export this theme?\n(Click outside to cancel)",
		buttons: [
			{ label: "Clipboard", color: "var(--theme-0)" },
			{ label: "ZIP File", color: "var(--theme-0)" },
		],
	});

	if (!method) return;

	const exportData: any = {
		themeId,
		themeName,
	};

	if (exportType === "Both" || exportType === "Build-in settings only") {
		exportData.currentSettings = themeData.currentSettings;
	}

	if (exportType === "Both" || exportType === "Add-ons settings only") {
		exportData.addOnStyleShiftItems = themeData.addOnStyleShiftItems;
	}

	if (method === "Clipboard") {
		exportThemeToClipboard(displayName, exportData);
	} else if (method === "ZIP File") {
		await exportThemeAsZip(displayName, exportData);
	}
}

/**
 * Copies theme data to the clipboard as a JSON string.
 */
export function exportThemeToClipboard(name: string, data: any) {
	const jsonText = JSON.stringify(data, null, 2);
	copyToClipboard(jsonText);

	createNotification({
		icon: "content_copy",
		title: "Theme Exported",
		content: `"${name}" copied to clipboard.`,
	});
}

/**
 * Downloads theme data as a structured ZIP file (high-fidelity).
 */
export async function exportThemeAsZip(name: string, data: any) {
	const files: Record<string, string | Blob> = {};

	// 1. currentSettings.json
	if (data.currentSettings) {
		files["currentSettings.json"] = JSON.stringify(data.currentSettings, null, 2);
	}

	// 2. addOnStyleShiftItems/ (Expanded)
	if (data.addOnStyleShiftItems && Array.isArray(data.addOnStyleShiftItems)) {
		await addItemsToZip(data.addOnStyleShiftItems, files, "addOnStyleShiftItems");
	}

	// 3. Handle any legacy script/CSS properties if they still exist at top level
	for (const [key, value] of Object.entries(data)) {
		if (
			typeof value === "string" &&
			!files[`${key}.js`] && // Avoid overwriting if they were already added
			(key.endsWith("Css") ||
				key.endsWith("Function") ||
				key.endsWith("Script"))
		) {
			files[`${key}.js`] = value;
		}
	}

	await downloadZip(`${name}.zip`, "", files);
}

/**
 * Triggers a file picker to import a ZIP file as a theme.
 */
export async function importThemeZipWithWorkflow() {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".zip";

	input.onchange = async (event: any) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const notification = await createNotification({
			icon: "file_download",
			title: "Importing Theme",
			content: `Reading "${file.name}"...`,
			timeout: -1,
		});

		try {
			const data = await parseStyleShiftZip(file);

			// Default theme name to filename without extension
			const defaultName = file.name.replace(".zip", "");
			const rawName = prompt("Enter a name for this theme:", defaultName);

			if (!rawName) {
				notification.close();
				return;
			}

			const themeName = rawName.trim();

			notification.setContent(`Saving "${themeName}" to Theme Manager...`);

			// Save as theme (using "EXTENSION" as the domain for global themes)
			const success = await saveTheme(themeName, data, "EXTENSION");

			if (success) {
				notification.setIcon("check_circle");
				notification.setTitle("Import Successful");
				notification.setContent(`Theme "${themeName}" is now available in your themes.`);
				setTimeout(() => notification.close(), 3000);
			} else {
				throw new Error("Failed to save theme to storage.");
			}
		} catch (error) {
			notification.close();
			logger.error("import", "Theme Import Failed", error);
			alert(`Failed to import theme: ${error instanceof Error ? error.message : String(error)}`);
		}
	};

	input.click();
}
