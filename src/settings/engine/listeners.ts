import { getFromStorage } from "@core/storage/manager";
import { logger } from "@shared/logger";

export const settingUpdateListeners: Record<string, Function[]> = {};
export const settingInitializers: Record<string, Function[]> = {};

/**
 * Registers a callback to be executed whenever a specific setting changes.
 */
export function registerSettingListener(settingId: string, callback: (value: any) => void, runImmediately = false) {
	if (!settingUpdateListeners[settingId]) {
		settingUpdateListeners[settingId] = [];
	}
	settingUpdateListeners[settingId].push(callback);

	if (runImmediately) {
		if (!settingInitializers[settingId]) {
			settingInitializers[settingId] = [];
		}
		settingInitializers[settingId].push(callback);
	}
}

/**
 * Removes a previously registered listener.
 */
export function unregisterSettingListener(settingId: string, callback: Function) {
	if (!settingUpdateListeners[settingId]) return;

	settingUpdateListeners[settingId] = settingUpdateListeners[settingId].filter((l) => l !== callback);

	if (settingUpdateListeners[settingId].length === 0) {
		delete settingUpdateListeners[settingId];
	}
}

/**
 * Runs all initializers for a specific setting.
 */
export async function runSettingInitialization(settingId: string) {
	if (settingInitializers[settingId]) {
		const currentValue = await getFromStorage(settingId);
		for (const initializer of settingInitializers[settingId]) {
			initializer(currentValue);
		}
	}
}

/**
 * Runs initializers for all settings that have them.
 */
export async function initializeAllActiveSettings() {
	for (const id in settingInitializers) {
		logger.debug("settings", "Initializing setting:", id);
		runSettingInitialization(id);
	}
}
