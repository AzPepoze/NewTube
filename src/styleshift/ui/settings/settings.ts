import { dynamicAppend, createError } from "../../shared/extension";
import { scrollOnClick } from "../../shared/normal";
import { logger } from "../../../shared/logger";
import { getStyleshiftDevOnlyItems } from "../../../main/itemsStyleshiftDev";
import { addCategory, getSettingsList, getStyleshiftDataType, updateStyleshiftItems } from "../../settings/items";
import { Category } from "../../types/store";
import { createStyleshiftWindow } from "../extension";
import { settingsUi } from "./settingComponents";
import { addDropTarget, clearDropTargets } from "./reorder";
import { getRootValue } from "@/styleshift/core/storageManager";
import { isDevModulesLoaded } from "@/styleshift/core/runtimeController";
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
	let updateSettingInterval: any = null;
	let scrollCategory: HTMLElement | null = null;
	let settingsContainer: HTMLElement | null = null;

	const returnObj = {
		renderContent: async function (skipAnimation = false) {
			if (!settingsContainer) return;

			clearDropTargets();
			settingUiRegistry.clear();
			settingsContainer.innerHTML = "";
			if (scrollCategory) scrollCategory.innerHTML = "";

			if (updateSettingInterval) clearInterval(updateSettingInterval);

			const leftUi: HTMLElement[] = [];
			const rightUi: HTMLElement[] = [];
			const createdDevOnlyCategory: string[] = [];

			const categories = getCategory ? await getCategory() : [];

			for (const thisCategory of categories) {
				const { categoryTitle, categoryFrame } = await createCategoryUi(settingsContainer, thisCategory);

				const leftCategoryTitle = await settingsUi.leftTitle(thisCategory.category, skipAnimation);

				scrollOnClick(leftCategoryTitle, categoryTitle);

				if (showCategoryList && scrollCategory) {
					leftUi.push(leftCategoryTitle);
					scrollCategory.append(leftCategoryTitle);
				}

				rightUi.push(categoryTitle);

				if (isDevModulesLoaded) {
					const getDevOnlyCategory = getStyleshiftDevOnlyItems().find(
						(x) => x.category == thisCategory.category,
					);

					if (getDevOnlyCategory) {
						createdDevOnlyCategory.push(getDevOnlyCategory.category);

						for (const thisSettingOnly of getDevOnlyCategory.settings) {
							await createSettingUiElementWithAbleDeveloperMode(categoryFrame, thisSettingOnly);
						}
					}
				}

				if (thisCategory.editable && (await getRootValue("Developer_mode"))) {
					dynamicAppend(categoryFrame, await settingsUi.addSettingButton(thisCategory.settings));
				}

				await settingsUi.space(settingsContainer);
			}

			if (await getRootValue("Developer_mode")) {
				for (const thisCategory of getStyleshiftDevOnlyItems()) {
					if (!createdDevOnlyCategory.includes(thisCategory.category)) {
						await createCategoryUi(settingsContainer, thisCategory);
					}
				}
			}

			if (showCategoryList && scrollCategory && (await getRootValue("Developer_mode"))) {
				const addButton = (
					await settingsUi.button({
						name: "+",
						color: "#FFFFFF",
						align: "center",
						clickFunction: function () {
							addCategory("🥳 newCategory");
						},
					})
				).button;
				addButton.className += " STYLESHIFT-Add-Category-button";

				addButton.style.padding = "5px";
				addButton.style.marginInline = "10px";
				addButton.style.marginTop = "3px";

				leftUi.push(addButton);
				scrollCategory.append(addButton);

				if (!skipAnimation) {
					setupLeftTitleAnimation(addButton);
				}
			}

			if (showCategoryList && !skipAnimation) {
				requestAnimationFrame(function () {
					for (let leftOrder = 0; leftOrder < leftUi.length; leftOrder++) {
						const leftCategoryTitle = leftUi[leftOrder];
						setTimeout(() => {
							leftCategoryTitle.style.transform = "";
							leftCategoryTitle.style.opacity = "";
						}, 50 * leftOrder);
					}
				});
			}

			let currentSelectedLeft: HTMLElement;
			let currentSelectedRight: HTMLElement;

			if (showCategoryList && settingsContainer) {
				updateSettingInterval = setInterval(async function () {
					const lastIndex = rightUi.length - 1;

					for (let index = 0; index <= lastIndex; index++) {
						const settingsContainerBox = settingsContainer.getBoundingClientRect();
						if (
							index == lastIndex ||
							(rightUi[index].getBoundingClientRect().top - 10 <= settingsContainerBox.top &&
								rightUi[index + 1].getBoundingClientRect().top - 10 >=
									settingsContainerBox.top) ||
							(index == 0 &&
								rightUi[index].getBoundingClientRect().top >= settingsContainerBox.top)
						) {
							if (currentSelectedLeft == leftUi[index]) {
								break;
							}
							if (currentSelectedLeft) {
								currentSelectedLeft.removeAttribute("selected");
							}
							if (currentSelectedRight) {
								currentSelectedRight.removeAttribute("selected");
							}
							currentSelectedLeft = leftUi[index];
							currentSelectedRight = rightUi[index];
							currentSelectedLeft.setAttribute("selected", "");
							currentSelectedRight.setAttribute("selected", "");

							currentSelectedLeft.scrollIntoView({ behavior: "smooth", block: "nearest" });
							break;
						}
					}
				}, 100);
			}
		},

		createUi: async function (skipAnimation = false) {
			logger.info("ui", "Creating UI", { settingsWindow });
			if (settingsWindow) {
				returnObj.recreateUi();
				return;
			}

			// @ts-ignore
			settingsWindow = await createStyleshiftWindow({
				skipAnimation,
				title: "StyleShift Settings",
			});

			logger.info("ui", "Created_styleshift_window");

			const settingsContent = settingsWindow.contentElement;

			if (IS_IN_EXTENSION_SETTINGS_PAGE) {
				settingsWindow.windowElement.style.width = "100%";
				settingsWindow.windowElement.style.height = "100%";
				settingsWindow.windowElement.style.resize = "none";
			}

			const mainFrame = await settingsUi.settingFrame(false, false, { x: false, y: false }, true);

			mainFrame.style.width = "calc(100% - 5px)";
			mainFrame.style.height = "-webkit-fill-available";
			mainFrame.style.gap = "10px";
			mainFrame.style.overflow = "hidden";
			settingsContent.append(mainFrame);

			if (showCategoryList) {
				scrollCategory = document.createElement("div");
				scrollCategory.className = "STYLESHIFT-Scrollable";
				scrollCategory.style.minWidth = "100px";
				scrollCategory.style.width = "250px";
				scrollCategory.setAttribute("Left", "true");
				mainFrame.append(scrollCategory);

				const resizeHandle = await settingsUi.resizeHandle(scrollCategory, "right");
				mainFrame.append(resizeHandle);
			}

			const settingsFrame = await settingsUi.settingFrame(false, true, { x: false, y: false }, true);
			settingsFrame.style.width = "-webkit-fill-available";
			settingsFrame.style.height = "100%";
			settingsFrame.style.gap = "10px";
			mainFrame.append(settingsFrame);

			const searchInput = document.createElement("input");
			searchInput.className = "STYLESHIFT-Search";
			searchInput.placeholder = "🔍 Search";
			settingsFrame.append(searchInput);

			settingsContainer = document.createElement("div");
			settingsContainer.className = "STYLESHIFT-Scrollable";
			settingsFrame.append(settingsContainer);

			settingsWindow.closeButton.addEventListener(
				"click",
				() => {
					returnObj.removeUi();
				},
				{ once: true },
			);

			await returnObj.renderContent(skipAnimation);

			if (onCreate) {
				onCreate(settingsWindow);
			}
		},
		removeUi: function (skipAnimation = false, _delay = false) {
			if (settingsWindow) {
				if (updateSettingInterval) clearInterval(updateSettingInterval);
				if (skipAnimation) {
					const overlayFrame = settingsWindow.overlayFrame;
					requestAnimationFrame(() => {
						overlayFrame.remove();
					});
				} else {
					settingsWindow.closeWindowHandler();
				}
				settingsWindow = null;
				settingsContainer = null;
				scrollCategory = null;
			}
		},
		recreateUi: async function () {
			logger.info("ui", "recreateUi triggered", { settingsWindow });
			if (settingsWindow && scrollCategory && settingsContainer) {
				await updateStyleshiftItems();

				const lastScroll = [0, 0];
				if (showCategoryList) {
					lastScroll[0] = scrollCategory.scrollTop;
				}
				lastScroll[1] = settingsContainer.scrollTop;

				await returnObj.renderContent(true);

				requestAnimationFrame(function () {
					if (showCategoryList && scrollCategory) {
						scrollCategory.scrollTo(0, lastScroll[0]);
					}
					if (settingsContainer) {
						settingsContainer.scrollTo(0, lastScroll[1]);
					}
				});
			}
		},
		toggle: function () {
			if (settingsWindow) {
				returnObj.removeUi();
			} else {
				returnObj.createUi();
			}
		},

		setGetCategory: function (newFunction: () => Category[] | Promise<Category[]> | null) {
			getCategory = newFunction;
			if (settingsWindow) {
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
	if (editable && (await getRootValue("Developer_mode"))) {
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

	const mainElement = await createBaseUiElement(uiType, thisData);
	if (!mainElement) return null;

	const anyElement = mainElement as any;
	const container = anyElement.frame || anyElement.button || anyElement;
	dynamicAppend(parent, mainElement);

	if (dataType === "setting" && thisData.id) {
		settingUiRegistry.set(thisData.id, { parent, container });
	}

	if (dataType === "category") {
		addDropTarget(anyElement.frame || anyElement, parent, thisData as Category, "category");
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
