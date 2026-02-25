export const transparencyLayoutCss = `
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

yt-interaction{
	overflow: visible !important;
}

#guide-inner-content{
	transform: translateZ(0px); 
}

#chips-wrapper{
	background: var(--nt-chips-bg) !important;
}

ytd-app,
.background-gradient,
ytmusic-app-layout:has(ytmusic-nav-bar[is-search-page]){
	background: transparent !important;
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

ytd-playlist-sidebar-renderer,
ytd-two-column-browse-results-renderer,
ytd-alert-with-button-renderer,
.caption-window.ytp-caption-window-bottom,
.ytp-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-text
{
	background: transparent !important;
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

div.html5-video-player:not(.ytp-fullscreen),
#time-status{
	background:transparent !important;
}
`;

export const videoCenteringCss = `
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

.html5-video-container{
	overflow:hidden;
}
`;

export const scrollbarCss = `
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
`;

export const shadowsOutlinesCss = `
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
`;

export const borderRadiusCss = `
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
.ytp-ce-website .ytp-ce-expanding-image,
.ytp-ce-merchandise .ytp-ce-expanding-image
{
	border-radius: var(--nt-border-radius) !important;
}

.ytp-gradient-bottom
{
	border-radius: var(--nt-border-radius) var(--nt-border-radius) 0px 0px !important;
}

#masthead
{
	border-radius: 0px 0px var(--nt-border-radius) var(--nt-border-radius) !important;
}

.ytp-swatch-color,
a.ytp-ce-link,
yt-multi-page-menu-section-renderer #items > * yt-icon-shape,
yt-icon.ytd-toggle-theme-compact-link-renderer {
	border-radius: var(--nt-border-radius) !important;
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

.sbsbI{
	border-radius: var(--nt-border-radius);
}

.ytp-gradient-bottom
{
	border-radius: var(--nt-player-radius) !important;
}

#NewtubeVDOCanvas,
.song-media-controls{
	border-radius: var(--nt-player-radius) !important;
}

div.html5-video-player.ytp-fullscreen .ytp-gradient-bottom{
	border-radius: var(--nt-player-radius) var(--nt-player-radius) 0px 0px !important;
}

div.ytp-cued-thumbnail-overlay{
	border-radius:10px !important;
}

yt-live-chat-message-input-renderer{
	border-radius: 10px;
}
`;

export const accentIntegrationCss = `
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
.ytp-heat-map-graph,
.guide-icon svg
{
	fill: var(--nt-theme-color) !important;
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

*::selection,
.ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox,
.ytp-volume-slider-handle,
.ytp-volume-slider-handle:before
{
	background: var(--nt-theme-color) !important;
	color: var(--nt-text-primary) !important;
}

tp-yt-paper-slider{
	--paper-progress-active-color: var(--nt-theme-color) !important;
}

.ytp-spinner-circle{
	border-color: var(--nt-theme-color) var(--nt-theme-color) transparent !important;
}

path[stroke="rgb(255,255,255)"] {
	stroke: var(--nt-theme-color) !important;
}

#progress.ytd-thumbnail-overlay-resume-playback-renderer{
	background: linear-gradient(-70deg, var(--nt-theme-color), var(--nt-theme-transparent) ) !important;
}

ytmusic-player-queue-item[play-button-state=playing],
ytmusic-player-queue-item[play-button-state=paused]{
	background: linear-gradient(70deg, var(--nt-theme-transparent) , transparent ) !important;
}

ytd-notification-topbar-button-renderer .yt-spec-icon-badge-shape__badge{
	background: var(--nt-theme-accent) !important;
	color: var(--nt-theme-color) !important;
}

yt-chip-cloud-chip-renderer[selected] #chip-container {
	background: var(--nt-theme-color) !important;
}

.sbpqsD .sbpqsA{
	color: var(--nt-theme-color) !important;
}

.ytp-autonav-toggle-button[aria-checked="true"]::after{
	background-color: var(--nt-theme-color) !important;
}

.ytp-autonav-toggle-button{
	background-color: var(--nt-theme-accent) !important;
}

ytd-author-commebadge-renderer,
yt-dynamic-text-view-model{
	background: var(--nt-theme-accent) !important;
}
`;

export const animationsTransitionsCss = `
ytd-menu-renderer .ytd-menu-renderer[style-target=button] yt-icon{
	transition: background 0.2s, transform 0.1s;
}

ytd-menu-renderer .ytd-menu-renderer[style-target=button]:hover yt-icon{
	background: var(--nt-theme-accent);
	transform: scale(1.3);
}

[role="listbox"] > div:hover{
	transition: all 0.1s;
}

tp-yt-paper-button.ytd-expander,
tp-yt-paper-button.ytd-text-inline-expander,
.yt-spec-button-shape-next--outline,
#reply-button-end button,
#reply-button-end a,
.yt-spec-button-shape-next--filled,
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text,
.ytSearchboxComponentSearchButton,
{
	transition: all 0.1s;
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

.ytp-menuitem:not([aria-disabled=true]):hover,
ytd-mini-guide-entry-renderer:hover {
	transition: all .2s cubic-bezier(0.1,0.7,1,1);
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
	transition: all .2s;
}

.ytp-button,
.ytp-cards-button-icon
{
	transition: all .2s;
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

.ytp-chrome-bottom .ytp-button:hover,
.ytp-replay-button:hover,
.ytp-cards-button-icon:hover
{
	transform: scale(1.5) !important;
}

.iv-branding .ytp-button:hover{
	transform: scale(1.1) !important;
}

ytd-compact-radio-renderer > #dismissible > ytd-thumbnail > a > yt-img-shadow > img,
ytd-playlist-thumbnail > a > #playlist-thumbnails > ytd-playlist-video-thumbnail-renderer > yt-img-shadow > img,
ytd-playlist-thumbnail > a > div > ytd-playlist-custom-thumbnail-renderer > yt-img-shadow > img,
.thumbnail-overlay.ytmusic-player-queue-item
{
	transition: all .2s ;
}

.sbsbI{
	transition:all 0.2s;
}

ytd-player:has(div.html5-video-player:not(.ytp-fullscreen)){
	transition: all 1s;
}

yt-button-shape button{
	transition: all 0.2s ease-out;
}

#text.ytd-channel-name{
	transition: all 0.2s;
}

.html5-video-player .ytp-settings-menu:not(.ytpa-ambientlight-settings-menu){
	transition: opacity 0.5s,transform 0.25s !important;
}

ytmusic-player-queue-item{
	transition: margin .2s ;
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
}

tp-yt-iron-dropdown:not([aria-hidden="true"]) {
	animation: show-box .4s;
}
`;

export const playerEnhancementsCss = `
.ytp-gradietop{
	border-radius: var(--nt-player-radius) var(--nt-player-radius) 0px 0px;
}

.ytp-right-controls{
	flex-wrap: nowrap;
	display: flex;
}

.ytp-time-current, .ytp-time-separator, .ytp-time-duration
{
	color: var(--nt-text-primary) !important;
}

.ytp-large-play-button.ytp-button:hover path.ytp-large-play-button-bg{
	filter: drop-shadow(0px 0px 6px black);
}

.ytp-large-play-button.ytp-button *{
	overflow: visible !important;
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

.ytp-gradient-bottom
{
	display: block !important;
	padding: 0px !important;
}

div.ended-mode video,
div.unstarted-mode:not(.ytp-small-mode) video.html5-main-video{
	background: black;
}

div.ytp-cued-thumbnail-overlay{
	overflow:hidden !important;
}

div.unstarted-mode .ytp-cued-thumbnail-overlay .ytp-large-play-button .ytp-large-play-button-bg,
div.unstarted-mode .ytp-cued-thumbnail-overlay .ytp-large-play-button:hover path[d="M 45,24 27,14 27,34"]
{
	fill:black !important;
}

.ytp-autonav-toggle-button,
.ytp-autonav-toggle-button[aria-checked="true"]::after{
	background-image: none !important;
}

.ytp-autonav-toggle-button[aria-checked="true"]::after{
	-webkit-mask-box-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNyA4LjVhOC41IDguNSAwIDExLTE3IDAgOC41IDguNSAwIDExMTcgMHptLTUgMEw2LjUgNXY3TDEyIDguNXptLTEuODYgMEw3LjUgNi44MnYzLjM2bDIuNjQtMS42OHpNOC41IDE2YTcuNSA3LjUgMCAxMDAtMTUgNy41IDcuNSAwIDAwMCAxNXoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYgOC41YTcuNSA3LjUgMCAxMS0xNSAwIDcuNSA3LjUgMCAwMTE1IDB6bS00IDBMNi41IDEyVjVMMTIgOC41eiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=")
}

.ytp-autonav-toggle-button[aria-checked="false"]::after{
	background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PGRlZnMgLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTguNSAxNmE3LjUgNy41IDAgMTAwLTE1IDcuNSA3LjUgMCAwMDAgMTV6IiBmaWxsPSIjNzE3MTcxIiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTcgOC41YTguNSA4LjUgMCAxMS0xNyAwIDguNSA4LjUgMCAwMTE3IDB6bS0xIDBhNy41IDcuNSAwIDExLTE1IDAgNy41IDcuNSAwIDAxMTUgMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGQ9Ik01LjUgMTJoMlY1aC0ydjd6TTkuNSA1djdoMlY1aC0yeiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=")
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
`;

export const uiCleanupCss = `
html:not(.style-scope)[system-icons]:not(.style-scope)
{
	background: black !important;
}

body {
	overflow: auto;
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

.ytp-ad-module {
	width: 0px !important;
}

.ytp-chapters-container{
	flex-wrap: nowrap;
	display: flex;
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
}

tp-yt-paper-button.ytd-expander,
tp-yt-paper-button.ytd-text-inline-expander,
.yt-spec-button-shape-next--outline,
#reply-button-end button,
#reply-button-end a,
.yt-spec-button-shape-next--filled,
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text,
.ytSearchboxComponentSearchButton,
{
	border: 1px solid transparent !important;
}

tp-yt-paper-button.ytd-expander,
tp-yt-paper-button.ytd-text-inline-expander{
	padding-inline: 10px !important;
}

#text-container.yt-notification-action-renderer{
	border: 1px solid var(--nt-theme-transparent);
}

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

.ytp-ce-channel-metadata,
.ytp-cards-teaser .ytp-cards-teaser-text,
.ytp-panel-menu,
.ytp-ce-website-title, .ytp-ce-merchandise-title,
#time.ytd-macro-markers-list-item-renderer,
.yt-core-attributed-string--link-inherit-color
{
	color: var(--nt-text-primary) !important;
}

ytd-engagemepanel-section-list-renderer
{
	overflow:hidden;
}

.ytp-popup.ytp-settings-menu,
.ytp-gradient-bottom,
.iv-drawer,
.ytp-cards-teaser-box,
.ytp-popup
{
	background-color: var(--nt-player-bg) !important;
}

.iv-branding{
	z-index: 60 !important;
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

#tooltip.tp-yt-paper-tooltip
{
	background-color: var(--nt-bg-main) !important;
	color: var(--nt-text-primary) !important;
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
	outline: solid white 1px;
	color: white !important;
}

.sbsbI:hover{
	background: white !important;
	color: black !important;
}

.sbse:not(.sbpqsD) .sbpqsA{
	color: var(--nt-text-secondary) !important;
}
	
.sbpqsA:before{
	filter: invert(0.5);
}

ytd-thumbnail-overlay-time-status-renderer{
	display: flex !important;
}

.ytp-offline-slate > button{
	display:none;
}

ytd-app > #content{
	overflow-x: hidden;
}

#text.ytd-channel-name{
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
	margin-bottom: 20px !important;
}

.html5-video-player:not(.ytp-settings-shown) .ytp-settings-menu:not(.ytpa-ambientlight-settings-menu){
	pointer-events: none !important;
	opacity:0 !important;
	transform: translateX(100px) !important;
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

ytmusic-player-queue-item{
	padding-inline: 20px !important;
}

yt-dynamic-text-view-model{
	text-align: center;
}

tp-yt-iron-dropdown {
	display: flex !important;
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

html.ytdl-is-fullscreen ytd-app{
	backface-visibility: hidden;
}

#text.ytd-channel-name{
	color: var(--nt-text-channel);
}

yt-chip-cloud-chip-renderer[aria-selected="true"] yt-formatted-string {
	color: var(--nt-bg-main);
	font-weight: 900;
}
`;

export const mainCss = transparencyLayoutCss +
	videoCenteringCss +
	scrollbarCss +
	shadowsOutlinesCss +
	borderRadiusCss +
	accentIntegrationCss +
	animationsTransitionsCss +
	playerEnhancementsCss +
	uiCleanupCss;
