import { categoryToLogStyle } from '@core/utils/logFormat';

/**
 * Logger utility for the web page context (injected script).
 * This logger is designed to be self-contained and work within the page environment,
 * falling back to custom styled console logs if the main StyleShift logger is not available.
 */
export const logger = {
	/**
	 * Logs an informational message.
	 * 
	 * @param {string} category - The log category (e.g., "dom", "runtime").
	 * @param {...any[]} args - The values to log.
	 * 
	 * @example
	 * logger.info("runtime", "Extension started");
	 */
	info: (category: string, ...args: any[]) => {
		if ((window as any).StyleShift?.logger?.info) {
			return (window as any).StyleShift.logger.info(category, ...args);
		}
		console.log(
			`%c StyleShift %c [INFO] %c [${category}]`,
			"color: #bada55",
			"color: #00ffff",
			categoryToLogStyle(category),
			...args,
		);
	},

	/**
	 * Logs a warning message.
	 * 
	 * @param {string} category - The log category.
	 * @param {...any[]} args - The values to log.
	 * 
	 * @example
	 * logger.warn("dom", "Element not found");
	 */
	warn: (category: string, ...args: any[]) => {
		if ((window as any).StyleShift?.logger?.warn) {
			return (window as any).StyleShift.logger.warn(category, ...args);
		}
		console.warn(
			`%c StyleShift %c [WARN] %c [${category}]`,
			"color: #bada55",
			"color: #ffae00",
			categoryToLogStyle(category),
			...args,
		);
	},

	/**
	 * Logs an error message.
	 * 
	 * @param {string} category - The log category.
	 * @param {...any[]} args - The values to log.
	 * 
	 * @example
	 * logger.error("api", "Failed to fetch settings", error);
	 */
	error: (category: string, ...args: any[]) => {
		if ((window as any).StyleShift?.logger?.error) {
			return (window as any).StyleShift.logger.error(category, ...args);
		}
		console.error(
			`%c StyleShift %c [ERROR] %c [${category}]`,
			"color: #bada55",
			"color: #ff0000",
			categoryToLogStyle(category),
			...args,
		);
	},

	/**
	 * Logs a debug message.
	 * 
	 * @param {string} category - The log category.
	 * @param {...any[]} args - The values to log.
	 * 
	 * @example
	 * logger.debug("events", "Received message", msg);
	 */
	debug: (category: string, ...args: any[]) => {
		if ((window as any).StyleShift?.logger?.debug) {
			return (window as any).StyleShift.logger.debug(category, ...args);
		}
		console.debug(
			`%c StyleShift %c [DEBUG] %c [${category}]`,
			"color: #bada55",
			"color: #888888",
			categoryToLogStyle(category),
			...args,
		);
	},
};
