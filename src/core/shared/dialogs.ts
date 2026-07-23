import { showAlert, showSelection, showUserConfirmation, showUserPrompt } from "@ui/window/windowFactory";

/**
 * Shows a custom confirmation dialog to the user.
 *
 * @param {string} ask - The question or message to display.
 * @param {string} [title="Confirm Action"] - The title of the dialog.
 * @returns {Promise<boolean>} A promise that resolves to true if confirmed, false otherwise.
 *
 * @example
 * const confirmed = await showUserConfirmationPrompt("Are you sure you want to delete this?");
 * if (confirmed) { // Proceed with deletion }
 */
export async function showUserConfirmationPrompt(ask: string, title: string = "Confirm Action") {
	return await showUserConfirmation(ask, title);
}

/**
 * Shows a text input prompt window, supporting multiline input.
 *
 * @param {Object} options - The prompt options.
 * @param {string} [options.title="Enter text"] - The title of the prompt window.
 * @param {string} [options.placeholder=""] - The placeholder text for the input.
 * @param {string} [options.content=""] - The initial content/value of the input.
 * @returns {Promise<string>} A promise that resolves to the entered text.
 * @throws {Error} If the user cancels the prompt.
 *
 * @example
 * try {
 *   const text = await enterTextPrompt({ title: "Feedback", placeholder: "Type here..." });
 *   console.log("User input:", text);
 * } catch (e) {
 *   console.error(e.message); // "Canceled by the user"
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
 * Shows a stylish single-line text input prompt modal.
 *
 * @param {Object} options - The prompt options.
 * @param {string} [options.title="Enter text"] - The title of the prompt.
 * @param {string} [options.placeholder=""] - The placeholder text.
 * @param {string} [options.value=""] - The initial value.
 * @returns {Promise<string | null>} A promise that resolves to the text or null if canceled.
 *
 * @example
 * const name = await enterPrompt({ title: "Profile Name", placeholder: "Enter name..." });
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
 * Shows a stylish selection modal with multiple options/buttons.
 *
 * @param {SelectionOptions} options - The selection options.
 * @returns {Promise<number | null>} A promise that resolves to the index of the selected button or null if canceled.
 *
 * @example
 * const choice = await chooseSelection({
 *   title: "Export Format",
 *   buttons: [{ label: "JSON" }, { label: "ZIP" }]
 * });
 * if (choice === 0) { // Export as JSON }
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
 * Shows a stylish alert dialog with an OK button.
 *
 * @param {Object} options - The alert options.
 * @param {string} [options.message=""] - The alert message.
 * @param {string} [options.title="Alert"] - The title of the alert.
 * @param {string} [options.okLabel="OK"] - The label for the OK button.
 * @param {string} [options.okColor="#7f5db7"] - The color for the OK button.
 * @returns {Promise<void>}
 *
 * @example
 * await alertPrompt({ message: "Settings saved successfully!", title: "Success" });
 */
export async function alertPrompt({ message = "", title = "Alert", okLabel = "OK", okColor = "#7f5db7" }) {
	return await showAlert(message, title, { okLabel, okColor });
}
