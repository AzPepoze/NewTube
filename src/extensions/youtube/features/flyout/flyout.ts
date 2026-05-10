import { sleep } from "@/core/shared/utilities";
import { logger } from "@/shared/logger";
import { localStorageUtil } from "@core/shared/localStorage";
import { getPlayerElement, onYoutubeFullscreen, onYoutubeNavigate, onYoutubeSmallMode } from "@extensions/youtube/modules/youtube";
import { settingsUi } from "@ui/settings/settingsApi";
import { triggerWindowHideAnimation, triggerWindowShowAnimation } from "@ui/window/windowFactory";
import { unmount } from "svelte";
import FlyoutPlayer from "./FlyoutPlayer.svelte";

let isFlyoutEnabled = true;
let isFlyoutMounted = false;
let flyoutInstance: any = null;
let flyoutMountPoint: HTMLElement | null = null;
let globalObserver: IntersectionObserver | null = null;
let navigateCleanup: (() => void) | null = null;
let fullscreenCleanup: (() => void) | null = null;
let smallModeCleanup: (() => void) | null = null;
let targetMountedState: boolean = false;

export function enableFlyout() {
	if (globalObserver) return;

	globalObserver = new IntersectionObserver(
		async (entries) => {
			for (const entry of entries) {
				const moviePlayer = await getPlayerElement();
				if (!moviePlayer) return;

				if (entry.isIntersecting) {
					isFlyoutEnabled = true;
					if (targetMountedState === false) return;
					targetMountedState = false;
					logger.debug("flyout", "Player is intersecting, queuing hide");
					hideFlyout();
				} else if (entry.boundingClientRect.top < 0 && isFlyoutEnabled) {
					if (moviePlayer.classList.contains("ytp-fullscreen") || moviePlayer.classList.contains("ytp-player-minimized")) {
						logger.debug("flyout", "Player is hidden but in fullscreen/mini mode, skipping flyout");
						return;
					}

					if (targetMountedState === true) return;
					targetMountedState = true;
					logger.debug("flyout", "Player scrolled out of view, queuing show");
					showFlyout();
				}
			}
		},
		{ threshold: 0 },
	);

	const startObserving = () => {
		const playerContainer = document.querySelector("#player-container");
		if (playerContainer && globalObserver) {
			globalObserver.disconnect();
			globalObserver.observe(playerContainer);
		}
	};

	startObserving();

	navigateCleanup = onYoutubeNavigate(() => {
		isFlyoutEnabled = true;
		targetMountedState = false;
		hideFlyout();
		setTimeout(startObserving, 1000);
	});

	const handleStateChange = async () => {
		targetMountedState = false;
		targetMountedState = false;
		hideFlyout();
	};

	fullscreenCleanup = onYoutubeFullscreen(handleStateChange);
	smallModeCleanup = onYoutubeSmallMode(handleStateChange);
}

async function showFlyout() {
	if (isFlyoutMounted) return;
	isFlyoutMounted = true;

	logger.info("flyout", "Mounting Flyout Player");
	const savedPos = localStorageUtil.get<any>("flyoutPosition");
	logger.debug("flyout", "Retrieved saved position:", savedPos);

	flyoutMountPoint = document.createElement("div");
	document.body.appendChild(flyoutMountPoint);

	flyoutInstance = settingsUi.mountComponent(
		FlyoutPlayer,
		{
			initialPos: savedPos,
			onClose: () => {
				logger.info("flyout", "Flyout closed by user");
				isFlyoutEnabled = false;
				targetMountedState = false;
				hideFlyout();
			},
		},
		flyoutMountPoint,
	);

	const windowContainer = flyoutMountPoint.querySelector(
		".styleshift-window-container",
	) as HTMLElement;
	if (windowContainer) {
		triggerWindowShowAnimation(windowContainer);
	}

	isFlyoutMounted = true;
}

async function hideFlyout() {
	if (!isFlyoutMounted) return;
	isFlyoutMounted = false;

	logger.info("flyout", "Unmounting Flyout Player");
	const oldFlyoutInstance = flyoutInstance;
	const oldFlyoutMountPoint = flyoutMountPoint;
	flyoutInstance = null;
	flyoutMountPoint = null;

	if (oldFlyoutInstance && oldFlyoutMountPoint) {
		const windowContainer = oldFlyoutMountPoint.querySelector(
			".styleshift-window-container",
		) as HTMLElement;
		if (windowContainer) {
			await triggerWindowHideAnimation(windowContainer);
			await sleep(300);
		}
		unmount(oldFlyoutInstance);
		oldFlyoutMountPoint.remove();
	}
}

export function disableFlyout() {
	if (globalObserver) {
		globalObserver.disconnect();
		globalObserver = null;
	}

	if (navigateCleanup) {
		navigateCleanup();
		navigateCleanup = null;
	}

	if (fullscreenCleanup) {
		fullscreenCleanup();
		fullscreenCleanup = null;
	}

	if (smallModeCleanup) {
		smallModeCleanup();
		smallModeCleanup = null;
	}

	hideFlyout();
}