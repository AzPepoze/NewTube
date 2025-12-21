import { save_any } from "../../core/save";
import { advance_setting_ui } from "./components/advance";
import { developer_setting_ui } from "./components/dev";
import { main_setting_ui } from "./components/main";

export async function set_and_save(this_setting, value) {
	// this_setting.value = value;
	// await save_all();
	await save_any(this_setting.id, value);
}

export const settings_ui = {
	...main_setting_ui,
	...advance_setting_ui,
	...developer_setting_ui,
};
