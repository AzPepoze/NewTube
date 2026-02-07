import { apply_drag } from "@functions/normal";
import { save_all } from "@core/save";
import { is_firefox, in_setting_page } from "@/styleshift/run";
import { update_setting_function } from "@settings/functions";
import { Category } from "@styleshift/types/store";
import { settings_ui } from "@ui/settings/setting-components";
import { create_config_ui_function, setup_left_title_animation } from "@ui/settings/settings";

import FrameComponent from "./Frame.svelte";
import SpaceComponent from "./Space.svelte";
import TitleComponent from "./Title.svelte";
import LeftTitleComponent from "./LeftTitle.svelte";
import TextEditorComponent from "./TextEditor.svelte";
import CodeEditorComponent from "./CodeEditor.svelte";
import IconButtonComponent from "./IconButton.svelte";
import DropdownComponent from "@ui/settings/components/main/Dropdown.svelte";
import SettingNameComponent from "./SettingName.svelte";
import dragIcon from "@ui/assets/icons/drag.svg";
import closeIcon from "@ui/assets/icons/close.svg";
import BasicSliderComponent from "./BasicSlider.svelte";
import BasicNumberInputComponent from "./BasicNumberInput.svelte";
import FileInputComponent from "./FileInput.svelte";
import CollapseSectionComponent from "./CollapseSection.svelte";
import ResizeHandleComponent from "./ResizeHandle.svelte";
import { unmount } from "svelte";

export const advance_setting_ui = {
	["resize_handle"]: function (target: HTMLElement, position: "top" | "right" | "bottom" | "left" = "right") {
		return settings_ui.render_component(ResizeHandleComponent, {
			target,
			position,
		}) as HTMLDivElement;
	},

	["fill_screen"]: function (fill_bg: boolean = true) {
		return settings_ui.render_component(FrameComponent, {
			className: "STYLESHIFT-FillScreen",
			transparent: !fill_bg,
			style: fill_bg ? "" : "pointer-events: none;",
		}) as HTMLDivElement;
	},

	["setting_frame"]: function (
		padding: boolean = true,
		vertical: boolean = true,
		center: { x: boolean; y: boolean } = { x: false, y: false },
		transparent = false,
	) {
		return settings_ui.render_component(FrameComponent, {
			padding,
			vertical,
			centerX: center.x,
			centerY: center.y,
			transparent,
		}) as HTMLDivElement;
	},

	["file_input"]: function (callback: (file: File) => void, type: string | null = null) {
		return settings_ui.render_component(FileInputComponent, {
			accept: type,
			onFileSelect: callback,
		}) as HTMLDivElement;
	},

	["text_editor"]: function (obj: any = {}, key: string = "") {
		let additinal_onchange: ((value: string) => void) | null = null;
		let rearrange_value: ((value: string) => Promise<string> | string) | null = null;

		let on_change = async function (value: string) {
			obj[key] = value;
			save_all();
			if (additinal_onchange) {
				additinal_onchange(value);
			}
		};

		const text_editor = settings_ui.render_component(TextEditorComponent, {
			value: obj[key] || "",
			onInput: (val: string) => on_change(val),
			onBlur: async (val: string) => {
				let final_value = val;
				if (rearrange_value) {
					final_value = await rearrange_value(final_value);
				}
				on_change(final_value);
			},
		}) as HTMLTextAreaElement;

		return {
			text_editor: text_editor,
			on_change: function (callback: (value: string) => void | Promise<void>) {
				on_change = callback as any;
			},
			additinal_onchange: function (callback: (value: string) => void) {
				additinal_onchange = callback;
			},
			rearrange_value: function (callback: (value: string) => Promise<string> | string) {
				rearrange_value = callback;
			},
		};
	},

	["code_editor"]: async function (
		parent: HTMLDivElement,
		obj: any,
		key: string,
		language: string,
		height: number = 400,
	) {
		let additinal_onchange: ((value: string) => void) | null = null;
		let rearrange_value: ((value: string) => Promise<string> | string) | null = null;

		let on_change = async function (value: string) {
			obj[key] = value;
			save_all();

			if (obj["id"]) {
				update_setting_function(obj["id"]);
			}

			if (additinal_onchange) {
				additinal_onchange(value);
			}
		};

		let code_editor_instance: any;

		if (!is_firefox || in_setting_page) {
			const target = document.createElement("div");
			parent.append(target);
			code_editor_instance = (settings_ui as any).render_component(
				CodeEditorComponent,
				{
					value: obj[key],
					language: language,
					height: height,
					onInput: (val: string) => on_change(val),
					onBlur: async (val: string) => {
						let final_value = val;
						if (rearrange_value) {
							final_value = await rearrange_value(final_value);
							code_editor_instance.setValue(final_value);
						}
						on_change(final_value);
					},
				},
				target,
			);
		} else {
			const text_editor = settings_ui["text_editor"](obj, key);
			(text_editor.text_editor as HTMLElement).style.height = height + "px";
			parent.append(text_editor.text_editor as HTMLElement);

			text_editor.on_change(async function (value: string) {
				on_change(value);
			});
		}

		return {
			on_change: function (callback: (value: string) => void | Promise<void>) {
				on_change = callback as any;
			},
			additinal_onchange: function (callback: (value: string) => void) {
				additinal_onchange = callback;
			},
			rearrange_value: function (callback: (value: string) => Promise<string> | string) {
				rearrange_value = callback;
			},
		};
	},

	["setting_name"]: function (text: string, position: "left" | "center" | "right" = "left") {
		return settings_ui.render_component(SettingNameComponent, {
			text,
			align: position,
		}) as HTMLDivElement;
	},

	["drag"]: function (target: HTMLElement) {
		const drag = settings_ui.render_component(IconButtonComponent, {
			icon: dragIcon,
			className: "STYLESHIFT-Drag-Top",
			onClick: () => {},
		}) as HTMLDivElement;

		apply_drag(drag, target);
		return drag;
	},

	["close"]: function () {
		return settings_ui.render_component(IconButtonComponent, {
			icon: closeIcon,
			className: "STYLESHIFT-Close",
			onClick: () => {},
		}) as HTMLDivElement;
	},

	["title"]: async function (this_category: Category) {
		const target = document.createElement("div");

		function update_ui() {
			target.innerHTML = "";
			settings_ui.render_component(
				TitleComponent,
				{
					text: this_category.category,
					rainbow: this_category.rainbow,
				},
				target,
			);
		}
		update_ui();

		const frame = target as HTMLDivElement;

		const config_ui_function = await create_config_ui_function(
			this_category.editable,
			async function (parent: HTMLDivElement) {
				await settings_ui["Config_Main_Section"](
					parent,
					this_category,
					{
						name: ["Category", frame],
						Selector: "Selector",
						Rainbow: "Rainbow",
					},
					update_ui,
				);
			},
		);

		return { frame, config_ui_function };
	},

	["Left-title"]: function (category: string, skip_animation: boolean) {
		const title = settings_ui.render_component(LeftTitleComponent, {
			category,
			skipAnimation: skip_animation,
		}) as HTMLDivElement;

		if (!skip_animation) {
			setup_left_title_animation(title);
		}

		return title;
	},

	["Sub_title"]: function (text: string) {
		return settings_ui.render_component(TitleComponent, {
			text,
			subtitle: true,
		}) as HTMLDivElement;
	},

	["collapsed_button"]: async function (button_name: string, color: string, target_element: HTMLElement) {
		const parent = target_element.parentElement;
		const target = document.createElement("div");

		if (parent) {
			parent.insertBefore(target, target_element);
		}

		settings_ui.render_component(
			CollapseSectionComponent,
			{
				buttonName: button_name,
				color: color,
				children: () => {
					return target_element;
				},
			},
			target,
		);

		return { button: target.firstElementChild as HTMLDivElement };
	},

	["show_dropdown"]: function (options: any, target: HTMLElement) {
		let resolve_selection: (value: string | null) => void;
		const selection_promise = new Promise<string | null>((resolve) => {
			resolve_selection = resolve;
		});

		const container = document.createElement("div");
		document.body.appendChild(container);

		const dropdown = (settings_ui as any).render_component(
			DropdownComponent,
			{
				options,
				triggerEl: target,
				isOpen: true,
				justMenu: true,
				onUpdate: (option: string) => {
					resolve_selection(option);
					remove_dropdown();
				},
				onClose: () => {
					resolve_selection(null);
					remove_dropdown();
				},
			},
			container,
		);

		function remove_dropdown() {
			if (container.parentNode) {
				unmount(dropdown);
				container.remove();
			}
		}

		return {
			Selection: selection_promise,
			Cancel: remove_dropdown,
		};
	},

	["number_slide_ui"]: function (parent: HTMLElement) {
		const number_slide_ui = settings_ui.render_component(BasicSliderComponent, {}, parent) as HTMLInputElement;

		function update_number_slide(min: number = 0, max: number = 100, step: number = 1) {
			number_slide_ui.min = min.toString();
			number_slide_ui.max = max.toString();
			number_slide_ui.step = step.toString();
		}

		return { number_slide_ui, update_number_slide };
	},

	["number_input_ui"]: function (parent: HTMLElement) {
		return settings_ui.render_component(BasicNumberInputComponent, {}, parent) as HTMLDivElement;
	},

	["space"]: async function (parent: HTMLElement, size: number = 20) {
		settings_ui.render_component(SpaceComponent, { size }, parent);
	},
};
