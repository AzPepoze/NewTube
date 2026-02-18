import { getUserSetting } from "../../../styleshift/core/storageManager";

export const settings = {
	enabled: false,
	debugCanvas: false,
	debugInfo: false,
	lazyCheck: false,
	lazyAmount: 0,
	ultrawide: false,
	worker: true,
	disableFullscreen: false,
};

export async function loadInitialSettings() {
	settings.enabled = await getUserSetting("RemoveBlackBars");
	settings.debugCanvas = await getUserSetting("RemoveBlackBarsDebugCanvas");
	settings.debugInfo = await getUserSetting("RemoveBlackBarsDebugInfo");
	settings.lazyCheck = await getUserSetting("RemoveBlackBarsLazyCheck");
	settings.lazyAmount = await getUserSetting("RemoveBlackBarsLazyAmount");
	settings.ultrawide = await getUserSetting("RemoveBlackBarsUltrawide");
	settings.worker = await getUserSetting("RemoveBlackBarsWorker");
	settings.disableFullscreen = await getUserSetting("RemoveBlackBarsDisableFullscreen");
}
