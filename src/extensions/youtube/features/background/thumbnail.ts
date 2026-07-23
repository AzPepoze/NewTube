import { imageBackgroundMode } from "./image";
import { type IModeHandler } from "./types";

/**
 * Thumbnail mode is a variant of Image mode that auto-fetches the video thumbnail.
 * It delegates to the image mode but sets the thumbnail flag and updates on video change.
 */
class ThumbnailBackgroundMode implements IModeHandler {
	async enable(): Promise<void> {
		await imageBackgroundMode.enable();
	}

	async disable(): Promise<void> {
		await imageBackgroundMode.disable();
	}

	async show(): Promise<void> {
		await imageBackgroundMode.show();
	}

	async hide(): Promise<void> {
		await imageBackgroundMode.hide();
	}
}

export const thumbnailBackgroundMode = new ThumbnailBackgroundMode();
