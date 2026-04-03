import { Category, SeparateCategory } from "../styleshift/types/styleshiftTypes";
import { videoPlayerCategory } from "./categories/videoPlayer";
import { videoAutomationCategory } from "./categories/videoAutomation";
import { videoLayoutCategory } from "./categories/videoLayout";
import { videoColorsCategory } from "./categories/videoColors";
import { videoControlPanelCategory } from "./categories/videoControlPanel";
import { videoAmbientCategory } from "./categories/videoAmbient";
import { removeBlackBarsCategory } from "./categories/removeBlackBars";
import { subtitlesCategory } from "./categories/subtitles";
import { topbarSearchCategory } from "./categories/topbarSearch";
import { thumbnailCategory } from "./categories/thumbnail";
import { enhancementCategory } from "./categories/enhancement";
import { colorThemeCategory } from "./categories/colorTheme";
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
import { betaFeaturesCategory } from "./categories/betaFeatures";
import { sidebarCategory } from "./categories/sidebar";

const defaultStyleShiftItems: (Category | SeparateCategory)[] = [
	{ isHeader: true, label: "Video Experience" },
	videoPlayerCategory,
	videoControlPanelCategory,
	videoColorsCategory,
	videoAutomationCategory,
	videoLayoutCategory,
	videoAmbientCategory,
	removeBlackBarsCategory,

	{ isHeader: true, label: "Overall Experience" },
	enhancementCategory,

	{ isHeader: true, label: "Visual Style" },
	colorThemeCategory,
	backgroundCategory,
	blurCategory,
	bordersShadowsCategory,
	animationCategory,
	hoverClickColorCategory,
	enhancedCssCategory,
	fontsCategory,

	{ isHeader: true, label: "Components" },
	subtitlesCategory,
	thumbnailCategory,
	topbarSearchCategory,
	sidebarCategory,
	topLeftIconCategory,
	tabIconCategory,

	{ isHeader: true, label: "Utility & Cleanup" },
	scrollbarCategory,
	uiCleanerCategory,
	betaFeaturesCategory,
];

export function getDefaultItems() {
	return defaultStyleShiftItems;
}
