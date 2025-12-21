import { get_all_styleshift_items } from "../settings/items";
import { create_main_settings_ui } from "./settings/settings";

export let extension_settings_ui: Awaited<ReturnType<typeof create_main_settings_ui>>;

(async () => {
	extension_settings_ui = await create_main_settings_ui({
		get_category: get_all_styleshift_items,
	});
})();
