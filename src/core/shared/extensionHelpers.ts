import type { Setting } from "@/settings/types/styleshiftTypes";
import { ALLOWED_STORAGE_KEYS, getRootValue, saveRootValue } from "@core/storage/manager";
import { deactivateAllActiveSettings, reactivateAllSettings, triggerSettingUpdate } from "@settings/engine/functions";
import { hideStylesheet, showStylesheet } from "@settings/stylesheet/styleSheet";
import { logger } from "@shared/logger";
import { settingsUi } from "@ui/settings/settingsApi";
import {
	playCelebration as playCelebrationOverlay,
	stopCelebration as stopCelebrationOverlay,
} from "@ui/tutorial/celebrationService";
import type { CelebrationOptions } from "@ui/tutorial/tour/celebrationOptions";
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
 * Copies text to the clipboard, so users can paste a snippet or link somewhere else.
 *
 * @param {string} text - The exact text to place on the clipboard.
 *
 * @example
 * const url = location.href;
 * copyToClipboard(url);
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
 * Opens the file picker and returns the one file the user chooses, for single-file imports.
 *
 * @param {string} type - File filter for the picker, such as ".json" or "image/*".
 * @returns {Promise<File>} The file the user picked.
 * @throws {Error} When the user picks nothing or closes the picker.
 *
 * @example
 * const file = await getFile(".json");
 * const text = await file.text();
 * // result: the chosen file's contents
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
 * Opens the file picker and returns every file the user chooses, in the order they picked them.
 *
 * @param {string} type - File filter for the picker, such as ".json" or "image/*".
 * @returns {Promise<File[]>} The chosen files, in the order they were picked.
 *
 * @example
 * const files = await getFiles(".json");
 * // result: [File, File], one per file you chose
 */
export async function getFiles(type: string): Promise<File[]> {
	return new Promise((resolve, reject) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = type;
		input.multiple = true;

		input.addEventListener("change", () => {
			const files = Array.from(input.files ?? []);
			if (files.length > 0) resolve(files);
			else reject(new Error("No files selected"));
		});
		input.addEventListener("cancel", () => reject(new Error("Canceled by the user")));
		input.click();
	});
}

/**
 * Adds an element to a parent, accepting either a plain element or a component that wraps one.
 *
 * @param {HTMLElement} parent - The element that receives the new child.
 * @param {unknown} child - What to add: an element, or a component with a frame or button.
 *
 * @example
 * const panel = document.createElement("div");
 * dynamicAppend(styleshiftContainer, panel);
 */
export function dynamicAppend(parent: HTMLElement, child: unknown) {
	const element = dynamicGetElement(child);
	if (element) {
		parent.appendChild(element);
	}
}

/**
 * Pulls the real element out of a component that hides it behind a frame or button property.
 *
 * @param {unknown} child - The value to unwrap: a component object or a plain element.
 * @returns {HTMLElement | undefined} The wrapped element, or the value when none is wrapped.
 *
 * @example
 * const button = dynamicGetElement(myButtonComponent);
 * button.classList.add("styleshift-button");
 * // result: the button element held by the component
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
 * Opens the StyleShift settings page in a new tab, so users can reach your options from anywhere.
 *
 * @example
 * const link = document.querySelector("#open-settings");
 * link.addEventListener("click", openSettingPage);
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
 * Shows the stylesheet and restores active settings, turning StyleShift back on.
 *
 * @returns {Promise<void>} Resolves once styles are shown and settings are active.
 *
 * @example
 * await enableExtension();
 * // result: your saved styles are applied again
 */
export async function enableExtension() {
	showStylesheet();
	await reactivateAllSettings();
	await updateAllUiComponents();
}

/**
 * Deactivates active settings and hides the stylesheet, turning StyleShift off.
 *
 * @returns {Promise<void>} Resolves once settings stop and the stylesheet is hidden.
 *
 * @example
 * await disableExtension();
 * // result: the page returns to its original look
 */
export async function disableExtension() {
	await deactivateAllActiveSettings();
	hideStylesheet();
}

/**
 * Reads a stored StyleShift value as JSON text, for restoring settings saved earlier.
 *
 * @param {string} id - The storage key to read; it must be one StyleShift allows.
 * @returns {Promise<string>} The stored value as a JSON string.
 * @throws {Error} When the key is not one StyleShift allows.
 *
 * @example
 * const raw = await loadStyleShiftValue("developerMode");
 * const enabled = JSON.parse(raw);
 * // result: true when developer mode was saved on
 */
export async function loadStyleShiftValue(id: string) {
	if (!ALLOWED_STORAGE_KEYS.includes(id)) {
		throw new Error(`Access denied for key: ${id}`);
	}
	return JSON.stringify(await getRootValue(id));
}

/**
 * Stores a JSON value under a StyleShift key, so your script can remember it between visits.
 *
 * @param {string} id - The storage key to write; it must be one StyleShift allows.
 * @param {string} value - The value to store, written as JSON text.
 * @returns {Promise<any>} Resolves with the storage result after the save.
 * @throws {Error} When the key is not one StyleShift allows.
 *
 * @example
 * await saveStyleShiftValue("developerMode", "true");
 * // result: the value is stored under "developerMode"
 */
export async function saveStyleShiftValue(id: string, value: string) {
	if (!ALLOWED_STORAGE_KEYS.includes(id)) {
		throw new Error(`Access denied for key: ${id}`);
	}
	return await saveRootValue(id, JSON.parse(value));
}

/**
 * Builds a setting control, adds it to the StyleShift panel and returns its id.
 *
 * @param {string} type - The kind of control to build, such as "checkbox" or "dropdown".
 * @param {Setting} thisSetting - The setting definition with the label, value and behavior.
 * @param {...unknown[]} args - Extra values passed on to the control builder.
 * @returns {Promise<string>} The unique id added to the new UI element.
 *
 * @example
 * const uiId = await createStyleShiftSettingUi("checkbox", mySetting);
 * const el = document.querySelector(`[styleshift-ui-id="${uiId}"]`);
 * // result: the id of your new checkbox
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
 * Flips developer mode on or off and refreshes the settings that depend on it.
 *
 * @returns {Promise<void>} Resolves once the new state is saved and applied.
 *
 * @example
 * await toggleDeveloperMode();
 * // result: developer mode is now the opposite of before
 */
export async function toggleDeveloperMode() {
	const isDev = await getRootValue("developerMode");
	const newValue = !isDev;
	await saveRootValue("developerMode", newValue);
	await triggerSettingUpdate("developerMode");
}

/**
 * Shows the confetti overlay with a single Yay button, so you can reward a finished step.
 *
 * @param {CelebrationOptions} [options] - Overlay settings: title, message, yayLabel and mode.
 * @returns {Promise<void>} Resolves after a cannons celebration finishes.
 *
 * @example
 * await playCelebration({ title: "Saved!", message: "Your theme is ready." });
 * // result: confetti fires and the Yay prompt appears
 */
export async function playCelebration(options: CelebrationOptions = {}): Promise<void> {
	await playCelebrationOverlay(options);
}

/**
 * Stops a celebration that is still running, such as endless rain from mode "rain".
 *
 * @example
 * await playCelebration({ mode: "rain" });
 * stopCelebration();
 */
export function stopCelebration(): void {
	stopCelebrationOverlay();
}
