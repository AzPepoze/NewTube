export function setup_video_animations() {
	const add_vol_indicator = () => {
		const container = document.querySelector(".html5-video-container");
		if (!container || container.querySelector(".newtube-vol-indicator")) return;

		const vol_display = document.createElement("div");
		vol_display.className = "newtube-vol-indicator";
		vol_display.innerHTML = "100%";
		container.appendChild(vol_display);

		let timer: number | undefined;
		const video = document.querySelector("video");

		if (video) {
			video.addEventListener("volumechange", () => {
				const vol = Math.round(video.volume * 100);
				vol_display.innerHTML = video.muted ? "Muted" : vol + "%";

				vol_display.classList.add("show");

				clearTimeout(timer);
				timer = setTimeout(() => {
					vol_display.classList.remove("show");
				}, 1000) as unknown as number;
			});
		}
	};

	window.addEventListener("yt-navigate-finish", () => {
		setTimeout(add_vol_indicator, 1000);
	});
	setTimeout(add_vol_indicator, 2000);
}
