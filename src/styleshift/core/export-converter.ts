import { styleshift_property_list, type_convert_table } from "../settings/default-items";
import { Setting } from "../types/store";

export async function convert_to_export_setting(
	this_setting: Setting,
	create_file_function: (file_name: string, file_data: string) => Promise<void>
) {
	for (const this_property of styleshift_property_list[this_setting.type]) {
		if (
			(this_property.includes("_css") || this_property.includes("_function")) &&
			!(this_property in this_setting)
		) {
			this_setting[this_property] = "";
		}
	}

	//-----------------------------------

	for (const this_key of Object.keys(this_setting)) {
		for (const [styleshift_type, converted_type] of Object.entries(type_convert_table)) {
			if (this_key.endsWith(styleshift_type)) {
				await create_file_function(`${this_key}.${converted_type}`, this_setting[this_key]);
				delete this_setting[this_key];
			}
		}
	}
}
