import { wait_one_frame } from "../build-in-functions/normal";
import { execute_setting_script } from "../core/runtime-controller";
import { get_from_storage } from "../core/storage-manager";
import { Setting } from "../types/store";
import { create_stylesheet } from "./style-sheet";
import { logger } from "../utils/logger";

export const active_settings_state: Record<string, any> = {};
const setting_update_handlers: Record<string, Function> = {};

const setting_update_listeners: Record<string, Function[]> = {};
const setting_initializers: Record<string, Function[]> = {};

/**
 * Registry of initialization logic for different setting types.
 */
const SETTING_TYPE_BEHAVIORS = {
	["checkbox"]: async function (setting: any) {
		let stylesheet: HTMLElement;
		if (setting.constant_css || setting.enable_css || setting.disable_css) {
			stylesheet = create_stylesheet(setting.id);
		}

		if (setting.setup_function) {
			execute_setting_script(setting, "setup_function");
		}

		async function apply_checkbox_update() {
			const current_value = await get_from_storage(setting.id);

			if (stylesheet) {
				stylesheet.textContent = setting.constant_css || ``;
			}

			if (current_value) {
				if (stylesheet) stylesheet.textContent += setting.enable_css || ``;
			} else {
				if (stylesheet) stylesheet.textContent += setting.disable_css || ``;
			}

			if (active_settings_state[setting.id] === current_value) return;
			active_settings_state[setting.id] = current_value;

			if (setting.update_function) {
				execute_setting_script(setting, "update_function");
			}

			if (current_value) {
				if (setting.enable_function) execute_setting_script(setting, "enable_function");
			} else {
				if (setting.disable_function) execute_setting_script(setting, "disable_function");
			}
		}

		apply_checkbox_update();
		return apply_checkbox_update;
	},

	["number_slide"]: async function (setting: any) {
		let stylesheet: HTMLElement;
		if (setting.constant_css || setting.var_css) {
			stylesheet = create_stylesheet(setting.id);
		}

		if (setting.setup_function) {
			execute_setting_script(setting, "setup_function");
		}

		async function apply_slider_update() {
			const value = await get_from_storage(setting.id);

			if (stylesheet) {
				stylesheet.textContent = "";
				const var_name = setting.var_css || `--${setting.id}`;
				stylesheet.textContent += `:root{${var_name}: ${value}${setting.unit || "px"}}`;
				if (setting.constant_css) {
					stylesheet.textContent += setting.constant_css;
				}
			}

			active_settings_state[setting.id] = value;

			if (setting.update_function) {
				execute_setting_script(setting, "update_function");
			}
		}

		apply_slider_update();
		return apply_slider_update;
	},

	["dropdown"]: async function (setting: any) {
		const stylesheet = create_stylesheet(setting.id);
		if (setting.setup_function) {
			execute_setting_script(setting, "setup_function");
		}

		async function apply_dropdown_update() {
			const value = await get_from_storage(setting.id);
			if (active_settings_state[setting.id] === value) return;

			execute_setting_script(setting, "disable_function");

			active_settings_state[setting.id] = value;
			const selected_option = setting.options[value];
			execute_setting_script(setting, "enable_function");

			stylesheet.textContent = "";
			if (setting.constant_css) {
				stylesheet.textContent += setting.constant_css;
			}
			if (selected_option?.enable_css) {
				stylesheet.textContent += selected_option.enable_css;
			}
		}

		apply_dropdown_update();
		return apply_dropdown_update;
	},

	["color"]: async function (setting: any) {
		const stylesheet = create_stylesheet(setting.id);

		if (setting.setup_function) {
			execute_setting_script(setting, "setup_function");
		}

		async function apply_color_update() {
			const value = await get_from_storage(setting.id);
			active_settings_state[setting.id] = value;

			if (stylesheet) {
				stylesheet.textContent = "";
				const var_name = setting.var_css || `--${setting.id}`;
				stylesheet.textContent += `:root{${var_name}: ${value}}`;
				stylesheet.textContent += setting.constant_css || ``;
			}

			if (setting.update_function) {
				execute_setting_script(setting, "update_function");
			}
		}

		apply_color_update();
		return apply_color_update;
	},

	["custom"]: async function (setting: any) {
		let stylesheet: HTMLElement;
		if (setting.constant_css) {
			stylesheet = create_stylesheet(setting.id);
		}

		if (setting.setup_function) {
			execute_setting_script(setting, "setup_function");
		}

		async function apply_custom_update() {
			const value = await get_from_storage(setting.id);
			active_settings_state[setting.id] = value;

			if (stylesheet) {
				if (typeof setting.constant_css === "function") {
					stylesheet.textContent = setting.constant_css(value) || ``;
				} else {
					stylesheet.textContent = setting.constant_css || ``;
				}
			}
		}

		apply_custom_update();
		return apply_custom_update;
	},

	["combine_settings"]: async function (setting: any) {
		const stylesheet = create_stylesheet(setting.id);

		async function apply_combined_update() {
			if (stylesheet && setting.update_function) {
				stylesheet.textContent = setting.update_function;
			}
		}

		apply_combined_update();
		return apply_combined_update;
	},
};

/**
 * Binds the appropriate update logic to a setting based on its type.
 */
export async function attach_behavior_to_setting(setting: Setting) {
	if (setting.id == null) return;

	const initializer = SETTING_TYPE_BEHAVIORS[setting.type];
	if (!initializer) return;

	const update_handler = await initializer(setting);
	setting_update_handlers[setting.id] = update_handler;

	return update_handler;
}

const update_throttle_state: Record<string, "Idle" | "Waiting" | "Processing"> = {};

/**
 * Triggers the update logic for a specific setting, with basic throttling.
 */
export async function trigger_setting_update(setting_id: string) {
	const state = update_throttle_state[setting_id] || "Idle";

	if (state === "Waiting") return;

	if (state === "Processing") {
		update_throttle_state[setting_id] = "Waiting";
		await wait_one_frame();
		return trigger_setting_update(setting_id);
	}

	update_throttle_state[setting_id] = "Processing";

	if (setting_update_handlers[setting_id]) {
		await setting_update_handlers[setting_id]();
	}

	const current_value = await get_from_storage(setting_id);

	// Execute registered listeners
	if (setting_update_listeners[setting_id]) {
		for (const listener of setting_update_listeners[setting_id]) {
			listener(current_value);
		}
	}

	logger.info("settings", "Setting updated:", setting_id, current_value);

	await wait_one_frame();
	update_throttle_state[setting_id] = "Idle";
}

/**
 * Registers a callback to be executed whenever a specific setting changes.
 */
export function register_setting_listener(setting_id: string, callback: (value: any) => void, run_immediately = false) {
	if (!setting_update_listeners[setting_id]) {
		setting_update_listeners[setting_id] = [];
	}
	setting_update_listeners[setting_id].push(callback);

	if (run_immediately) {
		if (!setting_initializers[setting_id]) {
			setting_initializers[setting_id] = [];
		}
		setting_initializers[setting_id].push(callback);
	}
}

/**
 * Removes a previously registered listener.
 */
export function unregister_setting_listener(setting_id: string, callback: Function) {
	if (!setting_update_listeners[setting_id]) return;

	setting_update_listeners[setting_id] = setting_update_listeners[setting_id].filter((l) => l !== callback);

	if (setting_update_listeners[setting_id].length === 0) {
		delete setting_update_listeners[setting_id];
	}
}

/**
 * Runs all initializers for a specific setting.
 */
export async function run_setting_initialization(setting_id: string) {
	if (setting_initializers[setting_id]) {
		const current_value = await get_from_storage(setting_id);
		for (const initializer of setting_initializers[setting_id]) {
			initializer(current_value);
		}
	}
}

/**
 * Runs initializers for all settings that have them.
 */
export async function initialize_all_active_settings() {
	for (const id in setting_initializers) {
		logger.info("settings", "Initializing setting:", id);
		run_setting_initialization(id);
	}
}
