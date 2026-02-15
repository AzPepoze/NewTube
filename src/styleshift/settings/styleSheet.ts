import { getDocumentHead, sleep } from "../shared/normal";
import { getUserSetting } from "../core/storageManager";

let stylesheetHolder: HTMLElement;
let stylesheetHolderConstant: HTMLElement;

export async function createStylesheetHolder() {
	stylesheetHolder = document.createElement("fieldset");
	stylesheetHolder.id = "STYLESHIFT_stylesheet_holder";

	if ((await getUserSetting("EnableExtension")) == true) {
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
