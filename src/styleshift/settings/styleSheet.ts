import { getDocumentHead, sleep } from "../shared/normal";
import { getUserSetting } from "../core/storageManager";

let stylesheetHolder: HTMLElement;
let stylesheetHolderConstant: HTMLElement;

export async function createStylesheetHolder() {
	stylesheetHolder = document.createElement("fieldset");
	stylesheetHolder.id = "STYLESHIFT_stylesheet_holder";

	if ((await getUserSetting("enableExtension")) == true) {
		showStylesheet();
	} else {
		hideStylesheet();
	}

	stylesheetHolderConstant = document.createElement("fieldset");
	stylesheetHolderConstant.id = "STYLESHIFT_stylesheet_holder_constant";
	setTimeout(async () => {
		(await getDocumentHead()).append(stylesheetHolderConstant);
	}, 1);
}

export function createStylesheet(id: string, constant: boolean = false) {
	// Check if stylesheet already exists to avoid duplication
	const existing = (constant ? stylesheetHolderConstant : stylesheetHolder).querySelector(
		`style[STYLESHIFT_style_sheet_id="${id}"]`,
	) as HTMLStyleElement;

	if (existing) {
		return existing;
	}

	const styleSheet = document.createElement("style");
	styleSheet.setAttribute("STYLESHIFT_style_sheet_id", id);

	if (constant) {
		stylesheetHolderConstant.append(styleSheet);
	} else {
		stylesheetHolder.append(styleSheet);
	}

	return styleSheet;
}

export async function showStylesheet() {
	setTimeout(async () => {
		(await getDocumentHead()).append(stylesheetHolder);
	}, 1);
}

export async function hideStylesheet() {
	if (stylesheetHolder) {
		stylesheetHolder.remove();
	} else {
		await sleep(10);
		await hideStylesheet();
	}
}
