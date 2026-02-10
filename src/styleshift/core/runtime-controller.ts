import { create_notification } from "../build-in-functions/extension";
import { sleep } from "../build-in-functions/normal";
import { refresh_extension_state, IS_IN_EXTENSION_SETTINGS_PAGE } from "../run";
import { get_custom_items } from "../settings/items";
import { persist_cached_data_to_storage, save_to_storage } from "./storage-manager";
import { is_safe_code } from "../utils/security";
import { logger } from "../utils/logger";

/**
 * Persists all cached data and triggers a global UI/state refresh.
 */
export async function persist_and_refresh_all(): Promise<void> {
	logger.info("STORAGE", "Persisting structure and refreshing all...");
	await persist_items();
	refresh_extension_state();
}

/**
 * Persists custom items and cached data to storage without a full UI refresh.
 */
export async function persist_items(): Promise<void> {
	const custom_items = get_custom_items();
	if (custom_items && custom_items.length > 0) {
		await save_to_storage("custom_styleshift_items", custom_items, true);
	}
	await persist_cached_data_to_storage();
}

let active_styleshift_functions: Record<string, string[]> = {};

const FUNCTION_DISCOVERY_SCRIPT = `
(function discover_functions(){
	if(window["StyleShift"] == null) {
		setTimeout(discover_functions, 1);
		return;
	}

	let registry = {};
	for (const [scope, methods] of Object.entries(window["StyleShift"])) {
		registry[scope] = Object.keys(methods);
	}

	window["StyleShift"].logger.info("Function Discovery Complete", registry);

	window.dispatchEvent(
		new CustomEvent("StyleShift:FunctionsDiscovered", {
			detail: registry,
		})
	);
})();`;

/**
 * Synchronizes the list of available StyleShift functions from the page context.
 */
export async function synchronize_available_functions(): Promise<void> {
	if (IS_IN_EXTENSION_SETTINGS_PAGE) {
		while (window["StyleShift"] == null) {
			await sleep(1);
		}

		for (const [scope, methods] of Object.entries(window["StyleShift"])) {
			active_styleshift_functions[scope] = Object.keys(methods as object);
		}
		return;
	}

	return new Promise((resolve) => {
		const listener = ((event: CustomEvent) => {
			logger.info("runtime", "Function registry received:", event.detail);
			active_styleshift_functions = event.detail;
			resolve();
		}) as EventListener;

		window.addEventListener("StyleShift:FunctionsDiscovered", listener, { once: true });

		execute_script_string({
			script_content: FUNCTION_DISCOVERY_SCRIPT,
			should_sanitize: false,
		});
	});
}

/**
 * Retrieves a specific function from the StyleShift global object in the page context.
 */
export async function fetch_global_function(scope: "build-in" | "custom", function_name: string): Promise<any> {
	if (!window["StyleShift"] || !window["StyleShift"][scope] || !window["StyleShift"][scope][function_name]) {
		await sleep(10);
		return await fetch_global_function(scope, function_name);
	}
	return window["StyleShift"][scope][function_name];
}

interface ExecutionOptions {
	script_content: string | Function;
	should_sanitize?: boolean;
	source_identifier?: string;
	execution_arguments?: string;
}

/**
 * Executes a script in the page context, optionally sanitizing it.
 */
export async function execute_script_string({
	script_content,
	should_sanitize = true,
	source_identifier = "StyleShift",
	execution_arguments = "",
}: ExecutionOptions): Promise<void> {
	if (typeof script_content === "function") {
		script_content();
		return;
	}

	if (!script_content) return;

	let final_script = script_content;

	if (should_sanitize) {
		if (is_safe_code(final_script, source_identifier)) {
			// Replace shorthand function calls with full global paths
			for (const [scope, methods] of Object.entries(active_styleshift_functions)) {
				for (const method_name of methods) {
					const pattern = new RegExp(`\\b${method_name}\\b`, "g");
					final_script = final_script.replace(
						pattern,
						`window["StyleShift"]["${scope}"]["${method_name}"]`,
					);
				}
			}
		} else {
			logger.warn("runtime", "Script blocked by security policy:", source_identifier);
			return;
		}
	}

	if (!IS_IN_EXTENSION_SETTINGS_PAGE) {
		chrome.runtime.sendMessage({
			Command: "runScript",
			Script: final_script,
			args: execution_arguments,
		});
	}
}

/**
 * Executes a script associated with a specific setting.
 */
export function execute_setting_script(setting_object: any, function_property: string = "script"): void {
	execute_script_string({
		script_content: setting_object[function_property],
		source_identifier: `${setting_object.id} : ${function_property}`,
		execution_arguments: JSON.stringify({ setting_id: setting_object.id }),
	});
}

export let is_dev_modules_loaded = false;
export let has_attempted_dev_module_load = false;
export let jszip_instance: any;
export let codemirror_instance: any;
export const global_metadata_cache: any[] = [];

/**
 * Lazy-loads heavy developer modules like CodeMirror and JSZip.
 */
export async function initialize_developer_environment(): Promise<void> {
	if (has_attempted_dev_module_load || is_dev_modules_loaded) return;

	has_attempted_dev_module_load = true;

	const loader_ui = await create_notification({
		icon: "🔃",
		title: "StyleShift - Loading Developer Modules",
		content: "Preparing environment...",
		timeout: -1,
	});

	try {
		logger.info("runtime", "Loading developer environment...");
		loader_ui.set_content("Fetching Metadata...");
		const metadata_url = chrome.runtime.getURL("types/StyleShift-Metadata.json");
		logger.debug("runtime", "Fetching metadata from:", metadata_url);
		
		const metadata_response = await fetch(metadata_url);
		const metadata_data = await metadata_response.json();
		global_metadata_cache.length = 0;
		global_metadata_cache.push(...metadata_data);

		loader_ui.set_content("Loading JSZip...");
		const jszip_url = chrome.runtime.getURL("modules/jszip.js");
		logger.debug("runtime", "Importing JSZip from:", jszip_url);
		
		const jszip_module = await import(jszip_url);
		jszip_instance = jszip_module.default.default || jszip_module.default;

		loader_ui.set_content("Loading CodeMirror...");
		const codemirror_url = chrome.runtime.getURL("modules/codemirror.js");
		logger.debug("runtime", "Importing CodeMirror from:", codemirror_url);
		
		const codemirror_module = await import(codemirror_url);
		codemirror_instance = codemirror_module.default.default || codemirror_module.default;

		logger.info("runtime", "Developer environment loaded successfully.");
		loader_ui.set_icon("✅");
		loader_ui.set_title("Developer Environment Ready");
		loader_ui.set_content("");

		setTimeout(() => loader_ui.close(), 2000);
		is_dev_modules_loaded = true;
	} catch (error) {
		const error_name = (error as any)?.name;
		const is_abort = error_name === "AbortError" || error_name === "NS_ERROR_ABORT";
		
		logger.error("runtime", "Failed to load developer modules:", error);

		loader_ui.set_icon("⚠️");
		if (is_abort) {
			loader_ui.set_title("Load Aborted");
			loader_ui.set_content("The operation was aborted by the browser. (This often happens if the page is navigated or reloaded during loading)");
		} else {
			loader_ui.set_title("Developer Module Error");
			const message = error instanceof Error ? error.message : String(error);
			loader_ui.set_content(`${message}\n(Check console for details)`);
		}
		
		setTimeout(() => loader_ui.close(), 5000);
		has_attempted_dev_module_load = false;
	}
}
