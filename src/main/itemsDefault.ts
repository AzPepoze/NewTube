import { Category } from "../styleshift/types/store";
import { videoCategory } from "./categories/video";
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
import { otherSettingsCategory } from "./categories/otherSettings";
import { fontsCategory } from "./categories/fonts";
import { betaFeaturesCategory } from "./categories/betaFeatures";

const defaultStyleshiftItems: Category[] = [
	videoCategory,
	videoControlPanelCategory,
	videoBackgroundCategory,
	removeBlackBarsCategory,
	subtitlesCategory,
	topbarSearchCategory,
	thumbnailCategory,
	enhancementCategory,
	colorThemeCategory,
	subscribeButtonCategory,
	topLeftIconCategory,
	tabIconCategory,
	bordersShadowsCategory,
	backgroundCategory,
	blurCategory,
	animationCategory,
	hoverClickColorCategory,
	otherSettingsCategory,
	fontsCategory,
	betaFeaturesCategory,
];

export function getDefaultItems() {
	return defaultStyleshiftItems;
}
