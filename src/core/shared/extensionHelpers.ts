import type { Setting } from '@/settings/types/styleshiftTypes';
import { ALLOWED_STORAGE_KEYS, getRootValue, saveRootValue } from '@core/storage/manager';
import {
	deactivateAllActiveSettings, reactivateAllSettings, triggerSettingUpdate
} from '@settings/engine/functions';
import { hideStylesheet, showStylesheet } from '@settings/stylesheet/styleSheet';
import { logger } from '@shared/logger';
import { settingsUi } from '@ui/settings/settingsApi';
import { updateAllUiComponents } from '@ui/window/windowFactory';
import { styleshiftContainer } from '../';
import { getCurrentDomain } from './domHelpers';
import { createUniqueId, downloadFile } from './utilities';

// Re-exports for backward compatibility
export * from "./dialogs";
export * from "./importExport";
export * from "./notifications";

export { downloadFile };

/**
 * Copies text to the clipboard.
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
 * Prompts the user to select a file.
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
 * Appends a child element to a parent HTMLDivElement.
 */
export function dynamicAppend(parent: HTMLElement, child: unknown) {
	const element = dynamicGetElement(child);
	if (element) {
		parent.appendChild(element);
	}
}

/**
 * Retrieves a specific element from a given object.
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
 * Enables the extension.
 */
export async function enableExtension() {
	showStylesheet();
	await reactivateAllSettings();
	await updateAllUiComponents();
}

/**
 * Disables the extension.
 */
export async function disableExtension() {
	await deactivateAllActiveSettings();
	hideStylesheet();
}

/**
 * Retrieves the StyleShift value associated with a given ID.
 */
export async function loadStyleShiftValue(id: string) {
	if (!ALLOWED_STORAGE_KEYS.includes(id)) {
		throw new Error(`Access denied for key: ${id}`);
	}
	return JSON.stringify(await getRootValue(id));
}

/**
 * saves the StyleShift value associated with a given ID.
 */
export async function saveStyleShiftValue(id: string, value: string) {
	if (!ALLOWED_STORAGE_KEYS.includes(id)) {
		throw new Error(`Access denied for key: ${id}`);
	}
	return await saveRootValue(id, JSON.parse(value));
}

/**
 * Creates a setting ui element from the given type and setting.
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
 * Toggles the developer mode setting and triggers necessary updates.
 */
export async function toggleDeveloperMode() {
	const isDev = await getRootValue("developerMode");
	const newValue = !isDev;
	await saveRootValue("developerMode", newValue);
	await triggerSettingUpdate("developerMode");
}
