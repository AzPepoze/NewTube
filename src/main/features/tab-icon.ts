import { load } from "../../styleshift/core/save";
import { on_setting_update } from "../../styleshift/settings/functions";

let original_favicon: string | null = null;

function change_favicon(url: string) {
	let favicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
	if (favicon) {
		if (!original_favicon) {
			original_favicon = favicon.href;
		}
		favicon.href = url;
	} else {
		// If no icon exists, create one
		favicon = document.createElement("link");
		favicon.rel = "icon";
		favicon.href = url;
		document.head.appendChild(favicon);
	}
}

function revert_favicon() {
	if (original_favicon) {
		const favicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
		if (favicon) {
			favicon.href = original_favicon;
		}
	}
}

async function update_icon() {
	const use_custom_icon = await load("CustomIcon");
	if (!use_custom_icon) {
		revert_favicon();
		return;
	}
	const icon_url = (await load("iconURL")) as string;
	if (icon_url) {
		change_favicon(icon_url);
	}
}

export function setup_tab_icon_changer() {
	update_icon();
	window.addEventListener("yt-navigate-finish", update_icon);
}

export function disable_tab_icon_changer() {
	revert_favicon();
}

on_setting_update("iconURL", update_icon);
