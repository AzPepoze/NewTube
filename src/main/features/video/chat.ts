export function setup_auto_show_chat_replay() {
	const try_click_chat = (attempts = 10) => {
		if (attempts <= 0) return;

		const replay_button = document.querySelector("ytd-live-chat-frame[collapsed] button") as HTMLElement;
		if (replay_button) {
			replay_button.click();
		} else {
			setTimeout(() => try_click_chat(attempts - 1), 1000);
		}
	};

	try_click_chat();
	window.addEventListener("yt-navigate-finish", () => setTimeout(() => try_click_chat(), 1000));
}
