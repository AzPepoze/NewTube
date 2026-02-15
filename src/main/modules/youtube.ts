import { waitForElement } from "../../styleshift/shared/normal";
import { logger } from "@/shared/logger";

export let ytdApp: HTMLElement | null = null;
export let videoElement: HTMLVideoElement | null = null;
export let playerElement: HTMLElement | null = null;
export let isYoutubeFullscreen = false;

let playerObserver: MutationObserver | null = null;

const navigateListeners: (() => void)[] = [];
const fullscreenListeners: ((isFullscreen: boolean) => void)[] = [];

/**
 * Retrieves the main YouTube app element (ytd-app).
 */
export async function getYtdApp() {
	if (!ytdApp) {
		ytdApp = await waitForElement("ytd-app");
		if (ytdApp) logger.info("youtube", "Found ytd-app");
	}

	return ytdApp;
}

/**
 * Retrieves the YouTube video element.
 * Tries to find it in the player container first, then fallback to any video tag.
 */
export async function getVideoElement(): Promise<HTMLVideoElement | null> {
	if (!videoElement || !videoElement.isConnected) {
		videoElement =
			(document.querySelector("#player-container video") as HTMLVideoElement) ||
			(document.querySelector("video") as HTMLVideoElement);
		if (videoElement) logger.info("youtube", "Found/Updated video element");
	}
	return videoElement;
}

/**
 * Retrieves the main YouTube player element (#movie_player or .html5-video-player).
 */
export async function getPlayerElement(): Promise<HTMLElement | null> {
	if (!playerElement || !playerElement.isConnected) {
		playerElement = (document.getElementById("movie_player") ||
			document.querySelector(".html5-video-player")) as HTMLElement;
		if (playerElement) logger.info("youtube", "Found/Updated player element");
	}
	return playerElement;
}

/**
 * Retrieves the YouTube player container element.
 */
export function getPlayerContainer(): HTMLElement | null {
	return document.querySelector(".html5-video-container") as HTMLElement;
}

/**
 * Retrieves the current YouTube video ID from the URL.
 */
export function getYoutubeVideoId() {
	return new URLSearchParams(window.location.search).get("v");
}

/**
 * Registers a callback to be executed when a YouTube navigation event finishes.
 * @param callback The function to execute.
 * @returns A cleanup function to unregister the callback.
 */
export function onYoutubeNavigate(callback: () => void) {
	navigateListeners.push(callback);
	return () => {
		const index = navigateListeners.indexOf(callback);
		if (index > -1) {
			navigateListeners.splice(index, 1);
		}
	};
}

/**
 * Registers a callback to be executed when the YouTube player enters or exits fullscreen.
 * @param callback The function to execute, receives a boolean indicating fullscreen state.
 * @returns A cleanup function to unregister the callback.
 */
export function onYoutubeFullscreen(callback: (isFullscreen: boolean) => void) {
	fullscreenListeners.push(callback);
	return () => {
		const index = fullscreenListeners.indexOf(callback);
		if (index > -1) {
			fullscreenListeners.splice(index, 1);
		}
	};
}

// Global listener for YouTube navigation
window.addEventListener("yt-navigate-finish", () => {
	const videoId = getYoutubeVideoId();
	logger.info("youtube", `Navigation finished: ${videoId || "Not a video page"}`);

	videoElement = null; // Reset cached video element on navigation
	playerElement = null; // Reset cached player element on navigation
	navigateListeners.forEach((callback) => {
		try {
			callback();
		} catch (error) {
			console.error("Error in YouTube navigate listener:", error);
		}
	});

	// Re-attach observer to the new player element if it changed
	setupFullscreenObserver();
});

async function setupFullscreenObserver() {
	if (playerObserver) {
		playerObserver.disconnect();
	}

	const player = await getPlayerElement();
	logger.info("youtube", "Setting up fullscreen observer on:", player);

	if (player) {
		playerObserver = new MutationObserver(() => {
			const fullscreen = player.classList.contains("ytp-fullscreen");
			if (fullscreen !== isYoutubeFullscreen) {
				isYoutubeFullscreen = fullscreen;
				logger.info("youtube", `Fullscreen state changed: ${isYoutubeFullscreen}`);
				fullscreenListeners.forEach((callback) => {
					try {
						callback(isYoutubeFullscreen);
					} catch (error) {
						console.error("Error in YouTube fullscreen listener:", error);
					}
				});
			}
		});

		playerObserver.observe(player, {
			attributes: true,
			attributeFilter: ["class"],
		});

		// Initial check
		const initialFullscreen = player.classList.contains("ytp-fullscreen");
		if (initialFullscreen !== isYoutubeFullscreen) {
			isYoutubeFullscreen = initialFullscreen;
			fullscreenListeners.forEach((callback) => callback(isYoutubeFullscreen));
		}
	} else {
		logger.warn("youtube", "Could not find player element for fullscreen observer");
	}
}

// Initial setup
setupFullscreenObserver();
