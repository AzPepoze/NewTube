import { Category } from "../styleshift/types/store";
import { videoPlayerCategory } from "./categories/videoPlayer";
import { videoAutomationCategory } from "./categories/videoAutomation";
import { videoLayoutCategory } from "./categories/videoLayout";
import { videoColorsCategory } from "./categories/videoColors";
import { videoControlPanelCategory } from "./categories/videoControlPanel";
import { videoBackgroundCategory } from "./categories/videoBackground";
import { removeBlackBarsCategory } from "./categories/removeBlackBars";
import { subtitlesCategory } from "./categories/subtitles";
import { topbarSearchCategory } from "./categories/topbarSearch";
import { thumbnailCategory } from "./categories/thumbnail";
import { enhancementCategory } from "./categories/enhancement";
import { colorThemeCategory } from "./categories/colorTheme";
import { subscribeButtonCategory } from "./categories/subscribeButton";
import { topLeftIconCategory } from "./categories/topLeftIcon";
import { tabIconCategory } from "./categories/tabIcon";
import { bordersShadowsCategory } from "./categories/bordersShadows";
import { backgroundCategory } from "./categories/background";
import { blurCategory } from "./categories/blur";
import { animationCategory } from "./categories/animations";
import { hoverClickColorCategory } from "./categories/hoverClickColor";
import { scrollbarCategory } from "./categories/scrollbar";
import { uiCleanerCategory } from "./categories/uiCleaner";
import { fontsCategory } from "./categories/fonts";
import { enhancedCssCategory } from "./categories/enhancedCss";
import { styleshiftCategory } from "./categories/styleshift";
import { betaFeaturesCategory } from "./categories/betaFeatures";

const defaultStyleshiftItems: Category[] = [
	// --- StyleShift ---
	styleshiftCategory,

	// --- Video Experience ---
	videoPlayerCategory,
	videoControlPanelCategory,
	videoColorsCategory,
	videoAutomationCategory,
	videoLayoutCategory,
	videoBackgroundCategory,
	removeBlackBarsCategory,

	// --- Visual Style ---
	colorThemeCategory,
	backgroundCategory,
	blurCategory,
	bordersShadowsCategory,
	animationCategory,
	hoverClickColorCategory,
	enhancedCssCategory,
	fontsCategory,

	// --- Components ---
	subtitlesCategory,
	thumbnailCategory,
	topbarSearchCategory,
	topLeftIconCategory,
	tabIconCategory,
	subscribeButtonCategory,

	// --- Utility & Cleanup ---
	enhancementCategory,
	scrollbarCategory,
	uiCleanerCategory,
	betaFeaturesCategory,
];

export function getDefaultItems() {
	return defaultStyleshiftItems;
}
