import { create_notification } from "../build-in-functions/extension";
import { sleep } from "../build-in-functions/normal";
import { logger } from "../build-in-functions/logger";
import { is_safe_code } from "../utils/security";
import { IS_IN_EXTENSION_SETTINGS_PAGE } from "../run";

let styleshift_functions_list = {};

const get_function_list_script = `
function run_styleshift_functions_list(){

	if(window["StyleShift"] == null) {
		setTimeout(run_styleshift_functions_list, 1);
		return;
	}

	let Get_functions_list = {};

	for (const [key, value] of Object.entries(window["StyleShift"])) {
		Get_functions_list[key] = Object.keys(value);
	}

	window["StyleShift"].logger.info("Avaliable StyleShift functions", Get_functions_list);

	window.dispatchEvent(
		new CustomEvent("Sent_styleshift_functions_list", {
			detail: Get_functions_list,
		})
	);
}

run_styleshift_functions_list();`;

export async function update_styleshift_functions_list() {
	if (IS_IN_EXTENSION_SETTINGS_PAGE) {
		while (window["StyleShift"] == null) {
			await sleep(1);
		}

		for (const [key, value] of Object.entries(window["StyleShift"])) {
			styleshift_functions_list[key] = Object.keys(value);
		}
		return;
	}

	return new Promise((resolve, _reject) => {
		window.addEventListener(
			"Sent_styleshift_functions_list",
			function (event) {
				logger.info("extension", "Recived", event);
				//@ts-ignore
				styleshift_functions_list = event.detail;
				resolve(true);
			},
			{ once: true },
		);

		run_text_script({
			text: get_function_list_script,
			replace: false,
		});
	});
}

export async function get_global_data(mode: "build-in" | "custom", function_name) {
	if (
		(window["StyleShift"] && window["StyleShift"][mode] == null) ||
		window["StyleShift"][mode][function_name] == null
	) {
		await sleep(0);
		return await get_global_data(mode, function_name);
	} else {
		logger.info("extension", window["StyleShift"][mode], window["StyleShift"][mode][function_name]);
		return window["StyleShift"][mode][function_name];
	}
}

export async function run_text_script({
	text = null as string | Function,
	replace = true,
	code_name = "StyleShift",
	args = "",
}) {
	logger.info("extension", "Trying to run script");
	logger.info("extension", text);

	if (typeof text == "function") {
		text();
	} else {
		if (text != null && text != "") {
			//--------------------------------

			if (replace) {
				if (is_safe_code(text, code_name)) {
					for (const [function_mode, functions_list] of Object.entries(styleshift_functions_list) as [
						string,
						Array<string>,
					][]) {
						for (const function_name of functions_list) {
							text = text.replace(
								new RegExp(`\\b${function_name}\\b`, "g"),
								`window["StyleShift"]["${function_mode}"]["${function_name}"]`,
							);
						}
					}
				} else {
					return;
				}
			}

			//--------------------------------

			if (!IS_IN_EXTENSION_SETTINGS_PAGE) {
				chrome.runtime.sendMessage({
					Command: "runScript",
					Script: text,
					args: args,
				});
			}
		}
	}
}

export function run_text_script_from_setting(this_setting, function_name: string = "script") {
	run_text_script({
		text: this_setting[function_name],
		code_name: `${this_setting.id} : ${function_name}`,
		args: JSON.stringify({ setting_id: this_setting.id }),
	});
}

export let loaded_developer_modules = false;
export let try_loaded_developer_modules = false;

export let jszip: any;
export let codemirror: any;

export const global_functions_metadata: any[] = [];

export async function load_developer_modules() {
	if (try_loaded_developer_modules || loaded_developer_modules) {
		return;
	}

	try_loaded_developer_modules = true;

	const loading_ui = await create_notification({
		icon: "🔃",
		title: "StyleShift - loading Developer Modules",
		content: "loading...",
		timeout: -1,
	});

	try {
		loading_ui.set_content("Preparing : Metadata (Code Autocomplete)");
		const metadata_res = await fetch(chrome.runtime.getURL("types/StyleShift-Metadata.json"));
		const metadata_data = await metadata_res.json();
		global_functions_metadata.length = 0;
		global_functions_metadata.push(...metadata_data);

		loading_ui.set_content("Preparing : Jzip (Export theme as zip)");
		const jszip_module = await import(chrome.runtime.getURL("modules/jszip.js"));
		jszip = jszip_module.default.default || jszip_module.default;

		loading_ui.set_content("Preparing : Codemirror (Code Editor)");
		const codemirror_module = await import(chrome.runtime.getURL("modules/codemirror.js"));
		codemirror = codemirror_module.default.default || codemirror_module.default;

		logger.info("extension", "jszip:", jszip);
		logger.info("extension", "codemirror:", codemirror);

		loading_ui.set_icon("✅");
		loading_ui.set_title("StyleShift - loaded Developer Modules");
		loading_ui.set_content("");

		setTimeout(() => {
			loading_ui.close();
		}, 4000);
		loaded_developer_modules = true;
	} catch (error) {
		logger.error("extension", error);
		loading_ui.set_icon("⚠️");
		loading_ui.set_title("StyleShift - Error loading Developer Modules");
		loading_ui.set_content((error as Error).message);
		setTimeout(() => {
			loading_ui.close();
		}, 4000);
		loaded_developer_modules = true; // Mark as loaded even if it failed
	}
}
