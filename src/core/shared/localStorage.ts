import { logger } from '@/shared/logger';

export const localStorageUtil = {
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

	set: <T>(key: string, value: T): void => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			logger.debug("localstorage", `LocalStorage.set("${key}")`, value);
		} catch (error) {
			logger.error("localstorage", `LocalStorage.set error for key "${key}"`, error);
		}
	},

	remove: (key: string): void => {
		try {
			localStorage.removeItem(key);
			logger.debug("localstorage", `LocalStorage.remove("${key}")`);
		} catch (error) {
			logger.error("localstorage", `LocalStorage.remove error for key "${key}"`, error);
		}
	},
};
