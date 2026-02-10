import { check_and_show_welcome } from "./welcome";

/**
 * Main application bootstrap logic.
 * This is called by the StyleShift core after it has initialized.
 */
export async function app_bootstrap() {
	await check_and_show_welcome();
}
