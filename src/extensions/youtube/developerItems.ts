import { exportThemeWithSelection } from "@core/theme/exporter";
import { importThemeZipWithWorkflow } from "@core/theme/importer";
import { getRootValue } from "@core/storage/manager";
import { type Category } from "@settings/types/styleshiftTypes";

const devOnlyItems: Category[] = [
	{
		category: { icon: "swap_vert", label: "Import / Export Theme" },
		settings: [
			{
				type: "subText",
				fontSize: 15,
				align: "center",
				text: "file (.NewTube.zip)",
			},
			{
				type: "button",
				id: "ExportZipFileButton",
				name: "Export active theme",
				description: "Exports your currently active theme configuration to clipboard or ZIP file.",
				color: "#1a34ffff",
				fontSize: 15,
				clickFunction: async function () {
					const activeThemeId = await getRootValue("activeTheme");
					const themes = (await getRootValue("themes")) || [];
					const theme = themes.find((t: any) => t.themeId === activeThemeId);
					if (theme) {
						await exportThemeWithSelection(activeThemeId, theme.themeName, theme);
					} else {
						const currentSettings = await getRootValue("currentSettings");
						const addOnStyleShiftItems = await getRootValue("addOnStyleShiftItems");
						await exportThemeWithSelection("current", "Current Theme", { currentSettings, addOnStyleShiftItems });
					}
				},
				align: "center",
				icon: "publish",
			},
			{
				type: "button",
				id: "ImportZipFileButton",
				name: "Import theme file",
				description: "Imports a theme configuration from a ZIP file into your Theme Manager.",
				color: "#1a34ffff",
				fontSize: 15,
				clickFunction: async function () {
					await importThemeZipWithWorkflow();
				},
				align: "center",
				icon: "download",
			},
			{
				type: "button",
				id: "SelectorPickerButton",
				name: "Selector Picker",
				description: "Allows you to pick an element from the page and get its CSS selector for development purposes.",
				color: "#7f5db7",
				fontSize: 15,
				clickFunction: async function () {
					const { openSelectorPicker } = await import("@ui/highlight/selectorPicker");
					openSelectorPicker();
				},
				align: "center",
				icon: "target",
			},
		],
	},
];

export function getStyleShiftDevOnlyItems() {
	return devOnlyItems;
}
