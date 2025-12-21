import { convert_to_export_setting } from "../src/styleshift/core/export-converter";
import { ui_preset } from "../src/styleshift/settings/default-items";

const fs = require("fs");
const path = require("path");

async function create_setting_folder(category_folder_path, this_setting, setting_folder_name) {
	const settings_folder_path = path.join(category_folder_path, setting_folder_name);

	fs.mkdirSync(settings_folder_path, { recursive: true });

	await convert_to_export_setting(this_setting, async (file_name, file_data) => {
		fs.writeFileSync(path.join(settings_folder_path, `${file_name}`), file_data);
	});

	fs.writeFileSync(path.join(settings_folder_path, "config.json"), JSON.stringify(this_setting, null, 2));
}

const template_folder = path.join(__dirname, "../devs/templates");

(async () => {
	for (const this_preset of ui_preset) {
		await create_setting_folder(template_folder, this_preset, this_preset.type);
	}
})();
