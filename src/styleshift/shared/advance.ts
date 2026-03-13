import { logger, createUniqueId } from "./normal";

/**
 * Fires a custom event with the specified function name and arguments.
 * @param {string} [prefix="Function"] - The event prefix.
 * @param {string} functionName - The function name.
 * @param {...any[]} args - The function arguments.
 * @returns {Promise<void>}
 * @example
 * await fireFunctionEvent("custom", "MyFunction", 1, 2, 3);
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
 * Fires a custom event with the specified function name and arguments, and waits for a return value.
 * @param {string} [prefix="Function"] - The event prefix.
 * @param {string} functionName - The function name.
 * @param {...any[]} args - The function arguments.
 * @returns {Promise<any>}
 * @example
 * const result = await fireFunctionEventWithReturn("custom", "MyFunction", 1, 2, 3);
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
 * Listens for a custom event with the specified function name and executes a callback.
 * @param {string} [prefix="Function"] - The event prefix.
 * @param {string} functionName - The function name.
 * @param {Function} callback - The callback function.
 * @returns {Promise<{ Cancel: Function }>}
 * @example
 * const listener = await onFunctionEvent("custom", "MyFunction", (data) => logger.info(data));
 * listener.Cancel(); // Cancels the event listener
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
 * Applies drag functionality to an element.
 * @param {HTMLElement} dragObject - The draggable object.
 * @param {HTMLElement} target - The target element.
 * @example
 * applyDrag(document.querySelector("#dragObject"), document.querySelector("#target"));
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

		target.style.left = `${initialTargetX + deltaX}px`;
		target.style.top = `${initialTargetY + deltaY}px`;

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
 * updates the drag position of an element.
 * @param {HTMLElement} element - The element to update.
 * @param {MouseEvent} event - The mouse event.
 * @param {number} offsetX - The X offset.
 * @param {number} offsetY - The Y offset.
 * @example
 * updateDragPosition(document.querySelector("#element"), event, 10, 10);
 */
export function updateDragPosition(element: HTMLElement, event: MouseEvent, offsetX: number, offsetY: number): void {
	element.style.left = `${event.clientX - offsetX}px`;
	element.style.top = `${event.clientY - offsetY}px`;
}

/**
 * Waits for one animation frame.
 * @returns {Promise<boolean>}
 * @example
 * await Wait_One_frame(); // Waits for one animation frame
 */
export function waitOneFrame(): Promise<boolean> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			resolve(true);
		});
	});
}

/**
 * Inserts a new node after an existing node.
 * @param {Node} newNode - The new node.
 * @param {Node} existingNode - The existing node.
 * @example
 * insertAfter(document.createElement("div"), document.querySelector("#existingNode"));
 */
export function insertAfter(newNode: Node, existingNode: Node, parentNode?: Node): void {
	(existingNode.parentNode || parentNode).insertBefore(newNode, existingNode.nextSibling);
}

/**
 * Formats a number with commas as thousands separators.
 * @param {number} x - The number to format.
 * @returns {string} The formatted number with commas.
 * @example
 * numberWithCommas(1000); // "1,000"
 */
export function numberWithCommas(x: number | string) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
