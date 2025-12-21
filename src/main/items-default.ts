import { Category } from "../styleshift/types/store";
import { video_category } from "./categories/video";
import { video_control_panel_category } from "./categories/video-control-panel";
import { video_background_category } from "./categories/video-background";
import { remove_black_bars_category } from "./categories/remove-black-bars";
import { subtitles_category } from "./categories/subtitles";
import { topbar_search_category } from "./categories/topbar-search";
import { thumbnail_category } from "./categories/thumbnail";
import { enhancement_category } from "./categories/enhancement";
import { color_theme_category } from "./categories/color-theme";
import { subscribe_button_category } from "./categories/subscribe-button";
import { top_left_icon_category } from "./categories/top-left-icon";
import { tab_icon_category } from "./categories/tab-icon";
import { borders_shadows_category } from "./categories/borders-shadows";
import { background_category } from "./categories/background";
import { blur_category } from "./categories/blur";
import { animation_category } from "./categories/animations";
import { hover_click_color_category } from "./categories/hover-click-color";
import { other_settings_category } from "./categories/other-settings";
import { fonts_category } from "./categories/fonts";
import { beta_features_category } from "./categories/beta-features";

const default_styleshift_items: Category[] = [
	video_category,
	video_control_panel_category,
	video_background_category,
	remove_black_bars_category,
	subtitles_category,
	topbar_search_category,
	thumbnail_category,
	enhancement_category,
	color_theme_category,
	subscribe_button_category,
	top_left_icon_category,
	tab_icon_category,
	borders_shadows_category,
	background_category,
	blur_category,
	animation_category,
	hover_click_color_category,
	other_settings_category,
	fonts_category,
	beta_features_category,
];

export function get_default_items() {
	return default_styleshift_items;
}