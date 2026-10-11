import { mount, unmount } from "svelte";

import { logger } from "@shared/logger";
import Icon from "@base/Icon.svelte";
import { settingsUi } from "@ui/settings/settingsApi";
import { globalNotificationContainer, playUiAnimation } from "@ui/window/windowFactory";

/**
 * Shows a short notification in the extension's UI to tell the user something.
 *
 * @param {object} options - Notification: icon, iconColor, title, content, timeout and variant.
 * @returns {Promise<object>} Handle: setIcon, setIconColor, setContent, setTitle, close.
 *
 * @example
 * const toast = await createNotification({ title: "Update", content: "Settings saved!" });
 * toast.setContent("Saved to your profile!");
 * toast.close();
 * // result: a handle to update or close the notification
 */
export async function createNotification({
	icon = null,
	iconColor = "",
	title = "StyleShift",
	content = "",
	timeout = 3000,
	variant = "info",
}) {
	logger.info("extension", title, content);

	const notificationFrame = await settingsUi.settingFrame(true, false, { x: false, y: true });
	notificationFrame.classList.add("styleshift-notification");
	if (variant !== "info") {
		notificationFrame.classList.add(`styleshift-notification-${variant}`);
	}
	setTimeout(() => globalNotificationContainer.append(notificationFrame), 1);

	let iconUi: any = null;
	const iconTarget = document.createElement("div");
	iconTarget.classList.add("styleshift-notification-icon");
	iconTarget.style.display = "none";
	notificationFrame.append(iconTarget);

	const updateIcon = (name: string | null, color: string = iconColor) => {
		if (iconUi) unmount(iconUi);
		iconUi = null;
		if (name) {
			iconTarget.style.display = "flex";
			iconUi = mount(Icon, { target: iconTarget, props: { name, size: 24, color } });
		} else {
			iconTarget.style.display = "none";
		}
	};
	if (icon) updateIcon(icon);

	const contentFrame = await settingsUi.settingFrame(false, true);
	contentFrame.classList.add("styleshift-notification-content-frame");
	notificationFrame.append(contentFrame);

	const titleUi = await settingsUi.settingFrame(true, false, { x: false, y: true });
	titleUi.classList.add("styleshift-notification-title");
	titleUi.textContent = title;
	contentFrame.append(titleUi);

	const contentUi = await settingsUi.settingFrame(true, false);
	contentUi.classList.add("styleshift-notification-content");
	contentUi.style.display = "block";
	contentFrame.append(contentUi);

	const setContent = (val: unknown) => {
		contentUi.textContent = String(val);
	};
	setContent(content);

	async function close() {
		await playUiAnimation(notificationFrame, "Notification-Hide");
		if (iconUi) unmount(iconUi);
		notificationFrame.remove();
	}

	if (timeout === 0) {
		const closeUi = await settingsUi.settingFrame(true, false, { x: true, y: true });
		closeUi.className += " styleshift-notification-close";
		closeUi.textContent = "✕";
		closeUi.onclick = close;
		notificationFrame.append(closeUi);
	}

	await playUiAnimation(notificationFrame, "Notification-Show");
	if (timeout > 0) setTimeout(close, timeout);

	return {
		setIcon: (newIcon: string) => updateIcon(newIcon),
		setIconColor: (newColor: string) => updateIcon(icon, newColor),
		setContent,
		setTitle: (newTitle: string) => {
			titleUi.textContent = newTitle;
		},
		close,
	};
}

/**
 * Shows a red error notification that closes itself after ten seconds.
 *
 * @param {any} content - The error or message to show. A thrown object uses its message.
 * @returns {Promise<object>} Handle: setIcon, setIconColor, setContent, setTitle, close.
 *
 * @example
 * try {
 *   await importStyleShiftJsonText(json);
 * } catch (error) {
 *   await createError(error);
 * }
 * // result: a red error toast that closes after ten seconds
 */
export async function createError(content: any) {
	return await createNotification({
		icon: "error",
		iconColor: "#f44336",
		title: "StyleShift Error",
		content: typeof content === "object" ? content.message : String(content),
		timeout: 10000,
		variant: "error",
	});
}

/**
 * Shows an orange warning notification that closes itself after five seconds.
 *
 * @param {string} content - The warning message to show.
 * @returns {Promise<object>} Handle: setIcon, setIconColor, setContent, setTitle, close.
 *
 * @example
 * await createWarning("This theme needs YouTube's dark mode.");
 * // result: an orange warning toast
 */
export async function createWarning(content: string) {
	return await createNotification({
		icon: "warning",
		iconColor: "#ff9800",
		title: "StyleShift Warning",
		content: content,
		timeout: 5000,
		variant: "warning",
	});
}

/**
 * Shows a green success notification that closes itself after three seconds.
 *
 * @param {string} content - The success message to show.
 * @returns {Promise<object>} Handle: setIcon, setIconColor, setContent, setTitle, close.
 *
 * @example
 * await createSuccess("Theme applied!");
 * // result: a green success toast
 */
export async function createSuccess(content: string) {
	return await createNotification({
		icon: "check_circle",
		iconColor: "#4caf50",
		title: "StyleShift",
		content: content,
		timeout: 3000,
		variant: "success",
	});
}
