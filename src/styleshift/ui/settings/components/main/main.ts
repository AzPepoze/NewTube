import { Setting } from "@styleshift/types/store";
import { settings_ui } from "@ui/settings/setting-components";

export async function search(on_input: (value: string) => void) {
	// Search is a special utility, we'll keep its direct mount or update SettingRenderer to handle it
	return settings_ui.render_setting({ type: "search" } as unknown as Setting, on_input);
}

export async function text(
	this_setting: Partial<Extract<Setting, { type: "text" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function sub_text(
	this_setting: Partial<Extract<Setting, { type: "sub_text" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function button(
	this_setting: Partial<Extract<Setting, { type: "button" }>>,
	update_function?: (value: any) => void,
) {
	const button = settings_ui.render_setting(this_setting as any, update_function);
	return { button };
}

export async function checkbox(
	this_setting: Partial<Extract<Setting, { type: "checkbox" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function number_slide(
	this_setting: Partial<Extract<Setting, { type: "number_slide" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function dropdown(
	this_setting: Partial<Extract<Setting, { type: "dropdown" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function color(
	this_setting: Partial<Extract<Setting, { type: "color" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function text_input(
	this_setting: Partial<Extract<Setting, { type: "text_input" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function image_input(
	this_setting: Partial<Extract<Setting, { type: "image_input" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function preview_image(
	this_setting: Partial<Extract<Setting, { type: "preview_image" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function custom(
	this_setting: Partial<Extract<Setting, { type: "custom" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}

export async function combine_settings(
	this_setting: Partial<Extract<Setting, { type: "combine_settings" }>>,
	update_function?: (value: any) => void,
) {
	const frame = settings_ui.render_setting(this_setting as any, update_function);
	return { frame };
}
