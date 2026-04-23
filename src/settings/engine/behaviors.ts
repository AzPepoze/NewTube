import { executeSettingScript } from "@core/runtime/controller";
import { getFromStorage } from "@core/storage/manager";
import { logger } from "@shared/logger";
import { createStylesheet } from "../stylesheet/styleSheet";
import { evaluateConditionAsync } from "./conditions";
import { activeSettingsState } from "./functions";
import { registerSettingListener } from "./listeners";

/**
 * Registry of initialization logic for different setting types.
 */
export const SETTING_TYPE_BEHAVIORS = {
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

	["combineSetting"]: async function (setting: any) {
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

	["conditionSetting"]: async function (setting: any) {
		const stylesheet = createStylesheet(setting.id);

		async function checkConditionsMet(): Promise<boolean> {
			return await evaluateConditionAsync(setting.condition);
		}

		let lastStatus: boolean | null = null;

		async function applyConditionUpdate() {
			const isMet = await checkConditionsMet();
			logger.debug("settings", `Applying condition update for ${setting.id}: met=${isMet}`);

			stylesheet.textContent = "";
			if (isMet) {
				stylesheet.textContent = setting.enableCss || "";
			} else {
				stylesheet.textContent = setting.disableCss || "";
			}

			if (lastStatus === isMet) return;
			lastStatus = isMet;

			if (isMet) {
				if (setting.enableFunction) {
					executeSettingScript(setting, "enableFunction");
				}
			} else {
				if (setting.disableFunction) {
					executeSettingScript(setting, "disableFunction");
				}
			}
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
