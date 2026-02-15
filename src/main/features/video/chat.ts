import { onYoutubeNavigate } from "../../modules/youtube";

export function setupAutoShowChatReplay() {
	const tryClickChat = (attempts = 10) => {
		if (attempts <= 0) return;

		const replayButton = document.querySelector("ytd-live-chat-frame[collapsed] button") as HTMLElement;
		if (replayButton) {
			replayButton.click();
		} else {
			setTimeout(() => tryClickChat(attempts - 1), 1000);
		}
	};

	tryClickChat();
	onYoutubeNavigate(() => setTimeout(() => tryClickChat(), 1000));
}
