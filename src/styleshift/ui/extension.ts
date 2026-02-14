import { getDocumentBody, getDocumentHead, sleep } from "../shared/normal";
import { initializeDeveloperEnvironment, isDevModulesLoaded } from "../core/runtimeController";
import { getRootValue } from "../core/storageManager";
import { removeConfigUi } from "./config";
import { editorUi } from "./editor";
import { extensionSettingsUi } from "./extensionSettings";
import { settingsUi } from "./settings/settingComponents";
import { applyThemeToElement } from "./theme";
import { logger } from "../../shared/logger";
import { unmount } from "svelte";

/**
 * Creates and appends the main StyleShift window to the document.
 */
export async function createStyleshiftWindow({
	width = "50%",
	height = "80%",
	skipAnimation = false,
	title = "StyleShift",
	fullscreen = false,
}) {
	// Ensure developer tools are ready if mode is enabled
	if (await getRootValue("Developer_mode")) {
		await initializeDeveloperEnvironment();
	}

	logger.info("ui", "Initializing main window");

	await getDocumentHead();
	const overlayFrame = settingsUi.fillScreen(fullscreen);
	if (!fullscreen) {
		overlayFrame.style.pointerEvents = "none"; // Let window handle events
	}

	const mountPoint = document.createElement("div");
	overlayFrame.appendChild(mountPoint);

	let windowInstance: any;

	const closeWindowHandler = async () => {
		if (windowInstance) {
			await triggerWindowHideAnimation(windowContainer);
			await sleep(300);
			unmount(windowInstance);
		}
		overlayFrame.remove();
	};

	windowInstance = settingsUi.renderWindow(
		{
			title,
			width,
			height,
			fullscreen,
			onClose: closeWindowHandler,
			children: (_target: HTMLElement) => {
				return "";
			},
		},
		mountPoint,
	);

	const windowContainer = mountPoint.querySelector(".STYLESHIFT-Window-Container") as HTMLElement;
	await applyThemeToElement(windowContainer);
	const contentElement = windowContainer.querySelector(".STYLESHIFT-Window-Content") as HTMLElement;
	const topbar = windowContainer.querySelector(".STYLESHIFT-Window-Topbar") as HTMLElement | null;
	const closeButton = windowContainer.querySelector(".control-btn.close") as HTMLElement | null;

	requestAnimationFrame(async () => {
		(await getDocumentBody()).appendChild(overlayFrame);
		if (!skipAnimation && !fullscreen) {
			triggerWindowShowAnimation(windowContainer);
		} else {
			windowContainer.style.opacity = "1";
			windowContainer.style.transform = "scale(1)";
		}
	});

	return {
		overlayFrame,
		windowElement: windowContainer,
		contentElement,
		topbar,
		dragHandle: topbar,
		closeButton,
		closeWindowHandler,
	};
}

export let globalNotificationContainer: HTMLElement;

/**
 * Self-initializing notification layer.
 */
(async () => {
	await getDocumentHead();
	const notificationOverlay = settingsUi.fillScreen(false);
	notificationOverlay.classList.add("STYLESHIFT-Main");
	await applyThemeToElement(notificationOverlay);

	setTimeout(async () => {
		(await getDocumentBody()).append(notificationOverlay);
	}, 1);

	globalNotificationContainer = document.createElement("div");
	globalNotificationContainer.className = "STYLESHIFT-Notification-Container";
	notificationOverlay.append(globalNotificationContainer);

	const taskbarMountPoint = document.createElement("div");
	notificationOverlay.append(taskbarMountPoint);
	settingsUi.renderTaskbar(taskbarMountPoint);
})();

export const DEFAULT_ANIMATION_DURATION_MS = 250;

/**
 * Plays a CSS animation on a target element and waits for it to complete.
 */
export async function playUiAnimation(target: HTMLElement, animationName: string): Promise<void> {
	if (animationName.includes("Show")) {
		target.style.opacity = "0";
		target.style.transform = "scale(0.95)";
		await sleep(10); // Give browser time to register initial state
	}

	target.style.animation = `STYLESHIFT-${animationName} ${DEFAULT_ANIMATION_DURATION_MS / 1000}s forwards`;

	await sleep(DEFAULT_ANIMATION_DURATION_MS);

	// Cleanup to let transitions take over
	if (animationName.includes("Show")) {
		target.style.opacity = "1";
		target.style.transform = "scale(1)";
		target.style.animation = "";
	}
}

export async function triggerWindowShowAnimation(target: HTMLElement): Promise<void> {
	await playUiAnimation(target, "Show-Pop-Animation");
}

export async function triggerWindowHideAnimation(target: HTMLElement): Promise<void> {
	await playUiAnimation(target, "Hide-Pop-Animation");
}

/**
 * Displays a confirmation dialog to the user.
 */
export async function showUserConfirmation(
	message: string,
	title: string = "Confirm Action",
	options: {
		confirmLabel?: string;
		cancelLabel?: string;
		confirmColor?: string;
		cancelColor?: string;
		align?: "left" | "center" | "right";
	} = {},
): Promise<boolean> {
	return new Promise((resolve) => {
		const mountPoint = document.createElement("div");
		document.body.appendChild(mountPoint);

		const component = settingsUi.confirm(
			{
				title,
				message,
				align: options.align || "center",
				buttons: [
					{
						label: options.confirmLabel || "Confirm",
						color: options.confirmColor || "#4caf50",
						onClick: () => handleResolve(true),
					},
					{
						label: options.cancelLabel || "Cancel",
						color: options.cancelColor || "#f44336",
						onClick: () => handleResolve(false),
					},
				],
				onClose: () => handleResolve(false),
			},
			mountPoint,
		);

		function handleResolve(val: boolean) {
			resolve(val);
			setTimeout(() => {
				unmount(component);
				mountPoint.remove();
			}, 400);
		}
	});
}

/**
 * Re-renders all visible UI components to reflect state changes.
 */
export async function updateAllUiComponents(): Promise<void> {
	logger.info("ui", "Refreshing all UI components...");

	const isDevMode = await getRootValue("Developer_mode");

	if (isDevMode && !isDevModulesLoaded) {
		logger.info("ui", "Initializing developer environment...");
		await initializeDeveloperEnvironment();
	}

	if (extensionSettingsUi) extensionSettingsUi.recreateUi();
	if (editorUi) editorUi.recreateUi();

	if (!isDevMode) {
		removeConfigUi();
	}
}
