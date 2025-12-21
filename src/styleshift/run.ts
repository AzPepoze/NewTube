import { create_error, create_notification } from "./build-in-functions/extension";
import {
	get_current_domain,
	get_current_url_parameters,
	get_document_body,
	rearrange_selector,
	sleep,
} from "./build-in-functions/normal";
import { run_text_script, update_styleshift_functions_list } from "./core/extension";
import { clear_unused_save, load, load_thisweb_save, save, save_all, update_save_default } from "./core/save";
import { run_all_setting_init, setup_setting_function } from "./settings/functions";
import { create_stylesheet_holder } from "./settings/style-sheet";
import { get_all_styleshift_items, get_all_styleshift_settings, update_styleshift_items } from "./settings/items";
import * as global from "./communication/extension";
import { update_all_ui } from "./ui/extension";
import { extension_settings_ui } from "./ui/extension-settings";
import { toggle_customize } from "./ui/highlight";

//-------------------------------------------------------
// Global Variables & Constants
//-------------------------------------------------------

export const ver = chrome.runtime.getManifest().version;
export let styleshift_ready = false;

export const is_firefox = navigator.userAgent.toLowerCase().includes("firefox");
// console.log("isFirefox", navigator.userAgent.toLowerCase(), isFirefox);

let is_in_iframe;
try {
	is_in_iframe = window.self !== window.top;
} catch (e: any) {
	is_in_iframe = true;
}

const default_yt_logo = `https://www.youtube.com/s/desktop/6588612c/img/favicon.ico`;
const default_nt_logo = `https://i.ibb.co/tD2VTyg/1705431438657.png`;

export const extension_location = chrome.runtime.getURL("").slice(0, -1);
export const extension_id = extension_location.slice(19, 0);

export let in_setting_page;
if (window.location.origin == extension_location) {
	in_setting_page = true;
} else {
	in_setting_page = false;
}
// console.log("In_Setting_Page", In_Setting_Page);

export let save_name;
if (in_setting_page) {
	const url_parameters = get_current_url_parameters();
	if (url_parameters.domain) {
		save_name = url_parameters.domain;
	} else {
		save_name = "youtube.com";
	}
} else {
	save_name = get_current_domain();
}

global; // This important don't delete

/*
-------------------------------------------------------
 Global Variables & Constants
-------------------------------------------------------
*/
export const styleshift_station: HTMLElement = document.createElement("div");
styleshift_station.className = "StyleShift-Station";
styleshift_station.style.display = "none";

/*
-------------------------------------------------------
 Core Functions
-------------------------------------------------------
*/
export function update_all() {
	update_styleshift_functions_list();
	update_styleshift_items();
	update_all_ui();
}

async function main_run() {
	// Append StyleShift Station to the body
	setTimeout(async () => {
		(await get_document_body()).append(styleshift_station);
	}, 1);

	// Inject build-in functions if not in the settings page
	if (!in_setting_page) {
		const build_in_functions = await (await fetch(chrome.runtime.getURL("build-in.js"))).text();
		run_text_script({
			text: build_in_functions,
			replace: false,
		});
	}

	//------------------------------------------
	// Initialization Steps
	//------------------------------------------
	await load_thisweb_save();

	// Test
	// saved_data["custom_styleshift_items"] = Test_editable_items;
	// console.log("Test", saved_data);
	// await save_all();

	await update_styleshift_functions_list();
	await create_stylesheet_holder();
	await update_styleshift_items();
	await update_save_default();
	// console.log("Test", get_all_styleshift_items());

	//------------------------------------------
	// Apply settings & save
	//------------------------------------------
	for (const this_setting of await get_all_styleshift_settings()) {
		if (this_setting.id == "Themes") {
			continue;
		}
		setup_setting_function(this_setting);
	}
	run_all_setting_init();
	await clear_unused_save();

	// ReArrange Selectors
	for (const this_category of get_all_styleshift_items()) {
		if (this_category.selector == null) continue;
		this_category.selector = rearrange_selector(this_category.selector);
	}
	await save_all();

	//------------------------------------------
	// settings Page Specific ui
	//------------------------------------------
	if (in_setting_page) {
		extension_settings_ui.create_ui();
	}

	styleshift_ready = true;
}

/*
-------------------------------------------------------
 Main Execution & Error Handling
-------------------------------------------------------
*/
try {
	main_run();
} catch (error) {
	create_error(error).then((notification) => {
		notification.set_title("StyleShift - Main run error");
	});
}

/*
-------------------------------------------------------
 Chrome Message Listener
-------------------------------------------------------
*/
chrome.runtime.onMessage.addListener(async function (message) {
	try {
		console.log("Message", message);
		if (message == "Developer") {
			await save("Developer_mode", !(await load("Developer_mode")));
			if (await load("Developer_mode")) {
				await create_notification({
					icon: "🔨",
					title: "Enabled Developer mode",
					timeout: 4000,
				});
			} else {
				await create_notification({
					icon: "✨",
					title: "Disabled Developer mode",
					timeout: 4000,
				});
			}
			update_all_ui();
		}

		//----------------------------------------------
		// Actions only outside settings page
		//----------------------------------------------
		if (in_setting_page) return;

		if (message == "Customize") {
			toggle_customize();
		}

		if (message == "Setting") {
			if (!styleshift_ready) {
				const loading_notification = await create_notification({
					icon: "⏳",
					title: "StyleShift is loading! please wait...",
					timeout: -1,
				});

				while (!styleshift_ready) {
					await sleep(100);
				}

				loading_notification.close();
			}

			extension_settings_ui.toggle();
		}
	} catch (error) {
		create_error(error);
	}
});
