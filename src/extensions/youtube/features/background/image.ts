import { getUserSetting } from "@core/storage/manager";
import { getYoutubeVideoId, onYoutubeNavigate } from "@extensions/youtube/modules/youtube";
import { registerSettingListener } from "@settings/engine/functions";
import { createElement, getElement, getElementIds, hideElement, removeElement, showElement } from "./helpers";
import { type IModeHandler } from "./types";

const { tint: bgTintId, image: bgImageId } = getElementIds();

class ImageBackgroundMode implements IModeHandler {
	private tintElement: HTMLElement | null = null;
	private imageElement: HTMLElement | null = null;
	private bgImage = new Image();
	private navigateCleanup: (() => void) | null = null;

	async enable(): Promise<void> {
		this.tintElement = await createElement(bgTintId);
		this.imageElement = await createElement(bgImageId);

		window.addEventListener("resize", () => this.updateSize());
		this.navigateCleanup = onYoutubeNavigate(() => this.updateImage());
		this.updateImage();

		await this.show();
	}

	async disable(): Promise<void> {
		window.removeEventListener("resize", () => this.updateSize());
		if (this.navigateCleanup) {
			this.navigateCleanup();
			this.navigateCleanup = null;
		}

		await this.hide();

		removeElement(this.tintElement);
		removeElement(this.imageElement);
		this.tintElement = null;
		this.imageElement = null;
	}

	async show(): Promise<void> {
		this.tintElement = getElement(bgTintId);
		this.imageElement = getElement(bgImageId);
		await showElement(this.tintElement);
		await showElement(this.imageElement);
	}

	async hide(): Promise<void> {
		await hideElement(this.tintElement);
		await hideElement(this.imageElement);
	}

	private async updateImage(): Promise<void> {
		const backgroundMode = await getUserSetting("BackgroundMode");
		if (backgroundMode === "Thumbnail") {
			const videoId = getYoutubeVideoId();
			if (videoId) {
				this.bgImage.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
				return;
			}
		}
		const url = await getUserSetting("BackgroundImageUrl");
		if (url) this.bgImage.src = url;
	}

	private async updateSize(): Promise<void> {
		const el = this.imageElement || getElement(bgImageId);
		if (!el) return;
		const bgBound = el.getBoundingClientRect();
		if (!bgBound.height || this.bgImage.width === 0) return;
		const imageBackgroundHeight = (this.bgImage.height / this.bgImage.width) * window.innerWidth;
		const zoomValue = (await getUserSetting("BackgroundImageSize")) || 100;

		if (imageBackgroundHeight < bgBound.height) {
			el.style.backgroundSize = `${(bgBound.height / imageBackgroundHeight) * zoomValue}%`;
		} else {
			el.style.backgroundSize = `${zoomValue}%`;
		}
	}

	private async updatePosition(): Promise<void> {
		const el = this.imageElement || getElement(bgImageId);
		if (!el) return;
		const x = await getUserSetting("BackgroundImagePositionX");
		const y = await getUserSetting("BackgroundImagePositionY");
		el.style.backgroundPositionX = x + "%";
		el.style.backgroundPositionY = y + "%";
	}

	registerListeners(): void {
		this.bgImage.onload = () => {
			const el = this.imageElement || getElement(bgImageId);
			if (el) el.style.backgroundImage = `url("${this.bgImage.src}")`;
			this.updateSize();
		};

		registerSettingListener("BackgroundImageUrl", () => this.updateImage(), true);
		registerSettingListener("BackgroundMode", () => this.updateImage(), true);
		registerSettingListener("BackgroundImageSize", () => this.updateSize(), true);
		registerSettingListener("BackgroundImagePositionX", () => this.updatePosition(), true);
		registerSettingListener("BackgroundImagePositionY", () => this.updatePosition(), true);
	}
}

export const imageBackgroundMode = new ImageBackgroundMode();
imageBackgroundMode.registerListeners();
