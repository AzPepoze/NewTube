import { sleep } from './utilities';
import { logger } from './webPageLogger';

/**
 * Checks if an element is scrollable.
 */
export function isScrollable(element: HTMLElement): boolean {
	const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
	const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;
	return hasVerticalScrollbar || hasHorizontalScrollbar;
}

/**
 * Gets the nearest scrollable parent of an element.
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
 * Gets the document body element, waiting if necessary.
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
 * Gets the document head element, waiting if necessary.
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
 * Executes a callback when a target element is removed from the DOM.
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
 * Gets the center position of an element.
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
 * Waits for the document to be fully loaded.
 */
export async function waitDocumentLoaded(): Promise<number> {
	while (document.readyState !== "complete") {
		await sleep(10);
	}
	return 0;
}

/**
 * Gets the current domain.
 */
export function getCurrentDomain(): string {
	const hostname = window.location.origin;
	const domainParts = hostname.split(".");
	const domain = domainParts.slice(-2).join(".");

	return domain;
}

/**
 * Rearranges a selector string.
 */
export function rearrangeSelector(value: string): string {
	return value.replace(/\s+/g, " ").replace(/\n/g, "").replace(/, /g, ",").replace(/,/g, ",\n");
}

/**
 * Waits for an element to appear in the DOM.
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
 * Gets the current URL parameters.
 */
export function getCurrentUrlParameters(): { [key: string]: string } {
	const searchParams = new URL(window.location.href).searchParams;
	const result: { [key: string]: string } = {};
	searchParams.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}
