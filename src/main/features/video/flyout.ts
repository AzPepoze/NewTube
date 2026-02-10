export function setupFlyout() {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const moviePlayer = document.querySelector("#moviePlayer") as HTMLElement;
				if (!moviePlayer) return;

				// If element is NOT intersecting AND it is above the viewport (top < 0)
				if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
					moviePlayer.classList.add("newtube-flyout-mode");
				} else if (entry.isIntersecting) {
					moviePlayer.classList.remove("newtube-flyout-mode");
				}
			});
		},
		{ threshold: 0 },
	);

	const startObserving = () => {
		const playerContainer = document.querySelector("#player-container");
		if (playerContainer) {
			observer.disconnect();
			observer.observe(playerContainer);
		}
	};

	startObserving();
	window.addEventListener("yt-navigate-finish", () => {
		const moviePlayer = document.querySelector("#moviePlayer");
		if (moviePlayer) moviePlayer.classList.remove("newtube-flyout-mode");
		setTimeout(startObserving, 1000);
	});
}
