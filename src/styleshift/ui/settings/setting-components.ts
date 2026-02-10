import { save_to_storage } from "@/styleshift/core/storage-manager";
import * as advance_setting_ui from "./components/advance/advance";
import * as developer_setting_ui from "./components/dev/dev";
import * as main_setting_ui from "./components/main/main";
import type { Setting } from "../../types/store";
import * as render from "./render";
import * as windows from "./windows";

export async function set_and_save(this_setting: Setting, value: any) {
	if ("id" in this_setting && this_setting.id) {
		await save_to_storage(this_setting.id, value);
	}
}

export const settings_ui = {
	...main_setting_ui,
	...advance_setting_ui,
	...developer_setting_ui,
	...render,
	...windows,
};
