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

			const targetElement = currentEditObj["target"];

			function updatePosition() {
				const targetElementCenterPosition = getElementCenterPosition(targetElement);
				let calPosition;

				if (targetElementCenterPosition.x < window.innerWidth / 2) {
					calPosition = targetElement.getBoundingClientRect().right + 10;
				} else {
					calPosition = targetElement.getBoundingClientRect().left - editorWidth - 20 - 10;
				}

				if (calPosition + editorWidth > window.innerWidth) {
					calPosition = window.innerWidth - editorWidth - 20 - 20;
				}

				styleshiftWindow.windowElement.style.translate = `${calPosition}px 10%`;

				// Continue animation loop
				animationFrameId = requestAnimationFrame(updatePosition);
			}

			updatePosition();

			resizeObserver = new ResizeObserver(() => {
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = null;
				}
				if (resizeObserver) {
					resizeObserver.disconnect();
					resizeObserver = null;
				}
			});
			resizeObserver.observe(targetElement);

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
