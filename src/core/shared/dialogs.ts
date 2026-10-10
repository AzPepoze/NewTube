import { showAlert, showSelection, showUserConfirmation, showUserPrompt } from "@ui/window/windowFactory";

/**
 * Asks the user to confirm an action and waits for their answer.
 *
 * @param {string} ask - The question to show the user.
 * @param {string} title - The dialog title. Defaults to "Confirm Action".
 * @returns {Promise<boolean>} True if the user confirms, false if they cancel.
 *
 * @example
 * const confirmed = await showUserConfirmationPrompt("Delete this theme?", "Delete Theme");
 * if (confirmed) deleteTheme();
 * // result: true if the user confirmed
 */
export async function showUserConfirmationPrompt(ask: string, title: string = "Confirm Action") {
	return await showUserConfirmation(ask, title);
}

/**
 * Opens a multiline text box and returns what the user types.
 *
 * @param {object} options - Prompt settings: title (default "Enter text"), placeholder, content.
 * @returns {Promise<string>} The text the user entered.
 * @throws {Error} If the user cancels the prompt.
 *
 * @example
 * try {
 *   const notes = await enterTextPrompt({ title: "Theme notes" });
 *   // result: the text the user typed
 * } catch (error) {
 *   console.warn("Cancelled");
 * }
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
 * Opens a single-line text box and returns what the user types.
 *
 * @param {object} options - Prompt settings: title (default "Enter text"), placeholder, value.
 * @returns {Promise<string | null>} The entered text, or null if the user cancels.
 *
 * @example
 * const name = await enterPrompt({ title: "Profile Name", placeholder: "Enter name..." });
 * if (name) console.log(name);
 * // result: "Alex", or null if cancelled
 */
export async function enterPrompt({ title = "Enter text", placeholder = "", value = "" }) {
	return await showUserPrompt(title, placeholder, value);
}

export interface SelectionButton {
	label: string;
	color?: string;
	description?: string;
}

export interface SelectionOptions {
	message?: string;
	title?: string;
	buttons?: SelectionButton[];
	vertical?: boolean;
}

/**
 * Shows a list of buttons and waits for the user to pick one.
 *
 * @param {SelectionOptions} options - Selection settings: message, title, buttons, vertical.
 * @returns {Promise<string | null>} The label of the chosen button, or null if the user cancels.
 *
 * @example
 * const choice = await chooseSelection({ title: "Export Format", buttons: [{ label: "JSON" }] });
 * if (choice === "JSON") exportStyleShiftJsonText();
 * // result: "JSON", or null if cancelled
 */
export async function chooseSelection({
	message = "",
	title = "Select Option",
	buttons = [] as SelectionButton[],
	vertical = false,
}: SelectionOptions) {
	return await showSelection(message, title, buttons, { vertical });
}

/**
 * Shows a message with a single OK button and waits for the user to dismiss it.
 *
 * @param {object} options - Alert settings: message, title, okLabel (default "OK"), okColor.
 * @returns {Promise<void>}
 *
 * @example
 * await alertPrompt({ message: "Settings saved successfully!", title: "Success" });
 * // the call resolves when the user clicks OK
 */
export async function alertPrompt({ message = "", title = "Alert", okLabel = "OK", okColor = "#7f5db7" }) {
	return await showAlert(message, title, { okLabel, okColor });
}
