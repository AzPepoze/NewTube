import { waitOneFrame } from "../buildInFunctions/normal";
import { executeSettingScript } from "../core/runtimeController";
import { getFromStorage } from "../core/storageManager";
import { Setting } from "../types/store";
import { createStylesheet } from "./styleSheet";
import { logger } from "../utils/logger";

export const activeSettingsState: Record<string, any> = {};
const settingUpdateHandlers: Record<string, Function> = {};

const settingUpdateListeners: Record<string, Function[]> = {};
const settingInitializers: Record<string, Function[]> = {};

/**
 * Registry of initialization logic for different setting types.
 */
const SETTING_TYPE_BEHAVIORS = {
	["checkbox"]: async function (setting: any) {
		let stylesheet: HTMLElement;
		if (setting.constantCss || setting.enableCss || setting.disableCss) {
			stylesheet = createStylesheet(setting.id);
		}

		if (setting.setupFunction) {
			executeSettingScript(setting, "setupFunction");
		}

		async function applyCheckboxUpdate() {
			const currentValue = await getFromStorage(setting.id);

			if (stylesheet) {
				stylesheet.textContent = setting.constantCss || ``;
			}

			if (currentValue) {
				if (stylesheet) stylesheet.textContent += setting.enableCss || ``;
			} else {
				if (stylesheet) stylesheet.textContent += setting.disableCss || ``;
			}

			if (activeSettingsState[setting.id] === currentValue) return;
			activeSettingsState[setting.id] = currentValue;

			if (setting.updateFunction) {
				executeSettingScript(setting, "updateFunction");
			}

			if (currentValue) {
				if (setting.enableFunction) executeSettingScript(setting, "enableFunction");
			} else {
				if (setting.disableFunction) executeSettingScript(setting, "disableFunction");
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

			executeSettingScript(setting, "disableFunction");

			activeSettingsState[setting.id] = value;
			const selectedOption = setting.options[value];
			executeSettingScript(setting, "enableFunction");

			stylesheet.textContent = "";
			if (setting.constantCss) {
				stylesheet.textContent += setting.constantCss;
			}
			if (selectedOption?.enableCss) {
				stylesheet.textContent += selectedOption.enableCss;
			}
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

			if (stylesheet) {
				stylesheet.textContent = "";
				const varName = setting.varCss || `--${setting.id}`;
				stylesheet.textContent += `:root{${varName}: ${value}}`;
				stylesheet.textContent += setting.constantCss || ``;
			}

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
	const state = updateThrottleState[settingId] || "Idle";

	if (state === "Waiting") return;

	if (state === "Processing") {
		updateThrottleState[settingId] = "Waiting";
		await waitOneFrame();
		return triggerSettingUpdate(settingId);
	}

	updateThrottleState[settingId] = "Processing";

	if (settingUpdateHandlers[settingId]) {
		await settingUpdateHandlers[settingId]();
	}

	const currentValue = await getFromStorage(settingId);

	// Execute registered listeners
	if (settingUpdateListeners[settingId]) {
		for (const listener of settingUpdateListeners[settingId]) {
			listener(currentValue);
		}
	}

	logger.info("settings", "Setting updated:", settingId, currentValue);

	await waitOneFrame();
	updateThrottleState[settingId] = "Idle";
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
		logger.info("settings", "Initializing setting:", id);
		runSettingInitialization(id);
	}
}
