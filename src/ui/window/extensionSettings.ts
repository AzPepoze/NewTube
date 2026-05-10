import { getBuiltInItems } from "@settings/registry/items";
import { createMainSettingsUi } from "../settings/settingsManager";

export let extensionSettingsUi: Awaited<ReturnType<typeof createMainSettingsUi>>;

export const extensionSettingsUiPromise = (async () => {
	extensionSettingsUi = await createMainSettingsUi({
		getCategory: getBuiltInItems as any,
	});
	return extensionSettingsUi;
})();
