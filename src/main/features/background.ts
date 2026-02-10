import { getDocumentBody } from "../../styleshift/buildInFunctions/normal";
import { getUserSetting } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";
import { logger } from "../../styleshift/utils/logger";

const bgTintId = "newtube-bg-tint";
const bgImageId = "newtube-bg-image";

let bgTintElement: HTMLElement | null = null;
let bgImageElement: HTMLElement | null = null;
const bgImage = new Image();

export const enableBackgroundCss = `
ytd-app {
	background : transparent;
}

#${bgTintId},
#${bgImageId} {
	width : 100%;
	height : 100%;
	position : fixed;
	left : 0;
	top : 0;
	z-index : -1;
}

#${bgTintId}{
	background: var(--nt-bg-main);
	opacity: calc(var(--nt-bg-opacity) / 100);
}

#${bgImageId} {
	z-index: -10000;
	background-repeat: var(--nt-bg-repeat);
	filter: blur(var(--nt-bg-blur-amount));
}
`;

function getElement() {
	bgTintElement = document.getElementById(bgTintId);
	bgImageElement = document.getElementById(bgImageId);
}

export async function enableBg() {
	getElement();

	if (!bgTintElement) {
		bgTintElement = document.createElement("div");
		bgTintElement.id = bgTintId;
	}

	if (!bgImageElement) {
		bgImageElement = document.createElement("div");
		bgImageElement.id = bgImageId;
	}

	(await getDocumentBody()).appendChild(bgTintElement);
	(await getDocumentBody()).appendChild(bgImageElement);
	window.addEventListener("resize", updateBgImgSize);
	window.addEventListener("yt-navigate-finish", updateBgImg);
}

export async function disableBg() {
	getElement();

	if (bgTintElement) {
		bgTintElement.remove();
		bgTintElement = null;
	}
	if (bgImageElement) {
		bgImageElement.remove();
		bgImageElement = null;
	}
	window.removeEventListener("resize", updateBgImgSize);
	window.removeEventListener("yt-navigate-finish", updateBgImg);
}

export async function updateBgImg() {
	logger.info("background", "BG updated");
	const useThumb = await getUserSetting("ThumbBG");
	if (useThumb) {
		const videoId = new URLSearchParams(window.location.search).get("v");
		if (videoId) {
			bgImage.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
			return;
		}
	}
	const url = await getUserSetting("BGIMG");
	bgImage.src = url;
}

export async function updateBgImgSize() {
	const bgBound = bgImageElement.getBoundingClientRect();
	const imagineBackgroundHeight = (bgImage.height / bgImage.width) * window.innerWidth;
	const zoomValue = await getUserSetting("BackgroundS");

	if (imagineBackgroundHeight < bgBound.height) {
		bgImageElement.style.backgroundSize = `${(bgBound.height / imagineBackgroundHeight) * zoomValue}%`;
	} else {
		bgImageElement.style.backgroundSize = `${zoomValue}%`;
	}
}

export async function updateBgImgPosition() {
	bgImageElement.style.backgroundPositionX = (await getUserSetting("BackgroundX")) + "%";
	bgImageElement.style.backgroundPositionY = (await getUserSetting("BackgroundY")) + "%";
}

bgImage.onload = function () {
	if (bgImageElement) bgImageElement.style.backgroundImage = `url("${bgImage.src}")`;

	updateBgImgSize();
};

registerSettingListener("BGIMG", updateBgImg, true);
