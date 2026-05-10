import type { Setting } from "@/settings/types/styleshiftTypes";
import { ALLOWED_STORAGE_KEYS, getRootValue, saveRootValue } from "@core/storage/manager";
import { deactivateAllActiveSettings, reactivateAllSettings, triggerSettingUpdate } from "@settings/engine/functions";
import { hideStylesheet, showStylesheet } from "@settings/stylesheet/styleSheet";
import { logger } from "@shared/logger";
import { settingsUi } from "@ui/settings/settingsApi";
import { updateAllUiComponents } from "@ui/window/windowFactory";
import { styleshiftContainer } from "../";
import { getCurrentDomain } from "./domHelpers";
import { createUniqueId, downloadFile } from "./utilities";

// Re-exports for backward compatibility
export * from "./dialogs";
export * from "./importExport";
export * from "./notifications";

export { downloadFile };

/**
 * Copies the provided text to the system clipboard.
 *
 * @param {string} text - The text to copy.
 *
 * @example
 * copyToClipboard("Hello, StyleShift!");
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
 * Prompts the user to select a file from their local system.
 *
 * @param {string} type - The file type/extension filter (e.g., ".json", "image/*").
 * @returns {Promise<File>} A promise that resolves to the selected File object.
 * @throws {Error} If no file is selected or the operation is canceled.
 *
 * @example
 * const file = await getFile(".json");
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
 * Dynamically appends a child element or a component's frame/button to a parent element.
 *
 * @param {HTMLElement} parent - The parent element.
 * @param {unknown} child - The child element or component object to append.
 *
 * @example
 * dynamicAppend(container, myButton);
 */
export function dynamicAppend(parent: HTMLElement, child: unknown) {
	const element = dynamicGetElement(child);
	if (element) {
		parent.appendChild(element);
	}
}

/**
 * Extracts a specific HTMLElement from a component object (checking for 'frame' or 'button' properties).
 *
 * @param {unknown} child - The object to extract the element from.
 * @returns {HTMLElement | undefined} The extracted HTMLElement, or undefined if not found.
 *
 * @example
 * const el = dynamicGetElement({ frame: document.createElement("div") });
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
 * Opens the StyleShift extension settings page in a new tab.
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

/**
 * Enables the extension's visual changes by showing the stylesheet, reactivating settings, and updating UI components.
 *
 * @returns {Promise<void>}
 *
 * @example
 * await enableExtension();
 */
export async function enableExtension() {
	showStylesheet();
	await reactivateAllSettings();
	await updateAllUiComponents();
}

/**
 * Disables the extension's visual changes by deactivating settings and hiding the stylesheet.
 *
 * @returns {Promise<void>}
 *
 * @example
 * await disableExtension();
 */
export async function disableExtension() {
	await deactivateAllActiveSettings();
	hideStylesheet();
}

/**
 * Loads a value from the StyleShift storage associated with a given ID.
 *
 * @param {string} id - The ID/key of the value to load.
 * @returns {Promise<string>} A promise resolving to the JSON string representation of the value.
 * @throws {Error} If access to the key is denied.
 *
 * @example
 * const theme = await loadStyleShiftValue("themeConfig");
 */
export async function loadStyleShiftValue(id: string) {
	if (!ALLOWED_STORAGE_KEYS.includes(id)) {
		throw new Error(`Access denied for key: ${id}`);
	}
	return JSON.stringify(await getRootValue(id));
}

/**
 * Saves a value to the StyleShift storage for a given ID.
 *
 * @param {string} id - The ID/key to save the value under.
 * @param {string} value - The JSON string representation of the value.
 * @returns {Promise<any>} A promise resolving when the save is complete.
 * @throws {Error} If access to the key is denied.
 *
 * @example
 * await saveStyleShiftValue("developerMode", "true");
 */
export async function saveStyleShiftValue(id: string, value: string) {
	if (!ALLOWED_STORAGE_KEYS.includes(id)) {
		throw new Error(`Access denied for key: ${id}`);
	}
	return await saveRootValue(id, JSON.parse(value));
}

/**
 * Creates a setting UI element based on the provided type and configuration, and appends it to the styleshift container.
 *
 * @param {string} type - The type of UI component (e.g., "dropdown", "checkbox").
 * @param {Setting} thisSetting - The setting configuration object.
 * @param {...unknown[]} args - Additional arguments for the UI component creation.
 * @returns {Promise<string>} A promise resolving to a unique ID for the created UI element.
 *
 * @example
 * const uiId = await createStyleShiftSettingUi("checkbox", mySetting);
 */
export async function createStyleShiftSettingUi(type: string, thisSetting: Setting, ...args: unknown[]) {
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
 * Toggles the developer mode state and triggers a setting update.
 *
 * @returns {Promise<void>}
 *
 * @example
 * await toggleDeveloperMode();
 */
export async function toggleDeveloperMode() {
	const isDev = await getRootValue("developerMode");
	const newValue = !isDev;
	await saveRootValue("developerMode", newValue);
	await triggerSettingUpdate("developerMode");
}
