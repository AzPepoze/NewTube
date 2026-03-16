import * as styleshiftFunctions from "../styleshift/shared/extension";
import { sleep } from "../styleshift/shared/normal";
import { Category } from "../styleshift/types/styleshiftTypes";
import { logger } from "../shared/logger";

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
				name: "Export file",
				description: "Packages your entire NewTube configuration, including all custom categories and settings, into a compressed .zip file for easy backup or sharing.",
				color: "#1a34ffff",
				fontSize: 15,
				clickFunction: async function () {
					const notification = await styleshiftFunctions["createNotification"]({
						icon: "🔄️",
						title: "NewTube - Exporting file",
						content: "Please wait...",
						timeout: -1,
					});

					try {
						await styleshiftFunctions["exportStyleshiftZip"](
							JSON.parse(await styleshiftFunctions["exportStyleshiftJsonText"]())
								.customStyleshiftItems,
							"Test.NewTube.zip",
						);

						notification.setIcon("✅");
						notification.setTitle("NewTube - Exported file");
						notification.setContent("Exported successfully!");

						await sleep(3000);

						notification.close();
					} catch (error) {
						notification.close();
						styleshiftFunctions["createError"](error).then((notification) => {
							notification.setTitle("NewTube - Error exporting file");
						});
					}
				},
				align: "center",
				icon: "",
			},
			{
				type: "button",
				id: "ImportZipFileButton",
				name: "Import file",
				description: "Instantly restores your NewTube configuration from a previously exported .zip backup file.",
				color: "#1a34ffff",
				fontSize: 15,
				clickFunction: async function () {
					const notification = await styleshiftFunctions["createNotification"]({
						icon: "🔄️",
						title: "NewTube - Choosing file",
						content: "Please choose file...",
						timeout: -1,
					});
					try {
						const file = await styleshiftFunctions["getFile"](".NewTube.zip");
						logger.info("extension", "file:", file);
						await styleshiftFunctions["importStyleshiftZip"](file);

						notification.setIcon("✅");
						notification.setTitle("NewTube - Imported file");
						notification.setContent("Imported successfully!");

						await sleep(3000);

						notification.close();
					} catch (error) {
						notification.close();
						styleshiftFunctions["createError"](error).then((notification) => {
							notification.setTitle("NewTube - Error importing file");
						});
					}
				},
				align: "center",
				icon: "",
			},
		],
	},
];

export function getStyleshiftDevOnlyItems() {
	return devOnlyItems;
}
