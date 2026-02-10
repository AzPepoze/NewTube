import { checkAndShowWelcome } from "./welcome";

/**
 * Main application bootstrap logic.
 * This is called by the StyleShift core after it has initialized.
 */
export async function appBootstrap() {
	await checkAndShowWelcome();
}
