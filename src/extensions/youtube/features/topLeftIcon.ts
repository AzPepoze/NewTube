import { getUserSetting } from "@core/storage/manager";
import { registerSettingListener } from "@settings/engine/functions";
import { onYoutubeNavigate } from "../modules/youtube";

let logoObserver: MutationObserver | null = null;
let tempObserver: MutationObserver | null = null;
let navigateCleanup: (() => void) | null = null;

async function updateLogo() {
	const enabled = await getUserSetting("EnableCustomTopLeftIcon");
	const url = (await getUserSetting("TopLeftIconImageUrl")) as string;
	const renderer = document.querySelector("ytd-topbar-logo-renderer");

	if (enabled && url && renderer) {
		let img = renderer.querySelector("#nt-custom-logo") as HTMLImageElement;
		if (!img) {
			img = document.createElement("img");
			img.id = "nt-custom-logo";
			renderer.appendChild(img);
		}
		if (img.src !== url) {
			img.src = url;
		}
		img.style.scale = await getUserSetting("TopLeftIconSize");
		img.style.translate = `${await getUserSetting("TopLeftIconPositionX")}% ${await getUserSetting("TopLeftIconPositionY")}%`;
	} else {
		const logo = document.querySelector("#nt-custom-logo");
		if (logo) logo.remove();
	}
}

async function startLogoObserver() {
	if (logoObserver || tempObserver) return;

	logoObserver = new MutationObserver(() => {
		updateLogo();
	});

	let masthead = document.querySelector("#masthead-container");
	if (!masthead) {
		tempObserver = new MutationObserver((_, obs) => {
			masthead = document.querySelector("#masthead-container");
			if (masthead) {
				obs.disconnect();
				tempObserver = null;
				if (logoObserver) logoObserver.observe(masthead, { childList: true, subtree: true });
			}
		});
		tempObserver.observe(document.documentElement, { childList: true, subtree: true });
	} else {
		if (logoObserver) logoObserver.observe(masthead, { childList: true, subtree: true });
	}
}

function stopLogoObserver() {
	if (logoObserver) {
		logoObserver.disconnect();
		logoObserver = null;
	}
	if (tempObserver) {
		tempObserver.disconnect();
		tempObserver = null;
	}
}

export function enableTopLeftIconChanger() {
	updateLogo();
	startLogoObserver();
	navigateCleanup = onYoutubeNavigate(updateLogo);
}

export function disableTopLeftIconChanger() {
	if (navigateCleanup) {
		navigateCleanup();
		navigateCleanup = null;
	}
	stopLogoObserver();
	const logo = document.querySelector("#nt-custom-logo");
	if (logo) logo.remove();
}

registerSettingListener("TopLeftIconImageUrl", updateLogo);
registerSettingListener("EnableCustomTopLeftIcon", updateLogo);
registerSettingListener("TopLeftIconSize", updateLogo);
registerSettingListener("TopLeftIconPositionX", updateLogo);
registerSettingListener("TopLeftIconPositionY", updateLogo);
