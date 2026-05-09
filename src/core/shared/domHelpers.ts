import { sleep } from './utilities';
import { logger } from './webPageLogger';

/**
 * Checks if an element is currently scrollable (either vertically or horizontally).
 * 
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} True if the element is scrollable, false otherwise.
 * 
 * @example
 * const scrollable = isScrollable(document.querySelector(".content"));
 */
export function isScrollable(element: HTMLElement): boolean {
	const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
	const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;
	return hasVerticalScrollbar || hasHorizontalScrollbar;
}

/**
 * Gets the nearest scrollable parent of an element by traversing up the DOM tree.
 * 
 * @param {HTMLElement | null} element - The starting element.
 * @returns {HTMLElement | null} The nearest scrollable parent element, or document.body if none found.
 * 
 * @example
 * const parent = getScrollParent(document.querySelector(".child"));
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
 * Gets the document body element, waiting if it's not yet available (e.g., during early script execution).
 * 
 * @returns {Promise<HTMLElement>} A promise that resolves to the document body element.
 * 
 * @example
 * const body = await getDocumentBody();
 */
export async function getDocumentBody(): Promise<HTMLElement> {
	const documentBody = document.body;

	if (documentBody) {
		return documentBody;
	} else {
		await sleep(100);
		return await getDocumentBody();
	}
}

/**
 * Gets the document head element, waiting if it's not yet available.
 * 
 * @returns {Promise<HTMLElement>} A promise that resolves to the document head element.
 * 
 * @example
 * const head = await getDocumentHead();
 */
export async function getDocumentHead(): Promise<HTMLElement> {
	const documentHead = document.head;

	if (documentHead) {
		return documentHead;
	} else {
		await sleep(100);
		return await getDocumentHead();
	}
}

/**
 * Executes a callback once when a specific target element is removed from the DOM.
 * 
 * @param {HTMLElement} targetElement - The element to monitor for removal.
 * @param {Function} callback - The function to execute upon removal.
 * 
 * @example
 * onceElementRemove(myElement, () => console.log("Element is gone!"));
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
 * Gets the center X and Y coordinates of an element relative to the viewport.
 * 
 * @param {HTMLElement} element - The element to calculate the center for.
 * @returns {{ x: number; y: number }} An object containing the center x and y coordinates.
 * 
 * @example
 * const { x, y } = getElementCenterPosition(myButton);
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
 * Waits for the document.readyState to become "complete".
 * 
 * @returns {Promise<number>} A promise that resolves (with 0) when the document is fully loaded.
 * 
 * @example
 * await waitDocumentLoaded();
 * console.log("Page fully loaded!");
 */
export async function waitDocumentLoaded(): Promise<number> {
	while (document.readyState !== "complete") {
		await sleep(10);
	}
	return 0;
}

/**
 * Gets the current domain from the window location origin (e.g., "youtube.com").
 * 
 * @returns {string} The current domain.
 * 
 * @example
 * const domain = getCurrentDomain(); // e.g., "google.com"
 */
export function getCurrentDomain(): string {
	const hostname = window.location.origin;
	const domainParts = hostname.split(".");
	const domain = domainParts.slice(-2).join(".");

	return domain;
}

/**
 * Rearranges a CSS selector string by removing extra whitespace and adding newlines after commas for readability.
 * 
 * @param {string} value - The raw selector string.
 * @returns {string} The formatted selector string.
 * 
 * @example
 * const formatted = rearrangeSelector(".a, .b  .c");
 * // Result: ".a,\n.b .c"
 */
export function rearrangeSelector(value: string): string {
	return value.replace(/\s+/g, " ").replace(/\n/g, "").replace(/, /g, ",").replace(/,/g, ",\n");
}

/**
 * Waits for an element matching the selector to appear in the DOM, with an optional timeout.
 * 
 * @param {string} selector - The CSS selector to search for.
 * @param {number} [timeout] - The maximum time to wait in milliseconds.
 * @returns {Promise<HTMLElement | null>} A promise that resolves to the element or null if the timeout is reached.
 * 
 * @example
 * const btn = await waitForElement("#submit-btn", 5000);
 */
export async function waitForElement(selector: string, timeout?: number): Promise<HTMLElement | null> {
	const startTime = Date.now();
	while (true) {
		const element = document.querySelector(selector) as HTMLElement | null;
		if (element) {
			return element;
		}
		if (timeout && Date.now() - startTime >= timeout) {
			logger.warn("dom", `timeout: element "${selector}" not found within ${timeout}ms`);
			return null;
		}
		await sleep(100);
	}
}

/**
 * Gets all current URL search parameters as a key-value object.
 * 
 * @returns {{ [key: string]: string }} An object containing the URL parameters.
 * 
 * @example
 * const params = getCurrentUrlParameters();
 * console.log(params.id); // value of ?id=...
 */
export function getCurrentUrlParameters(): { [key: string]: string } {
	const searchParams = new URL(window.location.href).searchParams;
	const result: { [key: string]: string } = {};
	searchParams.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}
