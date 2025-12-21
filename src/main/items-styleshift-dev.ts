import * as styleshift_functions from "../styleshift/build-in-functions/extension";
import { sleep } from "../styleshift/build-in-functions/normal";
import { Category } from "../styleshift/types/store";

const dev_only_items: Category[] = [
	{
		category: "↕️ Import / Export Theme",
		settings: [
			{
				type: "sub_text",
				color: "#1a34ffff",
				font_size: 15,
				text_align: "center",
				text: "file (.StyleShift.zip)",
			},
			{
				type: "button",
				id: "Export_ZIP_file",
				name: "Export file",
				description: "Description of this button",
				color: "#1a34ffff",
				font_size: 15,
				click_function: async function () {
					const notification = await styleshift_functions["create_notification"]({
						icon: "🔄️",
						title: "StyleShift - Exporting file",
						content: "Please wait...",
						timeout: -1,
					});

					try {
						await styleshift_functions["export_styleshift_zip"](
							JSON.parse(await styleshift_functions["export_styleshift_json_text"]())
								.custom_styleshift_items,
							"Test.StyleShift.zip"
						);

						notification.set_icon("✅");
						notification.set_title("StyleShift - Exported file");
						notification.set_content("Exported successfully!");

						await sleep(3000);

						notification.close();
					} catch (error) {
						notification.close();
						styleshift_functions["create_error"](error).then((notification) => {
							notification.set_title("StyleShift - Error exporting file");
						});
					}
				},
				text_align: "center",
				icon: "",
			},
			{
				type: "button",
				id: "Import_ZIP_file",
				name: "Import file",
				description: "Description of this button",
				color: "#1a34ffff",
				font_size: 15,
				click_function: async function () {
					const notification = await styleshift_functions["create_notification"]({
						icon: "🔄️",
						title: "StyleShift - Choosing file",
						content: "Please choose file...",
						timeout: -1,
					});
					try {
						const file = await styleshift_functions["get_file"](".StyleShift.zip");
						console.log("file:", file);
						await styleshift_functions["import_styleshift_zip"](file);

						notification.set_icon("✅");
						notification.set_title("StyleShift - Imported file");
						notification.set_content("Imported successfully!");

						await sleep(3000);

						notification.close();
					} catch (error) {
						notification.close();
						styleshift_functions["create_error"](error).then((notification) => {
							notification.set_title("StyleShift - Error importing file");
						});
					}
				},
				text_align: "center",
				icon: "",
			},
		],
	},
];

export function get_styleshift_dev_only_items() {
	return dev_only_items;
}
