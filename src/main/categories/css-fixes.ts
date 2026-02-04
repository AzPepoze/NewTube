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
                }                @supports (scrollbar-width: thin) {
                    * {
                        scrollbar-width: thin !important;
                        scrollbar-color: var(--theme-color) transparent !important;
                    }
                }            `,
		},
		{
			type: "checkbox",
			id: "ComponentStyleFixes",
			name: "Enable ui Component Styling",
			description:
				"Applies general theme colors and styles to various ui components like buttons, menus, and popups.",
			value: true,
			enable_css: `
                /* General Interaction Fixes */
                yt-interaction { overflow: visible !important; }
                #guide-inner-content { transform: translateZ(0px); }
                .ytp-contextmenu .ytp-menuitem { display: flex !important; align-items: center; }
                .ytp-svg-shadow { stroke: #0000 !important; }
                #hearted-border.ytd-creator-heart-renderer { opacity: 0 !important; }

                /* Transparency Fixes from old Update.js */
                .sbfl_b, .sbsb_a, #container.style-scope.ytd-masthead, ytd-mini-guide-renderer, 
                ytd-mini-guide-entry-renderer, ytd-page-manager>*.ytd-page-manager, 
                #channel-container, #channel-header, #tabs-inner-container, .playlist-items, 
                #video-preview-container, ytd-simple-menu-header-renderer, 
                #description, #player, ytd-thumbnail-overlay-resume-playback-renderer, 
                .button-container.ytd-rich-shelf-renderer, ytd-video-preview, 
                ytd-button-renderer.ytd-live-chat-frame, #player-container, .ytp-endscreen-content, 
                ytd-thumbnail-overlay-time-status-renderer badge-shape, .ytSearchboxComponentInputBox,
                ytd-playlist-sidebar-renderer, ytd-two-column-browse-results-renderer, 
                ytd-alert-with-button-renderer, .caption-window.ytp-caption-window-bottom, 
                .ytp-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-text, 
                #masthead {
                    background: transparent !important;
                }

                /* Border Radius Fixes from old Update.js */
                a.thumbnail > .ytcd-basic-item-large-image, ytcp-thumbnail-with-title, 
                ytd-playlist-thumbnail, ytd-thumbnail, #thumbnail, .thumbnail-container.ytd-notification-renderer, 
                [role="listbox"], .ytp-ce-video, .ytp-ce-playlist, [aria-live="polite"], .ytp-tooltip-bg, 
                .ytp-tooltip-text.ytp-tooltip-text-no-title, .branding-img.iv-click-target, 
                .branding-context-container-inner, ytd-thumbnail-overlay-bottom-panel-renderer, 
                .ytp-progress-list, .ytp-play-progress.ytp-swatch-background-color, .ytp-load-progress, 
                .ytp-hover-progress.ytp-hover-progress-light, .style-scope.ytd-subscribe-button-renderer, 
                #container.ytd-playlist-panel-renderer, .header.ytd-playlist-panel-renderer, 
                ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer, 
                ytd-live-chat-frame, .ytp-ce-playlist-count, .ytp-ce-expanding-overlay-background, 
                .ytp-sb-subscribe, .ytp-sb-unsubscribe, .iv-drawer, .iv-card, .iv-card a.iv-click-target, 
                .ytp-cards-teaser-box, .miniplayer.ytd-miniplayer, .ytp-popup, .badge.ytd-badge-supported-renderer, 
                .ytp-ce-website .ytp-ce-expanding-image, .ytp-ce-merchandise .ytp-ce-expanding-image, 
                .ytp-flyout-cta .ytp-flyout-cta-body, #ytp-ad-image, .ytp-ad-preview-container, 
                .ytp-ad-message-container, #guide-content, .sbsb_d, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, 
                [role="search"], .ytp-ad-skip-button.ytp-button, .ytp-flyout-cta .ytp-flyout-cta-icon, 
                #banner > img, #icon > img, #action, .ytp-cards-teaser, .ytp-ce-video-duration, 
                .ytp-show-tiles .ytp-videowall-still, .ytp-videowall-still-info-content, 
                .ytp-videowall-still-listlabel-mix.ytp-videowall-still-listlabel, .style-scope.ytd-popup-container, 
                #action-companion-ad-info-button.ytd-action-companion-ad-renderer, .ytp-flyout-cta .ytp-flyout-cta-action-button, 
                .ytp-autonav-endscreen-upnext-thumbnail, .ytp-autonav-endscreen-upnext-button, 
                ytd-playlist-panel-video-renderer, ytd-guide-entry-renderer, tp-yt-paper-listbox > *, 
                .ytp-ad-overlay-image, .ytp-ad-button-icon, .ytp-ad-overlay-close-button, 
                .ytp-ad-text-overlay, .ytp-ad-button-icon, #media-container.ytd-display-ad-renderer, 
                ytd-display-ad-renderer[layout=display-ad-layout-top-landscape-image] #media-badge.ytd-display-ad-renderer, 
                #chips-wrapper.ytd-feed-filter-chip-bar-renderer, ytd-mini-guide-entry-renderer, ytd-video-preview, 
                ytd-toggle-button-renderer, ytd-post-renderer[uses-compact-lockup], ytd-backstage-image-renderer, 
                #tabs-container, ytd-playlist-video-renderer, ytd-miniplayer, ytd-button-renderer, 
                .ytd-thumbnail-overlay-loading-preview-renderer, ytd-thumbnail-overlay-inline-unplayable-renderer, 
                ytd-thumbnail.ytd-rich-grid-media:before, .skeleton-bg-color.ytd-ghost-grid-renderer, 
                .captions-text, #container, [round], ytd-engagemepanel-section-list-renderer, #tooltip, 
                yt-multi-page-menu-section-renderer #items > *, ytd-notification-renderer, 
                #time.ytd-macro-markers-list-item-renderer, ytd-macro-markers-list-item-renderer, .ytp-menuitem, 
                tp-yt-paper-button.ytd-expander, #text-container.yt-notification-action-renderer, 
                tp-yt-paper-button.ytd-text-inline-expander, tp-yt-paper-listbox > * tp-yt-paper-item, 
                yt-live-chat-text-message-renderer, yt-img-shadow img, ytmusic-player-queue-item, 
                yt-dynamic-text-view-model, .ytp-inline-preview-controls, .ytSearchboxComponentSearchButton, 
                [role="listbox"] > div, .ytp-gradient-bottom, #masthead {
                    border-radius: var(--theme-radius) !important;
                }

                /* Borders & Shadows Fixes */
                a.thumbnail > .ytcd-basic-item-large-image, ytcp-thumbnail-with-title, 
                ytd-playlist-thumbnail, ytd-thumbnail, #thumbnail, .thumbnail-container.ytd-notification-renderer, 
                yt-img-shadow.ytd-channel-renderer, #author-thumbnail.ytd-commesimplebox-renderer, 
                .style-scope.ytd-commerenderer.no-transition, div.html5-video-player:not(.ytp-fullscreen) .html5-video-container, 
                .ytp-preview:not(.ytp-text-detail) span.ytp-tooltip-text-no-title, 
                ytd-thumbnail-overlay-side-panel-renderer, ytd-thumbnail-overlay-bottom-panel-renderer, 
                .ytp-popup.ytp-settings-menu, .iv-drawer, .ytp-cards-teaser-box, 
                .miniplayer.ytd-miniplayer, .ytp-flyout-cta .ytp-flyout-cta-body, #ytp-ad-image, 
                .ytp-ad-preview-container, .ytp-ad-message-container, #guide-content, 
                .ytp-ad-skip-button.ytp-button, #banner > img, #icon > img, #action, 
                .ytp-show-tiles .ytp-videowall-still, #tabs-container, 
                yt-confirm-dialog-renderer[dialog], .ytp-ce-element.ytp-ce-elemeshow, 
                #contentWrapper.tp-yt-iron-dropdown > *, .ytp-tooltip-bg, .skeleton-bg-color.ytd-ghost-grid-renderer {
                    box-shadow: var(--global-style-shadow) !important;
                    border: var(--global-style-outline) !important;
                }

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

                /* Selection style */
                ::selection {
                    background-color: var(--theme-color) !important;
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
                    border-color: var(--theme-color) !important;
                }

                /* Misc Fixes */
                .ytp-spinner-circle {
                    border-color: var(--theme-color) var(--theme-color) transparent !important;
                }
                path[stroke="rgb(255,255,255)"] {
                    stroke: var(--theme-color) !important;
                }
                .ytp-menuitem-icon path:not([fill="none"]),
                .ytd-thumbnail-overlay-hover-text-renderer path,
                .ytd-thumbnail-overlay-bottom-panel-renderer path,
                .ytSearchboxComponentInnerSearchicon path,
                svg path[fill="#FF0000"],
                svg [fill="#FF0000"],
                svg [fill="#FF0033"],
                svg [fill="red"],
                svg [fill="#F00"],
                button:not(.yt-share-target-renderer) path:not([fill="none"]),
                [role="button"] path:not([fill="none"]),
                [role="option"]:not(.yt-third-party-share-target-section-renderer) path:not([fill="none"]),
                .ytp-heat-map-graph,
                .ytp-settings-button:after,
                .ytp-chrome-controls .ytp-button[aria-pressed]:after,
                .ytp-sb-subscribe, 
                a.ytp-sb-subscribe,
                #progress.yt-page-navigation-progress,
                .badge-style-type-verified svg,
                ytd-toggle-button-renderer yt-icon,
                yt-icon-button.yt-live-chat-item-list-renderer,
                tp-yt-paper-slider {
                    fill: var(--theme-color) !important;
                }

                .ytp-swatch-background-color,
                .YtProgressBarLineProgressBarPlayed,
                .YtProgressBarPlayheadProgressBarPlayheadDot,
                .ytp-volume-slider-handle,
                .ytp-volume-slider-handle:before {
                    background: var(--theme-color) !important;
                }
            `,
		},
	],
};
