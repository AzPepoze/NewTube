import { createError, createNotification, toggleDeveloperMode } from "./shared/extension";
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
	initializeStorageConnection,
	persistCachedDataToStorage,
} from "./core/storageManager";
import {
	performStorageGarbageCollection,
	populateMissingDefaultSettings,
	initializeDefaultCustomItems,
} from "./core/storageMaintenance";
import { registerSettingListener, initializeAllActiveSettings, attachBehaviorToSetting } from "./settings/functions";
import { createStylesheetHolder } from "./settings/styleSheet";
import { getAllStyleshiftItems, getAllStyleshiftSettings, updateStyleshiftItems } from "./settings/items";
import "./communication/extension";
import { updateAllUiComponents } from "./ui/extension";
import { syncAllThemes } from "./ui/theme";
import { extensionSettingsUi, extensionSettingsUiPromise } from "./ui/extensionSettings";
import { toggleCustomize } from "./ui/highlight";
import { appBootstrap } from "@/main/main";

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
	currentContextDomain = params.domain || "youtube.com";
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
	updateStyleshiftItems();
	updateAllUiComponents();
}

/**
 * Main entry point for the extension logic.
 */
async function bootstrapExtension(): Promise<void> {
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

	// Initialize storage and sync functions
	await initializeStorageConnection();
	await initializeDefaultCustomItems();
	await synchronizeAvailableFunctions();
	await createStylesheetHolder();
	await updateStyleshiftItems();
	await populateMissingDefaultSettings();

	// Set up global theme listeners
	registerSettingListener("EnableAppLightTheme", syncAllThemes, true);
	registerSettingListener("EnableSettingsBackgroundBlur", syncAllThemes, true);
	registerSettingListener(
		"Developer_mode",
		async (isDev) => {
			await createNotification({
				icon: isDev ? "🔨" : "✨",
				title: isDev ? "Developer Mode Enabled" : "Developer Mode Disabled",
				timeout: 3000,
			});
			updateAllUiComponents();
		},
		false,
	);

	// Initialize individual setting behaviors
	const allSettings = await getAllStyleshiftSettings();
	for (const setting of allSettings) {
		if (setting.id === "Themes") continue;
		attachBehaviorToSetting(setting);
	}

	initializeAllActiveSettings();
	await performStorageGarbageCollection();

	// Normalize CSS selectors for all items
	const items = getAllStyleshiftItems();
	for (const category of items) {
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

		if (message === "Developer") {
			await toggleDeveloperMode();
		}

		if (IS_IN_EXTENSION_SETTINGS_PAGE) return;

		if (message === "Customize") {
			toggleCustomize();
		}

		if (message === "Setting") {
			if (!isExtensionReady) {
				const waitNotification = await createNotification({
					icon: "⏳",
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
