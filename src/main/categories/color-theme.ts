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
			id: "ThemeFort",
			name: "Theme Accent color",
			description: "A secondary accent color for borders and small details.",
			value: "#659aff66",
			var_css: "--theme-fort",
		},
		{
			type: "color",
			id: "EndScreenBG",
			name: "Video overlay Background (Endscreen)",
			description: "Background color for endscreen elements and video overlays.",
			value: "#00000080",
			var_css: "--things-end-on-video",
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
			id: "Text",
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
			id: "NdText",
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
			id: "LinkColor",
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
			id: "Chanel_Color",
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
			description: "Automatically extracts colors from the video thumbnail and applies them as the theme.",
			value: false,
			enable_function: setup_theme_by_video,
		},
		{
			type: "checkbox",
			id: "Solid_BG_Theme_by_video",
			name: "Solid background (Theme by video)",
			description: "Makes the background tint fully opaque when 'Theme by video' is enabled.",
			value: false,
		},
		{
			type: "checkbox",
			id: "StyleSync",
			name: "Sync YouTube styles with Theme",
			description: "Forces YouTube's internal color variables to match your custom theme.",
			value: true,
			enable_css: `
                html, [watch-color-update] {
                    --ytd-chip-cloud-background: rgba(0,0,0,.3) !important;
                    --yt-spec-brand-background-primary: var(--top-bar-and-search-background) !important;
                    --yt-spec-brand-background-solid: var(--newtube-bg-tint-color) !important;
                    --yt-spec-general-background-a: var(--newtube-bg-tint-color) !important;
                    --yt-spec-call-to-action: var(--theme-color) !important;
                    --yt-spec-suggested-action: var(--theme-fort) !important;
                    --yt-spec-badge-chip-background: var(--theme-fort) !important;
                    --yt-spec-text-primary: var(--main-text-color) !important;
                    --yt-spec-text-secondary: var(--secondary-text-color) !important;
                    --yt-spec-brand-button-background: var(--theme-color) !important;
                    --yt-spec-static-brand-red: var(--theme-color) !important;
                    --yt-spec-brand-icon-inactive: var(--theme-color) !important;
                    --yt-spec-10-percelayer: var(--theme-transparent-color) !important;
                    --yt-spec-general-background-b: transparent !important;
                    --yt-spec-wordmark-text: var(--main-text-color) !important;
                    --yt-spec-button-chip-background-hover: var(--search-background-hover) !important;
                    --yt-spec-text-primary-inverse: var(--top-bar-and-search-background) !important;
                    --yt-spec-static-brand-white: var(--main-text-color) !important;
                    --yt-spec-base-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-raised-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-menu-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-static-overlay-text-primary: var(--main-text-color) !important;
                    --ytd-author-comment-badge-background-color: var(--theme-transparent-color) !important;
                    --yt-spec-10-percent-layer: var(--theme-transparent-color) !important;
                    --yt-spec-static-brand-black: var(--main-text-color) !important;
                    --yt-spec-additive-background: var(--theme-transparent-color) !important;
                    --yt-spec-static-overlay-background-brand: var(--theme-fort) !important;
                    --yt-spec-inverted-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-themed-blue: var(--theme-color) !important;
                    --yt-live-chat-vem-background-color: var(--top-bar-and-search-background) !important;
                    --ytmusic-background: transparent !important;
                    --yt-spec-themed-green: var(--theme-color) !important;
                }
            `,
		},
	],
};
