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
 */
export function sleep(delay: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Converts a string to a number.
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
 * Creates a unique ID of a specified length.
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
 * Deep clones an object.
 */
export function deepClone(data: any): any {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Downloads a file with the specified data and filename.
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
