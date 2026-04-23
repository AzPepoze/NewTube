import { settingsUi } from "@ui/settings/settingsApi";
import { createStyleShiftWindow } from "@ui/window/windowFactory";
import { unmount } from "svelte";

export let configWindow: Awaited<ReturnType<typeof createStyleShiftWindow>>;
let svelteInstance;
let currentContentFunction;

export async function createConfigUi(skipAnimation = false) {
	configWindow = await createStyleShiftWindow({
		width: "60%",
		height: "85%",
		skipAnimation,
		title: "Config Editor"
	});

	configWindow.closeButton.addEventListener(
		"click",
		function () {
			removeConfigUi();
		},
		{ once: true },
	);

	return configWindow;
}

export async function showConfigUi(innerContentFunction: Function) {
	if (!configWindow) {
		await createConfigUi();
	}
	currentContentFunction = innerContentFunction;
	recreateConfigUi();
}

export async function recreateConfigUi() {
	if (!configWindow) return;

	if (svelteInstance) {
		unmount(svelteInstance);
	}

	svelteInstance = settingsUi.configWindow(
		{
			innerContentFunction: currentContentFunction,
			onClose: () => removeConfigUi(),
		},
		configWindow.contentElement,
	);
}

export function removeConfigUi(skipAnimation = false) {
	if (configWindow) {
		const targetWindow = configWindow;
		const targetInstance = svelteInstance;

		// Clear state before acting to prevent recursion
		configWindow = null;
		svelteInstance = null;
		currentContentFunction = null;

		if (targetInstance) {
			unmount(targetInstance);
		}

		if (skipAnimation) {
			targetWindow.overlayFrame.remove();
		} else {
			targetWindow.closeButton.click();
		}
	}
}
