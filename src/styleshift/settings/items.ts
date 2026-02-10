import { getDefaultItems } from "../../main/itemsDefault";
import { getStyleshiftDefaultItems } from "../../main/itemsStyleshiftDefault";
import { getStyleshiftCustomItems } from "../../main/itemsStyleshiftCustom";
import { randomNumberInRange } from "../buildInFunctions/normal";
import { persistAndRefreshAll } from "../core/runtimeController";
import { getRootValue, saveToStorage } from "../core/storageManager";
import { refreshExtensionState } from "../run";
import { attachBehaviorToSetting } from "./functions";
import { Category, type Setting } from "../types/store";
import { logger } from "../utils/logger";

const highlightColors = [`255, 109, 109`, `167, 242, 255`, `255, 167, 248`, `188, 167, 255`, `255, 241, 167`];

const styleshiftItems: { Default: Category[]; Custom: Category[] } = {
	Default: [],
	Custom: [],
};

export function getStyleshiftItems() {
	return styleshiftItems;
}

export function getCustomItems() {
	return styleshiftItems.Custom;
}

export function getCustomSettings() {
	return styleshiftItems.Custom.map((item) => item.settings).flat();
}

export function getAllStyleshiftItems() {
	return [...styleshiftItems.Default, ...styleshiftItems.Custom];
}

export function getAllStyleshiftSettings() {
	return getAllStyleshiftItems()
		.map((item) => item.settings)
		.flat();
}

export function findExistSettings(setting: Setting) {
	return getAllStyleshiftSettings().some(
		(thisSetting) =>
			thisSetting.id === setting.id &&
			//@ts-ignore
			(thisSetting.name == null || thisSetting.name === setting.name),
	);
}

export function getSettingCategory(setting: Setting) {
	for (const thisCategory of getAllStyleshiftItems()) {
		for (const thisSetting of thisCategory.settings) {
			if (thisSetting === setting) {
				return thisCategory;
			}
		}
	}
	return null;
}

export function findExistCategory(category: Category) {
	return getAllStyleshiftItems().some((thisCategory) => thisCategory.category === category.category);
}

function autoAddHightlight(array) {
	for (const categoryObj of array) {
		if (categoryObj.Highlight_color == null) {
			const getColorId = randomNumberInRange(0, highlightColors.length - 1, categoryObj.Category);
			logger.info("highlight", "random id", categoryObj.Category, getColorId);
			categoryObj.Highlight_color = highlightColors[getColorId];
		}
	}
}

function saveCustomItemsAndRefreshExtensionState(customItems) {
	saveToStorage("customStyleshiftItems", customItems);
	refreshExtensionState();
}

export async function updateStyleshiftItems() {
	styleshiftItems.Default = [...getStyleshiftDefaultItems(), ...getDefaultItems()];
	
	const storedCustom = await getRootValue("customStyleshiftItems");
	if (storedCustom && Array.isArray(storedCustom) && storedCustom.length > 0) {
		logger.debug("settings", "Loading custom items from storage");
		styleshiftItems.Custom = storedCustom;
	} else {
		logger.debug("settings", "No custom items in storage, using defaults");
		styleshiftItems.Custom = getStyleshiftCustomItems();
	}

	autoAddHightlight(getAllStyleshiftItems());

	// Default

	for (const thisCategory of styleshiftItems.Default) {
		if (thisCategory.editable !== true) {
			thisCategory.editable = false;
		}
	}

	for (const thisSetting of styleshiftItems.Default.flatMap(function (thisSetting) {
		return thisSetting.settings;
	})) {
		if (thisSetting.editable !== true) {
			thisSetting.editable = false;
		}
	}

	// Custom

	for (const thisCategory of styleshiftItems.Custom) {
		thisCategory.editable = true;
	}

	for (const thisSetting of styleshiftItems.Custom.flatMap(function (thisSetting) {
		return thisSetting.settings;
	})) {
		thisSetting.editable = true;
	}
}

let settingsList = {} as { [id: string]: Setting };

export async function getSettingsList(rebuild = false): Promise<{ [id: string]: Setting }> {
	if (!rebuild && Object.keys(settingsList).length) {
		return settingsList;
	}

	settingsList = {};

	for (const categoryObj of getAllStyleshiftItems()) {
		for (const setting of categoryObj.settings) {
			if ("id" in setting && setting.id != null) {
				settingsList[setting.id] = setting;
			}
		}
	}

	return settingsList;
}

//--------------------------------------------------

export async function addSetting(categorySettings: Setting[], thisSetting) {
	let findSimilar = findExistSettings(thisSetting);
	let newPreset;
	let times = 0;

	while (findSimilar) {
		times++;
		newPreset = Object.assign({}, thisSetting);
		newPreset.id += `_${times}`;
		newPreset.name += `_${times}`;
		findSimilar = findExistSettings(newPreset);
		logger.info("settings", findSimilar, times, newPreset);
	}

	if (newPreset) {
		thisSetting = newPreset;
	}

	categorySettings.push(thisSetting);
	logger.info("settings", "update Category settings", categorySettings);

	if (thisSetting.value) {
		await saveToStorage(thisSetting.id, thisSetting.value);
	}

	attachBehaviorToSetting(thisSetting);

	persistAndRefreshAll();
}

export async function removeSetting(thisSetting) {
	for (const thisCategory of getCustomItems()) {
		const index = (thisCategory.settings || []).findIndex((checkSetting) => checkSetting === thisSetting);

		if (index > -1) {
			thisCategory.settings.splice(index, 1);
		}
	}

	persistAndRefreshAll();
}

//--------------------------------------------------

export async function addCategory(categoryName: string) {
	let thisCategory: Category = {
		category: categoryName,
		settings: [],
	};

	let findSimilar = findExistCategory(thisCategory);
	let newCategory: Category;
	let times = 0;

	while (findSimilar) {
		times++;
		newCategory = Object.assign({}, thisCategory);
		newCategory.category += `_${times}`;
		findSimilar = findExistCategory(newCategory);
		logger.info("category", findSimilar, times, newCategory);
	}

	if (newCategory) {
		thisCategory = newCategory;
	}

	const customItems = getCustomItems();
	customItems.push(thisCategory);
	logger.info("category", "Added Category", customItems);

	saveCustomItemsAndRefreshExtensionState(customItems);
}

export async function removeCategory(thisCategory) {
	const customItems = getCustomItems();

	const index = customItems.findIndex((checkCategory) => checkCategory === thisCategory);

	if (index > -1) {
		customItems.splice(index, 1);
	}

	saveCustomItemsAndRefreshExtensionState(customItems);
}

//-------------------------------------------------

export function getStyleshiftDataType(thisData) {
	logger.info("data", thisData);

	if (thisData.category != null) {
		return "category";
	}

	return "setting";
}
