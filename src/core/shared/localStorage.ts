import { logger } from "@/shared/logger";

/**
 * Utility for interacting with the browser's LocalStorage with automatic JSON serialization and error handling.
 */
export const localStorageUtil = {
	/**
	 * Retrieves and parses a value from LocalStorage.
	 *
	 * @template T
	 * @param {string} key - The key of the item to retrieve.
	 * @param {T | null} [defaultValue=null] - The value to return if the key is not found or parsing fails.
	 * @returns {T | null} The parsed value or defaultValue.
	 *
	 * @example
	 * const settings = localStorageUtil.get("userSettings", { theme: "dark" });
	 */
	get: <T>(key: string, defaultValue: T | null = null): T | null => {
		try {
			const item = localStorage.getItem(key);
			const parsed = item ? JSON.parse(item) : defaultValue;
			logger.debug("localstorage", `LocalStorage.get("${key}")`, parsed);
			return parsed;
		} catch (error) {
			logger.error("localstorage", `LocalStorage.get error for key "${key}"`, error);
			return defaultValue;
		}
	},

	/**
	 * Serializes and saves a value to LocalStorage.
	 *
	 * @template T
	 * @param {string} key - The key to save the item under.
	 * @param {T} value - The value to save.
	 *
	 * @example
	 * localStorageUtil.set("userSettings", { theme: "light" });
	 */
	set: <T>(key: string, value: T): void => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			logger.debug("localstorage", `LocalStorage.set("${key}")`, value);
		} catch (error) {
			logger.error("localstorage", `LocalStorage.set error for key "${key}"`, error);
		}
	},

	/**
	 * Removes an item from LocalStorage.
	 *
	 * @param {string} key - The key of the item to remove.
	 *
	 * @example
	 * localStorageUtil.remove("userSettings");
	 */
	remove: (key: string): void => {
		try {
			localStorage.removeItem(key);
			logger.debug("localstorage", `LocalStorage.remove("${key}")`);
		} catch (error) {
			logger.error("localstorage", `LocalStorage.remove error for key "${key}"`, error);
		}
	},
};
