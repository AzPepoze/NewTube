import { onYoutubeVideo } from "@extensions/youtube/modules/youtube";

const ENABLED_CLASS = "nt-detach-controls-16x9";

function setEnabled(enabled: boolean): void {
	document.documentElement.classList.toggle(ENABLED_CLASS, enabled);
}

export function setupDetachControlsAspectGuard(): void {
	setEnabled(false);
	onYoutubeVideo((video) => setEnabled(video.isSixteenByNine));
}
