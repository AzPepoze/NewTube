import { onYoutubeNavigate } from "../../modules/youtube";

let navigateCleanup: (() => void) | null = null;
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

	try {
		tryClickChat();
		if (!navigateCleanup) {
			navigateCleanup = onYoutubeNavigate(() => setTimeout(() => tryClickChat(), 1000));
		}
	} catch (e) {}
}

export function disableAutoShowChatReplay() {
	if (navigateCleanup) {
		navigateCleanup();
		navigateCleanup = null;
	}
}
