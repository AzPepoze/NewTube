import { getDefaultItems } from "../../main/itemsDefault";
import { getStyleshiftDefaultItems } from "../../main/itemsStyleshiftDefault";
import { getStyleshiftCustomItems } from "../../main/itemsStyleshiftCustom";
import { randomNumberInRange } from "../shared/normal";
import { saveAndRefreshAll } from "../core/runtimeController";
import { getRootValue, saveToStorage } from "../core/storageManager";
import { refreshExtensionState } from "../run";
import { attachBehaviorToSetting } from "./functions";
import { Category, type Setting } from "../types/store";
import { logger } from "../../shared/logger";

const highlightColors = [`255, 109, 109`, `167, 242, 255`, `255, 167, 248`, `188, 167, 255`, `255, 241, 167`];

const styleshiftItems: { Default: (Category | { isHeader: boolean; label: string })[]; Custom: Category[] } = {
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

export function getAllStyleshiftCategoriesOnly(): Category[] {
	return getAllStyleshiftItems().filter((item) => (item as any).category != null) as Category[];
}

export function getAllStyleshiftSettings() {
	return getAllStyleshiftCategoriesOnly()
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

export function getSettingCategory(setting: Setting): Category | null {
	for (const thisCategory of getAllStyleshiftCategoriesOnly()) {
		for (const thisSetting of thisCategory.settings) {
			if (thisSetting === setting) {
				return thisCategory;
			}
		}
	}
	return null;
}

export function findExistCategory(category: Category) {
	return getAllStyleshiftCategoriesOnly().some((thisCategory) => thisCategory.category === category.category);
}

function autoAddHightlight(array: (Category | { isHeader: boolean; label: string })[]) {
	for (const item of array) {
		const categoryObj = item as Category;
		if (categoryObj.category && categoryObj.Highlight_color == null) {
			const categoryName = typeof categoryObj.category === "string" ? categoryObj.category : categoryObj.category.label;
			const getColorId = randomNumberInRange(0, highlightColors.length - 1, categoryName);
			logger.debug("highlight", "random id", categoryName, getColorId);
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
	for (const item of styleshiftItems.Default) {
		if ((item as any).category) {
			const thisCategory = item as Category;
			if (thisCategory.editable !== true) {
				thisCategory.editable = false;
			}
			for (const thisSetting of thisCategory.settings) {
				if (thisSetting.editable !== true) {
					thisSetting.editable = false;
				}
			}
		}
	}

	// Custom
	for (const thisCategory of styleshiftItems.Custom) {
		thisCategory.editable = true;
		for (const thisSetting of thisCategory.settings) {
			thisSetting.editable = true;
		}
	}
}

let settingsList = {} as { [id: string]: Setting };

export async function getSettingsList(rebuild = false): Promise<{ [id: string]: Setting }> {
	if (!rebuild && Object.keys(settingsList).length) {
		return settingsList;
	}

	settingsList = {};

	for (const categoryObj of getAllStyleshiftCategoriesOnly()) {
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

	saveAndRefreshAll();
}

export async function removeSetting(thisSetting) {
	for (const thisCategory of getCustomItems()) {
		const index = (thisCategory.settings || []).findIndex((checkSetting) => checkSetting === thisSetting);

		if (index > -1) {
			thisCategory.settings.splice(index, 1);
		}
	}

	saveAndRefreshAll();
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

	// Track the new category ID for UI highlighting
	const categoryId = typeof thisCategory.category === "string" ? thisCategory.category : thisCategory.category.label;
	await saveToStorage("lastAddedCategory", categoryId);

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

	if (thisData.isHeader) {
		return "header";
	}

	if (thisData.category != null) {
		return "category";
	}

	if (thisData.type === "group") {
		return "group";
	}

	return "setting";
}
