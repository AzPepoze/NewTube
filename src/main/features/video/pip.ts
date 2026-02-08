export function setup_auto_pip() {
	document.addEventListener("visibilitychange", async () => {
		const video = document.querySelector("video") as HTMLVideoElement;
		if (!video) return;

		if (document.hidden && !video.paused && !document.pictureInPictureElement) {
			try {
				await video.requestPictureInPicture();
			} catch (_e) {
				// console.error("AutoPiP Error:", e);
			}
		}
	});
}

export function setup_auto_exit_pip() {
	document.addEventListener("visibilitychange", async () => {
		if (!document.hidden && document.pictureInPictureElement) {
			try {
				await document.exitPictureInPicture();
			} catch (_e) {
				// console.error("AutoExitPiP Error:", e);
			}
		}
	});
}
