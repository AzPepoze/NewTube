import { hex_to_rbg, rgb_to_hsv, hsv_to_rgb, rearrange_selector } from "../../../build-in-functions/normal";
import { save_all } from "../../../core/save";
import { ui_preset } from "../../../settings/default-items";
import { add_setting } from "../../../settings/items";
import { Setting } from "../../../types/store";
import { settings_ui } from "../setting-components";
import { main_setting_ui } from "./main";

export const developer_setting_ui = {
	["setting_developer_text_editor"]: async function (
		parent: HTMLElement,
		this_setting,
		this_property,
		update_ui = function (value) {}
	) {
		const main_ui = settings_ui["setting_frame"](true, true);
		main_ui.className += " STYLESHIFT-Config-Sub-Frame";

		const text_editors = {};

		for (const [title, property] of Object.entries(this_property)) {
			main_ui.append(settings_ui["Sub_title"](title));
			const setting_developer_text_editor = settings_ui["text_editor"](this_setting, property);
			setting_developer_text_editor.additinal_onchange(update_ui);
			main_ui.append(setting_developer_text_editor.text_editor);
			text_editors[title] = setting_developer_text_editor;
		}

		parent.appendChild(main_ui);

		return { main_ui, text_editors };
	},

	["Setting_Developer_frame"]: async function (
		parent,
		this_setting,
		run_type,
		ext_array = ["function", "css"],
		update_config
	) {
		let this_runtype_name = run_type;
		let color = "#999999";

		switch (run_type) {
			case "var":
				this_runtype_name = "Variable";
				color = "#FFA500";
				break;

			case "click":
				this_runtype_name = "On Click";
				color = "#00DFFF";
				break;

			case "constant":
				this_runtype_name = "Constant CSS";
				color = "#09ff00";
				break;

			case "ui":
				this_runtype_name = "ui";
				color = "#3232FF";
				break;

			case "setup":
				this_runtype_name = "Startup Script";
				color = "#3232FF";
				break;

			case "enable":
				this_runtype_name = "On Enable";
				color = "#32CD32";
				break;

			case "disable":
				this_runtype_name = "On Disable";
				color = "#FF3232";
				break;

			case "update":
				this_runtype_name = "On Change";
				color = "#FF00F5";
				break;

			default:
				break;
		}

		const { r, g, b } = hex_to_rbg(color);

		const bg_hsv = rgb_to_hsv({ r, g, b });
		bg_hsv.s /= 2;
		bg_hsv.v /= 3;
		const bg_color = hsv_to_rgb(bg_hsv);

		const bgt_hsv = rgb_to_hsv({ r, g, b });
		bgt_hsv.s /= 1.5;
		bgt_hsv.v /= 2;
		const bgt_color = hsv_to_rgb(bgt_hsv);

		const background_top_color = `${bgt_color.r},${bgt_color.g},${bgt_color.b}`;
		const background_color = `${bg_color.r},${bg_color.g},${bg_color.b}`;
		const border_color = `${r + 150},${g + 150},${b + 150}`;

		//---------------------------

		const this_frame = settings_ui["setting_frame"](true, true);
		this_frame.style.paddingBottom = "10px";
		this_frame.style.background = `radial-gradient(at center top, rgb(${background_top_color}), rgb(${background_color}, 0.5))`;
		this_frame.style.border = `rgb(${border_color}) 1px solid`;

		//---------------------------

		const collapsed_button = await settings_ui["collapsed_button"](this_runtype_name, color, this_frame);
		collapsed_button.button.style.borderBottom = "solid 1px white";

		//---------------------------

		parent.append(collapsed_button.button);
		parent.append(this_frame);

		for (const ext of ext_array) {
			let this_type_name;

			switch (ext) {
				case "function":
					this_type_name = "JS";
					break;

				case "css":
					this_type_name = "CSS";
					break;

				default:
					break;
			}

			this_frame.append(settings_ui["Sub_title"](this_type_name));

			if (this_type_name == "JS") {
				this_type_name = "javascript";
			}

			if (this_type_name == "CSS") {
				this_type_name = "css";
			}

			await settings_ui["code_editor"](
				this_frame,
				this_setting,
				run_type + "_" + ext,
				this_type_name,
				run_type == "var" ? 100 : 400
			);
		}

		return this_frame;
	},

	["Config_Main_Section"]: async function (parent, this_setting, props, update_ui = function () {}) {
		for (let [title, property] of Object.entries(props) as [string, any]) {
			let update;

			if (typeof property != "string") {
				update = property[1];
				property = property[0];
			} else {
				update = update_ui;
			}

			//-----------------------------------

			if (Array.isArray(update)) {
				const dropdown_setting = {};

				for (const value of update) {
					dropdown_setting[value] = {
						enable_function: function () {
							this_setting[property] = value;
							update_ui();
							save_all();
						},
					};
				}

				const dropdown_ui = await settings_ui["dropdown"]({
					name: title,
					value: this_setting[property],
					options: dropdown_setting,
				});

				dropdown_ui.frame.className += " STYLESHIFT-Config-Sub-Frame";

				parent.append(dropdown_ui.frame);
				continue;
			}

			//-----------------------------------

			if (property == "Rainbow") {
				const checkbox_ui = (
					await settings_ui["checkbox"](
						{
							name: title,
							value: this_setting.Rainbow,
						},
						function (value) {
							this_setting.Rainbow = value;
							update_ui();
							save_all();
						}
					)
				).frame;

				checkbox_ui.className += " STYLESHIFT-Config-Sub-Frame";

				parent.append(checkbox_ui);
				continue;
			}

			//-----------------------------------

			if (property == "color") {
				const color_ui = (
					await settings_ui["color"]({
						name: title,
						value: this_setting.color,
						show_alpha_slider: false,
						update_function: function (value) {
							this_setting.color = value;
							update_ui();
							save_all();
						},
					})
				).frame;

				color_ui.className += " STYLESHIFT-Config-Sub-Frame";

				parent.append(color_ui);
				continue;
			}

			//-----------------------------------

			if (property == "font_size") {
				const number_slide_ui = (
					await settings_ui["number_slide"]({
						name: title,
						value: this_setting.font_size,
						update_function: function (value) {
							this_setting.font_size = value;
							update_ui();
							save_all();
						},
					})
				).frame;

				number_slide_ui.className += " STYLESHIFT-Config-Sub-Frame";
				number_slide_ui.style.width = "-webkit-fill-available";

				parent.append(number_slide_ui);
				continue;
			}

			//-----------------------------------

			const text_editor = await settings_ui["setting_developer_text_editor"](parent, this_setting, {
				[title]: property,
			});

			let update_function;

			if (typeof update === "function") {
				update_function = update;
			} else if (typeof update === "object") {
				update_function = function (value) {
					this_setting[property] = value;
					update_ui();
					save_all();
				};
			} else {
				return;
			}

			text_editor.text_editors[title].additinal_onchange(update_function);
		}
	},

	["Config_Sub_Section"]: async function (parent, this_setting, props) {
		for (let [title, property] of Object.entries(props)) {
			if (title == "update_config") {
				continue;
			}

			switch (property) {
				case 0:
					property = ["css", "function"];
					break;
				case 1:
					property = ["var"];
					break;
				case 2:
					property = ["css"];
					break;
				case 3:
					property = ["function"];
					break;
			}

			settings_ui["Setting_Developer_frame"](
				parent,
				this_setting,
				title,
				property as any,
				props.update_config
			);
		}
	},

	["selector_text_editor"]: async function (parent, this_category) {
		const selector_text_editor = await settings_ui["text_editor"](this_category, "Selector");
		selector_text_editor.text_editor.className += " STYLESHIFT-Selector-Text-Editor";
		selector_text_editor.rearrange_value(function (value: string) {
			return rearrange_selector(value);
		});
		parent.append(selector_text_editor.text_editor);
		return selector_text_editor;
	},

	["setting_delete_button"]: async function (parent, when_click, type: "full" | "mini" = "full") {
		const setting_delete_button = await settings_ui["button"]({
			name: "🗑️",
			color: "#FF0000",
			text_align: "center",
		});
		setting_delete_button.button.addEventListener("click", when_click);
		parent.append(setting_delete_button.button);

		switch (type) {
			case "full":
				setting_delete_button.button.style.width = "100%";
				break;
			case "mini":
				setting_delete_button.button.style.width = "30px";
				break;
		}

		return setting_delete_button;
	},

	["add_setting_button"]: async function (category_settings: Setting[]) {
		let current_dropdown;

		const add_button = await settings_ui["button"]({
			name: "+",
			color: "#FFFFFF",
			text_align: "center",
			click_function: async function () {
				add_button.button.setAttribute("selecting", "");

				if (current_dropdown) {
					current_dropdown.Cancel();
					return;
				}
				current_dropdown = settings_ui["show_dropdown"](Object.keys(main_setting_ui), add_button.button);
				const selected = await current_dropdown.Selection;
				if (selected) {
					const get_preset: any = ui_preset.filter((this_preset) => this_preset.type == selected)[0];

					if (get_preset) {
						await add_setting(category_settings, get_preset);
					}
				}
				current_dropdown = null;

				add_button.button.removeAttribute("selecting");
			},
		});

		add_button.button.className += " STYLESHIFT-Add-Setting-Button";
		add_button.button.style.borderRadius = "1000px";
		return add_button;
	},
};
