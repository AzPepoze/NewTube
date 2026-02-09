import { get_user_setting } from "../../styleshift/core/storage-manager";
import { register_setting_listener } from "../../styleshift/settings/functions";

async function update_logo_url() {
	const url = await get_user_setting("ReplaceYTURL");
	if (url) {
		document.documentElement.style.setProperty("--nt-top-icon-url", `url("${url}")`);
	}
}

// Init
update_logo_url();

// Listener
register_setting_listener("ReplaceYTURL", update_logo_url);
