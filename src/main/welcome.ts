import { mount, unmount } from "svelte";
import Welcome from "./ui/Welcome.svelte";
import { getRootValue, saveRootValue } from "@core/storageManager";
import { showUserConfirmation } from "@ui/extension";

export async function checkAndShowWelcome() {
	const hasShown = await getRootValue("Welcome_Shown");

	if (!hasShown) {
		const hasTime = await showUserConfirmation(
			"Do you have a moment?",
			"Welcome to NewTube!",
			{
				confirmLabel: "Uh.. Yes?",
				cancelLabel: "Nope"
			}
		);

		if (!hasTime) {
			await saveRootValue("Welcome_Shown", true);
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
					await saveRootValue("Welcome_Shown", true);
					unmount(component);
					target.remove();
				}
			}
		});
	}
}
