import { getRootValue, saveRootValue } from "@core/storage/manager";
import { showUserConfirmation } from "@ui/window/windowFactory";
import { mount, unmount } from "svelte";
import Welcome from "./ui/Welcome.svelte";

export async function checkAndShowWelcome() {
	const hasShown = await getRootValue("welcomeShown");

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
			await saveRootValue("welcomeShown", true);
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
					await saveRootValue("welcomeShown", true);
					unmount(component);
					target.remove();
				}
			}
		});
	}
}
