import { mount, unmount } from 'svelte';

import { logger } from '@shared/logger';
import Icon from '@ui/settings/components/primitives/Icon.svelte';
import { settingsUi } from '@ui/settings/settingsApi';
import { globalNotificationContainer, playUiAnimation } from '@ui/window/windowFactory';

import { sleep } from './utilities';

/**
 * Creates and displays a stylish notification in the extension's UI.
 * 
 * @param {Object} options - The notification options.
 * @param {string | null} [options.icon=null] - The name of the material icon to display.
 * @param {string} [options.iconColor=""] - The CSS color for the icon.
 * @param {string} [options.title="StyleShift"] - The title of the notification.
 * @param {string} [options.content=""] - The HTML content of the notification.
 * @param {number} [options.timeout=3000] - Duration in ms before auto-closing (0 for manual close, -1 for persistent).
 * @returns {Promise<Object>} An object containing methods to control the notification (setIcon, setIconColor, setContent, setTitle, close).
 * 
 * @example
 * const notification = await createNotification({ title: "Update", content: "Settings saved!" });
 * // Later...
 * notification.close();
 */
export async function createNotification({ icon = null, iconColor = "", title = "StyleShift", content = "", timeout = 3000 }) {
	logger.info("extension", title, content);

	const notificationFrame = await settingsUi.settingFrame(true, false, {
		x: false,
		y: true,
	});

	notificationFrame.classList.add("STYLESHIFT-Notification");
	setTimeout(() => {
		globalNotificationContainer.append(notificationFrame);
	}, 1);

	let iconUi: any = null;
	const iconTarget = document.createElement("div");
	iconTarget.classList.add("STYLESHIFT-Notification-Icon");
	iconTarget.style.display = "none";
	notificationFrame.append(iconTarget);

	let currentIconColor = iconColor;

	const updateIcon = (name: string | null, color: string = currentIconColor) => {
		currentIconColor = color;
		if (iconUi) {
			unmount(iconUi);
			iconUi = null;
		}

		if (name) {
			iconTarget.style.display = "flex";
			iconUi = mount(Icon, {
				target: iconTarget,
				props: {
					name,
					size: 24,
					color,
				},
			});
		} else {
			iconTarget.style.display = "none";
		}
	};

	if (icon) {
		updateIcon(icon);
	}

	const notificationContentFrame = await settingsUi.settingFrame(false, true);
	notificationContentFrame.classList.add("STYLESHIFT-Notification-Content-Frame");
	notificationFrame.append(notificationContentFrame);

	const titleUi = await settingsUi.settingFrame(true, false, {
		x: false,
		y: true,
	});
	titleUi.classList.add("STYLESHIFT-Notification-Title");
	titleUi.textContent = title;
	notificationContentFrame.append(titleUi);

	const contentUi = await settingsUi.settingFrame(true, false);
	contentUi.classList.add("STYLESHIFT-Notification-Content");
	contentUi.style.display = "block";
	notificationContentFrame.append(contentUi);

	const setContent = (newContent: any) => {
		newContent = String(newContent);
		contentUi.innerHTML = newContent.replaceAll("<script", "").replaceAll("/script>", "");
	};

	setContent(content);

	async function close() {
		await playUiAnimation(notificationFrame, "Notification-Hide");
		if (iconUi) {
			unmount(iconUi);
		}
		notificationFrame.remove();
	}

	if (timeout == 0) {
		const closeUi = await settingsUi.settingFrame(true, false, {
			x: true,
			y: true,
		});
		closeUi.className += " STYLESHIFT-Notification-Close";
		closeUi.textContent = "X";
		notificationFrame.append(closeUi);

		closeUi.addEventListener("click", function (e) {
			e.preventDefault();
			close();
		});
	}

	await playUiAnimation(notificationFrame, "Notification-Show");
	setTimeout(async () => {
		if (timeout > 0) {
			await sleep(timeout);
			close();
		}
	}, 0);

	return {
		setIcon: (newIcon: string) => {
			updateIcon(newIcon, currentIconColor);
		},
		setIconColor: (newColor: string) => {
			updateIcon(icon, newColor);
		},
		setContent,
		setTitle: (newTitle: string) => {
			titleUi.textContent = newTitle;
		},
		close,
	};
}

/**
 * Creates and displays an error notification.
 * 
 * @param {any} content - The error message or error object to display.
 * @returns {Promise<Object>} The notification controller object.
 * 
 * @example
 * try {
 *   // ...
 * } catch (e) {
 *   await createError(e);
 * }
 */
export async function createError(content: any) {
	return await createNotification({
		icon: "error",
		iconColor: "#f44336",
		title: "StyleShift Error",
		content: typeof content === "object" ? content.message : String(content),
		timeout: 10000,
	});
}

/**
 * Creates and displays a warning notification.
 * 
 * @param {string} content - The warning message to display.
 * @returns {Promise<Object>} The notification controller object.
 * 
 * @example
 * await createWarning("Unsupported feature detected.");
 */
export async function createWarning(content: string) {
	return await createNotification({
		icon: "warning",
		iconColor: "#ff9800",
		title: "StyleShift Warning",
		content: content,
		timeout: 5000,
	});
}

/**
 * Creates and displays a success notification.
 * 
 * @param {string} content - The success message to display.
 * @returns {Promise<Object>} The notification controller object.
 * 
 * @example
 * await createSuccess("Changes applied successfully!");
 */
export async function createSuccess(content: string) {
	return await createNotification({
		icon: "check_circle",
		iconColor: "#4caf50",
		title: "StyleShift",
		content: content,
		timeout: 3000,
	});
}
