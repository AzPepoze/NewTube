import { executeSettingScript } from "@core/runtime/controller";
import { waitOneFrame } from "@core/shared/eventHelpers";
import { getFromStorage } from "@core/storage/manager";
import { type Setting } from "@settings/types/styleshiftTypes";
import { logger } from "@shared/logger";
import { getAllStyleShiftSettings } from "../registry/items";

// Internal modules
import { SETTING_TYPE_BEHAVIORS } from "./behaviors";
import { settingInitializers, settingUpdateListeners } from "./listeners";

// Re-exports
export * from "./behaviors";
export * from "./conditions";
export * from "./listeners";

export const activeSettingsState: Record<string, any> = {};
export const settingUpdateHandlers: Record<string, Function> = {};
const updateThrottleState: Record<string, "Idle" | "Waiting" | "Processing"> = {};

/**
 * Deactivates all currently active settings.
 */
export async function deactivateAllActiveSettings() {
	const allSettings = await getAllStyleShiftSettings();
	for (const setting of allSettings) {
		if (activeSettingsState[setting.id] !== undefined) {
			switch (setting.type) {
				case "checkbox":
					if (activeSettingsState[setting.id] && setting.disableFunction) {
						logger.debug("settings", `Executing disableFunction for ${setting.id} (checkbox)`);
						executeSettingScript(setting, "disableFunction");
					}
					break;
				case "dropdown":
					const previousValue = activeSettingsState[setting.id];
					if (previousValue && setting.options[previousValue]?.disableFunction) {
						logger.debug("settings", `Executing disableFunction for ${setting.id} (dropdown option: ${previousValue})`);
						executeSettingScript(setting.options[previousValue], "disableFunction");
					}
					break;
			}
			const stylesheet = document.getElementById(`styleshift-stylesheet-${setting.id}`);
			if (stylesheet) {
				stylesheet.remove();
			}
			delete activeSettingsState[setting.id];
			logger.debug("settings", `Deactivated setting: ${setting.id}`);
		}
	}
	logger.debug("settings", "All active settings deactivated.");
}

/**
 * Re-activates all settings by triggering their updates.
 */
export async function reactivateAllSettings() {
	logger.info("settings", "Re-activating all settings...");
	const allSettings = await getAllStyleShiftSettings();
	for (const setting of allSettings) {
		if (setting.id === "Themes") continue;
		triggerSettingUpdate(setting.id, true);
	}
	// Note: initializeAllActiveSettings is re-exported from listeners
	const { initializeAllActiveSettings } = await import("./listeners");
	await initializeAllActiveSettings();
	logger.info("settings", "All settings re-activated.");
}

/**
 * Binds the appropriate update logic to a setting based on its type.
 */
export async function attachBehaviorToSetting(setting: Setting) {
	if (setting.id == null) return;

	const initializer = SETTING_TYPE_BEHAVIORS[setting.type];
	if (!initializer) return;

	const updateHandler = await initializer(setting);
	settingUpdateHandlers[setting.id] = updateHandler;

	return updateHandler;
}

/**
 * Migrates runtime state (handlers, listeners, initializers) when a setting ID changes.
 */
export function migrateSettingRuntimeState(oldId: string, newId: string) {
	if (oldId === newId) return;

	if (settingUpdateHandlers[oldId]) {
		settingUpdateHandlers[newId] = settingUpdateHandlers[oldId];
		delete settingUpdateHandlers[oldId];
	}

	if (settingUpdateListeners[oldId]) {
		settingUpdateListeners[newId] = settingUpdateListeners[oldId];
		delete settingUpdateListeners[oldId];
	}

	if (settingInitializers[oldId]) {
		settingInitializers[newId] = settingInitializers[oldId];
		delete settingInitializers[oldId];
	}

	if (updateThrottleState[oldId]) {
		updateThrottleState[newId] = updateThrottleState[oldId];
		delete updateThrottleState[oldId];
	}

	if (activeSettingsState[oldId] !== undefined) {
		activeSettingsState[newId] = activeSettingsState[oldId];
		delete activeSettingsState[oldId];
	}
}

/**
 * Triggers an update for a specific setting.
 */
export async function triggerSettingUpdate(settingId: string, silent: boolean = false) {
	logger.debug("settings", "Triggering update for:", settingId, silent ? "(silent)" : "");
	const state = updateThrottleState[settingId] || "Idle";

	if (state === "Waiting") {
		logger.debug("settings", "Already waiting for update:", settingId);
		return;
	}

	if (state === "Processing") {
		logger.debug("settings", "Currently processing, setting to waiting:", settingId);
		updateThrottleState[settingId] = "Waiting";
		await waitOneFrame();
		return triggerSettingUpdate(settingId, silent);
	}

	updateThrottleState[settingId] = "Processing";

	if (settingUpdateHandlers[settingId]) {
		logger.debug("settings", "Executing update handler for:", settingId);
		await settingUpdateHandlers[settingId]();
	} else {
		logger.debug("settings", "No update handler found for:", settingId);
	}

	const currentValue = await getFromStorage(settingId);

	if (settingUpdateListeners[settingId] && !silent) {
		logger.debug("settings", `Executing ${settingUpdateListeners[settingId].length} listeners for:`, settingId);
		for (const listener of settingUpdateListeners[settingId]) {
			listener(currentValue);
		}
	}

	logger.debug("settings", "Setting updated:", settingId, currentValue);

	await waitOneFrame();
	updateThrottleState[settingId] = "Idle";
}

/**
 * Triggers updates for multiple settings at once, optimizing performance by skipping per-setting frame waits.
 */
export async function triggerSettingsUpdateBatch(settingIds: string[]) {
	logger.debug("settings", "Triggering batch update for:", settingIds.length, "settings");

	for (const id of settingIds) {
		if (settingUpdateHandlers[id]) {
			await settingUpdateHandlers[id]();
		}

		const currentValue = await getFromStorage(id);
		if (settingUpdateListeners[id]) {
			for (const listener of settingUpdateListeners[id]) {
				listener(currentValue);
			}
		}
	}

	await waitOneFrame();
}
