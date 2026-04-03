import { createError, createNotification, disableExtension, enableExtension, toggleDeveloperMode } from "./shared/extension";
import { logger } from "../shared/logger";
import {
	getCurrentDomain,
	getCurrentUrlParameters,
	getDocumentBody,
	getDocumentHead,
	rearrangeSelector,
	sleep,
} from "./shared/normal";
import { synchronizeAvailableFunctions } from "./core/runtimeController";
import {
	getRootValue,
	initializeStorageConnection,
	persistCachedDataToStorage,
} from "./core/storageManager";
import {
	performStorageGarbageCollection,
	populateMissingDefaultSettings,
	initializeDefaultCustomItems,
} from "./core/storageMaintenance";
import { registerSettingListener, initializeAllActiveSettings, attachBehaviorToSetting, reactivateAllSettings } from "./settings/functions";
import { createStylesheetHolder, injectMaterialIconsStyles } from "./settings/styleSheet";
import { getAllStyleShiftItems, getAllStyleShiftSettings, updateStyleShiftItems } from "./settings/items";
import "./communication/extension";
import { updateAllUiComponents } from "./ui/extension";
import { syncAllThemes } from "./ui/theme";
import { Category } from "./types/styleshiftTypes";
import { extensionSettingsUi, extensionSettingsUiPromise } from "./ui/extensionSettings";
import { toggleCustomize } from "./ui/highlight";
import { appBootstrap, shouldEnableExtension } from "@/main";
import { STORE_TARGET_SITES } from "@/main/constants";

//-------------------------------------------------------
// Configuration & State
//-------------------------------------------------------

export const EXTENSION_VERSION = chrome.runtime.getManifest().version;
export let isExtensionReady = false;

export const IS_FIREFOX = navigator.userAgent.toLowerCase().includes("firefox");
export const EXTENSION_BASE_URL = chrome.runtime.getURL("").slice(0, -1);
export const IS_IN_EXTENSION_SETTINGS_PAGE = window.location.origin === EXTENSION_BASE_URL;


// Identify the current domain context for storage
export let currentContextDomain: string;
if (IS_IN_EXTENSION_SETTINGS_PAGE) {
	const params = getCurrentUrlParameters();
	currentContextDomain = params.domain || STORE_TARGET_SITES[0];
} else {
	currentContextDomain = getCurrentDomain();
}


// Global container for StyleShift elements that shouldn't be directly in the body
export const styleshiftContainer: HTMLElement = document.createElement("div");
styleshiftContainer.className = "StyleShift-Station";
styleshiftContainer.style.display = "none";

/*
-------------------------------------------------------
 Core Lifecycle Functions
-------------------------------------------------------
*/

/**
 * Refreshes the internal state and updates all UI components.
 */
export function refreshExtensionState(): void {
	logger.info("lifecycle", "Refreshing extension state...");
	synchronizeAvailableFunctions();
	updateStyleShiftItems();
	updateAllUiComponents();
}

/**
 * Main entry point for the extension logic.
 */
async function bootstrapExtension(): Promise<void> {
	await initializeStorageConnection();
	await initializeDefaultCustomItems();

	if (!shouldEnableExtension()) {
		logger.info("lifecycle", "StyleShift extension logic skipped on this domain (Core active).");
		await getDocumentHead();
		await createStylesheetHolder();
		await injectMaterialIconsStyles();
		return;
	}

	await getDocumentHead();

	// Inject StyleShift container
	setTimeout(async () => {
		(await getDocumentBody()).append(styleshiftContainer);
	}, 1);

	// Inject built-in functions into the page context (Main World)
	if (!IS_IN_EXTENSION_SETTINGS_PAGE) {
		const script = document.createElement("script");
		script.src = chrome.runtime.getURL("build-in.js");
		(await getDocumentHead()).appendChild(script);
	}

	// Initialize remaining components
	await synchronizeAvailableFunctions();
	await createStylesheetHolder();
	await injectMaterialIconsStyles();
	await updateStyleShiftItems();
	await populateMissingDefaultSettings();


	// Set up global theme listeners
	registerSettingListener("EnableAppLightTheme", syncAllThemes, true);
	registerSettingListener("EnableSettingsBackgroundBlur", syncAllThemes, true);
	registerSettingListener(
		"developerMode",
		async (isDev) => {
			await createNotification({
				icon: isDev ? "mode_edit" : "edit_off",
				title: isDev ? "Developer Mode Enabled" : "Developer Mode Disabled",
				timeout: 3000,
			});
			updateAllUiComponents();
		},
		false,
	);

	// Initialize individual setting behaviors
	const allSettings = await getAllStyleShiftSettings();
	for (const setting of allSettings) {
		if (setting.id === "Themes") continue;
		attachBehaviorToSetting(setting);
	}

	initializeAllActiveSettings();
	await performStorageGarbageCollection();

	// Normalize CSS selectors for all items
	const items = getAllStyleShiftItems();
	for (const item of items) {
		const category = item as Category;
		if (category.selector) {
			category.selector = rearrangeSelector(category.selector);
		}
	}

	await persistCachedDataToStorage();

	await extensionSettingsUiPromise;

	if (IS_IN_EXTENSION_SETTINGS_PAGE) {
		extensionSettingsUi.createUi();
	}

	isExtensionReady = true;
	logger.info("lifecycle", "StyleShift bootstrap complete.");

	document.addEventListener("visibilitychange", async () => {
		if (document.visibilityState === "visible") {
			logger.info("lifecycle", "Visibility changed to visible, reloading settings...");
			await initializeStorageConnection();
			await updateStyleShiftItems();
			await reactivateAllSettings();
			updateAllUiComponents();
		}
	});

	if (!IS_IN_EXTENSION_SETTINGS_PAGE) {
		appBootstrap();
	}
}

/*
-------------------------------------------------------
 Execution & Event Handling
-------------------------------------------------------
*/

try {
	bootstrapExtension();
} catch (error) {
	createError(error).then((notification) => {
		notification.setTitle("StyleShift - Bootstrap Failure");
	});
}

/**
 * Handle messages from the background script or popup.
 */
chrome.runtime.onMessage.addListener(async (message) => {
	try {
		// Log errors at error level, others at info level
		if (message.Command === "workerError" || message.error) {
			logger.error("lifecycle", "Incoming message:", message);
		} else {
			logger.info("lifecycle", "Incoming message:", message);
		}

		if (message === "toggle_enable") {
			if (getRootValue("enableExtension")) {
				disableExtension();
			} else {
				enableExtension();
			}
		}

		if (message === "toggle_dev_mode") {
			await toggleDeveloperMode();
		}

		if (IS_IN_EXTENSION_SETTINGS_PAGE) return;

		if (message === "toggle_customize") {
			toggleCustomize();
		}

		if (message.Command === "themeDataUpdated") {
			logger.info("lifecycle", "Theme update signal received, refreshing behaviors...");
			await initializeStorageConnection();
			await updateStyleShiftItems();

			// Re-apply behaviors for all settings
			const allSettings = await getAllStyleShiftSettings();
			for (const setting of allSettings) {
				if (setting.id === "Themes") continue;
				await attachBehaviorToSetting(setting);
			}

			initializeAllActiveSettings();
			updateAllUiComponents();
		}


		if (message === "toggle_settings") {
			if (!isExtensionReady) {
				const waitNotification = await createNotification({
					icon: "hourglass_empty",
					title: "StyleShift is initializing...",
					timeout: -1,
				});

				while (!isExtensionReady) {
					await sleep(100);
				}
				waitNotification.close();
			}

			await extensionSettingsUiPromise;
			extensionSettingsUi.toggle();
		}
	} catch (error) {
		createError(error);
	}
});
