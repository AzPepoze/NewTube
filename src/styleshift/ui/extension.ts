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
export async function create_styleshift_window({
	width = "50%",
	height = "80%",
	skip_animation = false,
	title = "StyleShift",
}) {
	// Ensure developer tools are ready if mode is enabled
	if (await get_root_value("Developer_mode")) {
		await initialize_developer_environment();
	}

	logger.info("ui", "Initializing main window");

	await get_document_head();
	const overlay_frame = settings_ui.fill_screen(false);
	overlay_frame.style.pointerEvents = "none"; // Let window handle events

	const mount_point = document.createElement("div");
	overlay_frame.appendChild(mount_point);

	let window_instance: any;

	const close_window_handler = async () => {
		if (window_instance) {
			await trigger_window_hide_animation(window_container);
			await sleep(300);
			unmount(window_instance);
		}
		overlay_frame.remove();
	};

	window_instance = settings_ui.render_window(
		{
			title,
			width,
			height,
			onClose: close_window_handler,
			children: (_target: HTMLElement) => {
				return "";
			},
		},
		mount_point,
	);

	const window_container = mount_point.querySelector(".STYLESHIFT-Window-Container") as HTMLElement;
	await apply_theme_to_element(window_container);
	const content_element = window_container.querySelector(".STYLESHIFT-Window-Content") as HTMLElement;
	const topbar = window_container.querySelector(".STYLESHIFT-Window-Topbar") as HTMLElement;
	const close_button = window_container.querySelector(".control-btn.close") as HTMLElement;

	requestAnimationFrame(async () => {
		(await get_document_body()).appendChild(overlay_frame);
		if (!skip_animation) {
			trigger_window_show_animation(window_container);
		}
	});

	return {
		overlay_frame,
		window_element: window_container,
		content_element,
		topbar,
		drag_handle: topbar,
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
	const notification_overlay = settings_ui.fill_screen(false);
	notification_overlay.classList.add("STYLESHIFT-Main");
	await apply_theme_to_element(notification_overlay);

	setTimeout(async () => {
		(await get_document_body()).append(notification_overlay);
	}, 1);

	global_notification_container = document.createElement("div");
	global_notification_container.className = "STYLESHIFT-Notification-Container";
	notification_overlay.append(global_notification_container);

	const taskbar_mount_point = document.createElement("div");
	notification_overlay.append(taskbar_mount_point);
	settings_ui.render_taskbar(taskbar_mount_point);
})();

export const DEFAULT_ANIMATION_DURATION_MS = 250;

/**
 * Plays a CSS animation on a target element and waits for it to complete.
 */
export async function play_ui_animation(target: HTMLElement, animation_name: string): Promise<void> {
	if (animation_name.includes("Show")) {
		target.style.opacity = "0";
		target.style.transform = "scale(0.95)";
		await sleep(10); // Give browser time to register initial state
	}

	target.style.animation = `STYLESHIFT-${animation_name} ${DEFAULT_ANIMATION_DURATION_MS / 1000}s forwards`;

	await sleep(DEFAULT_ANIMATION_DURATION_MS);

	// Cleanup to let transitions take over
	if (animation_name.includes("Show")) {
		target.style.opacity = "1";
		target.style.transform = "scale(1)";
		target.style.animation = "";
	}
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
		align?: "left" | "center" | "right";
	} = {},
): Promise<boolean> {
	return new Promise((resolve) => {
		const mount_point = document.createElement("div");
		document.body.appendChild(mount_point);

		const component = settings_ui.confirm(
			{
				title,
				message,
				align: options.align || "center",
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
