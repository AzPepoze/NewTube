import { dynamic_append, create_error } from "../../build-in-functions/extension";
import { scroll_on_click, sleep, insert_after } from "../../build-in-functions/normal";
import { loaded_developer_modules } from "../../core/extension";
import { load, save_all } from "../../core/save";
import { get_styleshift_dev_only_items } from "../../../main/items-styleshift-dev";
import { in_setting_page, update_all } from "../../run";
import {
	add_category,
	remove_setting,
	get_setting_category,
	remove_category,
	get_styleshift_data_type,
} from "../../settings/items";
import { Category } from "../../types/store";
import { show_config_ui } from "../config";
import { create_styleshift_window, animation_time } from "../extension";
import { settings_ui } from "./setting-components";

export function setup_left_title_animation(title) {
	title.style.transform = "translateY(40px)";
	title.style.opacity = "0";
}

export async function create_main_settings_ui({
	show_category_list = true,
	on_create = null as (styleshift_window: Awaited<ReturnType<typeof create_styleshift_window>>) => void,
	on_remove = null as () => void,
	get_category = null as () => Category[] | Promise<Category[]>,
}) {
	let settings_window, update_setting_interval, scroll_category, settings_container;

	const return_obj = {
		create_ui: async function (skip_animation = false) {
			console.log(settings_window);
			if (settings_window) {
				return_obj.recreate_ui();
				return;
			}

			settings_window = await create_styleshift_window({
				skip_animation,
			});

			console.log("Created_styleshift_window");
			const window_element = settings_window.window_element;

			window_element.style.width = "47%";
			window_element.style.height = "80%";
			window_element.style.minwidth = "600px";
			window_element.style.minheight = "250px";

			if (in_setting_page) {
				window_element.style.width = "100%";
				window_element.style.height = "100%";
				window_element.style.resize = "none";
			}

			//------------------------------------------------

			const main_frame = await settings_ui["setting_frame"](false, false, { x: false, y: false }, true);

			main_frame.style.width = "calc(100% - 5px)";
			main_frame.style.height = "-webkit-fill-available";
			main_frame.style.gap = "10px";
			main_frame.style.overflow = "hidden";
			window_element.append(main_frame);

			//------------------------------------------------

			if (show_category_list) {
				scroll_category = document.createElement("div");
				scroll_category.className = "STYLESHIFT-Scrollable";
				scroll_category.style.minwidth = "100px";
				scroll_category.style.width = "250px";
				scroll_category.setAttribute("Left", "true");
				main_frame.append(scroll_category);
			}

			//------------------------------------------------

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

			//---------------------------------------------------

			settings_window.close.addEventListener(
				"click",
				() => {
					return_obj.remove_ui();
				},
				{ once: true }
			);

			//---------------------------------------------------

			const left_ui = [];
			const right_ui = [];

			const created_dev_only_category = [];

			for (const this_category of await get_category()) {
				const { category_title, category_frame } = await create_category_ui(
					settings_container,
					this_category
				);

				const left_category_title = await settings_ui["Left-title"](this_category.category, skip_animation);

				scroll_on_click(left_category_title, category_title);

				if (show_category_list) {
					left_ui.push(left_category_title);
					scroll_category.append(left_category_title);
				}

				right_ui.push(category_title);

				//------------------------------

				console.log(loaded_developer_modules);

				if (loaded_developer_modules) {
					const get_dev_only_category = get_styleshift_dev_only_items().find(
						(x) => x.category == this_category.category
					);

					console.log("Test", get_dev_only_category);

					if (get_dev_only_category) {
						created_dev_only_category.push(get_dev_only_category.category);

						for (const this_setting_only of get_dev_only_category.settings) {
							await create_setting_ui_element_with_able_developer_mode(
								category_frame,
								this_setting_only
							);
						}
					}
				}

				//------------------------------

				if (this_category.editable && (await load("Developer_mode"))) {
					dynamic_append(
						category_frame,
						await settings_ui["add_setting_button"](this_category.settings)
					);
				}

				await settings_ui["space"](settings_container);

				//------------------------------------------------------
			}

			if (await load("Developer_mode")) {
				for (const this_category of get_styleshift_dev_only_items()) {
					if (!created_dev_only_category.includes(this_category.category)) {
						await create_category_ui(settings_container, this_category);
					}
				}
			}

			if (show_category_list && (await load("Developer_mode"))) {
				const add_button = (
					await settings_ui["button"]({
						name: "+",
						color: "#FFFFFF",
						text_align: "center",
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

			//------------------------------------------------------

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

			//------------------------------------------------------

			let current_selected: HTMLElement;

			if (show_category_list) {
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
							if (current_selected == left_ui[index]) {
								break;
							}
							if (current_selected) {
								current_selected.removeAttribute("selected");
							}
							current_selected = left_ui[index];
							current_selected.setAttribute("selected", "");
							break;
						}
					}
				}, 100);
			}

			if (on_create) {
				on_create(settings_window);
			}
		},
		remove_ui: function (skip_animation = false, delay = false) {
			if (settings_window) {
				clearInterval(update_setting_interval);
				if (skip_animation) {
					const bg_frame = settings_window.bg_frame;
					requestAnimationFrame(() => {
						bg_frame.remove();
					});
				} else {
					settings_window.run_close();
				}
				settings_window = null;
			}
		},
		recreate_ui: async function () {
			if (settings_window) {
				const last_scroll = [0, 0];

				if (show_category_list) {
					last_scroll[0] = scroll_category.scrollTop;
				}
				last_scroll[1] = settings_container.scrollTop;

				settings_window.window_element.style.animation = "";
				const last_style = settings_window.window_element.style.csstext;
				console.log(last_style);
				return_obj.remove_ui(true, true);

				//----------------------------------------

				await return_obj.create_ui(true);

				settings_window.window_element.style.csstext = last_style;

				requestAnimationFrame(function () {
					if (show_category_list) {
						scroll_category.scrollTo(0, last_scroll[0]);
					}

					settings_container.scrollTo(0, last_scroll[1]);
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

//------------------------------

export async function create_config_ui_function(editable = false, config_function: Function): Promise<Function> {
	if (editable && (await load("Developer_mode"))) {
		return config_function;
	}
}

function create_setting_space(size = 20, gap = 0) {
	const space = document.createElement("div");
	space.style.height = size + "px";
	space.style.transition = `all ${animation_time}s`;

	async function show() {
		space.style.height = size + gap + "px";
		await sleep(animation_time * 1000);
	}

	async function hide() {
		space.style.height = gap + "px";
		await sleep(animation_time * 1000);
	}

	function set_size(value) {
		space.style.height = value + "px";
	}

	function set_gap(value) {
		gap = value;
		space.style.marginTop = -gap + "px";
		space.style.marginBottom = -gap + "px";
	}
	set_gap(gap);

	return {
		show,
		hide,
		set_size,
		set_gap,
		element: space,
	};
}

let draging_setting;

async function create_base_ui_element(ui_type, this_data) {
	try {
		console.log(ui_type);
		return await settings_ui[ui_type](this_data);
	} catch (error) {
		create_error(`${error}\n\n${JSON.stringify(this_data, null, 2)}`);
		return null; // Return null or handle the error appropriately
	}
}

async function add_drag(frame, parent, this_data) {
	const move_button = (
		await settings_ui["button"]({
			name: "☰",
			text_align: "center",
		})
	).button;
	move_button.className += " STYLESHIFT-Config-button";
	frame.append(move_button);

	move_button.addEventListener("mousedown", async function (event) {
		event.preventDefault();

		const frame_bound = frame.getBoundingClientRect();
		const offset = event.clientY - frame_bound.top;

		draging_setting = {
			size: frame_bound.height,
			Data: this_data,
		};

		frame.style.width = `${frame_bound.width}px`;
		frame.style.height = `${frame_bound.height}px`;
		frame.style.position = "absolute";
		frame.style.pointerEvents = "none";
		frame.style.zIndex = "1";

		const space = create_setting_space(
			frame_bound.height,
			Number(getComputedStyle(parent).gap.replace("px", ""))
		);

		space.show();
		parent.insertBefore(space.element, frame);

		requestAnimationFrame(() => {
			space.hide();
		});

		const scroller = parent.parentElement;
		let current_mouse_event = event;

		scroller.setAttribute("draging", "");

		//---------------------------------

		let render_drag = true;

		function update_drag_function() {
			if (!render_drag) return;

			frame.style.top = `${
				current_mouse_event.clientY - scroller.getBoundingClientRect().top + scroller.scrollTop - offset
			}px`;

			requestAnimationFrame(update_drag_function);
		}
		update_drag_function();

		//---------------------------------

		function on_drag(event) {
			current_mouse_event = event;
		}

		document.addEventListener("mousemove", on_drag);

		document.addEventListener(
			"mouseup",
			function () {
				document.removeEventListener("mousemove", on_drag);
				render_drag = false;

				frame.style.width = "";
				frame.style.height = "";
				frame.style.position = "";
				frame.style.pointerEvents = "";
				frame.style.zIndex = "";

				scroller.removeAttribute("draging");

				draging_setting = null;
				space.element.remove();
			},
			{ once: true }
		);
	});
}

async function add_drop_target(frame, parent, this_data, data_type) {
	// await Wait_One_frame();
	const space = create_setting_space(0, 5);
	requestAnimationFrame(() => {
		space.set_gap(Number(getComputedStyle(parent).gap.replace("px", "")));
		space.hide();
	});
	space.element.className = "STYLESHIFT-drag-Hint";

	insert_after(space.element, frame, parent);

	let current_hover = 0;
	function space_update_hover(hover) {
		current_hover += hover;

		if (draging_setting) {
			if (current_hover != 0) {
				space.set_size(draging_setting.size);
				space.show();
			}
		}

		if (current_hover == 0) {
			space.hide();
		}
	}

	frame.addEventListener("mouseenter", () => {
		space_update_hover(1);
	});
	space.element.addEventListener("mouseenter", () => {
		space_update_hover(1);
	});

	frame.addEventListener("mouseleave", () => {
		space_update_hover(-1);
	});
	space.element.addEventListener("mouseleave", function () {
		space_update_hover(-1);
	});

	space.element.addEventListener("mouseup", () => {
		if (draging_setting) {
			remove_setting(draging_setting.Data);

			const this_category: Category | 0 =
				data_type == "Category" ? this_data : get_setting_category(this_data);
			let this_setting_index = 0;

			if (this_category == 0) {
				create_error(`Category of ${this_data} not found`);
				return;
			}

			if (data_type != "Category") {
				this_setting_index =
					this_category.settings.findIndex((setting_item) => setting_item == this_data) + 1;
			}

			try {
				this_category.settings.splice(this_setting_index, 0, draging_setting.Data);
			} catch (error) {
				create_error(error);
				return;
			}

			save_all();
			update_all();
		}
	});
}

async function add_edit_delete_buttons(frame, main_element, this_data, data_type) {
	const edit_button = (
		await settings_ui["button"]({
			name: "✏️",
			text_align: "center",
			color: "#3399ff",
			click_function: function () {
				show_config_ui(main_element.config_ui_function);
			},
		})
	).button;
	edit_button.className += " STYLESHIFT-Config-button";
	frame.append(edit_button);

	const delete_button = (
		await settings_ui["button"]({
			name: "🗑️",
			text_align: "center",
			color: "#FF0000",
			click_function:
				data_type == "Category"
					? async function () {
							remove_category(this_data);
					  }
					: async function () {
							remove_setting(this_data);
					  },
		})
	).button;
	delete_button.className += " STYLESHIFT-Config-button";
	frame.append(delete_button);
}

async function setup_developer_mode_wrapper(parent, this_data, main_element, data_type) {
	const frame = settings_ui["setting_frame"](false, false, { x: true, y: true }, true);
	frame.className += " STYLESHIFT-Config-Frame";

	if (data_type != "Category") {
		await add_drag(frame, parent, this_data);
	}

	//--------------------------- Main content frame
	const main_frame = settings_ui["setting_frame"](
		false,
		false,
		{ x: true, y: true },
		this_data.type == "button" || data_type == "Category"
	);
	main_frame.className += " STYLESHIFT-Main-Setting-Frame";
	frame.append(main_frame);

	dynamic_append(main_frame, main_element);

	//--------------------------- Edit & Delete buttons
	await add_edit_delete_buttons(frame, main_element, this_data, data_type);

	//--------------------------- Append Final frame
	parent.append(frame);

	//--------------------------- Drop target
	add_drop_target(frame, parent, this_data, data_type);
}

export async function create_setting_ui_element_with_able_developer_mode(parent: HTMLDivElement, this_data) {
	const data_type = get_styleshift_data_type(this_data);
	const ui_type = data_type == "category" ? "title" : this_data.type;

	const main_element = await create_base_ui_element(ui_type, this_data);
	if (!main_element) return null; // Handle case where element creation failed

	if ((await load("Developer_mode")) && this_data.editable) {
		await setup_developer_mode_wrapper(parent, this_data, main_element, data_type);
	} else {
		dynamic_append(parent, main_element);
	}

	return main_element;
}

export async function create_category_ui(parent, this_category: Category) {
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
				}
			);
		}
	}

	return { category_title, category_frame };
}
