import { Setting } from "@styleshift/types/store";
import { settings_ui } from "@ui/settings/setting-components";

export const main_setting_ui = {
	["search"]: async function (on_input: (value: string) => void) {
		// Search is a special utility, we'll keep its direct mount or update SettingRenderer to handle it
		return settings_ui.render_setting({ type: "search" } as unknown as Setting, on_input);
	},

	["text"]: async function (
		this_setting: Partial<Extract<Setting, { type: "text" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["sub_text"]: async function (
		this_setting: Partial<Extract<Setting, { type: "sub_text" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["button"]: async function (
		this_setting: Partial<Extract<Setting, { type: "button" }>>,
		update_function?: (value: any) => void,
	) {
		const button = settings_ui.render_setting(this_setting as any, update_function);
		return { button };
	},

	["checkbox"]: async function (
		this_setting: Partial<Extract<Setting, { type: "checkbox" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["number_slide"]: async function (
		this_setting: Partial<Extract<Setting, { type: "number_slide" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["dropdown"]: async function (
		this_setting: Partial<Extract<Setting, { type: "dropdown" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["color"]: async function (
		this_setting: Partial<Extract<Setting, { type: "color" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["text_input"]: async function (
		this_setting: Partial<Extract<Setting, { type: "text_input" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["image_input"]: async function (
		this_setting: Partial<Extract<Setting, { type: "image_input" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["preview_image"]: async function (
		this_setting: Partial<Extract<Setting, { type: "preview_image" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["custom"]: async function (
		this_setting: Partial<Extract<Setting, { type: "custom" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},

	["combine_settings"]: async function (
		this_setting: Partial<Extract<Setting, { type: "combine_settings" }>>,
		update_function?: (value: any) => void,
	) {
		const frame = settings_ui.render_setting(this_setting as any, update_function);
		return { frame };
	},
};
