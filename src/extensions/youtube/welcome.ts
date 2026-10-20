import { getRootValue, saveRootValue } from "@core/storage/manager";
import { openTutorialOverlay } from "@ui/tutorial/tutorialService";
import { showUserConfirmation } from "@ui/window/windowFactory";
import { mount, unmount } from "svelte";
import Welcome from "./views/Welcome.svelte";

let welcomeOpen = false;

/** Closes every open StyleShift window through its own close button, so each one cleans up. */
function closeAllWindows(): void {
	document
		.querySelectorAll<HTMLElement>(".styleshift-window-container .control-btn.close")
		.forEach((closeButton) => closeButton.click());
}

function mountWelcome(onDone?: () => void | Promise<void>): void {
	if (welcomeOpen) return;

	closeAllWindows();
	welcomeOpen = true;
	const target = document.createElement("div");
	target.id = "StyleShift-Welcome-Root";
	document.body.appendChild(target);

	let component: ReturnType<typeof mount>;
	component = mount(Welcome, {
		target,
		intro: true,
		props: {
			onDone: async () => {
				try {
					await onDone?.();
				} finally {
					unmount(component);
					target.remove();
					welcomeOpen = false;
				}
			},
		},
	});
}

export function showWelcome(): void {
	mountWelcome();
}

export async function checkAndShowWelcome(): Promise<void> {
	const hasShown = await getRootValue("welcomeShown");

	if (!hasShown) {
		const hasTime = await showUserConfirmation("Do you have a moment?", "Welcome to NewTube!", {
			confirmLabel: "Uh.. Yes?",
			cancelLabel: "Nope",
		});
		await saveRootValue("welcomeShown", true);

		if (hasTime) {
			mountWelcome(() => openTutorialOverlay());
		} else {
			// "Nope" skips the welcome pages but still offers the tutorial.
			await openTutorialOverlay();
		}
	}
}
