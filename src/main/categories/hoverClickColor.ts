import { Category } from "../../styleshift/types/store";

export const hoverClickColorCategory: Category = {
	category: "🖱️ Hover & Click Color",
	settings: [
		{
			type: "color",
			id: "GlobalHoverBackgroundColor",
			name: "Main Hover",
			description: "Sets the background color for most clickable elements when you hover over them, such as menu items and buttons.",
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
			id: "PlaylistHoverBackgroundColor",
			name: "Playlist Hover",
			description: "Specific background color for video items within a playlist when hovered.",
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
			id: "GlobalHoverBorderColor",
			name: "Border Hover",
			description: "The color applied to outlines or shadows when you hover over an interactive element.",
			value: "#099DFFFF",
			varCss: "--nt-hover-color",
		},
		{
			type: "color",
			id: "GlobalClickBorderColor",
			name: "Border Click",
			description: "The temporary color flash for borders or shadows when you click on an element.",
			value: "#ffea00ff",
			varCss: "--nt-click-color",
		},
		{
			type: "checkbox",
			id: "EnableSmoothInteractions",
			name: "Smooth Transitions",
			description: "Enables polished CSS transitions for hovering and clicking, making the interface feel more fluid and responsive.",
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
