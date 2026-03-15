import { getPlayerElement, onYoutubeNavigate, onYoutubeFullscreen, onYoutubeSmallMode } from "../../modules/youtube";

const STORAGE_KEY = "newtube-flyout-position";
const FLYOUT_WIDTH = 420;
const FLYOUT_HEIGHT = 236;

let isFlyoutEnabled = true;
let flyoutOffset = loadFlyoutPosition();
let isDragging = false;
let globalObserver: IntersectionObserver | null = null;
let navigateCleanup: (() => void) | null = null;
let fullscreenCleanup: (() => void) | null = null;
let smallModeCleanup: (() => void) | null = null;

function loadFlyoutPosition() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved ? JSON.parse(saved) : { x: 0, y: 0 };
	} catch {
		return { x: 0, y: 0 };
	}
}

function saveFlyoutPosition() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(flyoutOffset));
}

export function enableFlyout() {
	if (globalObserver) return;

	globalObserver = new IntersectionObserver(
		async (entries) => {
			for (const entry of entries) {
				const moviePlayer = await getPlayerElement();
				if (!moviePlayer) return;

				if (entry.isIntersecting) {
					isFlyoutEnabled = true;
					moviePlayer.classList.remove("newtube-flyout-mode");
					moviePlayer.style.transform = "";
				} else if (entry.boundingClientRect.top < 0 && isFlyoutEnabled) {
					if (moviePlayer.classList.contains("ytp-fullscreen") || moviePlayer.classList.contains("ytp-player-minimized")) {
						return;
					}

					moviePlayer.classList.add("newtube-flyout-mode");
					applyFlyoutPosition(moviePlayer);
					ensureCloseButton(moviePlayer);
					setupDraggable(moviePlayer);
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
		getPlayerElement().then((moviePlayer) => {
			if (moviePlayer) {
				moviePlayer.classList.remove("newtube-flyout-mode");
				moviePlayer.style.transform = "";
			}
		});
		setTimeout(startObserving, 1000);
	});

	const handleStateChange = async () => {
		const moviePlayer = await getPlayerElement();
		if (moviePlayer) {
			moviePlayer.classList.remove("newtube-flyout-mode");
		}
	};

	fullscreenCleanup = onYoutubeFullscreen(handleStateChange);
	smallModeCleanup = onYoutubeSmallMode(handleStateChange);
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

	getPlayerElement().then((moviePlayer) => {
		if (moviePlayer) {
			moviePlayer.classList.remove("newtube-flyout-mode");
			moviePlayer.style.transform = "";
			const closeBtn = moviePlayer.querySelector(".newtube-flyout-close");
			if (closeBtn) closeBtn.remove();
		}
	});
}

function clampPosition() {
	const winW = window.innerWidth;
	const winH = window.innerHeight;

	// The player is positioned fixed with bottom: 24px, right: 24px
	const baseR = winW - 24;
	const baseB = winH - 24;

	// currentRight = baseR + offset.x
	// currentBottom = baseB + offset.y
	const minVisibleW = FLYOUT_WIDTH * 0.4;
	const minVisibleH = FLYOUT_HEIGHT * 0.4;

	// Clamp X
	// currentRight >= minVisibleW  => baseR + x >= minVisibleW => x >= minVisibleW - baseR
	const minX = minVisibleW - baseR;
	// currentLeft <= winW - minVisibleW => (baseR + x - FLYOUT_WIDTH) <= winW - minVisibleW
	// => x <= winW - minVisibleW - baseR + FLYOUT_WIDTH
	const maxX = winW - minVisibleW - baseR + FLYOUT_WIDTH;

	// Clamp Y
	// currentBottom >= minVisibleH => baseB + y >= minVisibleH => y >= minVisibleH - baseB
	const minY = minVisibleH - baseB;
	// currentTop <= winH - minVisibleH => (baseB + y - FLYOUT_HEIGHT) <= winH - minVisibleH
	// => y <= winH - minVisibleH - baseB + FLYOUT_HEIGHT
	const maxY = winH - minVisibleH - baseB + FLYOUT_HEIGHT;

	flyoutOffset.x = Math.max(minX, Math.min(maxX, flyoutOffset.x));
	flyoutOffset.y = Math.max(minY, Math.min(maxY, flyoutOffset.y));
}

function applyFlyoutPosition(player: HTMLElement) {
	clampPosition();
	if (flyoutOffset.x !== 0 || flyoutOffset.y !== 0) {
		player.style.transform = `translate(${flyoutOffset.x}px, ${flyoutOffset.y}px)`;
	}
}

function setupDraggable(player: HTMLElement) {
	if (player.dataset.dragInitialized) return;
	player.dataset.dragInitialized = "true";

	let startX = 0;
	let startY = 0;
	let hasMoved = false;

	const onMouseDown = (e: MouseEvent) => {
		if (!player.classList.contains("newtube-flyout-mode")) return;
		if ((e.target as HTMLElement).closest(".newtube-flyout-close") || (e.target as HTMLElement).closest(".ytp-chrome-bottom")) return;

		isDragging = true;
		hasMoved = false;
		startX = e.clientX - flyoutOffset.x;
		startY = e.clientY - flyoutOffset.y;

		player.style.transition = "none";
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
		
		e.stopPropagation();
		e.stopImmediatePropagation();
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!isDragging) return;
		const dx = e.clientX - (startX + flyoutOffset.x);
		const dy = e.clientY - (startY + flyoutOffset.y);
		
		if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
			hasMoved = true;
		}

		flyoutOffset.x = e.clientX - startX;
		flyoutOffset.y = e.clientY - startY;
		applyFlyoutPosition(player);
	};

	const onMouseUp = (e: MouseEvent) => {
		isDragging = false;
		player.style.transition = "";
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);

		if (hasMoved) {
			saveFlyoutPosition();
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	};

	// Capture phase click listener to prevent play/pause if drag happened
	player.addEventListener("click", (e: MouseEvent) => {
		if (hasMoved && player.classList.contains("newtube-flyout-mode")) {
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			hasMoved = false;
		}
	}, true);

	player.addEventListener("mousedown", onMouseDown);
}

function ensureCloseButton(player: HTMLElement) {
	if (player.querySelector(".newtube-flyout-close")) return;

	const closeBtn = document.createElement("button");
	closeBtn.className = "newtube-flyout-close";
	closeBtn.innerHTML = `<span class="material-icons">close</span>`;

	closeBtn.onclick = (e) => {
		e.stopPropagation();
		isFlyoutEnabled = false;
		player.classList.remove("newtube-flyout-mode");
	};

	player.appendChild(closeBtn);
}
