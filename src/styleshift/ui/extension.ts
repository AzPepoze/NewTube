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
import { waitOneFrame } from "../shared/advance";

/**
 * Creates and appends the main StyleShift window to the document.
 */
export async function createStyleshiftWindow({
	width = "50%",
	height = "80%",
	skipAnimation = false,
	title = "StyleShift",
	fullscreen = false,
	center = false,
	onWindowClosed = null as (() => void) | null,
}) {
	// Ensure developer tools are ready if mode is enabled
	if (await getRootValue("developerMode")) {
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
		if (onWindowClosed) {
			onWindowClosed();
		}
	};

	windowInstance = settingsUi.renderWindow(
		{
			title,
			width,
			height,
			fullscreen,
			center,
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
	notificationOverlay.style.zIndex = "20000";
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

export async function playUiAnimation(target: HTMLElement, animationName: string): Promise<void> {
	if (animationName.includes("Show")) {
		target.style.opacity = "0";
		target.style.transform = "scale(0.95)";
		await waitOneFrame();
	}

	target.style.animation = `STYLESHIFT-${animationName} ${DEFAULT_ANIMATION_DURATION_MS / 1000}s forwards`;

	await sleep(DEFAULT_ANIMATION_DURATION_MS);

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
 * Displays a selection dialog with multiple buttons.
 * @returns {Promise<string | null>} The label of the clicked button or null if cancelled.
 */
export async function showSelection(
	message: string,
	title: string = "Select Option",
	buttons: { label: string; color?: string }[] = [],
	options: { align?: "left" | "center" | "right"; vertical?: boolean } = {},
): Promise<string | null> {
	return new Promise((resolve) => {
		const mountPoint = document.createElement("div");
		document.body.appendChild(mountPoint);

		const component = settingsUi.confirm(
			{
				title,
				message,
				align: options.align || "center",
				vertical: options.vertical || false,
				buttons: buttons.map((btn) => ({
					label: btn.label,
					color: btn.color || "#7f5db7",
					onClick: () => handleResolve(btn.label),
				})),
				onClose: () => handleResolve(null),
			},
			mountPoint,
		);

		function handleResolve(val: string | null) {
			resolve(val);
			setTimeout(() => {
				unmount(component);
				mountPoint.remove();
			}, 400);
		}
	});
}

/**
 * Displays a prompt dialog with an input field to the user.
 */
export async function showUserPrompt(
	title: string = "Enter Text",
	placeholder: string = "Type here...",
	value: string = "",
	options: { content?: string; multiline?: boolean } = {},
): Promise<string | null> {
	return new Promise((resolve) => {
		const mountPoint = document.createElement("div");
		document.body.appendChild(mountPoint);

		const component = settingsUi.prompt(
			{
				title,
				placeholder,
				value,
				content: options.content || "",
				multiline: options.multiline || false,
				onConfirm: (val: string) => handleResolve(val),
				onCancel: () => handleResolve(null),
			},
			mountPoint,
		);

		function handleResolve(val: string | null) {
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

	const isDevMode = await getRootValue("developerMode");

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

/**
 * Displays an alert dialog with a message and OK button.
 */
export async function showAlert(
	message: string,
	title: string = "Alert",
	options: { okLabel?: string; okColor?: string; align?: "left" | "center" | "right" } = {},
): Promise<void> {
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
						label: options.okLabel || "OK",
						color: options.okColor || "var(--Theme-0)",
						onClick: () => handleResolve(),
					},
				],
				onClose: () => handleResolve(),
			},
			mountPoint,
		);

		function handleResolve() {
			resolve();
			setTimeout(() => {
				unmount(component);
				mountPoint.remove();
			}, 400);
		}
	});
}
