import { create_error } from "../build-in-functions/extension";
import { sleep } from "../build-in-functions/normal";
import { save_name } from "../run";
import { get_settings_list, update_styleshift_items } from "../settings/items";
import { show_confirm } from "../ui/extension";

//save
export let saved_data = {};
let loaded = false;

export const save_external = [
	"current_settings",
	"default_styleshift_items",
	"custom_styleshift_items",
	"Themes",
	"Enabled_Extension",
	"Realtime_Extension",
	"Developer_mode",
];

export const styleshift_allowed_keys = ["current_settings", "custom_styleshift_items"];

export async function load_thisweb_save() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, function (saved) {
			console.log("ALL_SAVED", saved);
		});

		console.log("loading", save_name);

		chrome.storage.local.get(save_name, function (saved: object) {
			if (saved[save_name]) {
				try {
					saved_data = saved[save_name];
					console.log("loaded", save_name, JSON.stringify(saved_data));
				} catch {
					create_error(`Can't load Data : <b>${save_name}</b>`);
					saved_data = {};
				}
			} else {
				saved_data = {};
			}
			loaded = true;
			resolve(true);
		});
	});
}

export async function save(name, value, pre_save = false) {
	if (!loaded) {
		await sleep(100);
		return save(name, value);
	}
	saved_data[name] = value;
	console.log("save", name, value);
	if (!pre_save) {
		return await save_all();
	}
	return true;
}

export async function save_setting(name, value, pre_save = false) {
	if (saved_data["current_settings"] == null) {
		saved_data["current_settings"] = {};
	}
	saved_data["current_settings"][name] = value;
	console.log("save_setting", name, value);
	if (!pre_save) {
		return await save_all();
	}
	return true;
}

export async function save_any(name, value, pre_save = false) {
	if (save_external.includes(name)) {
		return await save(name, value, pre_save);
	} else {
		return await save_setting(name, value, pre_save);
	}
}

export async function save_all() {
	console.log("Saving", save_name, saved_data);
	await chrome.storage.local.set({ [save_name]: saved_data });
	console.log("saved", save_name, saved_data);
	return true;
}

export async function load(load_name: string) {
	if (!loaded) {
		await sleep(100);
		return await load(load_name);
	}
	if (load_name == null) {
		return saved_data;
	} else {
		return saved_data[load_name];
	}
}

export async function load_setting(load_name: string) {
	if (!loaded) {
		await sleep(100);
		return await load_setting(load_name);
	}
	if (saved_data["current_settings"] != null) {
		return saved_data["current_settings"][load_name];
	} else {
		return null;
	}
}

export async function load_any(load_name: string) {
	const get_data = await load_setting(load_name);
	if (get_data == null) {
		return await load(load_name);
	} else {
		return get_data;
	}
}

export async function clear_save() {
	await chrome.storage.local.clear();
}

export async function update_save_default() {
	const can_settings = await get_settings_list(true);
	let current_settings = saved_data["current_settings"];

	// console.log(can_settings);

	if (current_settings == null) {
		current_settings = {};
	}

	for (const id in can_settings) {
		const setting = can_settings[id];
		if ("value" in setting && current_settings[id] == null) {
			current_settings[id] = setting.value;
			console.log("Added New Default Setting:", id, setting.value);
		}
	}

	saved_data["current_settings"] = current_settings;
}

export async function clear_unused_save() {
	if (!loaded) {
		await sleep(100);
		return await clear_unused_save();
	}

	if (saved_data["current_settings"] == null) {
		saved_data["current_settings"] = {};
	}

	console.log("Clearing Unnessary save");

	const can_settings_keys = Object.keys(await get_settings_list(true));
	const current_settings = saved_data["current_settings"];

	for (const key of Object.keys(current_settings)) {
		if (!can_settings_keys.includes(key)) {
			console.log("Removed", key);
			delete current_settings[key];
		}
	}

	for (const key of Object.keys(saved_data)) {
		if (!save_external.includes(key)) {
			console.log("Removed", key);
			delete saved_data[key];
		}
	}

	console.log("Clearing Unnessary save", "Saving");

	await save_all();

	console.log("Cleared Unnessary save");
}

export async function load_rgba(text) {
	let hex = await load(text + "C");
	hex = hex.replace("#", "");
	const argb_hex = hex.match(/.{1,2}/g);
	const argb = [parseInt(argb_hex[0], 16) + "," + parseInt(argb_hex[1], 16) + "," + parseInt(argb_hex[2], 16)];

	return `rgba(` + argb + `,` + (await load(text + "O")) / 100 + `)`;
}

export async function load_ntube_code(preset) {
	const array = preset;
	let changes_made = false;

	if (Object.prototype.toString.call(array) == "[object Object]") {
		for (const key of Object.keys(array)) {
			let value = array[key];
			if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
				try {
					const try_to_parse = JSON.parse(value);
					if (try_to_parse != null) {
						value = try_to_parse;
					}
				} catch (error) {}
			}

			if (key == "ADDScript" && typeof value === "string" && value.trim() !== "") {
				if (
					await show_confirm(
						`⚠️*WARNING*⚠️\nThis preset/Theme contains JS code.\nYou could be compromised if you continue.\n(Please make sure this code is from a trusted source!)\n\nDo you want to load the JS code?`
					)
				) {
					await save_setting(key, value, true);
					changes_made = true;
				} else {
					await save_setting(key, "", true);
					changes_made = true;
				}
			} else {
				await save_setting(key, value, true);
				changes_made = true;
			}
		}
	} else if (Array.isArray(array)) {
		for (let i = 0; i < Array.length; i += 2) {
			const key = array[i];
			let value = array[i + 1];
			if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
				try {
					const try_to_parse = JSON.parse(value);
					if (try_to_parse != null) {
						value = try_to_parse;
					}
				} catch (error) {}
			}
			await save_setting(key, value, true);
			changes_made = true;
		}
	}

	if (changes_made) {
		await save_all();
	}
}

export async function load_ntube_code_string(string) {
	console.log(await convert_string_to_preset(string));
	return await load_ntube_code(await convert_string_to_preset(string));
}

export async function gen_ntube_code() {
	await update_styleshift_items();
	await clear_unused_save();

	return await load("current_settings");
}

export async function gen_ntube_code_string() {
	const arr = await gen_ntube_code();
	let gentext = JSON.stringify(arr).replace(/,"/g, ',\n"');
	gentext = gentext.substring(0, 1) + "\n" + gentext.substring(1);
	const gentext_l = gentext.length;
	gentext = gentext.substring(0, gentext_l - 1) + "\n" + gentext.substring(gentext_l - 1);
	return gentext;
}

export async function convert_string_to_preset(string) {
	return JSON.parse(string);
}

export async function convert_to_new_save(save) {
	const new_save = { ...save };

	await Promise.all(
		Object.keys(new_save).map(async (id) => {
			if (new_save[id] == "true") {
				new_save[id] = true;
			}

			if (new_save[id] == "false") {
				new_save[id] = false;
			}

			if (id.slice(-1) == "T" && (new_save[id] === true || new_save[id] === false)) {
				new_save[id.slice(0, -1)] = new_save[id];
				delete new_save[id];
			}
		})
	);

	return new_save;
}

export async function set_null_save() {
	let settings_changed = false;

	if ((await load("current_settings")) == null) {
		await save("current_settings", {}, true);
		settings_changed = true;
	}

	if ((await load("Themes")) == null) {
		await save("Themes", {}, true);
		settings_changed = true;
	}

	let current_settings = await load("current_settings");
	if (current_settings == null) current_settings = {};

	const all_settings_list = await get_settings_list(true);

	for (const [id, args] of Object.entries(all_settings_list) as [string, any]) {
		if (save_external.includes(id)) continue;

		if (current_settings[id] === undefined || current_settings[id] === null) {
			console.log("Added New Default Setting:", id, args.value);
			await save_any(id, args.value, true);
			settings_changed = true;
		}
	}

	if (settings_changed) {
		await save_all();
		console.log("Finished setting null saves.");
	} else {
		console.log("No null saves needed setting.");
	}
}
