import { type Category, type SeparateCategory } from "@settings/types/styleshiftTypes";
import { animationCategory } from "./categories/animations";
import { backgroundCategory } from "./categories/background";
import { betaFeaturesCategory } from "./categories/betaFeatures";
import { blurCategory } from "./categories/blur";
import { bordersShadowsCategory } from "./categories/bordersShadows";
import { colorThemeCategory } from "./categories/colorTheme";
import { enhancedCssCategory } from "./categories/enhancedCss";
import { enhancementCategory } from "./categories/enhancement";
import { fontsCategory } from "./categories/fonts";
import { hoverClickColorCategory } from "./categories/hoverClickColor";
import { removeBlackBarsCategory } from "./categories/removeBlackBars";
import { scrollbarCategory } from "./categories/scrollbar";
import { sidebarCategory } from "./categories/sidebar";
import { subtitlesCategory } from "./categories/subtitles";
import { tabIconCategory } from "./categories/tabIcon";
import { thumbnailCategory } from "./categories/thumbnail";
import { topbarSearchCategory } from "./categories/topbarSearch";
import { topLeftIconCategory } from "./categories/topLeftIcon";
import { uiCleanerCategory } from "./categories/uiCleaner";
import { videoAmbientCategory } from "./categories/videoAmbient";
import { videoColorsCategory } from "./categories/videoColors";
import { videoControlPanelCategory } from "./categories/videoControlPanel";
import { videoLayoutCategory } from "./categories/videoLayout";
import { videoPlayerCategory } from "./categories/videoPlayer";

const defaultStyleShiftItems: (Category | SeparateCategory)[] = [
	{ isHeader: true, label: "Video Experience" },
	videoPlayerCategory,
	videoControlPanelCategory,
	videoColorsCategory,
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
