import { getDocumentBody } from "../../styleshift/shared/normal";
import { getUserSetting } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";

const bgTintId = "newtube-bg-tint";
const bgImageId = "newtube-bg-image";

let bgTintElement: HTMLElement | null = null;
let bgImageElement: HTMLElement | null = null;
const bgImage = new Image();

let hiddenByVideo = false;

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
    transition: opacity 0.5s ease, visibility 0.5s ease;
    opacity: 0;
}

#${bgTintId}{
	background: var(--nt-bg-main);
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

export async function hideBg() {
	hiddenByVideo = true;
	getElement();
	if (bgTintElement) bgTintElement.style.opacity = "0";
	if (bgImageElement) bgImageElement.style.opacity = "0";

	setTimeout(() => {
		if (hiddenByVideo) {
			getElement(); // Re-fetch to be safe
			if (bgTintElement) bgTintElement.style.display = "none";
			if (bgImageElement) bgImageElement.style.display = "none";
		}
	}, 500);
}

export async function showBg() {
	hiddenByVideo = false;
	getElement();
	if (bgTintElement) {
		bgTintElement.style.display = "block";
		requestAnimationFrame(() => {
			if (bgTintElement) bgTintElement.style.opacity = "1";
		});
	}
	if (bgImageElement) {
		bgImageElement.style.display = "block";
		requestAnimationFrame(() => {
			if (bgImageElement) bgImageElement.style.opacity = "1";
		});
	}
}

import { createStylesheet } from "../../styleshift/settings/styleSheet";

let stylesheet: HTMLElement | null = null;

export async function enableBg() {
	getElement();

	if (!stylesheet) {
		stylesheet = createStylesheet("nt-background-transparency");
		stylesheet.textContent = enableBackgroundCss;
	}

	if (!bgTintElement) {
		bgTintElement = document.createElement("div");
		bgTintElement.id = bgTintId;
	}

	if (!bgImageElement) {
		bgImageElement = document.createElement("div");
		bgImageElement.id = bgImageId;
	}

	const body = await getDocumentBody();
	if (body) {
		if (bgTintElement && !body.contains(bgTintElement)) body.appendChild(bgTintElement);
		if (bgImageElement && !body.contains(bgImageElement)) body.appendChild(bgImageElement);
	}

	if (!hiddenByVideo) {
		requestAnimationFrame(() => {
			if (bgTintElement) {
				bgTintElement.style.display = "block";
				bgTintElement.style.opacity = "1";
			}
			if (bgImageElement) {
				bgImageElement.style.display = "block";
				bgImageElement.style.opacity = "1";
			}
		});
	}

	window.addEventListener("resize", updateBgImgSize);
	window.addEventListener("yt-navigate-finish", updateBgImg);
	updateBgImg();
}

export async function disableBg() {
	getElement();

	if (bgTintElement) bgTintElement.style.opacity = "0";
	if (bgImageElement) bgImageElement.style.opacity = "0";

	setTimeout(() => {
		if (bgTintElement && bgTintElement.style.opacity === "0") {
			bgTintElement.remove();
			bgTintElement = null;
		}
		if (bgImageElement && bgImageElement.style.opacity === "0") {
			bgImageElement.remove();
			bgImageElement = null;
		}
	}, 500);

	window.removeEventListener("resize", updateBgImgSize);
	window.removeEventListener("yt-navigate-finish", updateBgImg);
}

export async function updateBgImg() {
	const useThumb = await getUserSetting("ThumbBG");
	if (useThumb) {
		const videoId = new URLSearchParams(window.location.search).get("v");
		if (videoId) {
			bgImage.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
			return;
		}
	}
	const url = await getUserSetting("BGIMG");
	if (url) bgImage.src = url;
}

export async function updateBgImgSize() {
	getElement();
	const el = bgImageElement;
	if (!el) return;
	const bgBound = el.getBoundingClientRect();
	if (!bgBound.height || bgImage.width === 0) return;
	const imagineBackgroundHeight = (bgImage.height / bgImage.width) * window.innerWidth;
	const zoomValue = (await getUserSetting("BackgroundS")) || 100;

	if (imagineBackgroundHeight < bgBound.height) {
		el.style.backgroundSize = `${(bgBound.height / imagineBackgroundHeight) * zoomValue}%`;
	} else {
		el.style.backgroundSize = `${zoomValue}%`;
	}
}

export async function updateBgImgPosition() {
	getElement();
	const el = bgImageElement;
	if (!el) return;
	const x = await getUserSetting("BackgroundX");
	const y = await getUserSetting("BackgroundY");
	el.style.backgroundPositionX = x + "%";
	el.style.backgroundPositionY = y + "%";
}

bgImage.onload = function () {
	if (bgImageElement) bgImageElement.style.backgroundImage = `url("${bgImage.src}")`;
	updateBgImgSize();
};

registerSettingListener("BGIMG", updateBgImg, true);
registerSettingListener("ThumbBG", updateBgImg, true);
registerSettingListener("BackgroundS", updateBgImgSize, true);
registerSettingListener("BackgroundX", updateBgImgPosition, true);
registerSettingListener("BackgroundY", updateBgImgPosition, true);
