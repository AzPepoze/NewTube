import { getPlayerElement, onYoutubeNavigate, onYoutubeFullscreen, onYoutubeSmallMode } from "../../modules/youtube";
import { settingsUi } from "@ui/settings/settingComponents";
import { triggerWindowShowAnimation, triggerWindowHideAnimation } from "@ui/extension";
import { sleep } from "@/styleshift/shared/normal";
import FlyoutPlayer from "./FlyoutPlayer.svelte";
import { unmount } from "svelte";
import { logger } from "@/shared/logger";
import { localStorageUtil } from "@/styleshift/shared/localStorage";

let isFlyoutEnabled = true;
let isFlyoutMounted = false;
let flyoutInstance: any = null;
let flyoutMountPoint: HTMLElement | null = null;
let globalObserver: IntersectionObserver | null = null;
let navigateCleanup: (() => void) | null = null;
let fullscreenCleanup: (() => void) | null = null;
let smallModeCleanup: (() => void) | null = null;
let transitionQueue: Promise<void> = Promise.resolve();
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
					transitionQueue = transitionQueue.then(() => hideFlyout());
				} else if (entry.boundingClientRect.top < 0 && isFlyoutEnabled) {
					if (moviePlayer.classList.contains("ytp-fullscreen") || moviePlayer.classList.contains("ytp-player-minimized")) {
						logger.debug("flyout", "Player is hidden but in fullscreen/mini mode, skipping flyout");
						return;
					}

					if (targetMountedState === true) return;
					targetMountedState = true;
					logger.debug("flyout", "Player scrolled out of view, queuing show");
					transitionQueue = transitionQueue.then(() => showFlyout());
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
		transitionQueue = transitionQueue.then(() => hideFlyout());
		setTimeout(startObserving, 1000);
	});

	const handleStateChange = async () => {
		targetMountedState = false;
		transitionQueue = transitionQueue.then(() => hideFlyout());
	};

	fullscreenCleanup = onYoutubeFullscreen(handleStateChange);
	smallModeCleanup = onYoutubeSmallMode(handleStateChange);
}

async function showFlyout() {
	if (isFlyoutMounted) return;

	logger.info("flyout", "Mounting Flyout Player");
	const savedPos = localStorageUtil.get<any>("flyoutPosition");
	logger.debug("flyout", "Retrieved saved position:", savedPos);

	flyoutMountPoint = document.createElement("div");
	document.body.appendChild(flyoutMountPoint);

	flyoutInstance = settingsUi.renderComponent(
		FlyoutPlayer,
		{
			initialPos: savedPos,
			onClose: () => {
				logger.info("flyout", "Flyout closed by user");
				isFlyoutEnabled = false;
				targetMountedState = false;
				transitionQueue = transitionQueue.then(() => hideFlyout());
			},
		},
		flyoutMountPoint,
	);

	const windowContainer = flyoutMountPoint.querySelector(
		".STYLESHIFT-Window-Container",
	) as HTMLElement;
	if (windowContainer) {
		triggerWindowShowAnimation(windowContainer);
	}

	isFlyoutMounted = true;
}

async function hideFlyout() {
	if (!isFlyoutMounted) return;

	logger.info("flyout", "Unmounting Flyout Player");
	if (flyoutInstance) {
		const windowContainer = flyoutMountPoint?.querySelector(".STYLESHIFT-Window-Container") as HTMLElement;
		if (windowContainer) {
			await triggerWindowHideAnimation(windowContainer);
			await sleep(300);
		}
		unmount(flyoutInstance);
		flyoutInstance = null;
	}

	if (flyoutMountPoint) {
		flyoutMountPoint.remove();
		flyoutMountPoint = null;
	}

	isFlyoutMounted = false;
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