import { logger } from "@/shared/logger";
import { getUserSetting } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";
import { onYoutubeNavigate } from "../modules/youtube";

let originalFavicons: Map<string, string> = new Map();
let navigateCleanup: (() => void) | null = null;
let observer: MutationObserver | null = null;

async function changeFavicons(url: string) {
	const favicons = document.querySelectorAll('link[rel*="icon"]');
	if (favicons.length > 0) {
		favicons.forEach((favicon: any) => {
			if (!originalFavicons.has(favicon.rel)) {
				originalFavicons.set(favicon.rel, favicon.href);
			}
			if (favicon.href !== url) {
				logger.debug("tabicon", favicon);
				favicon.href = url;
			}
		});
	} else {
		const favicon = document.createElement("link");
		favicon.rel = "icon";
		favicon.href = url;
		document.head.appendChild(favicon);
	}
}

function revertFavicons() {
	if (originalFavicons.size > 0) {
		const favicons = document.querySelectorAll('link[rel*="icon"]');
		favicons.forEach((favicon: any) => {
			const original = originalFavicons.get(favicon.rel);
			if (original) {
				favicon.href = original;
			}
		});
		originalFavicons.clear();
	}
}

async function updateIcon() {
	const useCustomIcon = await getUserSetting("EnableCustomTabIcon");

	if (!useCustomIcon) {
		stopObserver();
		revertFavicons();
		return;
	}

	const iconUrl = (await getUserSetting("TabIconImageUrl")) as string;
	if (iconUrl) {
		changeFavicons(iconUrl);
		startObserver(iconUrl);
	}
}

function startObserver(url: string) {
	if (observer) return;
	observer = new MutationObserver((mutations) => {
		let shouldUpdate = false;
		for (const mutation of mutations) {
			if (mutation.type === "childList" || mutation.type === "attributes") {
				shouldUpdate = true;
				break;
			}
		}
		if (shouldUpdate) {
			changeFavicons(url);
		}
	});

	observer.observe(document.head, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["href", "rel"],
	});
}

function stopObserver() {
	if (observer) {
		observer.disconnect();
		observer = null;
	}
}

export function enableTabIconChanger() {
	updateIcon();
	navigateCleanup = onYoutubeNavigate(updateIcon);
}

export function disableTabIconChanger() {
	if (navigateCleanup) {
		navigateCleanup();
		navigateCleanup = null;
	}
	stopObserver();
	revertFavicons();
}

registerSettingListener("TabIconImageUrl", updateIcon);
registerSettingListener("EnableCustomTabIcon", updateIcon);
