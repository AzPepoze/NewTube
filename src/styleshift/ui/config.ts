import { create_styleshift_window } from "@ui/extension";
import { settings_ui } from "@ui/settings/setting-components";
import { unmount } from "svelte";

export let config_window: Awaited<ReturnType<typeof create_styleshift_window>>;
let svelte_instance;
let current_content_function;

export async function create_config_ui(skip_animation = false) {
	config_window = await create_styleshift_window({ width: "60%", height: "85%", skip_animation });

	config_window.close_button.addEventListener(
		"click",
		function () {
			remove_config_ui();
		},
		{ once: true },
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
		unmount(svelte_instance);
	}

	svelte_instance = settings_ui.config_window(
		{
			innerContentFunction: current_content_function,
			onClose: () => remove_config_ui(),
		},
		config_window.window_element,
	);
}

export function remove_config_ui(skip_animation = false) {
	if (config_window) {
		const target_window = config_window;
		const target_instance = svelte_instance;

		// Clear state before acting to prevent recursion
		config_window = null;
		svelte_instance = null;
		current_content_function = null;

		if (target_instance) {
			unmount(target_instance);
		}

		if (skip_animation) {
			target_window.overlay_frame.remove();
		} else {
			target_window.close_button.click();
		}
	}
}
