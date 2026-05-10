import { getElementCenterPosition } from "@core/shared/domHelpers";
import { type Category } from "@settings/types/styleshiftTypes";
import { startHighlighter } from "../highlight/highlight";
import { createMainSettingsUi } from "../settings/settingsManager";

const editorWidth = 400;
export let editorUi: Awaited<ReturnType<typeof createMainSettingsUi>>;
const currentEditObj = {};
let animationFrameId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

(async () => {
	editorUi = await createMainSettingsUi({
		showCategoryList: false,
		onCreate: function (styleshiftWindow) {
			styleshiftWindow.windowElement.style.width = editorWidth + "px";
			styleshiftWindow.windowElement.style.minWidth = "300px";

			function updatePosition() {
				const currentTargetElement = currentEditObj["target"];
				if (!currentTargetElement) {
					animationFrameId = requestAnimationFrame(updatePosition);
					return;
				}

				const targetElementCenterPosition = getElementCenterPosition(currentTargetElement);
				const windowElement = styleshiftWindow.windowElement;
				const currentEditorWidth = windowElement.offsetWidth;
				const currentEditorHeight = windowElement.offsetHeight;
				const targetBoundingRect = currentTargetElement.getBoundingClientRect();
				const viewportPadding = 20;

				let calculatedPositionX: number;
				let calculatedPositionY: number;

				// Determine horizontal position: place to the right of target if it's in the left half of the screen
				if (targetElementCenterPosition.x < window.innerWidth / 2) {
					calculatedPositionX = targetBoundingRect.right + 10;
				} else {
					calculatedPositionX = targetBoundingRect.left - currentEditorWidth - 10;
				}

				// Center vertically relative to the target element
				calculatedPositionY = targetElementCenterPosition.y - currentEditorHeight / 2;

				// Clamp horizontal position within viewport boundaries
				if (calculatedPositionX < viewportPadding) {
					calculatedPositionX = viewportPadding;
				} else if (calculatedPositionX + currentEditorWidth > window.innerWidth - viewportPadding) {
					calculatedPositionX = window.innerWidth - currentEditorWidth - viewportPadding;
				}

				// Clamp vertical position within viewport boundaries
				if (calculatedPositionY < viewportPadding) {
					calculatedPositionY = viewportPadding;
				} else if (calculatedPositionY + currentEditorHeight > window.innerHeight - viewportPadding) {
					calculatedPositionY = window.innerHeight - currentEditorHeight - viewportPadding;
				}

				windowElement.style.translate = `${calculatedPositionX}px ${calculatedPositionY}px`;

				// Continue animation loop to follow target if it moves
				animationFrameId = requestAnimationFrame(updatePosition);
			}

			updatePosition();

			resizeObserver = new ResizeObserver(() => {
				const currentTargetElement = currentEditObj["target"];
				if (currentTargetElement) {
					// We could use this to trigger updates, but requestAnimationFrame already handles it.
					// For now, we just ensure it doesn't crash.
				}
			});

			const initialTarget = currentEditObj["target"];
			if (initialTarget) {
				resizeObserver.observe(initialTarget);
			}

			styleshiftWindow.dragHandle.addEventListener("mousedown", () => {
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = null;
				}
			});

			styleshiftWindow.closeButton.addEventListener("click", () => {
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = null;
				}
				if (resizeObserver) {
					resizeObserver.disconnect();
					resizeObserver = null;
				}
				startHighlighter();
			});
		},
	});
})();

export async function createEditorUi(targetElement, categories: Category[]) {
	currentEditObj["target"] = targetElement;
	currentEditObj["Categories"] = categories;
	editorUi.setGetCategory(() => categories);
	editorUi.createUi();
}
