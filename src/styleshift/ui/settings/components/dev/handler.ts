import { saveItems, synchronizeAvailableFunctions } from "@/styleshift/core/runtimeController";
import { refreshExtensionState } from "@/styleshift/run";
import { logger } from "@/shared/logger";
import { triggerSettingUpdate } from "@/styleshift/settings/functions";
import { refreshSettingUi } from "@/styleshift/ui/settings/settings";
import { getSettingsList } from "@/styleshift/settings/items";

export async function handleLogicUpdate(callback?: Function) {
	logger.debug("config", "Handling logic update...");

	await saveItems();
	await synchronizeAvailableFunctions();

	// Avoid full UI recreation if the callback is the global refresh function
	if (callback && callback !== refreshExtensionState) {
		callback();
	}
}

export async function applyPropertyUpdate(
	setting: any,
	property: string,
	newValue: any,
	options: {
		updateUI?: Function;
		customCallback?: Function;
	} = {},
) {
	const { updateUI, customCallback } = options;
	let finalValue = newValue;

	// JSON parsing for object properties
	if (typeof setting[property] === "object" && setting[property] !== null && typeof newValue === "string") {
		try {
			finalValue = JSON.parse(newValue);
		} catch (e) {
			logger.warn("config", `JSON parse failed for ${property}`, e);
		}
	}

	// Change detection
	const isObject = typeof finalValue === "object" && finalValue !== null;
	const hasChanged = isObject
		? JSON.stringify(setting[property]) !== JSON.stringify(finalValue)
		: setting[property] !== finalValue;

	if (!hasChanged) return;

	const oldId = setting.id;
	setting[property] = finalValue;

	// Rebuild settings list if ID changed
	if (property === "id" && oldId !== finalValue) {
		await getSettingsList(true);
	}

	if (customCallback && customCallback !== updateUI) {
		await customCallback(finalValue);
	}

	// Targeted UI refresh
	if (setting.id) {
		await refreshSettingUi(setting.id);
		await triggerSettingUpdate(setting.id);
	} else if (updateUI) {
		updateUI();
	}

	await saveItems();
}
