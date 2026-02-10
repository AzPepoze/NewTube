import { getUserSetting } from "../../styleshift/core/storageManager";
import { registerSettingListener } from "../../styleshift/settings/functions";

async function updateLogoUrl() {
	const url = await getUserSetting("ReplaceYTURL");
	if (url) {
		document.documentElement.style.setProperty("--nt-top-icon-url", `url("${url}")`);
	}
}

// Init
updateLogoUrl();

// Listener
registerSettingListener("ReplaceYTURL", updateLogoUrl);
