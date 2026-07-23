import { getUserSetting } from "@core/storage/manager";

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
	settings.blur = (await getUserSetting("VideoAmbientBlur")) ?? 30;
	settings.quality = ((await getUserSetting("VideoAmbientQuality")) ?? 50) / 100;
	settings.brightness = (await getUserSetting("VideoAmbientBrightness")) ?? 1;
	settings.contrast = (await getUserSetting("VideoAmbientContrast")) ?? 1;
	settings.opacity = (await getUserSetting("VideoAmbientOpacity")) ?? 100;
	settings.scale = (await getUserSetting("VideoAmbientSize")) ?? 2.2;
	settings.smooth = (await getUserSetting("VideoAmbientSmooth")) ?? 1;
	settings.stick = (await getUserSetting("VideoAmbientStick")) ?? false;
	settings.checkLag = (await getUserSetting("VideoAmbientCheckLag")) ?? true;
	settings.debug = (await getUserSetting("VideoAmbientDebug")) ?? false;
	settings.disableFullscreen = (await getUserSetting("VideoAmbientDisableFullscreen")) ?? true;
	settings.engine = (await getUserSetting("VideoAmbientRenderEngine")) ?? "GPU";
	settings.worker = (await getUserSetting("VideoAmbientWorker")) ?? true;
}
