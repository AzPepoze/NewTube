/**
 * Wraps an async task so only one run happens at a time. Use it to stop saves from overlapping.
 *
 * @param {Function} task - The async function to run, which can take any arguments.
 * @returns {Function} An async wrapper that queues at most one more run with the latest arguments.
 *
 * @example
 * const saveSettings = sequencedTask(async (settings) => {
 *   await browser.storage.sync.set(settings);
 * });
 * saveSettings({ theme: "dark" });
 * saveSettings({ theme: "light" }); // runs once more after the first save
 */
export function sequencedTask(task: Function): Function {
	let isRunning = false;
	let pendingArgs: any[] | null = null;

	return async function (...args: any[]) {
		if (isRunning) {
			pendingArgs = args;
			return;
		}

		isRunning = true;
		try {
			let currentArgs: any[] | null = args;
			while (currentArgs) {
				pendingArgs = null;
				await task(...currentArgs);
				currentArgs = pendingArgs;
			}
		} finally {
			isRunning = false;
		}
	};
}

/**
 * Delays a function until calls stop for a set time. Use it for resize or scroll handlers.
 *
 * @param {Function} func - The function to run later.
 * @param {number} wait - How long to wait in milliseconds after the last call.
 * @returns {Function} A wrapper that runs it after the wait, resetting on each call.
 *
 * @example
 * const onResize = debounce(() => applyStyles(), 250);
 * window.addEventListener("resize", onResize);
 */
export function debounce(func: Function, wait: number): Function {
	let timeout: any;
	return function (...args: any[]) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

/**
 * Waits for a set number of milliseconds. Use it to pause before retrying or checking the page.
 *
 * @param {number} delay - How long to wait in milliseconds.
 * @returns {Promise<void>} Resolves after the delay has passed.
 *
 * @example
 * await sleep(500);
 * const player = document.querySelector("#movie_player");
 */
export function sleep(delay: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Turns a string into a stable number. Use it as a seed or key when you need repeatable values.
 *
 * @param {string} str - The text to convert.
 * @returns {number} A stable non-negative number for that text.
 *
 * @example
 * const key = stringToNumber("StyleShift");
 * // result: 2122129777
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
 * Picks a whole number in a range that stays the same for a given seed.
 *
 * @param {number} minimum - The lowest number it can return.
 * @param {number} maximum - The highest number it can return.
 * @param {string | number} seed - The seed that makes the result repeatable.
 * @returns {number} A whole number between minimum and maximum, inclusive.
 *
 * @example
 * const index = randomNumberInRange(0, 7, "user-theme");
 * // result: 3 (the same every time for this seed)
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
 * Builds a random ID from letters and digits. Use it for temporary element IDs or keys.
 *
 * @param {number} length - How many characters the ID should have.
 * @returns {string} A random string made of letters and digits.
 *
 * @example
 * const id = createUniqueId(10);
 * // result: "A1b2C3d4E5" (different on each call)
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
 * Copies data by turning it into JSON and back. Use it for quick copies of plain settings objects.
 *
 * @param {any} data - The value to copy. Functions, undefined and circular references are lost.
 * @returns {any} A new copy that does not share references with the original.
 *
 * @example
 * const snapshot = deepClone(settings);
 * snapshot.theme = "light"; // settings is not changed
 */
export function deepClone(data: any): any {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Returns a copy with object keys sorted A to Z at every level.
 *
 * @param {T} value - The value to sort. Arrays keep their original order.
 * @returns {T} A new value with all plain object keys sorted alphabetically.
 *
 * @example
 * const sorted = sortObjectKeys({ b: 1, a: 2 });
 * // result: { a: 2, b: 1 }
 */
export function sortObjectKeys<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map((item) => sortObjectKeys(item)) as T;
	}

	if (value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
		return Object.keys(value)
			.sort()
			.reduce(
				(sorted, key) => {
					sorted[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
					return sorted;
				},
				{} as Record<string, unknown>,
			) as T;
	}

	return value;
}

/**
 * Downloads data as a file in the browser. Use it to export settings as JSON.
 *
 * @param {BlobPart} data - The file content, such as a JSON string or Blob.
 * @param {string} filename - The name the saved file should have.
 *
 * @example
 * downloadFile(JSON.stringify(settings), "styleshift-theme.json");
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
