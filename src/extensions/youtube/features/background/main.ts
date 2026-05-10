import { logger } from "@/shared/logger";
import { getUserSetting } from "@core/storage/manager";
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

	async enable(): Promise<void> {
		const mode = (await getUserSetting("BackgroundMode")) as BackgroundMode;
		await this.switchMode(mode);
	}

	async disable(): Promise<void> {
		await this.activeHandler?.disable();
		this.activeMode = null;
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
		registerSettingListener("BackgroundMode", (value) => this.switchMode(value as BackgroundMode), true);

		registerSettingListener("EnableBackground", async (value) => {
			if (value) {
				await this.enable();
			} else {
				removeYoutubeIframe();
				await this.disable();
			}
		});
	}
}

const dispatcher = new BackgroundModeDispatcher();
dispatcher.registerListeners();

export const enableBg = () => dispatcher.enable();
export const disableBg = () => dispatcher.disable();
export const showBg = () => dispatcher.show();
export const hideBg = () => dispatcher.hide();
