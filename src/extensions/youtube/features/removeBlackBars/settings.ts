import { getUserSetting } from "@core/storage/manager";
import type { BlackBarMode } from "./types";

// ---------------------------------
// Current settings
// ---------------------------------

export const settings = {
	enabled: false,
	mode: "vertical" as BlackBarMode,
	debugCanvas: false,
	debugInfo: false,
	lazyCheck: false,
	lazyAmount: 0,
	ultrawide: false,
	worker: true,
	disableFullscreen: false,
};

// ---------------------------------
// Settings loading
// ---------------------------------

export async function loadInitialSettings() {
	settings.enabled = await getUserSetting("RemoveBlackBars");
	const storedMode = await getUserSetting("RemoveBlackBarsMode");
	if (storedMode === "vertical" || storedMode === "horizontal" || storedMode === "both") {
		settings.mode = storedMode;
	} else {
		settings.mode = "vertical";
	}
	settings.debugCanvas = await getUserSetting("RemoveBlackBarsDebugCanvas");
	settings.debugInfo = await getUserSetting("RemoveBlackBarsDebugInfo");
	settings.lazyCheck = await getUserSetting("RemoveBlackBarsLazyCheck");
	settings.lazyAmount = await getUserSetting("RemoveBlackBarsLazyAmount");
	settings.ultrawide = await getUserSetting("RemoveBlackBarsUltrawide");
	settings.worker = await getUserSetting("RemoveBlackBarsWorker");
	settings.disableFullscreen = await getUserSetting("RemoveBlackBarsDisableFullscreen");
}
