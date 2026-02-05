import { create_styleshift_window } from "@ui/extension";
import { settings_ui } from "@ui/settings/setting-components";

export let config_window: Awaited<ReturnType<typeof create_styleshift_window>>;
let svelte_instance;
let current_content_function;

export async function create_config_ui(skip_animation = false) {
	config_window = await create_styleshift_window({ skip_animation });
	
	config_window.close.addEventListener(
		"click",
		function () {
			remove_config_ui();
		},
		{ once: true }
	);

	return config_window;
}

export async function show_config_ui(inner_content_function: Function) {
	if (!config_window) {
		await create_config_ui();
	}
	current_content_function = inner_content_function;
	recreate_config_ui();
}

export async function recreate_config_ui() {
	if (!config_window) return;

	if (svelte_instance) {
		// If we already have an instance, we might need to remount or update
		// For simplicity, we'll remount if content function changes
	}

	svelte_instance = settings_ui.config_window({
		innerContentFunction: current_content_function,
		onClose: () => remove_config_ui()
	}, config_window.window_element);
}

export function remove_config_ui(skip_animation = false) {
	if (config_window) {
		if (skip_animation) {
			config_window.bg_frame.remove();
		} else {
			config_window.close.click();
		}
		config_window = null;
		svelte_instance = null;
		current_content_function = null;
	}
}
