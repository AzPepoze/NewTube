import { logger } from "@/shared/logger";
import { getDocumentBody } from "@core/shared/domHelpers";

export const ELEMENTS = {
	TINT: "newtube-bg-tint",
	IMAGE: "newtube-bg-image",
	YOUTUBE: "newtube-bg-youtube",
} as const;

export const enableBackgroundCss = `
ytd-app { background : transparent; }
#${ELEMENTS.TINT},
#${ELEMENTS.IMAGE},
#${ELEMENTS.YOUTUBE} {
	width : 100%;
	height : 100%;
	position : fixed;
	left : 0;
	top : 0;
	z-index : -1;
    transition: opacity 0.5s ease, visibility 0.5s ease;
    opacity: 0;
}
#${ELEMENTS.TINT} { background: var(--nt-bg-main); }
#${ELEMENTS.IMAGE} {
	z-index: -10000;
	background-repeat: var(--nt-bg-repeat);
	filter: blur(var(--nt-bg-blur-amount));
}
#${ELEMENTS.YOUTUBE} {
	z-index: -1;
	border: none;
	opacity: calc(var(--nt-bg-youtube-opacity, 100) / 100);
}
`;

export async function createElement(id: string): Promise<HTMLElement> {
	const existing = document.getElementById(id);
	if (existing) return existing;

	const element = document.createElement(id === ELEMENTS.YOUTUBE ? "iframe" : "div");
	element.id = id;
	const body = await getDocumentBody();
	body.appendChild(element);
	logger.info(`Created background element: ${id}`);
	return element;
}

const transitionEnd = (element: HTMLElement, callback: () => void) => {
	element.style.opacity = "0";
	setTimeout(() => {
		if (element.style.opacity === "0") callback();
	}, 500);
};

export function removeElement(element: HTMLElement | null) {
	if (element) transitionEnd(element, () => element.remove());
}

export function removeYoutubeIframe(): void {
	removeElement(document.getElementById(ELEMENTS.YOUTUBE) as HTMLElement);
}

export const getElement = (id: string) => document.getElementById(id);

export function showElement(element: HTMLElement | null, opacity: string = "1") {
	if (!element) return;
	element.style.display = "block";
	requestAnimationFrame(() => {
		if (element) element.style.opacity = opacity;
	});
}

export function hideElement(element: HTMLElement | null) {
	if (element) transitionEnd(element, () => (element.style.display = "none"));
}
