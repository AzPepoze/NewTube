import { getUserSetting } from "../../../styleshift/core/storageManager";

export const settings = {
	blur: 30,
	quality: 0.5,
	brightness: 1,
	contrast: 1,
	opacity: 100,
	scale: 2.2,
	smooth: 1,
	engine: "GPU",
	worker: true,
	stick: false,
	checkLag: true,
	debug: false,
	disableFullscreen: true,
};

export async function loadInitialSettings() {
	settings.blur = await getUserSetting("VideoBackgroundBlur");
	settings.quality = (await getUserSetting("VideoBackgroundQuality")) / 100;
	settings.brightness = await getUserSetting("VideoBackgroundBrightness");
	settings.contrast = await getUserSetting("VideoBackgroundContrast");
	settings.opacity = await getUserSetting("VideoBackgroundOpacity");
	settings.scale = await getUserSetting("VideoBackgroundSize");
	settings.smooth = await getUserSetting("VideoBackgroundSmooth");
	settings.stick = await getUserSetting("VideoBackgroundStick");
	settings.checkLag = await getUserSetting("VideoBackgroundCheckLag");
	settings.debug = await getUserSetting("VideoBackgroundDebug");
	settings.disableFullscreen = await getUserSetting("VideoBackgroundDisableFullscreen");
	settings.engine = await getUserSetting("VideoBackgroundRenderEngine");
	settings.worker = await getUserSetting("VideoBackgroundWorker");
}
