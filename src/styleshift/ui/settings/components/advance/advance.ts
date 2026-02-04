import { apply_drag } from "../../../../build-in-functions/normal";
import { save_all } from "../../../../core/save";
import { is_firefox, in_setting_page } from "../../../../run";
import { update_setting_function } from "../../../../settings/functions";
import { Category } from "../../../../types/store";
import { settings_ui } from "../../setting-components";
import { create_config_ui_function, setup_left_title_animation } from "../../settings";

// @ts-ignore
import FrameComponent from "./Frame.svelte";
// @ts-ignore
import SpaceComponent from "./Space.svelte";
// @ts-ignore
import TitleComponent from "./Title.svelte";
// @ts-ignore
import LeftTitleComponent from "./LeftTitle.svelte";
// @ts-ignore
import TextEditorComponent from "./TextEditor.svelte";
// @ts-ignore
import CodeEditorComponent from "./CodeEditor.svelte";
// @ts-ignore
import IconButtonComponent from "./IconButton.svelte";
// @ts-ignore
import DropdownComponent from "../main/Dropdown.svelte";
// @ts-ignore
import SettingNameComponent from "./SettingName.svelte";
// @ts-ignore
import BasicSliderComponent from "./BasicSlider.svelte";
// @ts-ignore
import BasicNumberInputComponent from "./BasicNumberInput.svelte";
// @ts-ignore
import FileInputComponent from "./FileInput.svelte";
// @ts-ignore
import CollapseSectionComponent from "./CollapseSection.svelte";
// @ts-ignore
import { mount, unmount } from "svelte";

export const advance_setting_ui = {
	["fill_screen"]: function (fill_bg: boolean = true) {
		const target = document.createElement("div");

		mount(FrameComponent as any, {
			target: target,
			props: {
				className: "STYLESHIFT-FillScreen",
				transparent: !fill_bg,
				style: fill_bg ? "" : "pointer-events: none;",
			},
		});

		return target.firstElementChild as HTMLDivElement;
	},

	["setting_frame"]: function (
		padding: boolean = true,
		vertical: boolean = true,
		center: { x: boolean; y: boolean } = { x: false, y: false },
		transparent = false,
	) {
		const target = document.createElement("div");

		mount(FrameComponent as any, {
			target: target,
			props: {
				padding,
				vertical,
				centerX: center.x,
				centerY: center.y,
				transparent,
			},
		});

		return target.firstElementChild as HTMLDivElement;
	},

	["file_input"]: function (callback: (file: File) => void, type: string | null = null) {
		const target = document.createElement("div");

		mount(FileInputComponent as any, {
			target: target,
			props: {
				accept: type,
				onFileSelect: callback,
			},
		});

		return target.firstElementChild as HTMLDivElement;
	},

	["text_editor"]: function (obj: any = {}, key: string = "") {
		const target = document.createElement("div");

		let additinal_onchange: ((value: string) => void) | null = null;
		let rearrange_value: ((value: string) => Promise<string> | string) | null = null;

		let on_change = async function (value: string) {
			obj[key] = value;
			save_all();
			if (additinal_onchange) {
				additinal_onchange(value);
			}
		};

		mount(TextEditorComponent as any, {
			target: target,
			props: {
				value: obj[key] || "",
				onInput: (val: string) => on_change(val),
				onBlur: async (val: string) => {
					let final_value = val;
					if (rearrange_value) {
						final_value = await rearrange_value(final_value);
					}
					on_change(final_value);
				},
			},
		});

		const text_editor = target.firstElementChild as HTMLTextAreaElement;

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

		const target = document.createElement("div");
		parent.append(target);

		let code_editor_instance: any;

		if (!is_firefox || in_setting_page) {
			code_editor_instance = mount(CodeEditorComponent as any, {
				target: target,
				props: {
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
			});
		} else {
			const text_editor = settings_ui["text_editor"](obj, key);
			(text_editor.text_editor as HTMLElement).style.height = height + "px";
			target.append(text_editor.text_editor as HTMLElement);

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
		const target = document.createElement("div");

		mount(SettingNameComponent as any, {
			target: target,
			props: {
				text,
				align: position,
			},
		});

		return target.firstElementChild as HTMLDivElement;
	},

	["drag"]: function (target: HTMLElement) {
		const div = document.createElement("div");

		mount(IconButtonComponent as any, {
			target: div,
			props: {
				icon: "=",
				className: "STYLESHIFT-Drag-Top",
				onClick: () => {},
			},
		});

		const drag = div.firstElementChild as HTMLDivElement;
		apply_drag(drag, target);

		return drag;
	},

	["close"]: function () {
		const div = document.createElement("div");

		mount(IconButtonComponent as any, {
			target: div,
			props: {
				icon: "X",
				className: "STYLESHIFT-Close",
				onClick: () => {},
			},
		});

		return div.firstElementChild as HTMLDivElement;
	},

	["title"]: async function (this_category: Category) {
		const target = document.createElement("div");

		function update_ui() {
			target.innerHTML = "";
			mount(TitleComponent as any, {
				target: target,
				props: {
					text: this_category.category,
					rainbow: this_category.rainbow,
				},
			});
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
		const target = document.createElement("div");

		mount(LeftTitleComponent as any, {
			target: target,
			props: {
				category,
				skipAnimation: skip_animation,
			},
		});

		const title = target.firstElementChild as HTMLDivElement;

		if (!skip_animation) {
			setup_left_title_animation(title);
		}

		return title;
	},

	["Sub_title"]: function (text: string) {
		const target = document.createElement("div");

		mount(TitleComponent as any, {
			target: target,
			props: {
				text,
				subtitle: true,
			},
		});

		return target.firstElementChild as HTMLDivElement;
	},

	["collapsed_button"]: async function (button_name: string, color: string, target_element: HTMLElement) {
		const parent = target_element.parentElement;
		const target = document.createElement("div");

		if (parent) {
			parent.insertBefore(target, target_element);
		}

		mount(CollapseSectionComponent as any, {
			target: target,
			props: {
				buttonName: button_name,
				color: color,
				children: () => {
					return target_element;
				},
			},
		});

		return { button: target.firstElementChild as HTMLDivElement };
	},

	["show_dropdown"]: function (options: any, target: HTMLElement) {
		let resolve_selection: (value: string | null) => void;
		const selection_promise = new Promise<string | null>((resolve) => {
			resolve_selection = resolve;
		});

		const container = document.createElement("div");
		document.body.appendChild(container);

		const dropdown = mount(DropdownComponent as any, {
			target: container,
			props: {
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
		});

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
		const target = document.createElement("div");
		parent.appendChild(target);

		mount(BasicSliderComponent as any, {
			target: target,
			props: {},
		});

		const number_slide_ui = target.firstElementChild as HTMLInputElement;

		function update_number_slide(min: number = 0, max: number = 100, step: number = 1) {
			number_slide_ui.min = min.toString();
			number_slide_ui.max = max.toString();
			number_slide_ui.step = step.toString();
		}

		return { number_slide_ui, update_number_slide };
	},

	["number_input_ui"]: function (parent: HTMLElement) {
		const target = document.createElement("div");
		parent.appendChild(target);

		mount(BasicNumberInputComponent as any, {
			target: target,
			props: {},
		});

		return target.firstElementChild as HTMLDivElement;
	},

	["space"]: async function (parent: HTMLElement, size: number = 20) {
		mount(SpaceComponent as any, {
			target: parent,
			props: {
				size,
			},
		});
	},
};
