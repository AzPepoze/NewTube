export function setupFlyoutListener() {
	const videoPlayer = document.querySelector("#player.ytd-watch-flexy") as HTMLElement;
	if (!videoPlayer) return;

	const handleScroll = () => {
		const playerRect = videoPlayer.getBoundingClientRect();
		if (playerRect.bottom < 0) {
			videoPlayer.classList.add("flyout-active");
		} else {
			videoPlayer.classList.remove("flyout-active");
		}
	};

	window.addEventListener("scroll", handleScroll, { passive: true });
}

export async function setupChatReplay() {
	const clickButton = () => {
		const button = document.querySelector("#show-hide-button button") as HTMLElement;
		if (button && button.textContent?.includes("show")) {
			button.click();
		}
	};

	setTimeout(clickButton, 2500);
	window.addEventListener("yt-navigate-finish", () => setTimeout(clickButton, 1500));
}
