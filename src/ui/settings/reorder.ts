import { refreshExtensionState } from "@core/index";
import { insertAfter } from "@core/shared/eventHelpers";
import { saveToStorage } from "@core/storage/manager";
import { getAddOnItems, getSettingCategory } from "@settings/registry/items";
import type { Category, Setting } from "@settings/types/styleshiftTypes";
import { logger } from "@shared/logger";

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

export async function addDrag(
	dragHandle: HTMLElement,
	frame: HTMLElement | null,
	_parent: HTMLElement | null,
	thisData: Setting | Category,
) {
	dragHandle.addEventListener("mousedown", async function (event) {
		event.preventDefault();

		const targetFrame = frame || (dragHandle.closest(".STYLESHIFT-Setting-Frame") as HTMLElement);
		if (!targetFrame) return;

		const currentParent = targetFrame.parentElement;
		if (!currentParent) return;

		const scroller = currentParent.closest(".STYLESHIFT-Scrollable") as HTMLElement;
		if (!scroller) return;

		const frameBound = targetFrame.getBoundingClientRect();
		const offsetY = event.clientY - frameBound.top;

		dragingSetting = {
			size: frameBound.height,
			Data: thisData,
		};

		logger.info("drag", "Started:", dragingSetting);

		const scrollerRect = scroller.getBoundingClientRect();
		const initialTop = frameBound.top - scrollerRect.top + scroller.scrollTop;
		const initialLeft = frameBound.left - scrollerRect.left;

		clearCurrentPlaceholder();
		currentPlaceholder = createPlaceholder(dragingSetting.size);
		currentParent.insertBefore(currentPlaceholder.element, targetFrame);
		currentPlaceholder.show();

		targetFrame.style.width = `${frameBound.width}px`;
		targetFrame.style.height = `${frameBound.height}px`;
		targetFrame.style.boxSizing = "border-box";
		targetFrame.style.position = "absolute";
		targetFrame.style.pointerEvents = "none";
		targetFrame.style.zIndex = "10000";
		targetFrame.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
		targetFrame.style.translate = `${initialLeft}px ${initialTop}px`;
		targetFrame.style.margin = "0";
		targetFrame.style.transition = "none";

		const handle = targetFrame.querySelector(".drag-handle") as HTMLElement;
		if (handle) handle.style.display = "none";

		scroller.setAttribute("draging", "");

		let currentMouseEvent = event;
		let renderDrag = true;

		let lastHitEl: HTMLElement | null = null;
		let lastHitIsAfter = false;

		function updateDragFunction() {
			if (!renderDrag) return;

			const targetY = currentMouseEvent.clientY - scrollerRect.top + scroller.scrollTop - offsetY;
			targetFrame!.style.translate = `${initialLeft}px ${targetY}px`;

			const x = currentMouseEvent.clientX;
			const y = currentMouseEvent.clientY;

			let hitInfo = null;
			let isAfter = false;
			let closestDist = Infinity;

			for (const [targetEl, info] of dropTargets.entries()) {
				if (info.data === thisData && info.dataType === "setting") continue;

				const targetCategory: Category | null =
					info.dataType === "category"
						? (info.data as Category)
						: getSettingCategory(info.data as Setting);
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
							isAfter = info.dataType === "category" ? true : y > centerY;
						}
					}
				}
			}

			if (hitInfo && (hitInfo.targetEl !== lastHitEl || isAfter !== lastHitIsAfter)) {
				clearCurrentPlaceholder();

				currentPlaceholder = createPlaceholder(dragingSetting!.size);

				if (isAfter) {
					insertAfter(currentPlaceholder.element, hitInfo.targetEl, hitInfo.targetEl.parentElement!);
				} else {
					hitInfo.targetEl.parentElement!.insertBefore(currentPlaceholder.element, hitInfo.targetEl);
				}

				currentPlaceholder.show();

				lastHitEl = hitInfo.targetEl;
				lastHitIsAfter = isAfter;
			}

			requestAnimationFrame(updateDragFunction);
		}
		updateDragFunction();

		function onDrag(event: MouseEvent) {
			currentMouseEvent = event;
		}

		document.addEventListener("mousemove", onDrag);

		document.addEventListener(
			"mouseup",
			async function () {
				document.removeEventListener("mousemove", onDrag);
				renderDrag = false;

				scroller.removeAttribute("draging");
				clearCurrentPlaceholder();

				logger.debug("drag", "Release detected", { lastHitEl, dragingSetting: dragingSetting?.Data });

				if (lastHitEl) {
					const info = dropTargets.get(lastHitEl);
					if (info) {
						const draggingData = dragingSetting!.Data;
						const isGroup = (draggingData as any).type === "group";
						const isCategory = (draggingData as any).category != null;

						logger.debug("drag", "Drop target found", { isCategory, isGroup, targetDataType: info.dataType });

						if (isCategory) {
							// Move add-on in add-on items list
							const addOnItems = getAddOnItems();
							const sourceIdx = addOnItems.indexOf(draggingData as Category);
							if (sourceIdx > -1) {
								addOnItems.splice(sourceIdx, 1);
								const targetIdx = addOnItems.indexOf(info.data as Category) + (lastHitIsAfter ? 1 : 0);
								addOnItems.splice(targetIdx, 0, draggingData as Category);
								await saveToStorage("addOnStyleShiftItems", addOnItems);
								logger.debug("drag", "Category moved", { sourceIdx, targetIdx, category: (draggingData as any).category });
							}
						} else {
							// Move setting or group
							const itemToMove = draggingData as Setting;
							const sourceCategory = getSettingCategory(itemToMove);

							if (sourceCategory !== null && sourceCategory.editable) {
								if (isGroup) {
									// Group move: find the range of settings
									const sectionTitle = draggingData as any;
									const allSettings = sourceCategory.settings;
									const startIdx = allSettings.indexOf(sectionTitle);
									let endIdx = allSettings.length;
									for (let i = startIdx + 1; i < allSettings.length; i++) {
										if ((allSettings[i] as any).type === "group" || (allSettings[i] as any).type === "subTitle") {
											endIdx = i;
											break;
										}
									}

									const groupItems = allSettings.splice(startIdx, endIdx - startIdx);

									const targetCategory: Category | null =
										info.dataType === "category"
											? (info.data as Category)
											: getSettingCategory(info.data as Setting);

									if (targetCategory !== null && targetCategory.editable) {
										let dropIndex = 0;
										if (info.dataType !== "category") {
											dropIndex = targetCategory.settings.indexOf(info.data as Setting) + (lastHitIsAfter ? 1 : 0);
										}
										targetCategory.settings.splice(dropIndex, 0, ...groupItems);
										logger.info("drag", "Group moved", { startIdx, endIdx, dropIndex, itemCount: groupItems.length });
									}
								} else {
									// Single setting move
									const idx = sourceCategory.settings.indexOf(itemToMove);
									if (idx > -1) sourceCategory.settings.splice(idx, 1);

									const targetCategory: Category | null =
										info.dataType === "category"
											? (info.data as Category)
											: getSettingCategory(info.data as Setting);

									if (targetCategory !== null && targetCategory.editable) {
										let dropIndex = 0;
										if (info.dataType !== "category") {
											dropIndex = targetCategory.settings.indexOf(info.data as Setting) + (lastHitIsAfter ? 1 : 0);
										}
										targetCategory.settings.splice(dropIndex, 0, itemToMove);
										logger.info("drag", "Setting moved", { sourceIdx: idx, dropIndex, settingId: (itemToMove as any).id });
									}
								}
								await saveToStorage("addOnStyleShiftItems", getAddOnItems());
							}
						}
					} else {
						logger.debug("drag", "No drop target found at release point");
					}
				} else {
					logger.debug("drag", "Released outside any drop zone");
				}

				dragingSetting = null;
				logger.info("drag", "Ended");
				refreshExtensionState();
			},
			{ once: true },
		);
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
