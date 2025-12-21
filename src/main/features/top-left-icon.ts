import { load_setting } from "../../styleshift/core/save";
import { on_setting_update } from "../../styleshift/settings/functions";

async function update_logo_url() {
	const url = await load_setting("ReplaceYTURL");
	if (url) {
		document.documentElement.style.setProperty("--top-icon-url", `url("${url}")`);
	}
}

// Init
update_logo_url();

// Listener
on_setting_update("ReplaceYTURL", update_logo_url);
