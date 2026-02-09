import { dynamic_append, create_error } from "../../build-in-functions/extension";
import { scroll_on_click } from "../../build-in-functions/normal";
import { logger } from "../../utils/logger";
import { get_styleshift_dev_only_items } from "../../../main/items-styleshift-dev";
import { add_category, get_settings_list, get_styleshift_data_type, update_styleshift_items } from "../../settings/items";
import { Category } from "../../types/store";
import { create_styleshift_window } from "../extension";
import { settings_ui } from "./setting-components";
import { add_drop_target, clear_drop_targets } from "./reorder";
import { get_root_value } from "@/styleshift/core/storage-manager";
import { is_dev_modules_loaded } from "@/styleshift/core/runtime-controller";
import { IS_IN_EXTENSION_SETTINGS_PAGE } from "@/styleshift/run";

export function setup_left_title_animation(title: HTMLElement) {
	title.style.transform = "translateY(40px)";
	title.style.opacity = "0";
}

const setting_ui_registry = new Map<string, { parent: HTMLElement; container: HTMLElement }>();

export async function refresh_setting_ui(setting_id: string) {
	const entry = setting_ui_registry.get(setting_id);
	if (!entry) return;

	const { parent, container } = entry;
	const settings = await get_settings_list();
	const setting = settings[setting_id];
	if (!setting) return;

	logger.debug("ui", `Refreshing targeted UI for setting: ${setting_id}`);

	const new_element = await create_base_ui_element(setting.type, setting);
	if (new_element) {
		const new_container = new_element.frame || new_element.button || new_element;
		if (new_container instanceof HTMLElement) {
			container.replaceWith(new_container);
			setting_ui_registry.set(setting_id, { parent, container: new_container });
		}
	}
}

interface SettingsWindow {
	window_element: HTMLElement;
	close_button: HTMLElement;
	overlay_frame: HTMLElement;
	drag_handle: HTMLElement;
	close_window_handler: () => Promise<void>;
}

export async function create_main_settings_ui({
	show_category_list = true,
	on_create = null as ((styleshift_window: SettingsWindow) => void) | null,
	get_category = null as (() => Category[] | Promise<Category[]>) | null,
}) {
	let settings_window: SettingsWindow | null = null;
	let update_setting_interval: any = null;
	let scroll_category: HTMLElement | null = null;
	let settings_container: HTMLElement | null = null;

	const return_obj = {
		render_content: async function (skip_animation = false) {
			if (!settings_container) return;

			clear_drop_targets();
			setting_ui_registry.clear();
			settings_container.innerHTML = "";
			if (scroll_category) scroll_category.innerHTML = "";

			if (update_setting_interval) clearInterval(update_setting_interval);

			const left_ui: HTMLElement[] = [];
			const right_ui: HTMLElement[] = [];
			const created_dev_only_category: string[] = [];

			const categories = get_category ? await get_category() : [];

			for (const this_category of categories) {
				const { category_title, category_frame } = await create_category_ui(
					settings_container,
					this_category,
				);

				const left_category_title = await settings_ui["Left-title"](this_category.category, skip_animation);

				scroll_on_click(left_category_title, category_title);

				if (show_category_list && scroll_category) {
					left_ui.push(left_category_title);
					scroll_category.append(left_category_title);
				}

				right_ui.push(category_title);

				if (is_dev_modules_loaded) {
					const get_dev_only_category = get_styleshift_dev_only_items().find(
						(x) => x.category == this_category.category,
					);

					if (get_dev_only_category) {
						created_dev_only_category.push(get_dev_only_category.category);

						for (const this_setting_only of get_dev_only_category.settings) {
							await create_setting_ui_element_with_able_developer_mode(
								category_frame,
								this_setting_only,
							);
						}
					}
				}

				if (this_category.editable && (await get_root_value("Developer_mode"))) {
					dynamic_append(
						category_frame,
						await settings_ui["add_setting_button"](this_category.settings),
					);
				}

				await settings_ui["space"](settings_container);
			}

			if (await get_root_value("Developer_mode")) {
				for (const this_category of get_styleshift_dev_only_items()) {
					if (!created_dev_only_category.includes(this_category.category)) {
						await create_category_ui(settings_container, this_category);
					}
				}
			}

			if (show_category_list && scroll_category && (await get_root_value("Developer_mode"))) {
				const add_button = (
					await settings_ui["button"]({
						name: "+",
						color: "#FFFFFF",
						align: "center",
						click_function: function () {
							add_category("🥳 new_category");
						},
					})
				).button;
				add_button.className += " STYLESHIFT-Add-Category-button";

				add_button.style.padding = "5px";
				add_button.style.marginInline = "10px";
				add_button.style.marginTop = "3px";

				left_ui.push(add_button);
				scroll_category.append(add_button);

				if (!skip_animation) {
					setup_left_title_animation(add_button);
				}
			}

			if (show_category_list && !skip_animation) {
				requestAnimationFrame(function () {
					for (let left_order = 0; left_order < left_ui.length; left_order++) {
						const left_category_title = left_ui[left_order];
						setTimeout(() => {
							left_category_title.style.transform = "";
							left_category_title.style.opacity = "";
						}, 50 * left_order);
					}
				});
			}

			let current_selected_left: HTMLElement;
			let current_selected_right: HTMLElement;

			if (show_category_list && settings_container) {
				update_setting_interval = setInterval(async function () {
					const last_index = right_ui.length - 1;

					for (let index = 0; index <= last_index; index++) {
						const settings_container_box = settings_container.getBoundingClientRect();
						if (
							index == last_index ||
							(right_ui[index].getBoundingClientRect().top - 10 <= settings_container_box.top &&
								right_ui[index + 1].getBoundingClientRect().top - 10 >=
									settings_container_box.top) ||
							(index == 0 &&
								right_ui[index].getBoundingClientRect().top >= settings_container_box.top)
						) {
							if (current_selected_left == left_ui[index]) {
								break;
							}
							if (current_selected_left) {
								current_selected_left.removeAttribute("selected");
							}
							if (current_selected_right) {
								current_selected_right.removeAttribute("selected");
							}
							current_selected_left = left_ui[index];
							current_selected_right = right_ui[index];
							current_selected_left.setAttribute("selected", "");
							current_selected_right.setAttribute("selected", "");

							current_selected_left.scrollIntoView({ behavior: "smooth", block: "nearest" });
							break;
						}
					}
				}, 100);
			}
		},

		create_ui: async function (skip_animation = false) {
			logger.info("ui", "Creating UI", { settings_window });
			if (settings_window) {
				return_obj.recreate_ui();
				return;
			}

			// @ts-ignore
			settings_window = await create_styleshift_window({
				skip_animation,
			});

			logger.info("ui", "Created_styleshift_window");
			const window_element = settings_window.window_element;

			window_element.style.width = "47%";
			window_element.style.height = "80%";
			window_element.style.minWidth = "600px";
			window_element.style.minHeight = "250px";

			if (IS_IN_EXTENSION_SETTINGS_PAGE) {
				window_element.style.width = "100%";
				window_element.style.height = "100%";
				window_element.style.resize = "none";
			}

			const main_frame = await settings_ui["setting_frame"](false, false, { x: false, y: false }, true);
			main_frame.style.width = "calc(100% - 5px)";
			main_frame.style.height = "-webkit-fill-available";
			main_frame.style.gap = "10px";
			main_frame.style.overflow = "hidden";
			window_element.append(main_frame);

			if (show_category_list) {
				scroll_category = document.createElement("div");
				scroll_category.className = "STYLESHIFT-Scrollable";
				scroll_category.style.minWidth = "100px";
				scroll_category.style.width = "250px";
				scroll_category.setAttribute("Left", "true");
				main_frame.append(scroll_category);

				const resize_handle = await settings_ui["resize_handle"](scroll_category, "right");
				main_frame.append(resize_handle);
			}

			const settings_frame = await settings_ui["setting_frame"](false, true, { x: false, y: false }, true);
			settings_frame.style.width = "-webkit-fill-available";
			settings_frame.style.height = "100%";
			settings_frame.style.gap = "10px";
			main_frame.append(settings_frame);

			const search_input = document.createElement("input");
			search_input.className = "STYLESHIFT-Search";
			search_input.placeholder = "🔍 Search";
			settings_frame.append(search_input);

			settings_container = document.createElement("div");
			settings_container.className = "STYLESHIFT-Scrollable";
			settings_frame.append(settings_container);

			settings_window.close_button.addEventListener(
				"click",
				() => {
					return_obj.remove_ui();
				},
				{ once: true },
			);

			await return_obj.render_content(skip_animation);

			if (on_create) {
				on_create(settings_window);
			}
		},
		remove_ui: function (skip_animation = false, _delay = false) {
			if (settings_window) {
				if (update_setting_interval) clearInterval(update_setting_interval);
				if (skip_animation) {
					const overlay_frame = settings_window.overlay_frame;
					requestAnimationFrame(() => {
						overlay_frame.remove();
					});
				} else {
					settings_window.close_window_handler();
				}
				settings_window = null;
				settings_container = null;
				scroll_category = null;
			}
		},
		recreate_ui: async function () {
			logger.info("ui", "recreate_ui triggered", { settings_window });
			if (settings_window && scroll_category && settings_container) {
				await update_styleshift_items();

				const last_scroll = [0, 0];
				if (show_category_list) {
					last_scroll[0] = scroll_category.scrollTop;
				}
				last_scroll[1] = settings_container.scrollTop;

				await return_obj.render_content(true);

				requestAnimationFrame(function () {
					if (show_category_list && scroll_category) {
						scroll_category.scrollTo(0, last_scroll[0]);
					}
					if (settings_container) {
						settings_container.scrollTo(0, last_scroll[1]);
					}
				});
			}
		},
		toggle: function () {
			if (settings_window) {
				return_obj.remove_ui();
			} else {
				return_obj.create_ui();
			}
		},

		set_get_category: function (new_function: () => Category[] | Promise<Category[]> | null) {
			get_category = new_function;
			if (settings_window) {
				return_obj.recreate_ui();
			}
		},
	};

	return return_obj;
}

export async function create_config_ui_function(
	editable = false,
	config_function: Function,
): Promise<Function | undefined> {
	if (editable && (await get_root_value("Developer_mode"))) {
		return config_function;
	}
}

async function create_base_ui_element(ui_type: string, this_data: any) {
	try {
		return await (settings_ui as any)[ui_type](this_data);
	} catch (error) {
		create_error(`${error}\n\n${JSON.stringify(this_data, null, 2)}`);
		return null;
	}
}

export async function create_setting_ui_element_with_able_developer_mode(parent: HTMLDivElement, this_data: any) {
	const data_type = get_styleshift_data_type(this_data);
	const ui_type = data_type == "category" ? "title" : (this_data as any).type;

	const main_element = await create_base_ui_element(ui_type, this_data);
	if (!main_element) return null;

	const container = main_element.frame || main_element.button || main_element;
	dynamic_append(parent, main_element);

	if (data_type === "setting" && this_data.id) {
		setting_ui_registry.set(this_data.id, { parent, container });
	}

	if (data_type === "category") {
		add_drop_target(main_element.frame, parent, this_data as Category, "category");
	}

	return main_element;
}

export async function create_category_ui(parent: HTMLElement, this_category: Category) {
	const category_frame = await settings_ui["setting_frame"](true, true);
	category_frame.className += " STYLESHIFT-Category-Frame";
	parent.append(category_frame);

	const category_title = (await create_setting_ui_element_with_able_developer_mode(category_frame, this_category))
		.frame;

	for (const this_setting of this_category.settings) {
		try {
			await create_setting_ui_element_with_able_developer_mode(category_frame, this_setting);
		} catch (error) {
			create_error(`At ${this_category.category} - ${JSON.stringify(this_setting, null, 2)}\n${error}`).then(
				(notification) => {
					notification.set_title("StyleShift - Create ui error");
				},
			);
		}
	}

	return { category_title, category_frame };
}
