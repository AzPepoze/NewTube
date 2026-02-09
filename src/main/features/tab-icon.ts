import { get_root_value } from "../../styleshift/core/storage-manager";
import { register_setting_listener } from "../../styleshift/settings/functions";

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
	const use_custom_icon = await get_root_value("CustomIcon");
	if (!use_custom_icon) {
		revert_favicon();
		return;
	}
	const icon_url = (await get_root_value("iconURL")) as string;
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

register_setting_listener("iconURL", update_icon);
