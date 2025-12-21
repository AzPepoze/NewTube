import { apply_drag } from "../../../build-in-functions/normal";
import { monaco, is_safe_code } from "../../../core/extension";
import { save_all } from "../../../core/save";
import { is_firefox, in_setting_page } from "../../../run";
import { update_setting_function } from "../../../settings/functions";
import { Category } from "../../../types/store";
import { show_window_animation, hide_window_animation, animation_time } from "../../extension";
import { settings_ui } from "../setting-components";
import { create_config_ui_function, setup_left_title_animation } from "../settings";

export const advance_setting_ui = {
	["fill_screen"]: function (fill_bg: boolean = true) {
		const fill_screen = document.createElement("div");
		fill_screen.className = "STYLESHIFT-FillScreen";

		if (fill_bg == false) {
			fill_screen.style.background = "transparent";
			fill_screen.style.pointerEvents = "none";
		}

		return fill_screen;
	},

	["setting_frame"]: function (
		padding: boolean = true,
		vertical: boolean = true,
		center: { x: boolean; y: boolean } = { x: false, y: false },
		transparent = false
	) {
		const frame = document.createElement("div");
		frame.className = "STYLESHIFT-Setting-Frame";

		if (!padding) {
			frame.style.padding = "0px";
		}

		if (vertical) {
			frame.style.flexDirection = "column";
		} else {
			frame.style.flexDirection = "row";
		}

		if (center.x) {
			frame.style.justifyContent = "center";
		}

		if (center.y) {
			frame.style.alignItems = "center";
		}

		if (transparent) {
			frame.style.background = "transparent";
		}
		return frame;
	},

	["file_input"]: function (callback: Function, type = null) {
		const file_input = document.createElement("input");
		file_input.type = "file";
		file_input.className = "STYLESHIFT-File-Input";

		if (type) {
			file_input.accept = type;
		}

		file_input.addEventListener("change", function (event: any) {
			const file = event.target.files[0];
			if (file) {
				callback(file);
				file_input.value = "";
			}
		});

		return file_input;
	},

	["text_editor"]: function (obj = {}, key: any = "") {
		const text_editor = document.createElement("textarea");
		text_editor.className = "STYLESHIFT-Text-Editor";
		text_editor.value = obj[key] || "";

		let additinal_onchange: Function = null;
		let rearrange_value: Function = null;

		let on_change = async function (value) {
			obj[key] = value;
			save_all();
			if (additinal_onchange) {
				additinal_onchange(value);
			}
		};

		text_editor.addEventListener("input", function () {
			on_change(text_editor.value);
		});

		text_editor.addEventListener("blur", async function () {
			let value = text_editor.value;
			if (rearrange_value) {
				value = await rearrange_value(value);
				text_editor.value = value;
			}
			on_change(text_editor.value);
		});

		return {
			text_editor: text_editor,
			on_change: function (callback) {
				on_change = callback;
			},
			additinal_onchange: function (callback) {
				additinal_onchange = callback;
			},
			rearrange_value: function (callback) {
				rearrange_value = callback;
			},
		};
	},

	["code_editor"]: async function (parent: HTMLDivElement, obj, key, language, height = 400) {
		let code_editor;
		let additinal_onchange: Function = null;
		let rearrange_value: Function = null;

		let on_change = async function (value: string) {
			obj[key] = value;
			save_all();

			console.log("obj", obj);
			if (obj["id"]) {
				update_setting_function(obj["id"]);
			}

			if (additinal_onchange) {
				console.log(additinal_onchange);
				additinal_onchange(value);
			}
		};

		if (!is_firefox || in_setting_page) {
			const editor_model = monaco.editor.createModel(obj[key], language);

			const frame = document.createElement("div");
			frame.style.width = "-webkit-fill-available";
			frame.style.height = height + "px";
			frame.style.position = "relative";
			frame.className += " STYLESHIFT-Code-Editor";
			parent.append(frame);

			code_editor = monaco.editor.create(frame, {
				model: editor_model,
				automaticLayout: true,
			});

			code_editor.onKeyDown(function () {
				on_change(code_editor.getvalue());
			});

			code_editor.onDidBlurEditorWidget(async function () {
				let value = code_editor.getvalue();
				if (rearrange_value) {
					value = await rearrange_value(value);
					code_editor.setvalue(value);
				}
				on_change(value);
			});
		} else {
			code_editor = settings_ui["text_editor"](obj, key);
			code_editor.text_editor.style.height = height + "px";
			parent.append(code_editor.text_editor);

			code_editor.on_change(async function (value) {
				on_change(value);
			});
		}

		return {
			on_change: function (callback) {
				on_change = callback;
			},
			additinal_onchange: function (callback) {
				additinal_onchange = callback;
			},
			rearrange_value: function (callback) {
				rearrange_value = callback;
			},
		};
	},

	["setting_name"]: function (text, position: "left" | "center" | "right" = "left") {
		const name = document.createElement("div");
		name.className = "STYLESHIFT-Text-Main-Description";
		name.textContent = text;

		switch (position) {
			case "left":
				name.style.textAlign = "start";
				break;

			case "center":
				name.style.textAlign = "center";
				break;

			case "right":
				name.style.textAlign = "end";
				break;

			default:
				break;
		}

		return name;
	},

	["drag"]: function (target) {
		const drag = document.createElement("div");
		drag.className = "STYLESHIFT-Drag-Top STYLESHIFT-Glow-Hover";
		drag.innerHTML = "=";

		apply_drag(drag, target);

		return drag;
	},

	["close"]: function () {
		const close = document.createElement("div");
		close.className = "STYLESHIFT-Close STYLESHIFT-Glow-Hover";
		close.innerHTML = "X";

		return close;
	},

	["title"]: async function (this_category: Category) {
		const frame = document.createElement("div");
		const base_class = "STYLESHIFT-Category-Title";
		frame.className = base_class;

		function update_ui() {
			frame.className = this_category.rainbow ? base_class + " STYLESHIFT-Category-title-Rainbow" : base_class;
			frame.innerHTML = this_category.category;
		}
		update_ui();

		const config_ui_function = await create_config_ui_function(this_category.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_category,
				{
					name: ["Category", frame],
					Selector: "Selector",
					Rainbow: "Rainbow",
				},
				update_ui
			);
		});

		return { frame, config_ui_function };
	},

	["Left-title"]: function (category, skip_animation) {
		const title = document.createElement("div");
		title.className = "STYLESHIFT-Left-Category-Title";

		const text = document.createElement("div");
		text.className = "STYLESHIFT-Left-Category-Text";
		text.textContent = category;

		if (!skip_animation) {
			setup_left_title_animation(title);
		}

		title.append(text);

		return title;
	},

	["Sub_title"]: function (text) {
		const title = document.createElement("div");
		title.className = "STYLESHIFT-Sub-Title";

		if (is_safe_code(text, "Sub_title")) {
			title.innerHTML = text;
		}

		return title;
	},

	["collapsed_button"]: async function (button_name, color: string, target_element: HTMLElement) {
		target_element.setAttribute("STYLESHIFT-All-Transition", "");
		target_element.className += " STYLESHIFT-Collapse";

		target_element.style.maxHeight = "100%";
		const save_style = target_element.getAttribute("style");

		function hide_function() {
			target_element.style.maxHeight = "0px";
			target_element.style.padding = "0px";
			target_element.style.opacity = "0";
			target_element.style.marginTop = "-10px";
			target_element.style.pointerEvents = "none";
		}
		function show_function() {
			target_element.setAttribute("style", save_style);
		}

		let collapsed = true;
		hide_function();

		const button = await settings_ui["button"]({
			name: button_name,
			color: color,
			click_function: function () {
				if (collapsed) {
					show_function();
				} else {
					hide_function();
				}
				collapsed = !collapsed;
			},
		});

		return button;
	},

	["show_dropdown"]: function (options, target) {
		const dropdown_container = settings_ui["setting_frame"](false, true);
		dropdown_container.className += " STYLESHIFT-DropDown-Container STYLESHIFT-Main";
		show_window_animation(dropdown_container);

		// Populate dropdown with options

		// Add elements to the DOM
		document.body.appendChild(dropdown_container);

		let updating_position = true;
		const update_position_function = function () {
			if (!updating_position) return;
			const target_rect = target.getBoundingClientRect();
			dropdown_container.style.width = `${target_rect.width}px`;

			const space_below = window.innerHeight - target_rect.bottom;
			const space_above = target_rect.top;

			const container_margin = 5;

			if (space_below >= dropdown_container.offsetHeight) {
				dropdown_container.style.top = `${target_rect.bottom + container_margin}px`;
			} else if (space_above >= dropdown_container.offsetHeight) {
				dropdown_container.style.top = `${
					target_rect.top - dropdown_container.offsetHeight - container_margin
				}px`;
			} else {
				// Default to positioning below if neither space is sufficient
				dropdown_container.style.top = `${target_rect.bottom}px`;
			}
			dropdown_container.style.left = `${target_rect.left}px`;
			requestAnimationFrame(update_position_function);
		};
		update_position_function();

		async function remove_dropdown() {
			updating_position = false;
			dropdown_container.dispatchEvent(new Event("remove_dropdown"));
			await hide_window_animation(dropdown_container);
			dropdown_container.remove();
		}

		// Auto remove when mouse moves far away
		let timeout;

		dropdown_container.addEventListener("mouseenter", () => {
			clearTimeout(timeout);
		});
		return {
			Selection: new Promise((resolve) => {
				timeout = setTimeout(() => {
					remove_dropdown();
				}, 2000);

				dropdown_container.addEventListener("mouseleave", () => {
					timeout = setTimeout(() => {
						remove_dropdown();
					}, 1000);
				});

				dropdown_container.addEventListener("remove_dropdown", function () {
					resolve(null);
				});

				let index = 0;

				for (const option of options as string[]) {
					const list_item = document.createElement("div");
					list_item.className = "STYLESHIFT-DropDown-Items STYLESHIFT-Glow-Hover";
					list_item.textContent = option.replaceAll("_", " ");
					list_item.addEventListener("click", () => {
						resolve(option); // Return the selected option
						remove_dropdown();
					});
					dropdown_container.appendChild(list_item);

					//--------------------------------------

					list_item.style.opacity = "0";
					list_item.style.width = "50%";

					setTimeout(() => {
						list_item.style.opacity = "1";
						list_item.style.width = "";
					}, animation_time * 100 * index);

					index++;
				}
			}),
			Cancel: remove_dropdown,
		};
	},

	["number_slide_ui"]: function (parent) {
		const number_slide_ui = document.createElement("input");
		number_slide_ui.type = "range";
		number_slide_ui.className = "STYLESHIFT-Number-Slide";
		parent.appendChild(number_slide_ui);

		function update_number_slide(min: any = 0, max: any = 100, step: any = 1) {
			number_slide_ui.min = min;
			number_slide_ui.max = max;
			number_slide_ui.step = step;
		}

		return { number_slide_ui, update_number_slide };
	},

	["number_input_ui"]: function (parent) {
		const number_input_ui = document.createElement("input");
		number_input_ui.type = "number";
		number_input_ui.className = "STYLESHIFT-Number-Input";
		parent.appendChild(number_input_ui);
		return number_input_ui;
	},

	["space"]: async function (parent: HTMLElement, size = 20) {
		const space = document.createElement("div");
		space.className = "STYLESHIFT-Space";
		space.style.minHeight = `${size}px`;

		parent.append(space);
	},
};
