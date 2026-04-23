import {
	isYoutubeFullscreen,
	isYoutubeSmallMode,
	isYoutubeVideoPage,
	videoElement,
} from "../modules/youtube";

/**
 * Shared logic to determine if a video feature should be active/visible.
 * @param disableFullscreen Whether the feature should be disabled in fullscreen.
 * @param stick Whether the feature should stick/show even without a video source.
 * @returns boolean indicating if the feature should run.
 */
export function shouldFeatureShow(
	disableFullscreen: boolean,
	stick: boolean = false,
): boolean {
	if (!isYoutubeVideoPage && !stick) return false;
	const video = videoElement;
	if ((!video || !video.isConnected) && !stick) return false;
	if (video && !video.src && !stick) return false;
	if (isYoutubeSmallMode) return false;
	if (disableFullscreen && isYoutubeFullscreen) return false;
	return true;
}
