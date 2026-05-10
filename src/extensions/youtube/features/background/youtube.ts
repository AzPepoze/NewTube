import { sleep } from "@/core/shared/utilities";
import { waitForElement } from "@core/shared/domHelpers";
import { createError, createNotification } from "@core/shared/notifications";
import { getUserSetting, saveUserSetting } from "@core/storage/manager";
import { registerSettingListener, triggerSettingUpdate } from "@settings/engine/functions";
import { updateAllUiComponents } from "@ui/window/windowFactory";
import { createElement, ELEMENTS, getElement, hideElement, removeElement, showElement } from "./helpers";
import { type IModeHandler } from "./types";

export async function setCurrentVideoAsBackground() {
	const status = await createNotification({
		icon: "videocam",
		title: "Setting background",
		content: "Retrieving embed URL...",
		timeout: -1,
	});

	const closePopups = () => {
		(document.querySelector('[icon="close"]') as HTMLElement)?.click();
		(document.querySelector(".yt-sharing-embed-renderer #close-panel-icon") as HTMLElement)?.click();
	};

	try {
		const shareButton = (await waitForElement('[aria-label="Share"]')) as HTMLElement;
		if (!shareButton) throw new Error("Share button not found");
		shareButton.click();

		const embedButton = (await waitForElement('button[title="Embed"]')) as HTMLElement;
		if (!embedButton) throw new Error("Embed button not found");
		embedButton.click();

		let embedVideo = null;
		for (let i = 0; i < 50 && !embedVideo; i++) {
			embedVideo = Array.from(document.querySelectorAll("iframe.yt-sharing-embed-renderer")).find((el: any) =>
				el.src?.includes("embed/"),
			);
			if (!embedVideo) await sleep(100);
		}

		if (!embedVideo) throw new Error("Failed to retrieve embed URL");

		const cleanId = (embedVideo as HTMLIFrameElement).src
			.replace("https://www.youtube.com/embed/", "")
			.replace("https://www.youtube-nocookie.com/embed/", "");

		await saveUserSetting("YouTubeBackgroundVideoId", cleanId);
		triggerSettingUpdate("YouTubeBackgroundVideoId");
		updateAllUiComponents();

		status.setTitle("Background updated");
		status.setContent("Current video set as background.");
		await sleep(1000);
		status.close();
		closePopups();
	} catch (error) {
		closePopups();
		status.close();
		createError(`Failed to set background: ${error instanceof Error ? error.message : error}`);
	}
}

class YoutubeBackgroundMode implements IModeHandler {
	private youtubeElement: HTMLIFrameElement | null = null;

	async enable(): Promise<void> {
		this.youtubeElement = (await createElement(ELEMENTS.YOUTUBE)) as HTMLIFrameElement;
		await this.updateYoutube();
		await this.show();
	}

	async disable(): Promise<void> {
		await this.hide();
		removeElement(this.youtubeElement);
		this.youtubeElement = null;
	}

	async show(): Promise<void> {
		this.youtubeElement = (getElement(ELEMENTS.YOUTUBE) as HTMLIFrameElement) || this.youtubeElement;
		const opacity = (await getUserSetting("YouTubeBackgroundOpacity")) as number;
		showElement(this.youtubeElement, (opacity / 100).toString());
	}

	async hide(): Promise<void> {
		hideElement(this.youtubeElement);
	}

	private async updateYoutube(): Promise<void> {
		this.youtubeElement = (getElement(ELEMENTS.YOUTUBE) as HTMLIFrameElement) || this.youtubeElement;
		if (!this.youtubeElement) return;

		const videoId = (await getUserSetting("YouTubeBackgroundVideoId")) as string;
		if (!videoId?.trim()) {
			this.youtubeElement.src = "";
			return;
		}

		const muted = await getUserSetting("YouTubeBackgroundMuted");
		const controls = await getUserSetting("YouTubeBackgroundControls");
		const params = new URLSearchParams({
			autoplay: "1",
			controls: controls ? "1" : "0",
			mute: muted ? "1" : "0",
			loop: "1",
			playlist: videoId.split("?")[0],
		});

		this.youtubeElement.src = `https://www.youtube-nocookie.com/embed/${videoId.trim()}&${params.toString()}`;

		const opacity = (await getUserSetting("YouTubeBackgroundOpacity")) as number;
		const blur = (await getUserSetting("YouTubeBackgroundBlur")) as number;

		Object.assign(this.youtubeElement.style, {
			opacity: (opacity / 100).toString(),
			filter: `blur(${blur}px)`,
		});

		this.youtubeElement.title = "YouTube background player";
		this.youtubeElement.setAttribute(
			"sandbox",
			"allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation",
		);
		this.youtubeElement.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
		this.youtubeElement.setAttribute("allowfullscreen", "");
	}

	registerListeners(): void {
		const update = () => this.updateYoutube();
		registerSettingListener("YouTubeBackgroundVideoId", update, true);
		registerSettingListener("YouTubeBackgroundMuted", update, true);
		registerSettingListener("YouTubeBackgroundControls", update, true);

		registerSettingListener(
			"YouTubeBackgroundOpacity",
			async (val) => {
				if (this.youtubeElement) this.youtubeElement.style.opacity = ((val as number) / 100).toString();
			},
			true,
		);

		registerSettingListener(
			"YouTubeBackgroundBlur",
			async (val) => {
				if (this.youtubeElement) this.youtubeElement.style.filter = `blur(${val}px)`;
			},
			true,
		);
	}
}

export const youtubeBackgroundMode = new YoutubeBackgroundMode();
youtubeBackgroundMode.registerListeners();
