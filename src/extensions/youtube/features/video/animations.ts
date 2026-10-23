import { getPlayerContainer, getVideoElement, onYoutubeNavigate } from "@extensions/youtube/modules/youtube";

const INDICATOR_CLASS = "newtube-vol-indicator";
const HIDE_DELAY_MS = 1000;

let active = false;
let indicator: HTMLElement | null = null;
let boundVideo: HTMLVideoElement | null = null;
let hideTimer: number | undefined;
let stopNavigateListener: (() => void) | null = null;

function handleVolumeChange() {
	if (!indicator || !boundVideo) return;

	const vol = Math.round(boundVideo.volume * 100);
	indicator.innerHTML = boundVideo.muted ? "Muted" : vol + "%";

	indicator.classList.add("show");

	clearTimeout(hideTimer);
	hideTimer = setTimeout(() => {
		indicator?.classList.remove("show");
	}, HIDE_DELAY_MS) as unknown as number;
}

function unbindVolume() {
	boundVideo?.removeEventListener("volumechange", handleVolumeChange);
	boundVideo = null;
}

async function addVolIndicator() {
	if (!active) return;

	const container = getPlayerContainer();
	if (!container || container.querySelector(`.${INDICATOR_CLASS}`)) return;

	indicator = document.createElement("div");
	indicator.className = INDICATOR_CLASS;
	indicator.innerHTML = "100%";
	container.appendChild(indicator);

	const video = await getVideoElement();
	if (!active || !video) return;

	unbindVolume();
	boundVideo = video;
	video.addEventListener("volumechange", handleVolumeChange);
}

export function setupVideoAnimations() {
	if (active) return;
	active = true;

	stopNavigateListener = onYoutubeNavigate(() => {
		setTimeout(addVolIndicator, 1000);
	});
	setTimeout(addVolIndicator, 2000);
}

export function disableVideoAnimations() {
	active = false;
	stopNavigateListener?.();
	stopNavigateListener = null;
	unbindVolume();
	clearTimeout(hideTimer);
	indicator = null;
	document.querySelectorAll(`.${INDICATOR_CLASS}`).forEach((element) => element.remove());
}
