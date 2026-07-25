import { enterTextPrompt } from "@core/shared/dialogs";
import { createError, createNotification } from "@core/shared/notifications";
import { getRootValue } from "@core/storage/manager";
import { importPresetToSettings } from "@core/theme/importer";
import { logger } from "@shared/logger";
import CodeEditor from "@editor/CodeEditor.svelte";
import { settingsUi } from "@ui/settings/settingsApi";
import { createStyleShiftWindow } from "@ui/window/windowFactory";

/**
 * Converts legacy hex string and opacity percentage (0-100) into unified `#RRGGBBAA` format.
 */
export function parseLegacyColor(hexColor?: string, opacityVal?: number): string | null {
	if (!hexColor || typeof hexColor !== "string") return null;
	const trimmed = hexColor.trim();
	if (!trimmed.startsWith("#")) return null;

	if (trimmed.length === 9) {
		// Already #RRGGBBAA
		return trimmed;
	}

	if (trimmed.length === 7) {
		// #RRGGBB
		const opacity = typeof opacityVal === "number" ? Math.min(Math.max(opacityVal, 0), 100) : 100;
		const alphaHex = Math.round(opacity * 2.55)
			.toString(16)
			.padStart(2, "0");
		return `${trimmed}${alphaHex}`;
	}

	return null;
}

/**
 * Maps legacy NPreset key-value pairs from old NewTube to new NewTube settings keys.
 */
export function mapOldNPresetToNewSettings(oldPreset: Record<string, any>): Record<string, any> {
	const mappedSettings: Record<string, any> = {};

	const directKeyMap: Record<string, string> = {
		// Background settings
		BGIMG: "BackgroundImageUrl",
		// Video Automation
		AutoTheater: "EnableAutoTheaterMode",
		FullTheater: "EnableFullTheaterMode",
		AutoPIP: "EnableAutoPictureInPicture",
		AutoEXPIP: "EnableAutoExitPictureInPicture",
		RemoveAmbient: "AutoRemoveAmbientMode",
		// Extension controls
		EnableButton: "enableExtension",
		Realtime: "enableRealtimeExtension",
		// Custom CSS and Scripts
		CUSTOM: "CustomCss",
		ADDCUSTOM: "AdditionalCustomCss",
		ADDScript: "AdditionalCustomScript",
		EnaCUSCSS: "EnableCustomCss",
		EnaADDCSS: "EnableAdditionalCustomCss",
		// Blur & Borders
		BlurAm: "GlobalBlurAmount",
		BlurWhat: "BlurTargetSelection",
		Border: "GlobalBorderSize",
		HoverBorder: "HoverBorderSize",
		Edge: "GlobalCornerRadius",
		PlayerEdge: "GlobalCornerRadius",
		// Top-Left Icon
		IconURL: "TopLeftIconImageUrl",
		CustomIcon: "EnableCustomTopLeftIcon",
		IconFill: "EnableTopLeftIconSyncTheme",
		// Layout & Enhancement
		CenterMedia: "EnableVideoCentering",
	};

	// Map direct non-color keys
	for (const [oldKey, newKey] of Object.entries(directKeyMap)) {
		if (oldKey in oldPreset && oldPreset[oldKey] !== undefined) {
			mappedSettings[newKey] = oldPreset[oldKey];
		}
	}

	// Legacy Color Mappings: Base Key -> New Setting ID
	const colorMap: Record<string, string> = {
		Theme: "MainThemeColor",
		ThemeThr: "TransparentThemeColor",
		ThemeFort: "ThemeAccentColor",
		BG: "BackgroundTintColor",
		Text: "PrimaryTextColor",
		NdText: "SecondaryTextColor",
		LinkColor: "LinkTextColor",
		TIMETEXT: "TimestampTextColor",
		Chanel_Color: "ChannelNameColor",
		LeftBar: "SidebarBackgroundColor",
		sub: "SubtitleTextColor",
		CapBG: "SubtitleBackgroundColor",
		subShaColor: "SubtitleShadowColor",
		EndBG: "EndScreenOverlayColor",
	};

	// Process legacy color keys ({ID}C + {ID}O, {ID}Color + {ID}Opacity, or object)
	for (const [baseKey, newSettingId] of Object.entries(colorMap)) {
		const colorHex = oldPreset[`${baseKey}C`] ?? oldPreset[`${baseKey}Color`] ?? oldPreset[baseKey];
		const opacityVal = oldPreset[`${baseKey}O`] ?? oldPreset[`${baseKey}Opacity`];

		let hexVal: string | undefined;
		let opacityNum: number | undefined;

		if (typeof colorHex === "object" && colorHex !== null) {
			hexVal = colorHex.Color || colorHex.color;
			opacityNum = colorHex.Opacity ?? colorHex.opacity;
		} else if (typeof colorHex === "string") {
			hexVal = colorHex;
			if (typeof opacityVal === "number") opacityNum = opacityVal;
		}

		if (hexVal) {
			const parsedHex8 = parseLegacyColor(hexVal, opacityNum);
			if (parsedHex8) {
				mappedSettings[newSettingId] = parsedHex8;
				if (newSettingId === "BackgroundTintColor") {
					mappedSettings.EnableBackground = true;
				}
			}
		}
	}

	// Retain 100% of raw keys from oldPreset to guarantee no data is lost
	for (const [key, value] of Object.entries(oldPreset)) {
		mappedSettings[key] = value;
	}

	return mappedSettings;
}

export async function showAllCurrentSave(): Promise<void> {
	try {
		const allData = await getRootValue();
		const formattedJson = JSON.stringify(allData, null, 2);

		const saveWindow = await createStyleShiftWindow({
			title: "All Current Save Data",
			width: "75%",
			height: "85%",
			center: true,
		});

		saveWindow.contentElement.style.padding = "10px";
		saveWindow.contentElement.style.display = "flex";
		saveWindow.contentElement.style.flexDirection = "column";

		settingsUi.renderComponent(
			CodeEditor,
			{
				value: formattedJson,
				language: "json",
				height: "100%",
			},
			saveWindow.contentElement,
		);
	} catch (error) {
		logger.error("dangerzone", "Failed to show current save data:", error);
		await createError(`Failed to fetch current save data: ${error instanceof Error ? error.message : String(error)}`);
	}
}

export async function showTryImportOldNPreset(): Promise<void> {
	try {
		const inputPreset = await enterTextPrompt({
			title: "Import Old NPreset",
			placeholder: "Paste NPreset JSON or old storage JSON string here...",
			content: "",
		});

		if (!inputPreset || inputPreset.trim() === "") return;

		let rawPresetObj: any;
		try {
			rawPresetObj = JSON.parse(inputPreset);
		} catch (parseErr) {
			await createError(`Invalid JSON format: ${parseErr instanceof Error ? parseErr.message : String(parseErr)}`);
			return;
		}

		if (typeof rawPresetObj !== "object" || rawPresetObj === null) {
			await createError("Invalid NPreset format: Expected a JSON object.");
			return;
		}

		// Handle storage wrapper objects (e.g. { currentSettings: { ... } } or { PRESET: { ... } })
		let targetObj = rawPresetObj;
		if (rawPresetObj.currentSettings && typeof rawPresetObj.currentSettings === "object") {
			targetObj = rawPresetObj.currentSettings;
		}

		const mappedSettings = mapOldNPresetToNewSettings(targetObj);
		await importPresetToSettings(mappedSettings, true, "NPreset Import");

		await createNotification({
			icon: "check_circle",
			title: "NPreset Import Complete",
			content: "Successfully imported all legacy NPreset data into current settings.",
			timeout: 3000,
		});
	} catch (error) {
		if (error instanceof Error && error.message === "Canceled by the user") {
			return;
		}
		logger.error("dangerzone", "NPreset import failed:", error);
		await createError(`Failed to import NPreset: ${error instanceof Error ? error.message : String(error)}`);
	}
}
