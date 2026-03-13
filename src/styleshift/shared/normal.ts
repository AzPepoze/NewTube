const categoryPalette = ["#ff6d6d", "#a7f2ff", "#ffa7f8", "#bca7ff", "#fff1a7", "#a7ffb5", "#ffc4a7", "#a7d1ff"];

function stringToColor(str: string) {
	if (str.toUpperCase() === "STORAGE") return "color: #ffca28; font-weight: bold;";
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % categoryPalette.length;
	return `color: ${categoryPalette[index]}; font-weight: bold;`;
}

export const logger = {
	info: (category, ...args: any[]) => {
		if ((window as any).StyleShift?.logger?.info) {
			return (window as any).StyleShift.logger.info(category, ...args);
		}
		console.log(
			`%c StyleShift %c [INFO] %c [${category}]`,
			"color: #bada55",
			"color: #00ffff",
			stringToColor(category),
			...args,
		);
	},
	warn: (category, ...args: any[]) => {
		if ((window as any).StyleShift?.logger?.warn) {
			return (window as any).StyleShift.logger.warn(category, ...args);
		}
		console.warn(
			`%c StyleShift %c [WARN] %c [${category}]`,
			"color: #bada55",
			"color: #ffae00",
			stringToColor(category),
			...args,
		);
	},
	error: (category, ...args: any[]) => {
		if ((window as any).StyleShift?.logger?.error) {
			return (window as any).StyleShift.logger.error(category, ...args);
		}
		console.error(
			`%c StyleShift %c [ERROR] %c [${category}]`,
			"color: #bada55",
			"color: #ff0000",
			stringToColor(category),
			...args,
		);
	},
	debug: (category, ...args: any[]) => {
		if ((window as any).StyleShift?.logger?.debug) {
			return (window as any).StyleShift.logger.debug(category, ...args);
		}
		console.debug(
			`%c StyleShift %c [DEBUG] %c [${category}]`,
			"color: #bada55",
			"color: #888888",
			stringToColor(category),
			...args,
		);
	},
};

/**
 * Creates a runner that ensures only one async task runs at a time.
 * If tasks are requested while one is running, it will run exactly once more
 * with the latest state after the current task finishes.
 */
export function sequencedTask(task: Function): Function {
	let isRunning = false;
	let hasPending = false;

	return async function (...args: any[]) {
		if (isRunning) {
			hasPending = true;
			return;
		}

		isRunning = true;
		try {
			await task(...args);
			while (hasPending) {
				hasPending = false;
				await task(...args);
			}
		} finally {
			isRunning = false;
		}
	};
}

/**
 * Debounces a function call.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export function debounce(func: Function, wait: number): Function {
	let timeout: any;
	return function (...args: any[]) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

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
 * hexToRgba("#ff5733"); // { r: 255, g: 87, b: 51, a: 1 }
 */
export function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
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
 * hexToRgb("#ff5733"); // { r: 255, g: 87, b: 51 }
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
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
 * rgbaToHex(255, 87, 51, 0.5); // "#ff573380"
 */
export function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
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
 * rgbToHsv({ r: 255, g: 87, b: 51 }); // { h: 14, s: 80, v: 100 }
 */
export function rgbToHsv(rgb: { r: number; g: number; b: number }): { h: number; s: number; v: number } {
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
 * hsvToRgb({ h: 14, s: 80, v: 100 }); // { r: 255, g: 87, b: 51 }
 */
export function hsvToRgb(hsv: { h: number; s: number; v: number }): { r: number; g: number; b: number } {
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
 * isScrollable(document.body); // true or false depending on the body scrollability
 */
export function isScrollable(element: HTMLElement): boolean {
	const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
	const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;
	return hasVerticalScrollbar || hasHorizontalScrollbar;
}

/**
 * Gets the nearest scrollable parent of an element.
 * @param {HTMLElement | null} element - The element to check.
 * @returns {HTMLElement | null}
 * @example
 * Get_Scroll_parent(document.querySelector("#myelement")); // Returns the nearest scrollable parent
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
 * Converts a string to a number.
 * @param {string} str - The string to convert.
 * @returns {number}
 * @example
 * stringToNumber("example"); // Returns a numerical hash of the string
 */
export function stringToNumber(str: string): number {
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
export function randomNumberInRange(minimum: number, maximum: number, seed: string | number): number {
	const numericalSeed = typeof seed === "string" ? stringToNumber(seed) : seed;

	const a = 931;
	const c = 49297;
	const m = 233280;

	let currentSeed = numericalSeed;

	const random = (): number => {
		currentSeed = (currentSeed * a + c) % m;
		return currentSeed / m;
	};

	return Math.floor(minimum + random() * (maximum - minimum + 1));
}

/**
 * Gets the document body element, waiting if necessary.
 * @returns {Promise<HTMLElement>}
 * @example
 * await getDocumentBody(); // Returns the document body element
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
 * @returns {Promise<HTMLElement>}
 * @example
 * await getDocumentHead(); // Returns the document head element
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
 * @param {HTMLElement} targetElement - The target element.
 * @param {Function} callback - The callback function.
 * @example
 * onceElementRemove(document.querySelector("#myelement"),() => logger.info("element removed"));
 */
export function onceElementRemove(targetElement: HTMLElement, callback: Function): void {
	const observer = new MutationObserver((mutationsList, observer) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
				for (const removedNode of Array.from(mutation.removedNodes)) {
					if (removedNode === targetElement) {
						logger.info("element removed");
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
 * getElementCenterPosition(document.querySelector("#myelement")); // { x: number, y: number }
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
 * @returns {Promise<number>}
 * @example
 * await waitDocumentLoaded(); // Waits until the document is fully loaded
 */
export async function waitDocumentLoaded(): Promise<number> {
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
 * createUniqueId(10); // Returns a unique ID of length 10
 */
export function createUniqueId(length: number): string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let uniqueId = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		uniqueId += charset[randomIndex];
	}

	return uniqueId;
}

/**
 * Gets the current domain.
 * @returns {string}
 * @example
 * getCurrentDomain(); // Returns the current domain
 */
export function getCurrentDomain(): string {
	const hostname = window.location.origin;
	const domainParts = hostname.split(".");
	const domain = domainParts.slice(-2).join(".");

	return domain;
}

/**
 * Scrolls to a target element when a button is clicked.
 * @param {HTMLElement} button - The button element.
 * @param {HTMLElement} target - The target element.
 * @example
 * scrollOnClick(document.querySelector("#mybutton"), document.querySelector("#mytarget"));
 */
export function scrollOnClick(button: HTMLElement, target: HTMLElement): void {
	button.addEventListener("click", function () {
		target.scrollIntoView({ behavior: "smooth" });
	});
}



/**
 * Rearranges a selector string.
 * @param {string} value - The selector string.
 * @returns {string}
 * @example
 * rearrangeSelector("div, span"); // "div,\nspan"
 */
export function rearrangeSelector(value: string): string {
	return value.replace(/\s+/g, " ").replace(/\n/g, "").replace(/, /g, ",").replace(/,/g, ",\n");
}

/**
 * Checks if a value is an array of objects.
 * @param {any} value - The value to check.
 * @returns {boolean}
 * @example
 * isObjectArray([{ a: 1 }, { b: 2 }]); // true
 */
export function isObjectArray(value: any): boolean {
	return Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null);
}

/**
 * Deep clones an object.
 * @param {any} data - The data to clone.
 * @returns {any}
 * @example
 * deepClone({ a: 1 }); // { a: 1 }
 */
export function deepClone(data: any): any {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Checks if two objects are the same.
 * @param {object} obj1 - The first object.
 * @param {object} obj2 - The second object.
 * @returns {boolean}
 * @example
 * isSameObj({ a: 1 }, { a: 1 }); // true
 */
export function isSameObj(obj1: object, obj2: object): boolean {
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
 * await waitForElement("#myelement", 5000); // Waits for the element to appear within 5 seconds
 */
export async function waitForElement(selector: string, timeout?: number): Promise<HTMLElement | null> {
	const startTime = Date.now();
	while (true) {
		const element = document.querySelector(selector) as HTMLElement | null;
		if (element) {
			return element;
		}
		if (timeout && Date.now() - startTime >= timeout) {
			logger.warn(`timeout: element "${selector}" not found within ${timeout}ms`);
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
 * downloadFile("Hello, world!", "hello.txt");
 */
export function downloadFile(data: BlobPart, filename: string): void {
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
 * inputFile(document.querySelector("#fileInput"));
 */
export function inputFile(element: HTMLInputElement): void {
	element.addEventListener("change", async (event: Event) => {
		const file = (event.target as HTMLInputElement).files[0];
		if (!file) return;

		try {
			return file;
		} catch (error) {
			logger.error("Error reading file:", error);
		}
	});
}

/**
 * Gets the current URL parameters.
 * @returns {{ [key: string]: string }}
 * @example
 * getCurrentUrlParameters(); // Returns an object with the current URL parameters
 */
export function getCurrentUrlParameters(): { [key: string]: string } {
	const searchParams = new URL(window.location.href).searchParams;
	const result: { [key: string]: string } = {};
	searchParams.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}


