import { create_notification, create_error } from "../../../build-in-functions/extension";
import {
	hex_to_rbg,
	rgb_to_hsv,
	hsv_to_rgb,
	number_with_commas,
	once_element_remove,
	create_unique_id,
} from "../../../build-in-functions/normal";
import {
	is_safe_code,
	run_text_script_from_setting,
	hex_to_color_obj,
	color_obj_to_hex,
	run_text_script,
} from "../../../core/extension";
import { load_any, load, load_setting } from "../../../core/save";
import { update_setting_function, remove_on_setting_update, on_setting_update } from "../../../settings/functions";
import { Setting } from "../../../types/store";
import { settings_ui, set_and_save } from "../setting-components";
import { create_config_ui_function } from "../settings";
import { upload_to_imgbb, create_loading_bar } from "../../../../main/features/upload";

export const main_setting_ui = {
	["text"]: async function (this_setting: Partial<Extract<Setting, { type: "text" }>>) {
		const frame = settings_ui["setting_frame"](true, true);

		//-------------------------------------

		const text = document.createElement("div");
		text.className = "STYLESHIFT-Text-Main-Description";

		frame.append(text);

		//-------------------------------------

		function update_ui() {
			text.id = this_setting.id;
			text.style.fontSize = this_setting.font_size + "px";

			switch (this_setting.text_align) {
				case "left":
					text.style.textAlign = "start";
					break;

				case "center":
					text.style.textAlign = "center";
					break;

				case "right":
					text.style.textAlign = "end";
					break;

				default:
					break;
			}

			if (is_safe_code(this_setting.html, this_setting.id)) {
				text.innerHTML = this_setting.html;
			}
		}
		update_ui();

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					text: "html",

					["text align"]: ["text_align", ["left", "center", "right"]],
					["Font size"]: "font_size",
				},
				update_ui
			);
		});

		return { frame, config_ui_function };
	},
	["sub_text"]: async function (this_setting: Partial<Extract<Setting, { type: "sub_text" }>>) {
		const frame = settings_ui["setting_frame"](true, true);
		frame.className = "STYLESHIFT-Setting-Sub-Title";

		//-------------------------------------

		const text = document.createElement("div");
		text.className = "STYLESHIFT-Text-Main-Description";

		frame.append(text);

		//-------------------------------------

		function update_ui() {
			text.style.fontSize = this_setting.font_size + "px";

			switch (this_setting.text_align) {
				case "left":
					text.style.textAlign = "start";
					break;

				case "center":
					text.style.textAlign = "center";
					break;

				case "right":
					text.style.textAlign = "end";
					break;

				default:
					break;
			}

			text.textContent = this_setting.text;
		}

		update_ui();

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					text: "text",

					["text align"]: ["text_align", ["left", "center", "right"]],
					color: "color",
					["Font size"]: "font_size",
				},
				update_ui
			);
		});

		return { frame, config_ui_function };
	},

	["button"]: async function (this_setting: Partial<Extract<Setting, { type: "button" }>>) {
		this_setting.font_size = Number(this_setting.font_size);

		if (this_setting.color == null) {
			this_setting.color = "#ffffff";
		}

		// let frame = settings_ui["setting_frame"](false, true);

		//-------------------------------------

		const button = document.createElement("div");
		button.className = "STYLESHIFT-Button";
		button.style.borderRadius = "20px";

		// frame.appendChild(button);

		//---------------------------------------

		const image = document.createElement("img");
		image.className = "STYLESHIFT-Button-Logo";

		button.append(image);

		//---------------------------------------

		const button_text = document.createElement("div");
		button_text.className = "STYLESHIFT-Button-text";

		button.append(button_text);

		//-------------------------------------

		button.addEventListener("click", function () {
			if (this_setting.click_function == null) return;

			if (typeof this_setting.click_function == "string") {
				run_text_script_from_setting(this_setting, "click_function");
			} else {
				this_setting.click_function();
			}
		});

		//---------------------------------------

		function update_ui() {
			// frame.id = this_setting.id || "";
			button.id = this_setting.id || "";

			//-----------------------------------
			const { r, g, b } = hex_to_rbg(this_setting.color);

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

			button.style.background = `radial-gradient(at center top, rgb(${background_top_color}), rgb(${background_color}, 0.5))`;

			requestAnimationFrame(function () {
				button.style.borderColor = `rgb(${border_color})`;
			});

			//------------------------------------

			if (this_setting.text_align == null) this_setting.text_align = "left";

			button_text.style.justifyContent = this_setting.text_align;
			button_text.style.color = `rgb(${border_color})`;
			button_text.textContent = this_setting.name || "";
			button_text.style.fontSize = String(this_setting.font_size) + "px" || "10px";

			//------------------------------------

			if (this_setting.icon) {
				image.style.display = "";
				image.src = this_setting.icon;
			} else {
				image.style.display = "none";
			}

			//------------------------------------

			if (this_setting.id) button.id = this_setting.id;
		}

		update_ui();

		//-------------------------------------

		button.addEventListener("click", function () {
			button.style.transform = "scale(0.95)";
			setTimeout(() => {
				button.style.transform = "";
			}, 100);
		});

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					Id: "id",
					name: ["name", button_text],
					Description: "description",

					icon: "icon",
					["text align"]: ["text_align", ["left", "center", "right"]],
					color: "color",
					["Font size"]: "font_size",
				},
				update_ui
			);

			//-----------------------------------------------

			await settings_ui["Config_Sub_Section"](parent, this_setting, {
				click: 3,
			});
		});

		return { button, config_ui_function };
	},

	["checkbox"]: async function (
		this_setting: Partial<Extract<Setting, { type: "checkbox" }>>,
		update_function?: Function
	) {
		const frame = settings_ui["setting_frame"](true, true);

		//-------------------------------------

		const sub_frame = settings_ui["setting_frame"](false, false);
		sub_frame.setAttribute("settingtype", "checkbox");
		frame.append(sub_frame);

		//-------------------------------------

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.className = "STYLESHIFT-Checkbox";
		sub_frame.appendChild(checkbox);

		const setting_name = settings_ui["setting_name"]("");
		sub_frame.appendChild(setting_name);

		//-------------------------------------

		async function update_ui() {
			frame.id = this_setting.id || "";

			setting_name.textContent = this_setting.name;

			const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;
			checkbox.checked = value;
		}
		update_ui();

		//-------------------------------------

		async function update_value(value) {
			if (update_function) update_function(value);

			if (this_setting.id) {
				await set_and_save(this_setting, value);
				update_setting_function(this_setting.id);
			}
		}

		//-------------------------------------

		checkbox.addEventListener("change", async function () {
			const value = checkbox.checked;
			update_value(value);
		});

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					Id: "id",
					name: ["name", setting_name],
					Description: "description",
				},
				update_ui
			);

			//-----------------------------------------------

			await settings_ui["Config_Sub_Section"](parent, this_setting, {
				constant: 2,
				setup: 3,
				enable: 0,
				disable: 0,
			});
		});

		return { frame, config_ui_function };
	},

	["number_slide"]: async function (this_setting: Partial<Extract<Setting, { type: "number_slide" }>>) {
		const frame = settings_ui["setting_frame"](true, true);

		//-------------------------------------

		let setting_name;
		if (this_setting.name) {
			setting_name = settings_ui["setting_name"](this_setting.name, "center");
			setting_name.style.marginBottom = "20px";
			frame.appendChild(setting_name);
		}

		//-------------------------------------

		const sub_frame = settings_ui["setting_frame"](false, false, { x: false, y: true });
		sub_frame.style.gap = "5px";
		frame.append(sub_frame);

		const number_slide = settings_ui["number_slide_ui"](sub_frame);

		const number_input = settings_ui["number_input_ui"](sub_frame);

		//-------------------------------------

		async function update_ui() {
			frame.id = this_setting.id || "";

			number_slide.update_number_slide(this_setting.min, this_setting.max, this_setting.step);

			if (setting_name) {
				setting_name.textContent = this_setting.name;
			}

			const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;
			number_slide.number_slide_ui.value = String(value);
			number_input.value = String(value);
		}
		await update_ui();

		async function set_value(value) {
			this_setting.value = value;
			await update_ui();
		}

		//-------------------------------------

		async function update_value(value) {
			if (this_setting.id) {
				await set_and_save(this_setting, value);
				update_setting_function(this_setting.id);
			} else {
				if (typeof this_setting.update_function === "function") {
					this_setting.update_function(value);
				}
			}
		}

		//-------------------------------------

		number_slide.number_slide_ui.addEventListener("change", async function () {
			const value: any = Number(number_slide.number_slide_ui.value);
			number_input.value = value;

			update_value(value);
		});

		number_input.addEventListener("change", async function () {
			const value: any = Number(number_input.value);
			number_input.value = value;
			number_slide.number_slide_ui.value = value;

			update_value(value);
		});

		number_slide.number_slide_ui.addEventListener("input", async function () {
			if (!(await load("Realtime_Extension"))) return;
			const value: any = Number(number_slide.number_slide_ui.value);
			number_input.value = value;

			update_value(value);
		});

		number_input.addEventListener("input", async function () {
			if (!(await load("Realtime_Extension"))) return;
			const value: any = Number(number_input.value);
			number_slide.number_slide_ui.value = value;

			update_value(value);
		});

		number_input.addEventListener("keydown", function (event) {
			if (event.key === "Enter") {
				number_input.blur();
			}
		});

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					Id: "id",
					name: ["name", setting_name],
					Description: "description",

					Min: "min",
					Max: "max",
					Step: "step",
				},
				update_ui
			);

			//-----------------------------------------------

			await settings_ui["Config_Sub_Section"](parent, this_setting, {
				var: 2,
				constant: 2,
				setup: 3,
				update: 3,
			});
		});

		return { frame, config_ui_function, set_value };
	},

	["dropdown"]: async function (this_setting: Partial<Extract<Setting, { type: "dropdown" }>>) {
		const frame = settings_ui["setting_frame"](true, true);

		//------------------------------

		const subframe = settings_ui["setting_frame"](false, false);
		subframe.className += " STYLESHIFT-Dropdown-Frame";
		frame.append(subframe);

		//------------------------------

		const dropdown = await settings_ui["button"]({
			name: "",
			color: "#FFFFFF",
			text_align: "center",
		});
		dropdown.button.className += " STYLESHIFT-Dropdown";
		subframe.appendChild(dropdown.button);

		const setting_name = settings_ui["setting_name"](this_setting.name);
		subframe.appendChild(setting_name);

		//------------------------------

		async function update_ui() {
			frame.id = this_setting.id || "";

			const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;
			dropdown.button.textContent = value;
		}
		update_ui();

		//------------------------------

		async function update_value(old_value, value) {
			if (this_setting.id) {
				await set_and_save(this_setting, value);
				update_setting_function(this_setting.id);
			} else {
				this_setting.value = value;

				if (typeof this_setting.options[old_value].disable_function == "function") {
					this_setting.options[old_value].disable_function();
				}

				if (typeof this_setting.options[value].enable_function == "function") {
					this_setting.options[value].enable_function();
				}
			}
		}

		//------------------------------

		let current_dropdown = null;

		dropdown.button.addEventListener("click", async function () {
			if (current_dropdown) {
				current_dropdown.Cancel();
				return;
			}

			//-----------------------

			current_dropdown = settings_ui["show_dropdown"](Object.keys(this_setting.options), dropdown.button);

			//-----------------------

			const old_value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;
			const value = await current_dropdown.Selection;
			current_dropdown = null;

			//-----------------------

			if (!value) return;

			//-----------------------

			update_value(old_value, value);

			update_ui();
		});

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					Id: "id",
					name: ["name", setting_name],
					Description: "description",
				},
				update_ui
			);

			//-----------------------------------------------

			await settings_ui["Config_Sub_Section"](parent, this_setting, {
				constant: 2,
				setup: 3,
				enable: 0,
				disable: 0,
			});
		});

		return { frame, config_ui_function };
	},

	["color"]: async function (this_setting: Partial<Extract<Setting, { type: "color" }>>) {
		const frame = settings_ui["setting_frame"](true, true, { x: false, y: true });

		//-------------------------------------

		const setting_name = settings_ui["setting_name"](this_setting.name, "center");
		frame.appendChild(setting_name);

		//-------------------------------------

		const sub_frame = settings_ui["setting_frame"](false, false, { x: false, y: true });
		sub_frame.setAttribute("settingtype", "color");
		frame.append(sub_frame);

		//-------------------------------------

		const color = document.createElement("input");
		color.type = "color";
		color.className = "STYLESHIFT-Color";
		sub_frame.appendChild(color);

		//-------------------------------------

		let opacity;
		if (this_setting.show_alpha_slider != false) {
			opacity = await settings_ui["number_slide"]({
				min: 0,
				max: 100,
				step: 1,
				value: 0,
				update_function: function (value) {
					update_value("alpha", value);
				},
			});

			opacity.frame.style.width = "-webkit-fill-available";
			sub_frame.appendChild(opacity.frame);
		}

		//-------------------------------------

		const hex_input = await settings_ui["text_input"]({
			value: "#000000",
			update_function: function (value) {
				const color_obj = hex_to_color_obj(value);

				update_value("hex", color_obj.hex);
				update_value("alpha", color_obj.alpha);
			},
		});
		frame.append(hex_input.frame);

		//-------------------------------------

		async function update_ui() {
			frame.id = this_setting.id || "";

			setting_name.textContent = this_setting.name;

			const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;
			const color_usable_obj = hex_to_color_obj(value);

			color.value = String(color_usable_obj.hex);
			if (opacity) {
				opacity.set_value(color_usable_obj.alpha);
			}

			hex_input.update_ui(value);
		}

		update_ui();

		async function update_config() {
			if (this_setting.id) {
				update_setting_function(this_setting.id);
			}
		}

		//-------------------------------------

		async function update_value(type: "hex" | "alpha", value: any) {
			if (this_setting.id) {
				const color_obj: any = hex_to_color_obj(await load_any(this_setting.id));
				color_obj[type] = value;

				await set_and_save(this_setting, color_obj_to_hex(color_obj));
				update_setting_function(this_setting.id);
			} else {
				const color_obj: any = hex_to_color_obj(this_setting.value);
				color_obj[type] = value;

				this_setting.value = color_obj_to_hex(color_obj);

				if (typeof this_setting.update_function === "function") {
					this_setting.update_function(this_setting.value);
				}
			}

			update_ui();
		}

		//-------------------------------------

		color.addEventListener("change", async function () {
			update_value("hex", color.value);
		});

		color.addEventListener("input", async function () {
			if (!(await load_any("Realtime_Extension"))) return;

			update_value("hex", color.value);
		});

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					Id: "id",
					name: "name",
					Description: "description",
				},
				update_ui
			);

			//-----------------------------------------------

			await settings_ui["Config_Sub_Section"](parent, this_setting, {
				var: 2,
				constant: 2,
				setup: 3,
				update: 3,
				update_config,
			});
		});

		return { frame, config_ui_function };
	},

	["text_input"]: async function (this_setting: Partial<Extract<Setting, { type: "text_input" }>>) {
		const frame = settings_ui["setting_frame"](true, true);

		//-------------------------------------

		const text_input = document.createElement("input");
		text_input.className = "STYLESHIFT-Text-Input";
		frame.appendChild(text_input);

		//-------------------------------------

		async function update_ui(value = null) {
			frame.id = this_setting.id || "";

			if (value == null) value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;

			text_input.value = value;
		}
		update_ui();

		//-------------------------------------

		async function update_value(value) {
			if (this_setting.id) {
				await set_and_save(this_setting, value);
				update_setting_function(this_setting.id);
			} else {
				if (typeof this_setting.update_function === "function") {
					this_setting.update_function(value);
				}
			}
		}

		//-------------------------------------

		text_input.addEventListener("change", async function () {
			const value = text_input.value;
			update_value(value);
		});

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					Id: "id",
				},
				update_ui
			);
		});

		return { frame, config_ui_function, update_ui };
	},

	["image_input"]: async function (this_setting: Partial<Extract<Setting, { type: "image_input" }>>) {
		const frame = settings_ui["setting_frame"](true, true);
		frame.style.display = "flex";
		frame.style.flexDirection = "column";
		frame.style.gap = "8px";

		const file_input = settings_ui["file_input"](async function (file: File) {
			const notification = await create_notification({
				icon: "🔃",
				title: "StyleShift - loading image!",
				content: "(╹ڡ╹ )\nloading image...",
				timeout: -1,
			});

			let image_data = null;

			// Try ImgBB Upload
			try {
				const loading = create_loading_bar();
				const url = await upload_to_imgbb(file, (percent) => {
					loading.update(percent);
				});
				loading.remove();

				if (url) {
					image_data = url;
				}
			} catch (e) {
				console.warn("ImgBB Upload failed, falling back to base64:", e);
			}

			if (!image_data) {
				image_data = await new Promise((resolve, reject) => {
					if (!file.type.startsWith("image/")) {
						notification.set_icon("❌");
						notification.set_title("StyleShift - Failed to load image!");
						notification.set_content("(*￣3￣)╭\nPlease select an image file.");
						setTimeout(() => {
							notification.close();
						}, 5000);
						reject(false);
						return;
					}

					if (
						this_setting.max_file_size &&
						file.size > this_setting.max_file_size &&
						!confirm(`⚠️NEWTUBE WARNING!⚠️

Your file size : ${number_with_commas(file.size)} bytes.
Recommend file size : lower than ${number_with_commas(this_setting.max_file_size)} bytes.

Your file is quite large. (It may cause lag!)

I recommend do one of these.
- compress file
- (image) resize it
- (image) Use image URL instead 
- Use Upload api (Make this is the last choice)

Are you want to continue?`)
					) {
						resolve(null);
						return;
					}

					const reader = new FileReader();

					reader.onloadend = function (event) {
						resolve(event.target.result);
					};

					reader.onerror = function (error) {
						create_error("Error reading file: " + error);
						reject(false);
					};

					reader.readAsDataURL(file);
				});
			}

			if (!image_data) {
				notification.set_icon("❌");
				notification.set_title("StyleShift - Failed to load image!");
				notification.set_content("(っ °Д °;)っ\nimage data is not valid.");
				setTimeout(() => {
					notification.close();
				}, 5000);
				return;
			}

			await set_and_save(this_setting, image_data);
			update_setting_function(this_setting.id);

			notification.set_icon("✅");
			notification.set_title("StyleShift - loaded image!");
			notification.set_content("(/≧▽≦)/ Complete!\n(Please wait if image not showing!)");
			setTimeout(() => {
				notification.close();
			}, 5000);
		}, "image/*");

		// Style the file input wrapper to look like a button if it isn't already
		file_input.style.width = "100%";
		// Assuming file_input creates a button-like feel, or we might need to wrap it.
		// Let's add a label
		const label = document.createElement("div");
		label.textContent = "Upload Image / Paste URL:";
		label.style.marginBottom = "4px";
		label.style.fontSize = "12px";
		label.style.opacity = "0.8";

		frame.append(label);
		frame.append(file_input);

		const text_input = (
			await settings_ui["text_input"]({
				...this_setting,
				type: "text_input",
				update_function: async function (value) {
					if (this_setting.id) {
						await set_and_save(this_setting, value);
						update_setting_function(this_setting.id);
					}
				},
			})
		).frame;
		text_input.querySelector("input").placeholder = "https://example.com/image.png";
		frame.append(text_input);

		//-----------------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](parent, this_setting, {
				["Soruce setting Id"]: "id",
			});
		});

		return { frame, config_ui_function };
	},

	["preview_image"]: async function (this_setting: Partial<Extract<Setting, { type: "preview_image" }>>) {
		const frame = settings_ui["setting_frame"](true, true);

		const image_frame = document.createElement("img");
		image_frame.className = "STYLESHIFT-preview_image";
		frame.appendChild(image_frame);

		//-----------------------------------------------

		async function update_image(value) {
			image_frame.src = value;
		}

		//-----------------------------------------------

		let old_source_id;
		async function update_ui() {
			if (old_source_id != this_setting.id) {
				await remove_on_setting_update(old_source_id, update_image);
				old_source_id = this_setting.id;
				if (!this_setting.id || this_setting.id == "") return;
				await on_setting_update(this_setting.id, update_image);
			}

			update_image(await load_setting(this_setting.id));
		}
		update_ui();

		once_element_remove(image_frame, async function () {
			remove_on_setting_update(old_source_id, update_image);
		});

		//-----------------------------------------------

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					["Soruce setting Id"]: "id",
				},
				update_ui
			);
		});

		return { frame, config_ui_function };
	},

	["custom"]: async function (this_setting: Partial<Extract<Setting, { type: "custom" }>>) {
		const frame = settings_ui["setting_frame"](true, true);
		frame.id = this_setting.id || create_unique_id(10);

		if (typeof this_setting.ui_function === "function") {
			(this_setting.ui_function as Function)(frame);
		} else if (typeof this_setting.ui_function === "string") {
			run_text_script({
				text: this_setting["ui_function"],
				code_name: `${this_setting.id} : ui_function`,
				args: JSON.stringify({ setting_id: frame.id }),
			});
		}

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](parent, this_setting, {
				Id: "id",
			});

			//-----------------------------------------------

			await settings_ui["Config_Sub_Section"](parent, this_setting, {
				constant: 2,
				setup: 3,
				ui: ["function"],
			});
		});

		return { frame, config_ui_function };
	},

	["combine_settings"]: async function (this_setting: Partial<Extract<Setting, { type: "combine_settings" }>>) {
		const frame = settings_ui["setting_frame"](true, true);
		frame.setAttribute("settingtype", "combine_settings");

		const config_ui_function = await create_config_ui_function(this_setting.editable, async function (parent) {
			await settings_ui["Config_Main_Section"](
				parent,
				this_setting,
				{
					Id: "id",
					name: "name",
					Description: "description",
					["Sync IDs"]: ["sync_id"],
				},
				async function () {
					if (this_setting.id) {
						update_setting_function(this_setting.id);
					}
				}
			);

			await settings_ui["Config_Sub_Section"](parent, this_setting, {
				update: 3,
			});
		});

		return { frame, config_ui_function };
	},
};
