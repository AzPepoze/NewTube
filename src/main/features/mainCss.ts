export const mainCss = `
               .sbflB,.sbsbA,
               #container.style-scope.ytd-masthead,
               ytd-mini-guide-renderer,
               ytd-mini-guide-entry-renderer,
               ytd-page-manager>*.ytd-page-manager,
               #channel-container,
               #channel-header,
               #tabs-inner-container,
               .playlist-items,
               #video-preview-container,
               ytd-simple-menu-header-renderer,
               .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
               #description,
               #player,
               ytd-thumbnail-overlay-resume-playback-renderer,
               .button-container.ytd-rich-shelf-renderer,
               ytd-video-preview,
               ytd-button-renderer.ytd-live-chat-frame,
               #player-container,
               .ytp-endscreen-content,
               ytd-thumbnail-overlay-time-status-renderer badge-shape,
               .ytSearchboxComponentInputBox
               {
                    background: transparent !important;
               }

               .ytSearchboxComponentInputBox
               {
                    border-color: transparent !important;
               }

                yt-interaction{
                    overflow: visible !important;
                }

                #guide-inner-content{
                   transform: translateZ(0px); 
                }

                html:not(.style-scope)[system-icons]:not(.style-scope)
                {
                    background: black !important;
                }

                body {
                    overflow: auto;
                }

                :root {
                    --nt-theme-color: #659aff;
                    --nt-theme-accent: #659aff66;
                    --nt-theme-transparent: #659aff33;
                    
                    --nt-text-primary: #ffffff;
                    --nt-text-secondary: #c4c4c4;
                    --nt-text-link: #659aff;
                    --nt-text-channel: #ffffff;
                    --nt-text-timestamp: #ffffff;

                    --nt-bg-main: #0000005e;
                    --nt-bg-opacity: 80;
                    --nt-bg-repeat: no-repeat;
                    --nt-bg-blur-amount: 10px;
                    
                    --nt-player-bg: #000000b3;
                    --nt-player-radius: 20px;
                    
                    --nt-topbar-bg: #00000080;
                    --nt-search-bg-hover: #ffffff33;
                    
                    --nt-endscreen-bg: #00000080;
                    
                    --nt-timestamp-bg: #00000080;
                    --nt-timestamp-radius: 10px;
                    --nt-timestamp-height: 12px;
                    
                    --nt-border-radius: 10px;
                    --nt-border-width: 8px;
                    --nt-border-color: #099DFF80;
                    
                    --nt-hover-color: #659aff;
                    --nt-click-color: #ffffff;
                    --nt-hover-border-width: 1px;
                    --nt-hover-bg: #659aff80;
                    
                    --nt-zoom-scale: 1.075;

                    --nt-sub-weight: 700;
                    --nt-sub-spacing: 2px;
                    --nt-sub-bg: #00000000;
                    --nt-sub-shadow-color: #000000;
                    --nt-sub-shadow-blur: 2px;
                    --nt-sub-shadow-offset: 0px;
                    --nt-sub-bg-blur-amount: 5px;

                    --nt-timeline-bg: #ffffff20;
                    --nt-timeline-load: #ffffff50;

                    --nt-playlist-hover-bg: #659aff33;
                    --nt-playlist-height-normal: 600px;
                    --nt-playlist-height-theater: 800px;

                    --nt-video-bottom-space: 0px;
                    --nt-watch-zoom: 1;
                    
                    --nt-global-shadow: none;
                    --nt-global-outline: none;
                    --nt-general-blur-amount: 5px;
                    
                    --nt-scrollbar-width: 11px;
                    --nt-scrollbar-track-color: #00000000;

                    --nt-border-minus: calc(var(--nt-border-width) * -1);
                    --nt-hover-border-minus: calc(var(--nt-hover-border-width) * -1);
                }

                .ytp-contextmenu .ytp-menuitem {
                    display: flex !important;
                    align-items: center;
                    flex-direction: row;
                }

                .ytSearchboxComponentInputBox::placeholder {
                    color: var(--nt-text-secondary) !important;
                }

                .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline {
                    background: var(--nt-topbar-bg);
                }

                ytd-text-inline-expander yt-attributed-string a{
                    color: var(--nt-text-link) !important;
                }

                ytd-menu-renderer .ytd-menu-renderer[style-target=button] yt-icon{
                    transition: background 0.2s, transform 0.1s;
                    background: transparent;
                    border-radius: var(--nt-border-radius);
                }

                .ytp-ad-module {
                    width: 0px !important;
                }

                .ytp-chapters-container{
                    flex-wrap: nowrap;
                    display: flex;
                }

                .ytp-gradietop{
                    border-radius: var(--nt-player-radius) var(--nt-player-radius) 0px 0px;
                }
                  
                ytd-menu-renderer .ytd-menu-renderer[style-target=button]:hover yt-icon{
                    background: var(--nt-theme-accent);
                    transform: scale(1.3);
                }

                div.html5-video-player video {
                    position: unset !important;
                }

                div.html5-video-player,
                div.html5-video-player.ytp-fullscreen div.html5-video-container {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }

                div.html5-video-container{
                    position: revert !important;
                    display: flex;
                    align-items: center;
                }

                div.html5-video-player:not(.ytp-fullscreen) div.html5-video-container{
                    width: fit-content !important;
                    margin-top: unset !important;
                    height: fit-content;
                }

                .ytp-right-controls{
                    flex-wrap: nowrap;
                    display: flex;
                }

                .html5-video-container{
                    overflow:hidden;
                }

                #chips-wrapper{
                    background: var(--nt-chips-bg) !important;
                }

                @supports (scrollbar-width: auto) {
                    *{
                        scrollbar-width: thin;
                        scrollbar-color: var(--nt-theme-color) transparent;
                    }

                    ytd-app {
                        scrollbar-width: none;
                    }

                    body::-webkit-scrollbar-track
                    {
                        scrollbar-color: var(--nt-theme-color) var(--nt-scrollbar-track-color) !important;
                    }
                }

                @supports selector(::-webkit-scrollbar) {
                    *::-webkit-scrollbar
                    {
                        width: var(--nt-scrollbar-width) !important;
                        height: var(--nt-scrollbar-width) !important;

                        background-color: transparent !important;
                        color: var(--nt-theme-color) !important;
                    }
                    
                    *::-webkit-scrollbar-thumb
                    {
                        border-radius:10px;
                        background-color: var(--nt-theme-color) !important;
                    }

                    *:not(body)::-webkit-scrollbar-track{
                        background: transparent !important;
                    }

                    ytd-app::-webkit-scrollbar {
                        width: 0px  !important;
                    }

                    body::-webkit-scrollbar-track
                    {
                        background: var(--nt-scrollbar-track-color) !important;
                    }
                }
                
                html[watch-color-update]
                {
                    --yt-spec-general-background-a: transparent !important;
                    background: transparent !important;
                }
                
                ytd-thumbnail-overlay-time-status-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer
                {
                    height: var(--nt-timestamp-height) !important;
                }

                .ytp-time-current, .ytp-time-separator, .ytp-time-duration
                {
                    color: var(--nt-text-primary) !important;
                }
                
                a.thumbnail > .ytcd-basic-item-large-image,
                ytcp-thumbnail-with-title,
                ytd-playlist-thumbnail,
                ytd-thumbnail,
                #thumbnail,
                .thumbnail-container.ytd-notification-renderer,
                yt-img-shadow.ytd-channel-renderer,
                #author-thumbnail.ytd-commesimplebox-renderer,
                .style-scope.ytd-commerenderer.no-transition,
                div.html5-video-player:not(.ytp-fullscreen) .html5-video-container,
                .ytp-preview:not(.ytp-text-detail) span.ytp-tooltip-text-no-title,
                ytd-thumbnail-overlay-side-panel-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer,
                .ytp-popup.ytp-settings-menu,
                .iv-drawer,
                .ytp-cards-teaser-box,
                .miniplayer.ytd-miniplayer,
                .ytp-flyout-cta .ytp-flyout-cta-body,
                #ytp-ad-image,
                .ytp-ad-preview-container,
                .ytp-ad-message-container,
                #guide-content,
                .ytp-ad-skip-button.ytp-button,
                #banner > img,
                #icon > img,
                #action,
                .ytp-show-tiles .ytp-videowall-still,
                #tabs-container,
                yt-confirm-dialog-renderer[dialog],
                .ytp-ce-element.ytp-ce-elemeshow,
                #contentWrapper.tp-yt-iron-dropdown > *,
                .ytp-tooltip-bg,
                .skeleton-bg-color.ytd-ghost-grid-renderer
                {
                    border-collapse: separate;
                    box-shadow: var(--nt-global-shadow);
                    border: var(--nt-global-outline);
                }

                div.html5-video-player:not(.ytp-small-mode){
                    overflow: visible;
                    position: absolute !important;
                }

                #container {
                    position: relative !important;
                }
                
                .ytp-popup.ytp-settings-menu,
                #NEWTUBEBG,
                .NEWTUBEMAIN
                {
                    border-collapse: separate;
                    box-shadow: var(--nt-global-shadow);
                    border: var(--nt-global-outline);
                }
                
                #hearted-border.ytd-creator-heart-renderer
                {
                    opacity:0 !important;
                }
                
                .ytp-svg-shadow
                {
                    stroke: #0000 !important;
                }
                
                .gstl50.sbddA
                {
                    top:56px !important;
                }
                
                html:not(.style-scope)[watch-color-update] {
                    --yt-live-chat-background-color: transparent;
                    --yt-live-chat-header-background-color: var(--yt-spec-brand-background-primary);
                }

                ytd-tabbed-page-header{
                    --yt-lightsource-section1-color: transparent !important;
                }

                .ytp-preview .ytp-tooltip-text-no-title,
                .ytd-thumbnail-overlay-bottom-panel-renderer,
                ytd-thumbnail-overlay-time-status-renderer *{
                    color: var(--nt-text-timestamp) !important;
                }

                tp-yt-paper-slider{
                    --paper-progress-active-color: var(--nt-theme-color) !important;
                }

                tp-yt-paper-button.ytd-expander span,
                .yt-spec-button-shape-next--outline,
                tp-yt-paper-button.ytd-text-inline-expander,
                .yt-spec-button-shape-next--filled,
                #reply-button-end button,
                .ytp-tooltip-text{
                    color: var(--nt-text-primary) !important;
                }

                .ytd-comment-renderer:hover{
                    text-decoration: none !important;
                }

                [role="listbox"] > div:hover{
                    background: var(--nt-theme-transparent) !important;
                    border-color: transparent !important;
                    transition: all 0.1s;
                }

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
                    transition: all 0.1s;
                }

                tp-yt-paper-button.ytd-expander,
                tp-yt-paper-button.ytd-text-inline-expander{
                    padding-inline: 10px !important;
                }

                #text-container.yt-notification-action-renderer{
                    border: 1px solid var(--nt-theme-transparent);
                }

                [role="search"]:hover,
                tp-yt-paper-button.ytd-expander:hover,
                tp-yt-paper-button.ytd-text-inline-expander:hover,
                .yt-spec-button-shape-next--outline:hover,
                #reply-button-end button:hover,
                #reply-button-end a:hover,
                .yt-spec-button-shape-next--filled:hover,
                .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text:hover{
                    border-color: var(--nt-theme-color) !important;
                }

                .watch-skeleton .skeleton-bg-color,
                ytd-author-comment-badge-renderer,
                .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled,
                .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--filled,
                .masthead-skeleton-icon,
                tp-yt-paper-button.ytd-expander,
                tp-yt-paper-button.ytd-text-inline-expander,
                .yt-spec-button-shape-next--outline,
                #reply-button-end button,
                #reply-button-end a:hover,
                .yt-spec-button-shape-next--filled,
                .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text:hover{
                    background: var(--nt-theme-transparent) !important;
                }

                ytd-playlist-panel-video-renderer:hover {
                    background-color: var(--nt-playlist-hover-bg) !important;
                }

                ytd-app,
                .background-gradient,
                ytmusic-app-layout:has(ytmusic-nav-bar[is-search-page]){
                    background: transparent !important;
                }

                span.ytp-tooltip-text-no-title{
                    color: var(--yt-spec-static-brand-white) !important;
                    background: var(--nt-timestamp-bg) !important;
                }
                
                html
                {
                    background:black !important;
                }

                #NewtubeBlurBG{
                    transition: opacity 2s , margin-top 0.1s , margin-left 0.1s;
                }

                #NewtubeVDOCanvas{
                    transition: margin-top 0.1s , margin-left 0.1s;
                }

                html:has(div.html5-video-player.ytp-fullscreen) #NewtubeBlurBG,
                ytmusic-app #background {
                    display: none;
                }
                
                .ytp-preview:not(.ytp-text-detail) span.ytp-tooltip-text-no-title,
                .ytd-thumbnail-overlay-loading-preview-renderer,
                ytd-thumbnail-overlay-inline-unplayable-renderer
                {
                    background-color: var(--nt-timestamp-bg) !important;
                }

                .ytp-preview:not(.ytp-text-detail) span.ytp-tooltip-text-no-title
                {
                    display: block !important;
                }
                
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
                ytd-macro-markers-list-item-renderer
                {
                    transition: all .2s;
                }
                
                tp-yt-paper-button.ytd-subscribeButton-renderer[subscribed]{
                    border-bottom: var(--nt-theme-transparent) !important;
                }
                
                .ytp-ce-expanding-overlay-background,
                .ytp-ce-playlist-count
                {
                    background: var(--nt-endscreen-bg) !important;
                }
                
                [role="listbox"],
                #scrim,
                tp-yt-iron-overlay-backdrop,
                #tabs-container
                {
                    background: var(--nt-topbar-bg) !important;
                }
                
                ytd-thumbnail-overlay-hover-text-renderer
                {
                    background-color: var(--nt-topbar-bg) !important;
                }
                
                #video-preview-container
                {
                    box-shadow: 0px 0px 0px 0px !important;
                }
                
                .sbsbD,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,
                .ytp-menuitem:not([aria-disabled=true]):hover,
                ytd-mini-guide-entry-renderer:hover {
                    background: var(--nt-search-bg-hover) !important;
                    transition: all .2s cubic-bezier(0.1,0.7,1,1);
                }
                
                .gsfs,
                .ytp-ce-channel-metadata,
                .ytp-cards-teaser .ytp-cards-teaser-text,
                .ytp-panel-menu,
                .ytp-ce-website-title, .ytp-ce-merchandise-title,
                #time.ytd-macro-markers-list-item-renderer,
                .yt-core-attributed-string--link-inherit-color
                {
                    color: var(--nt-text-primary) !important;
                }
                
                ytd-multi-page-menu-renderer,
                ytd-player:not(.ytd-video-preview):not(.ytp-player-minimized) .html5-video-player:not(.ytp-fullscreen) .html5-video-container,
                .ytp-offline-slate-background,
                .ytp-storyboard-framepreview,
                .ytp-storyboard-framepreview-img,
                .videowall-endscreen
                {   
                    border-radius: var(--nt-player-radius) !important;
                }

                ytd-video-preview .html5-video-container {
                    border-radius: var(--nt-border-radius) !important;
                }
                
                a.thumbnail > .ytcd-basic-item-large-image,
                ytcp-thumbnail-with-title,
                ytd-playlist-thumbnail,
                ytd-thumbnail,
                #thumbnail,
                .thumbnail-container.ytd-notification-renderer,
                [role="listbox"],
                .ytp-ce-video,
                .ytp-ce-playlist,
                [aria-live="polite"],
                .ytp-tooltip-bg,
                .ytp-tooltip-text.ytp-tooltip-text-no-title,
                .branding-img.iv-click-target,
                .branding-context-container-inner,
                ytd-thumbnail-overlay-bottom-panel-renderer,
                .ytp-progress-list,
                .ytp-play-progress.ytp-swatch-background-color,
                .ytp-load-progress,
                .ytp-hover-progress.ytp-hover-progress-light,
                .style-scope.ytd-subscribeButton-renderer,
                #container.ytd-playlist-panel-renderer,
                .header.ytd-playlist-panel-renderer,
                ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer,
                ytd-live-chat-frame,
                .ytp-ce-playlist-count,
                .ytp-ce-expanding-overlay-background,
                .ytp-popup.ytp-settings-menu,
                .ytp-sb-subscribe, .ytp-sb-unsubscribe,
                .iv-drawer,
                .iv-card, .iv-card a.iv-click-target,
                .ytp-cards-teaser-box,
                .miniplayer.ytd-miniplayer,
                .ytp-popup,
                .badge.ytd-badge-supported-renderer,
                .ytp-ce-website .ytp-ce-expanding-image, .ytp-ce-merchandise .ytp-ce-expanding-image,
                .ytp-flyout-cta .ytp-flyout-cta-body, #ytp-ad-image, .ytp-ad-preview-container, .ytp-ad-message-container, #guide-content, .sbsbD, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, [role="search"], .ytp-ad-skip-button.ytp-button, .ytp-flyout-cta .ytp-flyout-cta-icon, #banner > img, #icon > img, #action, .ytp-cards-teaser, .ytp-ce-video-duration, .ytp-show-tiles .ytp-videowall-still, .ytp-videowall-still-info-content, .ytp-videowall-still-listlabel-mix.ytp-videowall-still-listlabel, .style-scope.ytd-popup-container, #action-companion-ad-info-button.ytd-action-companion-ad-renderer, .ytp-flyout-cta .ytp-flyout-cta-action-button, .ytp-autonav-endscreen-upnext-thumbnail, .ytp-autonav-endscreen-upnext-button, ytd-playlist-panel-video-renderer, ytd-guide-entry-renderer, tp-yt-paper-listbox > *, .ytp-ad-overlay-image, .ytp-ad-button-icon, .ytp-ad-overlay-close-button, .ytp-ad-text-overlay, .ytp-ad-button-icon, .ytp-ad-button-icon, #media-container.ytd-display-ad-renderer, ytd-display-ad-renderer[layout=display-ad-layout-top-landscape-image] #media-badge.ytd-display-ad-renderer, #chips-wrapper.ytd-feed-filter-chip-bar-renderer, ytd-mini-guide-entry-renderer, ytd-video-preview, ytd-toggle-button-renderer, ytd-post-renderer[uses-compact-lockup], ytd-backstage-image-renderer, #tabs-container, ytd-playlist-video-renderer, ytd-miniplayer, ytd-button-renderer, .ytd-thumbnail-overlay-loading-preview-renderer, ytd-thumbnail-overlay-inline-unplayable-renderer, ytd-thumbnail.ytd-rich-grid-media:before, .skeleton-bg-color.ytd-ghost-grid-renderer, .captions-text, #container, [round], ytd-engagemepanel-section-list-renderer, #tooltip, yt-multi-page-menu-section-renderer #items > *, ytd-notification-renderer, #time.ytd-macro-markers-list-item-renderer, ytd-macro-markers-list-item-renderer, .ytp-menuitem, tp-yt-paper-button.ytd-expander, #text-container.yt-notification-action-renderer, tp-yt-paper-button.ytd-text-inline-expander, tp-yt-paper-listbox > * tp-yt-paper-item, .ytp-menuitem, yt-live-chat-text-message-renderer, yt-img-shadow img, ytmusic-player-queue-item, yt-dynamic-text-view-model, .ytp-inline-preview-controls, .ytSearchboxComponentSearchButton, [role="listbox"] > div
                {
                    border-radius: var(--nt-border-radius) !important;
                }

                ytd-engagemepanel-section-list-renderer
                {
                    overflow:hidden;
                }
                
                .ytp-gradient-bottom
                {
                    border-radius: var(--nt-border-radius) var(--nt-border-radius) 0px 0px !important;
                }
                
                #masthead
                {
                    border-radius: 0px 0px var(--nt-border-radius) var(--nt-border-radius) !important;
                }

                path.ytp-large-play-button-bg[d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"]{
                    fill: black !important;
                }

                .ytp-large-play-button.ytp-button:hover > svg > path[d="M 45,24 27,14 27,34"][fill="#fff"] {
                    fill: black !important;
                }

                .ytp-large-play-button.ytp-button:hover path.ytp-large-play-button-bg{
                    filter: drop-shadow(0px 0px 6px black);
                }

                .ytp-large-play-button.ytp-button *{
                    overflow: visible !important;
                }
                
                .ytp-menuitem-icon path:not([fill="none"]),
                .ytd-thumbnail-overlay-hover-text-renderer path,
                .ytd-thumbnail-overlay-bottom-panel-renderer path,
                .ytSearchboxComponentInnerSearchIcon path,
                svg path[fill="#FF0000"],
                svg [fill="#FF0000"],
                svg [fill="#FF0033"],
                svg [fill="red"],
                svg [fill="#F00"],
                button:not(.yt-share-target-renderer) path:not([fill="none"]),
                [role="button"] path,
                [role="option"]:not(.yt-third-party-share-target-section-renderer) path,
                .ytp-heat-map-graph
                {
                    fill: var(--nt-theme-color) !important;
                }

                ytd-author-commebadge-renderer,
                yt-dynamic-text-view-model{
                    background: var(--nt-theme-accent) !important;
                }

                #items > #contents > * .yt-formatted-string,
                paper-ripple,
                ytd-channel-name a,
                .style-scope.ytd-menu-renderer.force-icon-button.style-default-active,
                .badge-style-type-live-now.ytd-badge-supported-renderer, .badge-style-type-starting-soon.ytd-badge-supported-renderer
                {   
                    border-color : var(--nt-theme-color) !important;
                    color: var(--nt-theme-color) !important;
                }

                .badge-style-type-live-now-alternate.ytd-badge-supported-renderer,
                .badge-style-type-verified svg,
                ytd-toggle-button-renderer yt-icon,
                .ytSearchboxComponentInput,
                [role="listbox"] > div,
                [role="search"],
                yt-icon.ytd-compact-link-renderer{
                    color: var(--nt-theme-color) !important;
                }
                
                paper-ripple,
                .ytp-swatch-color,
                a.ytp-ce-link,
                yt-multi-page-menu-section-renderer #items > * yt-icon-shape,
                yt-icon.ytd-toggle-theme-compact-link-renderer {
                    border-radius: var(--nt-border-radius) !important;
                    color: var(--nt-theme-color) !important;
                }
                
                .ytp-swatch-background-color,
                .YtProgressBarLineProgressBarPlayed,
                .YtProgressBarPlayheadProgressBarPlayheadDot,
                .ytp-chrome-controls .ytp-button[aria-pressed]:after,
                .ytp-sb-subscribe, a.ytp-sb-subscribe,
                yt-icon-button.yt-live-chat-item-list-renderer,
                #progress.yt-page-navigation-progress
                {
                    background: var(--nt-theme-color) !important;
                }

                .ytp-settings-button:after{
                    background-color: var(--nt-theme-color) !important;
                }
                
                ytd-thumbnail-overlay-time-status-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer,
                ytd-thumbnail-overlay-side-panel-renderer,
                ytd-thumbnail-overlay-toggle-button-renderer,
                .iv-branding-active .branding-context-container-inner,
                .ytp-ce-video-duration
                {
                    border-radius: var(--nt-timestamp-radius) !important;
                    background-color: var(--nt-timestamp-bg) !important;
                }
                
                *::selection,
                .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox,
                .ytp-volume-slider-handle,
                .ytp-volume-slider-handle:before
                {
                    background: var(--nt-theme-color) !important;
                    color: var(--nt-text-primary) !important;
                }

                #container.ytd-searchbox input.ytd-searchbox,
                .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text,
                #reply-button-end a{
                    color: var(--nt-theme-color) !important;
                }
                
                #container.ytd-searchbox,.yt-ui-ellipsis,.ytp-tooltip.ytp-preview:not(.ytp-text-detail),
                #contentContainer,
                .ytp-videowall-still-info-duration
                {
                    background-color: transparent !important;
                    border-color: transparent !important;
                }

                .ytp-tooltip.ytp-preview {
                    display: flex;
                    align-items: center;
                    flex-direction: column-reverse;
                    width:245px !important;
                }

                .ytp-tooltip-bg{
                    aspect-ratio: 16 / 9;
                }
                
                
                ytd-playlist-sidebar-renderer,
                ytd-two-column-browse-results-renderer,
                ytd-alert-with-button-renderer,
                .caption-window.ytp-caption-window-bottom,
                .ytp-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-text
                {
                    background: transparent !important;
                }
                
                ytd-compact-playlist-renderer:hover>div>ytd-playlist-thumbnail,
                ytd-compact-video-renderer:hover>div>ytd-thumbnail,
                ytd-compact-radio-renderer:hover>div>ytd-thumbnail,
                ytd-thumbnail.ytd-rich-grid-media:hover
                {   
                    outline: solid;
                    outline-color: var(--nt-hover-color) !important;
                    outline-width: var(--nt-hover-border-width) !important;
                }
                
                ytd-thumbnail.ytd-rich-grid-media:active
                {   
                    box-shadow: var(--nt-border-minus) 0 var(--nt-click-color), 0 var(--nt-border-width) var(--nt-click-color), var(--nt-border-width) 0 var(--nt-click-color), 0 var(--nt-border-minus) var(--nt-click-color) !important;
                }
                
                ytd-compact-playlist-renderer:active>div>ytd-playlist-thumbnail,
                ytd-compact-video-renderer:active>div>ytd-thumbnail,
                ytd-compact-radio-renderer:active>div>ytd-thumbnail
                {
                    outline: var(--nt-border-width) solid var(--nt-click-color) !important;
                }
                
                .ytp-chrome-top,
                .ytp-chrome-bottom,
                .ytp-gradient-bottom,
                .ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]) > svg > path,
                ytd-playlist-panel-video-renderer,
                ytd-menu-renderer,
                ytd-menu-service-item-renderer tp-yt-paper-item,
                yt-live-chat-text-message-renderer
                {
                    transition: all .2s !important;
                }
                
                .ytp-autohide:not(.ytp-autohide-active) .ytp-gradietop, .ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-bottom
                {
                    display: block !important;
                }
                
                .ytp-popup.ytp-settings-menu,
                .ytp-gradient-bottom,
                .iv-drawer,
                .ytp-cards-teaser-box,
                .ytp-popup
                {
                    background-color: var(--nt-player-bg) !important;
                }
                
                
                .ytp-button,
                .ytp-cards-button-icon
                {
                    transition: all .2s !important;
                }

                .ytp-tooltip-text-wrapper{
                    transition: margin-block .5s;
                }

                #show-more-button
                {
                    transition: background .2s;
                }

                ytd-app{
                    transition: background 1s;
                }
                
                .ytp-tooltip:not([aria-hidden=true])
                {
                    transform: scale(1) !important;
                }
                
                .ytp-tooltip[aria-hidden=true]
                {
                    transform: scale(1.2) !important;
                }
                
                .ytp-tooltip[aria-hidden=true] > .ytp-tooltip-text-wrapper
                {
                    margin-block: -15px;
                }
                
                .ytp-tooltip:not([aria-hidden=true]) > .ytp-tooltip-text-wrapper
                {
                    margin-block: 0px;
                }
                
                .ytp-chrome-bottom .ytp-button:hover,
                .ytp-replay-button:hover,
                .ytp-cards-button-icon:hover
                {
                    transform: scale(1.5) !important;
                }

                .iv-branding{
                    z-index: 60 !important;
                }

                .iv-branding .ytp-button:hover{
                    transform: scale(1.1) !important;
                }
                
                .ytp-progress-list,
                .YtProgressBarLineProgressBarBackground
                {
                    background: var(--nt-timeline-bg) !important;
                }
                
                .ytp-load-progress,
                .YtProgressBarLineProgressBarLoaded
                {
                    background: var(--nt-timeline-load) !important;
                }
                
                #play
                {
                    display:none !important; 
                }

                #tooltip.tp-yt-paper-tooltip
                {
                    background-color: var(--nt-bg-main) !important;
                }
                
                #tooltip.tp-yt-paper-tooltip
                {
                    color: var(--nt-text-primary) !important;
                }
                
                ytd-compact-radio-renderer > #dismissible > ytd-thumbnail > a > yt-img-shadow > img,
                ytd-playlist-thumbnail > a > #playlist-thumbnails > ytd-playlist-video-thumbnail-renderer > yt-img-shadow > img,
                ytd-playlist-thumbnail > a > div > ytd-playlist-custom-thumbnail-renderer > yt-img-shadow > img,
                .thumbnail-overlay.ytmusic-player-queue-item
                {
                    transition: all .2s ;
                }

                .sbqsC:before {
                    background: transparent !important;
                    width: 0px !important;
                }

                yt-searchbox:has([class*="Focus"]) [role="listbox"]{
                    left: 0px;
                    opacity: 1;
                    pointer-events: all;
                }

                .ytp-chapter-title-prefix {
                    display: none;
                }
                
                .ytp-chapter-title-content {
                    margin-left: 10px;
                }

                .sbsbI{
                    background: black;
                    padding: 5px 10px;
                    border-radius: var(--nt-border-radius);
                    outline: solid white 1px;
                    color: white !important;
                    transition:all 0.2s;
                }
                
                .sbsbI:hover{
                    background: white !important;
                    color: black !important;
                }

                .sbpqsD .sbpqsA{
                    color: var(--nt-theme-color) !important;
                }
                    
                .sbse:not(.sbpqsD) .sbpqsA{
                    color: var(--nt-text-secondary) !important;
                }
                    
                .sbpqsA:before{
                    filter: invert(0.5);
                }

                #guide-content,
                #mini-guide-background{
                    background: var(--nt-bg-main) !important;
                    border-color: transparent !important;
                }

                ytd-action-companion-ad-renderer,
                #container,
                ytd-live-chat-frame
                {
                    border:transparent !important;
                }

                .ytp-gradient-bottom
                {
                    padding: 0px !important;
                    border-radius: var(--nt-player-radius) !important;
                }

                #NewtubeVDOCanvas,
                .song-media-controls{
                    border-radius: var(--nt-player-radius) !important;
                }

                div.html5-video-player.ytp-fullscreen .ytp-gradient-bottom{
                    border-radius: var(--nt-player-radius) var(--nt-player-radius) 0px 0px !important;
                }
                
                ytd-player:has(div.html5-video-player:not(.ytp-fullscreen)){
                    transition: all 1s;
                    top: 0px !important
                }

                div.ended-mode video,
                div.unstarted-mode:not(.ytp-small-mode) video.html5-main-video{
                    background: black;
                }
              
                div.ytp-cued-thumbnail-overlay{
                    overflow:hidden !important;
                    border-radius:10px !important;
                }
              
                div.html5-video-player:not(.ytp-fullscreen),
                #time-status{
                    background:transparent !important;
                }

                #time-status {
                    padding-left: 0px !important;
                }
              
                .badge-style-type-simple.ytd-badge-supported-renderer,
                .badge-style-type-live-now-alternate.ytd-badge-supported-renderer{
                    width: 100%;
                    text-align: center;
                    justify-content: center;
                }
              
                div.html5-video-player:not(.ytp-embed):not(.playing-mode.unstarted-mode) div.ytp-cued-thumbnail-overlay{
                    display:none;
                }
              
                div.unstarted-mode .ytp-cued-thumbnail-overlay .ytp-large-play-button .ytp-large-play-button-bg,
                div.unstarted-mode .ytp-cued-thumbnail-overlay .ytp-large-play-button:hover path[d="M 45,24 27,14 27,34"]
                {
                    fill:black !important;
                }
              
                .badge-style-type-live-now-alternate{
                    padding: 2px !important;
                }
              
                yt-live-chat-message-input-renderer{
                    border-radius: 10px;
                }
                
                ytd-thumbnail-overlay-time-status-renderer{
                    display: flex !important;
                }

                .ytp-spinner-circle{
                    border-color: var(--nt-theme-color) var(--nt-theme-color) transparent !important;
                }

                path[stroke="rgb(255,255,255)"] {
                    stroke: var(--nt-theme-color) !important;
                }

                yt-button-shape button{
                    transition: all 0.2s ease-out;
                }

                .ytp-offline-slate > button{
                    display:none;
                }

                ytd-app > #content{
                    overflow-x: hidden;
                }

                #progress.ytd-thumbnail-overlay-resume-playback-renderer{
                    background: linear-gradient(-70deg, var(--nt-theme-color), var(--nt-theme-transparent) ) !important;
                }

                ytmusic-player-queue-item[play-button-state=playing],
                ytmusic-player-queue-item[play-button-state=paused]{
                    background: linear-gradient(70deg, var(--nt-theme-transparent) , transparent ) !important;
                }

                #thumbnail > #hover-overlays {
                    transition: all .4s;
                    height: 100%;
                    width: 100%;
                    animation-fill-mode: backwards;
                    position: absolute;
                    top: 0;
                    opacity: 0 !important;
                }

                #thumbnail:has(ytd-thumbnail-overlay-time-status-renderer) > #hover-overlays {
                    transform: skewX(-20deg) translateX(30px);
                }
                
                #thumbnail:has(ytd-thumbnail-overlay-bottom-panel-renderer) > #hover-overlays {
                    transform: scale(1.5);
                }
                
                #thumbnail:hover > #hover-overlays {
                    opacity: 1 !important;
                    transform: unset !important;
                }

                #text.ytd-channel-name{
                    transition: all 0.2s;
                    background: transparent;
                }

                ytd-video-owner-renderer #text.ytd-channel-name:hover,
                ytd-video-meta-block #text.ytd-channel-name:hover {
                    background: var(--nt-theme-transparent);
                }
                 
                ytd-video-meta-block #text.ytd-channel-name:not(.complex-string):hover,
                ytd-video-owner-renderer #text.ytd-channel-name:not(.complex-string):hover {
                     padding-inline: 10px;
                }

                .ytp-settings-menu .ytp-menuitem-content,
                #thumbnail-container.ytd-playlist-panel-video-renderer{
                    overflow: visible !important;
                }

                .html5-video-player .ytp-settings-menu:not(.ytpa-ambientlight-settings-menu){
                    transition: opacity 0.5s,transform 0.25s !important;
                    margin-bottom: 20px !important;
                }
                
                .html5-video-player:not(.ytp-settings-shown) .ytp-settings-menu:not(.ytpa-ambientlight-settings-menu){
                    transform: translateX(100px) !important;
                    opacity:0 !important;
                    pointer-events: none !important;
                }

                #below {
                    margin-top: var(--nt-video-bottom-space);
                }

                .playlist-items.ytd-playlist-panel-renderer{
                    transform: translateZ(0);
                }

                html > body{
                    display: initial;
                    overflow-x: hidden;
                }

                body > ytd-player{
                    opacity:0;
                }

                .left-items.ytmusic-player-queue-item{
                    transform: scale(1.5);
                }

                ytmusic-player-queue-item img{
                    object-fit: cover !important;
                }

                .ytp-autonav-toggle-button,
                .ytp-autonav-toggle-button[aria-checked="true"]::after{
                    background-image: none !important;
                }

                .ytp-autonav-toggle-button{
                    background-color: var(--nt-theme-accent) !important;
                }

                .ytp-autonav-toggle-button[aria-checked="true"]::after{
                    background-color: var(--nt-theme-color) !important;
                    -webkit-mask-box-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNyA4LjVhOC41IDguNSAwIDExLTE3IDAgOC41IDguNSAwIDExMTcgMHptLTUgMEw2LjUgNXY3TDEyIDguNXptLTEuODYgMEw3LjUgNi44MnYzLjM2bDIuNjQtMS42OHpNOC41IDE2YTcuNSA3LjUgMCAxMDAtMTUgNy41IDcuNSAwIDAwMCAxNXoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYgOC41YTcuNSA3LjUgMCAxMS0xNSAwIDcuNSA3LjUgMCAwMTE1IDB6bS00IDBMNi41IDEyVjVMMTIgOC41eiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=")
                }

                .ytp-autonav-toggle-button[aria-checked="false"]::after{
                    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PGRlZnMgLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTguNSAxNmE3LjUgNy41IDAgMTAwLTE1IDcuNSA3LjUgMCAwMDAgMTV6IiBmaWxsPSIjNzE3MTcxIiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTcgOC41YTguNSA4LjUgMCAxMS0xNyAwIDguNSA4LjUgMCAwMTE3IDB6bS0xIDBhNy41IDcuNSAwIDExLTE1IDAgNy41IDcuNSAwIDAxMTUgMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGQ9Ik01LjUgMTJoMlY1aC0ydjd6TTkuNSA1djdoMlY1aC0yeiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=")
                }

                ytmusic-player-queue-item{
                    padding-inline: 20px !important;
                    transition: margin .2s ;
                }

                yt-dynamic-text-view-model{
                    text-align: center;
                }

                @keyframes show-box {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                tp-yt-iron-dropdown {
                    transition:  transform .4s,opacity .4s;
                    display: flex !important;
                }

                tp-yt-iron-dropdown:not([aria-hidden="true"]) {
                    animation: show-box .4s;
                }

                tp-yt-iron-dropdown[aria-hidden="true"]{
                    pointer-events: none;
                    opacity: 0 !important;
                    transform: scale(0.9) !important;
                }

                .no-scroll #page-manager{
                    margin-top:0px !important;
                }

                #watch-while-engagement-panel.ytd-reel-video-renderer{
                    width: 100%;
                }

                .ytp-autonav-endscreen-countdown-overlay {
                    position: absolute;
                    height: 100%;
                    top: 0;
                }

                .videowall-endscreen{
                    background: black;
                    height: 100%;
                }

                .video.ytd-miniplayer{
                    background:black;
                }

                html.ytdl-is-fullscreen ytd-app{
                    backface-visibility: hidden;
                }

                ytd-notification-topbar-button-renderer .yt-spec-icon-badge-shape__badge{
                    background: var(--nt-theme-accent) !important;
                    color: var(--nt-theme-color) !important;
                }

                #text.ytd-channel-name{
                    color: var(--nt-text-channel);
                }

                yt-chip-cloud-chip-renderer[selected] #chip-container {
                    background: var(--nt-theme-color) !important;
                }


                yt-chip-cloud-chip-renderer[aria-selected="true"] yt-formatted-string {
                    color: var(--nt-bg-main);
                    font-weight: 900;
                }
`;
