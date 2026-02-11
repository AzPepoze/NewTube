import * as styleshiftFunctions from "../styleshift/shared/extension";
import { sleep } from "../styleshift/shared/normal";
import { Category } from "../styleshift/types/store";
import { logger } from "../styleshift/utils/logger";

const devOnlyItems: Category[] = [
	{
		category: "↕️ Import / Export Theme",
		settings: [
			{
				type: "subText",
				color: "#1a34ffff",
				fontSize: 15,
				align: "center",
				text: "file (.NewTube.zip)",
			},
			{
				type: "button",
				id: "Export_ZIP_file",
				name: "Export file",
				description: "Description of this button",
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
				id: "Import_ZIP_file",
				name: "Import file",
				description: "Description of this button",
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
