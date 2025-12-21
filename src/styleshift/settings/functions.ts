import { wait_one_frame } from "../build-in-functions/normal";
import { run_text_script_from_setting } from "../core/extension";
import { load_any } from "../core/save";
import { Setting } from "../types/store";
import { create_stylesheet } from "./style-sheet";

export const settings_current_state = {};
const settings_update_function: { [key: string]: Function } = {};

const settings_on_update: { [key: string]: Function[] } = {};
const settings_on_init: { [key: string]: Function[] } = {};

const settings_function = {
	["checkbox"]: async function (this_setting) {
		let style_sheet: HTMLElement;
		if (this_setting.constant_css || this_setting.enable_css || this_setting.disable_css) {
			style_sheet = create_stylesheet(this_setting.id);
		}

		if (this_setting.setup_function) {
			run_text_script_from_setting(this_setting, "setup_function");
		}

		async function update_function() {
			const value = await load_any(this_setting.id);

			if (style_sheet) {
				style_sheet.textContent = this_setting.constant_css || ``;
			}

			if (value) {
				if (style_sheet) {
					style_sheet.textContent += this_setting.enable_css || ``;
				}
			} else {
				if (style_sheet) {
					style_sheet.textContent += this_setting.disable_css || ``;
				}
			}

			if (settings_current_state[this_setting.id] == value) return;
			settings_current_state[this_setting.id] = value;

			if (this_setting.update_function) {
				run_text_script_from_setting(this_setting, "update_function");
			}

			if (value) {
				if (this_setting.enable_function) {
					run_text_script_from_setting(this_setting, "enable_function");
				}
			} else {
				if (this_setting.disable_function) {
					run_text_script_from_setting(this_setting, "disable_function");
				}
			}
		}

		update_function();

		return update_function;
	},
	["number_slide"]: async function (this_setting: Partial<Extract<Setting, { type: "number_slide" }>>) {
		let style_sheet: HTMLElement;
		if (this_setting.constant_css || this_setting.var_css) {
			style_sheet = create_stylesheet(this_setting.id);
		}

		if (this_setting.setup_function) {
			run_text_script_from_setting(this_setting, "setup_function");
		}

		async function update_function() {
			const value = await load_any(this_setting.id);

			if (style_sheet) {
				style_sheet.textContent = "";
				style_sheet.textContent += `:root{${
					this_setting.var_css ? this_setting.var_css : `--${this_setting.id}`
				}: ${value}${this_setting.var_css_unit || "px"}`;
				if (this_setting.constant_css) {
					style_sheet.textContent += this_setting.constant_css;
				}
			}

			// if (settings_current_state[this_setting.id] == value) return;
			settings_current_state[this_setting.id] = value;

			if (this_setting.update_function) {
				run_text_script_from_setting(this_setting, "update_function");
			}
		}

		update_function();

		return update_function;
	},
	["dropdown"]: async function (this_setting: Partial<Extract<Setting, { type: "dropdown" }>>) {
		let style_sheet: HTMLElement;
		style_sheet = create_stylesheet(this_setting.id);
		if (this_setting.setup_function) {
			run_text_script_from_setting(this_setting, "setup_function");
		}

		async function update_function() {
			const value = await load_any(this_setting.id);

			if (settings_current_state[this_setting.id] == value) return;

			//----------------------

			const old_dropdown = this_setting.options[settings_current_state[this_setting.id]];
			run_text_script_from_setting(this_setting, "disable_function");

			//----------------------

			settings_current_state[this_setting.id] = value;
			const current_dropdown = this_setting.options[value];
			run_text_script_from_setting(this_setting, "enable_function");

			//----------------------

			style_sheet.textContent = "";
			if (this_setting.constant_css) {
				style_sheet.textContent += this_setting.constant_css;
			}
			if (current_dropdown && current_dropdown.enable_css) {
				style_sheet.textContent += current_dropdown.enable_css;
			}
		}

		update_function();

		return update_function;
	},
	["color"]: async function (this_setting: Partial<Extract<Setting, { type: "color" }>>) {
		let style_sheet: HTMLElement;

		// if (this_setting.constant_css) {
		style_sheet = create_stylesheet(this_setting.id);
		// }

		if (this_setting.setup_function) {
			run_text_script_from_setting(this_setting, "setup_function");
		}

		async function update_function() {
			const value = await load_any(this_setting.id);

			//----------------------

			settings_current_state[this_setting.id] = value;

			//----------------------

			if (style_sheet) {
				style_sheet.textContent = "";
				style_sheet.textContent += `:root{${
					this_setting.var_css ? this_setting.var_css : `--${this_setting.id}`
				}: ${value}}`;
				style_sheet.textContent += this_setting.constant_css || ``;
			}

			//----------------------

			if (this_setting.update_function) {
				run_text_script_from_setting(this_setting, "update_function");
			}
		}

		update_function();

		return update_function;
	},
	["custom"]: async function (this_setting: Partial<Extract<Setting, { type: "custom" }>>) {
		let style_sheet: HTMLElement;
		if (this_setting.constant_css) {
			style_sheet = create_stylesheet(this_setting.id);
		}

		if (this_setting.setup_function) {
			run_text_script_from_setting(this_setting, "setup_function");
		}

		async function update_function() {
			const value = await load_any(this_setting.id);

			//----------------------

			// if (settings_current_state[this_setting.id] == value) return;
			settings_current_state[this_setting.id] = value;

			//----------------------

			if (style_sheet) {
				style_sheet.textContent = this_setting.constant_css || ``;
			}
		}

		update_function();

		return update_function;
	},
	["combine_settings"]: async function (this_setting: Partial<Extract<Setting, { type: "combine_settings" }>>) {
		const style_sheet = create_stylesheet(this_setting.id);

		async function update_function() {
			if (style_sheet && this_setting.update_function) {
				style_sheet.textContent = this_setting.update_function;
			}
		}

		update_function();
		return update_function;
	},
};

export async function setup_setting_function(this_setting) {
	if (this_setting.id == null) return;

	const get_update_function = settings_function[this_setting.type];
	if (!get_update_function) return;

	const update_function = await get_update_function(this_setting);
	settings_update_function[this_setting.id] = update_function;

	return update_function;
}

const updating_setting_function = {};

export async function update_setting_function(id) {
	switch (updating_setting_function[id]) {
		case "Waiting":
			return;

		case "Updating":
			updating_setting_function[id] = "Waiting";
			await wait_one_frame();
			update_setting_function(id);

		default:
			updating_setting_function[id] = "Updating";
			if (settings_update_function[id]) await settings_update_function[id]();
			const current_value = await load_any(id);

			// run all on_update functions
			if (settings_on_update[id]) {
				for (const this_function of settings_on_update[id]) {
					this_function(current_value);
				}
			}

			console.log("updated", id, current_value);
			//----------------------
			await wait_one_frame();

			if (updating_setting_function[id] == "Updating") {
				delete updating_setting_function[id];
			}
	}
}

export async function on_setting_update(id: string, callback: (value) => void, callback_on_init = false) {
	if (settings_on_update[id] == null) {
		settings_on_update[id] = [];
	}

	settings_on_update[id].push(callback);

	if (callback_on_init) {
		if (settings_on_init[id] == null) {
			settings_on_init[id] = [];
		}
		settings_on_init[id].push(callback);
	}
}

export async function remove_on_setting_update(id: string, callback: Function) {
	if (settings_on_update[id] == null) return;

	settings_on_update[id] = settings_on_update[id].filter((this_function) => this_function != callback);

	if (settings_on_update[id].length == 0) {
		delete settings_on_update[id];
	}
}

export async function run_setting_init(id) {
	if (settings_on_init[id]) {
		const current_value = await load_any(id);
		for (const this_function of settings_on_init[id]) {
			this_function(current_value);
		}
	}
}

export async function run_all_setting_init() {
	for (const id in settings_on_init) {
		// console.log("running init", id);
		run_setting_init(id);
	}
}
