import { get_document_head, sleep } from "../build-in-functions/normal";
import { load_setting } from "../core/save";

let stylesheet_holder: HTMLElement;
let stylesheet_holder_constant: HTMLElement;

export async function create_stylesheet_holder() {
	stylesheet_holder = document.createElement("fieldset");
	stylesheet_holder.id = "STYLESHIFT_stylesheet_holder";

	if ((await load_setting("Enable_Extension")) == true) {
		show_stylesheet();
	} else {
		hide_stylesheet();
	}

	stylesheet_holder_constant = document.createElement("fieldset");
	stylesheet_holder_constant.id = "STYLESHIFT_stylesheet_holder_constant";
	setTimeout(async () => {
		(await get_document_head()).append(stylesheet_holder_constant);
	}, 1);
}

export function create_stylesheet(id: string, constant: boolean = false) {
	const style_sheet = document.createElement("style");
	style_sheet.setAttribute("STYLESHIFT_style_sheet_id", id);

	if (constant) {
		stylesheet_holder_constant.append(style_sheet);
	} else {
		stylesheet_holder.append(style_sheet);
	}

	return style_sheet;
}

export async function show_stylesheet() {
	setTimeout(async () => {
		(await get_document_head()).append(stylesheet_holder);
	}, 1);
}

export async function hide_stylesheet() {
	if (stylesheet_holder) {
		stylesheet_holder.remove();
	} else {
		await sleep(10);
		await hide_stylesheet();
	}
}
