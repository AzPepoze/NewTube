import { get_document_body, get_document_head, sleep } from "../build-in-functions/normal";
import { initialize_developer_environment, is_dev_modules_loaded } from "../core/runtime-controller";
import { get_root_value } from "../core/storage-manager";
import { remove_config_ui } from "./config";
import { editor_ui } from "./editor";
import { extension_settings_ui } from "./extension-settings";
import { settings_ui } from "./settings/setting-components";
import { apply_theme_to_element } from "./theme";
import { logger } from "../utils/logger";
import { unmount } from "svelte";

/**
 * Creates and appends the main StyleShift window to the document.
 */
export async function create_styleshift_window({ width = "30%", height = "80%", skip_animation = false }) {
	// Ensure developer tools are ready if mode is enabled
	if (await get_root_value("Developer_mode")) {
		await initialize_developer_environment();
	}

	logger.info("ui", "Initializing main window");

	await get_document_head();
	const overlay_frame = settings_ui["fill_screen"](false);

	const window_element = document.createElement("div");
	window_element.className = "STYLESHIFT-Main STYLESHIFT-Window";
	await apply_theme_to_element(window_element);

	window_element.style.pointerEvents = "all";
	window_element.style.width = width;
	window_element.style.height = height;

	if (!skip_animation) {
		trigger_window_show_animation(window_element);
	}

	overlay_frame.appendChild(window_element);

	const topbar = document.createElement("div");
	topbar.className = "STYLESHIFT-Topbar";
	window_element.append(topbar);

	const drag_handle = await settings_ui["drag"](window_element);
	drag_handle.style.width = "calc(100% - 32px)";
	topbar.append(drag_handle);

	const close_button = await settings_ui["close"]();
	topbar.append(close_button);

	const close_window_handler = async () => {
		await trigger_window_hide_animation(window_element);
		overlay_frame.remove();
	};

	close_button.addEventListener("click", close_window_handler, { once: true });

	requestAnimationFrame(async () => {
		(await get_document_body()).appendChild(overlay_frame);
	});

	return {
		overlay_frame,
		window_element,
		topbar,
		drag_handle,
		close_button,
		close_window_handler,
	};
}

export let global_notification_container: HTMLElement;

/**
 * Self-initializing notification layer.
 */
(async () => {
	await get_document_head();
	const notification_overlay = settings_ui["fill_screen"](false);
	notification_overlay.classList.add("STYLESHIFT-Main");
	await apply_theme_to_element(notification_overlay);

	setTimeout(async () => {
		(await get_document_body()).append(notification_overlay);
	}, 1);

	global_notification_container = document.createElement("div");
	global_notification_container.className = "STYLESHIFT-Notification-Container";
	notification_overlay.append(global_notification_container);
})();

export const DEFAULT_ANIMATION_DURATION_MS = 250;

/**
 * Plays a CSS animation on a target element and waits for it to complete.
 */
export async function play_ui_animation(target: HTMLElement, animation_name: string): Promise<void> {
	target.style.animation = `STYLESHIFT-${animation_name} ${DEFAULT_ANIMATION_DURATION_MS / 1000}s forwards`;
	await sleep(DEFAULT_ANIMATION_DURATION_MS);
}

export async function trigger_window_show_animation(target: HTMLElement): Promise<void> {
	await play_ui_animation(target, "Show-Pop-Animation");
}

export async function trigger_window_hide_animation(target: HTMLElement): Promise<void> {
	await play_ui_animation(target, "Hide-Pop-Animation");
}

/**
 * Displays a confirmation dialog to the user.
 */
export async function show_user_confirmation(
	message: string,
	title: string = "Confirm Action",
	options: {
		confirmLabel?: string;
		cancelLabel?: string;
		confirmColor?: string;
		cancelColor?: string;
	} = {},
): Promise<boolean> {
	return new Promise((resolve) => {
		const mount_point = document.createElement("div");
		document.body.appendChild(mount_point);

		const component = settings_ui.confirm(
			{
				title,
				message,
				buttons: [
					{
						label: options.confirmLabel || "Confirm",
						color: options.confirmColor || "#4caf50",
						onClick: () => handle_resolve(true),
					},
					{
						label: options.cancelLabel || "Cancel",
						color: options.cancelColor || "#f44336",
						onClick: () => handle_resolve(false),
					},
				],
				onClose: () => handle_resolve(false),
			},
			mount_point,
		);

		function handle_resolve(val: boolean) {
			resolve(val);
			setTimeout(() => {
				unmount(component);
				mount_point.remove();
			}, 400);
		}
	});
}

/**
 * Re-renders all visible UI components to reflect state changes.
 */
export async function update_all_ui_components(): Promise<void> {
	logger.info("ui", "Refreshing all UI components...");

	const is_dev_mode = await get_root_value("Developer_mode");

	if (is_dev_mode && !is_dev_modules_loaded) {
		logger.info("ui", "Initializing developer environment...");
		await initialize_developer_environment();
	}

	if (extension_settings_ui) extension_settings_ui.recreate_ui();
	if (editor_ui) editor_ui.recreate_ui();

	if (!is_dev_mode) {
		remove_config_ui();
	}
}
