import { Category } from "../../styleshift/types/store";

export const hoverClickColorCategory: Category = {
	category: "🖱️ hover/Click color",
	settings: [
		{
			type: "color",
			id: "Themehover",
			name: "Main hover Background color",
			description:
				"The background color for most elements when you hover over them (e.g., menu items, buttons).",
			value: "#659aff80",
			varCss: "--nt-hover-bg",
			constantCss: `
                ytd-guide-entry-renderer:hover,
                tp-yt-paper-item:hover,
                .ytp-menuitem:hover,
                ytd-menu-popup-renderer:not([disable-upgrade]) tp-yt-paper-listbox.ytd-menu-popup-renderer .yt-spec-touch-feedback-shape--touch-response-inverse {
                    background-color: var(--nt-hover-bg) !important;
                }
            `,
		},
		{
			type: "color",
			id: "Playlisthover",
			name: "Playlist hover Background color",
			description: "The background color for videos in a playlist when you hover over them.",
			value: "#659aff80",
			varCss: "--nt-playlist-hover-bg",
			constantCss: `
                ytd-playlist-panel-video-renderer:hover {
                    background-color: var(--nt-playlist-hover-bg) !important;
                }
            `,
		},
		{
			type: "color",
			id: "BorderHoverColor",
			name: "Border hover color",
			description: "The color of the border/shadow when hovering over elements.",
			value: "#099DFFFF",
			varCss: "--nt-hover-color",
		},
		{
			type: "color",
			id: "BorderClickColor",
			name: "Border Click color",
			description: "The color of the border/shadow when clicking on elements.",
			value: "#ffea00ff",
			varCss: "--nt-click-color",
		},
		{
			type: "checkbox",
			id: "Interactions",
			name: "Enable Smooth Interactions",
			description: "Adds transition effects to various UI elements for a smoother experience.",
			value: true,
			enableCss: `
                ytd-live-chat-frame,
                .yt-simple-endpoint.ytd-playlist-panel-video-renderer,
                ytd-guide-entry-renderer,
                ytd-playlist-thumbnail,
                ytd-thumbnail,
                ytd-compact-playlist-renderer,
                ytd-compact-video-renderer,
                ytd-compact-radio-renderer,
                ytd-compact-playlist-renderer>div>div>div>a,
                ytd-compact-video-renderer>div>div>div>a,
                ytd-compact-radio-renderer>div>div>div>a,
                ytd-thumbnail.ytd-rich-grid-media,
                ytd-thumbnail.ytd-rich-grid-media>a,
                #button.ytd-menu-renderer.yt-icon.ytd-menu-renderer,
                ytd-playlist-video-renderer,
                ytd-video-renderer,
                yt-lockup-view-model,
                yt-multi-page-menu-section-renderer #items > *,
                ytd-notification-renderer,
                ytd-macro-markers-list-item-renderer,
                yt-button-shape button,
                ytd-channel-name a,
                #show-more-button
                {
                    transition: all .2s !important;
                }

                ytd-menu-renderer .ytd-menu-renderer[style-target=button]:hover yt-icon {
                    background: var(--nt-theme-accent);
                    transform: scale(1.3);
                }

                /* Channel Name Hover Background */
                ytd-video-owner-renderer #text.ytd-channel-name:hover,
                ytd-video-meta-block #text.ytd-channel-name:hover {
                    background: var(--nt-theme-transparent);
                    border-radius: var(--nt-border-radius);
                }
                
                ytd-video-meta-block #text.ytd-channel-name:not(.complex-string):hover,
                ytd-video-owner-renderer #text.ytd-channel-name:not(.complex-string):hover {
                        padding-inline: 10px;
                }
            `,
		},
	],
};
