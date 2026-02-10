export function setupUpdateTimestamp() {
	let timer: number | undefined;

	const updateUrl = () => {
		const video = document.querySelector("video") as HTMLVideoElement;
		if (!video) return;

		const time = Math.floor(video.currentTime);
		if (time > 0) {
			const url = new URL(window.location.href);
			url.searchParams.set("t", `${time}s`);
			window.history.replaceState({}, "", url.toString());
		}
	};

	// Start checking when navigation finishes
	window.addEventListener("yt-navigate-finish", () => {
		clearInterval(timer);
		// Update every 10 seconds to avoid spamming history too much, but enough to be useful
		timer = setInterval(updateUrl, 10000) as unknown as number;
	});

	// Also update immediately when paused
	document.addEventListener(
		"pause",
		(e) => {
			if (e.target instanceof HTMLVideoElement) {
				updateUrl();
			}
		},
		true,
	);
}
