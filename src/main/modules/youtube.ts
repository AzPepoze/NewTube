import { waitForElement } from "../../styleshift/shared/normal";

export let ytdApp: HTMLElement | null = null;

export async function getYtdApp() {
	if (!ytdApp) {
		ytdApp = await waitForElement("ytd-app");
	}

	return ytdApp;
}
