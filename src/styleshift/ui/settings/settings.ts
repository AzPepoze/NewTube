import { dynamicAppend, createError } from "../../shared/extension";
import { unmount } from "svelte";
import { logger } from "../../../shared/logger";
import { getSettingsList, getStyleshiftDataType, updateStyleshiftItems, addCategory } from "../../settings/items";
import { Category } from "../../types/styleshiftTypes";
import { createStyleshiftWindow } from "../extension";
import { settingsUi } from "./settingComponents";
import { addDropTarget, addDrag } from "./reorder";
import { getRootValue } from "@/styleshift/core/storageManager";
import { isDevModulesLoaded } from "@/styleshift/core/runtimeController";
import { getStyleshiftDevOnlyItems } from "../../../main/itemsStyleshiftDev";
import { IS_IN_EXTENSION_SETTINGS_PAGE } from "@/styleshift/run";

export function setupLeftTitleAnimation(title: HTMLElement) {
	title.style.transform = "translateY(40px)";
	title.style.opacity = "0";
}

const settingUiRegistry = new Map<string, { parent: HTMLElement; container: HTMLElement }>();

export async function refreshSettingUi(settingId: string) {
	const entry = settingUiRegistry.get(settingId);
	if (!entry) return;

	const { parent, container } = entry;
	const settings = await getSettingsList();
	const setting = settings[settingId];
	if (!setting) return;

	logger.debug("ui", `Refreshing targeted UI for setting: ${settingId}`);

	const newElement = await createBaseUiElement(setting.type, setting);
	if (newElement) {
		const anyElement = newElement as any;
		const newContainer = anyElement.frame || anyElement.button || anyElement;
		if (newContainer instanceof HTMLElement) {
			container.replaceWith(newContainer);
			settingUiRegistry.set(settingId, { parent, container: newContainer });
		}
	}
}

interface SettingsWindow {
	windowElement: HTMLElement;
	contentElement: HTMLElement;
	closeButton: HTMLElement;
	overlayFrame: HTMLElement;
	dragHandle: HTMLElement;
	closeWindowHandler: () => Promise<void>;
}

export async function createMainSettingsUi({
	showCategoryList = true,
	onCreate = null as ((styleshiftWindow: SettingsWindow) => void) | null,
	getCategory = null as (() => Category[] | Promise<Category[]>) | null,
}) {
	let settingsWindow: SettingsWindow | null = null;
	let svelteInstance: any = null;
	let cooldown = false;

	const returnObj = {
		renderContent: async function (_skipAnimation = false) {
			if (svelteInstance) {
				const categories = getCategory ? await getCategory() : [];
				const devOnlyItems = isDevModulesLoaded ? getStyleshiftDevOnlyItems() : [];
				svelteInstance.categories = categories;
				svelteInstance.devOnlyItems = devOnlyItems;
				svelteInstance.isDeveloperMode = await getRootValue("developerMode");
				svelteInstance.isDevModulesLoaded = isDevModulesLoaded;
			}
		},

		createUi: async function (skipAnimation = false) {
			logger.info("ui", "Creating UI", { settingsWindow });
			if (settingsWindow) {
				returnObj.recreateUi(skipAnimation);
				return;
			}

			settingsWindow = await createStyleshiftWindow({
				skipAnimation,
				title: "StyleShift Settings",
				fullscreen: IS_IN_EXTENSION_SETTINGS_PAGE,
				onWindowClosed: () => {
					settingsWindow = null;
				},
			});

			logger.info("ui", "Created_styleshift_window");

			const settingsWindowElement = settingsWindow.windowElement;
			settingsWindowElement.style.minWidth = "500px";

			const categories = getCategory ? await getCategory() : [];
			const devOnlyItems = isDevModulesLoaded ? getStyleshiftDevOnlyItems() : [];
			const isDeveloperMode = await getRootValue("developerMode");

			svelteInstance = settingsUi.settingsWindow(
				{
					categories,
					showCategoryList,
					devOnlyItems,
					isDeveloperMode,
					isDevModulesLoaded,
					onClose: () => returnObj.removeUi(),
					onAddCategory: (categoryName: string) => addCategory(categoryName),
				},
				settingsWindow.contentElement,
			);

			if (onCreate) {
				onCreate(settingsWindow);
			}
		},
		removeUi: function (skipAnimation = false, _delay = false) {
			if (settingsWindow) {
				if (svelteInstance) {
					unmount(svelteInstance);
					svelteInstance = null;
				}

				if (skipAnimation) {
					const overlayFrame = settingsWindow.overlayFrame;
					requestAnimationFrame(() => {
						overlayFrame.remove();
					});
				} else {
					settingsWindow.closeWindowHandler();
				}
				settingsWindow = null;
			}
		},
		recreateUi: async function (skipAnimation = true) {
			logger.info("ui", "recreateUi triggered - full remount", { settingsWindow, skipAnimation });
			if (settingsWindow) {
				await updateStyleshiftItems();

				// Save scroll positions before unmounting
				const sidebar = settingsWindow.contentElement.querySelector(".STYLESHIFT-Sidebar") as HTMLElement;
				const content = settingsWindow.contentElement.querySelector(".STYLESHIFT-Settings-List") as HTMLElement;
				const sidebarScrollTop = sidebar?.scrollTop || 0;
				const contentScrollTop = content?.scrollTop || 0;
				logger.info("ui", "Saved scroll positions", { sidebarScrollTop, contentScrollTop });

				// Unmount old component
				if (svelteInstance) {
					unmount(svelteInstance);
					svelteInstance = null;
				}

				// Clear content element
				settingsWindow.contentElement.innerHTML = "";

				// Remount with fresh data
				const categories = getCategory ? await getCategory() : [];
				const devOnlyItems = isDevModulesLoaded ? getStyleshiftDevOnlyItems() : [];
				const isDeveloperMode = await getRootValue("developerMode");

				svelteInstance = settingsUi.settingsWindow(
					{
						categories,
						showCategoryList,
						devOnlyItems,
						isDeveloperMode,
						isDevModulesLoaded,
						skipAnimation,
						onClose: () => returnObj.removeUi(),
						onAddCategory: (categoryName: string) => addCategory(categoryName),
					},
					settingsWindow.contentElement,
				);

				// Restore scroll positions after remounting
				requestAnimationFrame(() => {
					const newSidebar = settingsWindow.contentElement.querySelector(".STYLESHIFT-Sidebar") as HTMLElement;
					const newContent = settingsWindow.contentElement.querySelector(".STYLESHIFT-Settings-List") as HTMLElement;
					if (newSidebar) newSidebar.scrollTop = sidebarScrollTop;
					if (newContent) newContent.scrollTop = contentScrollTop;
					logger.info("ui", "Restored scroll positions", { sidebarScrollTop, contentScrollTop });
				});

				logger.info("ui", "UI remounted successfully");
			}
		},
		toggle: async function () {
			if (cooldown) return;
			cooldown = true;
			if (settingsWindow) {
				returnObj.removeUi();
				setTimeout(() => (cooldown = false), 200);
			} else {
				await returnObj.createUi();
				setTimeout(() => (cooldown = false), 200);
			}
		},

		setGetCategory: function (newFunction: () => Category[] | Promise<Category[]> | null) {
			getCategory = newFunction as any;
			if (settingsWindow) {
				true
				returnObj.recreateUi();
			}
		},
	};

	return returnObj;
}

export async function createConfigUiFunction(
	editable = false,
	configFunction: Function,
): Promise<Function | undefined> {
	if (editable && (await getRootValue("developerMode"))) {
		return configFunction;
	}
}

async function createBaseUiElement(uiType: string, thisData: any) {
	try {
		const renderFunc = settingsUi[uiType as keyof typeof settingsUi];
		if (typeof renderFunc === "function") {
			return await (renderFunc as any)(thisData);
		}
		throw new Error(`UI component type "${uiType}" not found in settingsUi`);
	} catch (error) {
		createError(`${error}\n\n${JSON.stringify(thisData, null, 2)}`);
		return null;
	}
}

export async function createSettingUiElementWithAbleDeveloperMode(parent: HTMLDivElement, thisData: any) {
	const dataType = getStyleshiftDataType(thisData);
	const uiType = dataType == "category" ? "title" : (thisData as any).type;

	if (uiType === "group" || uiType === "subTitle") {
		thisData.editable = await getRootValue("developerMode");
	}

	const mainElement = await createBaseUiElement(uiType, thisData);
	if (!mainElement) return null;

	const anyElement = mainElement as any;
	const container = anyElement.frame || anyElement.button || anyElement;
	dynamicAppend(parent, container);

	if (dataType === "setting" && thisData.id) {
		settingUiRegistry.set(thisData.id, { parent, container });
	}

	if (dataType === "category") {
		addDropTarget(container, parent, thisData as Category, "category");
		if (thisData.editable && (await getRootValue("developerMode"))) {
			// Categories in sidebar are handled differently, but if rendered in main panel:
			// addDrag(...)
		}
	}

	if (dataType === "group" || uiType === "subTitle") {
		const groupData = anyElement.data || thisData;
		if (await getRootValue("developerMode")) {
			const dragHandle = container.querySelector(".drag-handle") as HTMLElement;
			if (dragHandle) {
				addDrag(dragHandle, container, parent, groupData);
			}
		}
		addDropTarget(container, parent, groupData, "group");
	}

	return mainElement;
}

export async function createCategoryUi(parent: HTMLElement, thisCategory: Category) {
	const categoryFrame = await settingsUi.settingFrame(true, true);
	categoryFrame.className += " STYLESHIFT-Category-Frame";
	parent.append(categoryFrame);

	const categoryTitle = ((await createSettingUiElementWithAbleDeveloperMode(categoryFrame, thisCategory)) as any)
		.frame;

	for (const thisSetting of thisCategory.settings) {
		try {
			if ((thisSetting as any).hidden) continue;
			await createSettingUiElementWithAbleDeveloperMode(categoryFrame, thisSetting);
		} catch (error) {
			createError(`At ${thisCategory.category} - ${JSON.stringify(thisSetting, null, 2)}\n${error}`).then(
				(notification) => {
					notification.setTitle("StyleShift - Create ui error");
				},
			);
		}
	}

	return { categoryTitle, categoryFrame };
}
