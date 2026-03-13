import { getAllStyleshiftItems } from "../settings/items";
import { createMainSettingsUi } from "./settings/settings";

export let extensionSettingsUi: Awaited<ReturnType<typeof createMainSettingsUi>>;

export const extensionSettingsUiPromise = (async () => {
	extensionSettingsUi = await createMainSettingsUi({
		getCategory: getAllStyleshiftItems as any,
	});
	return extensionSettingsUi;
})();
