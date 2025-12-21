/**
 * Pauses execution for a specified delay.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Promise<void>}
 * @example
 * await sleep(1000); // Pauses execution for 1 second
 */
export function sleep(delay: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

//---------------------------------------------

/**
 * Converts a hex color string to an RGBA object.
 * @param {string} hex - The hex color string.
 * @returns {{ r: number; g: number; b: number; a: number }}
 * @example
 * hex_to_rgba("#ff5733"); // { r: 255, g: 87, b: 51, a: 1 }
 */
export function hex_to_rgba(hex: string): { r: number; g: number; b: number; a: number } {
	hex = hex.replace(/^#/, "");

	if (hex.length === 6) {
		hex += "ff";
	} else if (hex.length !== 8) {
		throw new Error("Invalid hex color format");
	}

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const a = parseInt(hex.substring(6, 8), 16) / 255;

	return { r, g, b, a };
}

/**
 * Converts a hex color string to an RGB object.
 * @param {string} hex - The hex color string.
 * @returns {{ r: number; g: number; b: number }}
 * @example
 * hex_to_rbg("#ff5733"); // { r: 255, g: 87, b: 51 }
 */
export function hex_to_rbg(hex: string): { r: number; g: number; b: number } {
	hex = hex.replace(/^#/, "");

	if (hex.length === 3) {
		hex = hex
			.split("")
			.map(function (char) {
				return char + char;
			})
			.join("");
	}

	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	return { r, g, b };
}

/**
 * Converts RGBA values to a hex color string.
 * @param {number} r - The red value.
 * @param {number} g - The green value.
 * @param {number} b - The blue value.
 * @param {number} [a=1] - The alpha value.
 * @returns {string}
 * @example
 * rgba_to_hex(255, 87, 51, 0.5); // "#ff573380"
 */
export function rgba_to_hex(r: number, g: number, b: number, a: number = 1): string {
	r = Math.round(Math.min(255, Math.max(0, r)));
	g = Math.round(Math.min(255, Math.max(0, g)));
	b = Math.round(Math.min(255, Math.max(0, b)));
	a = Math.min(1, Math.max(0, a));

	let hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
		.toString(16)
		.padStart(2, "0")}`;
	if (a < 1) {
		hex += Math.round(a * 255)
			.toString(16)
			.padStart(2, "0");
	}

	return hex;
}

/**
 * Converts RGB values to an HSV object.
 * @param {{ r: number; g: number; b: number }} rgb - The RGB values.
 * @returns {{ h: number; s: number; v: number }}
 * @example
 * rgb_to_hsv({ r: 255, g: 87, b: 51 }); // { h: 14, s: 80, v: 100 }
 */
export function rgb_to_hsv(rgb: { r: number; g: number; b: number }): { h: number; s: number; v: number } {
	let r = rgb.r,
		g = rgb.g,
		b = rgb.b;
	r /= 255;
	g /= 255;
	b /= 255;
	const v = Math.max(r, g, b),
		c = v - Math.min(r, g, b);
	const h = c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
	return {
		h: Math.round(60 * (h < 0 ? h + 6 : h)),
		s: v && Math.round((c / v) * 100),
		v: Math.round(v * 100),
	};
}

/**
 * Converts HSV values to an RGB object.
 * @param {{ h: number; s: number; v: number }} hsv - The HSV values.
 * @returns {{ r: number; g: number; b: number }}
 * @example
 * hsv_to_rgb({ h: 14, s: 80, v: 100 }); // { r: 255, g: 87, b: 51 }
 */
export function hsv_to_rgb(hsv: { h: number; s: number; v: number }): { r: number; g: number; b: number } {
	const h = hsv.h;
	let s = hsv.s,
		v = hsv.v;
	s /= 100;
	v /= 100;
	const f = (n: number) => (v - v * s * Math.max(Math.min((n + h / 60) % 6, 4 - ((n + h / 60) % 6), 1), 0)) * 255;
	return { r: Math.round(f(5)), g: Math.round(f(3)), b: Math.round(f(1)) };
}

//---------------------------------------------

/**
 * Checks if an element is scrollable.
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean}
 * @example
 * is_scrollable(document.body); // true or false depending on the body scrollability
 */
export function is_scrollable(element: HTMLElement): boolean {
	const has_vertical_scrollbar = element.scrollHeight > element.clientHeight;
	const has_horizontal_scrollbar = element.scrollWidth > element.clientWidth;
	return has_vertical_scrollbar || has_horizontal_scrollbar;
}

/**
 * Gets the nearest scrollable parent of an element.
 * @param {HTMLElement | null} element - The element to check.
 * @returns {HTMLElement | null}
 * @example
 * Get_Scroll_parent(document.querySelector("#myelement")); // Returns the nearest scrollable parent
 */
export function get_scroll_parent(element: HTMLElement | null): HTMLElement | null {
	if (!element) {
		return null;
	}

	let parent = element.parentNode;

	while (parent && parent !== document) {
		if (is_scrollable(parent as HTMLElement)) {
			return parent as HTMLElement;
		}
		parent = parent.parentNode;
	}

	return document.body;
}

/**
 * Converts a string to a number.
 * @param {string} str - The string to convert.
 * @returns {number}
 * @example
 * string_to_number("example"); // Returns a numerical hash of the string
 */
export function string_to_number(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0;
	}
	return Math.abs(hash);
}

/**
 * Generates a random number between a minimum and maximum value using a seed.
 * @param {number} minimum - The minimum value.
 * @param {number} maximum - The maximum value.
 * @param {string | number} seed - The seed value.
 * @returns {number}
 * @example
 * random(1, 100, "seed"); // Returns a random number between 1 and 100 based on the seed
 */
export function random_number_in_range(minimum: number, maximum: number, seed: string | number): number {
	const numerical_seed = typeof seed === "string" ? string_to_number(seed) : seed;

	const a = 931;
	const c = 49297;
	const m = 233280;

	let current_seed = numerical_seed;

	const random = (): number => {
		current_seed = (current_seed * a + c) % m;
		return current_seed / m;
	};

	return Math.floor(minimum + random() * (maximum - minimum + 1));
}

/**
 * Gets the document body element, waiting if necessary.
 * @returns {Promise<HTMLElement>}
 * @example
 * await get_document_body(); // Returns the document body element
 */
export async function get_document_body(): Promise<HTMLElement> {
	const document_body = document.body;

	if (document_body) {
		return document_body;
	} else {
		await sleep(100);
		return await get_document_body();
	}
}

/**
 * Gets the document head element, waiting if necessary.
 * @returns {Promise<HTMLElement>}
 * @example
 * await get_document_head(); // Returns the document head element
 */
export async function get_document_head(): Promise<HTMLElement> {
	const document_head = document.head;

	if (document_head) {
		return document_head;
	} else {
		await sleep(100);
		return await get_document_body();
	}
}

/**
 * Executes a callback when a target element is removed from the DOM.
 * @param {HTMLElement} target_element - The target element.
 * @param {Function} callback - The callback function.
 * @example
 * once_element_remove(document.querySelector("#myelement"),() => console.log("element removed"));
 */
export function once_element_remove(target_element: HTMLElement, callback: Function): void {
	const observer = new MutationObserver((mutations_list, observer) => {
		for (const mutation of mutations_list) {
			if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
				for (const removed_node of Array.from(mutation.removedNodes)) {
					if (removed_node === target_element) {
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
 * @param {HTMLElement} element - The element to check.
 * @returns {{ x: number; y: number }}
 * @example
 * get_element_center_position(document.querySelector("#myelement")); // { x: number, y: number }
 */
export function get_element_center_position(element: HTMLElement): { x: number; y: number } {
	const rect = element.getBoundingClientRect();
	const center_x = rect.left + rect.width / 2;
	const center_y = rect.top + rect.height / 2;

	return {
		x: center_x,
		y: center_y,
	};
}

/**
 * Waits for the document to be fully loaded.
 * @returns {Promise<number>}
 * @example
 * await wait_document_loaded(); // Waits until the document is fully loaded
 */
export async function wait_document_loaded(): Promise<number> {
	while (document.readyState !== "complete") {
		await sleep(10);
	}
	return 0;
}

/**
 * Creates a unique ID of a specified length.
 * @param {number} length - The length of the ID.
 * @returns {string}
 * @example
 * create_unique_id(10); // Returns a unique ID of length 10
 */
export function create_unique_id(length: number): string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let unique_id = "";

	for (let i = 0; i < length; i++) {
		const random_index = Math.floor(Math.random() * charset.length);
		unique_id += charset[random_index];
	}

	return unique_id;
}

/**
 * Gets the current domain.
 * @returns {string}
 * @example
 * get_current_domain(); // Returns the current domain
 */
export function get_current_domain(): string {
	const hostname = window.location.origin;
	const domain_parts = hostname.split(".");
	const domain = domain_parts.slice(-2).join(".");

	return domain;
}

/**
 * Scrolls to a target element when a button is clicked.
 * @param {HTMLElement} button - The button element.
 * @param {HTMLElement} target - The target element.
 * @example
 * scroll_on_click(document.querySelector("#mybutton"), document.querySelector("#mytarget"));
 */
export function scroll_on_click(button: HTMLElement, target: HTMLElement): void {
	button.addEventListener("click", function () {
		target.scrollIntoView({ behavior: "smooth" });
	});
}

/**
 * Applies drag functionality to an element.
 * @param {HTMLElement} drag_object - The draggable object.
 * @param {HTMLElement} target - The target element.
 * @example
 * apply_drag(document.querySelector("#dragObject"), document.querySelector("#target"));
 */
export function apply_drag(drag_object: HTMLElement, target: HTMLElement): void {
	let is_dragging = false;
	let start_x = 0;
	let start_y = 0;
	let initial_target_x = 0;
	let initial_target_y = 0;

	drag_object.addEventListener("mousedown", function (event) {
		is_dragging = true;
		start_x = event.clientX;
		start_y = event.clientY;

		const rect = target.getBoundingClientRect();
		initial_target_x = rect.left;
		initial_target_y = rect.top;

		event.preventDefault();
	});

	document.addEventListener("mousemove", function (event) {
		if (!is_dragging) return;

		const delta_x = event.clientX - start_x;
		const delta_y = event.clientY - start_y;

		target.style.left = `${initial_target_x + delta_x}px`;
		target.style.top = `${initial_target_y + delta_y}px`;

		const parent = target.parentElement;
		parent.style.justifyContent = "start";
		parent.style.alignItems = "start";
	});

	document.addEventListener("mouseup", function () {
		if (!is_dragging) return;
		is_dragging = false;
	});
}

/**
 * updates the drag position of an element.
 * @param {HTMLElement} element - The element to update.
 * @param {MouseEvent} event - The mouse event.
 * @param {number} offset_x - The X offset.
 * @param {number} offset_y - The Y offset.
 * @example
 * update_drag_position(document.querySelector("#element"), event, 10, 10);
 */
export function update_drag_position(
	element: HTMLElement,
	event: MouseEvent,
	offset_x: number,
	offset_y: number
): void {
	element.style.left = `${event.clientX - offset_x}px`;
	element.style.top = `${event.clientY - offset_y}px`;
}

/**
 * Rearranges a selector string.
 * @param {string} value - The selector string.
 * @returns {string}
 * @example
 * rearrange_selector("div, span"); // "div,\nspan"
 */
export function rearrange_selector(value: string): string {
	return value.replace(/\s+/g, " ").replace(/\n/g, "").replace(/, /g, ",").replace(/,/g, ",\n");
}

/**
 * Checks if a value is an array of objects.
 * @param {any} value - The value to check.
 * @returns {boolean}
 * @example
 * is_object_array([{ a: 1 }, { b: 2 }]); // true
 */
export function is_object_array(value: any): boolean {
	return Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null);
}

/**
 * Deep clones an object.
 * @param {any} data - The data to clone.
 * @returns {any}
 * @example
 * deep_clone({ a: 1 }); // { a: 1 }
 */
export function deep_clone(data: any): any {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Checks if two objects are the same.
 * @param {object} obj1 - The first object.
 * @param {object} obj2 - The second object.
 * @returns {boolean}
 * @example
 * is_same_obj({ a: 1 }, { a: 1 }); // true
 */
export function is_same_obj(obj1: object, obj2: object): boolean {
	if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
	for (const key in obj1) {
		if (obj1[key] !== obj2[key]) return false;
	}
	return true;
}

/**
 * Waits for an element to appear in the DOM.
 * @param {string} selector - The CSS selector.
 * @param {number} [timeout] - The timeout in milliseconds.
 * @returns {Promise<HTMLElement | null>}
 * @example
 * await wait_for_element("#myelement", 5000); // Waits for the element to appear within 5 seconds
 */
export async function wait_for_element(selector: string, timeout?: number): Promise<HTMLElement | null> {
	const start_time = Date.now();
	while (true) {
		const element = document.querySelector(selector) as HTMLElement | null;
		if (element) {
			return element;
		}
		if (timeout && Date.now() - start_time >= timeout) {
			console.warn(`timeout: element "${selector}" not found within ${timeout}ms`);
			return null;
		}
		await sleep(100);
	}
}

/**
 * Downloads a file with the specified data and filename.
 * @param {BlobPart} data - The file data.
 * @param {string} filename - The filename.
 * @example
 * download_file("Hello, world!", "hello.txt");
 */
export function download_file(data: BlobPart, filename: string): void {
	const file = new Blob([data]);
	const a = document.createElement("a"),
		url = URL.createObjectURL(file);
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(function () {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

/**
 * Handles file input change event.
 * @param {HTMLInputelement} element - The input element.
 * @example
 * input_file(document.querySelector("#fileInput"));
 */
export function input_file(element: HTMLInputElement): void {
	element.addEventListener("change", async (event: Event) => {
		const file = (event.target as HTMLInputElement).files[0];
		if (!file) return;

		try {
			return file;
		} catch (error) {
			console.error("Error reading file:", error);
		}
	});
}

/**
 * Gets the current URL parameters.
 * @returns {{ [key: string]: string }}
 * @example
 * get_current_url_parameters(); // Returns an object with the current URL parameters
 */
export function get_current_url_parameters(): { [key: string]: string } {
	const search_params = new URL(window.location.href).searchParams;
	const result: { [key: string]: string } = {};
	search_params.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}

//---------------------------------------------

/**
 * Fires a custom event with the specified function name and arguments.
 * @param {string} [prefix="Function"] - The event prefix.
 * @param {string} function_name - The function name.
 * @param {...any[]} args - The function arguments.
 * @returns {Promise<void>}
 * @example
 * await fire_function_event("custom", "MyFunction", 1, 2, 3);
 */
export async function fire_function_event(
	prefix: string = "Function",
	function_name: string,
	...args: any[]
): Promise<void> {
	const sent_event = new CustomEvent(`${prefix}_${function_name}`, {
		detail: { data: args },
	});
	console.log("Sent", sent_event);
	window.dispatchEvent(sent_event);
}

/**
 * Fires a custom event with the specified function name and arguments, and waits for a return value.
 * @param {string} [prefix="Function"] - The event prefix.
 * @param {string} function_name - The function name.
 * @param {...any[]} args - The function arguments.
 * @returns {Promise<any>}
 * @example
 * const result = await fire_function_event_with_return("custom", "MyFunction", 1, 2, 3);
 */
export async function fire_function_event_with_return(
	prefix: string = "Function",
	function_name: string,
	...args: any[]
): Promise<any> {
	const remote_id = create_unique_id(10);

	const sent_event = new CustomEvent(`${prefix}_${function_name}`, {
		detail: JSON.stringify({ remote_id: remote_id, data: args }),
	});

	console.log("Sent", sent_event);

	window.dispatchEvent(sent_event);

	return new Promise((resolve, reject) => {
		window.addEventListener(
			`${prefix}_${function_name}_${remote_id}`,
			function (event) {
				//@ts-ignore
				const detail = JSON.parse(event.detail);
				console.log("Return Data", `${prefix}_${function_name}_${remote_id}`, detail);
				resolve(detail);
			},
			{ once: true }
		);
	});
}

/**
 * Listens for a custom event with the specified function name and executes a callback.
 * @param {string} [prefix="Function"] - The event prefix.
 * @param {string} function_name - The function name.
 * @param {Function} callback - The callback function.
 * @returns {Promise<{ Cancel: Function }>}
 * @example
 * const listener = await on_function_event("custom", "MyFunction", (data) => console.log(data));
 * listener.Cancel(); // Cancels the event listener
 */
export async function on_function_event(
	prefix: string = "Function",
	function_name: string,
	callback: Function
): Promise<{ Cancel: Function }> {
	const on_event_run_function = async function (event: Event) {
		const detail = JSON.parse((event as CustomEvent).detail);
		console.log("Recived", event);

		const remote_id = detail.remote_id;
		let get_return;

		if (detail.data && Object.keys(detail.data).length > 0) {
			get_return = await callback(...detail.data);
		} else {
			get_return = await callback();
		}

		window.dispatchEvent(
			new CustomEvent(`${prefix}_${function_name}_${remote_id}`, {
				detail: JSON.stringify(get_return),
			})
		);
	};

	window.addEventListener(`${prefix}_${function_name}`, on_event_run_function);

	return {
		Cancel: function () {
			window.removeEventListener(`${prefix}_${function_name}`, on_event_run_function);
		},
	};
}

/**
 * Waits for one animation frame.
 * @returns {Promise<boolean>}
 * @example
 * await Wait_One_frame(); // Waits for one animation frame
 */
export function wait_one_frame(): Promise<boolean> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			resolve(true);
		});
	});
}

/**
 * Inserts a new node after an existing node.
 * @param {Node} new_node - The new node.
 * @param {Node} existing_node - The existing node.
 * @example
 * insertAfter(document.createElement("div"), document.querySelector("#existing_node"));
 */
export function insert_after(new_node: Node, existing_node: Node, parent_node?: Node): void {
	(existing_node.parentNode || parent_node).insertBefore(new_node, existing_node.nextSibling);
}

/**
 * Formats a number with commas as thousands separators.
 * @param {number} x - The number to format.
 * @returns {string} The formatted number with commas.
 * @example
 * numberWithCommas(1000); // "1,000"
 */
export function number_with_commas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
