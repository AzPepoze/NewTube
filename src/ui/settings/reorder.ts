import { refreshExtensionState } from "@core/index";
import { insertAfter } from "@core/shared/eventHelpers";
import { saveToStorage } from "@core/storage/manager";
import { getAddOnItems, getSettingCategory } from "@settings/registry/items";
import type { Category, Setting } from "@settings/types/styleshiftTypes";

let dragingSetting: { size: number; Data: Setting | Category } | null = null;
const dropTargets = new Map<HTMLElement, { data: Setting | Category; dataType: string }>();

interface Placeholder {
	show: () => void;
	hide: () => void;
	element: HTMLElement;
}

let currentPlaceholder: Placeholder | null = null;

function clearCurrentPlaceholder() {
	if (currentPlaceholder) {
		currentPlaceholder.hide();
		currentPlaceholder = null;
	}
}

function createPlaceholder(size: number) {
	const space = document.createElement("div");
	space.className = "STYLESHIFT-drag-Hint";
	space.style.height = "0px";
	space.style.opacity = "0";

	function show() {
		requestAnimationFrame(() => {
			space.classList.add("show");
			space.style.height = size + "px";
			space.style.opacity = "1";
		});
	}

	function hide() {
		space.classList.remove("show");
		space.style.height = "0px";
		space.style.opacity = "0";
		setTimeout(() => {
			if (space.parentNode) space.remove();
		}, 300);
	}

	return {
		show,
		hide,
		element: space,
	};
}

export function clearDropTargets() {
	dropTargets.clear();
}

function applyDragStyles(targetFrame: HTMLElement, frameBound: DOMRect, scrollerRect: DOMRect, scroller: HTMLElement) {
	const initialTop = frameBound.top - scrollerRect.top + scroller.scrollTop;
	const initialLeft = frameBound.left - scrollerRect.left;

	Object.assign(targetFrame.style, {
		width: `${frameBound.width}px`,
		height: `${frameBound.height}px`,
		boxSizing: "border-box",
		position: "absolute",
		pointerEvents: "none",
		zIndex: "10000",
		boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
		translate: `${initialLeft}px ${initialTop}px`,
		margin: "0",
		transition: "none",
	});

	const handle = targetFrame.querySelector(".drag-handle") as HTMLElement;
	if (handle) handle.style.display = "none";
}

function findHitTarget(x: number, y: number, draggingData: any) {
	let hitInfo = null;
	let isAfter = false;
	let closestDist = Infinity;

	for (const [targetEl, info] of dropTargets.entries()) {
		if (info.data === draggingData && info.dataType === "setting") continue;

		const targetCategory: Category | null =
			info.dataType === "category" ? (info.data as Category) : getSettingCategory(info.data as Setting);
		if (!targetCategory || !targetCategory.editable) continue;

		const rect = targetEl.getBoundingClientRect();
		if (x >= rect.left && x <= rect.right) {
			const centerY = rect.top + rect.height / 2;
			const dist = Math.abs(y - centerY);
			const range = info.dataType === "category" ? rect.height : rect.height + 10;

			if (y >= rect.top - range / 2 && y <= rect.bottom + range / 2) {
				if (dist < closestDist) {
					closestDist = dist;
					hitInfo = { targetEl, ...info };
					isAfter = y > centerY;
				}
			}
		}
	}
	return hitInfo ? { ...hitInfo, isAfter } : null;
}

async function moveItem(draggingData: any, targetInfo: any) {
	const isGroup = draggingData.type === "group";
	const isCategory = draggingData.category != null;

	if (isCategory) {
		const addOnItems = getAddOnItems();
		const sourceIdx = addOnItems.indexOf(draggingData as Category);
		if (sourceIdx > -1) {
			addOnItems.splice(sourceIdx, 1);
			const targetIdx = addOnItems.indexOf(targetInfo.data as Category) + (targetInfo.isAfter ? 1 : 0);
			addOnItems.splice(targetIdx, 0, draggingData as Category);
			await saveToStorage("addOnStyleShiftItems", addOnItems);
		}
		return;
	}

	const itemToMove = draggingData as Setting;
	const sourceCategory = getSettingCategory(itemToMove);
	if (!sourceCategory || !sourceCategory.editable) return;

	const allSettings = sourceCategory.settings;
	const targetCategory: Category | null =
		targetInfo.dataType === "category" ? (targetInfo.data as Category) : getSettingCategory(targetInfo.data as Setting);

	if (!targetCategory || !targetCategory.editable) return;

	let itemsToInsert = [itemToMove];
	if (isGroup) {
		const startIdx = allSettings.indexOf(itemToMove);
		let endIdx = allSettings.length;
		for (let i = startIdx + 1; i < allSettings.length; i++) {
			if (["group", "subTitle"].includes((allSettings[i] as any).type)) {
				endIdx = i;
				break;
			}
		}
		itemsToInsert = allSettings.splice(startIdx, endIdx - startIdx);
	} else {
		const idx = allSettings.indexOf(itemToMove);
		if (idx > -1) allSettings.splice(idx, 1);
	}

	const dropIndex =
		targetInfo.dataType === "category" ? 0 : targetCategory.settings.indexOf(targetInfo.data as Setting) + (targetInfo.isAfter ? 1 : 0);

	targetCategory.settings.splice(dropIndex, 0, ...itemsToInsert);
	await saveToStorage("addOnStyleShiftItems", getAddOnItems());
}

export async function addDrag(dragHandle: HTMLElement, frame: HTMLElement | null, _parent: HTMLElement | null, thisData: Setting | Category) {
	dragHandle.addEventListener("mousedown", (event) => {
		event.preventDefault();

		const targetFrame = frame || (dragHandle.closest(".STYLESHIFT-Setting-Frame") as HTMLElement);
		const currentParent = targetFrame?.parentElement;
		const scroller = currentParent?.closest(".STYLESHIFT-Scrollable") as HTMLElement;
		if (!targetFrame || !currentParent || !scroller) return;

		const frameBound = targetFrame.getBoundingClientRect();
		const scrollerRect = scroller.getBoundingClientRect();
		const offsetY = event.clientY - frameBound.top;

		dragingSetting = { size: frameBound.height, Data: thisData };

		clearCurrentPlaceholder();
		currentPlaceholder = createPlaceholder(dragingSetting.size);
		currentParent.insertBefore(currentPlaceholder.element, targetFrame);
		currentPlaceholder.show();

		applyDragStyles(targetFrame, frameBound, scrollerRect, scroller);
		scroller.setAttribute("draging", "");

		let currentMouseEvent = event;
		let renderDrag = true;
		let lastHitEl: HTMLElement | null = null;
		let lastHitIsAfter = false;

		const updateLoop = () => {
			if (!renderDrag) return;

			const targetY = currentMouseEvent.clientY - scrollerRect.top + scroller.scrollTop - offsetY;
			targetFrame.style.translate = `${frameBound.left - scrollerRect.left}px ${targetY}px`;

			const hit = findHitTarget(currentMouseEvent.clientX, currentMouseEvent.clientY, thisData);

			if (hit && (hit.targetEl !== lastHitEl || hit.isAfter !== lastHitIsAfter)) {
				clearCurrentPlaceholder();
				currentPlaceholder = createPlaceholder(dragingSetting!.size);

				if (hit.isAfter) {
					insertAfter(currentPlaceholder.element, hit.targetEl, hit.targetEl.parentElement!);
				} else {
					hit.targetEl.parentElement!.insertBefore(currentPlaceholder.element, hit.targetEl);
				}

				currentPlaceholder.show();
				lastHitEl = hit.targetEl;
				lastHitIsAfter = hit.isAfter;
			}
			requestAnimationFrame(updateLoop);
		};
		updateLoop();

		const onMouseMove = (moveEvent: MouseEvent) => (currentMouseEvent = moveEvent);

		const onMouseUp = async () => {
			document.removeEventListener("mousemove", onMouseMove);
			renderDrag = false;
			scroller.removeAttribute("draging");
			clearCurrentPlaceholder();

			if (lastHitEl) {
				const targetInfo = { ...dropTargets.get(lastHitEl), targetEl: lastHitEl, isAfter: lastHitIsAfter };
				if (targetInfo.data) await moveItem(thisData, targetInfo);
			}

			dragingSetting = null;
			refreshExtensionState();
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp, { once: true });
	});
}

export async function addDropTarget(
	frame: HTMLElement,
	_parent: HTMLElement,
	thisData: Setting | Category,
	dataType: string,
) {
	dropTargets.set(frame, { data: thisData, dataType });
}
