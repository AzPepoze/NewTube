import { create_styleshift_window } from "./extension";

export let config_window: Awaited<ReturnType<typeof create_styleshift_window>>;
let scrollable: HTMLElement;
let current_content_function;

export async function create_config_ui(skip_animation = false) {
	config_window = await create_styleshift_window({ skip_animation });
	scrollable = document.createElement("div");
	scrollable.className = "STYLESHIFT-Scrollable";
	config_window.window_element.append(scrollable);
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

	scrollable.innerHTML = "";
	current_content_function(scrollable);
}

export function remove_config_ui(skip_animation = false) {
	if (config_window) {
		if (skip_animation) {
			config_window.bg_frame.remove();
		} else {
			config_window.close.click();
		}
		config_window = null;
		current_content_function = null;
	}
}
