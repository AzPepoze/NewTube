export function setup_auto_theater() {
	const check_theater = () => {
		const theater_button = document.querySelector("button.ytp-size-button") as HTMLElement;
		// Check if the button for entering theater mode exists and is not already in theater mode
		if (theater_button && !document.querySelector("ytd-watch-flexy[theater]")) {
			theater_button.click();
		}
	};
	// run after a delay to ensure the page is loaded
	setTimeout(check_theater, 2000);
	// Re-run when navigating to a new video
	window.addEventListener("yt-navigate-finish", () => setTimeout(check_theater, 1000));
}

export function setup_remove_ambient() {
	const disable_ambient = () => {
		// This selector is complex and might need adjustment.
		// It looks for the settings menu item for "Ambient mode".
		const ambient_switch = Array.from(
			document.querySelectorAll(".ytp-settings-menu-item .ytp-menuitem-label")
		).find((el) => el.textContent === "Ambient mode");
		if (ambient_switch) {
			const parent = ambient_switch.parentElement as HTMLElement;
			// If the switch is checked, click it to turn it off.
			if (parent && parent.getAttribute("aria-checked") === "true") {
				parent.click();
				// close the settings menu if it's open
				const settings_button = document.querySelector("button.ytp-settings-button") as HTMLElement;
				if (settings_button) settings_button.click();
			}
		}
	};

	// We need to open the settings menu to check the ambient mode status
	const check_and_disable = () => {
		const settings_button = document.querySelector("button.ytp-settings-button") as HTMLElement;
		if (settings_button) {
			settings_button.click(); // Open settings
			setTimeout(() => {
				disable_ambient();
			}, 200); // Wait for menu to render
		}
	};

	setTimeout(check_and_disable, 3000);
	window.addEventListener("yt-navigate-finish", () => setTimeout(check_and_disable, 2000));
}
