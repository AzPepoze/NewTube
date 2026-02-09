import { get_default_items } from "../../main/items-default";
import { get_styleshift_default_items } from "../../main/items-styleshift-default";
import { get_styleshift_custom_items } from "../../main/items-styleshift-custom";
import { random_number_in_range } from "../build-in-functions/normal";
import { persist_and_refresh_all } from "../core/runtime-controller";
import { get_root_value, save_to_storage } from "../core/storage-manager";
import { refresh_extension_state } from "../run";
import { attach_behavior_to_setting } from "./functions";
import { Category, type Setting } from "../types/store";
import { logger } from "../utils/logger";

const highlight_colors = [`255, 109, 109`, `167, 242, 255`, `255, 167, 248`, `188, 167, 255`, `255, 241, 167`];

const styleshift_items: { Default: Category[]; Custom: Category[] } = {
	Default: [],
	Custom: [],
};

export function get_styleshift_items() {
	return styleshift_items;
}

export function get_custom_items() {
	return styleshift_items.Custom;
}

export function get_custom_settings() {
	return styleshift_items.Custom.map((item) => item.settings).flat();
}

export function get_all_styleshift_items() {
	return [...styleshift_items.Default, ...styleshift_items.Custom];
}

export function get_all_styleshift_settings() {
	return get_all_styleshift_items()
		.map((item) => item.settings)
		.flat();
}

export function find_exist_settings(setting: Setting) {
	return get_all_styleshift_settings().some(
		(this_setting) =>
			this_setting.id === setting.id &&
			//@ts-ignore
			(this_setting.name == null || this_setting.name === setting.name),
	);
}

export function get_setting_category(setting: Setting) {
	for (const this_category of get_all_styleshift_items()) {
		for (const this_setting of this_category.settings) {
			if (this_setting === setting) {
				return this_category;
			}
		}
	}
	return null;
}

export function find_exist_category(category: Category) {
	return get_all_styleshift_items().some((this_category) => this_category.category === category.category);
}

function auto_add_hightlight(array) {
	for (const category_obj of array) {
		if (category_obj.Highlight_color == null) {
			const get_color_id = random_number_in_range(0, highlight_colors.length - 1, category_obj.Category);
			logger.info("highlight", "random id", category_obj.Category, get_color_id);
			category_obj.Highlight_color = highlight_colors[get_color_id];
		}
	}
}

function save_custom_items_and_refresh_extension_state(custom_items) {
	save_to_storage("custom_styleshift_items", custom_items);
	refresh_extension_state();
}

export async function update_styleshift_items() {
	styleshift_items.Default = [...get_styleshift_default_items(), ...get_default_items()];
	
	const stored_custom = await get_root_value("custom_styleshift_items");
	if (stored_custom && Array.isArray(stored_custom) && stored_custom.length > 0) {
		logger.debug("settings", "Loading custom items from storage");
		styleshift_items.Custom = stored_custom;
	} else {
		logger.debug("settings", "No custom items in storage, using defaults");
		styleshift_items.Custom = get_styleshift_custom_items();
	}

	auto_add_hightlight(get_all_styleshift_items());

	// Default

	for (const this_category of styleshift_items.Default) {
		if (this_category.editable !== true) {
			this_category.editable = false;
		}
	}

	for (const this_setting of styleshift_items.Default.flatMap(function (this_setting) {
		return this_setting.settings;
	})) {
		if (this_setting.editable !== true) {
			this_setting.editable = false;
		}
	}

	// Custom

	for (const this_category of styleshift_items.Custom) {
		this_category.editable = true;
	}

	for (const this_setting of styleshift_items.Custom.flatMap(function (this_setting) {
		return this_setting.settings;
	})) {
		this_setting.editable = true;
	}
}

let settings_list = {} as { [id: string]: Setting };

export async function get_settings_list(rebuild = false): Promise<{ [id: string]: Setting }> {
	if (!rebuild && Object.keys(settings_list).length) {
		return settings_list;
	}

	settings_list = {};

	for (const category_obj of get_all_styleshift_items()) {
		for (const setting of category_obj.settings) {
			if ("id" in setting && setting.id != null) {
				settings_list[setting.id] = setting;
			}
		}
	}

	return settings_list;
}

//--------------------------------------------------

export async function add_setting(category_settings: Setting[], this_setting) {
	let find_similar = find_exist_settings(this_setting);
	let new_preset;
	let times = 0;

	while (find_similar) {
		times++;
		new_preset = Object.assign({}, this_setting);
		new_preset.id += `_${times}`;
		new_preset.name += `_${times}`;
		find_similar = find_exist_settings(new_preset);
		logger.info("settings", find_similar, times, new_preset);
	}

	if (new_preset) {
		this_setting = new_preset;
	}

	category_settings.push(this_setting);
	logger.info("settings", "update Category settings", category_settings);

	if (this_setting.value) {
		await save_to_storage(this_setting.id, this_setting.value);
	}

	attach_behavior_to_setting(this_setting);

	persist_and_refresh_all();
}

export async function remove_setting(this_setting) {
	for (const this_category of get_custom_items()) {
		const index = (this_category.settings || []).findIndex((check_setting) => check_setting === this_setting);

		if (index > -1) {
			this_category.settings.splice(index, 1);
		}
	}

	persist_and_refresh_all();
}

//--------------------------------------------------

export async function add_category(category_name: string) {
	let this_category: Category = {
		category: category_name,
		settings: [],
	};

	let find_similar = find_exist_category(this_category);
	let new_category: Category;
	let times = 0;

	while (find_similar) {
		times++;
		new_category = Object.assign({}, this_category);
		new_category.category += `_${times}`;
		find_similar = find_exist_category(new_category);
		logger.info("category", find_similar, times, new_category);
	}

	if (new_category) {
		this_category = new_category;
	}

	const custom_items = get_custom_items();
	custom_items.push(this_category);
	logger.info("category", "Added Category", custom_items);

	save_custom_items_and_refresh_extension_state(custom_items);
}

export async function remove_category(this_category) {
	const custom_items = get_custom_items();

	const index = custom_items.findIndex((check_category) => check_category === this_category);

	if (index > -1) {
		custom_items.splice(index, 1);
	}

	save_custom_items_and_refresh_extension_state(custom_items);
}

//-------------------------------------------------

export function get_styleshift_data_type(this_data) {
	logger.info("data", this_data);

	if (this_data.category != null) {
		return "category";
	}

	return "setting";
}
