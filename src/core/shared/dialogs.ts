import {
	showAlert, showSelection, showUserConfirmation, showUserPrompt
} from '@ui/window/windowFactory';

/**
 * Shows a custom confirmation dialog.
 */
export async function showUserConfirmationPrompt(ask: string, title: string = "Confirm Action") {
	return await showUserConfirmation(ask, title);
}

/**
 * shows a text input prompt window.
 */
export async function enterTextPrompt({ title = "Enter text", placeholder = "", content = "" }) {
	const result = await showUserPrompt(title, placeholder, "", {
		content: content,
		multiline: true,
	});

	if (result === null) {
		throw new Error("Canceled by the user");
	}

	return result;
}

/**
 * shows a stylish text input prompt modal.
 */
export async function enterPrompt({ title = "Enter text", placeholder = "", value = "" }) {
	return await showUserPrompt(title, placeholder, value);
}

/**
 * shows a stylish selection modal with multiple options.
 */
export async function chooseSelection({
	message = "",
	title = "Select Option",
	buttons = [],
	vertical = false,
}) {
	return await showSelection(message, title, buttons, { vertical });
}

/**
 * Shows a stylish alert dialog with a message.
 */
export async function alertPrompt({ message = "", title = "Alert", okLabel = "OK", okColor = "#7f5db7" }) {
	return await showAlert(message, title, { okLabel, okColor });
}
