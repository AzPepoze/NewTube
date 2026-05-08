import { STORE_TARGET_SITES } from "@extensions/youtube/constants";
import { getCurrentDomain, getCurrentUrlParameters } from "../shared/domHelpers";

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

export function setCurrentContextDomain(domain: string) {
    currentContextDomain = domain;
}
