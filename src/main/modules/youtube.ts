import { waitForElement } from "../../styleshift/buildInFunctions/normal";

export let ytdApp: HTMLElement | null = null;

export async function getYtdApp() {
	if (!ytdApp) {
		ytdApp = await waitForElement("ytd-app");
	}

	return ytdApp;
}
