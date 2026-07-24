import { getUserSetting } from "@core/storage/manager";
import { registerSettingListener } from "@settings/engine/functions";
import { computeImageTransformStyles } from "@/shared/utils/imageStyles";
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

		const scale = (await getUserSetting("TopLeftIconSize")) as number;
		const posX = (await getUserSetting("TopLeftIconPositionX")) as number;
		const posY = (await getUserSetting("TopLeftIconPositionY")) as number;
		const cropTop = (await getUserSetting("TopLeftIconCropTop")) as number;
		const cropBottom = (await getUserSetting("TopLeftIconCropBottom")) as number;
		const cropLeft = (await getUserSetting("TopLeftIconCropLeft")) as number;
		const cropRight = (await getUserSetting("TopLeftIconCropRight")) as number;
		const flip = (await getUserSetting("EnableTopLeftIconFlip")) as boolean;

		const styles = computeImageTransformStyles({
			scale,
			positionX: posX,
			positionY: posY,
			cropTop,
			cropBottom,
			cropLeft,
			cropRight,
			flip,
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
registerSettingListener("TopLeftIconCropTop", updateLogo);
registerSettingListener("TopLeftIconCropBottom", updateLogo);
registerSettingListener("TopLeftIconCropLeft", updateLogo);
registerSettingListener("TopLeftIconCropRight", updateLogo);
registerSettingListener("EnableTopLeftIconFlip", updateLogo);
