import { categoryToLogStyle } from '@core/utils/logFormat';

/**
 * Logger for the web page context (injected script).
 * This is separate from the extension's main logger as it needs to be self-contained
 * and work within the page environment.
 */
export const logger = {
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
