import { convertToExportSetting } from "../core/exportConverter";
import { saveAndRefreshAll, jszipInstance as jszip } from "../core/runtimeController";
import {
	ALLOWED_STORAGE_KEYS,
	cachedStorageData as savedData,
	getRootValue,
	saveRootValue,
} from "../core/storageManager";
import { initializeRequiredStorageStructures as setNullSave } from "../core/storageMaintenance";
import { styleshiftContainer } from "../run";
import { styleshiftCategoryList } from "../settings/defaultItems";
import { showStylesheet, hideStylesheet } from "../settings/styleSheet";
import { Category, Setting } from "../types/store";
import {
	globalNotificationContainer,
	playUiAnimation,
	showSelection,
	showUserConfirmation,
	showUserPrompt,
} from "../ui/extension";
import { settingsUi } from "../ui/settings/settingComponents";
import { sleep, deepClone, downloadFile, getCurrentDomain, createUniqueId } from "./normal";

export { downloadFile };
import { logger } from "../../shared/logger";

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
export async function createNotification({ icon = null, title = "StyleShift", content = "", timeout = 3000 }) {
	logger.info("extension", title, content);

	const notificationFrame = await settingsUi.settingFrame(true, false, {
		x: false,
		y: true,
	});

	notificationFrame.classList.add("STYLESHIFT-Notification");
	setTimeout(() => {
		globalNotificationContainer.append(notificationFrame);
	}, 1);

	let iconUi;

	if (icon) {
		iconUi = await settingsUi.settingFrame(true, false, {
			x: true,
			y: true,
		});
		iconUi.classList.add("STYLESHIFT-Notification-Icon");
		iconUi.textContent = icon;
		notificationFrame.append(iconUi);
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

	const contentUi = await settingsUi.settingFrame(true, false, {
		x: false,
		y: true,
	});
	contentUi.classList.add("STYLESHIFT-Notification-Content");
	notificationContentFrame.append(contentUi);

	const setContent = (newContent) => {
		newContent = String(newContent);
		contentUi.innerHTML = newContent.replaceAll("<script", "").replaceAll("/script>", "");
	};

	setContent(content);

	//---------------------------------

	async function close() {
		await playUiAnimation(notificationFrame, "Notification-Hide");
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
			if (iconUi) {
				iconUi.textContent = newIcon;
			}
		},
		setContent,
		setTitle: (newTitle) => {
			titleUi.textContent = newTitle;
		},
		close,
	};
}

/**
 * Creates an error notification.
 * @param {string} content - The error content.
 * @returns {Promise<Object>}
 * @example
 * await createError("An error occurred");
 */
export async function createError(content, timeout = 0) {
	logger.error("extension", "StyleShift - " + content);
	return await createNotification({
		icon: "❌",
		title: "StyleShift - Error",
		content: content,
		timeout: timeout,
	});
}

/** Creates a warning notification.
 * @param {string} content - The warning content.
 * @param {Object} options - Additional options.
 * @param {number} [options.timeout=0] - The timeout in milliseconds.
 * @param {boolean} [options.show=true] - Whether to show the warning.
 * @returns {Promise<Object>}
 * @example
 * await createWarning("This is a warning", { timeout: 5000, show: true });
 */
export async function createWarning(content, { timeout = 0, show = true } = {}) {
	logger.warn("extension", "StyleShift - " + content);
	if (!show) return;
	return await createNotification({
		icon: "⚠️",
		title: "StyleShift - Warning",
		content: content,
		timeout: timeout,
	});
}

/** Creates a success notification.
 * @param {string} content - The success content.
 * @param {number} [timeout=3000] - The timeout in milliseconds.
 * @returns {Promise<Object>}
 * @example
 * await createSuccess("Operation completed successfully");
 */
export async function createSuccess(content, timeout = 3000) {
	logger.info("extension", "Success", content);
	return await createNotification({
		icon: "✅",
		title: "StyleShift - Success",
		content: content,
		timeout: timeout,
	});
}

/*
-------------------------------------------------------
For advanced user !!!
-------------------------------------------------------
*/
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
export async function chooseSelection({ message = "", title = "Select Option", buttons = [] }) {
	return await showSelection(message, title, buttons);
}

/**
 * Prompts the user to select a file.
 * @param {string} type - The file type.
 * @returns {Promise<file>}
 * @example
 * const file = await getFile(".txt");
 */
export async function getFile(type) {
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
		icon: "🔄️",
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

		notification.setIcon("✅");
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

	const customItems = exportStyleshiftData["customStyleshiftItems"];

	if (customItems) {
		for (const thisCategory of customItems) {
			delete thisCategory.Highlight_color;
			delete thisCategory.editable;

			for (const thisSetting of thisCategory.settings) {
				delete thisSetting.editable;
			}
		}
	} else {
		createWarning("No custom items found. Skipping...", { show: false });
	}

	return exportStyleshiftData;
}

/**
 * Imports StyleShift data from a JSON string.
 * @param {string} text - The JSON string to import.
 * @returns {Promise<void>}
 * @example
 * const json = '{"customStyleshiftItems":[{"Category":"Test","settings":[{"type":"text","id":"testText","html":"<p>Test</p>"}]}]}';
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
export async function importStyleshiftZip(zipFile) {
	if (!jszip) {
		throw new Error("JSZip not loaded!");
	}
	const zip = new (jszip as any)();

	const loadedZip = await zip.loadAsync(zipFile, {
		createFolders: true,
	});

	const customStyleshiftItems: Category[] = [];

	const categoryFolders = Object.keys(loadedZip.files).filter((path) => {
		const pathArray = path.split("/");
		if (pathArray.length === 2 && pathArray[1] == "") {
			return true;
		}
	});

	for (const categoryPath of categoryFolders) {
		const categoryPathName = categoryPath.slice(0, -1);
		const categoryArray = categoryPathName.split(" - ");
		const categoryIndex = Number(categoryArray[0]);

		const categoryConfig = loadedZip.file(`${categoryPathName}/Config.json`);

		const configContent = await categoryConfig.async("string");
		const categoryData = JSON.parse(configContent);

		const settings: Setting[] = [];

		for (const settingPath of Object.keys(loadedZip.files)) {
			if (
				settingPath.split("/").length === 3 &&
				settingPath.startsWith(`${categoryPathName}/`) &&
				settingPath.endsWith("/")
			) {
				const settingPathName = settingPath.slice(categoryPath.length, -1);

				const settingArray = settingPathName.split(" - ");
				const settingIndex = Number(settingArray[0]);

				const settingData =
					JSON.parse(await loadedZip.file(`${settingPath}Config.json`).async("string")) || {};

				for (const settingPropertyPath of Object.keys(loadedZip.files)) {
					if (
						settingPropertyPath.split("/").length === 3 &&
						settingPropertyPath.startsWith(settingPath) &&
						!settingPropertyPath.endsWith("/") &&
						!settingPropertyPath.endsWith("Config.json")
					) {
						const settingPropertyName = settingPropertyPath.slice(
							settingPath.length,
							settingPropertyPath.lastIndexOf("."),
						);

						logger.info("extension", settingPropertyPath);

						settingData[settingPropertyName] = await loadedZip
							.file(settingPropertyPath)
							.async("string");
					}
				}

				settings[settingIndex] = settingData;
			}
		}

		// clear null settings
		categoryData["settings"] = settings.filter((setting) => setting !== null);

		customStyleshiftItems[categoryIndex] = categoryData;
	}

	const styleshiftData = {
		customStyleshiftItems,
	};

	logger.info("extension", styleshiftData);

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
export async function exportStyleshiftZip(styleshiftData, zipFileName) {
	logger.info("extension", "Data", styleshiftData);

	if (!jszip) {
		throw new Error("JSZip not loaded!");
	}
	const zip = new (jszip as any)();

	for (const [categoryIndex, thisCategory] of styleshiftData.entries()) {
		const renamedCategory = (thisCategory.Category || "Untitled Category").replace(/\/|\n/g, "_");
		const categoryFolder = zip.folder(`${categoryIndex} - ${renamedCategory}`);

		const categoryConfig = {};

		for (const [key, value] of Object.entries(styleshiftCategoryList)) {
			if (key !== "settings") {
				if (thisCategory[key]) {
					categoryConfig[key] = thisCategory[key];
				} else {
					categoryConfig[key] = value;
				}
			}
		}

		categoryFolder.file("Config.json", JSON.stringify(categoryConfig, null, 2));

		if (thisCategory.settings) {
			for (const [settingIndex, originalSetting] of thisCategory.settings.entries()) {
				logger.info("extension", originalSetting);

				const renamedSettingName = (
					originalSetting.name ||
					originalSetting.id ||
					"Untitled Setting"
				).replace(/\/|\n/g, "_");

				const thisSetting = deepClone(originalSetting);
				const settingsFolder = categoryFolder.folder(`${settingIndex} - ${renamedSettingName}`);

				await convertToExportSetting(thisSetting, async (fileName, fileData) => {
					settingsFolder.file(fileName, fileData);
				});

				settingsFolder.file("Config.json", JSON.stringify(thisSetting, null, 2));
			}
		}
	}

	const zipBlob = await zip.generateAsync({ type: "blob" });
	downloadFile(zipBlob, zipFileName);
}

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
}

/**
 * Disables the extension.
 * @example
 * disableExtension();
 */
export async function disableExtension() {
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
