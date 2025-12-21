export function setup_flyout() {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const movie_player = document.querySelector("#movie_player") as HTMLElement;
				if (!movie_player) return;

				// If element is NOT intersecting AND it is above the viewport (top < 0)
				if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
					movie_player.classList.add("newtube-flyout-mode");
				} else if (entry.isIntersecting) {
					movie_player.classList.remove("newtube-flyout-mode");
				}
			});
		},
		{ threshold: 0 }
	);

	const start_observing = () => {
		const player_container = document.querySelector("#player-container");
		if (player_container) {
			observer.disconnect();
			observer.observe(player_container);
		}
	};

	start_observing();
	window.addEventListener("yt-navigate-finish", () => {
		const movie_player = document.querySelector("#movie_player");
		if (movie_player) movie_player.classList.remove("newtube-flyout-mode");
		setTimeout(start_observing, 1000);
	});
}
