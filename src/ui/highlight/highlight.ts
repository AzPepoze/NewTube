import { createUniqueId } from "@/core/shared/utilities";
import { waitDocumentLoaded } from "@core/shared/domHelpers";
import { getStyleShiftItems } from "@settings/registry/items";
import { type Category } from "@settings/types/styleshiftTypes";
import { createEditorUi, editorUi } from "@ui/window/editor";
import { showUserConfirmation } from "@ui/window/windowFactory";

type HighlightObj = {
	highlighter: HTMLDivElement;
	label: HTMLDivElement;
	targetElement: HTMLElement;
	categories: Category[];
	stop: () => void;
	updateBounds?: () => void;
};

let highlightElements: Record<string, HighlightObj> = {};
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
const debounceDelay = 150;

function categoryName(category: Category) {
	return typeof category.category === "string" ? category.category : category.category.label;
}

function categorySelector(category: Category) {
	return category.selector ?? category.Selector ?? "";
}

function renderHighlightLabel(label: HTMLDivElement, categories: Category[]) {
	label.replaceChildren();

	const chips = document.createElement("div");
	chips.className = "styleshift-highlight-categories";
	for (const category of categories) {
		const chip = document.createElement("span");
		chip.className = "styleshift-highlight-category";
		chip.textContent = categoryName(category);
		chip.style.backgroundColor = `rgb(${category.Highlight_color})`;
		chips.append(chip);
	}
	label.append(chips);
}

function debounce(callback: () => void) {
	if (debounceTimer) clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		callback();
		debounceTimer = undefined;
	}, debounceDelay);
}

function addHighlight(targetElement: HTMLElement, selectorValue: Category) {
	const existUniqueId = targetElement.getAttribute("StyleShift-uniqueId");
	if (existUniqueId) {
		const obj = highlightElements[existUniqueId];
		if (obj && !obj.categories.includes(selectorValue)) {
			obj.categories.push(selectorValue);
			renderHighlightLabel(obj.label, obj.categories);
		}
		return obj;
	}

	const uniqueId = createUniqueId(10);
	const categories = [selectorValue];
	targetElement.setAttribute("StyleShift-uniqueId", uniqueId);

	const color = `rgba(${selectorValue.Highlight_color}`;
	const highlighter = document.createElement("div");
	highlighter.className = "styleshift-highlight";
	highlighter.setAttribute("Selector", categorySelector(selectorValue));
	highlighter.style.background = `${color},0.3)`;
	highlighter.style.borderColor = `${color},0.8)`;

	const isViewport = targetElement === document.body && categorySelector(selectorValue) === "body";
	if (isViewport) highlighter.classList.add("styleshift-highlight-viewport");

	const label = document.createElement("div");
	label.className = "styleshift-highlight-label";
	renderHighlightLabel(label, categories);
	highlighter.append(label);

	function updateBounds() {
		if (isViewport) return;
		const rect = targetElement.getBoundingClientRect();
		highlighter.style.position = "fixed";
		highlighter.style.left = `${rect.left}px`;
		highlighter.style.top = `${rect.top}px`;
		highlighter.style.width = `${rect.width}px`;
		highlighter.style.height = `${rect.height}px`;

		label.style.inset = "auto";
		const needsOutsideLabel = rect.height < 48 || rect.width < 120;
		if (!needsOutsideLabel) {
			label.style.top = `${Math.max(4, rect.top + 4)}px`;
			label.style.left = `${Math.max(4, rect.left + 4)}px`;
			return;
		}

		const spaces = {
			top: rect.top,
			right: window.innerWidth - rect.right,
			bottom: window.innerHeight - rect.bottom,
			left: rect.left,
		};
		const side = (Object.entries(spaces) as [keyof typeof spaces, number][]).reduce((best, current) =>
			current[1] > best[1] ? current : best,
		)[0];
		const gap = 6;
		if (side === "top") {
			label.style.bottom = `${window.innerHeight - rect.top + gap}px`;
			if (rect.left > window.innerWidth / 2) label.style.right = `${Math.max(4, window.innerWidth - rect.right)}px`;
			else label.style.left = `${Math.max(4, rect.left)}px`;
		} else if (side === "right") {
			label.style.left = `${rect.right + gap}px`;
			if (rect.top > window.innerHeight / 2) label.style.bottom = `${Math.max(4, window.innerHeight - rect.bottom)}px`;
			else label.style.top = `${Math.max(4, rect.top)}px`;
		} else if (side === "bottom") {
			label.style.top = `${rect.bottom + gap}px`;
			if (rect.left > window.innerWidth / 2) label.style.right = `${Math.max(4, window.innerWidth - rect.right)}px`;
			else label.style.left = `${Math.max(4, rect.left)}px`;
		} else {
			label.style.right = `${window.innerWidth - rect.left + gap}px`;
			if (rect.top > window.innerHeight / 2) label.style.bottom = `${Math.max(4, window.innerHeight - rect.bottom)}px`;
			else label.style.top = `${Math.max(4, rect.top)}px`;
		}
	}

	if (!isViewport) {
		updateBounds();
	}

	document.body.append(highlighter);
	highlighter.onclick = () => {
		createEditorUi(targetElement, categories);
		stopHighlighter();
	};

	function stop() {
		highlighter.remove();
		targetElement.removeAttribute("StyleShift-uniqueId");
		delete highlightElements[uniqueId];
	}

	const result = { highlighter, label, targetElement, categories, stop, updateBounds };
	highlightElements[uniqueId] = result;
	return result;
}

function hasMatchingAncestor(element: HTMLElement, selector: string) {
	return Boolean(element.parentElement?.closest(selector));
}

function addMatches(root: HTMLElement, category: Category, ignoredSelectors: Set<string>) {
	const selector = categorySelector(category);
	if (!selector || ignoredSelectors.has(selector)) return;

	const matches: HTMLElement[] = [];
	if (root.matches(selector)) matches.push(root);
	matches.push(...Array.from(root.querySelectorAll<HTMLElement>(selector)));

	for (const element of matches) {
		if (!hasMatchingAncestor(element, selector)) addHighlight(element, category);
	}
}

let watchBody: MutationObserver | undefined;
let updateFrame: number | undefined;

function updateHighlightBounds() {
	if (updateFrame !== undefined) return;
	updateFrame = requestAnimationFrame(() => {
		for (const highlight of Object.values(highlightElements)) {
			if (highlight.targetElement.isConnected) highlight.updateBounds?.();
			else highlight.stop();
		}
		updateFrame = undefined;
	});
}

export async function startHighlighter() {
	await waitDocumentLoaded();
	const editableItems = await getStyleShiftItems();
	const categories = [...editableItems.Default, ...editableItems.AddOn] as Category[];
	const ignoredSelectors = new Set<string>();
	const pendingRoots = new Set<HTMLElement>();

	for (const category of categories) {
		const selector = categorySelector(category);
		if (!category.category || !selector) continue;
		const selectorFound = document.querySelectorAll<HTMLElement>(selector);
		if (
			selectorFound.length >= 1000 &&
			!(await showUserConfirmation(
				`StyleShift : I found ${selectorFound.length} elements on selector "${selector}"\n\nAre you wish to continue??`,
			))
		) {
			ignoredSelectors.add(selector);
			continue;
		}
		addMatches(document.documentElement, category, ignoredSelectors);
	}

	watchBody = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node instanceof HTMLElement && !node.classList.contains("styleshift-highlight")) pendingRoots.add(node);
			}
		}
		debounce(() => {
			for (const root of pendingRoots) {
				for (const category of categories) addMatches(root, category, ignoredSelectors);
			}
			pendingRoots.clear();
			updateHighlightBounds();
		});
	});
	watchBody.observe(document.body, { childList: true, subtree: true });
	window.addEventListener("resize", updateHighlightBounds);
	document.addEventListener("scroll", updateHighlightBounds, true);
}

function stopHighlighter() {
	watchBody?.disconnect();
	if (debounceTimer) clearTimeout(debounceTimer);
	if (updateFrame !== undefined) cancelAnimationFrame(updateFrame);
	window.removeEventListener("resize", updateHighlightBounds);
	document.removeEventListener("scroll", updateHighlightBounds, true);
	for (const highlight of Object.values(highlightElements)) highlight.stop();
	highlightElements = {};
}

let runningCustomize = false;

export async function startCustomize() {
	if (runningCustomize) return;
	runningCustomize = true;
	await startHighlighter();
}

export function stopCustomize() {
	if (!runningCustomize) return;
	runningCustomize = false;
	stopHighlighter();
}

export async function toggleCustomize() {
	if (runningCustomize) {
		stopCustomize();
		editorUi.removeUi(false);
	} else {
		await startCustomize();
	}
}
