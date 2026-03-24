import { saveAndRefreshAll, jszipInstance as jszip } from "../core/runtimeController";
import {
	ALLOWED_STORAGE_KEYS,
	cachedStorageData as savedData,
	getRootValue,
	saveRootValue,
} from "../core/storageManager";
import { initializeRequiredStorageStructures as setNullSave } from "../core/storageMaintenance";
import { styleshiftContainer } from "..";
import { showStylesheet, hideStylesheet } from "../settings/styleSheet";
import { Category, Setting } from "../types/styleshiftTypes";
import {
	globalNotificationContainer,
	playUiAnimation,
	showAlert,
	showSelection,
	showUserConfirmation,
	showUserPrompt,
	updateAllUiComponents,
} from "../ui/extension";
import {
	triggerSettingUpdate,
	deactivateAllActiveSettings,
	reactivateAllSettings,
} from "../settings/functions";
import { settingsUi } from "../ui/settings/settingComponents";
import { sleep, deepClone, downloadFile, getCurrentDomain, createUniqueId } from "./normal";
import { logger } from "../../shared/logger";
import { mount, unmount } from "svelte";
import Icon from "../ui/settings/components/main/Icon.svelte";

export { downloadFile };

/*
-------------------------------------------------------
For Normal user !!!
-------------------------------------------------------
*/

/**
 * Shows a custom confirmation dialog.
 * @param {string} ask - The question to ask.
 * @param {string} [title="Confirm Action"] - The dialog title.
 * @returns {Promise<boolean>}
 */
export async function showUserConfirmationPrompt(ask: string, title: string = "Confirm Action") {
	return await showUserConfirmation(ask, title);
}

/**
 * shows a text input prompt window.
 * @param {{ title : string, placeholder : string, content : string }} Options
 * @returns {Promise<string>}
 * @example
 * await enterTextPrompt({ title : "Enter your name", placeholder : "John Doe", content : "Please enter your name." });
 */
export async function enterTextPrompt({ title = "Enter text", placeholder = "", content = "" }) {
	const result = await showUserPrompt(title, placeholder, "", {
		content: content,
		multiline: true,
	});

	if (result === null) {
		throw new Error("Canceled by the user");
	}

	return result;
}

/**
 * shows a stylish text input prompt modal.
 * @param {{ title : string, placeholder : string, value : string }} Options
 * @returns {Promise<string | null>}
 */
export async function enterPrompt({ title = "Enter text", placeholder = "", value = "" }) {
	return await showUserPrompt(title, placeholder, value);
}

/**
 * shows a stylish selection modal with multiple options.
 * @param {{ message : string, title : string, buttons : { label : string, color? : string }[] }} Options
 * @returns {Promise<string | null>}
 */
export async function chooseSelection({
	message = "",
	title = "Select Option",
	buttons = [],
	vertical = false,
}) {
	return await showSelection(message, title, buttons, { vertical });
}

/**
 * Shows a stylish alert dialog with a message.
 * @param {{ message : string, title : string, okLabel? : string, okColor? : string }} Options
 * @returns {Promise<void>}
 */
export async function alertPrompt({ message = "", title = "Alert", okLabel = "OK", okColor = "#7f5db7" }) {
	return await showAlert(message, title, { okLabel, okColor });
}

/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 * @returns {boolean}
 * @example
 * copyToClipboard("Hello, world!"); // Copies "Hello, world!" to the clipboard
 */
export function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text).then(
		() => {
			return true;
		},
		(err) => {
			logger.error("extension-function", "Failed to copy text: ", err);
			return false;
		},
	);
}

/**
 * Creates a notification.
 * @param {Object} options - The notification options.
 * @param {string} [options.icon=null] - The icon.
 * @param {string} [options.title="StyleShift"] - The title.
 * @param {string} [options.content=""] - The content.
 * @param {number} [options.timeout=3000] - The timeout in milliseconds.
 * @returns {Promise<Object>}
 * @example
 * await createNotification({ title: "Hello", content: "This is a notification" });
 */
export async function createNotification({ icon = null, iconColor = "", title = "StyleShift", content = "", timeout = 3000 }) {
	logger.info("extension", title, content);

	const notificationFrame = await settingsUi.settingFrame(true, false, {
		x: false,
		y: true,
	});

	notificationFrame.classList.add("STYLESHIFT-Notification");
	setTimeout(() => {
		globalNotificationContainer.append(notificationFrame);
	}, 1);

	let iconUi: any = null;
	const iconTarget = document.createElement("div");
	iconTarget.classList.add("STYLESHIFT-Notification-Icon");
	iconTarget.style.display = "none";
	notificationFrame.append(iconTarget);

	let currentIconColor = iconColor;

	const updateIcon = (name: string | null, color: string = currentIconColor) => {
		currentIconColor = color;
		if (iconUi) {
			unmount(iconUi);
			iconUi = null;
		}

		if (name) {
			iconTarget.style.display = "flex";
			iconUi = mount(Icon, {
				target: iconTarget,
				props: {
					name,
					size: 24,
					color,
				},
			});
		} else {
			iconTarget.style.display = "none";
		}
	};

	if (icon) {
		updateIcon(icon);
	}

	//---------------------------------

	const notificationContentFrame = await settingsUi.settingFrame(false, true);
	notificationContentFrame.classList.add("STYLESHIFT-Notification-Content-Frame");
	notificationFrame.append(notificationContentFrame);

	const titleUi = await settingsUi.settingFrame(true, false, {
		x: false,
		y: true,
	});
	titleUi.classList.add("STYLESHIFT-Notification-Title");
	titleUi.textContent = title;
	notificationContentFrame.append(titleUi);

	const contentUi = await settingsUi.settingFrame(true, false);
	contentUi.classList.add("STYLESHIFT-Notification-Content");
	contentUi.style = "display: block;";
	notificationContentFrame.append(contentUi);

	const setContent = (newContent) => {
		newContent = String(newContent);
		contentUi.innerHTML = newContent.replaceAll("<script", "").replaceAll("/script>", "");
	};

	setContent(content);

	//---------------------------------

	async function close() {
		await playUiAnimation(notificationFrame, "Notification-Hide");
		if (iconUi) {
			unmount(iconUi);
		}
		notificationFrame.remove();
	}

	if (timeout == 0) {
		const closeUi = await settingsUi.settingFrame(true, false, {
			x: true,
			y: true,
		});
		closeUi.className += " STYLESHIFT-Notification-Close";
		closeUi.textContent = "X";
		notificationFrame.append(closeUi);

		closeUi.addEventListener("click", function (e) {
			e.preventDefault();
			close();
		});
	}

	//---------------------------------

	await playUiAnimation(notificationFrame, "Notification-Show");
	setTimeout(async () => {
		if (timeout > 0) {
			await sleep(timeout);
			close();
		}
	}, 0);

	return {
		setIcon: (newIcon) => {
			updateIcon(newIcon, currentIconColor);
		},
		setIconColor: (newColor) => {
			updateIcon(icon, newColor);
		},
		setContent,
		setTitle: (newTitle) => {
			titleUi.textContent = newTitle;
		},
		close,
	};
}

export async function createError(content: any) {
	return await createNotification({
		icon: "error",
		iconColor: "#f44336",
		title: "StyleShift Error",
		content: typeof content === "object" ? content.message : String(content),
		timeout: 10000,
	});
}

/** Creates a warning notification.
 * @param {string} content - The warning content.
 * @returns {Promise<Object>}
 * @example
 * await createWarning("This is a warning");
 */
export async function createWarning(content: string) {
	return await createNotification({
		icon: "warning",
		iconColor: "#ff9800",
		title: "StyleShift Warning",
		content: content,
		timeout: 5000,
	});
}

/** Creates a success notification.
 * @param {string} content - The success content.
 * @returns {Promise<Object>}
 * @example
 * await createSuccess("Operation completed successfully");
 */
export async function createSuccess(content: string) {
	return await createNotification({
		icon: "check_circle",
		iconColor: "#4caf50",
		title: "StyleShift",
		content: content,
		timeout: 3000,
	});
}

/*
-------------------------------------------------------
For advanced user !!!
-------------------------------------------------------
*/


/**
 * Prompts the user to select a file.
 * @param {string} type - The file type.
 * @returns {Promise<File>}
 * @example
 * const file = await getFile(".txt");
 */
export async function getFile(type: string): Promise<File> {
	return new Promise((resolve, reject) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = type;

		input.click();

		input.addEventListener("change", function () {
			const file = input.files[0];
			if (file) {
				resolve(file);
			} else {
				reject(new Error("No file selected"));
			}
		});

		input.addEventListener("cancel", () => {
			reject(new Error("Canceled by the user"));
		});
	});
}

/**
 * Imports StyleShift data and updates the saved data.
 * @param {Object} styleshiftData - The JSON data to import.
 * @returns {Promise<void>}
 * @example
 * await importStyleshiftData(data);
 */
export async function importStyleshiftData(styleshiftData: object) {
	const notification = await createNotification({
		icon: "sync",
		title: "StyleShift - Importing data",
		content: "Please wait...",
		timeout: -1,
	});

	try {
		for (const thisKey of ALLOWED_STORAGE_KEYS) {
			savedData[thisKey] = styleshiftData[thisKey];
		}

		await setNullSave();
		saveAndRefreshAll();

		notification.setIcon("check_circle");
		notification.setTitle("StyleShift - Imported data");
		notification.setContent("Imported successfully!");

		await sleep(3000);

		notification.close();
	} catch (error) {
		notification.close();

		createError(error).then((notification) => {
			notification.setTitle("StyleShift - Import Failed");
		});
	}
}

/**
 * Exports custom items.
 * @returns {Object[]}
 * @example
 * const items = exportStyleshiftData();
 */
export function exportStyleshiftData() {
	const exportStyleshiftData = {};

	for (const thisKey of ALLOWED_STORAGE_KEYS) {
		if (savedData[thisKey]) {
			exportStyleshiftData[thisKey] = deepClone(savedData[thisKey]);
		}
	}

	const customItems = exportStyleshiftData["customStyleShiftItems"];

	if (customItems) {
		for (const thisCategory of customItems) {
			delete thisCategory.Highlight_color;
			delete thisCategory.editable;

			for (const thisSetting of thisCategory.settings) {
				delete thisSetting.editable;
			}
		}
	} else {
		createWarning("No custom items found. Skipping...");
	}

	return exportStyleshiftData;
}

/**
 * Imports StyleShift data from a JSON string.
 * @param {string} text - The JSON string to import.
 * @returns {Promise<void>}
 * @example
 * const json = '{"customStyleShiftItems":[{"Category":"Test","settings":[{"type":"text","id":"testText","html":"<p>Test</p>"}]}]}';
 * await importStyleshiftJsonText(json);
 */
export async function importStyleshiftJsonText(text) {
	await importStyleshiftData(JSON.parse(text));
}

/**
 * Exports custom items as a JSON string.
 * @returns {string}
 * @example
 * const json = exportStyleshiftJsonText();
 */
export function exportStyleshiftJsonText() {
	return JSON.stringify(exportStyleshiftData(), null, 2);
}

/**
 * Imports StyleShift data from a ZIP file.
 * @param {file} zipFile - The ZIP file.
 * @returns {Promise<Category[]>}
 * @example
 * const data = await importStyleshiftZip(file);
 */
/**
 * Parses a Styleshift ZIP file into a data object.
 * Supports both legacy (Index - Name) and high-fidelity (order.json) structures.
 */
export async function parseStyleshiftZip(zipFile: File | Blob): Promise<any> {
	if (!jszip) {
		throw new Error("JSZip not loaded!");
	}
	const zip = new (jszip as any)();

	const loadedZip = await zip.loadAsync(zipFile, {
		createFolders: true,
	});

	let customStyleShiftItems: Category[] = [];
	let currentSettings: any = null;

	// 1. Check for currentSettings.json
	const settingsFile = loadedZip.file("currentSettings.json");
	if (settingsFile) {
		currentSettings = JSON.parse(await settingsFile.async("string"));
	}

	// 2. Resolve items base path (root or customStyleShiftItems/ folder)
	let itemsBasePath = "";
	if (Object.keys(loadedZip.files).some(f => f.startsWith("customStyleShiftItems/"))) {
		itemsBasePath = "customStyleShiftItems/";
	}

	// 3. Resolve Categories
	const categoryFolders: string[] = [];
	const categoriesOrderFile = loadedZip.file(`${itemsBasePath}order.json`);

	if (categoriesOrderFile) {
		const order = JSON.parse(await categoriesOrderFile.async("string")) as string[];
		for (const name of order) {
			const path = `${itemsBasePath}${name}/`;
			if (loadedZip.files[path]) {
				categoryFolders.push(path);
			}
		}
	} else {
		const folders = Object.keys(loadedZip.files).filter((path) => {
			const pathArray = path.split("/");
			const depth = itemsBasePath ? 2 : 1;
			return path.startsWith(itemsBasePath) && pathArray.length === depth + 1 && pathArray[depth] === "";
		});
		categoryFolders.push(...folders.sort());
	}

	// 4. Process Categories
	for (let i = 0; i < categoryFolders.length; i++) {
		const categoryPath = categoryFolders[i];
		const categoryPathName = categoryPath.slice(0, -1);
		
		const categoryFolderBaseName = categoryPathName.split("/").pop() || "";
		let categoryIndex = i;
		if (categoryFolderBaseName.includes(" - ")) {
			const indexPart = parseInt(categoryFolderBaseName.split(" - ")[0]);
			if (!isNaN(indexPart)) categoryIndex = indexPart;
		}

		const categoryConfig = loadedZip.file(`${categoryPathName}/config.json`) || 
							   loadedZip.file(`${categoryPathName}/Config.json`);
		
		if (!categoryConfig) continue;

		const categoryData = JSON.parse(await categoryConfig.async("string"));
		const settings: Setting[] = [];

		// 5. Resolve Settings
		const settingFolders: string[] = [];
		const settingsOrderFile = loadedZip.file(`${categoryPathName}/order.json`);

		if (settingsOrderFile) {
			const order = JSON.parse(await settingsOrderFile.async("string")) as string[];
			for (const name of order) {
				const path = `${categoryPathName}/${name}/`;
				if (loadedZip.files[path]) {
					settingFolders.push(path);
				}
			}
		} else {
			const folders = Object.keys(loadedZip.files).filter((path) => {
				const pathArray = path.split("/");
				const depth = categoryPathName.split("/").length;
				return path.startsWith(`${categoryPathName}/`) && pathArray.length === depth + 2 && pathArray[depth + 1] === "";
			});
			settingFolders.push(...folders.sort());
		}

		// 6. Process Settings
		for (let j = 0; j < settingFolders.length; j++) {
			const settingPath = settingFolders[j];
			const settingPathName = settingPath.slice(0, -1);

			const settingFolderBaseName = settingPathName.split("/").pop() || "";
			let settingIndex = j;
			if (settingFolderBaseName.includes(" - ")) {
				const indexPart = parseInt(settingFolderBaseName.split(" - ")[0]);
				if (!isNaN(indexPart)) settingIndex = indexPart;
			}

			const settingConfig = loadedZip.file(`${settingPathName}/config.json`) || 
								 loadedZip.file(`${settingPathName}/Config.json`);
			if (!settingConfig) continue;

			const settingData = JSON.parse(await settingConfig.async("string")) || {};

			for (const filePath of Object.keys(loadedZip.files)) {
				const isPropertyFile = filePath.startsWith(settingPath) && 
									   !filePath.endsWith("/") && 
									   !filePath.toLowerCase().endsWith("/config.json") &&
									   !filePath.toLowerCase().endsWith("/order.json");
				
				if (isPropertyFile) {
					const fileName = filePath.split("/").pop() || "";
					const propertyName = fileName.slice(0, fileName.lastIndexOf("."));
					settingData[propertyName] = await loadedZip.file(filePath).async("string");
				}
			}

			settings[settingIndex] = settingData;
		}

		categoryData["settings"] = settings.filter((s) => s !== null);
		customStyleShiftItems[categoryIndex] = categoryData;
	}

	const styleshiftData: any = {
		customStyleShiftItems: customStyleShiftItems.filter(c => c !== null),
	};

	if (currentSettings) {
		styleshiftData.currentSettings = currentSettings;
	}

	return styleshiftData;
}

/**
 * Imports StyleShift data from a ZIP file and applies it immediately.
 */
export async function importStyleshiftZip(zipFile: File | Blob) {
	const styleshiftData = await parseStyleshiftZip(zipFile);
	logger.info("extension", "Importing Styleshift ZIP Data", styleshiftData);
	await importStyleshiftData(styleshiftData);
}

/**
 * Exports StyleShift data as a ZIP file.
 * @param {Object} styleshiftData - The JSON data.
 * @param {string} zipFileName - The ZIP file name.
 * @returns {Promise<void>}
 * @example
 * await exportStyleshiftZip(data, "styleshift.zip");
 */

/**
 * Appends a child element to a parent HTMLDivElement.
 *
 * This function dynamically appends a child element to the specified parent
 * based on the properties of the child. If the child has a `frame` property,
 * it appends the frame. If the child has a `button` property, it appends the
 * button. Otherwise, it appends the child element itself.
 *
 * @param {HTMLElement} parent - The parent element to which the child will be appended.
 * @param {unknown} child - The child element or object with specific properties (`frame` or `button`).
 */
export function dynamicAppend(parent: HTMLElement, child: unknown) {
	const element = dynamicGetElement(child);
	if (element) {
		parent.appendChild(element);
	}
}

/**
 * Retrieves a specific element from a given object.
 *
 * This function checks the provided object for specific properties
 * (`frame` or `button`) and returns the corresponding element if found.
 * If neither property is present, it returns the object itself.
 *
 * @param {unknown} child - The object containing potential elements.
 * @returns {HTMLElement | unknown} The element associated with the `frame` or `button`
 * property, or the object itself if neither property is found.
 */

export function dynamicGetElement(child: unknown): HTMLElement | undefined {
	if (child && typeof child === "object") {
		const c = child as { frame?: HTMLElement; button?: HTMLElement };
		if ("frame" in c && c.frame) {
			return c.frame;
		}

		if ("button" in c && c.button) {
			return c.button;
		}
	}

	return child as HTMLElement;
}

/**
 * Opens the StyleShift settings page.
 *
 * This function opens the StyleShift settings page in a new tab by calling
 * window.open with the URL of the settings page.
 *
 * @example
 * openSettingPage();
 */
export function openSettingPage() {
	chrome.runtime.sendMessage({
		Command: "openSettingPage",
		data: {
			domain: getCurrentDomain(),
		},
	});
}

/*
-------------------------------------------------------
Danger Zone !!!
-------------------------------------------------------
*/

/**
 * Enables the extension.
 * @example
 * enableExtension();
 */
export async function enableExtension() {
	showStylesheet();
	await reactivateAllSettings();
	await updateAllUiComponents();
}

/**
 * Disables the extension.
 * @example
 * disableExtension();
 */
export async function disableExtension() {
	await deactivateAllActiveSettings();
	hideStylesheet();
}

/**
 * Retrieves the StyleShift value associated with a given ID.
 *
 * This function takes an ID, uses the load function to retrieve the associated
 * data, and returns the data as a JSON string.
 *
 * @param {string} id - The unique identifier for the data to be retrieved.
 * @returns {Promise<string>} The JSON string representation of the retrieved data.
 */
export async function loadStyleshiftValue(id: string) {
	if (!ALLOWED_STORAGE_KEYS.includes(id)) {
		throw new Error(`Access denied for key: ${id}`);
	}
	return JSON.stringify(await getRootValue(id));
}

/**
 * saves the StyleShift value associated with a given ID.
 *
 * This function takes an ID and a JSON string value, parses the JSON string,
 * and saves the resulting data under the specified ID using the save function.
 *
 * @param {string} id - The unique identifier for the data to be saved.
 * @param {string} value - The JSON string representing the data to be saved.
 * @returns {Promise<any>} The result of the save operation.
 */
export async function saveStyleshiftValue(id: string, value: string) {
	if (!ALLOWED_STORAGE_KEYS.includes(id)) {
		throw new Error(`Access denied for key: ${id}`);
	}
	return await saveRootValue(id, JSON.parse(value));
}

/**
 * Creates a setting ui element from the given type and setting.
 *
 * This function will create a ui element using the provided type and setting.
 * The ui element will be appended to the `styleshiftContainer` element and
 * assigned a unique "styleshift-ui-id" attribute.
 *
 * @param {string} type - The type of the setting ui element.
 * @param {Setting} thisSetting - The setting associated with the ui element.
 * @param {...unknown} args - Additional arguments to pass to the ui element function.
 * @returns {Promise<any>}
 */
export async function createStyleshiftSettingUi(type: string, thisSetting: Setting, ...args: unknown[]) {
	const ui = await settingsUi[type](thisSetting, ...args);

	let uiElement;
	if (typeof ui === "object") {
		uiElement = dynamicGetElement(ui);
	} else {
		uiElement = ui;
	}

	const id = createUniqueId(10);
	uiElement.setAttribute("styleshift-ui-id", id);

	styleshiftContainer.append(uiElement);

	return id;
}

/**
 * Toggles the developer mode setting and triggers necessary updates.
 * @example
 * await toggleDeveloperMode();
 */
export async function toggleDeveloperMode() {
	const isDev = await getRootValue("developerMode");
	const newValue = !isDev;
	await saveRootValue("developerMode", newValue);
	await triggerSettingUpdate("developerMode");
}
