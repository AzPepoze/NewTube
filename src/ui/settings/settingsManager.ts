import { IS_IN_EXTENSION_SETTINGS_PAGE } from "@core/index";
import { isDevModulesLoaded } from "@core/runtime/controller";
import { waitOneFrame } from "@core/shared/eventHelpers";
import { createError } from "@core/shared/notifications";
import { getRootValue } from "@core/storage/manager";
import { getStyleShiftDevOnlyItems } from "@extensions/youtube/developerItems";
import { addCategory, getSettingsList, updateStyleShiftItems } from "@settings/registry/items";
import { type Category } from "@settings/types/styleshiftTypes";
import { logger } from "@shared/logger";
import { createStyleShiftWindow } from "@ui/window/windowFactory";
import { unmount } from "svelte";
import { SvelteSet } from "svelte/reactivity";
import { settingsUi } from "./settingsApi";

export function setupLeftTitleAnimation(title: HTMLElement) {
	title.style.transform = "translateY(40px)";
	title.style.opacity = "0";
}

const settingUiRegistry = new Map<string, { parent: HTMLElement; container: HTMLElement }>();
const externalCategoryRegistry = new SvelteSet<Category>();

export function registerSettingUi(settingId: string, parent: HTMLElement, container: HTMLElement) {
	settingUiRegistry.set(settingId, { parent, container });
}

export function unregisterSettingUi(settingId: string) {
	settingUiRegistry.delete(settingId);
}

export function registerExternalCategory(category: Category) {
	externalCategoryRegistry.add(category);
	logger.debug("ui", "Registered external category", category);
}

export function unregisterExternalCategory(category: Category) {
	externalCategoryRegistry.delete(category);
	logger.debug("ui", "Unregistered external category", category);
}

export function getExternalCategories() {
	return Array.from(externalCategoryRegistry);
}

export async function refreshSettingUi(settingId: string) {
	logger.debug("ui", `Refreshing UI for setting: ${settingId}`);

	const entry = settingUiRegistry.get(settingId);
	if (!entry) {
		logger.debug("ui", `UI registry not found for setting: ${settingId}`);
		return;
	}

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

export function migrateSettingUiRegistry(oldId: string, newId: string) {
	if (oldId === newId) return;

	const entry = settingUiRegistry.get(oldId);
	if (entry) {
		settingUiRegistry.set(newId, entry);
		settingUiRegistry.delete(oldId);
		logger.debug("ui", `Migrated UI registry from ${oldId} to ${newId}`);
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
				const internalSettings = getCategory ? await getCategory() : [];
				const externalSettings = getExternalCategories();
				const devOnlyItems = isDevModulesLoaded ? getStyleShiftDevOnlyItems() : [];
				svelteInstance.internalSettings = internalSettings;
				svelteInstance.externalSettings = externalSettings;
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

			settingsWindow = await createStyleShiftWindow({
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

			const internalSettings = getCategory ? await getCategory() : [];
			const externalSettings = getExternalCategories();
			const devOnlyItems = isDevModulesLoaded ? getStyleShiftDevOnlyItems() : [];
			const isDeveloperMode = await getRootValue("developerMode");

			svelteInstance = settingsUi.settingsWindow(
				{
					internalSettings,
					externalSettings,
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
				await updateStyleShiftItems();

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
				const internalSettings = getCategory ? await getCategory() : [];
				const externalSettings = getExternalCategories();
				const devOnlyItems = isDevModulesLoaded ? getStyleShiftDevOnlyItems() : [];
				const isDeveloperMode = await getRootValue("developerMode");

				svelteInstance = settingsUi.settingsWindow(
					{
						internalSettings,
						externalSettings,
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

				logger.info("ui", "UI remounted successfully");

				await waitOneFrame();
				await waitOneFrame();

				const newSidebar = settingsWindow.contentElement.querySelector(".STYLESHIFT-Sidebar") as HTMLElement;
				const newContent = settingsWindow.contentElement.querySelector(".STYLESHIFT-Settings-List") as HTMLElement;
				if (newSidebar) newSidebar.scrollTop = sidebarScrollTop;
				if (newContent) newContent.scrollTop = contentScrollTop;
				logger.info("ui", "Restored scroll positions", { sidebarScrollTop, contentScrollTop });
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
				returnObj.recreateUi();
			}
		},
	};

	return returnObj;
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
