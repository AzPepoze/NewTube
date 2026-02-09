import { mount, unmount } from "svelte";
import Welcome from "./ui/Welcome.svelte";
import { get_root_value, save_root_value } from "@core/storage-manager";
import { show_user_confirmation } from "@ui/extension";

export async function check_and_show_welcome() {
	const has_shown = await get_root_value("Welcome_Shown");
	
	if (!has_shown) {
		const has_time = await show_user_confirmation(
			"Do you have a moment?",
			"Welcome to NewTube!",
			{
				confirmLabel: "Uh.. Yes?",
				cancelLabel: "Nope"
			}
		);

		if (!has_time) {
			await save_root_value("Welcome_Shown", true);
			return;
		}

		const target = document.createElement("div");
		target.id = "NewTube-Welcome-Root";
		document.body.appendChild(target);

		const component = mount(Welcome, {
			target,
			intro: true,
			props: {
				onDone: async () => {
					await save_root_value("Welcome_Shown", true);
					unmount(component);
					target.remove();
				}
			}
		});
	}
}
