import { Category } from "../../styleshift/types/store";

export const css_fixes_category: Category = {
	category: "🔧 CSS Engine & Fixes",
	settings: [
		{
			type: "checkbox",
			id: "CoreCssFixes",
			name: "Enable Core CSS Engine",
			description:
				"Applies the main CSS rules required for theming to work correctly. It is highly recommended to keep this enabled.",
			value: true,
			enable_css: `
                /* General Layout & Background Fixes */
                body {
                    overflow-x: hidden;
                }
                ytd-app, .background-gradient, ytmusic-app-layout:has(ytmusic-nav-bar[is-search-page]) {
                    background: transparent !important;
                }
                html:not(.style-scope)[system-icons]:not(.style-scope) {
                    background: black !important;
                }
                html[watch-color-update] {
                    --yt-spec-general-background-a: transparent !important;
                    background: transparent !important;
                }

                /* Player & Container Fixes */
                div.html5-video-player, div.html5-video-player.ytp-fullscreen div.html5-video-container {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                div.html5-video-player:not(.ytp-small-mode) {
                    overflow: visible;
                    position: absolute !important;
                }
                div.html5-video-container {
                    position: revert !important;
                }

                /* Hiding Ads & Unwanted elements */
                .ytp-ad-module, #play.ytd-player-legacy-desktop-watch-while-renderer {
                    display: none !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "ScrollbarFixes",
			name: "Enable Scrollbar Styling",
			description: "Applies custom styling to the browser scrollbar.",
			value: true,
			enable_css: `
                @supports selector(::-webkit-scrollbar) {
                    *::-webkit-scrollbar {
                        width: var(--scrollbar-width, 11px) !important;
                        height: var(--scrollbar-width, 11px) !important;
                        background-color: transparent !important;
                        color: var(--theme-color) !important;
                    }
                    *::-webkit-scrollbar-thumb {
                        background-color: var(--theme-color) !important;
                        border-radius: 10px;
                    }
                }
            `,
		},
		{
			type: "checkbox",
			id: "ComponentStyleFixes",
			name: "Enable ui Component Styling",
			description:
				"Applies general theme colors and styles to various ui components like buttons, menus, and popups.",
			value: true,
			enable_css: `
                /* Links */
                ytd-text-inline-expander yt-attributed-string a {
                    color: var(--link-color) !important;
                }
                /* buttons & Chips */
                .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {
                    background: var(--top-bar-and-search-background);
                }
                yt-chip-cloud-chip-renderer[selected] #chip-container {
                    background: var(--theme-color) !important;
                }
                yt-chip-cloud-chip-renderer[aria-selected="true"] yt-formatted-string {
                    color: var(--bg-color);
                    font-weight: 900;
                }
                /* Popups & Menus */
                [role="listbox"], #scrim, tp-yt-iron-overlay-backdrop, #tabs-container, .ytp-popup.ytp-settings-menu {
                    background: var(--top-bar-and-search-background) !important;
                }
                .sbsb_d, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover, .ytp-menuitem:not([aria-disabled=true]):hover {
                    background: var(--search-background-hover) !important;
                }
            `,
		},
	],
};
