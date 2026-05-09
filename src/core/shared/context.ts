import { STORE_TARGET_SITES } from "@extensions/youtube/constants";
import { getCurrentDomain, getCurrentUrlParameters } from "../shared/domHelpers";

/**
 * Flag indicating if the current browser is Firefox.
 * 
 * @type {boolean}
 */
export const IS_FIREFOX = navigator.userAgent.toLowerCase().includes("firefox");

/**
 * The base URL of the extension.
 * 
 * @type {string}
 */
export const EXTENSION_BASE_URL = chrome.runtime.getURL("").slice(0, -1);

/**
 * Flag indicating if the current window is the extension settings page.
 * 
 * @type {boolean}
 */
export const IS_IN_EXTENSION_SETTINGS_PAGE = window.location.origin === EXTENSION_BASE_URL;

/**
 * The current domain context for storage operations.
 * 
 * @type {string}
 */
export let currentContextDomain: string;
if (IS_IN_EXTENSION_SETTINGS_PAGE) {
	const params = getCurrentUrlParameters();
	currentContextDomain = params.domain || STORE_TARGET_SITES[0];
} else {
	currentContextDomain = getCurrentDomain();
}

/**
 * Sets the current context domain.
 * 
 * @param {string} domain - The domain to set as the current context.
 * 
 * @example
 * setCurrentContextDomain("youtube.com");
 */
export function setCurrentContextDomain(domain: string) {
    currentContextDomain = domain;
}
