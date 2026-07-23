import { logger } from "@core/shared/webPageLogger";

import { createUniqueId } from "./utilities";

/**
 * Fires a custom event on the window object with the specified function name and arguments.
 *
 * @param {string} [prefix="Function"] - The event prefix (e.g., "Command").
 * @param {string} functionName - The name of the function/action.
 * @param {...any[]} args - Arguments to pass in the event detail data.
 * @returns {Promise<void>}
 *
 * @example
 * await fireFunctionEvent("StyleShift", "toggleTheme", true);
 * // Dispatches event: "StyleShift_toggleTheme" with { data: [true] }
 */
export async function fireFunctionEvent(
	prefix: string = "Function",
	functionName: string,
	...args: any[]
): Promise<void> {
	const sentEvent = new CustomEvent(`${prefix}_${functionName}`, {
		detail: { data: args },
	});
	logger.info("Sent", sentEvent);
	window.dispatchEvent(sentEvent);
}

/**
 * Fires a custom event and waits for a response from another part of the extension.
 * Uses a unique remoteId to ensure the return data matches the request.
 *
 * @param {string} [prefix="Function"] - The event prefix.
 * @param {string} functionName - The function name.
 * @param {...any[]} args - Arguments to pass.
 * @returns {Promise<any>} A promise that resolves with the returned data.
 *
 * @example
 * const result = await fireFunctionEventWithReturn("Storage", "getValue", "myKey");
 * console.log("Value:", result);
 */
export async function fireFunctionEventWithReturn(
	prefix: string = "Function",
	functionName: string,
	...args: any[]
): Promise<any> {
	const remoteId = createUniqueId(10);

	const sentEvent = new CustomEvent(`${prefix}_${functionName}`, {
		detail: JSON.stringify({ remoteId: remoteId, data: args }),
	});

	logger.debug("runtime", "Sent event:", `${prefix}_${functionName}`, sentEvent);

	window.dispatchEvent(sentEvent);

	return new Promise((resolve, _reject) => {
		window.addEventListener(
			`${prefix}_${functionName}_${remoteId}`,
			function (event) {
				//@ts-ignore
				const detail = JSON.parse(event.detail);
				logger.debug("runtime", "Received return data:", `${prefix}_${functionName}_${remoteId}`, detail);
				resolve(detail);
			},
			{ once: true },
		);
	});
}

/**
 * Listens for a custom event and executes a callback, then dispatches the result back.
 *
 * @param {string} [prefix="Function"] - The event prefix.
 * @param {string} functionName - The function name.
 * @param {Function} callback - The function to execute when the event is received.
 * @returns {Promise<{ Cancel: Function }>} A promise resolving to an object with a Cancel function to stop listening.
 *
 * @example
 * const listener = await onFunctionEvent("Storage", "getValue", (key) => {
 *   return localStorage.getItem(key);
 * });
 * // To stop listening:
 * listener.Cancel();
 */
export async function onFunctionEvent(
	prefix: string = "Function",
	functionName: string,
	callback: Function,
): Promise<{ Cancel: Function }> {
	const onEventRunFunction = async function (event: Event) {
		const detail = JSON.parse((event as CustomEvent).detail);
		logger.debug("extension", "Processing event request:", event);

		const remoteId = detail.remoteId;
		let getReturn;

		if (detail.data && Object.keys(detail.data).length > 0) {
			getReturn = await callback(...detail.data);
		} else {
			getReturn = await callback();
		}

		window.dispatchEvent(
			new CustomEvent(`${prefix}_${functionName}_${remoteId}`, {
				detail: JSON.stringify(getReturn === undefined ? null : getReturn),
			}),
		);
	};

	window.addEventListener(`${prefix}_${functionName}`, onEventRunFunction);

	return {
		Cancel: function () {
			window.removeEventListener(`${prefix}_${functionName}`, onEventRunFunction);
		},
	};
}

/**
 * Applies drag-and-drop functionality to an element.
 *
 * @param {HTMLElement} dragObject - The handle or element that initiates the drag.
 * @param {HTMLElement} target - The element that actually moves.
 *
 * @example
 * applyDrag(titleBar, windowContainer);
 */
export function applyDrag(dragObject: HTMLElement, target: HTMLElement): void {
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let initialTargetX = 0;
	let initialTargetY = 0;

	dragObject.addEventListener("mousedown", function (event) {
		isDragging = true;
		startX = event.clientX;
		startY = event.clientY;

		const rect = target.getBoundingClientRect();
		initialTargetX = rect.left;
		initialTargetY = rect.top;

		event.preventDefault();
	});

	document.addEventListener("mousemove", function (event) {
		if (!isDragging) return;

		const deltaX = event.clientX - startX;
		const deltaY = event.clientY - startY;

		target.style.translate = `${initialTargetX + deltaX}px ${initialTargetY + deltaY}px`;

		const parent = target.parentElement;
		if (parent) {
			parent.style.justifyContent = "start";
			parent.style.alignItems = "start";
		}
	});

	document.addEventListener("mouseup", function () {
		if (!isDragging) return;
		isDragging = false;
	});
}

/**
 * Directly updates the translation position of an element during a drag event.
 *
 * @param {HTMLElement} element - The element to move.
 * @param {MouseEvent} event - The current mouse event.
 * @param {number} offsetX - The initial X offset from the element's origin.
 * @param {number} offsetY - The initial Y offset from the element's origin.
 *
 * @example
 * updateDragPosition(el, mouseEvent, 50, 50);
 */
export function updateDragPosition(element: HTMLElement, event: MouseEvent, offsetX: number, offsetY: number): void {
	element.style.translate = `${event.clientX - offsetX}px ${event.clientY - offsetY}px`;
}

/**
 * Returns a promise that resolves on the next animation frame.
 * Useful for ensuring DOM updates are processed.
 *
 * @returns {Promise<boolean>}
 *
 * @example
 * await waitOneFrame();
 * // DOM should be updated now
 */
export function waitOneFrame(): Promise<boolean> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			resolve(true);
		});
	});
}

/**
 * Inserts a new DOM node immediately after an existing node.
 *
 * @param {Node} newNode - The node to insert.
 * @param {Node} existingNode - The reference node.
 * @param {Node} [parentNode] - Optional parent node if existingNode's parent is not accessible.
 *
 * @example
 * insertAfter(newDiv, oldDiv);
 */
export function insertAfter(newNode: Node, existingNode: Node, parentNode?: Node): void {
	(existingNode.parentNode || parentNode).insertBefore(newNode, existingNode.nextSibling);
}

/**
 * Formats a number or string into a comma-separated thousands string.
 *
 * @param {number | string} x - The number to format.
 * @returns {string} The formatted string (e.g., "1,234,567").
 *
 * @example
 * const formatted = numberWithCommas(1000000); // "1,000,000"
 */
export function numberWithCommas(x: number | string) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
