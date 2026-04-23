import { sleep } from "@/core/shared/utilities";
import { logger } from "@/shared/logger";
import { onYoutubeNavigate } from "@extensions/youtube/modules/youtube";

export function setupAutoTheater() {
	const checkTheater = () => {
		const theaterButton = document.querySelector("button.ytp-size-button") as HTMLElement;
		// Check if the button for entering theater mode exists and is not already in theater mode
		if (theaterButton && !document.querySelector("ytd-watch-flexy[theater]")) {
			theaterButton.click();
		}
	};
	// run after a delay to ensure the page is loaded
	setTimeout(checkTheater, 2000);
	// Re-run when navigating to a new video
	onYoutubeNavigate(() => setTimeout(checkTheater, 1000));
}

export function enableAutoRemoveAmbient() {
	const removeAmbient = async () => {
		const ambientContainer = document.querySelector("#cinematics-container")
		logger.debug("AutoRemoveAmbient", "Attempting to remove ambient container");
		if (ambientContainer) {
			ambientContainer.remove();
			logger.debug("AutoRemoveAmbient", "Removed ambient container");
		} else {
			await sleep(1000);
			removeAmbient();
		}
	};
	removeAmbient();
}
