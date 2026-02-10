export function setupAutoTheater() {
	const checkTheater = () => {
		const theaterButton = document.querySelector("button.ytp-size-button") as HTMLElement;
		// Check if the button for entering theater mode exists and is not already in theater mode
		if (theaterButton && !document.querySelector("ytd-watch-flexy[theater]")) {
			theaterButton.click();
		}
	};
	// run after a delay to ensure the page is loaded
	setTimeout(checkTheater, 2000);
	// Re-run when navigating to a new video
	window.addEventListener("yt-navigate-finish", () => setTimeout(checkTheater, 1000));
}

export function setupRemoveAmbient() {
	const disableAmbient = () => {
		// This selector is complex and might need adjustment.
		// It looks for the settings menu item for "Ambient mode".
		const ambientSwitch = Array.from(
			document.querySelectorAll(".ytp-settings-menu-item .ytp-menuitem-label"),
		).find((el) => el.textContent === "Ambient mode");
		if (ambientSwitch) {
			const parent = ambientSwitch.parentElement as HTMLElement;
			// If the switch is checked, click it to turn it off.
			if (parent && parent.getAttribute("aria-checked") === "true") {
				parent.click();
				// close the settings menu if it's open
				const settingsButton = document.querySelector("button.ytp-settings-button") as HTMLElement;
				if (settingsButton) settingsButton.click();
			}
		}
	};

	// We need to open the settings menu to check the ambient mode status
	const checkAndDisable = () => {
		const settingsButton = document.querySelector("button.ytp-settings-button") as HTMLElement;
		if (settingsButton) {
			settingsButton.click(); // Open settings
			setTimeout(() => {
				disableAmbient();
			}, 200); // Wait for menu to render
		}
	};

	setTimeout(checkAndDisable, 3000);
	window.addEventListener("yt-navigate-finish", () => setTimeout(checkAndDisable, 2000));
}
