import { convert_to_export_setting } from "../core/export-converter";
import { save_and_update_all, jszip } from "../core/extension";
import { styleshift_allowed_keys, saved_data, set_null_save, load, save } from "../core/save";
import { styleshift_station } from "../run";
import { styleshift_category_list } from "../settings/default-items";
import { show_stylesheet, hide_stylesheet } from "../settings/style-sheet";
import { Category, Setting } from "../types/store";
import { notification_container, run_animation, create_styleshift_window } from "../ui/extension";
import { settings_ui } from "../ui/settings/setting-components";
import { sleep, deep_clone, download_file, get_current_domain, create_unique_id } from "./normal";

/*
-------------------------------------------------------
For Normal user !!!
-------------------------------------------------------
*/

/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 * @returns {boolean}
 * @example
 * copy_to_clipboard("Hello, world!"); // Copies "Hello, world!" to the clipboard
 */
export function copy_to_clipboard(text: string) {
	navigator.clipboard.writeText(text).then(
		() => {
			return true;
		},
		(err) => {
			console.error("Failed to copy text: ", err);
			return false;
		}
	);
}

/**
 * Creates a notification.
 * @param {Object} options - The notification options.
 * @param {string} [options.icon=null] - The icon.
 * @param {string} [options.title="StyleShift"] - The title.
 * @param {string} [options.content=""] - The content.
 * @param {number} [options.timeout=3000] - The timeout in milliseconds.
 * @returns {Promise<Object>}
 * @example
 * await create_notification({ title: "Hello", content: "This is a notification" });
 */
export async function create_notification({ icon = null, title = "StyleShift", content = "", timeout = 3000 }) {
	// console.log(title, content);

	const notification_frame = await settings_ui["setting_frame"](true, false, {
		x: false,
		y: true,
	});

	notification_frame.className = "STYLESHIFT-Notification";
	setTimeout(() => {
		notification_container.append(notification_frame);
	}, 1);

	let icon_ui;

	if (icon) {
		icon_ui = await settings_ui["setting_frame"](true, false, {
			x: true,
			y: true,
		});
		icon_ui.className += " STYLESHIFT-Notification-Icon";
		icon_ui.textContent = icon;
		notification_frame.append(icon_ui);
	}

	//---------------------------------

	const notification_content_frame = await settings_ui["setting_frame"](false, true);
	notification_content_frame.className += " STYLESHIFT-Notification-Content-Frame";
	notification_frame.append(notification_content_frame);

	const title_ui = await settings_ui["setting_frame"](true, false, {
		x: false,
		y: true,
	});
	title_ui.className += " STYLESHIFT-Notification-Title";
	title_ui.textContent = title;
	notification_content_frame.append(title_ui);

	const content_ui = await settings_ui["setting_frame"](true, false, {
		x: false,
		y: true,
	});
	content_ui.className += " STYLESHIFT-Notification-Content";
	notification_content_frame.append(content_ui);

	const set_content = (new_content) => {
		new_content = String(new_content);
		content_ui.innerHTML = new_content.replaceAll("<script", "").replaceAll("/script>", "");
	};

	set_content(content);

	//---------------------------------

	async function close() {
		await run_animation(notification_frame, "Notification-Hide");
		notification_frame.remove();
	}

	if (timeout == 0) {
		const close_ui = await settings_ui["setting_frame"](true, false, {
			x: true,
			y: true,
		});
		close_ui.className += " STYLESHIFT-Notification-Close";
		close_ui.textContent = "X";
		notification_frame.append(close_ui);

		close_ui.addEventListener("click", function (e) {
			e.preventDefault();
			close();
		});
	}

	//---------------------------------

	await run_animation(notification_frame, "Notification-Show");
	setTimeout(async () => {
		if (timeout > 0) {
			await sleep(timeout);
			close();
		}
	}, 0);

	return {
		set_icon: (new_icon) => {
			if (icon_ui) {
				icon_ui.textContent = new_icon;
			}
		},
		set_content,
		set_title: (new_title) => {
			title_ui.textContent = new_title;
		},
		close,
	};
}

/**
 * Creates an error notification.
 * @param {string} content - The error content.
 * @returns {Promise<Object>}
 * @example
 * await create_error("An error occurred");
 */
export async function create_error(content, timeout = 0) {
	console.error("StyleShift - " + content);
	return await create_notification({
		icon: "❌",
		title: "StyleShift - Error",
		content: content,
		timeout: timeout,
	});
}

export async function create_warning(content, { timeout = 0, show = true } = {}) {
	console.warn("StyleShift - " + content);
	if (!show) return;
	return await create_notification({
		icon: "⚠️",
		title: "StyleShift - Warning",
		content: content,
		timeout: timeout,
	});
}

/*
-------------------------------------------------------
For advanced user !!!
-------------------------------------------------------
*/
/**
 * shows a text input prompt window.
 * @param {{ title : string, placeholder : string, content : string }} Options
 * @returns {Promise<string>}
 * @example
 * await enter_text_prompt({ title : "Enter your name", placeholder : "John Doe", content : "Please enter your name." });
 */
export async function enter_text_prompt({ title = "Enter text", placeholder = "", content = "" }) {
	const styleshift_window = await create_styleshift_window({
		width: "40%",
		height: "70%",
	});

	styleshift_window.bg_frame.style.background = "";
	styleshift_window.bg_frame.style.pointerEvents = "";
	styleshift_window.bg_frame.style.zIndex = "10001";

	const content_window = styleshift_window.window_element;

	//---------------------------------

	const header = await settings_ui["text"]({
		type: "text",
		html: title,
		font_size: 20,
		text_align: "center",
	});
	dynamic_append(content_window, header);

	//---------------------------------

	const text_input = await settings_ui["text_editor"]();
	text_input.on_change(() => {});
	text_input.text_editor.style.height = "inherit";
	content_window.append(text_input.text_editor);

	//---------------------------------

	const button_frame = await settings_ui["setting_frame"](true, false);
	button_frame.style.gap = "10px";
	dynamic_append(content_window, button_frame);

	//---------------------------------

	const ok_button = await settings_ui["button"]({
		name: "OK",
		color: "#00ff00",
		text_align: "center",
	});
	dynamic_append(button_frame, ok_button);

	//---------------------------------

	const cancel_button = await settings_ui["button"]({
		name: "Cancel",
		color: "#ff0000",
		text_align: "center",
	});
	dynamic_append(button_frame, cancel_button);

	return new Promise((resolve, reject) => {
		ok_button.button.addEventListener("click", () => {
			styleshift_window.run_close();
			resolve(text_input.text_editor.value);
		});
		cancel_button.button.addEventListener("click", () => {
			styleshift_window.run_close();
			reject();
		});
	});
}

/**
 * Prompts the user to select a file.
 * @param {string} type - The file type.
 * @returns {Promise<file>}
 * @example
 * const file = await get_file(".txt");
 */
export async function get_file(type) {
	return new Promise((resolve, reject) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = type;

		input.click();

		input.addEventListener("change", function () {
			const file = input.files[0];
			if (file) {
				resolve(file);
			} else {
				reject(new Error("No file selected"));
			}
		});

		input.addEventListener("cancel", () => {
			reject(new Error("Canceled by the user"));
		});
	});
}

/**
 * Imports StyleShift data and updates the saved data.
 * @param {Object} styleshift_data - The JSON data to import.
 * @returns {Promise<void>}
 * @example
 * await import_styleshift_data(data);
 */
export async function import_styleshift_data(styleshift_data: object) {
	const notification = await create_notification({
		icon: "🔄️",
		title: "StyleShift - Importing data",
		content: "Please wait...",
		timeout: -1,
	});

	try {
		for (const this_key of styleshift_allowed_keys) {
			saved_data[this_key] = styleshift_data[this_key];
		}

		await set_null_save();
		save_and_update_all();

		notification.set_icon("✅");
		notification.set_title("StyleShift - Imported data");
		notification.set_content("Imported successfully!");

		await sleep(3000);

		notification.close();
	} catch (error) {
		notification.close();

		create_error(error).then((notification) => {
			notification.set_title("StyleShift - Import Failed");
		});
	}
}

/**
 * Exports custom items.
 * @returns {Object[]}
 * @example
 * const items = export_styleshift_data();
 */
export function export_styleshift_data() {
	const export_styleshift_data = {};

	for (const this_key of styleshift_allowed_keys) {
		if (saved_data[this_key]) {
			export_styleshift_data[this_key] = deep_clone(saved_data[this_key]);
		}
	}

	const custom_items = export_styleshift_data["custom_styleshift_items"];

	if (custom_items) {
		for (const this_category of custom_items) {
			delete this_category.Highlight_color;
			delete this_category.editable;

			for (const this_setting of this_category.settings) {
				delete this_setting.editable;
			}
		}
	} else {
		create_warning("No custom items found. Skipping...", { show: false });
	}

	return export_styleshift_data;
}

/**
 * Imports StyleShift data from a JSON string.
 * @param {string} text - The JSON string to import.
 * @returns {Promise<void>}
 * @example
 * const json = '{"custom_styleshift_items":[{"Category":"Test","settings":[{"type":"text","id":"test_text","html":"<p>Test</p>"}]}]}';
 * await import_styleshift_json_text(json);
 */
export async function import_styleshift_json_text(text) {
	await import_styleshift_data(JSON.parse(text));
}

/**
 * Exports custom items as a JSON string.
 * @returns {string}
 * @example
 * const json = export_styleshift_json_text();
 */
export function export_styleshift_json_text() {
	return JSON.stringify(export_styleshift_data(), null, 2);
}

/**
 * Imports StyleShift data from a ZIP file.
 * @param {file} zip_file - The ZIP file.
 * @returns {Promise<Category[]>}
 * @example
 * const data = await import_styleshift_zip(file);
 */
export async function import_styleshift_zip(zip_file) {
	const zip = new jszip();

	const loaded_zip = await zip.loadAsync(zip_file, {
		createFolders: true,
	});

	const custom_styleshift_items: Category[] = [];

	const category_folders = Object.keys(loaded_zip.files).filter((path) => {
		const path_array = path.split("/");
		if (path_array.length === 2 && path_array[1] == "") {
			return true;
		}
	});

	for (const category_path of category_folders) {
		const category_path_name = category_path.slice(0, -1);
		const category_array = category_path_name.split(" - ");
		const category_index = Number(category_array[0]);

		const category_config = loaded_zip.file(`${category_path_name}/Config.json`);

		const config_content = await category_config.async("string");
		const category_data = JSON.parse(config_content);

		const settings: Setting[] = [];

		for (const setting_path of Object.keys(loaded_zip.files)) {
			if (
				setting_path.split("/").length === 3 &&
				setting_path.startsWith(`${category_path_name}/`) &&
				setting_path.endsWith("/")
			) {
				const setting_path_name = setting_path.slice(category_path.length, -1);

				const setting_array = setting_path_name.split(" - ");
				const setting_index = Number(setting_array[0]);

				const setting_data =
					JSON.parse(await loaded_zip.file(`${setting_path}Config.json`).async("string")) || {};

				for (const setting_property_path of Object.keys(loaded_zip.files)) {
					if (
						setting_property_path.split("/").length === 3 &&
						setting_property_path.startsWith(setting_path) &&
						!setting_property_path.endsWith("/") &&
						!setting_property_path.endsWith("Config.json")
					) {
						const setting_property_name = setting_property_path.slice(
							setting_path.length,
							setting_property_path.lastIndexOf(".")
						);

						console.log(setting_property_path);

						setting_data[setting_property_name] = await loaded_zip
							.file(setting_property_path)
							.async("string");
					}
				}

				settings[setting_index] = setting_data;
			}
		}

		// clear null settings
		category_data["settings"] = settings.filter((setting) => setting !== null);

		custom_styleshift_items[category_index] = category_data;
	}

	const styleshift_data = {
		custom_styleshift_items,
	};

	console.log(styleshift_data);

	await import_styleshift_data(styleshift_data);
}

/**
 * Exports StyleShift data as a ZIP file.
 * @param {Object} styleshift_data - The JSON data.
 * @param {string} zip_file_name - The ZIP file name.
 * @returns {Promise<void>}
 * @example
 * await export_styleshift_zip(data, "styleshift.zip");
 */
export async function export_styleshift_zip(styleshift_data, zip_file_name) {
	console.log("Data", styleshift_data);

	const zip = new jszip();

	for (const [category_index, this_category] of styleshift_data.entries()) {
		const renamed_category = (this_category.Category || "Untitled Category").replace(/\/|\n/g, "_");
		const category_folder = zip.folder(`${category_index} - ${renamed_category}`);

		const category_config = {};

		for (const [key, value] of Object.entries(styleshift_category_list)) {
			if (key !== "settings") {
				if (this_category[key]) {
					category_config[key] = this_category[key];
				} else {
					category_config[key] = value;
				}
			}
		}

		category_folder.file("Config.json", JSON.stringify(category_config, null, 2));

		if (this_category.settings) {
			for (const [setting_index, original_setting] of this_category.settings.entries()) {
				console.log(original_setting);

				const renamed_setting_name = (
					original_setting.name ||
					original_setting.id ||
					"Untitled Setting"
				).replace(/\/|\n/g, "_");

				const this_setting = deep_clone(original_setting);
				const settings_folder = category_folder.folder(`${setting_index} - ${renamed_setting_name}`);

				await convert_to_export_setting(this_setting, async (file_name, file_data) => {
					settings_folder.file(file_name, file_data);
				});

				settings_folder.file("Config.json", JSON.stringify(this_setting, null, 2));
			}
		}
	}

	const zip_blob = await zip.generateAsync({ type: "blob" });
	download_file(zip_blob, zip_file_name);
}

/**
 * Appends a child element to a parent HTMLDivElement.
 *
 * This function dynamically appends a child element to the specified parent
 * based on the properties of the child. If the child has a `frame` property,
 * it appends the frame. If the child has a `button` property, it appends the
 * button. Otherwise, it appends the child element itself.
 *
 * @param {HTMLDivElement} parent - The parent element to which the child will be appended.
 * @param {Object} child - The child element or object with specific properties (`frame` or `button`).
 */
export function dynamic_append(parent: HTMLDivElement, child: object | any) {
	const element = dynamic_get_element(child);
	if (element) {
		parent.appendChild(element);
	}
}

/**
 * Retrieves a specific element from a given object.
 *
 * This function checks the provided object for specific properties
 * (`frame` or `button`) and returns the corresponding element if found.
 * If neither property is present, it returns the object itself.
 *
 * @param {Object} child - The object containing potential elements.
 * @returns {HTMLElement | Object} The element associated with the `frame` or `button`
 * property, or the object itself if neither property is found.
 */

export function dynamic_get_element(child: object | any) {
	if (child.frame) {
		return child.frame;
	}

	if (child.button) {
		return child.button;
	}

	return child;
}

/**
 * Opens the StyleShift settings page.
 *
 * This function opens the StyleShift settings page in a new tab by calling
 * window.open with the URL of the settings page.
 *
 * @example
 * open_setting_page();
 */
export function open_setting_page() {
	window.open(chrome.runtime.getURL(`setting/styleshift.html?domain=${get_current_domain()}`), "_blank");
}

/*
-------------------------------------------------------
Danger Zone !!!
-------------------------------------------------------
*/

/**
 * Enables the extension.
 * @example
 * enable_extension_function();
 */
export async function enable_extension_function() {
	show_stylesheet();
}

/**
 * Disables the extension.
 * @example
 * disable_extension_function();
 */
export async function disable_extension_function() {
	hide_stylesheet();
}

/**
 * Retrieves the StyleShift value associated with a given ID.
 *
 * This function takes an ID, uses the load function to retrieve the associated
 * data, and returns the data as a JSON string.
 *
 * @param {string} id - The unique identifier for the data to be retrieved.
 * @returns {Promise<string>} The JSON string representation of the retrieved data.
 */
export async function load_styleshift_value(id) {
	return JSON.stringify(await load(id));
}

/**
 * saves the StyleShift value associated with a given ID.
 *
 * This function takes an ID and a JSON string value, parses the JSON string,
 * and saves the resulting data under the specified ID using the save function.
 *
 * @param {string} id - The unique identifier for the data to be saved.
 * @param {string} value - The JSON string representing the data to be saved.
 * @returns {Promise<any>} The result of the save operation.
 */

export async function save_styleshift_value(id, value: string) {
	return await save(id, JSON.parse(value));
}

/**
 * Creates a setting ui element from the given type and setting.
 *
 * This function will create a ui element using the provided type and setting.
 * The ui element will be appended to the `styleshift_station` element and
 * assigned a unique "styleshift-ui-id" attribute.
 *
 * @param {string} type - The type of the setting ui element.
 * @param {Setting | any} this_setting - The setting associated with the ui element.
 * @param {...any} args - Additional arguments to pass to the ui element function.
 * @returns {Promise<string>} The value of the "styleshift-ui-id" attribute assigned to the ui element.
 */
export async function create_styleshift_setting_ui(type, this_setting: Setting | any, ...args) {
	const ui = await settings_ui[type](this_setting, ...args);

	let ui_element;
	if (typeof ui === "object") {
		ui_element = dynamic_get_element(ui);
	} else {
		ui_element = ui;
	}

	const id = create_unique_id(10);
	ui_element.setAttribute("styleshift-ui-id", id);

	styleshift_station.append(ui_element);

	return id;
}
