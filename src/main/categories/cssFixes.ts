import { Category } from "../../styleshift/types/store";

export const cssFixesCategory: Category = {
	category: "🔧 CSS Engine & Fixes",
	settings: [
		{
			type: "checkbox",
			id: "CoreCssFixes",
			name: "Core Engine",
			description: "Applies the fundamental CSS rules required for NewTube to function. This handles transparency, layout centering, and removes obstructive default YouTube elements. (Highly Recommended)",
			value: true,
			enableCss: `
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
			name: "Custom Scrollbar",
			description: "Replaces YouTube's default scrollbar with a sleek, themed version that matches your selected accent colors and rounding settings.",
			value: true,
			enableCss: `
                @supports selector(::-webkit-scrollbar) {
                    *::-webkit-scrollbar {
                        width: var(--nt-scrollbar-width, 11px) !important;
                        height: var(--nt-scrollbar-width, 11px) !important;
                        background-color: transparent !important;
                        color: var(--nt-theme-color) !important;
                    }
                    *::-webkit-scrollbar-thumb {
                        background-color: var(--nt-theme-color) !important;
                        border-radius: 10px;
                    }
                }
                @supports (scrollbar-width: thin) {
                    * {
                        scrollbar-width: thin !important;
                        scrollbar-color: var(--nt-theme-color) transparent !important;
                    }
                }
            `,
		},
		{
			type: "checkbox",
			id: "ComponentStyleFixes",
			name: "Interface Polish",
			description: "Fine-tunes various UI components like buttons, inputs, and progress spinners. It adds interactive hover states and ensures text selection matches your theme.",
			value: true,
			enableCss: `
                /* General Interaction Fixes */
                yt-interaction { overflow: visible !important; }
                #guide-inner-content { transform: translateZ(0px); }
                .ytp-contextmenu .ytp-menuitem { display: flex !important; align-items: center; }
                .ytp-svg-shadow { stroke: #0000 !important; }
                #hearted-border.ytd-creator-heart-renderer { opacity: 0 !important; }

                /* Selection style */
                ::selection {
                    background-color: var(--nt-theme-color) !important;
                    color: white !important;
                    text-shadow: none !important;
                }

                /* Button & Input Borders */
                tp-yt-paper-button.ytd-expander,
                tp-yt-paper-button.ytd-text-inline-expander,
                .yt-spec-button-shape-next--outline,
                #reply-button-end button,
                #reply-button-end a,
                .yt-spec-button-shape-next--filled,
                .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text,
                [role="search"],
                .ytSearchboxComponentSearchButton {
                    border: 1px solid transparent !important;
                    transition: all 0.2s !important;
                }

                [role="search"]:hover,
                tp-yt-paper-button.ytd-expander:hover,
                tp-yt-paper-button.ytd-text-inline-expander:hover,
                .yt-spec-button-shape-next--outline:hover,
                #reply-button-end button:hover,
                #reply-button-end a:hover,
                .yt-spec-button-shape-next--filled:hover,
                .ytSearchboxComponentInputBox:focus-within {
                    border-color: var(--nt-theme-color) !important;
                }

                /* Misc Fixes */
                .ytp-spinner-circle {
                    border-color: var(--nt-theme-color) var(--nt-theme-color) transparent !important;
                }
                path[stroke="rgb(255,255,255)"] {
                    stroke: var(--nt-theme-color) !important;
                }
            `,
		},
	],
};
