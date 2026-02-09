import { create_error, create_notification } from "./build-in-functions/extension";
import { logger } from "./utils/logger";
import {
	get_current_domain,
	get_current_url_parameters,
	get_document_body,
	get_document_head,
	rearrange_selector,
	sleep,
} from "./build-in-functions/normal";
import { execute_script_string, synchronize_available_functions } from "./core/runtime-controller";
import {
	initialize_storage_connection,
	get_root_value,
	save_root_value,
	persist_cached_data_to_storage,
} from "./core/storage-manager";
import {
	perform_storage_garbage_collection,
	populate_missing_default_settings,
	initialize_default_custom_items,
} from "./core/storage-maintenance";
import {
	register_setting_listener,
	initialize_all_active_settings,
	attach_behavior_to_setting,
} from "./settings/functions";
import { create_stylesheet_holder } from "./settings/style-sheet";
import { get_all_styleshift_items, get_all_styleshift_settings, update_styleshift_items } from "./settings/items";
import "./communication/extension";
import { update_all_ui_components } from "./ui/extension";
import { sync_all_themes } from "./ui/theme";
import { extension_settings_ui } from "./ui/extension-settings";
import { toggle_customize } from "./ui/highlight";

//-------------------------------------------------------
// Configuration & State
//-------------------------------------------------------

export const EXTENSION_VERSION = chrome.runtime.getManifest().version;
export let is_extension_ready = false;

export const IS_FIREFOX = navigator.userAgent.toLowerCase().includes("firefox");
export const EXTENSION_BASE_URL = chrome.runtime.getURL("").slice(0, -1);
export const IS_IN_EXTENSION_SETTINGS_PAGE = window.location.origin === EXTENSION_BASE_URL;

// Identify the current domain context for storage
export let current_context_domain: string;
if (IS_IN_EXTENSION_SETTINGS_PAGE) {
	const params = get_current_url_parameters();
	current_context_domain = params.domain || "youtube.com";
} else {
	current_context_domain = get_current_domain();
}

// Global container for StyleShift elements that shouldn't be directly in the body
export const styleshift_container: HTMLElement = document.createElement("div");
styleshift_container.className = "StyleShift-Station";
styleshift_container.style.display = "none";

/*
-------------------------------------------------------
 Core Lifecycle Functions
-------------------------------------------------------
*/

/**
 * Refreshes the internal state and updates all UI components.
 */
export function refresh_extension_state(): void {
	logger.info("lifecycle", "Refreshing extension state...");
	synchronize_available_functions();
	update_styleshift_items();
	update_all_ui_components();
}

/**
 * Main entry point for the extension logic.
 */
async function bootstrap_extension(): Promise<void> {
	await get_document_head();

	// Inject StyleShift container
	setTimeout(async () => {
		(await get_document_body()).append(styleshift_container);
	}, 1);

	// Inject built-in functions into the page context
	if (!IS_IN_EXTENSION_SETTINGS_PAGE) {
		const builtin_code = await (await fetch(chrome.runtime.getURL("build-in.js"))).text();
		execute_script_string({
			script_content: builtin_code,
			should_sanitize: false,
		});
	}

	// Initialize storage and sync functions
	await initialize_storage_connection();
	await initialize_default_custom_items();
	await synchronize_available_functions();
	await create_stylesheet_holder();
	await update_styleshift_items();
	await populate_missing_default_settings();

	// Set up global theme listeners
	register_setting_listener("App_Light_Theme", sync_all_themes);
	register_setting_listener("Setting_BG_Transparent", sync_all_themes);

	// Initialize individual setting behaviors
	const all_settings = await get_all_styleshift_settings();
	for (const setting of all_settings) {
		if (setting.id === "Themes") continue;
		attach_behavior_to_setting(setting);
	}

	initialize_all_active_settings();
	await perform_storage_garbage_collection();

	// Normalize CSS selectors for all items
	const items = get_all_styleshift_items();
	for (const category of items) {
		if (category.selector) {
			category.selector = rearrange_selector(category.selector);
		}
	}

	await persist_cached_data_to_storage();

	if (IS_IN_EXTENSION_SETTINGS_PAGE) {
		extension_settings_ui.create_ui();
	}

	is_extension_ready = true;
	logger.info("lifecycle", "StyleShift bootstrap complete.");
}

/*
-------------------------------------------------------
 Execution & Event Handling
-------------------------------------------------------
*/

try {
	bootstrap_extension();
} catch (error) {
	create_error(error).then((notification) => {
		notification.set_title("StyleShift - Bootstrap Failure");
	});
}

/**
 * Handle messages from the background script or popup.
 */
chrome.runtime.onMessage.addListener(async (message) => {
	try {
		logger.info("lifecycle", "Incoming message:", message);

		if (message === "Developer") {
			const is_dev = await get_root_value("Developer_mode");
			await save_root_value("Developer_mode", !is_dev);

			await create_notification({
				icon: !is_dev ? "🔨" : "✨",
				title: !is_dev ? "Developer Mode Enabled" : "Developer Mode Disabled",
				timeout: 3000,
			});

			update_all_ui_components();
		}

		if (IS_IN_EXTENSION_SETTINGS_PAGE) return;

		if (message === "Customize") {
			toggle_customize();
		}

		if (message === "Setting") {
			if (!is_extension_ready) {
				const wait_notification = await create_notification({
					icon: "⏳",
					title: "StyleShift is initializing...",
					timeout: -1,
				});

				while (!is_extension_ready) {
					await sleep(100);
				}
				wait_notification.close();
			}

			extension_settings_ui.toggle();
		}
	} catch (error) {
		create_error(error);
	}
});
