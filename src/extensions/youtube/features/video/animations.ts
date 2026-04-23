import { getPlayerContainer, getVideoElement, onYoutubeNavigate } from "@extensions/youtube/modules/youtube";

export function setupVideoAnimations() {
	const addVolIndicator = async () => {
		const container = getPlayerContainer();
		if (!container || container.querySelector(".newtube-vol-indicator")) return;

		const volDisplay = document.createElement("div");
		volDisplay.className = "newtube-vol-indicator";
		volDisplay.innerHTML = "100%";
		container.appendChild(volDisplay);

		let timer: number | undefined;
		const video = await getVideoElement();

		if (video) {
			video.addEventListener("volumechange", () => {
				const vol = Math.round(video.volume * 100);
				volDisplay.innerHTML = video.muted ? "Muted" : vol + "%";

				volDisplay.classList.add("show");

				clearTimeout(timer);
				timer = setTimeout(() => {
					volDisplay.classList.remove("show");
				}, 1000) as unknown as number;
			});
		}
	};

	onYoutubeNavigate(() => {
		setTimeout(addVolIndicator, 1000);
	});
	setTimeout(addVolIndicator, 2000);
}
