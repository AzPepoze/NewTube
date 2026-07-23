import { accentIntegrationCss } from "./css/accentIntegration";
import { animationsTransitionsCss } from "./css/animationsTransitions";
import { borderRadiusCss } from "./css/borderRadius";
import { playerEnhancementsCss } from "./css/playerEnhancements";
import { scrollbarCss } from "./css/scrollbar";
import { shadowsOutlinesCss } from "./css/shadowsOutlines";
import { transparencyLayoutCss } from "./css/transparencyLayout";
import { uiCleanupCss } from "./css/uiCleanup";
import { videoCenteringCss } from "./css/videoCentering";

export {
	accentIntegrationCss,
	animationsTransitionsCss,
	borderRadiusCss,
	playerEnhancementsCss,
	scrollbarCss,
	shadowsOutlinesCss,
	transparencyLayoutCss,
	uiCleanupCss,
	videoCenteringCss,
};

export const mainCss =
	transparencyLayoutCss +
	videoCenteringCss +
	scrollbarCss +
	shadowsOutlinesCss +
	borderRadiusCss +
	accentIntegrationCss +
	animationsTransitionsCss +
	playerEnhancementsCss +
	uiCleanupCss;
