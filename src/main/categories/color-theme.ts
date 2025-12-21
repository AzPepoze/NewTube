import { Category } from "../../styleshift/types/store";
import { setup_theme_by_video } from "../features/theme";

export const color_theme_category: Category = {
	category: "🌈 color/Theme",
	settings: [
		{
			type: "color",
			id: "Theme",
			name: "Main Theme color",
			description: "The primary accent color used throughout the ui.",
			value: "#659affff",
			var_css: "--theme-color",
		},
		{
			type: "color",
			id: "ThemeThr",
			name: "Transparent Theme color",
			description: "A transparent version of the theme color, used for backgrounds and highlights.",
			value: "#659aff33",
			var_css: "--theme-transparent-color",
		},
		{
			type: "color",
			id: "LeftBar",
			name: "Left Sidebar Background",
			description: "Background color of the main left-hand sidebar.",
			value: "#00000000",
			var_css: "--left-sidebar-bg",
			constant_css: `
                #guide-inner-content.ytd-app, ytd-mini-guide-renderer {
                    background: var(--left-sidebar-bg) !important;
                }
            `,
		},
		{
			type: "color",
			id: "text",
			name: "Main text color",
			description: "The primary text color for general ui text.",
			value: "#ffffffff",
			var_css: "--main-text-color",
			constant_css: `
                ytd-watch-flexy, #video-title, #channel-name, .ytd-video-primary-info-renderer, .ytd-video-secondary-info-renderer {
                    color: var(--main-text-color) !important;
                }
            `,
		},
		{
			type: "color",
			id: "Ndtext",
			name: "Secondary text color",
			description: "The secondary text color, used for metadata, descriptions, and less important text.",
			value: "#c4c4c4ff",
			var_css: "--secondary-text-color",
			constant_css: `
                #metadata-line, .ytd-video-meta-block, #description-text, .ytd-comment-renderer, .yt-formatted-string[is-empty] {
                    color: var(--secondary-text-color) !important;
                }
            `,
		},
		{
			type: "color",
			id: "Linkcolor",
			name: "Link color",
			description: "The color for hyperlinks in descriptions and comments.",
			value: "#5797ffff",
			var_css: "--link-color",
			constant_css: `
                .yt-core-attributed-string__link {
                    color: var(--link-color) !important;
                }
            `,
		},
		{
			type: "color",
			id: "TIMETEXT",
			name: "timestamp text color",
			description: "The color of the text for video timestamps (e.g., on thumbnails).",
			value: "#ffffffff",
			var_css: "--timestamp-text-color",
			constant_css: `
                ytd-thumbnail-overlay-time-status-renderer {
                    color: var(--timestamp-text-color) !important;
                }
            `,
		},
		{
			type: "color",
			id: "Chanel_color",
			name: "Channel name color",
			description: "The color of channel names under video titles.",
			value: "#ffffffff",
			var_css: "--channel-name-color",
			constant_css: `
                #channel-name .ytd-video-owner-renderer {
                    color: var(--channel-name-color) !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "Theme_by_video",
			name: "Theme colors base on video thumbnail",
			description:
				"Automatically extracts colors from the video thumbnail and applies them as the theme.",
			value: false,
			enable_function: setup_theme_by_video,
		},
	],
};
