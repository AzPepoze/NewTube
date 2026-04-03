import { logger } from "@/shared/logger";
import { getDocumentBody } from "@/styleshift/shared/normal";

const bgTintId = "newtube-bg-tint";
const bgImageId = "newtube-bg-image";
const bgYoutubeId = "newtube-bg-youtube";

export const getElementIds = () => ({
	tint: bgTintId,
	image: bgImageId,
	youtube: bgYoutubeId,
});

export const enableBackgroundCss = `
ytd-app {
	background : transparent;
}

#${bgTintId},
#${bgImageId},
#${bgYoutubeId} {
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

#${bgYoutubeId} {
	z-index: -1;
	border: none;
	opacity: calc(var(--nt-bg-youtube-opacity, 100) / 100);
}
`;

export async function createElement(id: string): Promise<HTMLElement> {
	const existing = document.getElementById(id);
	if (existing) return existing;

	const element = document.createElement(id === bgYoutubeId ? "iframe" : "div");
	element.id = id;
	const body = await getDocumentBody();
	body.appendChild(element);
	logger.info(`Created background element: ${id}`);
	return element;
}

export function removeElement(element: HTMLElement | null) {
	if (element) {
		element.style.opacity = "0";
		setTimeout(() => {
			if (element && element.style.opacity === "0") {
				element.remove();
			}
		}, 500);
	}
}

export function removeYoutubeIframe(): void {
	const iframeElement = document.getElementById(bgYoutubeId);
	removeElement(iframeElement);
}

export function getElement(id: string): HTMLElement | null {
	return document.getElementById(id);
}

export async function showElement(element: HTMLElement | null, opacity: string = "1") {
	if (!element) return;
	element.style.display = "block";
	requestAnimationFrame(() => {
		if (element) element.style.opacity = opacity;
	});
}

export async function hideElement(element: HTMLElement | null) {
	if (!element) return;
	element.style.opacity = "0";
	setTimeout(() => {
		if (element && element.style.opacity === "0") {
			element.style.display = "none";
		}
	}, 500);
}
