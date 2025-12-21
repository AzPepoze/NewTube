import { create_error, create_notification } from "../build-in-functions/extension";
import { sleep } from "../build-in-functions/normal";
import { update_all, in_setting_page, is_firefox } from "../run";
import { Color_obj } from "../types/store";
import { save_all } from "./save";

export async function save_and_update_all() {
	await save_all();
	update_all();
}

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

	console.log("Avaliable StyleShift functions", Get_functions_list);

	window.dispatchEvent(
		new CustomEvent("Sent_styleshift_functions_list", {
			detail: Get_functions_list,
		})
	);
}

run_styleshift_functions_list();`;

export async function update_styleshift_functions_list() {
	if (in_setting_page) {
		while (window["StyleShift"] == null) {
			await sleep(1);
		}

		for (const [key, value] of Object.entries(window["StyleShift"])) {
			styleshift_functions_list[key] = Object.keys(value);
		}
		return;
	}

	return new Promise((resolve, reject) => {
		window.addEventListener(
			"Sent_styleshift_functions_list",
			function (event) {
				console.log("Recived", event);
				//@ts-ignore
				styleshift_functions_list = event.detail;
				resolve(true);
			},
			{ once: true }
		);

		run_text_script({
			text: get_function_list_script,
			replace: false,
		});
	});
}

export async function get_global_data(mode: "Build-in" | "custom", function_name) {
	if (
		(window["StyleShift"] && window["StyleShift"][mode] == null) ||
		window["StyleShift"][mode][function_name] == null
	) {
		await sleep(0);
		return await get_global_data(mode, function_name);
	} else {
		console.log(window["StyleShift"][mode], window["StyleShift"][mode][function_name]);
		return window["StyleShift"][mode][function_name];
	}
}

export function is_safe_code(code: string, code_name: string) {
	if (!code) return false;
	const lowered_case_code = code.toLowerCase();

	const dangerous_patterns = [
		/eval/i,
		/new function/i,
		/(?<!@)\bimport\b/i,
		/fetch/i,
		/xmlhttprequest/i,
		/xhr/i,
		/<\/?script>/i,
		/document\.createElement\s*\(\s*['"]script['"]\s*\)/i,
		/\.write\s*\(/i,
		/\.execcommand\s*\(/i,
		/\.cookie\s*=/i,
		/localstorage/i,
		/sessionstorage/i,
		/indexeddb/i,
		/opendatabase/i,
		/postmessage/i,
		/sendbeacon/i,
		/importscripts/i,
		/createobjecturl/i,
		/revokeobjecturl/i,
		/webkitrequestfilesystem/i,
		/webkitresolvelocalfilesystemurl/i,
		/showopenfilepicker/i,
		/showsavefilepicker/i,
		/showdirectorypicker/i,
		/new\s+worker\s*\(/i,
		/new\s+sharedworker\s*\(/i,
		/new\s+blob\s*\(/i,
		/url\.createobjecturl\s*\(/i,
		/\.__proto__\s*=/i,
		/\.constructor\s*=/i,
		/javascript:/i,
		/reflect\.(apply|construct|defineproperty|get|set|deleteproperty|ownkeys)/i,
		/globalthis\./i,
		/window\[(["'`"]).*\1\]/i,
		/new\s+eventsource\s*\(/i,
		/webassembly\./i,
		/\.contenteditable\s*=/i,
		/\?callback=/i,
		/new\s+proxy\s*\(/i,
		/function\.prototype\.tostring/i,
		/intl\./i,
		/symbol\./i,
	];

	for (const pattern of dangerous_patterns) {
		if (pattern.test(lowered_case_code)) {
			const match = lowered_case_code.match(pattern);
			if (match) {
				const match_index = match.index;

				const before_match = lowered_case_code.slice(0, match_index);
				const line_number = before_match.split("\n").length;
				const char_position = match_index - before_match.lastIndexOf("\n");

				const code_lines = lowered_case_code.split("\n");
				const error_line = code_lines[line_number - 1];

				const is_comment = error_line.replaceAll(" ", "").replaceAll("\t", "").startsWith("//");
				if (is_comment) {
					continue;
				}

				const start_context = Math.max(0, char_position - 15);
				const end_context = Math.min(error_line.length, char_position + match[0].length + 15);
				const context_snippet = error_line.slice(start_context, end_context);

				const highlighted_error = context_snippet.replace(
					match[0],
					`<span style="color: red; text-decoration: underline;">${match[0]}</span>`
				);

				create_notification({
					icon: "🚫",
					title: "StyleShift - Error",
					content: `<b>"${match[0]}"</b> is not allowed.<br>Found at line: <b>${line_number}</b>, character: <b>${char_position}</b><br>From: <b>${code_name}</b><br><br><pre>${highlighted_error}</pre>`,
					timeout: 0,
				});

				console.warn(match, pattern);
			}
			return false;
		}
	}

	return true;
}

export async function run_text_script({
	text = null as string | Function,
	replace = true,
	code_name = "StyleShift",
	args = "",
}) {
	console.log("Trying to run script");
	console.log(text);

	if (typeof text == "function") {
		text();
	} else {
		if (text != null && text != "") {
			//--------------------------------

			if (replace) {
				if (is_safe_code(text, code_name)) {
					for (const [function_mode, functions_list] of Object.entries(styleshift_functions_list) as [
						string,
						Array<string>
					][]) {
						for (const function_name of functions_list) {
							text = text.replace(
								new RegExp(`\\b${function_name}\\b`, "g"),
								`window["StyleShift"]["${function_mode}"]["${function_name}"]`
							);
						}
					}
				} else {
					return;
				}
			}

			//--------------------------------

			if (!in_setting_page) {
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

export let monaco: typeof import("monaco-editor");
export let monaco_themes;
export let jszip: typeof import("jszip");

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
		loading_ui.set_content("Preparing : Jzip (Export theme as zip)");
		jszip = (await import(chrome.runtime.getURL("modules/jszip.js"))).default.default;

		console.log("jszip:", jszip);

		if (!is_firefox || in_setting_page) {
			loading_ui.set_content("Preparing : monaco editor (Code editor)");

			const monaco_module = await import(chrome.runtime.getURL("modules/monaco.js"));

			console.log(monaco_module);

			monaco = monaco_module.monaco;
			monaco_themes = monaco_module.monaco_themes;

			for (const [theme_name, theme_content] of Object.entries(monaco_themes) as [string, any][]) {
				if (theme_name == "themelist") continue;
				monaco.editor.defineTheme(theme_name.replace(/[^a-zA-Z0-9]|_|-/g, ""), theme_content);
			}

			monaco.editor.setTheme("Dracula");

			loading_ui.set_icon("✅");
			loading_ui.set_title("StyleShift - loaded Developer Modules");
			loading_ui.set_content("");
		} else {
			loading_ui.set_icon("⚠️");
			loading_ui.set_title("StyleShift - Can't monaco editor (Code editor)");
			loading_ui.set_content(
				"If you want to use code editor, please consider enter setting page.\n(Firefox security issue!)"
			);
		}

		setTimeout(() => {
			loading_ui.close();
		}, 4000);

		loaded_developer_modules = true;
	} catch (error) {
		console.log(error);
		loading_ui.close();
		(await create_error(error)).set_title("StyleShift - Error loading developer modules");
	}
}

//----------------------------------------------

export function color_obj_to_hex({ hex, alpha }: Color_obj): string {
	const processed_alpha = Math.round((alpha / 100) * 255)
		.toString(16)
		.padStart(2, "0");
	return `${hex}${processed_alpha}`;
}

export function hex_to_color_obj(hex: string): { hex: string; alpha: number } {
	if (typeof hex !== "string") {
		console.warn("hex_to_color_obj received non-string hex value:", hex);
		return { hex: "#000000", alpha: 100 };
	}
	const clean_hex = hex.startsWith("#") ? hex.slice(1) : hex;
	const rgb_hex = clean_hex.length === 8 ? clean_hex.slice(0, 6) : clean_hex;
	const alpha_hex = clean_hex.length === 8 ? clean_hex.slice(6) : "FF";

	return {
		hex: `#${rgb_hex}`,
		alpha: Math.round((parseInt(alpha_hex, 16) / 255) * 100),
	};
}
