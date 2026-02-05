import { Setting } from "@styleshift/types/store";
import { settings_ui } from "@ui/settings/setting-components";

export const main_setting_ui = {
	["search"]: async function (on_input: (value: string) => void) {
		// Search is a special utility, we'll keep its direct mount or update SettingRenderer to handle it
		return settings_ui.render_setting({ type: "search" } as unknown as Setting, on_input);
	},

	["text"]: async function (this_setting: Partial<Extract<Setting, { type: "text" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},

	["sub_text"]: async function (this_setting: Partial<Extract<Setting, { type: "sub_text" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},

	["button"]: async function (this_setting: Partial<Extract<Setting, { type: "button" }>>) {
		const button = settings_ui.render_setting(this_setting);
		return { button };
	},

	["checkbox"]: async function (
		this_setting: Partial<Extract<Setting, { type: "checkbox" }>>,
		update_function?: Function,
	) {
		const frame = settings_ui.render_setting(this_setting, update_function);
		return { frame };
	},

	["number_slide"]: async function (this_setting: Partial<Extract<Setting, { type: "number_slide" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},

	["dropdown"]: async function (this_setting: Partial<Extract<Setting, { type: "dropdown" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},

	["color"]: async function (this_setting: Partial<Extract<Setting, { type: "color" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},

	["text_input"]: async function (this_setting: Partial<Extract<Setting, { type: "text_input" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},

	["image_input"]: async function (this_setting: Partial<Extract<Setting, { type: "image_input" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},

	["preview_image"]: async function (this_setting: Partial<Extract<Setting, { type: "preview_image" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},

	["custom"]: async function (this_setting: Partial<Extract<Setting, { type: "custom" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},

	["combine_settings"]: async function (this_setting: Partial<Extract<Setting, { type: "combine_settings" }>>) {
		const frame = settings_ui.render_setting(this_setting);
		return { frame };
	},
};
