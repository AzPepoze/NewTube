import { logger } from "@/shared/logger";
import { waitForElement } from "@core/shared/domHelpers";

export let ytdApp: HTMLElement | null = null;
export let videoElement: HTMLVideoElement | null = null;
export let playerElement: HTMLElement | null = null;
export let isYoutubeFullscreen = false;
export let isYoutubeSmallMode = false;
export let isYoutubeVideoPage = !!new URLSearchParams(window.location.search).get("v");

let playerObserver: MutationObserver | null = null;

const navigateListeners: (() => void)[] = [];
const fullscreenListeners: ((isFullscreen: boolean) => void)[] = [];
const smallModeListeners: ((isSmallMode: boolean) => void)[] = [];


export const playerWatchModeSelector = "div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed)";
export const ytVideoContainerWatchMode = `#primary ${playerWatchModeSelector}`;
export const ytPlayerWatchMode = `#primary #player:has(${playerWatchModeSelector})`;
export const ytdPlayerWatchMode = `#primary #ytd-player:has(${playerWatchModeSelector})`;

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
 * Tries multiple selectors to find the actual HTML5 video element that supports PiP.
 */
export async function getVideoElement(): Promise<HTMLVideoElement | null> {
	if (!videoElement || !videoElement.isConnected) {
		const candidates = [
			document.querySelector("#movie_player video") as HTMLVideoElement,
			document.querySelector(".html5-video-container video") as HTMLVideoElement,
			document.querySelector(".html5-video-player video") as HTMLVideoElement,
		];

		videoElement =
			candidates.find((v) => v && v.isConnected && typeof v.requestPictureInPicture === "function") || null;

		if (!videoElement) {
			videoElement = candidates.find((v) => v && v.isConnected) || null;
		}

		if (!videoElement) {
			const allVideos = document.querySelectorAll("video");
			for (const video of Array.from(allVideos)) {
				if (video.isConnected) {
					videoElement = video as HTMLVideoElement;
					break;
				}
			}
		}

		if (videoElement && videoElement.isConnected) {
			logger.info("youtube", "Found/Updated video element");
		} else {
			videoElement = null;
		}
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
	const url = new URL(window.location.href);
	const videoId = url.searchParams.get("v");
	if (videoId) return videoId;

	// Check for shorts
	if (url.pathname.startsWith("/shorts/")) {
		const parts = url.pathname.split("/");
		return parts[2] || null;
	}

	return null;
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

/**
 * Registers a callback to be executed when the YouTube player enters or exits small mode (mini-player).
 * @param callback The function to execute, receives a boolean indicating small mode state.
 * @returns A cleanup function to unregister the callback.
 */
export function onYoutubeSmallMode(callback: (isSmallMode: boolean) => void) {
	smallModeListeners.push(callback);
	return () => {
		const index = smallModeListeners.indexOf(callback);
		if (index > -1) {
			smallModeListeners.splice(index, 1);
		}
	};
}

// Global listener for YouTube navigation
window.addEventListener("yt-navigate-finish", () => {
	const videoId = getYoutubeVideoId();
	logger.info("youtube", `Navigation finished: ${videoId || "Not a video page"}`);

	isYoutubeVideoPage = !!videoId;
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
	setupPlayerObserver();
});

async function setupPlayerObserver() {
	if (playerObserver) {
		playerObserver.disconnect();
	}

	const player = await getPlayerElement();
	logger.info("youtube", "Setting up player observer on:", player);

	if (player) {
		const checkPlayerState = () => {
			const fullscreen = player.classList.contains("ytp-fullscreen");
			const smallMode =
				Array.from(player.classList).some((cls) => cls.includes("small")) ||
				player.classList.contains("ytp-player-minimized");

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

			if (smallMode !== isYoutubeSmallMode) {
				isYoutubeSmallMode = smallMode;
				logger.info("youtube", `Small mode state changed: ${isYoutubeSmallMode}`);
				smallModeListeners.forEach((callback) => {
					try {
						callback(isYoutubeSmallMode);
					} catch (error) {
						console.error("Error in YouTube small mode listener:", error);
					}
				});
			}
		};

		playerObserver = new MutationObserver(checkPlayerState);

		playerObserver.observe(player, {
			attributes: true,
			attributeFilter: ["class"],
		});

		// Initial check
		checkPlayerState();
	} else {
		logger.warn("youtube", "Could not find player element for player observer");
	}
}

// Initial setup
setupPlayerObserver();
