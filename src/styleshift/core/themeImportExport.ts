import {
	chooseSelection,
	copyToClipboard,
	createNotification
} from "../shared/extension";
import { downloadZip, addItemsToZip } from "./settingsImportExport";
import { parseStyleshiftZip } from "../shared/extension";
import { saveTheme } from "./themeManager";
import { logger } from "../../shared/logger";

/**
 * Handles the theme export process with user selection for content and format.
 */
export async function exportThemeWithSelection(themeId: string, themeName: string, themeData: any) {
	const displayName = themeName || themeId;

	const exportType = await chooseSelection({
		title: `Export "${displayName}"`,
		message: "What would you like to export?",
		buttons: [
			{ label: "current settings only", color: "var(--Theme-0)" },
			{ label: "custom items only", color: "var(--Theme-0)" },
			{ label: "both", color: "var(--Theme-0)" },
		],
		vertical: true,
	});

	if (!exportType) return;

	const method = await chooseSelection({
		title: `Export "${displayName}"`,
		message: "How would you like to export this theme?\n(Click outside to cancel)",
		buttons: [
			{ label: "Clipboard", color: "var(--Theme-0)" },
			{ label: "ZIP File", color: "var(--Theme-0)" },
		],
	});

	if (!method) return;

	const exportData: any = {
		themeId,
		themeName,
	};

	if (exportType === "both" || exportType === "current settings only") {
		exportData.currentSettings = themeData.currentSettings;
	}

	if (exportType === "both" || exportType === "custom items only") {
		exportData.customStyleShiftItems = themeData.customStyleShiftItems;
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

	// 2. customStyleShiftItems/ (Expanded)
	if (data.customStyleShiftItems && Array.isArray(data.customStyleShiftItems)) {
		await addItemsToZip(data.customStyleShiftItems, files, "customStyleShiftItems");
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
			const data = await parseStyleshiftZip(file);
			
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
