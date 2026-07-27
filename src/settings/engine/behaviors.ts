import { executeSettingScript } from "@core/runtime/controller";
import { getFromStorage } from "@core/storage/manager";
import { logger } from "@shared/logger";
import { getSettingById } from "../registry/items";
import { createStylesheet } from "../stylesheet/styleSheet";
import { evaluateConditionAsync } from "./conditions";
import { activeSettingsState } from "./functions";
import { registerSettingListener } from "./listeners";

/**
 * Helper to execute a setting script if it exists.
 */
function tryExecute(setting: any, scriptName: string) {
	if (setting && setting[scriptName]) {
		logger.debug("settings", `Executing ${scriptName} for ${setting.id}`);
		executeSettingScript(setting, scriptName);
	}
}

/**
 * Helper to fetch the latest setting object from registry.
 */
function getLatestSetting(setting: any) {
	if (!setting?.id) return setting;
	return getSettingById(setting.id) || setting;
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
			const currentSetting = getLatestSetting(setting);
			const isLocked = currentSetting.lock?.condition ?? false;
			const currentValue = isLocked ? false : await getFromStorage(currentSetting.id);
			logger.debug(
				"settings",
				`Applying checkbox update for ${currentSetting.id}:`,
				currentValue,
				isLocked ? "(locked)" : "",
			);

			stylesheet.textContent =
				(currentSetting.constantCss || ``) +
				(currentValue ? currentSetting.enableCss || `` : currentSetting.disableCss || ``);

			logger.debug("settings", `CSS updated for ${currentSetting.id}:`, stylesheet.textContent);

			if (activeSettingsState[currentSetting.id] === currentValue) {
				logger.debug("settings", `Value unchanged for ${currentSetting.id}, skipping functions`);
				return;
			}
			activeSettingsState[currentSetting.id] = currentValue;

			tryExecute(currentSetting, "updateFunction");
			tryExecute(currentSetting, currentValue ? "enableFunction" : "disableFunction");
		}

		applyCheckboxUpdate();
		return applyCheckboxUpdate;
	},

	["numberSlide"]: async function (setting: any) {
		const stylesheet = initBase(setting, !!(setting.constantCss || setting.varCss));

		async function applySliderUpdate() {
			const currentSetting = getLatestSetting(setting);
			const value = await getFromStorage(currentSetting.id);

			if (stylesheet) {
				const varName = currentSetting.varCss || `--${currentSetting.id}`;
				stylesheet.textContent =
					`:root{${varName}: ${value}${currentSetting.unit || "px"}}` + (currentSetting.constantCss || "");
				logger.debug("settings", `CSS updated for ${currentSetting.id}:`, stylesheet.textContent);
			}

			activeSettingsState[currentSetting.id] = value;
			tryExecute(currentSetting, "updateFunction");
		}

		applySliderUpdate();
		return applySliderUpdate;
	},

	["dropdown"]: async function (setting: any) {
		const stylesheet = initBase(setting)!;

		async function applyDropdownUpdate() {
			const currentSetting = getLatestSetting(setting);
			const value = await getFromStorage(currentSetting.id);
			if (activeSettingsState[currentSetting.id] === value) return;

			// Disable the previous option
			const previousValue = activeSettingsState[currentSetting.id];
			const options = Array.isArray(currentSetting.options) ? currentSetting.options : [];
			const previousOption = options.find((opt: any) => opt.value === previousValue);
			tryExecute(previousOption, "disableFunction");

			activeSettingsState[currentSetting.id] = value;
			const selectedOption = options.find((opt: any) => opt.value === value);

			// Enable the new option
			tryExecute(selectedOption, "enableFunction");

			stylesheet.textContent = (currentSetting.constantCss || "") + (selectedOption?.enableCss || "");
			logger.debug("settings", `CSS updated for ${currentSetting.id}:`, stylesheet.textContent);
		}

		applyDropdownUpdate();
		return applyDropdownUpdate;
	},

	["color"]: async function (setting: any) {
		const stylesheet = initBase(setting)!;

		async function applyColorUpdate() {
			const currentSetting = getLatestSetting(setting);
			const value = await getFromStorage(currentSetting.id);
			activeSettingsState[currentSetting.id] = value;

			const varName = currentSetting.varCss || `--${currentSetting.id}`;
			stylesheet.textContent = `:root{${varName}: ${value}}` + (currentSetting.constantCss || ``);
			logger.debug("settings", `CSS updated for ${currentSetting.id}:`, stylesheet.textContent);

			tryExecute(currentSetting, "updateFunction");
		}

		applyColorUpdate();
		return applyColorUpdate;
	},

	["custom"]: async function (setting: any) {
		const stylesheet = initBase(setting, !!setting.constantCss);

		async function applyCustomUpdate() {
			const currentSetting = getLatestSetting(setting);
			const value = await getFromStorage(currentSetting.id);
			activeSettingsState[currentSetting.id] = value;

			if (stylesheet) {
				stylesheet.textContent =
					(typeof currentSetting.constantCss === "function"
						? currentSetting.constantCss(value)
						: currentSetting.constantCss) || ``;
				logger.debug("settings", `CSS updated for ${currentSetting.id}:`, stylesheet.textContent);
			}
		}

		applyCustomUpdate();
		return applyCustomUpdate;
	},

	["combineSetting"]: async function (setting: any) {
		const stylesheet = initBase(setting)!;

		async function applyCombinedUpdate() {
			const currentSetting = getLatestSetting(setting);
			if (stylesheet && currentSetting.updateFunction) {
				stylesheet.textContent = currentSetting.updateFunction;
				logger.debug("settings", `CSS updated for ${currentSetting.id}:`, stylesheet.textContent);
			}
		}

		applyCombinedUpdate();
		return applyCombinedUpdate;
	},

	["conditionSetting"]: async function (setting: any) {
		const stylesheet = initBase(setting)!;

		async function checkConditionsMet(cond: any): Promise<boolean> {
			return await evaluateConditionAsync(cond);
		}

		let lastStatus: boolean | null = null;

		async function applyConditionUpdate() {
			const currentSetting = getLatestSetting(setting);
			const isMet = await checkConditionsMet(currentSetting.condition);
			logger.debug("settings", `Applying condition update for ${currentSetting.id}: met=${isMet}`);

			stylesheet.textContent = isMet ? currentSetting.enableCss || "" : currentSetting.disableCss || "";

			if (lastStatus === isMet) return;
			lastStatus = isMet;

			tryExecute(currentSetting, isMet ? "enableFunction" : "disableFunction");
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
