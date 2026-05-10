import { sleep } from "@/core/shared/utilities";
import { logger } from "@/shared/logger";
import { waitForElement } from "@core/shared/domHelpers";
import { createError, createNotification } from "@core/shared/notifications";
import { getUserSetting, saveUserSetting } from "@core/storage/manager";
import { registerSettingListener, triggerSettingUpdate } from "@settings/engine/functions";
import { updateAllUiComponents } from "@ui/window/windowFactory";
import { createElement, getElement, getElementIds, hideElement, removeElement, showElement } from "./helpers";
import { type IModeHandler } from "./types";

export async function setCurrentVideoAsBackground() {
	const status = await createNotification({
		icon: "videocam",
		title: "Setting current video as background",
		content: "Attempting to retrieve embed URL from current video...",
		timeout: -1,
	});

	function closeAllPopups() {
		const shareCloseBtn = document.querySelector('[icon="close"]') as HTMLElement;
		shareCloseBtn?.click();

		const embedCloseBtn = document.querySelector(".yt-sharing-embed-renderer #close-panel-icon") as HTMLElement;
		embedCloseBtn?.click();
	}

	try {
		const shareButton = (await waitForElement('[aria-label="Share"]')) as HTMLElement;
		if (!shareButton) {
			throw new Error("Share button not found");
		}
		shareButton.click();

		const embedButton = (await waitForElement('button[title="Embed"]')) as HTMLElement;
		if (!embedButton) {
			throw new Error("Embed button not found");
		}
		embedButton.click();

		let embedVideo = null;
		let retries = 0;
		while (!embedVideo && retries < 50) {
			embedVideo = Array.from(document.querySelectorAll("iframe.yt-sharing-embed-renderer")).find(
				(el: any) => el.src?.includes("youtube-nocookie.com/embed/") || el.src?.includes("youtube.com/embed/"),
			);

			if (!embedVideo) {
				status.setTitle("Waiting for embed code...");
				status.setContent(
					"Still trying to retrieve the embed code from the share menu. This can take a few seconds, especially on slower connections. Please wait...",
				);
				await new Promise((r) => setTimeout(r, 100));
				retries++;
			}
		}

		if (embedVideo) {
			const embedUrl: string = embedVideo.src;
			const cleanEmbedUrl = embedUrl
				.replace("https://www.youtube.com/embed/", "")
				.replace("https://www.youtube-nocookie.com/embed/", "");
			await saveUserSetting("YouTubeBackgroundVideoId", cleanEmbedUrl);
			triggerSettingUpdate("YouTubeBackgroundVideoId");
			updateAllUiComponents();
			status.setTitle("Background updated");
			status.setContent("The current video has been set as your background.");
			await sleep(1000);
			status.close();
		} else {
			throw new Error("Failed to retrieve embed URL from the share menu.");
		}

		closeAllPopups();
	} catch (error) {
		closeAllPopups();
		status.close();
		createError(
			"Failed to set current video as background.\n\n" + (error instanceof Error ? error.message : String(error)),
		);
	}
}

const { youtube: bgYoutubeId } = getElementIds();

class YoutubeBackgroundMode implements IModeHandler {
	private youtubeElement: HTMLIFrameElement | null = null;

	async enable(): Promise<void> {
		const element = await createElement(bgYoutubeId);
		this.youtubeElement = element as HTMLIFrameElement;
		await this.updateYoutube();
		await this.show();
	}

	async disable(): Promise<void> {
		await this.hide();
		removeElement(this.youtubeElement);
		this.youtubeElement = null;
	}

	async show(): Promise<void> {
		this.youtubeElement = (getElement(bgYoutubeId) as HTMLIFrameElement) || this.youtubeElement;
		const opacity = (await getUserSetting("YouTubeBackgroundOpacity")) as number;
		await showElement(this.youtubeElement, (opacity / 100).toString());
	}

	async hide(): Promise<void> {
		await hideElement(this.youtubeElement);
	}

	private async updateYoutube(): Promise<void> {
		if (!this.youtubeElement) {
			this.youtubeElement = getElement(bgYoutubeId) as HTMLIFrameElement;
		}
		if (!this.youtubeElement) return;

		const videoIdOrUrl = await getUserSetting("YouTubeBackgroundVideoId");
		const isMuted = await getUserSetting("YouTubeBackgroundMuted");
		const showControls = await getUserSetting("YouTubeBackgroundControls");

		if (!videoIdOrUrl || typeof videoIdOrUrl !== "string" || videoIdOrUrl.trim() === "") {
			logger.warn("YouTube background: No video ID or URL provided");
			this.youtubeElement.src = "";
			return;
		}

		const cleanInput = videoIdOrUrl.trim();
		let embedUrl: string;
		const videoId = cleanInput.split("?")[0];

		embedUrl = `https://www.youtube-nocookie.com/embed/${cleanInput}&${await this.buildParams(videoId, isMuted, showControls)}`;

		this.youtubeElement.src = embedUrl;
		const opacity = (await getUserSetting("YouTubeBackgroundOpacity")) as number;
		const blur = (await getUserSetting("YouTubeBackgroundBlur")) as number;
		this.youtubeElement.style.opacity = (opacity / 100).toString();
		this.youtubeElement.style.filter = `blur(${blur}px)`;
		this.youtubeElement.title = "YouTube video player";
		this.youtubeElement.setAttribute(
			"sandbox",
			"allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation",
		);
		this.youtubeElement.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
		this.youtubeElement.setAttribute("allowfullscreen", "");

		logger.info("YouTube background updated", { url: embedUrl });
	}

	private async buildParams(videoId: string, muted: boolean, showControls: boolean): Promise<string> {
		const params = new URLSearchParams({
			autoplay: "1",
			controls: showControls ? "1" : "0",
			mute: muted ? "1" : "0",
			loop: "1",
			playlist: videoId,
		});

		return params.toString();
	}

	registerListeners(): void {
		registerSettingListener("YouTubeBackgroundVideoId", () => this.updateYoutube(), true);
		registerSettingListener("YouTubeBackgroundMuted", () => this.updateYoutube(), true);
		registerSettingListener("YouTubeBackgroundControls", () => this.updateYoutube(), true);
		registerSettingListener(
			"YouTubeBackgroundOpacity",
			async () => {
				const opacity = await getUserSetting("YouTubeBackgroundOpacity");
				if (this.youtubeElement) {
					this.youtubeElement.style.opacity = ((opacity as number) / 100).toString();
				}
			},
			true,
		);
		registerSettingListener(
			"YouTubeBackgroundBlur",
			async () => {
				const blur = await getUserSetting("YouTubeBackgroundBlur");
				if (this.youtubeElement) {
					this.youtubeElement.style.filter = `blur(${blur}px)`;
				}
			},
			true,
		);
	}
}

export const youtubeBackgroundMode = new YoutubeBackgroundMode();
youtubeBackgroundMode.registerListeners();
