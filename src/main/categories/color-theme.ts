import { Category } from "../../styleshift/types/store";
import { setup_theme_by_video } from "../features/theme";
import { main_css } from "../features/main-css";

export const color_theme_category: Category = {
	category: "🎨 color theme",
	settings: [
		{
			type: "checkbox",
			id: "main_css_enable",
			name: "Enable Base Main CSS",
			description: "Toggles the primary static CSS that styles many of YouTube's core components.",
			value: true,
			enable_css: main_css,
		},
		{
			type: "color",
			id: "Theme",
			name: "Main Theme color",
			description: "The primary accent color used throughout the ui.",
			value: "#659affff",
			var_css: "--nt-theme-color",
		},
		{
			type: "color",
			id: "ThemeThr",
			name: "Transparent Theme color",
			description: "A transparent version of the theme color, used for backgrounds and highlights.",
			value: "#659aff33",
			var_css: "--nt-theme-transparent",
		},
		{
			type: "color",
			id: "ThemeFort",
			name: "Theme Accent color",
			description: "A secondary accent color for borders and small details.",
			value: "#659aff66",
			var_css: "--nt-theme-accent",
		},
		{
			type: "color",
			id: "EndScreenBG",
			name: "Video overlay Background (Endscreen)",
			description: "Background color for endscreen elements and video overlays.",
			value: "#00000080",
			var_css: "--nt-endscreen-bg",
		},
		{
			type: "color",
			id: "LeftBar",
			name: "Left Sidebar Background",
			description: "Background color of the main left-hand sidebar.",
			value: "#00000000",
			var_css: "--nt-sidebar-bg",
			constant_css: `
                #guide-inner-content.ytd-app, ytd-mini-guide-renderer {
                    background: var(--nt-sidebar-bg) !important;
                }
            `,
		},
		{
			type: "color",
			id: "Text",
			name: "Main text color",
			description: "The primary text color for general ui text.",
			value: "#ffffffff",
			var_css: "--nt-text-primary",
			constant_css: `
                ytd-watch-flexy, #video-title, #channel-name, .ytd-video-primary-info-renderer, .ytd-video-secondary-info-renderer {
                    color: var(--nt-text-primary) !important;
                }
            `,
		},
		{
			type: "color",
			id: "NdText",
			name: "Secondary text color",
			description: "The secondary text color, used for metadata, descriptions, and less important text.",
			value: "#c4c4c4ff",
			var_css: "--nt-text-secondary",
			constant_css: `
                #metadata-line, .ytd-video-meta-block, #description-text, .ytd-comment-renderer, .yt-formatted-string[is-empty] {
                    color: var(--nt-text-secondary) !important;
                }
            `,
		},
		{
			type: "color",
			id: "LinkColor",
			name: "Link color",
			description: "The color for hyperlinks in descriptions and comments.",
			value: "#5797ffff",
			var_css: "--nt-text-link",
			constant_css: `
                .yt-core-attributed-string__link {
                    color: var(--nt-text-link) !important;
                }
            `,
		},
		{
			type: "color",
			id: "TIMETEXT",
			name: "timestamp text color",
			description: "The color of the text for video timestamps (e.g., on thumbnails).",
			value: "#ffffffff",
			var_css: "--nt-text-timestamp",
			constant_css: `
                ytd-thumbnail-overlay-time-status-renderer {
                    color: var(--nt-text-timestamp) !important;
                }
            `,
		},
		{
			type: "color",
			id: "Chanel_Color",
			name: "Channel name color",
			description: "The color of channel names under video titles.",
			value: "#ffffffff",
			var_css: "--nt-text-channel",
			constant_css: `
                #channel-name .ytd-video-owner-renderer {
                    color: var(--nt-text-channel) !important;
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
                    --yt-spec-brand-background-primary: var(--nt-topbar-bg) !important;
                    --yt-spec-brand-background-solid: var(--nt-bg-main) !important;
                    --yt-spec-general-background-a: var(--nt-bg-main) !important;
                    --yt-spec-call-to-action: var(--nt-theme-color) !important;
                    --yt-spec-suggested-action: var(--nt-theme-accent) !important;
                    --yt-spec-badge-chip-background: var(--nt-theme-accent) !important;
                    --yt-spec-text-primary: var(--nt-text-primary) !important;
                    --yt-spec-text-secondary: var(--nt-text-secondary) !important;
                    --yt-spec-brand-button-background: var(--nt-theme-color) !important;
                    --yt-spec-static-brand-red: var(--nt-theme-color) !important;
                    --yt-spec-brand-icon-inactive: var(--nt-theme-color) !important;
                    --yt-spec-10-percelayer: var(--nt-theme-transparent) !important;
                    --yt-spec-general-background-b: transparent !important;
                    --yt-spec-wordmark-text: var(--nt-text-primary) !important;
                    --yt-spec-button-chip-background-hover: var(--nt-search-bg-hover) !important;
                    --yt-spec-text-primary-inverse: var(--nt-topbar-bg) !important;
                    --yt-spec-static-brand-white: var(--nt-text-primary) !important;
                    --yt-spec-base-background: var(--nt-topbar-bg) !important;
                    --yt-spec-raised-background: var(--nt-topbar-bg) !important;
                    --yt-spec-menu-background: var(--nt-topbar-bg) !important;
                    --yt-spec-static-overlay-text-primary: var(--nt-text-primary) !important;
                    --ytd-author-comment-badge-background-color: var(--nt-theme-transparent) !important;
                    --yt-spec-10-percent-layer: var(--nt-theme-transparent) !important;
                    --yt-spec-static-brand-black: var(--nt-text-primary) !important;
                    --yt-spec-additive-background: var(--nt-theme-transparent) !important;
                    --yt-spec-static-overlay-background-brand: var(--nt-theme-accent) !important;
                    --yt-spec-inverted-background: var(--nt-topbar-bg) !important;
                    --yt-spec-themed-blue: var(--nt-theme-color) !important;
                    --yt-live-chat-vem-background-color: var(--nt-topbar-bg) !important;
                    --ytmusic-background: transparent !important;
                    --yt-spec-themed-green: var(--nt-theme-color) !important;
                }
            `,
		},
	],
};
