
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

	async switchMode(newMode: BackgroundMode): Promise<void> {
		if (this.activeMode === newMode) return;

		// Disable old mode
		if (this.activeMode) {
			await this.modes[this.activeMode].disable();
		}

		// Enable new mode
		this.activeMode = newMode;
		await this.modes[newMode].enable();

		// Respect hidden state
		if (this.hiddenByVideo) {
			await this.hide();
		}

		logger.info("Background mode switched to:", newMode);
	}

	async enable(): Promise<void> {
		const mode = (await getUserSetting("BackgroundMode")) as BackgroundMode;
		await this.switchMode(mode);
	}

	async disable(): Promise<void> {
		if (this.activeMode) {
			await this.modes[this.activeMode].disable();
			this.activeMode = null;
		}
	}

	async show(): Promise<void> {
		this.hiddenByVideo = false;
		if (this.activeMode) {
			await this.modes[this.activeMode].show();
		}
	}

	async hide(): Promise<void> {
		this.hiddenByVideo = true;
		if (this.activeMode) {
			await this.modes[this.activeMode].hide();
		}
	}

	registerListeners(): void {
		registerSettingListener("BackgroundMode", async (value) => {
			await this.switchMode(value as BackgroundMode);
		}, true);

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

export async function enableBg(): Promise<void> {
	await dispatcher.enable();
}

export async function disableBg(): Promise<void> {
	await dispatcher.disable();
}

export async function showBg(): Promise<void> {
	await dispatcher.show();
}

export async function hideBg(): Promise<void> {
	await dispatcher.hide();
}

// Legacy function names for backward compatibility
export async function updateBgImg(): Promise<void> {
	// This is handled by image mode listeners
}

export async function updateBgImgPosition(): Promise<void> {
	// This is handled by image mode listeners
}
