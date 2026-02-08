import { get_document_body, get_document_head, sleep } from "../build-in-functions/normal";
import { load_developer_modules, loaded_developer_modules } from "../core/extension";
import { load } from "../core/save";
import { remove_config_ui, recreate_config_ui } from "./config";
import { editor_ui } from "./editor";
import { extension_settings_ui } from "./extension-settings";
import { settings_ui } from "./settings/setting-components";
import { apply_theme_to_element } from "./theme";
import { logger } from "../build-in-functions/logger";

//---------------------------------

export async function create_styleshift_window({ width = "30%", height = "80%", skip_animation = false }) {
	if (await load("Developer_mode")) {
		await load_developer_modules();
	}

	logger.info("ui/extension", "Setting up");

	await get_document_head();
	const bg_frame = settings_ui["fill_screen"](false);

	const window_element = document.createElement("div");
	window_element.className = "STYLESHIFT-Main STYLESHIFT-Window";
	await apply_theme_to_element(window_element);
	window_element.style.pointerEvents = "all";
	window_element.style.width = width;
	window_element.style.height = height;

	if (!skip_animation) {
		show_window_animation(window_element);
	}

	bg_frame.appendChild(window_element);

	const topbar = document.createElement("div");
	topbar.className = "STYLESHIFT-Topbar";
	window_element.append(topbar);

	const drag_top = await settings_ui["drag"](window_element);
	drag_top.style.width = "calc(100% - 5px - 27px)";
	topbar.append(drag_top);

	const close = await settings_ui["close"]();
	topbar.append(close);

	const run_close = async function () {
		await hide_window_animation(window_element);
		bg_frame.remove();
	};

	close.addEventListener("click", run_close, { once: true });

	requestAnimationFrame(async () => {
		(await get_document_body()).appendChild(bg_frame);
	});

	return {
		bg_frame,
		window_element,
		topbar,
		drag_top,
		close,
		run_close,
	};
}

export let notification_container;

(async () => {
	await get_document_head();
	const notification_bg = settings_ui["fill_screen"](false);
	notification_bg.classList.add("STYLESHIFT-Main");
	await apply_theme_to_element(notification_bg);
	setTimeout(async () => {
		(await get_document_body()).append(notification_bg);
	}, 1);

	notification_container = document.createElement("div");
	notification_container.className = "STYLESHIFT-Notification-Container";
	notification_bg.append(notification_container);
})();

export const animation_time = 0.25;

export async function run_animation(target: HTMLDivElement, animation_name: string) {
	target.style.animation = `STYLESHIFT-${animation_name} ${animation_time}s forwards`;
	await sleep(animation_time * 1000);
}

export async function show_window_animation(target: HTMLDivElement) {
	await run_animation(target, "Show-Pop-Animation");
}

export async function hide_window_animation(target: HTMLDivElement) {
	await run_animation(target, "Hide-Pop-Animation");
}

import { unmount } from "svelte";

//---------------------------------

export async function show_confirm(ask: string, title: string = "Confirm Action") {
	return new Promise((resolve) => {
		const target = document.createElement("div");
		document.body.appendChild(target);

		const component = settings_ui.confirm(
			{
				title: title,
				message: ask,
				onConfirm: () => {
					setTimeout(() => {
						unmount(component);
						target.remove();
					}, 300);
					resolve(true);
				},
				onCancel: () => {
					setTimeout(() => {
						unmount(component);
						target.remove();
					}, 300);
					resolve(false);
				},
			},
			target,
		);
	});
}

//---------------------------------

export async function update_all_ui() {
	logger.info("ui/extension", "Updating all UI...");
	if ((await load("Developer_mode")) && !loaded_developer_modules) {
		logger.info("ui/extension", "Loading developer modules...");
		await load_developer_modules();
	}

	logger.info("ui/extension", "Recreating UI for extension and editor...");
	extension_settings_ui.recreate_ui();
	editor_ui.recreate_ui();
	if (!(await load("Developer_mode"))) {
		logger.info("ui/extension", "Removing config UI...");
		remove_config_ui();
	} else {
		logger.info("ui/extension", "Recreating config UI...");
		recreate_config_ui();
	}
}
