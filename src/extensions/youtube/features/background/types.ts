export type BackgroundMode = "Image" | "Thumbnail" | "YouTube";

export interface BackgroundState {
	tintElement: HTMLElement | null;
	imageElement: HTMLElement | null;
	youtubeElement: HTMLElement | null;
	hiddenByVideo: boolean;
	navigateCleanup: (() => void) | null;
	activeMode: BackgroundMode | null;
}

export interface IModeHandler {
	enable(): Promise<void>;
	disable(): Promise<void>;
	show(): Promise<void>;
	hide(): Promise<void>;
}
