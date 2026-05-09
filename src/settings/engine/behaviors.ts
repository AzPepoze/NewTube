import { executeSettingScript } from "@core/runtime/controller";
import { getFromStorage } from "@core/storage/manager";
import { logger } from "@shared/logger";
import { createStylesheet } from "../stylesheet/styleSheet";
import { evaluateConditionAsync } from "./conditions";
import { activeSettingsState } from "./functions";
import { registerSettingListener } from "./listeners";

/**
 * Helper to execute a setting script if it exists.
 */
function tryExecute(setting: any, scriptName: string) {
	if (setting[scriptName]) {
		logger.debug("settings", `Executing ${scriptName} for ${setting.id}`);
		executeSettingScript(setting, scriptName);
	}
}

/**
 * Helper to initialize a setting's stylesheet and setup script.
 */
function initBase(setting: any, needsStylesheet = true) {
	const stylesheet = needsStylesheet ? createStylesheet(setting.id) : null;
	tryExecute(setting, "setupFunction");
	return stylesheet;
}

/**
 * Registry of initialization logic for different setting types.
 */
export const SETTING_TYPE_BEHAVIORS = {
	["checkbox"]: async function (setting: any) {
		const stylesheet = initBase(setting)!;

		async function applyCheckboxUpdate() {
			const currentValue = await getFromStorage(setting.id);
			logger.debug("settings", `Applying checkbox update for ${setting.id}:`, currentValue);

			stylesheet.textContent = (setting.constantCss || ``) + (currentValue ? (setting.enableCss || ``) : (setting.disableCss || ``));

			logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);

			if (activeSettingsState[setting.id] === currentValue) {
				logger.debug("settings", `Value unchanged for ${setting.id}, skipping functions`);
				return;
			}
			activeSettingsState[setting.id] = currentValue;

			tryExecute(setting, "updateFunction");
			tryExecute(setting, currentValue ? "enableFunction" : "disableFunction");
		}

		applyCheckboxUpdate();
		return applyCheckboxUpdate;
	},

	["numberSlide"]: async function (setting: any) {
		const stylesheet = initBase(setting, !!(setting.constantCss || setting.varCss));

		async function applySliderUpdate() {
			const value = await getFromStorage(setting.id);

			if (stylesheet) {
				const varName = setting.varCss || `--${setting.id}`;
				stylesheet.textContent = `:root{${varName}: ${value}${setting.unit || "px"}}` + (setting.constantCss || "");
				logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);
			}

			activeSettingsState[setting.id] = value;
			tryExecute(setting, "updateFunction");
		}

		applySliderUpdate();
		return applySliderUpdate;
	},

	["dropdown"]: async function (setting: any) {
		const stylesheet = initBase(setting)!;

		async function applyDropdownUpdate() {
			const value = await getFromStorage(setting.id);
			if (activeSettingsState[setting.id] === value) return;

			// Disable the previous option
			const previousValue = activeSettingsState[setting.id];
			const options = Array.isArray(setting.options) ? setting.options : [];
			const previousOption = options.find((opt: any) => opt.value === previousValue);
			tryExecute(previousOption, "disableFunction");

			activeSettingsState[setting.id] = value;
			const selectedOption = options.find((opt: any) => opt.value === value);

			// Enable the new option
			tryExecute(selectedOption, "enableFunction");

			stylesheet.textContent = (setting.constantCss || "") + (selectedOption?.enableCss || "");
			logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);
		}

		applyDropdownUpdate();
		return applyDropdownUpdate;
	},

	["color"]: async function (setting: any) {
		const stylesheet = initBase(setting)!;

		async function applyColorUpdate() {
			const value = await getFromStorage(setting.id);
			activeSettingsState[setting.id] = value;

			const varName = setting.varCss || `--${setting.id}`;
			stylesheet.textContent = `:root{${varName}: ${value}}` + (setting.constantCss || ``);
			logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);

			tryExecute(setting, "updateFunction");
		}

		applyColorUpdate();
		return applyColorUpdate;
	},

	["custom"]: async function (setting: any) {
		const stylesheet = initBase(setting, !!setting.constantCss);

		async function applyCustomUpdate() {
			const value = await getFromStorage(setting.id);
			activeSettingsState[setting.id] = value;

			if (stylesheet) {
				stylesheet.textContent = (typeof setting.constantCss === "function" ? setting.constantCss(value) : setting.constantCss) || ``;
				logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);
			}
		}

		applyCustomUpdate();
		return applyCustomUpdate;
	},

	["combineSetting"]: async function (setting: any) {
		const stylesheet = initBase(setting)!;

		async function applyCombinedUpdate() {
			if (stylesheet && setting.updateFunction) {
				stylesheet.textContent = setting.updateFunction;
				logger.debug("settings", `CSS updated for ${setting.id}:`, stylesheet.textContent);
			}
		}

		applyCombinedUpdate();
		return applyCombinedUpdate;
	},

	["conditionSetting"]: async function (setting: any) {
		const stylesheet = initBase(setting)!;

		async function checkConditionsMet(): Promise<boolean> {
			return await evaluateConditionAsync(setting.condition);
		}

		let lastStatus: boolean | null = null;

		async function applyConditionUpdate() {
			const isMet = await checkConditionsMet();
			logger.debug("settings", `Applying condition update for ${setting.id}: met=${isMet}`);

			stylesheet.textContent = isMet ? (setting.enableCss || "") : (setting.disableCss || "");

			if (lastStatus === isMet) return;
			lastStatus = isMet;

			tryExecute(setting, isMet ? "enableFunction" : "disableFunction");
		}

		if (setting.condition) {
			for (const id in setting.condition) {
				registerSettingListener(id, () => applyConditionUpdate());
			}
		}

		applyConditionUpdate();
		return applyConditionUpdate;
	},
};
