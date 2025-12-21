export function setup_flyout_listener() {
	const video_player = document.querySelector("#player.ytd-watch-flexy") as HTMLElement;
	if (!video_player) return;

	const handle_scroll = () => {
		const player_rect = video_player.getBoundingClientRect();
		if (player_rect.bottom < 0) {
			video_player.classList.add("flyout-active");
		} else {
			video_player.classList.remove("flyout-active");
		}
	};

	window.addEventListener("scroll", handle_scroll, { passive: true });
}

export async function setup_chat_replay() {
	const click_button = () => {
		const button = document.querySelector("#show-hide-button button") as HTMLElement;
		if (button && button.textContent?.includes("show")) {
			button.click();
		}
	};

	setTimeout(click_button, 2500);
	window.addEventListener("yt-navigate-finish", () => setTimeout(click_button, 1500));
}
