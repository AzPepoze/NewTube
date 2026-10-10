import { categoryToLogStyle } from "@core/utils/logFormat";

/**
 * Logger utility for the web page context (injected script).
 * This logger is designed to be self-contained and work within the page environment,
 * falling back to custom styled console logs if the main StyleShift logger is not available.
 */
export const logger = {
	/**
	 * Logs an informational message. Use it for normal progress updates.
	 *
	 * @param {string} category - The group label shown in the log, like "dom" or "runtime".
	 * @param {...any[]} args - The message text, followed by any extra values to log.
	 *
	 * @example
	 * logger.info("runtime", "StyleShift loaded on this page");
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
	 * Logs a warning message. Use it when something looks wrong but your script can continue.
	 *
	 * @param {string} category - The group label shown in the log, like "dom" or "runtime".
	 * @param {...any[]} args - The message text, followed by any extra values to log.
	 *
	 * @example
	 * logger.warn("dom", "Player element not found yet");
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
	 * Logs an error message. Use it when a step fails and you want the details visible.
	 *
	 * @param {string} category - The group label shown in the log, like "dom" or "runtime".
	 * @param {...any[]} args - The message text, followed by any extra values to log.
	 *
	 * @example
	 * logger.error("api", "Failed to save settings", error);
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
	 * Logs a debug message. Use it for extra detail you only need while testing.
	 *
	 * @param {string} category - The group label shown in the log, like "dom" or "runtime".
	 * @param {...any[]} args - The message text, followed by any extra values to log.
	 *
	 * @example
	 * logger.debug("events", "Received message", event.data);
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
