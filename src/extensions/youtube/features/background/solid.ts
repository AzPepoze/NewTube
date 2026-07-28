import { createElement, ELEMENTS, getElement, hideElement, removeElement, showElement } from "./helpers";
import { type IModeHandler } from "./types";

class SolidBackgroundMode implements IModeHandler {
	private tintElement: HTMLElement | null = null;

	async enable(): Promise<void> {
		this.tintElement = await createElement(ELEMENTS.TINT);
		await this.show();
	}

	async disable(): Promise<void> {
		await this.hide();
		removeElement(this.tintElement);
		this.tintElement = null;
	}

	async show(): Promise<void> {
		this.tintElement = getElement(ELEMENTS.TINT);
		showElement(this.tintElement);
	}

	async hide(): Promise<void> {
		hideElement(this.tintElement);
	}
}

export const solidBackgroundMode = new SolidBackgroundMode();
