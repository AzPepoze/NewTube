import { getUserSetting } from "@core/storage/manager";
import { registerSettingListener } from "@settings/engine/functions";
import { computeImageTransformStyles } from "@/shared/utils/imageStyles";
import { waitForElement } from "@core/shared/domHelpers";
import { onYoutubeNavigate } from "../modules/youtube";

let logoObserver: MutationObserver | null = null;
let tempObserver: MutationObserver | null = null;
let navigateCleanup: (() => void) | null = null;

async function updateLogo() {
	const [enabled, url, scale, posX, posY, cropTop, cropBottom, cropLeft, cropRight, flip] = await Promise.all([
		getUserSetting("EnableCustomTopLeftIcon"),
		getUserSetting("TopLeftIconImageUrl"),
		getUserSetting("TopLeftIconSize"),
		getUserSetting("TopLeftIconPositionX"),
		getUserSetting("TopLeftIconPositionY"),
		getUserSetting("TopLeftIconCropTop"),
		getUserSetting("TopLeftIconCropBottom"),
		getUserSetting("TopLeftIconCropLeft"),
		getUserSetting("TopLeftIconCropRight"),
		getUserSetting("EnableTopLeftIconFlip"),
	]);

	const renderer = document.querySelector("ytd-topbar-logo-renderer");

	if (enabled && url && renderer) {
		let img = renderer.querySelector("#nt-custom-logo") as HTMLImageElement;
		if (!img) {
			img = document.createElement("img");
			img.id = "nt-custom-logo";
			renderer.appendChild(img);
		} else if (img.parentElement !== renderer) {
			renderer.appendChild(img);
		}

		if (img.src !== url) {
			img.src = url as string;
		}

		const styles = computeImageTransformStyles({
			scale: scale as number,
			positionX: posX as number,
			positionY: posY as number,
			cropTop: cropTop as number,
			cropBottom: cropBottom as number,
			cropLeft: cropLeft as number,
			cropRight: cropRight as number,
			flip: flip as boolean,
		});

		img.style.scale = styles.scale;
		img.style.translate = styles.translate;
		img.style.clipPath = styles.clipPath;
		img.style.transform = styles.transform;
	} else {
		const logo = document.querySelector("#nt-custom-logo");
		if (logo) logo.remove();
	}
}

async function startLogoObserver() {
	if (logoObserver) return;

	logoObserver = new MutationObserver(() => {
		updateLogo();
	});

	const masthead = document.querySelector("#masthead-container") || document.querySelector("ytd-masthead");
	const targetNode = masthead || document.documentElement;
	logoObserver.observe(targetNode, { childList: true, subtree: true });
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
	waitForElement("ytd-topbar-logo-renderer", 10000).then((el) => {
		if (el) updateLogo();
	});
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
registerSettingListener("TopLeftIconCropTop", updateLogo);
registerSettingListener("TopLeftIconCropBottom", updateLogo);
registerSettingListener("TopLeftIconCropLeft", updateLogo);
registerSettingListener("TopLeftIconCropRight", updateLogo);
registerSettingListener("EnableTopLeftIconFlip", updateLogo);
