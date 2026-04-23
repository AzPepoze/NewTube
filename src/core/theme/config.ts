/**
 * StyleShift Theme Store Configuration
 * 
 * This module loads theme store configuration from extension.config.json
 * and exports constants for use throughout the theme manager system.
 */

import { logger } from '@shared/logger';

// Load configuration from extension.config.json
let config: any = {};
try {
	config = require("../../../extension.config.json");
} catch (error) {
	logger.warn("themeConfig", "Could not load extension.config.json", error);
}

/**
 * Allowed origins for StyleShift Theme Store events.
 * Only these origins can send install/save/check theme events.
 */
export const STYLESHIFT_STORE_ORIGINS: string[] = config.store_origin || [];

/**
 * Base URL for the StyleShift Store API.
 * Used to fetch theme data by themeId.
 */
export const STYLESHIFT_STORE_API_URL: string = config.store_api || "";

/**
 * URL to the StyleShift Theme Store website.
 * Where users browse and share themes.
 */
export const STYLESHIFT_STORE_URL: string = config.store_url || "";

logger.info("themeConfig", "Theme store configuration loaded", {
	origins: STYLESHIFT_STORE_ORIGINS,
	apiUrl: STYLESHIFT_STORE_API_URL,
	storeUrl: STYLESHIFT_STORE_URL
});
