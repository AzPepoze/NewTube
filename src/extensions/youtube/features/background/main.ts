import { logger } from "@/shared/logger";
import { getRootValue, getUserSetting } from "@core/storage/manager";
import { registerSettingListener } from "@settings/engine/functions";
import { enableBackgroundCss, removeYoutubeIframe } from "./helpers";
import { imageBackgroundMode } from "./image";
import { thumbnailBackgroundMode } from "./thumbnail";
import { type BackgroundMode, type IModeHandler } from "./types";
import { youtubeBackgroundMode } from "./youtube";

export { enableBackgroundCss };

class BackgroundModeDispatcher {
	private modes: Record<BackgroundMode, IModeHandler> = {
		Image: imageBackgroundMode,
		Thumbnail: thumbnailBackgroundMode,
		YouTube: youtubeBackgroundMode,
	};

	private activeMode: BackgroundMode | null = null;
	private hiddenByVideo = false;
	private lifecycleQueue: Promise<void> = Promise.resolve();

	private get activeHandler() {
		return this.activeMode ? this.modes[this.activeMode] : null;
	}

	async switchMode(newMode: BackgroundMode): Promise<void> {
		if (this.activeMode === newMode) return;

		await this.activeHandler?.disable();
		this.activeMode = newMode;
		await this.activeHandler?.enable();

		if (this.hiddenByVideo) await this.hide();

		logger.info("Background mode switched to:", newMode);
	}

	private queueLifecycle(update: () => Promise<void>): Promise<void> {
		this.lifecycleQueue = this.lifecycleQueue.then(update, update);
		return this.lifecycleQueue;
	}

	private reconcile(): Promise<void> {
		return this.queueLifecycle(async () => {
			const [extensionEnabled, backgroundEnabled, mode] = await Promise.all([
				getRootValue("enableExtension"),
				getUserSetting("EnableBackground"),
				getUserSetting("BackgroundMode") as Promise<BackgroundMode>,
			]);

			if (!extensionEnabled || !backgroundEnabled) {
				await this.disableActiveMode();
				return;
			}

			await this.switchMode(mode);
		});
	}

	private async disableActiveMode(): Promise<void> {
		await this.activeHandler?.disable();
		this.activeMode = null;
		removeYoutubeIframe();
	}

	async enable(): Promise<void> {
		await this.reconcile();
	}

	async disable(): Promise<void> {
		await this.queueLifecycle(() => this.disableActiveMode());
	}

	async show(): Promise<void> {
		this.hiddenByVideo = false;
		await this.activeHandler?.show();
	}

	async hide(): Promise<void> {
		this.hiddenByVideo = true;
		await this.activeHandler?.hide();
	}

	registerListeners(): void {
		registerSettingListener("BackgroundMode", () => this.reconcile(), true);
		registerSettingListener("EnableBackground", () => this.reconcile());
		registerSettingListener("enableExtension", () => this.reconcile());
	}
}

const dispatcher = new BackgroundModeDispatcher();
dispatcher.registerListeners();

export const enableBg = () => dispatcher.enable();
export const disableBg = () => dispatcher.disable();
export const showBg = () => dispatcher.show();
export const hideBg = () => dispatcher.hide();
