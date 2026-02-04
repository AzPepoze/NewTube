import { create_notification, create_error } from "../../../../build-in-functions/extension";
import { once_element_remove, create_unique_id } from "../../../../build-in-functions/normal";
import {
	run_text_script_from_setting,
	hex_to_color_obj,
	color_obj_to_hex,
	run_text_script,
} from "../../../../core/extension";
import { load_any, load_setting } from "../../../../core/save";
import { update_setting_function, remove_on_setting_update, on_setting_update } from "../../../../settings/functions";
import { Setting } from "../../../../types/store";
import { settings_ui, set_and_save } from "../../setting-components";
import { create_config_ui_function } from "../../settings";
import { upload_to_imgbb, create_loading_bar } from "../../../../../main/features/upload";

// @ts-ignore
import CheckboxComponent from "./Checkbox.svelte";
// @ts-ignore
import ButtonComponent from "./Button.svelte";
// @ts-ignore
import SliderComponent from "./Slider.svelte";
// @ts-ignore
import TextInputComponent from "./TextInput.svelte";
// @ts-ignore
import ColorPickerComponent from "./ColorPicker.svelte";
// @ts-ignore
import DropdownComponent from "./Dropdown.svelte";
// @ts-ignore
import TextComponent from "./Text.svelte";
// @ts-ignore
import ImageInputComponent from "./ImageInput.svelte";
// @ts-ignore
import PreviewImageComponent from "./PreviewImage.svelte";
// @ts-ignore
import { mount } from "svelte";

export const main_setting_ui = {
	["text"]: async function (this_setting: Partial<Extract<Setting, { type: "text" }>>) {
		const target = document.createElement("div");

		function update_ui() {
			target.innerHTML = "";
			mount(TextComponent, {
				target: target,
				props: {
					id: this_setting.id,
					html: this_setting.html,
					fontSize: this_setting.font_size,
					textAlign:
						this_setting.align === "left"
							? "start"
							: this_setting.align === "right"
								? "end"
								: "center",
				},
			});
		}
		update_ui();

		const frame = target as HTMLDivElement;

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_setting,
					{
						text: "html",

						["text align"]: ["align", ["left", "center", "right"]],
						["Font size"]: "font_size",
					},
					update_ui,
				);
			},
		);

		return { frame, config_ui_function };
	},
	["sub_text"]: async function (this_setting: Partial<Extract<Setting, { type: "sub_text" }>>) {
		const target = document.createElement("div");

		function update_ui() {
			target.innerHTML = "";
			mount(TextComponent, {
				target: target,
				props: {
					text: this_setting.text,
					fontSize: this_setting.font_size,
					color: this_setting.color,
					textAlign:
						this_setting.align === "left"
							? "start"
							: this_setting.align === "right"
								? "end"
								: "center",
					className: "STYLESHIFT-Setting-Sub-Title",
				},
			});
		}
		update_ui();

		const frame = target as HTMLDivElement;

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_setting,
					{
						text: "text",

						["text align"]: ["align", ["left", "center", "right"]],
						color: "color",
						["Font size"]: "font_size",
					},
					update_ui,
				);
			},
		);

		return { frame, config_ui_function };
	},

	["button"]: async function (this_setting: Partial<Extract<Setting, { type: "button" }>>) {
		const target = document.createElement("div");

		let button_instance: object | null = null;

		function update_ui() {
			if (button_instance) {
				// Re-mount or update props if we had a way. For now, we'll just re-mount for simplicity in dev mode
				button_instance = mount(ButtonComponent, {
					target: target,
					props: {
						id: this_setting.id,
						name: this_setting.name,
						description: this_setting.description,
						icon: this_setting.icon,
						color: this_setting.color || "#ffffff",
						onClick: () => {
							if (this_setting.click_function == null) return;
							if (typeof this_setting.click_function == "string") {
								run_text_script_from_setting(this_setting, "click_function");
							} else {
								(this_setting.click_function as Function)();
							}
						},
					},
				});
			}
		}

		button_instance = mount(ButtonComponent, {
			target: target,
			props: {
				id: this_setting.id,
				name: this_setting.name,
				description: this_setting.description,
				icon: this_setting.icon,
				color: this_setting.color || "#ffffff",
				onClick: () => {
					if (this_setting.click_function == null) return;
					if (typeof this_setting.click_function == "string") {
						run_text_script_from_setting(this_setting, "click_function");
					} else {
						(this_setting.click_function as Function)();
					}
				},
			},
		});

		const button = target.firstElementChild as HTMLDivElement;

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_setting,
					{
						Id: "id",
						name: ["name", update_ui],
						Description: "description",

						icon: "icon",
						["text align"]: ["align", ["left", "center", "right"]],
						color: "color",
						["Font size"]: "font_size",
					},
					update_ui,
				);

				//-----------------------------------------------

				await settings_ui["Config_Sub_Section"](parent, this_setting, {
					click: 3,
				});
			},
		);

		return { button, config_ui_function };
	},

	["checkbox"]: async function (
		this_setting: Partial<Extract<Setting, { type: "checkbox" }>>,
		update_function?: Function,
	) {
		const target = document.createElement("div");
		const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;

		function update_ui() {
			// Svelte component handles internal state, but we can re-mount if name/description changes in dev mode
		}

		mount(CheckboxComponent, {
			target: target,
			props: {
				id: this_setting.id,
				name: this_setting.name,
				description: this_setting.description,
				value: value,
				onUpdate: async (new_value: boolean) => {
					if (update_function) update_function(new_value);

					if (this_setting.id) {
						await set_and_save(this_setting, new_value);
						update_setting_function(this_setting.id);
					}
				},
			},
		});

		const frame = target.firstElementChild as HTMLDivElement;

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_setting,
					{
						Id: "id",
						name: ["name", update_ui],
						Description: "description",
					},
					update_ui,
				);

				//-----------------------------------------------

				await settings_ui["Config_Sub_Section"](parent, this_setting, {
					constant: 2,
					setup: 3,
					enable: 0,
					disable: 0,
				});
			},
		);

		return { frame, config_ui_function };
	},

	["number_slide"]: async function (this_setting: Partial<Extract<Setting, { type: "number_slide" }>>) {
		const target = document.createElement("div");
		const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;

		function update_ui() {
			// Svelte component handles internal state
		}

		const component_instance = mount(SliderComponent, {
			target: target,
			props: {
				id: this_setting.id,
				name: this_setting.name,
				description: this_setting.description,
				value: Number(value),
				min: this_setting.min || 0,
				max: this_setting.max || 100,
				step: this_setting.step || 1,
				unit: this_setting.unit,
				onUpdate: async (new_value: number) => {
					if (this_setting.id) {
						await set_and_save(this_setting, new_value);
						update_setting_function(this_setting.id);
					} else {
						if (typeof this_setting.update_function === "function") {
							(this_setting.update_function as Function)(new_value);
						}
					}
				},
			},
		});

		const frame = target.firstElementChild as HTMLDivElement;

		async function set_value(value: number) {
			// In Svelte 5, you update props directly or via state.
			if (component_instance) {
				(component_instance as { value: number }).value = value;
			}
		}

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_setting,
					{
						Id: "id",
						name: ["name", update_ui],
						Description: "description",

						Min: "min",
						Max: "max",
						Step: "step",
					},
					update_ui,
				);

				//-----------------------------------------------

				await settings_ui["Config_Sub_Section"](parent, this_setting, {
					var: 2,
					constant: 2,
					setup: 3,
					update: 3,
				});
			},
		);

		return { frame, config_ui_function, set_value };
	},

	["dropdown"]: async function (this_setting: Partial<Extract<Setting, { type: "dropdown" }>>) {
		const target = document.createElement("div");
		const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;

		function update_ui() {
			// Svelte component handles internal state
		}

		mount(DropdownComponent, {
			target: target,
			props: {
				id: this_setting.id,
				name: this_setting.name,
				description: this_setting.description,
				value: value,
				options: Object.keys(this_setting.options),
				onUpdate: async (new_value: string) => {
					const old_value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;

					if (this_setting.id) {
						await set_and_save(this_setting, new_value);
						update_setting_function(this_setting.id);
					} else {
						this_setting.value = new_value;

						if (this_setting.options[old_value]?.disable_function) {
							if (typeof this_setting.options[old_value].disable_function === "function") {
								(this_setting.options[old_value].disable_function as Function)();
							}
						}

						if (this_setting.options[new_value]?.enable_function) {
							if (typeof this_setting.options[new_value].enable_function === "function") {
								(this_setting.options[new_value].enable_function as Function)();
							}
						}
					}
				},
			},
		});

		const frame = target.firstElementChild as HTMLDivElement;

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_setting,
					{
						Id: "id",
						name: ["name", update_ui],
						Description: "description",
					},
					update_ui,
				);

				//-----------------------------------------------

				await settings_ui["Config_Sub_Section"](parent, this_setting, {
					constant: 2,
					setup: 3,
					enable: 0,
					disable: 0,
				});
			},
		);

		return { frame, config_ui_function };
	},

	["color"]: async function (this_setting: Partial<Extract<Setting, { type: "color" }>>) {
		const target = document.createElement("div");
		const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;
		const color_usable_obj = hex_to_color_obj(value);

		function update_ui() {
			// Svelte component handles internal state
		}

		mount(ColorPickerComponent, {
			target: target,
			props: {
				id: this_setting.id,
				name: this_setting.name,
				description: this_setting.description,
				hex: color_usable_obj.hex,
				alpha: color_usable_obj.alpha,
				onUpdate: async (new_hex: string, new_alpha: number) => {
					const new_color_hex = color_obj_to_hex({ hex: new_hex, alpha: new_alpha });

					if (this_setting.id) {
						await set_and_save(this_setting, new_color_hex);
						update_setting_function(this_setting.id);
					} else {
						this_setting.value = new_color_hex;
						if (typeof this_setting.update_function === "function") {
							(this_setting.update_function as Function)(this_setting.value);
						}
					}
				},
			},
		});

		const frame = target.firstElementChild as HTMLDivElement;

		async function update_config() {
			if (this_setting.id) {
				update_setting_function(this_setting.id);
			}
		}

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_setting,
					{
						Id: "id",
						name: "name",
						Description: "description",
					},
					update_ui,
				);

				//-----------------------------------------------

				await settings_ui["Config_Sub_Section"](parent, this_setting, {
					var: 2,
					constant: 2,
					setup: 3,
					update: 3,
					update_config,
				});
			},
		);

		return { frame, config_ui_function };
	},

	["text_input"]: async function (this_setting: Partial<Extract<Setting, { type: "text_input" }>>) {
		const target = document.createElement("div");
		const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;

		function update_ui() {
			// Svelte component handles internal state
		}

		mount(TextInputComponent, {
			target: target,
			props: {
				id: this_setting.id,
				name: this_setting.name,
				description: this_setting.description,
				value: value,
				onUpdate: async (new_value: string) => {
					if (this_setting.id) {
						await set_and_save(this_setting, new_value);
						update_setting_function(this_setting.id);
					} else {
						if (typeof this_setting.update_function === "function") {
							(this_setting.update_function as Function)(new_value);
						}
					}
				},
			},
		});

		const frame = target.firstElementChild as HTMLDivElement;

		//-------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_setting,
					{
						Id: "id",
						name: ["name", update_ui],
						Description: "description",
					},
					update_ui,
				);

				//-----------------------------------------------

				await settings_ui["Config_Sub_Section"](parent, this_setting, {
					var: 2,
					constant: 2,
					setup: 3,
					update: 3,
				});
			},
		);

		return { frame, config_ui_function };
	},

	["image_input"]: async function (this_setting: Partial<Extract<Setting, { type: "image_input" }>>) {
		const target = document.createElement("div");
		const value = this_setting.id ? await load_any(this_setting.id) : this_setting.value;

		mount(ImageInputComponent, {
			target: target,
			props: {
				id: this_setting.id,
				name: this_setting.name,
				description: this_setting.description,
				value: value,
				onFileSelect: async (file: File) => {
					const notification = await create_notification({
						icon: "🔃",
						title: "StyleShift - loading image!",
						content: "(╹ڡ╹ )\nloading image...",
						timeout: -1,
					});

					let image_data = null;

					try {
						const loading = create_loading_bar();
						const url = (await upload_to_imgbb(file, (percent) => {
							loading.update(percent);
						})) as string;
						loading.remove();

						if (url) {
							image_data = url;
						}
					} catch (e) {
						console.warn("ImgBB Upload failed, falling back to base64:", e);
					}

					if (!image_data) {
						image_data = (await new Promise((resolve, reject) => {
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

							const reader = new FileReader();
							reader.onloadend = function (event) {
								resolve(event.target.result as string);
							};
							reader.onerror = function (error) {
								create_error("Error reading file: " + error);
								reject(false);
							};
							reader.readAsDataURL(file);
						})) as string;
					}

					if (image_data) {
						await set_and_save(this_setting, image_data);
						update_setting_function(this_setting.id);

						notification.set_icon("✅");
						notification.set_title("StyleShift - loaded image!");
						notification.set_content("(/≧▽≦)/ Complete!\n(Please wait if image not showing!)");
						setTimeout(() => {
							notification.close();
						}, 5000);
					}
				},
				onUrlUpdate: async (val: string) => {
					if (this_setting.id) {
						await set_and_save(this_setting, val);
						update_setting_function(this_setting.id);
					}
				},
			},
		});

		const frame = target.firstElementChild as HTMLDivElement;

		//-----------------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](parent, this_setting, {
					["Soruce setting Id"]: "id",
				});
			},
		);

		return { frame, config_ui_function };
	},

	["preview_image"]: async function (this_setting: Partial<Extract<Setting, { type: "preview_image" }>>) {
		const target = document.createElement("div");

		const preview_instance = mount(PreviewImageComponent, {
			target: target,
			props: {
				src: (await load_setting(this_setting.id)) as string,
			},
		}) as { src: string };

		async function update_image(value: string) {
			if (preview_instance) {
				preview_instance.src = value;
			}
		}

		const frame = target.firstElementChild as HTMLDivElement;

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

		once_element_remove(frame, async function () {
			remove_on_setting_update(old_source_id, update_image);
		});

		//-----------------------------------------------

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_setting,
					{
						["Soruce setting Id"]: "id",
					},
					update_ui,
				);
			},
		);

		return { frame, config_ui_function };
	},

	["custom"]: async function (this_setting: Partial<Extract<Setting, { type: "custom" }>>) {
		const frame = settings_ui["setting_frame"](true, true) as HTMLDivElement;
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

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](parent, this_setting, {
					Id: "id",
				});

				//-----------------------------------------------

				await settings_ui["Config_Sub_Section"](parent, this_setting, {
					constant: 2,
					setup: 3,
					ui: ["function"],
				});
			},
		);

		return { frame, config_ui_function };
	},

	["combine_settings"]: async function (this_setting: Partial<Extract<Setting, { type: "combine_settings" }>>) {
		const frame = settings_ui["setting_frame"](true, true) as HTMLDivElement;
		frame.setAttribute("settingtype", "combine_settings");

		const config_ui_function = await create_config_ui_function(
			this_setting.editable,
			async function (parent: HTMLDivElement) {
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
					},
				);

				await settings_ui["Config_Sub_Section"](parent, this_setting, {
					update: 3,
				});
			},
		);

		return { frame, config_ui_function };
	},
};
