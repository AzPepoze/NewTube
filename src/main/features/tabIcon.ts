import { getRootValue } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";

let originalFavicon: string | null = null;

function changeFavicon(url: string) {
	let favicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
	if (favicon) {
		if (!originalFavicon) {
			originalFavicon = favicon.href;
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

function revertFavicon() {
	if (originalFavicon) {
		const favicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
		if (favicon) {
			favicon.href = originalFavicon;
		}
	}
}

async function updateIcon() {
	const useCustomIcon = await getRootValue("CustomIcon");
	if (!useCustomIcon) {
		revertFavicon();
		return;
	}
	const iconUrl = (await getRootValue("iconURL")) as string;
	if (iconUrl) {
		changeFavicon(iconUrl);
	}
}

export function setupTabIconChanger() {
	updateIcon();
	window.addEventListener("yt-navigate-finish", updateIcon);
}

export function disableTabIconChanger() {
	revertFavicon();
}

registerSettingListener("iconURL", updateIcon);
