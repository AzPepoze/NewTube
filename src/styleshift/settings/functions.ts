import { executeSettingScript } from "../core/runtimeController";
import { getFromStorage } from "../core/storageManager";
import { Setting } from "../types/store";
import { createStylesheet } from "./styleSheet";
import { logger } from "../../shared/logger";
import { waitOneFrame } from "../shared/advance";

export const activeSettingsState: Record<string, any> = {};
const settingUpdateHandlers: Record<string, Function> = {};

const settingUpdateListeners: Record<string, Function[]> = {};
const settingInitializers: Record<string, Function[]> = {};

/**
 * Registry of initialization logic for different setting types.
 */
const SETTING_TYPE_BEHAVIORS = {
	["checkbox"]: async function (setting: any) {
		let stylesheet: HTMLElement = createStylesheet(setting.id);

		if (setting.setupFunction) {
			executeSettingScript(setting, "setupFunction");
		}

		async function applyCheckboxUpdate() {
			const currentValue = await getFromStorage(setting.id);
			logger.debug("settings", `Applying checkbox update for ${setting.id}:`, currentValue);

			stylesheet.textContent = setting.constantCss || ``;

			if (currentValue) {
				stylesheet.textContent += setting.enableCss || ``;
			} else {
				stylesheet.textContent += setting.disableCss || ``;
			}

			logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);

			if (activeSettingsState[setting.id] === currentValue) {
				logger.debug("settings", `Value unchanged for ${setting.id}, skipping functions`);
				return;
			}
			activeSettingsState[setting.id] = currentValue;

			if (setting.updateFunction) {
				logger.debug("settings", `Executing updateFunction for ${setting.id}`);
				executeSettingScript(setting, "updateFunction");
			}

			if (currentValue) {
				if (setting.enableFunction) {
					logger.debug("settings", `Executing enableFunction for ${setting.id}`);
					executeSettingScript(setting, "enableFunction");
				}
			} else {
				if (setting.disableFunction) {
					logger.debug("settings", `Executing disableFunction for ${setting.id}`);
					executeSettingScript(setting, "disableFunction");
				}
			}
		}

		applyCheckboxUpdate();
		return applyCheckboxUpdate;
	},

	["numberSlide"]: async function (setting: any) {
		let stylesheet: HTMLElement;
		if (setting.constantCss || setting.varCss) {
			stylesheet = createStylesheet(setting.id);
		}

		if (setting.setupFunction) {
			executeSettingScript(setting, "setupFunction");
		}

		async function applySliderUpdate() {
			const value = await getFromStorage(setting.id);

			if (stylesheet) {
				stylesheet.textContent = "";
				const varName = setting.varCss || `--${setting.id}`;
				stylesheet.textContent += `:root{${varName}: ${value}${setting.unit || "px"}}`;
				if (setting.constantCss) {
					stylesheet.textContent += setting.constantCss;
				}
				logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);
			}

			activeSettingsState[setting.id] = value;

			if (setting.updateFunction) {
				executeSettingScript(setting, "updateFunction");
			}
		}

		applySliderUpdate();
		return applySliderUpdate;
	},

	["dropdown"]: async function (setting: any) {
		const stylesheet = createStylesheet(setting.id);
		if (setting.setupFunction) {
			executeSettingScript(setting, "setupFunction");
		}

		async function applyDropdownUpdate() {
			const value = await getFromStorage(setting.id);
			if (activeSettingsState[setting.id] === value) return;

			// Disable the previous option
			const previousValue = activeSettingsState[setting.id];
			if (previousValue && setting.options[previousValue]?.disableFunction) {
				executeSettingScript(setting.options[previousValue], "disableFunction");
			}

			activeSettingsState[setting.id] = value;
			const selectedOption = setting.options[value];

			// Enable the new option
			if (selectedOption?.enableFunction) {
				executeSettingScript(selectedOption, "enableFunction");
			}

			stylesheet.textContent = "";
			if (setting.constantCss) {
				stylesheet.textContent += setting.constantCss;
			}
			if (selectedOption?.enableCss) {
				stylesheet.textContent += selectedOption.enableCss;
			}
			logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);
		}

		applyDropdownUpdate();
		return applyDropdownUpdate;
	},

	["color"]: async function (setting: any) {
		const stylesheet = createStylesheet(setting.id);

		if (setting.setupFunction) {
			executeSettingScript(setting, "setupFunction");
		}

		async function applyColorUpdate() {
			const value = await getFromStorage(setting.id);
			activeSettingsState[setting.id] = value;

			stylesheet.textContent = "";
			const varName = setting.varCss || `--${setting.id}`;
			stylesheet.textContent += `:root{${varName}: ${value}}`;
			stylesheet.textContent += setting.constantCss || ``;
			logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);

			if (setting.updateFunction) {
				executeSettingScript(setting, "updateFunction");
			}
		}

		applyColorUpdate();
		return applyColorUpdate;
	},

	["custom"]: async function (setting: any) {
		let stylesheet: HTMLElement;
		if (setting.constantCss) {
			stylesheet = createStylesheet(setting.id);
		}

		if (setting.setupFunction) {
			executeSettingScript(setting, "setupFunction");
		}

		async function applyCustomUpdate() {
			const value = await getFromStorage(setting.id);
			activeSettingsState[setting.id] = value;

			if (stylesheet) {
				if (typeof setting.constantCss === "function") {
					stylesheet.textContent = setting.constantCss(value) || ``;
				} else {
					stylesheet.textContent = setting.constantCss || ``;
				}
				logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);
			}
		}

		applyCustomUpdate();
		return applyCustomUpdate;
	},

	["combineSettings"]: async function (setting: any) {
		const stylesheet = createStylesheet(setting.id);

		async function applyCombinedUpdate() {
			if (stylesheet && setting.updateFunction) {
				stylesheet.textContent = setting.updateFunction;
				logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);
			}
		}

		applyCombinedUpdate();
		return applyCombinedUpdate;
	},
};

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

const updateThrottleState: Record<string, "Idle" | "Waiting" | "Processing"> = {};

/**
 * Triggers the update logic for a specific setting, with basic throttling.
 */
export async function triggerSettingUpdate(settingId: string) {
	logger.debug("settings", "Triggering update for:", settingId);
	const state = updateThrottleState[settingId] || "Idle";

	if (state === "Waiting") {
		logger.debug("settings", "Already waiting for update:", settingId);
		return;
	}

	if (state === "Processing") {
		logger.debug("settings", "Currently processing, setting to waiting:", settingId);
		updateThrottleState[settingId] = "Waiting";
		await waitOneFrame();
		return triggerSettingUpdate(settingId);
	}

	updateThrottleState[settingId] = "Processing";

	if (settingUpdateHandlers[settingId]) {
		logger.debug("settings", "Executing update handler for:", settingId);
		await settingUpdateHandlers[settingId]();
	} else {
		logger.debug("settings", "No update handler found for:", settingId);
	}

	const currentValue = await getFromStorage(settingId);

	// Execute registered listeners
	if (settingUpdateListeners[settingId]) {
		logger.debug("settings", `Executing ${settingUpdateListeners[settingId].length} listeners for:`, settingId);
		for (const listener of settingUpdateListeners[settingId]) {
			listener(currentValue);
		}
	}

	logger.info("settings", "Setting updated:", settingId, currentValue);

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
