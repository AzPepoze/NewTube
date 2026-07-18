import { createUniqueId } from "@/core/shared/utilities";
import { onceElementRemove, waitDocumentLoaded } from "@core/shared/domHelpers";
import { getStyleShiftItems } from "@settings/registry/items";
import { type Category } from "@settings/types/styleshiftTypes";
import { logger } from "@shared/logger";
import { createEditorUi, editorUi } from "@ui/window/editor";
import { showUserConfirmation } from "@ui/window/windowFactory";

let highlightElements = {};
let debounceTimer: NodeJS.Timeout;
const debounceDelay = 150;

function getHighlightLabel(categories: Category[]) {
	return categories
		.map((category) => {
			const categoryName = typeof category.category === "string" ? category.category : category.category.label;
			return `${categoryName} — ${category.selector ?? category.Selector ?? ""}`;
		})
		.join(", ");
}

function debounce(callback: Function) {
	if (debounceTimer) {
		clearTimeout(debounceTimer);
	}
	debounceTimer = setTimeout(() => {
		callback();
		debounceTimer = null;
	}, debounceDelay);
}

function addHighlight(targetElement: HTMLElement, selectorValue: Category) {
	logger.info("highlight", highlightElements);

	const existUniqueId = targetElement.getAttribute("StyleShift-uniqueId");
	if (existUniqueId) {
		const obj = highlightElements[existUniqueId];
		if (!obj.categories.includes(selectorValue)) {
			obj.categories.push(selectorValue);
			obj.label.textContent = getHighlightLabel(obj.categories);
		}
		return obj;
	}

	const uniqueId = createUniqueId(10);
	const categories = [selectorValue];
	targetElement.setAttribute("StyleShift-uniqueId", uniqueId);

	const color = `rgba(${selectorValue.Highlight_color}`;

	const highlighter = document.createElement("div");
	highlighter.className = "styleshift-highlight";
	highlighter.setAttribute("Selector", selectorValue.Selector);

	highlighter.style.background = `${color},0.3)`;
	highlighter.style.borderColor = `${color},0.8)`;

	const label = document.createElement("div");
	label.className = "styleshift-highlight-label";
	label.textContent = getHighlightLabel(categories);
	label.style.backgroundColor = `rgb(${selectorValue.Highlight_color})`;
	highlighter.append(label);

	const computedStyle = window.getComputedStyle(targetElement);
	highlighter.style.width = `calc(100% - 
	${computedStyle.getPropertyValue("padding-left")} - 
	${computedStyle.getPropertyValue("padding-right")} - 2px
	)`;
	highlighter.style.height = `calc(100% - 
	${computedStyle.getPropertyValue("padding-top")} - 
	${computedStyle.getPropertyValue("padding-bottom")} - 2px
	)`;

	targetElement.append(highlighter);

	highlighter.onclick = function () {
		createEditorUi(targetElement, categories);
		stopHighlighter();
	};

	const oldStyle = targetElement.style.position;
	targetElement.style.position = "relative";

	function stop() {
		if (targetElement) {
			targetElement.style.position = oldStyle;
		}
		highlighter.remove();
		targetElement.removeAttribute("StyleShift-uniqueId");
		delete highlightElements[uniqueId];
	}

	onceElementRemove(targetElement, function () {
		stop();
	});

	const returnObj = {
		highlighter: highlighter,
		label: label,
		targetElement: targetElement,
		categories: categories,
		stop: stop,
	};

	highlightElements[uniqueId] = returnObj;

	return returnObj;
}

let watchBody: MutationObserver;

export async function startHighlighter() {
	await waitDocumentLoaded();
	const editableItems = await getStyleShiftItems();
	logger.info("highlight", "editableItems", editableItems);
	const exeptItems = [];

	const containers = document.querySelectorAll(".dynamic-content, .user-content, main, #content");

	watchBody = new MutationObserver((mutationsList) => {
		debounce(async () => {
			for (const mutation of mutationsList) {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							const element = node as HTMLElement;
							for (const item of [...editableItems.Default, ...editableItems.AddOn]) {
								const selectorValue = item as Category;
								if (
									selectorValue.category &&
									selectorValue.selector &&
									selectorValue.selector != "" &&
									element.matches(selectorValue.selector) &&
									!exeptItems.some((item) => item === selectorValue.selector)
								) {
									logger.info("highlight", "Add New Node", selectorValue.selector);
									addHighlight(element, selectorValue);
								}
							}
						}
					});
				}
			}
		});
	});

	if (containers.length > 0) {
		containers.forEach((container) => {
			watchBody.observe(container, {
				childList: true,
				subtree: true,
				attributeFilter: ["class", "id"],
			});
		});
	} else {
		watchBody.observe(document.body, {
			childList: true,
			subtree: true,
			attributeFilter: ["class", "id"],
		});
	}

	for (const item of [...editableItems.Default, ...editableItems.AddOn]) {
		const selectorValue = item as Category;
		if (!selectorValue.category || selectorValue.selector == "") continue;

		const selectorFound = document.querySelectorAll(selectorValue.selector);

		if (
			selectorFound.length >= 1000 &&
			!(await showUserConfirmation(
				`StyleShift : I found ${selectorFound.length} elements on selector "${selectorValue.selector}"\n\nAre you wish to continue??`,
			))
		) {
			exeptItems.push(selectorValue.selector);
			continue;
		}

		logger.info("highlight", "selectorFound", selectorValue.selector, selectorFound);

		// Process elements in chunks to avoid blocking the main thread
		const chunkSize = 50;
		for (let i = 0; i < selectorFound.length; i += chunkSize) {
			const chunk = Array.from(selectorFound).slice(i, i + chunkSize);
			setTimeout(() => {
				chunk.forEach((element) => {
					addHighlight(element as HTMLElement, selectorValue);
				});
			}, 0);
		}
	}
}

function stopHighlighter() {
	if (watchBody) {
		watchBody.disconnect();
	}

	interface HighlightObj {
		stop: () => void;
	}

	for (const highlightElementsObj of Object.values(highlightElements) as HighlightObj[]) {
		highlightElementsObj.stop();
	}

	highlightElements = {};
}

let runningCustomize = false;

export async function startCustomize() {
	if (runningCustomize) {
		return;
	}
	runningCustomize = true;
	startHighlighter();
}

export function stopCustomize() {
	if (!runningCustomize) {
		return;
	}
	runningCustomize = false;
	stopHighlighter();
}

export async function toggleCustomize() {
	if (runningCustomize) {
		stopCustomize();
		editorUi.removeUi(false);
	} else {
		startCustomize();
	}
}
