import { logger } from "@shared/logger";

let config: any = {};
try {
	config = require("../../../extension.config.json");
} catch (error) {
	logger.warn("themeConfig", "Could not load extension.config.json", error);
}

/** Only these origins may send theme install, save, and check events. */
export const STYLESHIFT_STORE_ORIGINS: string[] = config.store_origin || [];

export const STYLESHIFT_STORE_API_URL: string = config.store_api || "";

export const STYLESHIFT_STORE_URL: string = config.store_url || "";

export const STYLESHIFT_STORE_DISCOVER_URL: string = config.store_discover || "";

export const STYLESHIFT_STORE_SUBMIT_URL: string = config.store_submit || "";

export const STYLESHIFT_STORE_PREVIEW_URL: string = config.store_url ? `${config.store_url}/preview` : "";

export const STYLESHIFT_VERSION: string = config.version || "";

logger.info("themeConfig", "Theme store configuration loaded", {
	origins: STYLESHIFT_STORE_ORIGINS,
	apiUrl: STYLESHIFT_STORE_API_URL,
	storeUrl: STYLESHIFT_STORE_URL,
	discoverUrl: STYLESHIFT_STORE_DISCOVER_URL,
	submitUrl: STYLESHIFT_STORE_SUBMIT_URL,
	version: STYLESHIFT_VERSION,
});
