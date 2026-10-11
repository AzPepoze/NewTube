import { sleep } from "./utilities";
import { logger } from "./webPageLogger";

/**
 * Checks whether an element can scroll, so you can decide if it needs scroll handling.
 *
 * @param {HTMLElement} element - The element to inspect; it should already be on the page.
 * @returns {boolean} True when the element can scroll, otherwise false.
 *
 * @example
 * const feed = document.querySelector("#contents");
 * const scrollable = isScrollable(feed);
 * // result: true
 */
export function isScrollable(element: HTMLElement): boolean {
	const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
	const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;
	return hasVerticalScrollbar || hasHorizontalScrollbar;
}

/**
 * Finds the nearest ancestor that can scroll, so you can attach listeners to the right element.
 *
 * @param {HTMLElement | null} element - The element to start from; pass null to get null back.
 * @returns {HTMLElement | null} The scrollable ancestor, or document.body when there is none.
 *
 * @example
 * const video = await waitForElement(".html5-video-player");
 * const scroller = getScrollParent(video);
 * // result: the scrollable container around the player
 */
export function getScrollParent(element: HTMLElement | null): HTMLElement | null {
	if (!element) {
		return null;
	}

	let parent = element.parentNode;

	while (parent && parent !== document) {
		if (isScrollable(parent as HTMLElement)) {
			return parent as HTMLElement;
		}
		parent = parent.parentNode;
	}

	return document.body;
}

/**
 * Polls for a condition to be met and ensures the result is returned.
 */
async function ensure<T>(fn: () => T | null | undefined, interval = 100): Promise<T> {
	let result = fn();
	while (!result) {
		await sleep(interval);
		result = fn();
	}
	return result;
}

/**
 * Returns the page body element, waiting until it exists. Use it in scripts that run early.
 *
 * @returns {Promise<HTMLElement>} The page body element, once it is available.
 *
 * @example
 * const body = await getDocumentBody();
 * body.classList.add("styleshift-ready");
 * // result: the <body> element with your class added
 */
export function getDocumentBody(): Promise<HTMLElement> {
	return ensure(() => document.body);
}

/**
 * Returns the page head element, waiting until it exists. Use it to add styles or meta tags.
 *
 * @returns {Promise<HTMLElement>} The page head element, once it is available.
 *
 * @example
 * const head = await getDocumentHead();
 * head.append(styleTag);
 * // result: the <head> element now holding your style
 */
export function getDocumentHead(): Promise<HTMLElement> {
	return ensure(() => document.head);
}

/**
 * Runs your callback the first time an element leaves the page, then stops watching it.
 *
 * @param {HTMLElement} targetElement - The element you want to watch for removal from the page.
 * @param {Function} callback - The function to run once when the element is removed.
 *
 * @example
 * const banner = await waitForElement("#promo-banner");
 * onceElementRemove(banner, () => removeMyPanel());
 */
export function onceElementRemove(targetElement: HTMLElement, callback: Function): void {
	const observer = new MutationObserver((mutationsList, observer) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
				for (const removedNode of Array.from(mutation.removedNodes)) {
					if (removedNode === targetElement) {
						logger.info("dom", "element removed");
						callback();
						observer.disconnect();
						return;
					}
				}
			}
		}
	});
	observer.observe(document.body, { childList: true });
}

/**
 * Gets the on-screen center of an element, so you can line up a tooltip or overlay with it.
 *
 * @param {HTMLElement} element - The element to measure; its position is read as it looks now.
 * @returns {{ x: number; y: number }} The horizontal (x) and vertical (y) center in pixels.
 *
 * @example
 * const player = await waitForElement("#movie_player");
 * const { x, y } = getElementCenterPosition(player);
 * // result: { x: 640, y: 360 }
 */
export function getElementCenterPosition(element: HTMLElement): { x: number; y: number } {
	const rect = element.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;

	return {
		x: centerX,
		y: centerY,
	};
}

/**
 * Waits until the page has fully loaded, so later code can find elements that appear at the end.
 *
 * @returns {Promise<number>} Resolves with 0 once the page is fully loaded.
 *
 * @example
 * await waitDocumentLoaded();
 * console.log("YouTube is ready");
 * // result: 0, logged after the page finishes loading
 */
export async function waitDocumentLoaded(): Promise<number> {
	while (document.readyState !== "complete") {
		await sleep(10);
	}
	return 0;
}

/**
 * Gets the site domain from the address bar, so you can save settings per site.
 *
 * @returns {string} The last two parts of the hostname, for example "youtube.com".
 *
 * @example
 * const domain = getCurrentDomain();
 * // result: "youtube.com" on a YouTube page
 */
export function getCurrentDomain(): string {
	return window.location.hostname.split(".").slice(-2).join(".");
}

/**
 * Tidies a CSS selector by trimming extra spaces and giving each part its own line.
 *
 * @param {string} value - The selector text to tidy, such as ".a, .b .c".
 * @returns {string} The same selector with single spaces and one part per line.
 *
 * @example
 * const formatted = rearrangeSelector(".a, .b  .c");
 * // result: ".a,\n.b .c"
 */
export function rearrangeSelector(value: string): string {
	return value.replace(/\s+/g, " ").replace(/\n/g, "").replace(/, /g, ",").replace(/,/g, ",\n");
}

/**
 * Waits for an element that matches a selector to appear, so late-loading parts are safe to use.
 *
 * @param {string} selector - The CSS selector to look for, such as "#movie_player".
 * @param {number} [timeout] - Milliseconds to wait before giving up; omit it to wait forever.
 * @returns {Promise<HTMLElement | null>} The matching element, or null when the time runs out.
 *
 * @example
 * const player = await waitForElement("#movie_player", 10000);
 * player.classList.add("styleshift-active");
 * // result: the player element, or null after 10 seconds
 */
export async function waitForElement(selector: string, timeout?: number): Promise<HTMLElement | null> {
	try {
		const startTime = Date.now();
		return await ensure(() => {
			const el = document.querySelector(selector) as HTMLElement | null;
			if (!el && timeout && Date.now() - startTime >= timeout) {
				throw new Error(`timeout: element "${selector}" not found within ${timeout}ms`);
			}
			return el;
		});
	} catch (error) {
		logger.warn("dom", error);
		return null;
	}
}

/**
 * Reads the page URL query string as an object, so you can act on a specific video or search.
 *
 * @returns {{ [key: string]: string }} An object of parameter names and their text values.
 *
 * @example
 * const params = getCurrentUrlParameters();
 * const videoId = params.v;
 * // result: "dQw4w9WgXcQ" from watch?v=dQw4w9WgXcQ
 */
export function getCurrentUrlParameters(): { [key: string]: string } {
	const searchParams = new URL(window.location.href).searchParams;
	const result: { [key: string]: string } = {};
	searchParams.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}
