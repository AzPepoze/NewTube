import { applyDrag, sequencedTask } from "@/styleshift/shared/normal";
import { getRootValue } from "@/styleshift/core/storageManager";
import { triggerSettingUpdate } from "@settings/functions";
import { Category } from "@styleshift/types/store";
import { settingsUi } from "@ui/settings/settingComponents";
import { createConfigUiFunction, setupLeftTitleAnimation } from "@ui/settings/settings";

import FrameComponent from "./Frame.svelte";
import SpaceComponent from "./Space.svelte";
import TitleComponent from "./Title.svelte";
import LeftTitleComponent from "./LeftTitle.svelte";
import TextEditorComponent from "./TextEditor.svelte";
import CodeEditorComponent from "./CodeEditor.svelte";
import IconButtonComponent from "./IconButton.svelte";
import DropdownComponent from "@ui/settings/components/main/Dropdown.svelte";
import SettingNameComponent from "./SettingName.svelte";
import BasicSliderComponent from "./BasicSlider.svelte";
import BasicNumberInputComponent from "./BasicNumberInput.svelte";
import FileInputComponent from "./FileInput.svelte";
import CollapseSectionComponent from "./CollapseSection.svelte";
import ResizeHandleComponent from "./ResizeHandle.svelte";
import { unmount, mount } from "svelte";
const dragIcon = "assets/icons/drag.svg";
const closeIcon = "assets/icons/close.svg";

export function resizeHandle(target: HTMLElement, position: "top" | "right" | "bottom" | "left" = "right") {
	return settingsUi.renderComponent(ResizeHandleComponent, {
		target,
		position,
	}) as HTMLDivElement;
}

export function fillScreen(fillBg: boolean = true) {
	return settingsUi.renderComponent(FrameComponent, {
		className: "STYLESHIFT-FillScreen",
		transparent: !fillBg,
		style: fillBg ? "" : "pointer-events: none;",
	}) as HTMLDivElement;
}

export function settingFrame(
	padding: boolean = true,
	vertical: boolean = true,
	center: { x: boolean; y: boolean } = { x: false, y: false },
	transparent = false,
	className: string = "",
) {
	return settingsUi.renderComponent(FrameComponent, {
		padding,
		vertical,
		centerX: center.x,
		centerY: center.y,
		transparent,
		className: className,
	}) as HTMLDivElement;
}

export function fileInput(callback: (file: File) => void, type: string | null = null) {
	return settingsUi.renderComponent(FileInputComponent, {
		accept: type,
		onFileSelect: callback,
	}) as HTMLDivElement;
}

export function textEditor(obj: any = {}, key: string = "") {
	let afterOnChange: ((value: string) => void) | null = null;
	let rearrangeValue: ((value: string) => Promise<string> | string) | null = null;

	let onChange = sequencedTask(async function (value: string) {
		obj[key] = value;
		if (afterOnChange) {
			afterOnChange(value);
		}
	});

	const textEditor = settingsUi.renderComponent(TextEditorComponent, {
		value: obj[key] || "",
		onInput: async (val: string) => {
			if (await getRootValue("EnableRealtimeExtension")) {
				onChange(val);
			}
		},
		onBlur: async (val: string) => {
			let finalValue = val;
			if (rearrangeValue) {
				finalValue = await rearrangeValue(finalValue);
			}
			onChange(finalValue);
		},
	} as any) as HTMLTextAreaElement;

	return {
		textEditor: textEditor,
		onChange: function (callback: (value: string) => void | Promise<void>) {
			onChange = callback as any;
		},
		afterOnChange: function (callback: (value: string) => void) {
			afterOnChange = callback;
		},
		rearrangeValue: function (callback: (value: string) => Promise<string> | string) {
			rearrangeValue = callback;
		},
	};
}

export async function codeEditor(
	parent: HTMLDivElement,
	obj: any,
	key: string,
	language: string,
	height: number = 400,
) {
	let afterOnChange: ((value: string) => void) | null = null;
	let rearrangeValue: ((value: string) => Promise<string> | string) | null = null;

	let onChange = sequencedTask(async function (value: string) {
		obj[key] = value;

		if (obj["id"]) {
			triggerSettingUpdate(obj["id"]);
		}

		if (afterOnChange) {
			afterOnChange(value);
		}
	});

	const target = document.createElement("div");
	parent.append(target);
	const codeEditorInstance = settingsUi.renderComponent(
		CodeEditorComponent as any,
		{
			value: obj[key] || "",
			language: language,
			height: height,
			onInput: async (val: string) => {
				if (await getRootValue("EnableRealtimeExtension")) {
					onChange(val);
				}
			},
			onBlur: async (val: string) => {
				let finalValue = val;
				if (rearrangeValue) {
					finalValue = await rearrangeValue(finalValue);
					(codeEditorInstance as any).setValue?.(finalValue);
				}
				onChange(finalValue);
			},
		} as any,
		target,
	);

	return {
		onChange: function (callback: (value: string) => void | Promise<void>) {
			onChange = callback as any;
		},
		afterOnChange: function (callback: (value: string) => void) {
			afterOnChange = callback;
		},
		rearrangeValue: function (callback: (value: string) => Promise<string> | string) {
			rearrangeValue = callback;
		},
	};
}

export function settingName(text: string, position: "left" | "center" | "right" = "left") {
	return settingsUi.renderComponent(SettingNameComponent, {
		text,
		align: position,
	}) as HTMLDivElement;
}

export function drag(target: HTMLElement) {
	const drag = settingsUi.renderComponent(IconButtonComponent, {
		icon: dragIcon,
		className: "STYLESHIFT-Drag-Top",
		size: 20,
		onClick: () => {},
	}) as HTMLDivElement;

	applyDrag(drag, target);
	return drag;
}

export function close() {
	return settingsUi.renderComponent(IconButtonComponent, {
		icon: closeIcon,
		className: "STYLESHIFT-Close",
		size: 20,
		onClick: () => {},
	}) as HTMLDivElement;
}

export async function title(thisCategory: Category) {
	const target = document.createElement("div");

	function updateUi() {
		target.innerHTML = "";
		settingsUi.renderComponent(
			TitleComponent,
			{
				text: thisCategory.category,
				rainbow: thisCategory.rainbow,
			},
			target,
		);
	}
	updateUi();

	const frame = target as HTMLDivElement;

	const configUiFunction = await createConfigUiFunction(
		thisCategory.editable,
		async function (parent: HTMLDivElement) {
			await settingsUi.configMainSection(
				parent,
				thisCategory,
				{
					name: ["Category", frame],
					Selector: "Selector",
					Rainbow: "Rainbow",
				},
				updateUi,
			);
		},
	);

	return { frame, configUiFunction };
}

export function leftTitle(category: string, skipAnimation: boolean) {
	const title = settingsUi.renderComponent(LeftTitleComponent, {
		category,
		skipAnimation: skipAnimation,
	}) as HTMLDivElement;

	if (!skipAnimation) {
		setupLeftTitleAnimation(title);
	}

	return title;
}

export function subTitle(text: string) {
	return settingsUi.renderComponent(TitleComponent, {
		text,
		subtitle: true,
	}) as HTMLDivElement;
}

export async function collapsedButton(buttonName: string, color: string, targetElement: HTMLElement) {
	const parent = targetElement.parentElement;
	const target = document.createElement("div");

	if (parent) {
		parent.insertBefore(target, targetElement);
	}

	settingsUi.renderComponent(
		CollapseSectionComponent,
		{
			buttonName: buttonName,
			color: color,
			contentEl: targetElement,
		},
		target,
	);

	return { button: (target.firstElementChild as HTMLDivElement) || target };
}

export function showDropdown(options: unknown, target: HTMLElement) {
	let resolveSelection: (value: string | null) => void;
	const selectionPromise = new Promise<string | null>((resolve) => {
		resolveSelection = resolve;
	});

	const container = document.createElement("div");
	const mainWindow = document.querySelector(".STYLESHIFT-Main.STYLESHIFT-Window");
	(mainWindow || document.body).appendChild(container);

	const dropdown = mount(DropdownComponent as any, {
		target: container,
		props: {
			options,
			triggerEl: target,
			isOpen: true,
			justMenu: true,
			onUpdate: (option: string) => {
				resolveSelection(option);
				removeDropdown();
			},
			onClose: () => {
				resolveSelection(null);
				removeDropdown();
			},
		},
	});

	function removeDropdown() {
		if (container.parentNode) {
			unmount(dropdown);
			container.remove();
		}
	}

	return {
		Selection: selectionPromise,
		Cancel: () => {
			removeDropdown();
			resolveSelection(null);
		},
	};
}

export function numberSlideUi(parent: HTMLElement) {
	const numberSlideUi = settingsUi.renderComponent(BasicSliderComponent, {}, parent) as HTMLInputElement;

	function updateNumberSlide(min: number = 0, max: number = 100, step: number = 1) {
		numberSlideUi.min = min.toString();
		numberSlideUi.max = max.toString();
		numberSlideUi.step = step.toString();
	}

	return { numberSlideUi, updateNumberSlide };
}

export function numberInputUi(parent: HTMLElement) {
	return settingsUi.renderComponent(BasicNumberInputComponent, {}, parent) as HTMLDivElement;
}

export async function space(parent: HTMLElement, size: number = 20) {
	settingsUi.renderComponent(SpaceComponent, { size }, parent);
}
