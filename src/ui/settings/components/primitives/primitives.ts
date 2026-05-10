import { sequencedTask } from "@/core/shared/utilities";
import { } from "@core/shared/domHelpers";
import {
	applyDrag,
} from "@core/shared/eventHelpers";
import { getRootValue } from "@core/storage/manager";
import { triggerSettingUpdate } from "@settings/engine/functions";
import { type Category, type CategoryNameWithIcon } from "@settings/types/styleshiftTypes";
import { settingsUi } from "@ui/settings/settingsApi";
import { getCategoryParts } from "@ui/window/utils";
import { setupLeftTitleAnimation } from "../../settingsManager";

import { mount, unmount } from "svelte";
import DropdownComponent from "@controls/Dropdown.svelte";
import BasicNumberInputComponent from "@primitives/BasicNumberInput.svelte";
import BasicSliderComponent from "@primitives/BasicSlider.svelte";
import CodeEditorComponent from "@editor/CodeEditor.svelte";
import CollapseSectionComponent from "@primitives/CollapseSection.svelte";
import FileInputComponent from "@primitives/FileInput.svelte";
import FrameComponent from "@primitives/Frame.svelte";
import IconButtonComponent from "@primitives/IconButton.svelte";
import LeftTitleComponent from "@primitives/LeftTitle.svelte";
import ResizeHandleComponent from "@primitives/ResizeHandle.svelte";
import SettingNameComponent from "@primitives/SettingName.svelte";
import SpaceComponent from "@primitives/Space.svelte";
import TextEditorComponent from "@primitives/TextEditor.svelte";
import TitleComponent from "@primitives/Title.svelte";
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
		className: "styleshift-fillscreen",
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
			if (await getRootValue("enableRealtimeExtension")) {
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
	height: string | number = 400,
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
	target.style.height = "100%";
	target.style.display = "flex";
	target.style.flexDirection = "column";
	parent.append(target);
	const codeEditorInstance = settingsUi.renderComponent(
		CodeEditorComponent as any,
		{
			value: obj[key] || "",
			language: language,
			height: height,
			onInput: async (val: string) => {
				if (await getRootValue("enableRealtimeExtension")) {
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
		className: "styleshift-drag-top",
		size: 20,
		onClick: () => { },
	}) as HTMLDivElement;

	applyDrag(drag, target);
	return drag;
}

export function close() {
	return settingsUi.renderComponent(IconButtonComponent, {
		icon: closeIcon,
		className: "styleshift-close",
		size: 20,
		onClick: () => { },
	}) as HTMLDivElement;
}

export async function title(thisCategory: Category) {
	const target = document.createElement("div");

	function updateUi() {
		target.innerHTML = "";
		settingsUi.renderComponent(
			TitleComponent,
			{
				text: getCategoryParts(thisCategory.category).text,
				icon: getCategoryParts(thisCategory.category).icon,
				rainbow: thisCategory.rainbow,
			},
			target,
		);
	}
	updateUi();

	const frame = target as HTMLDivElement;

	// Configure advanced settings
	await settingsUi.configMainSection(
		frame,
		thisCategory,
		{
			category: ["Category", frame],
			Selector: "Selector",
			Rainbow: "Rainbow",
		},
		updateUi,
	);

	return { frame };
}

export function leftTitle(
	category: string | CategoryNameWithIcon,
	skipAnimation: boolean,
	isHeader: boolean = false,
	separator: boolean = false,
	isNew: boolean = false,
) {
	const title = settingsUi.renderComponent(LeftTitleComponent, {
		category,
		skipAnimation,
		isHeader,
		separator,
		isNew,
	}) as HTMLDivElement;

	if (!skipAnimation && !isHeader) {
		setupLeftTitleAnimation(title);
	}

	return title;
}

export function subTitle(thisData: { text: string; leftSeparator?: boolean; editable?: boolean }) {
	const { text, leftSeparator, editable } = thisData;
	const frame = settingsUi.renderComponent(TitleComponent, {
		text,
		subtitle: true,
		leftSeparator: leftSeparator || false,
		editable: editable || false,
	}) as HTMLDivElement;

	return { frame, data: thisData };
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
	const mainWindow = document.querySelector(".styleshift-main.styleshift-window");
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
