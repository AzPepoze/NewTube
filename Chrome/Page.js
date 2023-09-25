/* Yeaaaaaah :3 AzPepoze https://www.youtube.com/channel/UCJ2C0UTfxQo6iGTfudPfoRQ */

Ver = chrome.runtime.getManifest().version
isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

AllFont = ["Roboto", "YouTube Sans", "Roboto Mono"]

if (localStorage["nt-InstallFont"]) {
    delete localStorage["nt-InstallFont"]
}

localStorage["nt-ADDFONT"] = JSON.stringify({
    "[QuoteNoto Sans ThaiQuote]": ["[QuoteNoto Sans ThaiQuote]", "<style> @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@200&display=swap'); </style>"],
    "[QuoteNoto Sans JPQuote,QuoteNoto Sans KRQuote]": ["[QuoteNoto Sans JPQuote,QuoteNoto Sans KRQuote]", "<style> @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@200&family=Noto+Sans+KR:wght@200&display=swap'); </style>"],
    "[QuoteAnnie Use Your TelescopeQuote]": ["[QuoteAnnie Use Your TelescopeQuote]", "<style> @import url('https://fonts.googleapis.com/css2?family=Annie+Use+Your+Telescope&display=swap'); </style>\n"]
})

if (localStorage["nt-ADDFONT"]) {
    SaveAddedFont(UnCompressAddedFont())
}

function DisableForFireFox() {
    localStorage["nt-SearchAnimT"] = "false"
    localStorage["nt-PtranT"] = "false"
    localStorage["nt-ThumbAnimT"] = "false"
    localStorage["nt-ControlUnderVDOT"] = "false"
    localStorage["nt-FlyoutT"] = "false"
}

if (isFirefox) DisableForFireFox()

var RemovedNewLine

function RemoveNewLine(Text) {
    if (Text.includes("\n")) {
        Text = Text.replaceAll("\n", "")
        RemoveNewLine(Text)
    } else {
        RemovedNewLine = Text
    }
}

function UnCompressEnaFont() {
    return JSON.parse(localStorage["nt-EnaFont"])
}

function SaveEnaFont(Save) {
    localStorage["nt-EnaFont"] = JSON.stringify(Save)
}

function UnCompressAddedFont() {
    return JSON.parse(localStorage["nt-ADDFONT"])
}

function SaveAddedFont(Save) {
    Object.keys(Save).forEach(function (ThisKey) {
        RemoveNewLine(Save[ThisKey][1])
        Save[ThisKey][1] = RemovedNewLine
    })
    console.log(Save)
    localStorage["nt-ADDFONT"] = JSON.stringify(Save)

}

var PreloadImg = new Image
PreloadImg.onload = function () {
    SetGlobalBGImage(PreloadImg.src)
}

window.onerror =
    function (msg, source, lineNo, columnNo, error) {
        if (localStorage["nt-ErrorCollectT"] == "true") {
            alert("NEWTUBE_ERROR" +
                "\n\n" + msg +
                "\n" + lineNo)
            return true;
        }
    };

function SetWhenUpdate() {
    presetarray = JSON.parse(localStorage["nt-NUMPRESET"])

    for (obj of ForcePre) {
        if (!presetarray.includes(obj)) {
            presetarray.push(obj)
            break;
        }
    }

    localStorage["nt-NUMPRESET"] = JSON.stringify(presetarray)

    SetNormalPre()
    //------------------------------------------------------

}

ForcePre = [
    "(Current)",
    "(Low PC) Purple",
    "(Low-end PC) Cyan",
    "(SUPER LOW PC) (CSS) Potato machine (less blur)",
    "(SUPER_SUPER LOW PC) (CSS) Potato machine (none blur)",
    "Light Theme",
    "Dark Theme",
    "Black Theme",
    "Pink-Black",
    "Glass",
    "Rainbow",
    "My Waifu ♥",
    "I'm Using :D",
    "Coding"
]

function SetidxTo(Name, Va) {
    store.put(Va, Name)
}

function SetNormalPre() {
    // SetidxTo("PRESETGlass", JSON.stringify(  ))
    SetidxTo("PRESETLight Theme", JSON.stringify(["SubtitleC", "#000000", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ffffff", "CUSTOM", "", "TextC", "#000000", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#ff0000", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#000000", "VDOTEXTC", "#000000", "MediaBGC", "#ffffff", "TimeBGC", "#ffffff", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "50", "Border", "3", "OutShaC", "#000000", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#383838", "CapOutT", "true", "PlaylisthoverO", "27", "ThemeO", "100", "ThemehoverC", "#ff0000", "ThumbHoverColorC", "#ff94f6", "ThemeFortC", "#ff0000", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#ffffff", "BlurBGAM", "10", "SubOutT", "true", "BlurWhatT", "none", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Sha", "ThumbClickO", "100", "ThemehoverO", "25", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#ff0000", "PlaylisthoverC", "#ff0000", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "50", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#ffffff", "ThemeSndC", "#ffffff", "BGO", "100", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "72", "OutShaO", "32", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#ffffff", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", ""]))
    SetidxTo("PRESETDark Theme", JSON.stringify(["SubtitleC", "#ffffff", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#00eeff", "CUSTOM", "", "TextC", "#ffffff", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#ff0000", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeBGC", "#000000", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "50", "Border", "3", "OutShaC", "#000000", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#9e9e9e", "CapOutT", "true", "PlaylisthoverO", "50", "ThemeO", "100", "ThemehoverC", "#ff0000", "ThumbHoverColorC", "#eeff00", "ThemeFortC", "#ff0000", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "10", "SubOutT", "true", "BlurWhatT", "none", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Sha", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#ff0000", "PlaylisthoverC", "#ff0000", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "50", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#000000", "ThemeSndC", "#000000", "BGO", "85", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "72", "OutShaO", "100", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#1a1a1a", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", ""]))
    SetidxTo("PRESETBlack Theme", JSON.stringify(["SubtitleC", "#ff8a8a", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ffffff", "CUSTOM", "", "TextC", "#ffffff", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#ff0000", "FlipT", "false", "BottomGT", "false", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeBGC", "#000000", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "50", "Border", "1", "OutShaC", "#ff0000", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#c4c4c4", "CapOutT", "false", "PlaylisthoverO", "50", "ThemeO", "100", "ThemehoverC", "#ff0000", "ThumbHoverColorC", "#00ffd5", "ThemeFortC", "#ff0000", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "10", "SubOutT", "false", "BlurWhatT", "none", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#ff0000", "PlaylisthoverC", "#ff0000", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "50", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#ffffff", "ThemeSndC", "#000000", "BGO", "70", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "80", "OutShaO", "50", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#000000", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", ""]))
    SetidxTo("PRESETMy Waifu ♥", JSON.stringify(["SubtitleC", "#da8aff", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ff0000", "CUSTOM", "", "TextC", "#ffffff", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#bf70ff", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeBGC", "#000000", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "50", "Border", "1", "OutShaC", "#cd70ff", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#c4c4c4", "CapOutT", "false", "PlaylisthoverO", "50", "ThemeO", "100", "ThemehoverC", "#dc5cff", "ThumbHoverColorC", "#ff00dd", "ThemeFortC", "#c494ff", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "0", "SubOutT", "false", "BlurWhatT", "none", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#b061ff", "PlaylisthoverC", "#d666ff", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "15", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#ffffff", "ThemeSndC", "#000000", "BGO", "70", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "80", "OutShaO", "50", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#000000", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", "https://i.ibb.co/FYPBxC5/1647030608836.jpg"]))
    SetidxTo("PRESET(SUPER_SUPER LOW PC) (CSS) Potato machine (none blur)", JSON.stringify(["VDOBGT", "false", "EnaCUSCSST", 'true', "CUSTOM", ":root {\n    --blur-amount: 10px;\n    --theme: red;\n    --playlist-bg: rgba(255, 0, 0, 0.1);\n    --text-color: #FFF;\n    --nd-text-color: #7D7D7D;\n    --border-width: 1px;\n    --player-bg-border-width: 1px;\n    --border-color: rgba(0, 0, 0, 0);\n    --border-hover-color: red;\n    --border-click-color: #0FF;\n    --bg-color: #000;\n    --in-player-bg-color: rgba(0, 0, 0, 0.5);\n    --top-bar-and-search-background: rgba(0, 0, 0, 0.507);\n    --things-end-on-video: rgba(66, 66, 66, 0.507);\n    --hover-time-background: rgba(0, 0, 0, 0.425);\n    --search-background-hover: rgba(255, 0, 0, 0.5);\n    --theme-radius: 10px;\n    --theme-time-radius: 10px;\n    --theme-radius-big: 20px;\n    --border-minus: calc(var(--border-width) * -1);\n    --bg-border-minus: calc(var(--player-bg-border-width) * -1)\n}\n\nhtml:not(.style-scope),\n:not(.style-scope),\nhtml:not(.style-scope) {\n    --yt-spec-brand-background-primary: var(--top-bar-and-search-background) !important;\n    --yt-spec-brand-background-solid: var(--bg-color) !important;\n    --yt-spec-general-background-a: var(--bg-color) !important;\n    --yt-spec-call-to-action: var(--theme) !important;\n    --yt-spec-badge-chip-background: var(--playlist-bg) !important;\n    --yt-spec-text-primary: var(--text-color) !important;\n    --yt-spec-text-secondary: var(--nd-text-color) !important;\n    --yt-spec-brand-button-background: var(--theme) !important;\n    --yt-spec-static-brand-red: var(--theme) !important;\n    --yt-spec-brand-icon-inactive: var(--theme) !important\n}\n\n#tooltip.tp-yt-paper-tooltip {\n    background-color: var(--bg-color) !important\n}\n\nbody::-webkit-scrollbar,\n.playlist-items.ytd-playlist-panel-renderer::-webkit-scrollbar,\n#guide-inner-content.ytd-app:hover::-webkit-scrollbar {\n    width: 11px !important\n}\n\n.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title {\n    display: block !important;\n    background-color: var(--hover-time-background) !important\n}\n\nytd-live-chat-frame {\n    transition: all .2s cubic-bezier(0, 1, 1, 1) !important\n}\n\n.ytp-ce-expanding-overlay-background,\n.ytp-ce-playlist-count {\n    background: var(--things-end-on-video) !important\n}\n\n.sbdd_b,\n#scrim,\ntp-yt-iron-overlay-backdrop {\n    background: var(--top-bar-and-search-background) !important\n}\n\nytd-thumbnail-overlay-hover-text-renderer {\n    background-color: var(--top-bar-and-search-background) !important\n}\n\n.sbfl_b,\n.sbsb_a,\n#container.style-scope.ytd-masthead {\n    background: transparent !important\n}\n\n.sbsb_d,\n#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,\n#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,\n.ytp-menuitem:not([aria-disabled=true]):hover {\n    background: var(--search-background-hover) !important;\n    transition: all .2s cubic-bezier(0.1, 0.7, 1, 1) !important\n}\n\n.gsfs,\n.ytp-ce-channel-metadata,\n.ytp-cards-teaser .ytp-cards-teaser-text,\n.ytp-panel-menu,\n.ytp-ce-website-title,\n.ytp-ce-merchandise-title {\n    color: var(--text-color) !important\n}\n\n#player,\nytd-multi-page-menu-renderer {\n    border-radius: var(--theme-radius-big) !important\n}\n\na.thumbnail>.ytcd-basic-item-large-image,\nytcp-thumbnail-with-title,\nytd-playlist-thumbnail,\nytd-thumbnail,\n#thumbnail,\n.thumbnail-container.ytd-notification-renderer,\n.sbdd_b,\n.ytp-ce-video,\n.ytp-ce-playlist,\n[aria-live=\"polite\"],\n.ytp-tooltip-bg,\n.ytp-tooltip-text.ytp-tooltip-text-no-title,\n.branding-img.iv-click-target,\n.branding-context-container-inner,\nytd-thumbnail-overlay-bottom-panel-renderer,\n.ytp-progress-list,\n.ytp-play-progress.ytp-swatch-background-color,\n.ytp-load-progress,\n.ytp-hover-progress.ytp-hover-progress-light,\n.ytp-gradient-bottom,\n.style-scope.ytd-subscribe-button-renderer,\n#container.ytd-playlist-panel-renderer,\n.header.ytd-playlist-panel-renderer,\nytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer,\nytd-live-chat-frame,\n.ytp-ce-playlist-count,\n.ytp-ce-expanding-overlay-background,\n.ytp-popup.ytp-settings-menu,\n.ytp-sb-subscribe,\n.ytp-sb-unsubscribe,\n.iv-drawer,\n.iv-card,\n.iv-card a.iv-click-target,\n.ytp-cards-teaser-box,\n.miniplayer.ytd-miniplayer,\n.ytp-popup,\n.badge.ytd-badge-supported-renderer,\n.ytp-ce-website .ytp-ce-expanding-image,\n.ytp-ce-merchandise .ytp-ce-expanding-image,\n.ytp-flyout-cta .ytp-flyout-cta-body,\n#ytp-ad-image,\n.ytp-ad-preview-container,\n.ytp-ad-message-container,\n#guide-content,\n.sbsb_d,\n#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,\n#masthead,\n#search-icon-legacy,\n.ytp-ad-skip-button.ytp-button,\n.ytp-flyout-cta .ytp-flyout-cta-icon,\n#banner>img,\n#icon>img,\n#action,\n.ytp-cards-teaser,\n.ytp-ce-video-duration,\n.ytp-show-tiles .ytp-videowall-still,\n.ytp-videowall-still-info-content,\n.ytp-videowall-still-listlabel-mix.ytp-videowall-still-listlabel,\n.style-scope.ytd-popup-container,\n.style-scope.ytd-miniplayer,\n#action-companion-ad-info-button.ytd-action-companion-ad-renderer,\n.ytp-flyout-cta .ytp-flyout-cta-action-button,\n.ytp-autonav-endscreen-upnext-thumbnail,\n.ytp-autonav-endscreen-upnext-button,\nytd-playlist-panel-video-renderer,\ntp-yt-paper-item.ytd-menu-service-item-renderer,\nytd-menu-service-item-renderer[use-icons],\n.ytp-ad-overlay-image,\n.ytp-ad-button-icon,\n.ytp-ad-overlay-close-button,\n.ytp-ad-text-overlay,\n.ytp-ad-button-icon,\n.ytp-ad-button-icon,\n.html5-video-player .caption-visual-line .ytp-caption-segment:last-child,\n#media-container.ytd-display-ad-renderer,\nytd-display-ad-renderer[layout=display-ad-layout-top-landscape-image] #media-badge.ytd-display-ad-renderer,\n#chips-wrapper.ytd-feed-filter-chip-bar-renderer,\nytd-mini-guide-entry-renderer {\n    border-radius: var(--theme-radius) !important\n}\n\na.thumbnail>.ytcd-basic-item-large-image,\nytcp-thumbnail-with-title,\nytd-playlist-thumbnail,\nytd-thumbnail,\n#thumbnail,\n.thumbnail-container.ytd-notification-renderer,\n#avatar,\n#author-thumbnail.ytd-comment-simplebox-renderer,\n.style-scope.ytd-comment-renderer.no-transition,\n#player,\n.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title,\n#container.ytd-playlist-panel-renderer,\nytd-live-chat-frame,\nytd-thumbnail-overlay-side-panel-renderer,\nytd-thumbnail-overlay-bottom-panel-renderer,\n.ytp-gradient-bottom,\n.ytp-popup.ytp-settings-menu,\n.iv-drawer,\n.ytp-cards-teaser-box,\n.miniplayer.ytd-miniplayer,\n.ytp-flyout-cta .ytp-flyout-cta-body,\n#ytp-ad-image,\n.ytp-ad-preview-container,\n.ytp-ad-message-container,\n#guide-content,\n.ytp-ad-skip-button.ytp-button,\n#banner>img,\n#icon>img,\n#action,\n.ytp-show-tiles .ytp-videowall-still,\nyt-confirm-dialog-renderer[dialog][dialog][dialog],\n.ytp-ce-element.ytp-ce-element-show,\n#contentWrapper.tp-yt-iron-dropdown>* {\n    border-collapse: separate !important;\n    overflow: hidden !important;\n    box-shadow: var(--border-minus) 0 var(--border-color), 0 var(--border-width) var(--border-color), var(--border-width) 0 var(--border-color), 0 var(--border-minus) var(--border-color) !important\n}\n\n.ytp-gradient-bottom,\n.ytp-popup.ytp-settings-menu,\n.ytp-tooltip-bg {\n    box-shadow: var(--player-bg-border-width) 0 var(--border-color), 0 var(--bg-border-minus) var(--border-color), var(--bg-border-minus) 0 var(--border-color), 0 var(--player-bg-border-width) var(--border-color) !important\n}\n\n#text.ytd-channel-name,\nyt-button-renderer.yt-formatted-string.yt-button-renderer,\npaper-ripple,\na.yt-simple-endpoint.yt-formatted-string,\n.style-scope.ytd-menu-renderer.force-icon-button.style-default-active,\n.badge-style-type-live-now.ytd-badge-supported-renderer,\n.badge-style-type-starting-soon.ytd-badge-supported-renderer {\n    border-color: var(--theme) !important;\n    color: var(--theme) !important\n}\n\npaper-ripple,\n.ytp-swatch-color,\na.ytp-ce-link,\nyt-icon.ytd-compact-link-renderer,\nyt-icon.ytd-toggle-theme-compact-link-renderer {\n    border-radius: var(--theme-radius) !important;\n    color: var(--theme) !important\n}\n\n.ytp-swatch-background-color,\n.ytp-settings-button.ytp-hd-quality-badge:after,\n.ytp-chrome-controls .ytp-button[aria-pressed]:after,\n.ytp-sb-subscribe,\na.ytp-sb-subscribe {\n    background-color: var(--theme) !important\n}\n\nytd-thumbnail-overlay-time-status-renderer,\nytd-thumbnail-overlay-side-panel-renderer,\nytd-thumbnail-overlay-toggle-button-renderer,\n.iv-branding-active .branding-context-container-inner,\n.ytp-ce-video-duration {\n    border-radius: var(--theme-time-radius) !important;\n    background-color: var(--hover-time-background) !important\n}\n\na.yt-simple-endpoint.yt-formatted-string::selection,\nspan::selection,\nyt-formatted-string::selection,\n.ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox,\n.ytp-volume-slider-handle,\n.ytp-volume-slider-handle:before {\n    background: var(--theme) !important\n}\n\n#container.ytd-searchbox,\n.yt-ui-ellipsis,\n.ytp-tooltip.ytp-preview:not(.ytp-text-detail),\n#contentContainer,\n.ytp-videowall-still-info-duration {\n    background-color: transparent !important;\n    border-color: transparent !important\n}\n\nytd-playlist-thumbnail,\nytd-thumbnail,\nytd-compact-playlist-renderer,\nytd-compact-video-renderer,\nytd-compact-radio-renderer,\nytd-compact-playlist-renderer>div>div>div>a,\nytd-compact-video-renderer>div>div>div>a,\nytd-compact-radio-renderer>div>div>div>a,\nytd-thumbnail.ytd-rich-grid-media,\nytd-thumbnail.ytd-rich-grid-media>a,\n#button.ytd-menu-renderer.yt-icon.ytd-menu-renderer {\n    transition: all .2s cubic-bezier(0.1, 0.5, 1, 1) !important\n}\n\nytd-thumbnail-overlay-toggle-button-renderer {\n    background-color: transparent\n}\n\nytd-compact-playlist-renderer:hover>div>ytd-playlist-thumbnail,\nytd-compact-video-renderer:hover>div>ytd-thumbnail,\nytd-compact-radio-renderer:hover>div>ytd-thumbnail {\n    box-shadow: var(--border-minus) 0 var(--border-hover-color), 0 var(--border-width) var(--border-hover-color), var(--border-width) 0 var(--border-hover-color), 0 var(--border-minus) var(--border-hover-color) !important\n}\n\nytd-thumbnail.ytd-rich-grid-media:hover {\n    margin-block-start: -15px !important;\n    margin-block-end: 15px !important;\n    box-shadow: var(--border-minus) 0 var(--border-hover-color), 0 var(--border-width) var(--border-hover-color), var(--border-width) 0 var(--border-hover-color), 0 var(--border-minus) var(--border-hover-color) !important\n}\n\nytd-thumbnail.ytd-rich-grid-media:active {\n    box-shadow: var(--border-minus) 0 var(--border-click-color), 0 var(--border-width) var(--border-click-color), var(--border-width) 0 var(--border-click-color), 0 var(--border-minus) var(--border-click-color) !important\n}\n\nytd-compact-playlist-renderer:hover,\nytd-compact-video-renderer:hover,\nytd-compact-radio-renderer:hover {\n    margin-inline-start: -15px !important\n}\n\nytd-compact-playlist-renderer:hover>div>div>div>a,\nytd-compact-video-renderer:hover>div>div>div>a,\nytd-compact-radio-renderer:hover>div>div>div>a {\n    margin-inline-end: 15px !important\n}\n\nytd-compact-playlist-renderer:active>div>ytd-playlist-thumbnail,\nytd-compact-video-renderer:active>div>ytd-thumbnail,\nytd-compact-radio-renderer:active>div>ytd-thumbnail {\n    box-shadow: var(--border-minus) 0 var(--border-click-color), 0 var(--border-width) var(--border-click-color), var(--border-width) 0 var(--border-click-color), 0 var(--border-minus) var(--border-click-color) !important\n}\n\n.ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]):hover>svg>path,\nytd-topbar-logo-renderer>a>div>yt-icon>svg>g>g>path {\n    fill: var(--theme) !important\n}\n\n.ytp-chrome-top,\n.ytp-chrome-bottom,\n.ytp-gradient-bottom,\n.ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true])>svg>path {\n    transition: all .2s cubic-bezier(0, 1, 1, 1) !important\n}\n\n.ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-top,\n.ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-bottom {\n    display: block !important\n}\n\n.ytp-gradient-bottom {\n    height: 30px !important;\n    background-image: none !important\n}\n\n.ytp-popup.ytp-settings-menu,\n.ytp-gradient-bottom,\n.iv-drawer,\n.ytp-cards-teaser-box,\n.ytp-popup,\n.ytp-bezel {\n    background-color: var(--in-player-bg-color) !important\n}\n\n.ytp-gradient-top[aria-hidden=true],\n.ytp-gradient-bottom[aria-hidden=true],\n.ytp-autohide .ytp-gradient-top,\n.ytp-autohide .ytp-gradient-bottom,\n.ytp-autohide .ytp-playlist-menu-button,\n.ytp-autohide .ytp-back-button,\n.ytp-autohide .ytp-title-channel,\n.ytp-autohide .ytp-title,\n.ytp-autohide .ytp-chrome-top .ytp-watch-later-button,\n.ytp-autohide .ytp-chrome-top .ytp-share-button,\n.ytp-autohide .ytp-chrome-top .ytp-copylink-button,\n.ytp-autohide:not(.ytp-cards-teaser-shown) .ytp-cards-button,\n.ytp-autohide .ytp-overflow-button,\n.ytp-autohide .ytp-chrome-bottom,\n.ytp-chrome-top[aria-hidden=true],\n.ytp-chrome-bottom[aria-hidden=true] {\n    margin-block-start: 50px !important;\n    margin-block-end: -50px !important;\n    transition: all .1s cubic-bezier(0.1, 0.5, 1, 0) !important\n}"]))
    SetidxTo("PRESET(SUPER LOW PC) (CSS) Potato machine (less blur)", JSON.stringify(["VDOBGT", "false", "EnaCUSCSST", 'true', "CUSTOM", ":root {\n    --blur-amount: 10px;\n    --theme: red;\n    --playlist-bg: rgba(255, 0, 0, 0.1);\n    --text-color: #FFF;\n    --nd-text-color: #7D7D7D;\n    --border-width: 1px;\n    --player-bg-border-width: 1px;\n    --border-color: rgba(0, 0, 0, 0);\n    --border-hover-color: red;\n    --border-click-color: #0FF;\n    --bg-color: #000;\n    --in-player-bg-color: rgba(0, 0, 0, 0.5);\n    --top-bar-and-search-background: rgba(0, 0, 0, 0.507);\n    --things-end-on-video: rgba(66, 66, 66, 0.507);\n    --hover-time-background: rgba(0, 0, 0, 0.425);\n    --search-background-hover: rgba(255, 0, 0, 0.5);\n    --theme-radius: 10px;\n    --theme-time-radius: 10px;\n    --theme-radius-big: 20px;\n    --border-minus: calc(var(--border-width) * -1);\n    --bg-border-minus: calc(var(--player-bg-border-width) * -1)\n}\n\nhtml:not(.style-scope),\n:not(.style-scope),\nhtml:not(.style-scope) {\n    --yt-spec-brand-background-primary: var(--top-bar-and-search-background) !important;\n    --yt-spec-brand-background-solid: var(--bg-color) !important;\n    --yt-spec-general-background-a: var(--bg-color) !important;\n    --yt-spec-call-to-action: var(--theme) !important;\n    --yt-spec-badge-chip-background: var(--playlist-bg) !important;\n    --yt-spec-text-primary: var(--text-color) !important;\n    --yt-spec-text-secondary: var(--nd-text-color) !important;\n    --yt-spec-brand-button-background: var(--theme) !important;\n    --yt-spec-static-brand-red: var(--theme) !important;\n    --yt-spec-brand-icon-inactive: var(--theme) !important\n}\n\n#tooltip.tp-yt-paper-tooltip {\n    background-color: var(--bg-color) !important\n}\n\nbody::-webkit-scrollbar,\n.playlist-items.ytd-playlist-panel-renderer::-webkit-scrollbar,\n#guide-inner-content.ytd-app:hover::-webkit-scrollbar {\n    width: 11px !important\n}\n\n.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title {\n    display: block !important;\n    background-color: var(--hover-time-background) !important\n}\n\nytd-live-chat-frame {\n    transition: all .2s cubic-bezier(0, 1, 1, 1) !important\n}\n\n.sbdd_b,\n#container.style-scope.ytd-masthead,\nytd-multi-page-menu-renderer,\n.ytp-gradient-bottom,\n.ytp-popup.ytp-settings-menu,\n#chips-wrapper.ytd-feed-filter-chip-bar-renderer,\n.iv-drawer,\n#card.ytd-miniplayer,\nytd-miniplayer,\n.ytp-bezel,\n.ytp-caption-segment,\n.ytp-bezel-text {\n    backdrop-filter: blur(var(--blur-amount)) !important\n}\n\n.ytp-ce-expanding-overlay-background,\n.ytp-ce-playlist-count {\n    background: var(--things-end-on-video) !important\n}\n\n.sbdd_b,\n#scrim,\ntp-yt-iron-overlay-backdrop {\n    background: var(--top-bar-and-search-background) !important\n}\n\nytd-thumbnail-overlay-hover-text-renderer {\n    background-color: var(--top-bar-and-search-background) !important\n}\n\n.sbfl_b,\n.sbsb_a,\n#container.style-scope.ytd-masthead {\n    background: transparent !important\n}\n\n.sbsb_d,\n#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,\n#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,\n.ytp-menuitem:not([aria-disabled=true]):hover {\n    background: var(--search-background-hover) !important;\n    transition: all .2s cubic-bezier(0.1, 0.7, 1, 1) !important\n}\n\n.gsfs,\n.ytp-ce-channel-metadata,\n.ytp-cards-teaser .ytp-cards-teaser-text,\n.ytp-panel-menu,\n.ytp-ce-website-title,\n.ytp-ce-merchandise-title {\n    color: var(--text-color) !important\n}\n\n#player,\nytd-multi-page-menu-renderer {\n    border-radius: var(--theme-radius-big) !important\n}\n\na.thumbnail>.ytcd-basic-item-large-image,\nytcp-thumbnail-with-title,\nytd-playlist-thumbnail,\nytd-thumbnail,\n#thumbnail,\n.thumbnail-container.ytd-notification-renderer,\n.sbdd_b,\n.ytp-ce-video,\n.ytp-ce-playlist,\n[aria-live=\"polite\"],\n.ytp-tooltip-bg,\n.ytp-tooltip-text.ytp-tooltip-text-no-title,\n.branding-img.iv-click-target,\n.branding-context-container-inner,\nytd-thumbnail-overlay-bottom-panel-renderer,\n.ytp-progress-list,\n.ytp-play-progress.ytp-swatch-background-color,\n.ytp-load-progress,\n.ytp-hover-progress.ytp-hover-progress-light,\n.ytp-gradient-bottom,\n.style-scope.ytd-subscribe-button-renderer,\n#container.ytd-playlist-panel-renderer,\n.header.ytd-playlist-panel-renderer,\nytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer,\nytd-live-chat-frame,\n.ytp-ce-playlist-count,\n.ytp-ce-expanding-overlay-background,\n.ytp-popup.ytp-settings-menu,\n.ytp-sb-subscribe,\n.ytp-sb-unsubscribe,\n.iv-drawer,\n.iv-card,\n.iv-card a.iv-click-target,\n.ytp-cards-teaser-box,\n.miniplayer.ytd-miniplayer,\n.ytp-popup,\n.badge.ytd-badge-supported-renderer,\n.ytp-ce-website .ytp-ce-expanding-image,\n.ytp-ce-merchandise .ytp-ce-expanding-image,\n.ytp-flyout-cta .ytp-flyout-cta-body,\n#ytp-ad-image,\n.ytp-ad-preview-container,\n.ytp-ad-message-container,\n#guide-content,\n.sbsb_d,\n#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,\n#masthead,\n#search-icon-legacy,\n.ytp-ad-skip-button.ytp-button,\n.ytp-flyout-cta .ytp-flyout-cta-icon,\n#banner>img,\n#icon>img,\n#action,\n.ytp-cards-teaser,\n.ytp-ce-video-duration,\n.ytp-show-tiles .ytp-videowall-still,\n.ytp-videowall-still-info-content,\n.ytp-videowall-still-listlabel-mix.ytp-videowall-still-listlabel,\n.style-scope.ytd-popup-container,\n.style-scope.ytd-miniplayer,\n#action-companion-ad-info-button.ytd-action-companion-ad-renderer,\n.ytp-flyout-cta .ytp-flyout-cta-action-button,\n.ytp-autonav-endscreen-upnext-thumbnail,\n.ytp-autonav-endscreen-upnext-button,\nytd-playlist-panel-video-renderer,\ntp-yt-paper-item.ytd-menu-service-item-renderer,\nytd-menu-service-item-renderer[use-icons],\n.ytp-ad-overlay-image,\n.ytp-ad-button-icon,\n.ytp-ad-overlay-close-button,\n.ytp-ad-text-overlay,\n.ytp-ad-button-icon,\n.ytp-ad-button-icon,\n.html5-video-player .caption-visual-line .ytp-caption-segment:last-child,\n#media-container.ytd-display-ad-renderer,\nytd-display-ad-renderer[layout=display-ad-layout-top-landscape-image] #media-badge.ytd-display-ad-renderer,\n#chips-wrapper.ytd-feed-filter-chip-bar-renderer,\nytd-mini-guide-entry-renderer {\n    border-radius: var(--theme-radius) !important\n}\n\na.thumbnail>.ytcd-basic-item-large-image,\nytcp-thumbnail-with-title,\nytd-playlist-thumbnail,\nytd-thumbnail,\n#thumbnail,\n.thumbnail-container.ytd-notification-renderer,\n#avatar,\n#author-thumbnail.ytd-comment-simplebox-renderer,\n.style-scope.ytd-comment-renderer.no-transition,\n#player,\n.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title,\n#container.ytd-playlist-panel-renderer,\nytd-live-chat-frame,\nytd-thumbnail-overlay-side-panel-renderer,\nytd-thumbnail-overlay-bottom-panel-renderer,\n.ytp-gradient-bottom,\n.ytp-popup.ytp-settings-menu,\n.iv-drawer,\n.ytp-cards-teaser-box,\n.miniplayer.ytd-miniplayer,\n.ytp-flyout-cta .ytp-flyout-cta-body,\n#ytp-ad-image,\n.ytp-ad-preview-container,\n.ytp-ad-message-container,\n#guide-content,\n.ytp-ad-skip-button.ytp-button,\n#banner>img,\n#icon>img,\n#action,\n.ytp-show-tiles .ytp-videowall-still,\nyt-confirm-dialog-renderer[dialog][dialog][dialog],\n.ytp-ce-element.ytp-ce-element-show,\n#contentWrapper.tp-yt-iron-dropdown>* {\n    border-collapse: separate !important;\n    overflow: hidden !important;\n    box-shadow: var(--border-minus) 0 var(--border-color), 0 var(--border-width) var(--border-color), var(--border-width) 0 var(--border-color), 0 var(--border-minus) var(--border-color) !important\n}\n\n.ytp-gradient-bottom,\n.ytp-popup.ytp-settings-menu,\n.ytp-tooltip-bg {\n    box-shadow: var(--player-bg-border-width) 0 var(--border-color), 0 var(--bg-border-minus) var(--border-color), var(--bg-border-minus) 0 var(--border-color), 0 var(--player-bg-border-width) var(--border-color) !important\n}\n\n#text.ytd-channel-name,\nyt-button-renderer.yt-formatted-string.yt-button-renderer,\npaper-ripple,\na.yt-simple-endpoint.yt-formatted-string,\n.style-scope.ytd-menu-renderer.force-icon-button.style-default-active,\n.badge-style-type-live-now.ytd-badge-supported-renderer,\n.badge-style-type-starting-soon.ytd-badge-supported-renderer {\n    border-color: var(--theme) !important;\n    color: var(--theme) !important\n}\n\npaper-ripple,\n.ytp-swatch-color,\na.ytp-ce-link,\nyt-icon.ytd-compact-link-renderer,\nyt-icon.ytd-toggle-theme-compact-link-renderer {\n    border-radius: var(--theme-radius) !important;\n    color: var(--theme) !important\n}\n\n.ytp-swatch-background-color,\n.ytp-settings-button.ytp-hd-quality-badge:after,\n.ytp-chrome-controls .ytp-button[aria-pressed]:after,\n.ytp-sb-subscribe,\na.ytp-sb-subscribe {\n    background-color: var(--theme) !important\n}\n\nytd-thumbnail-overlay-time-status-renderer,\nytd-thumbnail-overlay-side-panel-renderer,\nytd-thumbnail-overlay-toggle-button-renderer,\n.iv-branding-active .branding-context-container-inner,\n.ytp-ce-video-duration {\n    border-radius: var(--theme-time-radius) !important;\n    background-color: var(--hover-time-background) !important\n}\n\na.yt-simple-endpoint.yt-formatted-string::selection,\nspan::selection,\nyt-formatted-string::selection,\n.ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox,\n.ytp-volume-slider-handle,\n.ytp-volume-slider-handle:before {\n    background: var(--theme) !important\n}\n\n#container.ytd-searchbox,\n.yt-ui-ellipsis,\n.ytp-tooltip.ytp-preview:not(.ytp-text-detail),\n#contentContainer,\n.ytp-videowall-still-info-duration {\n    background-color: transparent !important;\n    border-color: transparent !important\n}\n\nytd-playlist-thumbnail,\nytd-thumbnail,\nytd-compact-playlist-renderer,\nytd-compact-video-renderer,\nytd-compact-radio-renderer,\nytd-compact-playlist-renderer>div>div>div>a,\nytd-compact-video-renderer>div>div>div>a,\nytd-compact-radio-renderer>div>div>div>a,\nytd-thumbnail.ytd-rich-grid-media,\nytd-thumbnail.ytd-rich-grid-media>a,\n#button.ytd-menu-renderer.yt-icon.ytd-menu-renderer {\n    transition: all .2s cubic-bezier(0.1, 0.5, 1, 1) !important\n}\n\nytd-thumbnail-overlay-toggle-button-renderer {\n    background-color: transparent\n}\n\nytd-compact-playlist-renderer:hover>div>ytd-playlist-thumbnail,\nytd-compact-video-renderer:hover>div>ytd-thumbnail,\nytd-compact-radio-renderer:hover>div>ytd-thumbnail {\n    box-shadow: var(--border-minus) 0 var(--border-hover-color), 0 var(--border-width) var(--border-hover-color), var(--border-width) 0 var(--border-hover-color), 0 var(--border-minus) var(--border-hover-color) !important\n}\n\nytd-thumbnail.ytd-rich-grid-media:hover {\n    margin-block-start: -15px !important;\n    margin-block-end: 15px !important;\n    box-shadow: var(--border-minus) 0 var(--border-hover-color), 0 var(--border-width) var(--border-hover-color), var(--border-width) 0 var(--border-hover-color), 0 var(--border-minus) var(--border-hover-color) !important\n}\n\nytd-thumbnail.ytd-rich-grid-media:active {\n    box-shadow: var(--border-minus) 0 var(--border-click-color), 0 var(--border-width) var(--border-click-color), var(--border-width) 0 var(--border-click-color), 0 var(--border-minus) var(--border-click-color) !important\n}\n\nytd-compact-playlist-renderer:hover,\nytd-compact-video-renderer:hover,\nytd-compact-radio-renderer:hover {\n    margin-inline-start: -15px !important\n}\n\nytd-compact-playlist-renderer:hover>div>div>div>a,\nytd-compact-video-renderer:hover>div>div>div>a,\nytd-compact-radio-renderer:hover>div>div>div>a {\n    margin-inline-end: 15px !important\n}\n\nytd-compact-playlist-renderer:active>div>ytd-playlist-thumbnail,\nytd-compact-video-renderer:active>div>ytd-thumbnail,\nytd-compact-radio-renderer:active>div>ytd-thumbnail {\n    box-shadow: var(--border-minus) 0 var(--border-click-color), 0 var(--border-width) var(--border-click-color), var(--border-width) 0 var(--border-click-color), 0 var(--border-minus) var(--border-click-color) !important\n}\n\n.ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]):hover>svg>path,\nytd-topbar-logo-renderer>a>div>yt-icon>svg>g>g>path {\n    fill: var(--theme) !important\n}\n\n.ytp-chrome-top,\n.ytp-chrome-bottom,\n.ytp-gradient-bottom,\n.ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true])>svg>path {\n    transition: all .2s cubic-bezier(0, 1, 1, 1) !important\n}\n\n.ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-top,\n.ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-bottom {\n    display: block !important\n}\n\n.ytp-gradient-bottom {\n    height: 30px !important;\n    background-image: none !important\n}\n\n.ytp-popup.ytp-settings-menu,\n.ytp-gradient-bottom,\n.iv-drawer,\n.ytp-cards-teaser-box,\n.ytp-popup,\n.ytp-bezel {\n    background-color: var(--in-player-bg-color) !important\n}\n\n.ytp-gradient-top[aria-hidden=true],\n.ytp-gradient-bottom[aria-hidden=true],\n.ytp-autohide .ytp-gradient-top,\n.ytp-autohide .ytp-gradient-bottom,\n.ytp-autohide .ytp-playlist-menu-button,\n.ytp-autohide .ytp-back-button,\n.ytp-autohide .ytp-title-channel,\n.ytp-autohide .ytp-title,\n.ytp-autohide .ytp-chrome-top .ytp-watch-later-button,\n.ytp-autohide .ytp-chrome-top .ytp-share-button,\n.ytp-autohide .ytp-chrome-top .ytp-copylink-button,\n.ytp-autohide:not(.ytp-cards-teaser-shown) .ytp-cards-button,\n.ytp-autohide .ytp-overflow-button,\n.ytp-autohide .ytp-chrome-bottom,\n.ytp-chrome-top[aria-hidden=true],\n.ytp-chrome-bottom[aria-hidden=true] {\n    margin-block-start: 50px !important;\n    margin-block-end: -50px !important;\n    transition: all .1s cubic-bezier(0.1, 0.5, 1, 0) !important\n}"]))
    SetidxTo("PRESETPink-Black", JSON.stringify(["SubtitleC", "#ff94f6", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ffffff", "CUSTOM", "", "TextC", "#ffffff", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#ff94f6", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeBGC", "#000000", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "50", "Border", "1", "OutShaC", "#ff94f6", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#c4c4c4", "CapOutT", "false", "PlaylisthoverO", "50", "ThemeO", "100", "ThemehoverC", "#ff94f6", "ThumbHoverColorC", "#ff94f6", "ThemeFortC", "#ff94f6", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "10", "SubOutT", "false", "BlurWhatT", "none", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#ff94f6", "PlaylisthoverC", "#ff94f6", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "50", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#ffffff", "ThemeSndC", "#000000", "BGO", "70", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "50", "OutShaO", "50", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#000000", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", ""]))
    SetidxTo("PRESET(Low PC) Purple", JSON.stringify(["SubtitleC", "#da8aff", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "CenterUDT", "true", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ff0000", "TextC", "#ffffff", "HBTO", "100", "SubtitleO", "100", "IMGS", "100", "ThemeFortC", "#c494ff", "CenterMediaT", "true", "ThemeC", "#bf70ff", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "NVDOC", "1", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeAniT", "true", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "PlayerOutT", "true", "VDOSYT", "true", "ThemeThrO", "20", "Border", "1", "OutShaC", "#cd70ff", "ThumbHoverT", "Slide", "Edge", "10", "Zoom", "1.075", "NdTextC", "#c4c4c4", "ScrollT", "false", "CapOutT", "false", "CapBGO", "80", "BlurWhatT", "main", "ThemehoverC", "#dc5cff", "TIMETEXTC", "#ffffff", "CenterMedia", "true", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "0", "TimeBGC", "#000000", "SubOutT", "false", "NVDOT", "2", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "NVDOB", "50", "NdTextO", "100", "ThemeFortO", "100", "ThemeThrC", "#b061ff", "PlaylisthoverC", "#d666ff", "TimeLoadedO", "50", "CenterUDFT", "true", "CenterTimeT", "true", "IMGY", "15", "BlurAm", "5", "PlayerEdge", "20", "ThemeSndC", "#000000", "BGO", "70", "VDOBGT", "false", "EnaCUSCSST", "false", "BlurSubT", "true", "CUSTOM", "", "OutShaO", "0", "VDOTEXTO", "100", "MediaBGO", "50", "NVDOBGT", "0.4", "ThemeO", "100", "TimeBGO", "50", "VBGT", "true", "TextO", "100", "LoadVDOT", "false", "BGC", "#000000", "TimeH", "18", "Time-LineBGO", "20", "Time-LineBGC", "#ffffff", "TopOutT", "true", "SyncLogoT", "true", "PlaylisthoverO", "50", "ScWidth", "0", "ThumbHoverColorC", "#ff00dd", "BGIMG", ""]))
    SetidxTo("PRESETI'm Using :D", JSON.stringify({ "LinkColorO": "100", "FlipT": "false", "ThemeChipsO": "50", "TimeBGC": "#000000", "IMGSBOX": "100", "AutoEXPIPT": "true", "ThemeFortC": "#b67aff", "VisualT": "false", "TimeH": "18", "SubtitleO": "100", "TimeAniT": "true", "SubtitleC": "#ffffff", "STUPIDME": "true", "DropFrameT": "true", "Font-Noto_Sans_ThaiT": "true", "Font-Noto_Sans_KRT": "true", "IMGS": "100", "SearchAnimT": "true", "SyncLogoT": "true", "ADDCUSTOM": "@keyframes rotating {\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n/*span,img,yt-formatted-string,svg,video,yt-attributed-string {\n  animation: rotating 5s linear infinite;\n}*/\n\n.details.ytd-compact-video-renderer{\n    transform: translateX(30px);\n    opacity: 0;\n    transition: all 0.4s ease-out !important;\n}\n\n#dismissible:hover .details.ytd-compact-video-renderer{\n    transform: translateX(0px);\n    opacity: 1;\n}", "TextC": "#ffffff", "ReplaceYTT": "true", "BGO": "70", "ThumbHoverColorC": "#ff00dd", "MediaBlurT": "false", "ThumbHoverColorO": "100", "Time-LineBGO": "20", "NVDOC": "1", "EndBGC": "#000000", "DelBarT": "true", "Border": "1", "ScWidth": "0", "BelowSpace": "0", "CenterUDFT": "true", "BlurBGAM": "0", "MediaBGO": "49", "ThemehoverC": "#dc5cff", "VDOTEXTO": "100", "NdTextO": "100", "IconFillT": "true", "ScrollT": "true", "ThemeSndO": "67", "AutoPIPT": "true", "Font-Noto_Sans JPT": "false", "LoadVDOT": "false", "ThemeThrC": "#b061ff", "PlaylisthoverO": "50", "TimeBGO": "50", "NVDOT": "2.2", "SubOutT": "false", "SwapRowT": "false", "Font-Material IconsT": "false", "TimeLoadedO": "50", "CenterMedia": "true", "OutShaO": "0", "SPSubScribeBGC": "#ff0000", "ThemehoverO": "50", "HBTO": "100", "CenterUDT": "true", "IMGXBOX": "50", "VDOSmooth": "10", "Font-Roboto_MonoT": "false", "PlaylisthoverC": "#d666ff", "TimeOutT": "false", "ThumbClickC": "#ff0000", "SPSubScribeColorC": "#ffffff", "EnaCUSCSST": "false", "PlayerOutT": "true", "IMGY": "30", "ThumbClickO": "100", "transitionT": "true", "ThemeChipsC": "#000000", "TIMETEXTO": "100", "ConUnderVDOT": "false", "BlurWhatT": "none", "PlayerBorder": "1", "ThumbAnimT": "true", "SPSubScribeBGO": "100", "SndOutT": "true", "OutShaC": "#ff57e9", "ThemeC": "#c680ff", "subShaColorC": "#000000", "Font-YouTube_SansT": "false", "CenterTimeT": "true", "EQT": "true", "LeftBarT": "true", "LeftBar": "true", "NewSubT": "true", "EndBGO": "50", "BGC": "#000000", "CanvasQua": "100", "HoverBorder": "1", "IMGX": "50", "Test": "Test", "Font-AngkorT": "false", "CapBGC": "#000000", "TimeLoadedC": "#ffffff", "Enable": "false", "ControlUnderVDOT": "true", "FlyoutT": "true", "NVDOB": "40", "TIMETEXTC": "#ffffff", "FullTheaterT": "true", "ThemeO": "100", "DelBarDebugT": "false", "CapOutT": "false", "CUSTOM": "", "subSpace": "1", "LinkColorC": "#dd61ff", "LeftBarC": "#000000", "CenterMediaT": "true", "CheckStaticT": "true", "ReplaceYTURL": "https://i.gifer.com/17xo.gif", "ThumbHoverT": "Slide", "subWidth": "700", "RepeatT": "false", "OutOrShaT": "Out", "ThemeSndC": "#000000", "SPSubScribeColorO": "100", "MediaH": "30", "subShaWidth": "0", "BottomGT": "true", "LeftBarO": "0", "TextO": "100", "ThemeThrO": "31", "APIT": "true", "subShaColorO": "100", "TopOutT": "true", "VBGT": "true", "YTSize": "100", "Edge": "10", "subShaBlur": "0", "AutohideBarT": "true", "Font-Material_IconsT": "false", "VDOTEXTC": "#ffffff", "PlayerEdge": "20", "CapBGO": "0", "IMGYBOX": "50", "BlurAm": "10", "PtranT": "true", "Font-Bungee_SpiceT": "false", "VDOBGT": "true", "Font-Noto_Sans_JPT": "true", "Zoom": "1.075", "TimeEdge": "10", "VDOSYT": "true", "MediaSpace": "70", "MediaBGC": "#000000", "NewSub": "true", "NewVDOanimaT": "true", "EnaADDCSST": "false", "NdTextC": "#c4c4c4", "InstallFont": "", "Font-InterT": "false", "SPSubScribeT": "false", "VdoAnimT": "true", "HBTC": "#ffffff", "NVDOBGT": "0.4", "Font-RobotoT": "false", "BlurSubT": "false", "ThemeFortO": "41", "Time-LineBGC": "#ffffff", "BGIMG": "https://i.ibb.co/Hp6mZPw/1695638801433.jpg" }))
    SetidxTo("PRESETCoding", JSON.stringify({ "FlipT": "false", "ThemeChipsO": "59", "TimeBGC": "#000000", "IMGSBOX": "100", "AutoEXPIPT": "true", "ThemeFortC": "#428e94", "VisualT": "false", "TimeH": "18", "SubtitleO": "100", "TimeAniT": "true", "STUPIDME": "true", "SubtitleC": "#ffffff", "Font-Noto_Sans_ThaiT": "true", "Font-Noto_Sans_KRT": "true", "IMGS": "100", "SearchAnimT": "true", "SyncLogoT": "true", "ADDCUSTOM": "", "TextC": "#b3f2ff", "ReplaceYTT": "true", "BGO": "70", "ThumbHoverColorC": "#00fbff", "MediaBlurT": "false", "ThumbHoverColorO": "100", "Time-LineBGO": "20", "NVDOC": "1", "EndBGC": "#000000", "DelBarT": "false", "Border": "1", "CenterUDFT": "true", "MediaBGO": "45", "ScWidth": "0", "BlurBGAM": "0", "ThemehoverC": "#75b8ff", "VDOTEXTO": "100", "NdTextO": "81", "IconFillT": "true", "Font-Noto_Sans JPT": "false", "ScrollT": "true", "AutoPIPT": "true", "ThemeSndO": "75", "LoadVDOT": "false", "ThemeThrC": "#7afff6", "PlaylisthoverO": "50", "Font-Material IconsT": "false", "SubOutT": "false", "SwapRowT": "false", "NVDOT": "2", "TimeBGO": "50", "TimeLoadedO": "50", "CenterMedia": "true", "OutShaO": "0", "SPSubScribeBGC": "#21ca91", "ThemehoverO": "50", "HBTO": "100", "CenterUDT": "true", "IMGXBOX": "50", "Font-Roboto_MonoT": "false", "VDOSmooth": "10", "PlaylisthoverC": "#66c4ff", "SPSubScribeColorC": "#18201f", "ThumbClickC": "#00ffb3", "TimeOutT": "true", "EnaCUSCSST": "false", "PlayerOutT": "true", "IMGY": "50", "ThumbClickO": "100", "transitionT": "true", "ThemeChipsC": "#000000", "TIMETEXTO": "100", "ConUnderVDOT": "false", "BlurWhatT": "all", "PlayerBorder": "1", "ThumbAnimT": "true", "SPSubScribeBGO": "100", "SndOutT": "false", "OutShaC": "#70ffbc", "ThemeC": "#79d6d7", "subShaColorC": "#000000", "Font-YouTube_SansT": "false", "CenterTimeT": "true", "LeftBarT": "true", "LeftBar": "true", "NewSubT": "true", "EndBGO": "50", "BGC": "#18212f", "CanvasQua": "10", "HoverBorder": "1", "IMGX": "50", "Test": "Test", "Font-AngkorT": "false", "CapBGC": "#000000", "TimeLoadedC": "#3d87ff", "Enable": "false", "ControlUnderVDOT": "true", "NVDOB": "50", "TIMETEXTC": "#66ff7f", "ThemeO": "100", "DelBarDebugT": "false", "CapOutT": "false", "CUSTOM": "", "subSpace": "1", "LeftBarC": "#000000", "CenterMediaT": "true", "ReplaceYTURL": "https://th.bing.com/th/id/R.e6cb44c348b25d243ca1e05d291cbcbf?rik=ncCqAqKlpqNIUA&riu=http%3a%2f%2f24.media.tumblr.com%2fc74c26fc85fb6b78cdbba94b00492d58%2ftumblr_n08txah95c1slk289o1_500.gif&ehk=TtQ0KYsuLMIOiIAe3HadRhT2rvnkXMKvV0%2bpxLb4Gds%3d&risl=&pid=ImgRaw&r=0", "ThumbHoverT": "Slide", "RepeatT": "true", "subWidth": "700", "OutOrShaT": "Out", "ThemeSndC": "#000000", "SPSubScribeColorO": "100", "LeftBarO": "0", "BottomGT": "true", "MediaH": "30", "TextO": "85", "subShaWidth": "0", "ThemeThrO": "20", "APIT": "false", "subShaColorO": "100", "TopOutT": "true", "VBGT": "false", "YTSize": "72", "Edge": "10", "AutohideBarT": "true", "Font-Material_IconsT": "false", "subShaBlur": "0", "VDOTEXTC": "#99fff3", "PlayerEdge": "20", "CapBGO": "0", "IMGYBOX": "50", "BlurAm": "5", "PtranT": "true", "Font-Bungee_SpiceT": "false", "VDOBGT": "false", "Font-Noto_Sans_JPT": "true", "Zoom": "1.075", "TimeEdge": "10", "VDOSYT": "true", "MediaBGC": "#000000", "MediaSpace": "70", "NewSub": "true", "NewVDOanimaT": "true", "EnaADDCSST": "false", "NdTextC": "#80ff95", "InstallFont": "", "Font-InterT": "false", "SPSubScribeT": "true", "HBTC": "#00ffe1", "VdoAnimT": "true", "NVDOBGT": "0.4", "Font-RobotoT": "false", "BlurSubT": "false", "ThemeFortO": "56", "Time-LineBGC": "#b8b8b8", "BGIMG": "" }))
}

var Set = document.createElement("button"),
    Collect_Style,
    MODE,
    request,
    LIST,
    CHOOSE,
    IWantTOset,
    ReturnCode,
    ChangeslogMain,
    CanSave = true,
    USEING = `(Current)`,
    ADDScrollEVENT = false,
    VDOBG = false,
    TranHead = false,
    EPar,
    LoopCheck,
    ADDCSS,
    BGSmooth

NTstyle = document.createElement("style");
NTstyle.id = "NEWTUBESTYLE";

var FlyoutStyle = document.createElement("style"),
    FontElement = document.createElement("link")

FontElement.id = "Newtube-CustomFont"

var FontStart = `family=`
var FontResult = []

function FindFontFamily(FontLink) {
    Startidx = FontLink.indexOf(FontStart)
    FontLink = FontLink.substring(Startidx, FontLink.length)
    Endidx = FontLink.indexOf(":")
    if (Endidx == -1) {
        Endidx = FontLink.indexOf("&")
    }
    console.log(Endidx)
    FontName = FontLink.substring(FontStart.length, Endidx)
    FontName = FontName.replaceAll("+", " ")
    console.log(FontName)
    FontResult.push(FontName)
    FontLink = FontLink.substring(Endidx, FontLink.length)
    console.log(FontLink)
    return FontLink
}

function GetAllFont(FontLink) {
    if (FontLink.includes(FontStart)) {
        GetAllFont(FindFontFamily(FontLink))
    } else {
        return FontLink
    }
}

function GetFontName(FontLink) {
    FontResult = []
    GetAllFont(FontLink)
    return FontResult
}

function AddFontToWeb(FontID, FontLink, ThisFontLinkName) {
    ThisLink = document.createElement('link')
    ThisLink.id = FontID
    ThisLink.innerHTML = FontLink
    FontElement.append(ThisLink)
    AddedFont[FontID] = [FontID, FontLink]
    AllFont = AllFont.concat(ThisFontLinkName)
}

function AddListFont(FontLink) {
    AddedFont = UnCompressAddedFont()
    ThisFontLinkName = GetFontName(FontLink)
    FontID = JSON.stringify(ThisFontLinkName)
    FontID = FontID.replaceAll('"', "Quote")
    AddFontToWeb(FontID, FontLink, ThisFontLinkName)
    SaveAddedFont(AddedFont)
}

function RemoveListFont(FontID) {
    AddedFont = UnCompressAddedFont()
    delete AddedFont[FontID]
    console.log(document.getElementById(FontID))
    document.getElementById(FontID).remove()
    FontID = FontID.replaceAll('Quote', '"')
    GetFontArray = JSON.parse(FontID)
    AllFont = AllFont.filter(val => !GetFontArray.includes(val));
    SaveAddedFont(AddedFont)
}

function styleloop() {
    if (document.head == null) {
        setTimeout(() => {
            styleloop()
        }, 10);
    } else {
        document.head.append(NTstyle)
        document.head.append(FlyoutStyle)
        document.head.append(FontElement)

        AddedFont = UnCompressAddedFont()
        Object.keys(AddedFont).forEach(function (TheseFontName) {
            GetFont = AddedFont[TheseFontName]
            AddFontToWeb(GetFont[0], GetFont[1], GetFontName(GetFont[1]))
        })
    }
}

styleloop()

function waitForElmByID(selector) {
    return new Promise(resolve => {
        if (document.getElementById(selector)) {
            return resolve(document.getElementById(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.getElementById(selector)) {
                resolve(document.getElementById(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}


function UpdateIcon() {
    DOwithindexed(function () {
        get = store.get('IconURL')
        get.onsuccess = function (got) {
            icon = document.getElementsByTagName('link')

            Array.from(icon).forEach(e => {
                if (e.getAttribute('rel') == "icon" || e.getAttribute('rel') == "shortcut icon") {
                    e.href = got.target.result
                }
            })
        }
    })
}

window.addEventListener('DOMContentLoaded', () => {
    UpdateIcon()
})

function CheckPar(ThisE) {
    if (LoopCheck != 0 && ThisE != null) {
        if (ThisE.id == "dismissible" || ThisE.id == "wc-endpoint") {
            EPar = ThisE
        } else {
            LoopCheck = LoopCheck - 1
            CheckPar(ThisE.parentNode)
        }
    } else {
        EPar = false
    }
}

Set.innerHTML = "<span>✦</span>";
Set.id = "NEWTUBESET";
Set.style = `display: inline-block;
background-color: transparent;
border: transparent;
color: var(--yt-spec-text-primary);
text-align: center;
font-size: 20px;
transition: all 0.5s;
margin: 5px;
width: 50px;`

async function DOwithindexed(Successdo) {
    let reqdb = window.indexedDB.open("Newtube", 1)

    reqdb.onupgradeneeded = () => {
        reqdb.result.createObjectStore("User_saved")
    }

    reqdb.onsuccess = function () {
        let db
        try {
            db = reqdb.result
        } catch (e) {

        }
        let transaction = db.transaction("User_saved", "readwrite")
        store = transaction.objectStore("User_saved")

        Successdo()

        transaction.oncomplete = function () {
            db.close()
        }
    }
}

function NUllColor(THIS, Color, Opa) {
    SetTo(THIS + 'C', Color)
    SetTo(THIS + 'O', Opa)
}

function SetTo(THIS, DE) {
    if (localStorage["nt-" + THIS] == null) {
        localStorage["nt-" + THIS] = DE
    }
    if (localStorage[THIS] != null) {
        localStorage["nt-" + THIS] = localStorage[THIS]
        localStorage.removeItem(THIS)
    }
}

function SetValueCheck2(Match, IFTRUE, IFFLASE) {
    if (IWantTOset[1] == Match) {
        if (IWantTOset[0] == 'true') {
            ReturnCode = IFTRUE
        }
        else {
            ReturnCode = IFFLASE
        }
    }
}

function SetValueCheck() {

    SetValueCheck2("IconFill", ``, `:not([d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"])`)

    SetValueCheck2("PlayerOut", `.ytp-gradient-bottom,`, ``)

    SetValueCheck2("TopOut", `#masthead,`, ``)

    SetValueCheck2("VdoAnim", `
    div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed) .html5-video-container{
        transition: all 1s ,background 0.1s;
        top: 0px !important
    }
  
    div.ended-mode .html5-video-container,
    div.unstarted-mode:not(.ytp-small-mode) .html5-video-container{
        transform:scale(0.5);
        opacity:0 !important;
    }`, ``)

    SetValueCheck2("TimeOut", `ytd-thumbnail-overlay-time-status-renderer,`, ``)

    SetValueCheck2("SubOut", `tp-yt-paper-button.ytd-subscribe-button-renderer,`, ``)

    SetValueCheck2("CapOut", `.caption-window.ytp-caption-window-bottom,`, ``)

    SetValueCheck2("SndOut", `#chips-wrapper,`, ``)

    SetValueCheck2("CenterTime", `
    ytd-thumbnail-overlay-time-status-renderer
    {
        width: 100% !important;
        margin: 0px !important;
        padding: 0px !important;
        bottom: 0px;
    }
    
    #time-status #text
    {
        margin-left: auto;
        margin-right: auto;
    }

    #time-status {
        width:100% !important;
        position:absolute !important;
    }

    .ytp-ce-video-duration
    {
        width: 97% !important;
        margin: -2px !important;
        text-align:center !important;
    }`, ``)

    SetValueCheck2("BlurSub", `
    .caption-window.ytp-caption-window-bottom
    {
        backdrop-filter: blur(var(--blur-amount)) !important;
    }`, ``)

    SetValueCheck2("Repeat", `background-repeat: repeat !important;`, `background-repeat: no-repeat !important;`)

    SetValueCheck2("BottomG", 'background-image: none !important;', ``)

    SetValueCheck2("FullTheater", `
    #full-bleed-container:has(div.html5-video-player:not(.ytp-fullscreen)){
        height: calc(100vh - 56px) !important;
        max-height: unset !important;
     }`, ``)

    SetValueCheck2("VBG", `#full-bleed-container:has(div.html5-video-player:not(.ytp-fullscreen)),`, ``)

    SetValueCheck2("CenterMedia", `.ytp-chrome-controls {
        display: flex !important;
        flex-direction: row !important;
        justify-content: center !important;
    }

    .ytp-left-controls,
    .ytp-chapter-title.ytp-button,
    .ytp-chapter-container{
        display: contents !important;
    }
    
    .ytp-big-mode .ytp-chrome-controls .ytp-fullerscreen-edu-button.ytp-button{
        display:none !important;
    }`, ``)

    SetValueCheck2("MediaBlur", `.ytp-gradient-bottom{
        backdrop-filter: blur(var(--blur-amount)) !important;
    }`, ``)

    SetValueCheck2("CenterUD", `#title.ytd-watch-metadata,#container.ytd-video-primary-info-renderer {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-block: 30px;
    }
    
    ytd-watch-metadata.ytd-watch-flexy{
        display: flex;
        flex-direction: column;
    }
    
    .style-scope ytd-watch-metadata{
        display: flex;
    }
    
    h1.ytd-watch-metadata{
        text-align: center;
    }`, ``)

    SetValueCheck2("CenterUDF", `.ytp-big-mode .ytp-title-text {
        text-align: center;
    }`, ``)

    SetValueCheck2("TimeAni", `ytd-thumbnail-overlay-time-status-renderer{
        transition:all .2s;
        }
        
        #thumbnail:hover > #overlays > ytd-thumbnail-overlay-time-status-renderer {
        margin-bottom:-20px !important;
    }`, ``)

    SetValueCheck2("Scroll", `#masthead > #background{
        transition: background .2s;
    }`, ``)

    SetValueCheck2("Ptran", `ytd-page-manager:has(div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode)){
        transition: all 0.5s;
    }`, ``)

    SetValueCheck2("SearchAnim", `
    div.gstl_50.sbdd_a{
        display: block !important;
        overflow:hidden;
        transition: all 0.4s ease;
        transform: translate(50px,0);
        pointer-events: none;
        opacity:0;
    }
    
    html:has(input#search:focus) div.gstl_50.sbdd_a{
            transform: none !important;
            pointer-events: visible !important;
            opacity:1 !important;
    }`, ``)

    SetValueCheck2("NewSub", `
    .ytp-caption-segment {
        background: transparent !important;

        filter: drop-shadow(0px 0px 1px var(--sub-sha-color)) drop-shadow(0px 0px var(--sub-ShaBlur) var(--sub-sha-color)) drop-shadow(0px 0px 1px var(--sub-sha-color));

        font-weight: var(--sub-Width);

        letter-spacing: var(--sub-Space);
        color: var(--sub-color) !important;
    }
    
    .captions-text{
        background: var(--sub-bg) !important;
    }

    .caption-window{
        background: transparent !important;
    }
    `, ``)

    SetValueCheck2("SwapRow", `
    #columns{
        display:flex !important;
        flex-direction: row-reverse !important;
    }
    `, ``)

    SetValueCheck2("ThumbAnim", `
    #dismissible:has(.yt-core-image){
        transition: all 1s ease;
        margin-top: 100px !important;
        opacity:0 !important;
    }

    #dismissible:has(.yt-core-image--loaded){
        margin-top: 0px !important;
        opacity:1 !important;
    }
    `, ``)

    SetValueCheck2("SPSubScribe", `
    .ytd-subscribe-button-renderer button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled{
        background: var(--SubSc-BG) !important;
        color: var(--SubSc-Tx) !important;
    }
    `, ``)

    SetValueCheck2("AutohideBar", ``, `
    div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-gradient-bottom,
    div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-chrome-bottom
    {
    margin-left:0px !important;
    opacity: 1 !important;
    }
    
    div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-gradient-bottom
    {
    width:100% !important;
    }
    
    div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-chrome-bottom
    {
    width: calc(100% - 24px) !important;
    }`)

    SetValueCheck2("ControlUnderVDO", `
#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not([nt-flyout]){
    padding-bottom: var(--Media-Space);
}

div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not([nt-flyout]) .ytp-chrome-bottom{
    padding-top: 50px !important;
}

div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode) .ytp-gradient-bottom,
div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode) .ytp-chrome-bottom{
    overflow: hidden !important;
}

.ytp-gradient-bottom[aria-hidden=true],
.ytp-autohide .ytp-gradient-bottom,.ytp-autohide .ytp-playlist-menu-button,
.ytp-autohide .ytp-back-button,
.ytp-autohide .ytp-title-channel,
.ytp-autohide .ytp-title,
.ytp-autohide .ytp-chrome-top .ytp-watch-later-button,
.ytp-autohide .ytp-chrome-top .ytp-share-button,
.ytp-autohide .ytp-chrome-top .ytp-copylink-button,
.ytp-autohide:not(.ytp-cards-teaser-shown) .ytp-cards-button,
.ytp-autohide .ytp-overflow-button,
.ytp-autohide .ytp-chrome-bottom,
.ytp-chrome-top[aria-hidden=true],
.ytp-chrome-bottom[aria-hidden=true]
{
      transition: all 0.5s !important;
      opacity: 0 !important;
      width: 0px !important;
}

.ytp-chrome-bottom,
.ytp-gradient-bottom{
    left: unset !important;
}

#player-wide-container div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed) > .ytp-chrome-bottom,
#player-wide-container div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed) > .ytp-gradient-bottom{
    transform: translate(0px, var(--Media-Space));
}

#player:has(div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed):not(.ytp-small-mode)),
#player-wide-container > #player-container:has(div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed)){
    margin-bottom: var(--Media-Space);
}

div.html5-video-player:not(.ytp-embed):not(.ytp-small-mode) div[aria-live="polite"]{
      top: unset !important;
      bottom: 100px;
}

div.html5-video-player.ytp-embed{
    overflow:hidden !important;
}

#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed):not([nt-flyout]) .ytp-caption-window-container,
#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed):not([nt-flyout]) .ytp-player-content,
#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed):not([nt-flyout]) .ytp-cued-thumbnail-overlay{
      height: calc(100% - var(--Media-Space)) !important;
}

#player-wide-container div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed) .ytp-caption-window-container,
#player-wide-container div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed) .ytp-player-content,
#player-wide-container div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed) .ytp-cued-thumbnail-overlay{
      height: 100% !important;
}

div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode) .ytp-caption-window-bottom{
      margin-bottom: 0px !important;
}

.iv-branding {
    bottom: 10px !important;
}

#player{
    outline: transparent !important;
    box-shadow: 0px 0px 0px 0px transparent !important;
}

ytd-player {
    overflow: visible !important;
}
    `, `
    .ytp-chrome-top,
                .ytp-chrome-bottom,
                .ytp-gradient-bottom,
                .ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]) > svg > path,
                ytd-playlist-panel-video-renderer,
                ytd-menu-renderer
                {
                    transition: all .2s  !important;
                }
                
                .ytp-popup.ytp-settings-menu,
                .ytp-gradient-bottom,
                .iv-drawer,
                .ytp-cards-teaser-box,
                .ytp-popup,
                [aria-live="polite"]
                {
                    background-color: var(--in-player-bg-color) !important;
                }
                
                .ytp-gradient-top[aria-hidden=true], .ytp-gradient-bottom[aria-hidden=true], .ytp-autohide .ytp-gradient-top, .ytp-autohide .ytp-gradient-bottom,.ytp-autohide .ytp-playlist-menu-button, .ytp-autohide .ytp-back-button, .ytp-autohide .ytp-title-channel, .ytp-autohide .ytp-title, .ytp-autohide .ytp-chrome-top .ytp-watch-later-button, .ytp-autohide .ytp-chrome-top .ytp-share-button, .ytp-autohide .ytp-chrome-top .ytp-copylink-button, .ytp-autohide:not(.ytp-cards-teaser-shown) .ytp-cards-button, .ytp-autohide .ytp-overflow-button, .ytp-autohide .ytp-chrome-bottom, .ytp-chrome-top[aria-hidden=true], .ytp-chrome-bottom[aria-hidden=true]
                {
                    margin-block-start: 50px !important;
                    margin-block-end: -50px !important;
                    transition: all .1s cubic-bezier(0.1,0.5,1,0) !important;
                }

        #player{
             overflow: hidden;
        }
    `)
}







function SetValueSelect2(Match, IFCHOOSETHIS, DOTHIS) {
    if (IWantTOset[1] == Match && IWantTOset[0] == IFCHOOSETHIS) {
        ReturnCode = DOTHIS
    }
}


function SetValueSelect() {
    SetValueSelect2("BlurWhat", "all", `
    .sbdd_b,
    #masthead,
    ytd-multi-page-menu-renderer,
    .ytp-popup.ytp-settings-menu,
    #chips-wrapper.ytd-feed-filter-chip-bar-renderer,
    .iv-drawer,
    .branding-context-container-inner
    .ytp-cards-teaser,
    #card.ytd-miniplayer,
    .ytp-popup,
    .ytp-tooltip-text.ytp-tooltip-text-no-title,
    .ytp-ce-playlist-count,
    .ytp-ce-expanding-overlay-background,
    ytd-thumbnail-overlay-bottom-panel-renderer,
    ytd-thumbnail-overlay-time-status-renderer,
    ytd-thumbnail-overlay-toggle-button-renderer,
    #scrim,
    .ytp-ad-preview-container,
    .ytp-ad-message-container,
    ytd-miniplayer,
    .ytp-cards-teaser,
    .ytp-ce-video-duration,
    .ytp-videowall-still-info-content,
    .ytp-videowall-still-listlabel-mix.ytp-videowall-still-listlabel,
    tp-yt-iron-overlay-backdrop.opened,
    .iv-branding-active .branding-context-container-inner,
    .ytp-ce-shadow:not([aria-hidden=true]),
    .ytp-ad-preview-container,
    .ytp-ad-skip-button-container,
    ytd-video-preview,
    #NEWTUBEBG,
    .NEWTUBEBG,
    ytd-thumbnail-overlay-side-panel-renderer,
    .ytd-thumbnail-overlay-loading-preview-renderer,
    ytd-thumbnail-overlay-inline-unplayable-renderer,
    .ytp-tooltip.ytp-text-detail.ytp-preview,
    .ytp-ad-skip-button,
    tp-yt-paper-dialog
    {
        backdrop-filter: blur(var(--blur-amount)) !important;
    }
    
    #thumbnail:has(ytd-thumbnail-overlay-hover-text-renderer) img{
        transition:filter 0.2s;
    }

    #thumbnail:has(ytd-thumbnail-overlay-hover-text-renderer):hover img{
        filter:blur(var(--blur-amount));
    }`)

    SetValueSelect2("BlurWhat", "main", `.sbdd_b,
    #masthead,
    ytd-multi-page-menu-renderer,
    .ytp-popup.ytp-settings-menu,
    #chips-wrapper.ytd-feed-filter-chip-bar-renderer,
    .iv-drawer,
    #card.ytd-miniplayer,
    ytd-miniplayer
    {
        backdrop-filter: blur(var(--blur-amount)) !important;
    }`)
    SetValueSelect2("BlurWhat", "none", `
    * {
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
    }`)





    SetValueSelect2("ThumbHover", "Slide", `#dismissible.ytd-rich-grid-media:hover > ytd-thumbnail
	{   
		margin-block-start: -15px !important;
		margin-block-end: 15px !important;;
	}
	
	ytd-compact-playlist-renderer:hover,
    ytd-compact-video-renderer:hover,
    ytd-compact-radio-renderer:hover,
    ytd-video-renderer:hover,
    ytd-playlist-renderer:hover
    {    
        margin-inline-start: -15px !important;
    }

    ytd-compact-link-renderer:hover
    {    
        margin-inline-start: 15px !important;
    }
    
    ytd-compact-playlist-renderer:hover>div>div>div>a,
    ytd-compact-video-renderer:hover>div>div>div>a,
    ytd-compact-radio-renderer:hover>div>div>div>a
    {
        margin-inline-end: 15px !important;
    }
    
    ytd-playlist-panel-video-renderer:hover > .yt-simple-endpoint.ytd-playlist-panel-video-renderer,
    ytd-guide-entry-renderer:hover
    {
        margin-inline-start: -10px !important;
        margin-inline-end: 10px !important;
    }`)

    SetValueSelect2("ThumbHover", "Zoom", `ytd-thumbnail:hover,
    ytd-playlist-thumbnail:hover
    {   
        transform: scale(var(--Zoom)) !important;
        z-index: 400;
    }`)

    SetValueSelect2("ThumbHover", "Slide&Zoom", `#dismissible.ytd-rich-grid-media:hover > ytd-thumbnail
	{   
		margin-block-start: -15px !important;
		margin-block-end: 15px !important;;
	}
	
	ytd-compact-playlist-renderer:hover,
    ytd-compact-video-renderer:hover,
    ytd-compact-radio-renderer:hover
    {    
        margin-inline-start: -15px !important;
    }
    
    ytd-compact-playlist-renderer:hover>div>div>div>a,
    ytd-compact-video-renderer:hover>div>div>div>a,
    ytd-compact-radio-renderer:hover>div>div>div>a,
    ytd-video-renderer:hover,
    ytd-playlist-renderer:hover
    {
        margin-inline-end: 15px !important;
    }

    ytd-compact-link-renderer:hover
    {
        margin-inline-end: -15px !important;
    }
    
    ytd-thumbnail:hover,
    ytd-playlist-thumbnail:hover
    {   
        transform: scale(var(--Zoom)) !important;
        z-index: 400;
    }
    
    ytd-playlist-panel-video-renderer:hover > .yt-simple-endpoint.ytd-playlist-panel-video-renderer,
    ytd-guide-entry-renderer:hover
    {
        margin-inline-start: -10px !important;
    }`)

    SetValueSelect2("ThumbHover", "none", ``)



    SetValueSelect2("OutOrSha", "Out", JSON.stringify([`outline: solid !important;
	outline-color: var(--border-color) !important;
	outline-width:var(--border-width) !important;`,
        `outline: solid !important;
	outline-color: var(--border-color) !important;
	outline-width:var(--player-bg-border-width) !important;`]))

    SetValueSelect2("OutOrSha", "Sha", JSON.stringify([`box-shadow: var(--border-width) var(--border-width) 10px var(--border-color) !important;`, `box-shadow: var(--player-bg-border-width) var(--player-bg-border-width) 10px var(--border-color) !important;`]))

    SetValueSelect2("OutOrSha", "None", JSON.stringify([`outline-color: transparent !important;`, `outline-color: transparent !important;`]))
}

function GetCodeC(Id) {
    IWantTOset = [localStorage["nt-" + Id + "T"], Id]
    SetValueCheck()
    SetValueSelect()
    return ReturnCode
}

//-----------------------------------------------------------------

function SetNull() {
    SetTo("NUMPRESET", JSON.stringify(ForcePre))
    //Text-------------------------
    SetTo("BlurAm", `5`)
    SetTo("BlurBGAM", '10')

    SetTo("Border", '1')
    SetTo("PlayerBorder", '1')

    SetTo("MediaH", '24')

    SetTo("IMGX", '50')
    SetTo("IMGY", '50')
    SetTo("IMGS", '100')

    SetTo("Edge", '10')
    SetTo("TimeEdge", '10')
    SetTo("PlayerEdge", '20')

    SetTo("Zoom", '1.075')
    SetTo("ScWidth", '11')

    SetTo("HoverBorder", '1')
    SetTo("TimeH", `18`)

    SetTo("SHOWPRESET", true)

    SetTo("CUSTOM", ``)
    SetTo("ADDCUSTOM", ``)
    SetTo("ADDFONT", `{}`)
    SetTo("EnaFont", `[]`)

    SetTo("NVDOB", `40`)
    SetTo("NVDOC", `1`)
    SetTo("NVDOBGT", `0.4`)
    SetTo("NVDOT", `2.2`)

    SetTo("subWidth", `700`)
    SetTo("subSpace", `2`)

    SetTo("subShaWidth", `0`)
    SetTo("subShaBlur", `2`)

    SetTo("MediaSpace", `70`)

    SetTo("CanvasQua", `40`)

    SetTo("ReplaceYTURL", ``)

    SetTo("VDOSmooth", `10`)

    SetTo("YTSize", `100`)

    SetTo("BelowSpace", `0`)

    //Check------------------------

    SetTo("ErrorCollectT", false)

    SetTo("EnaCUSCSST", false)
    SetTo("EnaADDCSST", false)

    SetTo("APIT", false)
    SetTo("RealtimeT", false)
    SetTo("FlipT", false)
    SetTo("EnableButtonT", true)
    SetTo("TopOutT", true)
    SetTo("TimeOutT", true)
    SetTo("PlayerOutT", true)
    SetTo("SubOutT", false)
    SetTo("CapOutT", false)
    SetTo("BlurSubT", false)
    SetTo("RepeatT", false)
    SetTo("CenterTimeT", true)
    SetTo("BottomGT", true)
    SetTo("VBGT", true)
    SetTo("CenterMediaT", true)
    SetTo("MediaBlurT", false)
    SetTo("CenterUDT", true)
    SetTo("CenterUDFT", true)
    SetTo("TimeAniT", true)
    SetTo("ScrollT", true)
    SetTo("VDOBGT", false)
    SetTo("PtranT", false)
    SetTo("SwapRowT", false)
    SetTo("ThumbAnimT", true)

    SetTo("VDOSYT", true)

    SetTo("NewSubT", true)

    SetTo("VisualT", false)
    SetTo("NewVDOanimaT", false)

    SetTo("ControlUnderVDOT", true)

    SetTo("AutoPIPT", true)
    SetTo("AutoEXPIPT", true)

    SetTo("IconFillT", true)
    SetTo("SPSubScribeT", false)

    SetTo("DelBarT", false)
    SetTo("DelBarDebugT", false)

    SetTo("AutohideBarT", true)
    SetTo("SearchAnimT", true)

    SetTo("ReplaceYTT", false)

    SetTo("VdoAnimT", true)
    SetTo("SndOutT", false)

    SetTo("EQT", false)

    SetTo("FullTheaterT", false)

    SetTo("DropFrameT", true)
    SetTo("CheckStaticT", true)

    SetTo("FlyoutT", true)

    //Select------------------------

    SetTo("BlurWhatT", "none")
    SetTo("ThumbHoverT", "Slide")
    SetTo("OutOrShaT", "Sha")

    //Color------------------------

    NUllColor("Theme", `#659aff`, `100`)
    NUllColor("ThemeSnd", `#000000`, `50`)
    NUllColor("ThemeThr", `#659aff`, `20`)
    NUllColor("ThemeFort", `#659aff`, `20`)
    NUllColor("ThemeChips", `#000000`, `50`)

    NUllColor("OutSha", `#000000`, `50`)
    NUllColor("BG", `#000000`, `70`)
    NUllColor("Themehover", `#659aff`, `50`)
    NUllColor("Playlisthover", `#659aff`, `50`)
    NUllColor("Subtitle", `#ffffff`, `100`)

    NUllColor("Time-LineBG", `#ffffff`, `20`)
    NUllColor("TimeLoaded", `#ffffff`, `50`)

    NUllColor("MediaBG", `#000000`, `50`)

    NUllColor("TimeBG", `#000000`, `50`)

    NUllColor("ThumbHoverColor", `#659aff`, `100`)

    NUllColor("ThumbClick", `#ffffff`, `100`)

    NUllColor("Text", `#ffffff`, `100`)

    NUllColor("NdText", `#c4c4c4`, `100`)

    NUllColor("EndBG", `#000000`, `50`)

    NUllColor("CapBG", `#000000`, `0`)

    NUllColor("VDOTEXT", `#ffffff`, `100`)

    NUllColor("TIMETEXT", `#ffffff`, `100`)

    NUllColor("HBT", `#ffffff`, `100`)

    NUllColor("LeftBar", "#000000", `0`)

    NUllColor("subShaColor", "#000000", `100`)

    NUllColor("SPSubScribeColor", `#ffffff`, `100`)
    NUllColor("SPSubScribeBG", `#ff0000`, `100`)

    NUllColor("LinkColor", `#fe0000`, `100`)
}

let NORMAL = `

    @keyframes glowing {
        0% { background-position: 0 0; }
        50% { background-position: 400% 0; }
        100% { background-position: 0 0; }
    }

    #MAINPRESET{
        height: -webkit-fill-available;
        height: -moz-available;
    }

    .CheckBox:hover {
        filter: brightness(2);
    }

    .HoverList {
        margin-block: -3px;
        padding-right: 0px !important;
        text-wrap: nowrap;
    }    
    
    mark {
        background:rgb(250,200, 250);
    }

    .NDel:hover {
        background: #41ffe5 !important;
    }

    .NUp:hover {
        background: #ffaf76 !important;
    }

    input[Newtube]::-webkit-file-upload-button{
        border-radius: 10px;
        border: transparent;
        padding: 10px;
        margin-inline-end: 10px;
        transition: all 0.2s;
    }

    input[Newtube]::-webkit-file-upload-button:hover{
       background: black !important;
       color: white !important;
    }

	html
	{
		height:100% !important;
	}

	[type="range"]
	{
		width:100px;
	}

	.needspace
	{
		margin-bottom:10px;
	}
	#NEWTUBESET span {
        cursor: pointer;
        display: inline-block;
        position: relative;
        transition: 0.5s;
	}
	#NEWTUBESET span:after {
        content: '\«';
        position: absolute;
        opacity: 0;
        top: 0;
        right: -20px;
        transition: 0.5s;
	}

	#NEWTUBESET:hover span {
	    padding-right: 20px;
	}
	#NEWTUBESET:hover span:after {
        opacity: 1;
        right: 0;
	}

    #NEWTUBEHOVER:hover {
        filter: grayscale(0) !important;
    }

    #NEWTUBE {
        border-radius: 20px;
	}


	[hover]:hover
	{
		background:rgb(100, 100, 100) !important;
	}

    .HoverList {
        border-radius: 20px;
        transition: all 0.2s;
        margin-inline-start: 10px;
        user-select: none;
    }

    .HoverList:hover {
        background: #ffffffd1;
        color: black !important;
        margin-inline-start: 0px !important;
    }

	.select
	{
		color:white;
		border-radius: 10px;
		background:rgb(33, 33, 33);
		text-align: center;
	}

	.TextBox{
		background:rgb(33, 33, 33);
		width:70px;
		color:white;
		border-radius:10px;
		text-align:center;
        border: transparent;
        padding:4px;
        box-shadow: 0px 0px 3px 0px #ffffff;
	}

	.DoY{
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.ColorPick{
		width: 200px;
		border-width: 0px;
		background: transparent;
	}

	.MainBox{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        font-size: 10px;
        padding-inline: 10px;
        margin-block: 10px;
        border-radius: 20px;
        border-bottom: #ffadfdad solid 3px;
        margin-top: 50px;
	}

    .NewtubeLeftText{
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 16px;
        width:100%;
    }

    .ListBox {
        padding: 10px 15px 10px 20px;
        border-radius: 10px;
        background: #383838;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        font-size: 10px;
        margin-inline: 10px;
        margin-block: 10px;
    }

	.SndBox{
        position: relative;
        padding: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        font-size: 10px;
        margin-inline: -10px;
        margin-top: 20px;
        border-radius: 20px;
        background: linear-gradient(90deg, #313131, transparent);
	}


	.DES
	{
		margin-inline:10px;
		color: white;
		font-size: 15px;
	}

	.Reset:hover
	{
		background:white !important;
        color:black !important;
	}

	#NEWTUBEBG
	{
		background: rgb(0 0 0);
		border-radius:20px 20px 0px 20px;
        overflow: hidden;
	}

    #NEWTUBEBG textarea {
        border-radius: 5px;
    }

    .NEWTUBEBG,.NEWTUBEMAIN{
        overflow: hidden;
    }

	.NEWTUBE::-webkit-scrollbar,
	#MAINPRESET::-webkit-scrollbar
	{
		width:6px !important;
	}

    .NEWTUBE textarea{
        white-space: nowrap !important;
    }

    .NEWTUBE textarea::-webkit-scrollbar
    {
        width:10px !important;
        height:10px !important;
    }

	.NEWTUBE::-webkit-scrollbar-track,
	#MAINPRESET::-webkit-scrollbar-track,
    .NEWTUBE textarea::-webkit-scrollbar-track
	{
		background: transparent;
		border-radius:10px !important;
	}

	.NEWTUBE::-webkit-scrollbar-thumb,
	#MAINPRESET::-webkit-scrollbar-thumb,
    .NEWTUBE textarea::-webkit-scrollbar-thumb
	{
		background: rgba(100, 100, 100, 1) !important;
		border-radius:10px !important;
	}
	 
	.CheckBox{
		margin-block: 10px;
		font-size: 20px;
		-webkit-appearance: none;
		   -moz-appearance: none;
				appearance: none;
		width: 4em;
		height: 1.5em;
		background: rgb(33, 33, 33);
		border-radius: 3em;
		position: relative;
		cursor: pointer;
		outline: none;
		transition: all .2s;
        box-shadow: 0px 0px 3px 0px #ffffff;
	}
		
	.CheckBox:checked{
		background: #7f5db7;
	}
		
	.CheckBox:after{
        position: absolute;
        display: flex;
        content: "❖";
        font-weight: 1000;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        background: #fff !important;
        box-shadow: 0 0 0.25em rgb(0 0 0 / 30%);
        transform: scale(.7);
        left: 0;
        transition: all .2s;
        justify-content: center;
        color: black !important;
	}

    .NDel,.NUp
	{
		transition: background .2s;
	}
		
	.CheckBox:checked:after{
		left: calc(100% - 1.5em);
        transform: rotate(180deg);
        filter: drop-shadow(0px 0px 10px black);
	}

	.TextBox[type=number]::-webkit-inner-spin-button, 
	.TextBox[type=number]::-webkit-outer-spin-button { 
	  -webkit-appearance: meter;
	}

	.DONATEIMG
	{
		width: 50px;
		height: 35px;
		object-fit: cover;
		border-radius:10px;
	}

	#HOVERLINK,
    #Imgid
	{
		transition: all .2s ease-in-out;
		border-bottom: 1px solid currentColor;
		text-decoration: none;
	}

	#HOVERLINK:hover,
    #Imgid:hover
	{
		color:#86c2ff;
    }

    .ColorPick{
        filter: drop-shadow(0px 0px 1px white);
        padding: 0px;
    }
    
    .ColorPick::-webkit-color-swatch {
        border: 0px transparent;
        padding: 0px;
        border-radius: 10px;
    }

    #NEWTUBELIST {
        overflow-y:scroll;
        margin-right: 10px;
        border-radius: 0px 20px 20px 0px;
        padding-right: 10px;
    }

    .ntdeletefont{
        color: white;
        padding: 10px;
        aspect-ratio: 1/1;
        height: 20px;
        background: brown;
        font-size: medium;
        text-align: center;
        display: flex;
        justify-content: center;
        border-radius: 10px;
        margin-left: 10px;
        transition: filter 0.2s;
        cursor: pointer;
    }

    .ntdeletefont:hover,
    #ntAddFont:hover{
        filter: brightness(1.5);
    }
	`, AfterNEWTUBE = `#NEWTUBEBG,
    .NEWTUBEMAIN {
        background: rgb(0 0 0 / 87%) !important;
    }
    
    .NEWTUBEBG {
        background: var(--top-bar-and-search-background) !important;
    }
    
    .BIGNTUBET {
        color: var(--theme) !important;
    }
    
    .NTUBET {
        color: var(--text-color) !important;
    }`

function LOADANIMATION(e) {
    LoopCheck = 7
    CheckPar(e.target)
    if (EPar) {
        ThisVDIMG = EPar.getElementsByTagName("img")[0].currentSrc

        LoadBG = document.createElement("div")
        document.body.append(LoadBG)

        LoadIMG = document.createElement("div")
        LoadBG.append(LoadIMG)

        LoadBG.style = `
        width: 100%;
        height: 100%;
        z-index: 5000;
        position: fixed;
        opacity: 0;
        transition: opacity 0.2s;
        backdrop-filter:blur(100px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        `

        LoadIMG.style = `
        height: 90px;
        width: 160px;
        background-image: url("` + ThisVDIMG + `");
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: var(--theme-radius);
        transition: all 2s;
        `

        setTimeout(() => {
            LoadBG.style.setProperty("opacity", "1")
            LoadIMG.style.setProperty("width", "1920px")
            LoadIMG.style.setProperty("height", "1080px")
        }, 1);

        setTimeout(() => {
            LoadBG.style.setProperty("opacity", "0")
            setTimeout(() => {
                LoadBG.remove()
            }, 200);
        }, 500);

        ThisVDIMG = null
    }
    EPar = null
}

var MasterheadBG
var Masterhead

var WindowH = window.innerHeight
var ADDFlyout = false

var player
var VdoPlayer

function StartFlyout() {
    ADDFlyout = !ADDFlyout

    player.style.transition = "unset"
    player.style.opacity = 0
    player.style.transform = "translateX(100px)"
    VdoPlayer.setAttribute('nt-flyout', '')

    setTimeout(() => {
        below = document.getElementById("below")
        // below.style.transform = `translateY(${player.offsetHeight}px)`

        player.style.transition = "opacity 0.5s,transform 0.5s"
        player.style.transform = "unset"
        player.style.opacity = 1


        FlyoutStyle.textContent = `
                        #player-container:has(.html5-video-player:not(.ytp-small-mode)){
                            position: fixed !important;
                            z-index: 3;
                            background: var(--border-color) !important;
                            border-radius: var(--theme-radius-big);
                            aspect-ratio: 16/9;
                            top: unset !important;
                            left: unset !important;
                            right: 20px !important;
                            bottom: 20px !important;
                            padding: var(--border-width);
                        }
    
                        .html5-video-player{
                            padding: 0px !important;
                        }
                        
                        video,#player-container:has(.html5-video-player:not(.ytp-small-mode)){
                            width: 400px !important;
                            height: auto !important;
                            max-width: unset !important;
                            min-width: unset !important;
                        }
                        
                        .html5-video-player:not(.ytp-autohide) .ytp-chrome-bottom{
                            width: 400px !important;
                        }
                        
                        .ytp-right-controls,
                        .ytp-progress-bar-container,
                        .ytp-chapter-container,
                        .ytp-ce-element{
                            display:none !important;
                        }
                        
                        .ytp-chapter-hover-container{
                            width:100% !important;
                        }
                        
                        ytd-channel-name{
                            z-index: 0 !important;
                        }
    
                        .html5-video-container{
                            height: fit-content !important;
                        }
    
                        .ytp-iv-video-content{
                            width: 100% !important;
                            height: 100% !important;
                        }
    
                        .ytp-caption-segment{
                            font-size: 15px !important;
                        }

                        video{
                            transition: none !important;
                            height: 100% !important;
                            width: max-content !important;
                        }

                        .html5-video-container{
                            transition: none !important;
                            height: 100% !important;
                        }
                        `
    }, 0);
}

function StopFlyout() {
    ADDFlyout = !ADDFlyout

    VdoPlayer.removeAttribute('nt-flyout')

    player.style.transition = "unset"
    // player.style.transform = "translateX(-100px)"
    player.style.opacity = 0

    setTimeout(() => {
        player.style.transition = "opacity 0.5s"
        player.style.opacity = 1
        // player.style.transform = "unset"

        // document.getElementById("below").style.transform = 'unset'
        FlyoutStyle.textContent = ``
    }, 0);
}

function ScrollEv() {

    toppo = document.documentElement.scrollTop
    WindowH = window.innerHeight

    if (localStorage["nt-ScrollT"] == "true") {
        if (Masterhead == null || MasterheadBG == null) {
            Masterhead = document.querySelector("#masthead")
            MasterheadBG = document.querySelector("#masthead > #background")
        }

        if (Masterhead && MasterheadBG) {
            if (toppo == 0 && TranHead == false) {
                TranHead = true
                Masterhead.style = `
                backdrop-filter: none !important;
                box-shadow: 0px 0px transparent !important;
                outline: transparent !important;`
                MasterheadBG.style = `background:transparent;`
            } else {
                if (toppo > 0 && TranHead == true) {
                    TranHead = false
                    Masterhead.style = ``
                    MasterheadBG.style = ``
                }
            }

        } else {
            setTimeout(() => {
                ScrollEv()
            }, 2000);
        }
    }

    if (localStorage["nt-FlyoutT"] == "true") {
        // console.log(toppo, WindowH)
        if (player == null) {
            if (isFirefox) {
                player = document.querySelectorAll("[id='player-container']")
                player.forEach((ThisElement) => {
                    if (ThisElement.getElementsByClassName(".playing-mode")) {
                        player = thisElement
                    }
                })
            } else {
                player = document.querySelector("#player-container:has(.playing-mode:not(.ytp-small-mode))")
            }
        } else {
            if (VdoPlayer == null) {
                VdoPlayer = player.getElementsByClassName("html5-video-player")[0]
            } else {
                if (toppo > WindowH) {
                    if (!ADDFlyout) {
                        StartFlyout()
                    }
                } else {
                    if (ADDFlyout) {
                        StopFlyout()
                    }
                }
            }
        }
    }
}

function SetGlobalBGImage(ImgValue) {
    if (document.getElementById("BGIMG")) {
        RenderPreImg(ImgValue)
    }
}

function AddScrollEv() {
    if (ADDScrollEVENT == false) {
        ADDScrollEVENT = true
        window.addEventListener("scroll", ScrollEv, { passive: true })
        ScrollEv()
    }
}

function RemoveScrollEv() {
    if (ADDScrollEVENT == true) {
        ADDScrollEVENT = false
        window.removeEventListener('scroll', ScrollEv, { passive: true })
    }
}

function update() {

    // console.log("UPDATE");
    BGSmooth = 1 / parseInt(localStorage["nt-VDOSmooth"])
    if (BGSmooth > 1) {
        BGSmooth = 1
    }
    if (BGSmooth == 1) {
        LastFrame = null
    }
    Collect_Style = ``
    ADDCSS = ``
    ADDReplaceLOGO = ``

    if (localStorage["nt-ReplaceYTT"] == 'true') {
        if (localStorage["nt-ReplaceYTURL"] != "") {
            ADDReplaceLOGO = `
            yt-icon.ytd-logo g,#country-code{
                opacity:0;
            }
            
            #logo.ytd-topbar-logo-renderer{
                background:url("${localStorage["nt-ReplaceYTURL"]}");
                background-size: ${localStorage["nt-YTSize"]}%;
                background-repeat: no-repeat;
                background-position: center;
            }`
        }
    }

    if (localStorage["nt-VDOBGT"] != 'true' || localStorage["nt-EnableButtonT"] != 'true') {
        if (VDOBG == true) {
            VDOBG = false
            DisableBGBlur(true)
        }
    }

    if (localStorage["nt-EnaADDCSST"] == 'true') {
        ADDCSS = localStorage["nt-ADDCUSTOM"]
    }

    if (localStorage["nt-EnableButtonT"] == 'false') {
        if (ADDFlyout) {
            StopFlyout()
        }

        RemoveScrollEv()

        NTstyle.textContent = NORMAL;
    }
    else if (localStorage["nt-EnaCUSCSST"] == 'true') {
        NTstyle.textContent = NORMAL + localStorage["nt-CUSTOM"] + ADDCSS + AfterNEWTUBE
    } else {

        if ((localStorage["nt-ScrollT"] == 'true' || localStorage["nt-FlyoutT"] == 'true') && localStorage["nt-EnableButtonT"] == 'true') {
            AddScrollEv()
        } else {
            RemoveScrollEv()
        }

        if (localStorage["nt-FlyoutT"] == 'false' && ADDFlyout) {
            StopFlyout()
        }

        if (localStorage["nt-ScrollT"] == 'false' && TranHead) {
            if (Masterhead == null || MasterheadBG == null) {
                Masterhead = document.querySelector("#masthead")
                MasterheadBG = document.querySelector("#masthead > #background")
            } else {
                Masterhead.style = ``
                MasterheadBG.style = ``
            }
        }

        DOwithindexed(function () {
            let get = store.get("BGIMG")
            get.onsuccess = function (e) {
                let BGIMGCODE = ``,
                    BGBLURCODE = ``,
                    Flip = ``

                if (localStorage["nt-BlurBGAM"] > 0 && e.target.result != null) {
                    BGBLURCODE = `#BGFRAME
                {
                    filter: blur(var(--Bg-blur)) !important;
                }`
                }

                if (localStorage["nt-FlipT"] == `true`) {
                    Flip = `transform: scaleX(-1);`
                }

                if (e.target.result != null && e.target.result != "") {
                    BGIMGCODE = `#BGFRAME
                    {
                        width:100%;
                        height:100%;
                        background-image : url("` + e.target.result + `");
                        `+ GetCodeC("Repeat") + `
                        background-position: `+ localStorage["nt-IMGX"] + `% ` + localStorage["nt-IMGY"] + `% !important;
                        background-size: `+ localStorage["nt-IMGS"] + `% !important;
                        top:0;
                        position:fixed;
                        z-index: -10000;
                        `+ Flip + `;
                        transition : opacity 2s;
                    }`

                }

                PreloadImg.src = e.target.result

                if (e.target.result == "") {
                    SetGlobalBGImage(e.target.result)
                }

                setTimeout(() => {
                    if (localStorage["nt-VDOBGT"] == 'true' && localStorage["nt-EnableButtonT"] == 'true') {
                        if (VDOBG == false) {
                            VDOBG = true
                            EnableBGBlur()
                        }
                    }
                }, 10);

                Collect_Style = `html:not(.style-scope)[system-icons]:not(.style-scope)
                {
                    background: black !important;
                }

                body {
                    overflow: auto;
                }

                :root {
                    --blur-amount: `+ localStorage["nt-BlurAm"] + `px;
                    --Bg-blur: `+ localStorage["nt-BlurBGAM"] + `px;
                    --theme: `+ 'Theme'.GetSaveRgba() + `;
                    --theme-fort: ${"ThemeFort".GetSaveRgba()};
                    --playlist-bg: `+ 'Playlisthover'.GetSaveRgba() + `;
                    --text-color: `+ 'Text'.GetSaveRgba() + `;
                    --nd-text-color: `+ 'NdText'.GetSaveRgba() + `;
                    --border-width: `+ localStorage["nt-Border"] + `px;
                    --player-bg-border-width: `+ localStorage["nt-PlayerBorder"] + `px;
                    --border-color: `+ 'OutSha'.GetSaveRgba() + `;
                    --border-hover-color: `+ 'ThumbHoverColor'.GetSaveRgba() + `;
                    --border-click-color: `+ 'ThumbClick'.GetSaveRgba() + `;
                    --bg-color: `+ 'BG'.GetSaveRgba() + `;
                    --in-player-bg-color: `+ 'MediaBG'.GetSaveRgba() + `;
                    --top-bar-and-search-background: `+ 'ThemeSnd'.GetSaveRgba() + `;
                    --things-end-on-video: `+ 'EndBG'.GetSaveRgba() + `;
                    --hover-time-background: `+ 'TimeBG'.GetSaveRgba() + `;
                    --search-background-hover: `+ 'Themehover'.GetSaveRgba() + `;
                    --theme-radius: `+ localStorage["nt-Edge"] + `px;
                    --theme-time-radius: `+ localStorage["nt-TimeEdge"] + `px;
                    --theme-radius-big: `+ localStorage["nt-PlayerEdge"] + `px;
                    --border-minus: calc(var(--border-width) * -1);
                    --bg-border-minus: calc(var(--player-bg-border-width) * -1);
                    
                    --border-width-hover: `+ localStorage["nt-HoverBorder"] + `px;
                    --border-minus-hover: calc(var(--border-width-hover) * -1);
                    
                    --theme-third: `+ 'ThemeThr'.GetSaveRgba() + `;
                    --Zoom: `+ localStorage["nt-Zoom"] + `;

                    --sub-ShaWidth: `+ localStorage["nt-subShaWidth"] + `px;
                    --sub-ShaBlur: `+ localStorage["nt-subShaBlur"] + `px;

                    --sub-Width: `+ localStorage["nt-subWidth"] + `;
                    --sub-Space: `+ localStorage["nt-subSpace"] + `px;
                    --sub-color: ` + 'Subtitle'.GetSaveRgba() + `;
                    --sub-bg: ` + 'CapBG'.GetSaveRgba() + `;
                    --sub-sha-color: `+ 'subShaColor'.GetSaveRgba() + `;

                    --Media-Space: `+ localStorage["nt-MediaSpace"] + `px;

                    --SubSc-BG : ${'SPSubScribeBG'.GetSaveRgba()};
                    --SubSc-Tx : ${'SPSubScribeColor'.GetSaveRgba()};
                }

                ytd-text-inline-expander yt-attributed-string a{
                    color: ${'LinkColor'.GetSaveRgba()} !important;
                }

                ytd-menu-renderer .ytd-menu-renderer[style-target=button] {
                    transition: background 0.2s, transform 0.1s;
                    background: transparent;
                    border-radius: var(--theme-radius);
                }

                .ytp-ad-module {
                    width: 0px !important;
                }

                .ytp-chapters-container{
                    flex-wrap: nowrap;
                    display: flex;
                }

                .ytp-gradient-top{
                    border-radius: var(--theme-radius-big) var(--theme-radius-big) 0px 0px;
                }
                  
                ytd-menu-renderer .ytd-menu-renderer[style-target=button]:hover {
                    background: var(--theme-fort);
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
                    background: ${'ThemeChips'.GetSaveRgba()} !important;
                }

                ytd-app::-webkit-scrollbar {
                    width: 0px !important;
                }
                
                *::-webkit-scrollbar
                {
                width: `+ localStorage["nt-ScWidth"] + `px  !important;
                }
                
                *::-webkit-scrollbar-thumb
                {
                    border-radius:10px;
                    background-color: var(--theme) !important;
                }
                
                *:not(body)::-webkit-scrollbar-track,
                html[watch-color-update]
                {
                    --yt-spec-general-background-a: transparent !important;
                    background: transparent !important;
                }
                
                body::-webkit-scrollbar-track
                {
                    background: `+ localStorage["nt-BGC"] + ` !important;
                }
                
                ytd-thumbnail-overlay-time-status-renderer
                {
                    height: `+ localStorage["nt-TimeH"] + `px !important;
                }

                .ytp-time-current, .ytp-time-separator, .ytp-time-duration
                {
                    color: `+ 'VDOTEXT'.GetSaveRgba() + `!important;
                }
                
                a.thumbnail > .ytcd-basic-item-large-image,
                ytcp-thumbnail-with-title,
                ytd-playlist-thumbnail,
                ytd-thumbnail,
                #thumbnail,
                .thumbnail-container.ytd-notification-renderer,
                yt-img-shadow.ytd-channel-renderer,
                #author-thumbnail.ytd-comment-simplebox-renderer,
                .style-scope.ytd-comment-renderer.no-transition,
                div.html5-video-player:not(.ytp-fullscreen) .html5-video-container,
                .ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title,
                ytd-thumbnail-overlay-side-panel-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer,
                `+ GetCodeC("PlayerOut") + `
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
                ytd-video-preview,
                `+ GetCodeC("TopOut") + `
                `+ GetCodeC("CapOut") + `
                `+ GetCodeC("SubOut") + `
                `+ GetCodeC("TimeOut") + `
                `+ GetCodeC("SndOut") + `
                .ytp-show-tiles .ytp-videowall-still,
                #tabs-container,
                yt-confirm-dialog-renderer[dialog][dialog][dialog],
                .ytp-ce-element.ytp-ce-element-show,
                #contentWrapper.tp-yt-iron-dropdown > *,
                .ytp-tooltip-bg,
                .skeleton-bg-color.ytd-ghost-grid-renderer
                {
                    border-collapse: separate;
                    `+ JSON.parse(GetCodeC("OutOrSha"))[0] + `
                }

                div.html5-video-player:not(.ytp-small-mode){
                    overflow: visible;
                    position: absolute !important;
                }

                #container {
                    position: relative !important;
                }
                
                `+ GetCodeC("PlayerOut") + `
                .ytp-popup.ytp-settings-menu,
                #NEWTUBEBG,
                .NEWTUBEMAIN
                {
                    border-collapse: separate;
                    `+ JSON.parse(GetCodeC("OutOrSha"))[1] + `
                }
                
                #hearted-border.ytd-creator-heart-renderer
                {
                    opacity:0 !important;
                }
                
                .ytp-svg-shadow
                {
                    stroke: #0000 !important;
                }
                
                .gstl_50.sbdd_a
                {
                    top:56px !important;
                }
                
                html:not(.style-scope)[watch-color-update] {
                    --yt-live-chat-background-color: transparent;
                    --yt-live-chat-header-background-color: var(--yt-spec-brand-background-primary);
                }

                html,[dark]{
                    --ytd-chip-cloud-background: rgba(0,0,0,.3) !important;
                    --yt-spec-brand-background-primary: var(--top-bar-and-search-background) !important;
                    --yt-spec-brand-background-solid: var(--bg-color) !important;
                    --yt-spec-general-background-a: var(--bg-color) !important;
                    --yt-spec-call-to-action: var(--theme) !important;
                    --yt-spec-suggested-action: var(--theme-fort) !important;
                    --yt-spec-badge-chip-background: var(--theme-fort) !important;
                    --yt-spec-text-primary: var(--text-color) !important;
                    --yt-spec-text-secondary: var(--nd-text-color) !important;
                    --yt-spec-brand-button-background: var(--theme) !important;
                    --yt-spec-static-brand-red: var(--theme) !important;
                    --yt-spec-brand-icon-inactive: var(--theme) !important;
                    --yt-spec-10-percent-layer: var(--theme-third) !important;
                    --yt-spec-general-background-b: transparent !important;
                    --yt-spec-wordmark-text: var(--text-color) !important;
                    --yt-spec-button-chip-background-hover: var(--search-background-hover) !important;
                    --yt-spec-text-primary-inverse: var(--top-bar-and-search-background) !important;
                    --yt-spec-static-brand-white: `+ 'TIMETEXT'.GetSaveRgba() + ` !important;
                    --yt-spec-base-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-raised-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-menu-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-static-overlay-text-primary: var(--text-color) !important;
                }

                .watch-skeleton .skeleton-bg-color{
                    background: var(--theme-third) !important;
                }

                ytd-playlist-panel-video-renderer:hover {
                    background-color: var(--playlist-bg) !important;
                }

                ytd-app{
                    background: var(--bg-color) !important;
                    --app-drawer-content-container-background-color: var(--bg-color) !important;
                }

                .ytp-tooltip-text-no-title
                {
                    color: var(--yt-spec-static-brand-white) !important;
                }

                .ytp-tooltip-text.ytp-tooltip-text-no-title{
                    background: var(--hover-time-background) !important;
                }
                
                html
                {
                    background:black !important;
                }

                #NewtubeBlurBG{
                    transition: opacity 2s , margin-top 0.1s , margin-left 0.1s;
                    filter: contrast(` + localStorage["nt-NVDOC"] + `) brightness(` + localStorage["nt-NVDOBGT"] + `);
                }

                #NewtubeBlurBG,
                #nt-black-overlay
                {
                    transform: scale(` + localStorage["nt-NVDOT"] + `);
                }

                #NewtubeVDOCanvas{
                    transition: margin-top 0.1s , margin-left 0.1s;
                }

                html:has(div.html5-video-player.ytp-fullscreen) #NewtubeBlurBG {
                    display: none;
                }
                
                .ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title,
                .ytd-thumbnail-overlay-loading-preview-renderer,
                ytd-thumbnail-overlay-inline-unplayable-renderer
                {
                    background-color: var(--hover-time-background) !important;
                }

                .ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title
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
                ytd-playlist-renderer,
                ytd-compact-link-renderer,
                ytd-notification-renderer,
                ytd-macro-markers-list-item-renderer
                {
                    transition: all .2s;
                }
                
                tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]{
                    border-bottom: var(--yt-spec-10-percent-layer) !important;
                }
                
                .ytp-ce-expanding-overlay-background,
                .ytp-ce-playlist-count
                {
                    background: var(--things-end-on-video) !important;
                }
                
                .sbdd_b,
                #scrim,
                tp-yt-iron-overlay-backdrop,
                ytd-video-preview[active],
                #tabs-container
                {
                    background: var(--top-bar-and-search-background) !important;
                }
                
                ytd-thumbnail-overlay-hover-text-renderer
                {
                    background-color: var(--top-bar-and-search-background) !important;
                }
                
                #video-preview-container
                {
                    box-shadow: 0px 0px 0px 0px !important;
                }
                
                .sbfl_b,.sbsb_a,
                #container.style-scope.ytd-masthead,
                ytd-mini-guide-renderer,
                ytd-mini-guide-entry-renderer,
                ytd-page-manager>*.ytd-page-manager,
                `+ GetCodeC("VBG") + `
                #channel-container,
                #channel-header,
                #tabs-inner-container,
                .playlist-items,
                #video-preview-container,
                ytd-simple-menu-header-renderer,
                .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
                #description,
                #player,
                ytd-thumbnail-overlay-resume-playback-renderer
                {
                    background: transparent !important;
                }
                
                .sbsb_d,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,
                .ytp-menuitem:not([aria-disabled=true]):hover,
                ytd-mini-guide-entry-renderer:hover {
                    background: var(--search-background-hover) !important;
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
                    color: var(--text-color) !important;
                }
                
                ytd-multi-page-menu-renderer,
                div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed) .html5-video-container,
                .ytp-offline-slate-background
                {   
                    border-radius: var(--theme-radius-big) !important;
                }
                
                a.thumbnail > .ytcd-basic-item-large-image,
                ytcp-thumbnail-with-title,
                ytd-playlist-thumbnail,
                ytd-thumbnail,
                #thumbnail,
                .thumbnail-container.ytd-notification-renderer,
                .sbdd_b,
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
                .style-scope.ytd-subscribe-button-renderer,
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
                .ytp-flyout-cta .ytp-flyout-cta-body,
                #ytp-ad-image,
                .ytp-ad-preview-container,
                .ytp-ad-message-container,
                #guide-content,
                .sbsb_d,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,
                #search-icon-legacy,
                .ytp-ad-skip-button.ytp-button,
                .ytp-flyout-cta .ytp-flyout-cta-icon,
                #banner > img,
                #icon > img,
                #action,
                .ytp-cards-teaser,
                .ytp-ce-video-duration,
                .ytp-show-tiles .ytp-videowall-still,
                .ytp-videowall-still-info-content,
                .ytp-videowall-still-listlabel-mix.ytp-videowall-still-listlabel,
                .style-scope.ytd-popup-container,
                #action-companion-ad-info-button.ytd-action-companion-ad-renderer,
                .ytp-flyout-cta .ytp-flyout-cta-action-button,
                .ytp-autonav-endscreen-upnext-thumbnail,
                .ytp-autonav-endscreen-upnext-button,
                ytd-playlist-panel-video-renderer,
                ytd-guide-entry-renderer,
                ytd-menu-service-item-renderer[use-icons],
                .ytp-ad-overlay-image,
                .ytp-ad-button-icon,
                .ytp-ad-overlay-close-button,
                .ytp-ad-text-overlay,
                .ytp-ad-button-icon,
                .ytp-ad-button-icon,
                #media-container.ytd-display-ad-renderer,
                ytd-display-ad-renderer[layout=display-ad-layout-top-landscape-image] #media-badge.ytd-display-ad-renderer,
                #chips-wrapper.ytd-feed-filter-chip-bar-renderer,
                ytd-mini-guide-entry-renderer,
                ytd-video-preview,
                ytd-toggle-button-renderer,
                ytd-post-renderer[uses-compact-lockup],
                ytd-backstage-image-renderer,
                #tabs-container,
                ytd-playlist-video-renderer,
                ytd-miniplayer,
                ytd-button-renderer,
                .ytd-thumbnail-overlay-loading-preview-renderer,
                ytd-thumbnail-overlay-inline-unplayable-renderer,
                ytd-thumbnail.ytd-rich-grid-media:before,
                .skeleton-bg-color.ytd-ghost-grid-renderer,
                .captions-text,
                #container,
                [round],
                ytd-engagement-panel-section-list-renderer,
                #tooltip,
                ytd-compact-link-renderer,
                ytd-notification-renderer,
                #time.ytd-macro-markers-list-item-renderer,
                ytd-macro-markers-list-item-renderer,
                .ytp-menuitem
                {
                    border-radius: var(--theme-radius) !important;
                }

                ytd-engagement-panel-section-list-renderer
                {
                    overflow:hidden;
                }
                
                .ytp-gradient-bottom
                {
                    border-radius: var(--theme-radius) var(--theme-radius) 0px 0px !important;
                }
                
                #masthead
                {
                    border-radius: 0px 0px var(--theme-radius) var(--theme-radius) !important;
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
                    overflow: visible;
                }
                
                .ytp-menuitem-icon path:not([fill="none"]),.ytd-thumbnail-overlay-hover-text-renderer path,.ytd-thumbnail-overlay-bottom-panel-renderer path,#search-icon.ytd-searchbox path,svg path[fill="#FF0000"]${GetCodeC("IconFill")} , svg [fill="#FF0000"]${GetCodeC("IconFill")}, svg [fill="red"], svg [fill="#F00"] , button:not(.yt-share-target-renderer) path:not([fill="none"]), [role="button"] path, [role="option"]:not(.yt-third-party-share-target-section-renderer) path,
                .ytp-heat-map-graph
                {
                    fill: var(--theme) !important;
                }

                ytd-author-comment-badge-renderer{
                    background: var(--theme-fort) !important;
                }

                #text.ytd-channel-name,
                yt-button-renderer.yt-formatted-string.yt-button-renderer,
                paper-ripple,
                a.yt-simple-endpoint.yt-formatted-string,
                .style-scope.ytd-menu-renderer.force-icon-button.style-default-active,
                .badge-style-type-live-now.ytd-badge-supported-renderer, .badge-style-type-starting-soon.ytd-badge-supported-renderer
                {   
                    border-color : var(--theme) !important;
                    color: var(--theme) !important;
                }
                
                paper-ripple,
                .ytp-swatch-color,
                a.ytp-ce-link,
                yt-icon.ytd-compact-link-renderer,
                yt-icon.ytd-toggle-theme-compact-link-renderer {
                    border-radius: var(--theme-radius) !important;
                    color: var(--theme) !important;
                }
                
                .ytp-swatch-background-color,
                .ytp-settings-button.ytp-hd-quality-badge:after,
                .ytp-chrome-controls .ytp-button[aria-pressed]:after,
                .ytp-sb-subscribe, a.ytp-sb-subscribe
                {
                    background-color: var(--theme) !important;
                }
                
                ytd-thumbnail-overlay-time-status-renderer,
                ytd-thumbnail-overlay-side-panel-renderer,
                ytd-thumbnail-overlay-toggle-button-renderer,
                .iv-branding-active .branding-context-container-inner,
                .ytp-ce-video-duration
                {
                    border-radius: var(--theme-time-radius) !important;
                    background-color: var(--hover-time-background) !important;
                }
                
                *::selection,
                .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox,
                .ytp-volume-slider-handle,
                .ytp-volume-slider-handle:before
                {
                    background: var(--theme) !important;
                    color: var(--text-color) !important;
                }

                #container.ytd-searchbox input.ytd-searchbox{
                    color: var(--theme) !important;
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
                
                ytd-compact-playlist-renderer:hover>div>ytd-playlist-thumbnail,
                ytd-compact-video-renderer:hover>div>ytd-thumbnail,
                ytd-compact-radio-renderer:hover>div>ytd-thumbnail,
                ytd-thumbnail.ytd-rich-grid-media:hover
                {   
                    outline-color: var(--border-hover-color) !important;
                    outline-width: var(--border-width-hover) !important;
                }
                
                ytd-thumbnail.ytd-rich-grid-media:active
                {   
                    box-shadow: var(--border-minus) 0 var(--border-click-color), 0 var(--border-width) var(--border-click-color), var(--border-width) 0 var(--border-click-color), 0 var(--border-minus) var(--border-click-color) !important;
                }
                
                ytd-compact-playlist-renderer:active>div>ytd-playlist-thumbnail,
                ytd-compact-video-renderer:active>div>ytd-thumbnail,
                ytd-compact-radio-renderer:active>div>ytd-thumbnail
                {
                    box-shadow: var(--border-minus) 0 var(--border-click-color), 0 var(--border-width) var(--border-click-color), var(--border-width) 0 var(--border-click-color), 0 var(--border-minus) var(--border-click-color) !important;
                }
                
                .ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]):hover > svg path
                {
                    fill: `+ "HBT".GetSaveRgba() + ` !important;
                }
                
                .ytp-chrome-top,
                .ytp-chrome-bottom,
                .ytp-gradient-bottom,
                .ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]) > svg > path,
                ytd-playlist-panel-video-renderer,
                ytd-menu-renderer
                {
                    transition: all .2s !important;
                }
                
                .ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-top, .ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-bottom
                {
                    display: block !important;
                }
                
                .ytp-popup.ytp-settings-menu,
                .ytp-gradient-bottom,
                .iv-drawer,
                .ytp-cards-teaser-box,
                .ytp-popup,
                [aria-live="polite"]
                {
                    background-color: var(--in-player-bg-color) !important;
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
                    transition: background 2s;
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
                
                .ytp-button:not(.ytp-chapter-title):not(.ytp-ad-skip-button):not(.ytp-fullerscreen-edu-button):hover,
                .ytp-replay-button:hover,
                .ytp-cards-button-icon:hover
                {
                    transform: scale(1.5) !important;
                }
                
                .ytp-progress-list
                {
                    background: `+ "Time-LineBG".GetSaveRgba() + ` !important;
                }
                
                .ytp-load-progress
                {
                    background: `+ "TimeLoaded".GetSaveRgba() + ` !important;
                }
                
                #play
                {
                    display:none !important; 
                }

                #tooltip.tp-yt-paper-tooltip
                {
                    background-color: var(--bg-color) !important;
                }
                
                #tooltip.tp-yt-paper-tooltip
                {
                    color: var(--text-color) !important;
                }
                
                ytd-compact-radio-renderer > #dismissible > ytd-thumbnail > a > yt-img-shadow > img,
                ytd-playlist-thumbnail > a > #playlist-thumbnails > ytd-playlist-video-thumbnail-renderer > yt-img-shadow > img,
                ytd-playlist-thumbnail > a > div > ytd-playlist-custom-thumbnail-renderer > yt-img-shadow > img
                {
                    transition: all .2s ;
                }

                .sbqs_c:before {
                    background: transparent !important;
                    width: 0px !important;
                }

                #search-icon.ytd-searchbox{
                    transition:all 0.4s ease;
                    display:block !important;
                    opacity:0;
                    width: 20px !important;
                    position: absolute;
                    left:0px;
                }
                 
                ytd-searchbox[has-focus] #search-icon.ytd-searchbox{
                    opacity:1;
                }
                 
                #container.ytd-searchbox{
                    transition:all 0.4s ease;
                }

                .ytp-chapter-title-prefix {
                    display: none;
                }
                
                .ytp-chapter-title-content {
                    margin-left: 10px;
                }

                .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled,
                yt-chip-cloud-chip-renderer[selected]{
                    color: var(--yt-spec-text-primary) !important;
                    background: var(--theme) !important;
                }

                .sbsb_i{
                    background: black;
                    padding: 5px 10px;
                    border-radius: var(--theme-radius);
                    outline: solid white 1px;
                    color: white !important;
                    transition:all 0.2s;
                }
                
                .sbsb_i:hover{
                    background: white !important;
                    color: black !important;
                }

                .sbpqs_d .sbpqs_a{
                    color: var(--theme) !important;
                }
                    
                .sbse:not(.sbpqs_d) .sbpqs_a{
                    color: var(--nd-text-color) !important;
                }
                    
                .sbpqs_a:before{
                    filter: invert(0.5);
                }

                #guide-content{
                    background: `+ "LeftBar".GetSaveRgba() + ` !important;
                }

                ytd-action-companion-ad-renderer,
                #container,
                ytd-live-chat-frame
                {
                    border:transparent !important;
                }

                .ytp-gradient-bottom
                {
                    height: `+ localStorage["nt-MediaH"] + `px !important;
                    border-radius: var(--theme-radius-big) !important;
                    `+ GetCodeC("BottomG") + `
                }

                
                #NewtubeVDOCanvas{
                    border-radius: var(--theme-radius-big) !important;
                }

                div.html5-video-player.ytp-fullscreen .ytp-gradient-bottom{
                    border-radius: var(--theme-radius-big) var(--theme-radius-big) 0px 0px !important;
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
                    border-color: var(--theme) var(--theme) transparent !important;
                }

                path[stroke="rgb(255,255,255)"] {
                    stroke: var(--theme) !important;
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

                #progress.ytd-thumbnail-overlay-resume-playback-renderer {
                    background: linear-gradient(-70deg, var(--theme), var(--theme-third) ) !important;
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
                 
                #text.ytd-channel-name:hover {
                     background: var(--theme-third);
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
                    margin-top:`+ localStorage["nt-BelowSpace"] + `px;
                }
                    
                `+ BGBLURCODE + `
                
                `+ BGIMGCODE + `

                `+ GetCodeC("CenterMedia") + `

                `+ GetCodeC("MediaBlur") + `
                
                `+ GetCodeC("BlurWhat") + `
                
                `+ GetCodeC("ThumbHover") + `
                
                `+ GetCodeC("BlurSub") + `
                
                `+ GetCodeC("CenterTime") + `

                `+ GetCodeC("CenterUD") + `

                `+ GetCodeC("CenterUDF") + `

                `+ GetCodeC("TimeAni") + `

                `+ GetCodeC("Scroll") + `

                `+ GetCodeC("LeftBar") + `

                `+ GetCodeC("Ptran") + `

                `+ GetCodeC("NewSub") + `

                `+ GetCodeC("SwapRow") + `

                `+ GetCodeC("ThumbAnim") + `

                `+ GetCodeC("ControlUnderVDO") + `

                `+ GetCodeC("SPSubScribe") + `
                
                `+ GetCodeC("AutohideBar") + `

                `+ GetCodeC("SearchAnim") + `

                `+ GetCodeC("VdoAnim") + `

                `+ GetCodeC("FullTheater") + `
                
                `+ ADDCSS + `

                `+ ADDReplaceLOGO + `

                `

                var thisStyle = NORMAL + Collect_Style + AfterNEWTUBE

                if (localStorage["nt-PtranT"] == "true") {
                    thisStyle = thisStyle + `html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) #secondary,
                    html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) #below,
                    html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) div.ytp-gradient-bottom,
                    html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) div.ytp-chrome-bottom
                    {
                        transition: all 0.5s !important;
                        opacity:0 !important;
                    }

                    html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) #below{
                        margin-top: 100px;
                    }

                    #secondary,
                    #below{
                        transition: margin-top 1.5s, opacity 1.5s;
                    }`
                    if (localStorage["nt-SwapRowT"] == "true") {
                        thisStyle = thisStyle + `
                        html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) #secondary{
                            transform: translate(-100px,0);
                        }`
                    } else {
                        thisStyle = thisStyle + `
                        html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) #secondary{
                            transform: translate(100px,0);
                        }`
                    }
                }

                // NTstyle.textContent = thisStyle

                let ADDFont = ``

                UnCompressEnaFont().forEach(font => {
                    if (ADDFont != ``) {
                        ADDFont += `,`
                    }
                    ADDFont += `'${font}'`
                })

                if (ADDFont != ``) {
                    ADDFont = `
                        *{
                            font-family: ${ADDFont} !important;
                        }`
                }

                NTstyle.textContent = thisStyle + ADDFont
            };
        })
    }
}

function WaitAvatar() {
    return new Promise(resolve => {
        if (document.getElementById("avatar-btn")) {
            return resolve(document.getElementById("avatar-btn"));
        }

        if (document.querySelector("ytd-topbar-menu-button-renderer")) {
            return resolve(document.querySelector("ytd-topbar-menu-button-renderer"));
        }

        const observer = new MutationObserver(mutations => {
            if (document.getElementById("avatar-btn")) {
                resolve(document.getElementById("avatar-btn"));
                observer.disconnect();
            }
            if (document.querySelector("ytd-topbar-menu-button-renderer")) {
                resolve(document.querySelector("ytd-topbar-menu-button-renderer"));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

if (inIframe() == true) {
    update()
} else {
    if (document.documentElement.getAttribute("dark") == null) {
        document.addEventListener("DOMContentLoaded", async function () {
            await WaitAvatar()

            try {
                document.getElementById("avatar-btn").click()
            } catch (e) {
                document.getElementsByTagName("ytd-topbar-menu-button-renderer")[0].click()
            }

            await waitForElm("ytd-toggle-theme-compact-link-renderer")
            document.getElementsByTagName("ytd-toggle-theme-compact-link-renderer")[0].click()
            await waitForElmByID("submenu")
            await waitForElm("ytd-compact-link-renderer")
            document.getElementById("submenu").getElementsByTagName("ytd-compact-link-renderer")[2].click()
        })
    } else {
        update()
        SettoEnd()
    }
}

function RESETTUBE() {
    if (document.getElementById("NEWTUBEBG")) {
        let remem = document.getElementById("NEWTUBE").scrollTop
        document.getElementById("NEWTUBEBG").remove()
        CreateMENU()
        document.getElementById("NEWTUBE").scrollTop = remem
    }
}


























//IDK----------------------------------------------------------------------------

function createList(Name, num) {
    ThisList = document.createElement("body")

    if (num != null) {
        ThisList.id = `NEWTUBEPRESET` + num
    }
    ThisList.className = "ListBox";
    ThisList.setAttribute("hover", "")
    ThisList.style = `display: flex;
    overflow: hidden;
    width: -webkit-fill-available;
    width: -moz-available;
    flex-direction: row;
    align-items: center;
    transition: all 0.2s;
    position: relative;`

    TellName = document.createElement("lable")
    TellName.style = `overflow-wrap: break-word;
    word-break: break-all;
    width: -webkit-fill-available;
    width: -moz-available;`
    TellName.innerHTML = Name
    TellName.className = `DES`

    LIST.appendChild(ThisList)
    ThisList.appendChild(TellName)

    if (Name == "(Current)") {
        CHOOSE = ThisList
        ThisList.style.setProperty("background", "#747474")
        ThisList.style.height = '40px'
    } else {
        ThisUp = document.createElement("img")
        ThisUp.src = chrome.runtime.getURL('asset/Upload_file.png')
        ThisUp.className = "NUp"
        ThisUp.style = `filter: invert(1);
        width: 30px;
        border-radius: 10px;
        background: white;
        padding: 5px;
        margin-inline: 10px;`
        ThisList.appendChild(ThisUp)

        var found = false
        for (var i = 0; i < ForcePre.length; i++) {
            if (Name == ForcePre[i]) {
                found = true
            }
        }
        if (found == false) {
            ThisDel = document.createElement("img")
            ThisDel.src = chrome.runtime.getURL('asset/Del.svg')
            ThisDel.className = "NDel"
            ThisDel.style = `filter: invert(1);
                width: 30px;
                border-radius: 10px;
                background: white;
                padding: 5px;`
            ThisList.appendChild(ThisDel)
        }
    }

    var busy = false

    USEING = `(Current)`

    ThisList.onclick = function (v) {
        Tar = v.target
        if (Tar.className == "NDel") {
            let Par = Tar.parentNode,
                arr = JSON.parse(localStorage["nt-NUMPRESET"]),
                ThisName = "PRESET" + Par.getElementsByTagName("lable")[0].textContent
            DOwithindexed(function () {
                store.delete(ThisName)
            })
            Par.style.setProperty("height", "0px")
            Par.style.setProperty("padding", "0px")
            Par.style.setProperty("opacity", "0")
            for (let i = 0; i < arr.length; i++) {
                if ("PRESET" + arr[i] == ThisName) {
                    arr.splice(i, 1);
                }
            }
            localStorage["nt-NUMPRESET"] = JSON.stringify(arr)
            setTimeout(() => {
                Par.remove()
            }, 200);
        }
        else if (Tar.className == "NUp") {
            ParName = Tar.parentNode.getElementsByTagName("lable")[0].textContent
            DOwithindexed(function () {
                var get = store.get("PRESET" + ParName)
                get.onsuccess = function (e) {
                    download(e.target.result, ParName + '.NPreset')
                }
            })
        }
        else {
            if (Tar.className == "DES") {
                Tar = v.target.parentNode
            }
            let TarID = Tar.getElementsByTagName("lable")[0].textContent
            if ((busy == false) && (TarID != USEING)) {
                busy = true
                CHOOSE.style.setProperty("background", "")
                CHOOSE = Tar
                USEING = TarID

                if (VDOBG == true) {
                    VDOBG = false
                    DisableBGBlur(true)
                }

                DOwithindexed(function () {
                    let get = store.get("PRESET" + TarID)
                    get.onsuccess = function (e) {
                        e.target.result.LoadNTubeCode()
                        Tar.style.setProperty("background", "#747474")
                        setTimeout(() => {
                            busy = false
                        }, 1000);
                    }
                })
            }
        }
    }
    return ThisList
};

debg = `width: 100%;
height: 100%;
z-index: 5000;
top: 0px;
position: fixed;
transition: opacity 0.2s ease 0s;`










































//Preset--------------------------------------------------------------------------------------

function setnewtubebg(opacity) {
    newtubebg = document.getElementById('NEWTUBEBG')
    if (newtubebg) {
        newtubebg.style.opacity = opacity
    }
}

function PRESET() {

    var hover = false

    var BG = document.createElement("body")
    BG.className = "NEWTUBEBG"
    BG.style = debg + `opacity:0;`

    setTimeout(() => {
        BG.style.setProperty('opacity', 1)
    }, 1);

    document.body.appendChild(BG)

    leftbar = document.createElement('div')
    BG.append(leftbar)

    leftbar.style = `background: rgb(90 90 90 / 51%);
    width: 15%;
    margin-left:-15%;
    height: 100%;
    border-radius: 0px 20px 20px 0px;
    border-right: 1px solid white;
    font-size: 2vw;
    color: #ffffff82;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    transition:all 0.5s`
    leftbar.innerHTML = "Hover Here<br>to hide menu<br><br>Click anywhere<br>to close menu<br><br>Drop file here<br>to import preset"

    Main = document.createElement('body')
    BG.appendChild(Main)
    Main.className = "NEWTUBEMAIN"
    Main.style = `position: absolute;
		width:70%;
		height:85%;
		top: 50%;
		left: 60%;
		transform: translate(-50%, -50%);
		background: rgb(20,20,20);
        display: flex;
        flex-direction: column;
        align-items: center;
		border-radius: 10px;
        transition:all 0.2s ease;
        border:solid white 1px;
        opacity: 0;
        `
    setTimeout(() => {
        leftbar.style.marginLeft = '0px'
        Main.style.left = '55%'
        Main.style.opacity = ''
    }, 0);
    function ShowPre() {
        Main.style.opacity = "1"
        Main.style.left = "55%"
        BG.style = debg
        setnewtubebg('')
        leftbar.style.opacity = ''
    }

    function HidePre() {
        Main.style.opacity = "0"
        Main.style.left = "60%"
        BG.style = debg + `backdrop-filter: blur(0px) !important;
                    background:transparent !important;`
        setnewtubebg('0')
        leftbar.style.opacity = '0'
    }

    BG.style.setProperty("backdrop-filter", "blur(0px) !important")




    leftbar.addEventListener('mouseover', function () {
        if (Clicked == false) {
            HidePre()
        }
    })

    leftbar.addEventListener('mouseout', function () {
        if (Clicked == false) {
            ShowPre()
        }
    })




    Main.addEventListener('mouseover', function () {
        if (Clicked == false) {
            hover = true
        }
    })

    Main.addEventListener('mouseout', function () {
        if (Clicked == false) {
            hover = false
        }
    })




    leftbar.addEventListener('dragover', function (e) {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
    })




    leftbar.addEventListener('drop', async function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files; // Array of all files

        F_NameArr = []
        F_ReaderArr = []

        for (var i = 0, file; file = files[i]; i++) {
            var reader = new FileReader();
            var FileName = file.name
            if ('.NPreset' == FileName.substring(FileName.length - 8, FileName.length)) {
                F_NameArr.push(FileName)
                reader.onload = function (e) {
                    F_ReaderArr.push(e.target.result)
                };
                reader.readAsText(file);
            }
        }

        function SetFile() {
            if (F_NameArr.length == F_ReaderArr.length) {

                DOwithindexed(async function () {
                    for (var i = 0; i < F_NameArr.length; i++) {

                        var filename = F_NameArr[i],
                            Name = filename.substring(0, filename.length - 8),
                            arr = JSON.parse(localStorage["nt-NUMPRESET"]),
                            f = 0


                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == Name) {
                                f++
                            }
                        }

                        var Par

                        if (f == 0) {
                            Par = createList(Name)
                            Par.style.height = "0px"
                            Par.style.padding = "0px"
                            Par.style.opacity = "0"
                        }

                        await store.put(F_ReaderArr[i], "PRESET" + Name)

                        if (f == 0) {
                            localStorage["nt-NUMPRESET"] = JSON.stringify([...arr, Name])
                        }

                        if (Par) {
                            Par.style.height = null
                            Par.style.padding = null
                            Par.style.opacity = null
                        }
                    }
                })
            } else {
                setTimeout(() => {
                    SetFile()
                }, 100);
            }
        }

        SetFile()
    });




    sndmain = document.createElement('div')

    sndmain.style = `width:100%;
    position: relative;
    min-height: 110px;`

    OK = document.createElement("button")
    OK.innerHTML = "OK"
    OK.className = "Reset"

    OK.style = `position: absolute;
        left:20px;
        bottom:-3px;
        width: 45%;
        height:35px;
        background: #383838;
        color:white;
        border-radius: 10px;
        transition: all .2s ;
        margin-block: 15px;
        border:transparent;`

    OK.onclick = function () {
        if (Clicked == false) {
            Clicked = true
            HidePre()
            leftbar.style.marginLeft = '-15%'
            setnewtubebg('')
            BG.style.setProperty('opacity', 0)
            setTimeout(() => {
                DOwithindexed(function () {
                    store.delete("PRESET(Current)")
                })
                BG.remove()
            }, 500);
            setTimeout(() => {
                BG.remove()
            }, 500);
        }
    }

    Cancel = document.createElement("button")
    Cancel.innerHTML = "Cancel"
    Cancel.className = "Reset"

    Cancel.style = `position: absolute;
        right:20px;
        bottom:-3px;
        width: 45%;
        height:35px;
        background: #383838;
        color:white;
        border-radius: 10px;
        transition: all .2s ;
        margin-block: 15px;
        border:transparent;`


    function CancelCode() {
        if (Clicked == false) {
            Clicked = true
            HidePre()
            leftbar.style.marginLeft = '-15%'
            setnewtubebg('')
            BG.style.setProperty('opacity', 0)
            if (USEING != `(Current)`) {
                DOwithindexed(function () {
                    let get = store.get("PRESET(Current)")
                    get.onsuccess = function (e) {
                        e.target.result.LoadNTubeCode()
                        store.delete("PRESET(Current)")
                    }
                    store.delete("PRESET(Current)")
                })
            }
            setTimeout(() => {
                DOwithindexed(function () {
                    store.delete("PRESET(Current)")
                })
                BG.remove()
            }, 500);
        }
    }

    Cancel.onclick = function () {
        CancelCode()
    }

    THISDES = createDes("✨ Select preset ✨", Main).style = `font-size: 25px; padding:10px; font-width:700;`

    THISDES.style = 'font-size:20px'

    Clicked = false

    BG.onclick = function () {
        if (hover == false) {
            CancelCode()
        }
    }

    LIST = document.createElement("body")
    LIST.style = `width: 90%;
    height: width: -webkit-fill-available;
    width: -moz-available;
    top: 50%;
    left: 50%;
    border-radius: 10px;
    border-bottom: solid white 1px;`

    LIST.id = `MAINPRESET`

    Main.appendChild(LIST)
    Main.append(sndmain)


    DOwithindexed(function () {
        let get = store.get("BGIMG")
        get.onsuccess = function (e) {
            let arr = GenNTubeCode()
            arr["BGIMG"] = e.target.result
            store.put(JSON.stringify(arr), "PRESET(Current)")
        }
    })

    let ALLPRE = JSON.parse(localStorage["nt-NUMPRESET"]),
        num


    for (num = 0; num < ALLPRE.length; num++) {
        createList(ALLPRE[num])
    }

    BoxSave = document.createElement("div")
    BoxSave.innerHTML = `<input type="text" id="TextPreset" placeholder="Enter preset name.">
    <button id="OKOver" disabled>Yes!</button>
    <button id="SavePreset">Save</button>`

    BoxSave.style = `display: flex;
    position: absolute;
    bottom: 60px;
    width: 95%;
    margin-left: 2.5%;
    height: 35px;
    flex-direction: row;`

    sndmain.appendChild(BoxSave)

    let TextPre = document.getElementById("TextPreset")
    let OKOver = document.getElementById("OKOver")
    let SavePRe = document.getElementById("SavePreset")

    TextPre.style = `width: -webkit-fill-available;
    width: -moz-available;
    background: rgb(56, 56, 56);
    border-radius: 10px;
    border: transparent;
    color: white;
    text-align: center;
    transition: all 0.2s ease 0s;`

    SavePRe.className = "Reset"
    SavePRe.style = `background: rgb(56, 56, 56);
    color: white;
    border-radius: 10px;
    border: transparent;
    height: 100%;
    width: 100px;
    margin-left: 10px;
    transition: all 0.2s ease 0s;`

    OKOver.className = "Reset"
    OKOver.style = `background: rgb(56, 56, 56);
    color: white;
    border-radius: 10px;
    border: transparent;
    width: 0px;
    height: 100%;
    opacity: 0;
    margin-left: 0px;
    padding:0px;
    transition: all 0.2s ease 0s;`

    var OverName

    OKOver.onclick = function () {
        DOwithindexed(function () {
            let get = store.get("BGIMG")
            get.onsuccess = function (e) {
                let arr = GenNTubeCode()
                arr["BGIMG"] = e.target.result
                store.put(JSON.stringify(arr), "PRESET" + OverName)
                hideOkOver()
            }
        })
    }

    function hideOkOver() {
        SavePRe.innerHTML = "Save"
        OKOver.style.opacity = "0"
        OKOver.style.width = "0px"
        OKOver.style.marginLeft = "0px"
        OKOver.style.padding = "0px"
        OKOver.setAttribute("disabled", "")
        CanSave = true
        TextPre.value = OverName
    }

    SavePRe.onclick = function () {
        if (CanSave == "Over") {
            hideOkOver()
        } else {
            if (CanSave == true) {
                if (TextPre.value != null && TextPre.value != "") {
                    CanSave = false
                    let f = 0,
                        arr = JSON.parse(localStorage["nt-NUMPRESET"])

                    OverName = TextPre.value


                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] == OverName) {
                            f++
                        }
                    }

                    if (f > 0) {
                        CanSave = "Over"
                        SavePRe.innerHTML = "Cancel"
                        TextPre.value = "This name has already exists , overwrite?"
                        OKOver.removeAttribute("disabled")
                        OKOver.style.opacity = "1"
                        OKOver.style.width = "70px"
                        OKOver.style.marginLeft = "10px"
                        OKOver.style.paddingInline = "5px"
                    } else {
                        let Par = createList(OverName)
                        Par.style.height = "0px"
                        Par.style.padding = "0px"
                        Par.style.opacity = "0"

                        DOwithindexed(function () {
                            let get = store.get("BGIMG")
                            get.onsuccess = function (e) {
                                let arr2 = GenNTubeCode(),
                                    Name = OverName
                                arr2["BGIMG"] = e.target.result
                                store.put(JSON.stringify(arr2), "PRESET" + Name)
                                localStorage["nt-NUMPRESET"] = JSON.stringify([...arr, Name])
                                Par.style.height = null
                                Par.style.padding = null
                                Par.style.opacity = null
                                CanSave = true
                            }
                        })

                        setTimeout(() => {
                            Par.scrollIntoView()
                        }, 100);
                    }
                }
            }
        }
    }

    sndmain.appendChild(OK)
    sndmain.appendChild(Cancel)
}









































//Function----------------------------------------------------------------------------

var THISPar = "NEWTUBE",
    LeftCount,
    LeftList

function createMainframe() {
    var List = document.createElement("p");
    List.className = "MainBox";
    List.id = THISPar

    var Head = document.createElement('label');
    Head.className = "DES"
    Head.innerHTML = THISPar
    Head.style = `width: -webkit-fill-available;
    width: -moz-available;
    font-size: 18px;
    padding: 10px;
    margin-inline: -10px;
    color: white !important;
    background: linear-gradient(45deg, transparent, rgb(133 75 130), transparent);
    text-align: center;
    border-radius: 20px;`

    List.appendChild(Head)

    LeftList = document.createElement('label');
    LeftList.className = "HoverList"
    LeftList.innerHTML = `<div class="NewtubeLeftText">${THISPar}</div>`

    LeftList.style = `
    position:relative;
    width: -webkit-fill-available;
    width: -moz-available;
    padding: 10px;
    color: white;`
    LeftCount++
    // document.getElementById("NEWTUBEBG").style.maxHeight = (LeftCount * 41) + "px"

    LeftList.onclick = function () {
        List.scrollIntoView({ behavior: 'smooth' });
    }

    document.getElementById("NEWTUBE").appendChild(List)
    document.getElementById("NEWTUBELIST").appendChild(LeftList)

    return List
};

function CreateNew(E) {
    var New = document.createElement("p")
    E.append(New)
    New.className = "New"

    New.innerHTML = "N"

    New.style = `
        position: absolute;
        top: -3.5px;
        left: 0px;
        width: 20px;
        height: 20px;
        background: #ff1308;
        border-radius: 3px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;`
}

function createframe(inner, NEW) {
    var List = document.createElement("p");
    List.className = "SndBox";
    List.innerHTML = inner;

    var ParFrame = document.getElementById(THISPar)

    if (ParFrame == null) {
        createMainframe()
    }

    document.getElementById(THISPar).appendChild(List)

    if (NEW) {
        CreateNew(List)
        if (LeftList.getElementsByClassName("New").length == 0) {
            CreateNew(LeftList)
        }
    }

    return List
};

function createDes(Des, Box) {
    var Descrip = document.createElement('label');
    Descrip.className = "DES";
    Descrip.innerHTML = Des;
    Box.appendChild(Descrip);

    return Descrip
};

function createCheck(id, Des, NEW, Value, IfTrue, IfFlase) {
    var Box = createframe('<input type="checkbox" id=' + id + ' class="CheckBox" >', NEW);
    createDes(Des, Box);

    ThisCheck = Box.getElementsByTagName("input")[0];

    if (Value != null) {
        ThisCheck.checked = Value
    } else {
        ThisCheck.checked = JSON.parse(localStorage["nt-" + id + "T"])
    }


    ThisCheck.addEventListener('input', function (WHAT) {
        var Tar = WHAT.target

        if (IfTrue || IfFlase) {
            if (Tar.checked == true) {
                IfTrue()
            } else {
                IfFlase()
            }
        } else {
            var Tarid = Tar.id

            localStorage["nt-" + Tarid + "T"] = Tar.checked

            if (Tarid == "Realtime") {
                RESETTUBE()
            }

            update()
        }

    })

    return Box
};


function createTextBox(id, Des, NEW) {
    var Box = createframe('<input type="number" id=' + id + ' class="TextBox" >', NEW);
    createDes(Des, Box);

    ThisText = document.getElementById(id);

    ThisText.value = localStorage["nt-" + id]

    ThisText.addEventListener(MODE, function (WHAT) {
        var Tar = WHAT.target
        localStorage["nt-" + Tar.id] = Tar.value
        update()
    });

    return Box
};


function PickerAndSlide(thiscolor) {
    localStorage["nt-" + thiscolor.id] = thiscolor.value
}

function createColor(id, Des, NEW) {
    var Box = createframe('<input type="color" id=' + id + 'C class="ColorPick" > <p> <label class="DES" >Opacity : </label> <input type="range" id=' + id + 'O class="slidebar" min="0" max="100" > </p>', NEW);

    Box.className = "DoY";

    var Box2 = document.createElement('p');
    Box2.className = "SndBox"

    document.getElementById(THISPar).appendChild(Box2)

    Box2.appendChild(Box)

    var THISDES = createDes(Des, Box2);

    THISDES.style = "padding:10px;"

    var thiscolor = document.getElementById(id + 'C');
    var thisopa = document.getElementById(id + 'O');


    thiscolor.value = localStorage["nt-" + id + 'C']
    thisopa.value = localStorage["nt-" + id + 'O']

    thiscolor.addEventListener(MODE, function (WHAT) {
        PickerAndSlide(WHAT.target)
        update();
    });

    thisopa.addEventListener(MODE, function (WHAT) {
        PickerAndSlide(WHAT.target)
        update();
    });

    return document.getElementById
};



function createselect(id, option, Des) {
    var Box = createframe('<select id=' + id + ' class="select" > ' + option + ' </select>');
    createDes(Des, Box);

    var thisSelect = document.getElementById(id);
    thisSelect.value = localStorage["nt-" + id + 'T']

    thisSelect.addEventListener("change", function (WHAT) {
        localStorage["nt-" + WHAT.target.id + 'T'] = WHAT.target.value
        update();
    });
};

String.prototype.GetSaveRgba = function () {
    var HEX = localStorage["nt-" + this + "C"].replace('#', '')
    var aRgbHex = HEX.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16) + ',' + parseInt(aRgbHex[1], 16) + ',' + parseInt(aRgbHex[2], 16)
    ]

    return `rgba(` + aRgb + `,` + (localStorage["nt-" + this + "O"] / 100) + `)`
}

function RenderPreImg(GettedImg) {

    var Preimg = document.getElementById("BGIMG")

    if (GettedImg == "") {
        Preimg.style.opacity = 0
    } else {
        Preimg.style.opacity = 1
        Preimg.style.aspectRatio = `${PreloadImg.width}/${PreloadImg.height}`

        requestAnimationFrame(function () {
            var imgcw = Preimg.clientWidth
            var imgch = Preimg.clientHeight

            Preimg.width = imgcw
            Preimg.height = imgch

            Preimg.getContext('2d').drawImage(PreloadImg, 0, 0, imgcw, imgch)

            document.getElementById("Imgid").href = GettedImg
            document.getElementById("Imgid").innerHTML = "Image link"
        })
    }
}

function applyIcon() {
    DOwithindexed(function () {
        let get = store.get("IconURL")
        get.onsuccess = function (e) {
            document.getElementById("IconUrlSHOW").style.setProperty("background-image", 'url("' + e.target.result + '")')
            document.getElementById("Iconid").href = e.target.result
            document.getElementById("Iconid").innerHTML = e.target.result
        };
    })
}


function ShowTexForIMG(Text) {
    document.getElementById("STATUS").innerHTML = Text
}

function ShowTexForICON(Text) {
    document.getElementById("IconSTATUS").innerHTML = Text
}

function IMGXY(Tar, S) {
    if (S == "S") {
        document.getElementById(Tar.id + "BOX").value = Tar.value
        update()
    } else {
        document.getElementById(Tar.id.substring(0, 4)).value = Tar.value
    }
    localStorage["nt-" + Tar.id.substring(0, 4)] = Tar.value
    update()
}

function CreateXY(XorY) {
    PoOrSize = ["position ", ""]
    Max = "100"
    if (XorY == "S") {
        PoOrSize = ["", "ize"]
        Max = "300"
    }
    createframe(`<lable class="DES">Image ` + PoOrSize[0] + XorY + PoOrSize[1] + ` : </lable>
    <input id="IMG`+ XorY + `" type="range" min=0 max=` + Max + `>`).appendChild(createTextBox("IMG" + XorY + "BOX", "%"))

    ThisSlide = document.getElementById("IMG" + XorY)
    ThisText = document.getElementById("IMG" + XorY + "BOX")

    ThisSlide.value = localStorage["nt-IMG" + XorY]
    ThisText.value = localStorage["nt-IMG" + XorY]

    if (localStorage["nt-RealtimeT"] == "true") {
        ThisSlide.addEventListener('input', function (WHAT) {
            IMGXY(WHAT.target, "S")
        })
        ThisText.addEventListener('input', function (WHAT) {
            IMGXY(WHAT.target)
        })
    } else {
        ThisSlide.addEventListener('change', function (WHAT) {
            IMGXY(WHAT.target, "S")
        })
        ThisText.addEventListener('change', function (WHAT) {
            IMGXY(WHAT.target)
        })
    }
}

String.prototype.LoadNTubeCode = function () {
    let array = JSON.parse(this),
        BG

    if (Object.prototype.toString.call(array) == '[object Object]') {
        Object.entries(array).forEach(entry => {
            const [key, value] = entry;
            // SkipLoadNTubeCode
            if (key != "ADDFONT" && key != "EnaFont") {
                if (key == "BGIMG") {
                    BG = value
                } else {
                    localStorage["nt-" + key] = value
                }
            }
        })
    } else {
        for (let i = 0; i < array.length; i = i + 2) {
            if (array[i] == "BGIMG") {
                BG = array[i + 1]
            } else {
                localStorage["nt-" + array[i]] = array[i + 1]
            }
        }
    }

    DOwithindexed(function () {
        store.put(BG, "BGIMG")
        update()
        RESETTUBE()
    })
}

function GenNTubeCode() {
    arrdata = {}
    for (z in localStorage) {
        if (z.substring(0, 3) == "nt-" && z != "nt-NUMPRESET" && z != 'nt-SHOWPRESET' && z != 'nt-EnableButtonT' && z != 'nt-RealtimeT' && z != 'nt-ErrorCollectT' && z != 'nt-ADDFONT' && z != 'nt-EnaFont') {
            arrdata[z.substring(3, z.length)] = localStorage[z]
        }
    }
    return arrdata
}

let v

function setV() {
    v = document.getElementsByClassName('video-stream html5-main-video')[0]
}

function FindVideo() {
    try {
        v.tagName
        if (v.tagName != "VIDEO") {
            // // console.log("FindVDOE")
            setV()
        }
    } catch (e) {
        // // console.log("FindVDOE")
        setV()
    }
    return v
}

var CreatedFontsCheck = []

function CreateFontsList() {

    CreatedFontsCheck.forEach(element => {
        element.remove()
    });

    CreatedFontsCheck = []


    AllFont.forEach(Thisfont => {
        FontCheck = createCheck(Thisfont, Thisfont, false, UnCompressEnaFont().includes(Thisfont),
            function () {
                EnaFont = UnCompressEnaFont()
                EnaFont.push(Thisfont)
                SaveEnaFont(EnaFont)
                update()
            },
            function () {
                EnaFont = UnCompressEnaFont()
                EnaFont.splice(EnaFont.indexOf(Thisfont), 1)
                SaveEnaFont(EnaFont)
                update()
            })
        FontLocatePar.append(FontCheck)
        CreatedFontsCheck.push(FontCheck)
    })
}

var AddedFontFrame
var CreatedAddedFontFrame = []

function CreateAddedFont() {
    CreatedAddedFontFrame.forEach(element => {
        element.remove()
    });

    AddedFont = UnCompressAddedFont()
    Object.keys(AddedFont).forEach(function (TheseFontName) {
        var GetTheseFont = AddedFont[TheseFontName]

        var TheseFontFrame = document.createElement("p")
        TheseFontFrame.style = `display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding-bottom:15px;
        margin-bottom: 15px;
        transition: margin-bottom 0.5s, padding-bottom 0.5s, height 0.5s;
        overflow: hidden;
        border-bottom: 1px solid cornflowerblue;`
        CreatedAddedFontFrame.push(TheseFontFrame)
        AddedFontFrame.append(TheseFontFrame)

        ListTheseFont = document.createElement("div")
        ListTheseFont.className = "DES"
        ListTheseFont.innerHTML = TheseFontName.substring(1, TheseFontName.length - 1).replaceAll("Quote", "").replaceAll(",", "<br><br>")
        ListTheseFont.style = `
        min-width: 150px;
        margin-right: 0px;`
        TheseFontFrame.append(ListTheseFont)

        StyleTheseFont = document.createElement("div")
        StyleTheseFont.className = "DES"
        StyleTheseFont.textContent = GetTheseFont[1]
        StyleTheseFont.style = `
        width: -webkit-fill-available;
        width: -moz-available;
        margin-left: 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: aquamarine;
        }`
        TheseFontFrame.append(StyleTheseFont)

        DeleteTheseFont = document.createElement("div")
        DeleteTheseFont.textContent = "X"
        TheseFontFrame.append(DeleteTheseFont)
        DeleteTheseFont.onclick = function () {
            console.log(GetTheseFont[0])
            RemoveListFont(GetTheseFont[0])
            TheseFontFrame.style.height = "0px"
            TheseFontFrame.style.paddingBottom = "0px"
            TheseFontFrame.style.marginBottom = "0px"
            setTimeout(() => {
                TheseFontFrame.remove()
            }, 500);
            CreateFontsList()
        }
        DeleteTheseFont.className = "ntdeletefont"
    })
}


























//Create MENU----------------------------------------------------------------------------
let SetBg, ThisCheckMainSetting
function CreateMENU() {
    LeftCount = 0

    let DeBu = `width: -webkit-fill-available;
    width: -moz-available;
    padding: 10px;
    background: rgb(94 94 94 / 76%);
    color: white;
    border-radius: 10px;
    transition: all 0.2s ease 0s;
    margin-inline: 10px;
    margin-block: 10px;
    border: transparent;
    border-bottom: 1px solid #ffffff6b;
    box-shadow: 0px 0px 3px;`

    if (localStorage["nt-RealtimeT"] == 'true') {
        MODE = 'input'
    } else {
        MODE = 'change'
    }

    let BG = document.createElement("div")
    BG.id = "NEWTUBEBG"
    BG.className = "NEWTUBE"
    BG.style = `resize: both; padding-top: 20px; width: 755px; height: 615px; max-height: -webkit-fill-available; max-height: -moz-available; position: fixed; top:56px; transition: opacity 0.5s, left 0.5s; z-index: 2020; display: flex; flex-direction: row;
    min-width: 602px;
    min-height: 247px;
    left: calc(100% - 755px);`
    document.body.appendChild(BG)

    let MoveBar = document.createElement("div")
    MoveBar.innerHTML = "Drag to move panel"
    MoveBar.id = "NEWTUBEHOVER"
    MoveBar.style = `position: absolute;
    top: 0px;
    transition: all 0.2s;
    border-bottom: 1px gray solid;
    border-radius: 20px;
    height: 20px; width:100%;
    background: linear-gradient(45deg, transparent, rgb(133, 75, 130), transparent);
    filter: grayscale(1);
    color: white;
    text-align: center;
    font-size: 15px;`;
    BG.appendChild(MoveBar)

    let CalMousePo = null

    function MoveToMouse(Mouse) {
        Mouse.preventDefault();
        BG.style.left = Mouse.clientX - CalMousePo[0] + "px"
        BG.style.top = Mouse.clientY - CalMousePo[1] + "px"
    }

    MoveBar.onmousedown = function (Mouse) {
        WidnowW = window.innerWidth
        CalMousePo = [Mouse.clientX - BG.offsetLeft, Mouse.clientY - BG.offsetTop]
        BG.style.transition = null
        addEventListener("mousemove", MoveToMouse)
    }

    document.onmouseup = function () {
        BG.style.transition = "opacity 0.5s, left 0.5s"
        removeEventListener("mousemove", MoveToMouse)
    }

    let LIST = document.createElement("div")
    LIST.id = "NEWTUBELIST"
    LIST.className = "NEWTUBE"
    LIST.style = "width: 210px; height: 100%; display: flex; flex-direction: column; border-radius: 20px; min-width: 210px;";
    BG.appendChild(LIST)

    SetBg = document.createElement("body")
    SetBg.id = "NEWTUBE";
    SetBg.className = "NEWTUBE"
    SetBg.style = "width: -webkit-fill-available; width: -moz-available; height: calc(100% - 50px); margin-top: 50px;";
    BG.appendChild(SetBg)

    var Reset = document.createElement('button')
    Reset.innerHTML = "Reset Extention (Remove saved)"
    Reset.className = "Reset"
    Reset.style = DeBu
    Reset.onclick = function () {
        localStorage.clear()
        DOwithindexed(function () {
            store.clear()
            SetNull()
            update()
            RESETTUBE()
        })
        location.reload()
    }
    SetBg.appendChild(Reset)

    //----------------------------------------------------------------------------------------------

    THISPar = "☕ Buy me a coffee!"

    DonateFrame = createframe(`<p style="display: flex; align-items: center; padding:10px; width: 100%;"><img src="https://i.ibb.co/269h23M/2020021209494988264-logo-truemoneywallet-300x300.jpg" class="DONATEIMG"><lable class="DES">Wallet ID : AzDonate</lable></p>
    <p style="display: flex; align-items: center; padding:10px; width: 100%;"><img src="https://i.ibb.co/4sCYzXK/index.jpg" class="DONATEIMG"><a id="HOVERLINK" href="https://www.paypal.com/signin?returnUri=https%3A%2F%2Fwww.paypal.com%2Fmyaccount%2Ftransfer%2Fhomepage%2Fexternal%2Fprofile%3FflowContextData%3DTmV7sH9Ip5x6ax_bhu-4ib7mr3qtJYLUST5ILgPTUCV-aPS5wiTHYReTyrjZUrzo6RnqrG_IGcMdzZxRSNMClpiXW_YUozCtGT_myuY-Iz482jS6LkbxXl-gkNRo--RFIFS5jtg954mBPuxa3P8N6dBFNsBMVJEOLK1-ZP-PxAwS6mdpbwpVFeEEuJwof9Nl2PE-NgFySGvPQWI_rjkTbugXS-O6HuRR3SRqTTe1SuhE25IMdYvBvUBK2y4zpVk2KbEVhQg63WzznD1emOkCq2orEG1bCTi0M4Txky3iSId11K7Xg8e_qpf4rjOaXEPDsIlw1IbKw3WAJRLdIHx0MJFLL0yfGjE7GzR42C0GeYLnods79sPkPJCqo2GjLZzLJ07epiRk2bv33AnwcLEwp4_eVm8TMwNFK-5JX_RZOd8AiOzq3_Q9hY_A19S&onboardData=%7B%22country.x%22%3A%22US%22%2C%22locale.x%22%3A%22en_US%22%2C%22intent%22%3A%22paypalme%22%2C%22redirect_url%22%3A%22https%253A%252F%252Fwww.paypal.com%252Fmyaccount%252Ftransfer%252Fhomepage%252Fexternal%252Fprofile%253FflowContextData%253DTmV7sH9Ip5x6ax_bhu-4ib7mr3qtJYLUST5ILgPTUCV-aPS5wiTHYReTyrjZUrzo6RnqrG_IGcMdzZxRSNMClpiXW_YUozCtGT_myuY-Iz482jS6LkbxXl-gkNRo--RFIFS5jtg954mBPuxa3P8N6dBFNsBMVJEOLK1-ZP-PxAwS6mdpbwpVFeEEuJwof9Nl2PE-NgFySGvPQWI_rjkTbugXS-O6HuRR3SRqTTe1SuhE25IMdYvBvUBK2y4zpVk2KbEVhQg63WzznD1emOkCq2orEG1bCTi0M4Txky3iSId11K7Xg8e_qpf4rjOaXEPDsIlw1IbKw3WAJRLdIHx0MJFLL0yfGjE7GzR42C0GeYLnods79sPkPJCqo2GjLZzLJ07epiRk2bv33AnwcLEwp4_eVm8TMwNFK-5JX_RZOd8AiOzq3_Q9hY_A19S%22%2C%22sendMoneyText%22%3A%22You%2520are%2520sending%2520Jakkrit%2520Kaewtong%22%7D" target="_blank" class="DES" >jakkrit_portraitist@hotmail.com</a></p>
    <p style="display: flex; align-items: center; padding:10px; width: 100%;"><img src="https://theme.zdassets.com/theme_assets/948919/d80b722da9edc37805def78a512b90c5772434a6.png" class="DONATEIMG"><a id="HOVERLINK" href="https://streamlabs.com/gfirstg/tip" target="_blank" class="DES" >streamlabs (PayPal / VISA / mastercard / AMEX / DISCOVER)</a></p>`);

    document.getElementById(THISPar).getElementsByTagName("label")[0].style = `
    -webkit-text-stroke: black 1px;
    text-shadow: 0px 0px 3px white;;
    width: -webkit-fill-available;
    width: -moz-available;
    font-size: 18px;
    padding: 10px;
    margin-inline: -10px;
    color: black;
    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
    animation: glowing 20s linear infinite;
    background-size: 400%;
    text-align: center;
    border-radius: 20px;`

    DonateFrame.style = `display: flex;
    flex-direction: column;`

    //----------------------------------------------------------------------------------------------

    THISPar = "🎉 Join my Discord 🎉"

    createframe(`<p style="display: flex; align-items: center;"><img src="https://brandlogos.net/wp-content/uploads/2021/11/discord-logo.png" class="DONATEIMG"><a id="HOVERLINK" href="https://discord.gg/BgxvVqap4G" target="_blank" class="DES" >NEWTUBE</a></p>`)

    //----------------------------------------------------------------------------------------------

    THISPar = "⚙️ Extention's settings"

    Frame = createMainframe()

    createframe(`<label class="DES">Version : ` + Ver + `</label>`)

    var Preset = document.createElement('button')
    Preset.innerHTML = "✨ Select Preset ✨"
    Preset.className = "Reset"
    Preset.style = DeBu + `width: 100% !important;
    margin-inline: 0px !important;
    margin-block-start: 20px !important;
    box-shadow: rgb(255 223 0) 0px 0px 3px;
    background: rgb(63 57 14);`
    Preset.onclick = function () {
        PRESET()
    }
    Frame.appendChild(Preset)

    createCheck("EnableButton", "Enable");

    createCheck("Realtime", "Realtime Changing (lag when changing!)");

    createCheck("ErrorCollect", "Error Detector");

    var Chlog = document.createElement('button')
    Chlog.innerHTML = "✳️ Changes log ✳️"
    Chlog.className = "Reset"
    Chlog.style = DeBu + `box-shadow: rgb(0 255 33) 0px 0px 3px;
    background: rgb(14 63 14);
}`
    Chlog.onclick = function () {
        window.open(
            'https://github.com/AzPepoze/Newtube',
            '_blank'
        )
    }

    SetBg.appendChild(Chlog)

    var Rebug = document.createElement('button')
    Rebug.innerHTML = "❗Report bugs/Issue❗"
    Rebug.className = "Reset"
    Rebug.style = DeBu + `background: rgb(135 51 51 / 76%);`
    Rebug.onclick = function () {
        window.open(
            'https://discord.gg/seDYEmvPbP',
            '_blank'
        )
    }

    SetBg.appendChild(Rebug)


    var FHotFix = document.createElement('button')
    FHotFix.innerHTML = "❗Firefox Hotfix❗<br>(Disable features that unstable)"
    FHotFix.className = "Reset"
    FHotFix.style = DeBu + `background: rgb(135 51 51 / 76%);`
    FHotFix.onclick = function () {

        DisableForFireFox()

        location.reload()
    }

    SetBg.appendChild(FHotFix)

    //-------------------------------------------------------------------------------

    THISPar = "📺 Video"

    createTextBox("PlayerEdge", "Round edges amount")

    createCheck("VdoAnim", "Enable Chaning Video transition")

    createColor("Time-LineBG", "Time-line background color")

    createColor("TimeLoaded", "Time-line loaded color")

    createColor("EndBG", "End of video chanel hover background color")

    createCheck("CenterUD", "(Under Video) Move tittle to the center")

    createCheck("CenterUDF", "(Fullscreen) Move tittle to the center")

    createCheck("FullTheater", "Enable Full Theater")

    createCheck("AutoPIP", "Auto Pictue In Pictue mode<br>(Pls click anywhere In page after you back to page)<br>(Security problem) (I do my best T_T)")
    createCheck("AutoEXPIP", "Auto exit Pictue In Pictue mode")

    createCheck("Flyout", "Enable Flyout Video (Show video after scroll down)", true)

    createTextBox("BelowSpace", "Space at Under of video", true)

    //-------------------------------------------------------------------------------

    THISPar = "🎆 Background Video"

    createCheck("VDOBG", "Enable<br>(NOT RECOMMEND FOR LOW END PC!)")

    createTextBox("CanvasQua", "% Quality")
    createTextBox("NVDOB", `Blur amount`)
    createTextBox("VDOSmooth", 'Smooth frame (Minimum & None is 1)')
    createTextBox("NVDOC", `Contrast`)
    createTextBox("NVDOBGT", `Brightness`)
    createTextBox("NVDOT", `Size`)

    //-------------------------------------------------------------------------------

    THISPar = "🎚️ Video control panel"

    createColor("VDOTEXT", "Text color")
    createColor("HBT", "Button hover color")

    createCheck("ControlUnderVDO", `Move to under of video`)
    createTextBox("MediaSpace", `Under video distance`)
    createCheck("AutohideBar", `Autohide (If you enabled Under VDO)`)
    createCheck("CenterMedia", "Move to center")
    createColor("MediaBG", "Background color")
    createCheck("BottomG", "Remove default background gradient")
    createTextBox("MediaH", "Background height")

    createCheck("PlayerOut", "Enable Borders/Shadows");
    createTextBox("PlayerBorder", "Borders/Shadows width")

    createCheck("MediaBlur", "Blur background")

    //-------------------------------------------------------------------------------

    THISPar = "🔤 Subtitles/Captions"

    createCheck("NewSub", `New Subtitles/Captions`)

    createColor("Subtitle", "Subtitles/Captions color")
    createColor("CapBG", "Subtitles/Captions background color")

    createTextBox("subWidth", `(Text) Width`)
    createTextBox("subSpace", `(Text) Space by letters`)

    createColor("subShaColor", `(Shadow) Color`)
    createTextBox("subShaBlur", `(Shadow) Blur amount`)

    createCheck("BlurSub", "Blur background")

    createCheck("CapOut", "Enable Borders/Shadows")

    //----------------------------------------------------------------------------------------------

    THISPar = "🔎 Topbar & Search"

    createCheck("Scroll", "(Topbar) Auto transparent")

    createColor("ThemeSnd", "(Topbar) Color")
    createCheck("TopOut", "(Topbar) Enable Borders/Shadows")

    createColor("ThemeChips", "(Second topbar) Topbar color")
    createCheck("SndOut", "(Second topbar) Enable Borders/Shadows")

    createCheck("SearchAnim", "Enable Search animation")

    //-------------------------------------------------------------------------------

    THISPar = "📰 Thumbnail/Clip cover"

    createTextBox("TimeEdge", "(UI in Thumbnail) Round edges amount")

    createColor("TIMETEXT", "Time text color")

    createColor("TimeBG", "Video preview time background color")

    createCheck("TimeOut", "Enable time Borders/Shadows")

    createTextBox("HoverBorder", "Hover Borders width")
    createColor("ThumbHoverColor", "Borders/Shadows on hover color")
    createColor("ThumbClick", "Borders/Shadows on click color")

    createselect("ThumbHover",
        `<option value="Slide">Slide</option>
	<option value="Zoom">Zoom</option>
    <option value="Slide&Zoom">Slide&Zoom</option>
	<option value="none">None</option>`,
        "Hover animation style")

    createTextBox("Zoom", 'Zoom amount (If you choose "Zoom")')

    createCheck("TimeAni", "Enable hide time when hover")

    createCheck("ThumbAnim", "Enable loaded animation")

    createCheck("CenterTime", "Move the time position to the center")

    createTextBox("TimeH", "Time height")

    //-------------------------------------------------------------------------------

    THISPar = "🎇 Enhancement"

    createTextBox("Edge", "Round edges amount (Most UI)")

    createCheck("SwapRow", "Swap left-right row (In watching mode)")

    //theme-------------------------------------------------------------------------------

    THISPar = "🌈 Color/Theme"

    createColor("Theme", "Main Theme color")

    createColor("ThemeThr", "Transparent-things theme color")

    createColor("ThemeFort", "Other theme color")

    createColor("LeftBar", "Left sidebar color")

    createColor("Text", "Main text color")

    createColor("NdText", "Second text color")

    createColor("LinkColor", "(Link) Text color")

    //theme-------------------------------------------------------------------------------

    THISPar = "▶️ Subscribe Button"

    createCheck("SPSubScribe", "Enable Separate Subscribe Button Color")

    createColor("SPSubScribeBG", "(Separate) Background color")

    createColor("SPSubScribeColor", "(Separate) Text color")

    createCheck("SubOut", "Enable Borders/Shadows")

    //-------------------------------------------------------------------------------

    THISPar = "💠 Logo"

    createCheck("IconFill", `Logo theme sync with Theme 1<br>Work when disable *Custom Top-Left Icon Image*`)

    var IconFrame = createframe(`<lable class="DES">Tab Icon Image (Recommend to use URL)</lable>
    <p><input id="IconFrame" type="file" accept="image/*" > </p>
    <p class="DES">Enter URL :  </label><input id="IconURL" class="TextBox" type="text" style="display: flex;"></p>
    <p><lable class="DES" style="display: flex; text-align: center;" id="IconSTATUS"></label></p>`)

    IconFrame.style = `display: flex; flex-direction: column;`

    var IconURL = document.getElementById("IconURL")
    IconURL.style = `width:200px;  margin-bottom: 10px;`

    IconURL.addEventListener('change', function () {
        ShowTexForICON("Please wait...")
        DOwithindexed(function () {
            store.put(IconURL.value, "IconURL")
            UpdateIcon()
            applyIcon()
            ShowTexForICON("Successful.</br>(If an image didn't show up.Then the URL can't access.)")
            IconURL.value = ``
        })
    })

    var Par = document.createElement('p')
    Par.style = "margin-block: 10px; width:100%;"
    var IconArea = document.createElement('canvas')
    IconArea.id = "IconUrlSHOW"
    IconArea.style = `background-repeat: no-repeat; background-position: center; background-size: contain; width:100%;`

    IconFrame.appendChild(Par)
    Par.appendChild(IconArea)

    var Iconinput = document.getElementById('IconFrame');
    Iconinput.setAttribute('Newtube', '')
    Iconinput.style = "margin-block: 10px; padding:10px; color:white; border-radius:10px; background:rgb(37, 37, 37);"
    Iconinput.onchange = function (evt) {
        var file = evt.target.files[0]
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
            ShowTexForICON("Please wait...")
            DOwithindexed(function () {
                store.put(reader.result, "IconURL")
                applyIcon()
                UpdateIcon()
                ShowTexForICON("Successful.</br>(If an image not show yet,Your image might too large!)")
            })
        });
        try {
            reader.readAsDataURL(file);
        } catch (e) {

        }
    }

    Iconid = document.createElement('a')
    Iconid.className = "DES"
    Iconid.style = `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;`
    Iconid.id = "Iconid"
    Iconid.target = "_blank"

    IconFrame.appendChild(Iconid)


    var ResetBu = document.createElement('button')
    ResetBu.innerHTML = "Reset"
    ResetBu.className = "Reset"
    ResetBu.style = `margin-block-start: 10px;
    color: #ffffff;
    border-radius: 10px;
    transition: all 0.2s;
    background: #242424;
    border: transparent;
    padding: 5px;
    padding-inline: 10px;`
    ResetBu.onclick = function () {
        DOwithindexed(function () {
            store.put('https://www.youtube.com/s/desktop/6588612c/img/favicon.ico', "IconURL")
            applyIcon()
            UpdateIcon()
        })
    }
    IconFrame.appendChild(ResetBu)

    applyIcon()

    createCheck("ReplaceYT", "Enable Custom Top-Left Icon Image")

    let ReplaceYTFrame = createframe(`<lable class="DES">Top-Left Icon Image</lable>
    <p class="DES" style="display: flex; align-items: center; width:-webkit-fill-available;">Enter URL :  </label><input id="ReplaceYTLOGO" style="width:380px; margin-left: 10px; margin-bottom: 10px;" class="TextBox" type="text" style="display: flex;"></p>
    <a class="yt-simple-endpoint style-scope ytd-topbar-logo-renderer" id="logo" aria-label="" href="/" title="หน้าแรกของ YouTube">
    <div class="style-scope ytd-topbar-logo-renderer">
        <ytd-logo class="style-scope ytd-topbar-logo-renderer"><yt-icon id="logo-icon" class="style-scope ytd-logo"><yt-icon-shape class="style-scope yt-icon"><icon-shape class="yt-spec-icon-shape"><div style="width: 100%; height: 100%; fill: currentcolor;"><svg class="external-icon" viewBox="0 0 90 20" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">
    <svg viewBox="0 0 90 20" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <g>
        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
        <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path>
        </g>
        <g>
        <g>
            <path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z"></path>
            <path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0647 7.34234 47.3234 8.15137C47.5821 8.96275 47.7115 10.0422 47.7115 11.3898V13.2078C47.7115 14.5437 47.5845 15.6161 47.3329 16.4251C47.0812 17.2365 46.672 17.8292 46.1075 18.2031C45.5431 18.5771 44.7764 18.7652 43.8098 18.7652C42.8126 18.7675 42.0342 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8074 7.7351C43.4265 7.7351 43.156 7.94206 43.0008 8.35833C42.8432 8.77461 42.7656 9.43077 42.7656 10.3292V14.2309C42.7656 15.1575 42.8408 15.8254 42.9914 16.2323C43.1419 16.6415 43.4123 16.8461 43.8074 16.8461C44.2026 16.8461 44.4777 16.6415 44.6353 16.2323Z"></path>
            <path d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z"></path>
            <path d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z"></path>
            <path d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z"></path>
            <path d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z"></path>
            <path d="M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.7942 16.343C86.9518 16.0161 87.0365 15.4705 87.0506 14.7085L89.4824 14.8519C89.4965 14.9601 89.5035 15.1106 89.5035 15.3011C89.5035 16.4582 89.186 17.3237 88.5534 17.8952C87.9208 18.4667 87.0247 18.7536 85.8676 18.7536C84.4777 18.7536 83.504 18.3185 82.9466 17.446C82.3869 16.5735 82.1094 15.2259 82.1094 13.4008V11.2136C82.1094 9.33452 82.3987 7.96105 82.9772 7.09558C83.5558 6.2301 84.5459 5.79736 85.9499 5.79736C86.9165 5.79736 87.6597 5.97375 88.1771 6.32888C88.6945 6.684 89.059 7.23433 89.2707 7.98457C89.4824 8.7348 89.5882 9.76961 89.5882 11.0913V13.2362H84.8657V13.8712ZM85.2232 7.96811C85.0797 8.14449 84.9857 8.43377 84.9363 8.83593C84.8892 9.2381 84.8657 9.84722 84.8657 10.6657V11.5641H86.9283V10.6657C86.9283 9.86133 86.9001 9.25221 86.846 8.83593C86.7919 8.41966 86.6931 8.12803 86.5496 7.95635C86.4062 7.78702 86.1851 7.7 85.8864 7.7C85.5854 7.70235 85.3643 7.79172 85.2232 7.96811Z"></path>
        </g>
        </g>
    </svg>
    </svg></div></icon-shape></yt-icon-shape></yt-icon></ytd-logo>
    </div>
    <ytd-yoodle-renderer class="style-scope ytd-topbar-logo-renderer" hidden=""><!--css-build:shady--><!--css-build:shady--><picture class="style-scope ytd-yoodle-renderer" hidden="">
    <source type="image/webp" class="style-scope ytd-yoodle-renderer">
    <img class="style-scope ytd-yoodle-renderer">
    </picture>
    <ytd-logo class="style-scope ytd-yoodle-renderer"><!--css-build:shady--><!--css-build:shady--><yt-icon id="logo-icon" class="style-scope ytd-logo"><!--css-build:shady--><!--css-build:shady--><yt-icon-shape class="style-scope yt-icon"><icon-shape class="yt-spec-icon-shape"><div style="width: 100%; height: 100%; fill: currentcolor;"><svg class="external-icon" viewBox="0 0 90 20" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">
    <svg viewBox="0 0 90 20" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <g>
        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
        <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path>
        </g>
        <g>
        <g>
            <path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z"></path>
            <path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0647 7.34234 47.3234 8.15137C47.5821 8.96275 47.7115 10.0422 47.7115 11.3898V13.2078C47.7115 14.5437 47.5845 15.6161 47.3329 16.4251C47.0812 17.2365 46.672 17.8292 46.1075 18.2031C45.5431 18.5771 44.7764 18.7652 43.8098 18.7652C42.8126 18.7675 42.0342 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8074 7.7351C43.4265 7.7351 43.156 7.94206 43.0008 8.35833C42.8432 8.77461 42.7656 9.43077 42.7656 10.3292V14.2309C42.7656 15.1575 42.8408 15.8254 42.9914 16.2323C43.1419 16.6415 43.4123 16.8461 43.8074 16.8461C44.2026 16.8461 44.4777 16.6415 44.6353 16.2323Z"></path>
            <path d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z"></path>
            <path d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z"></path>
            <path d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z"></path>
            <path d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z"></path>
            <path d="M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.7942 16.343C86.9518 16.0161 87.0365 15.4705 87.0506 14.7085L89.4824 14.8519C89.4965 14.9601 89.5035 15.1106 89.5035 15.3011C89.5035 16.4582 89.186 17.3237 88.5534 17.8952C87.9208 18.4667 87.0247 18.7536 85.8676 18.7536C84.4777 18.7536 83.504 18.3185 82.9466 17.446C82.3869 16.5735 82.1094 15.2259 82.1094 13.4008V11.2136C82.1094 9.33452 82.3987 7.96105 82.9772 7.09558C83.5558 6.2301 84.5459 5.79736 85.9499 5.79736C86.9165 5.79736 87.6597 5.97375 88.1771 6.32888C88.6945 6.684 89.059 7.23433 89.2707 7.98457C89.4824 8.7348 89.5882 9.76961 89.5882 11.0913V13.2362H84.8657V13.8712ZM85.2232 7.96811C85.0797 8.14449 84.9857 8.43377 84.9363 8.83593C84.8892 9.2381 84.8657 9.84722 84.8657 10.6657V11.5641H86.9283V10.6657C86.9283 9.86133 86.9001 9.25221 86.846 8.83593C86.7919 8.41966 86.6931 8.12803 86.5496 7.95635C86.4062 7.78702 86.1851 7.7 85.8864 7.7C85.5854 7.70235 85.3643 7.79172 85.2232 7.96811Z"></path>
        </g>
        </g>
    </svg>
    </svg></div></icon-shape></yt-icon-shape></yt-icon></ytd-logo>
    <ytd-lottie-player class="style-scope ytd-yoodle-renderer" hidden=""></ytd-lottie-player></ytd-yoodle-renderer>
    </a>`)

    ReplaceYTFrame.style = `display: flex; flex-direction: column;`

    let ReplaceYTLOGO = document.getElementById("ReplaceYTLOGO")

    ReplaceYTLOGO.addEventListener('change', function () {
        localStorage["nt-ReplaceYTURL"] = ReplaceYTLOGO.value
        ReplaceYTLOGO.value = ""
        update()
    })

    var ReplaceResetBu = document.createElement('button')
    ReplaceResetBu.innerHTML = "Reset"
    ReplaceResetBu.className = "Reset"
    ReplaceResetBu.style = `margin-block-start: 10px;
    color: #ffffff;
    border-radius: 10px;
    transition: all 0.2s;
    background: #242424;
    border: transparent;
    padding: 5px;
    padding-inline: 10px;`

    ReplaceYTFrame.append(ReplaceResetBu)

    ReplaceResetBu.onclick = function () {
        localStorage["nt-ReplaceYTURL"] = ""
        ReplaceYTLOGO.value = ""
        update()
    }

    createTextBox("YTSize", "% Logo image size")


    //Outline-------------------------------------------------------------------------------

    THISPar = "🔳 Borders / Shadows"

    createselect("OutOrSha",
        `<option value="Out">Borders</option>
	<option value="Sha">Shadows</option>
	<option value="None">None</option>`,
        "Borders or Shadows")

    createTextBox("Border", "Borders/Shadows width")

    createColor("OutSha", "Borders/Shadows Color")

    //BG-------------------------------------------------------------------------------

    THISPar = "🎴 Background"

    createColor("BG", " Change background/tint color")

    createTextBox("BlurBGAM", "Background blur amount (0 = None)")

    createCheck("API", "Use upload api (imgbb.com)")

    var ChooseBG = createframe(`<lable class="DES">Background Image (Recommend to use URL)</lable>
    <p><input id="ChooseBG" type="file" accept="image/*" > </p>
    <p><label class="DES" style="display: block; text-align: center; margin-block: 15px; flex-direction: column;">If your computer is slow. You should enable</br>"Use upload api" button for saving your computer. ♥♥♥</br>(If not please disable it to save your internet. ♥♥♥)</label> </p>
    <p><label class="DES" style="display: flex; text-align: center; margin-bottom: 30px;">(Thanks you imgbb.com for free api image upload! ♥)</label> </p>
    <p><label class="DES">Enter URL :</label><input id="IMGFORBG" class="TextBox" type="text" style="display: flex;"></p>
    <p><lable class="DES" style="display: flex; text-align: center;" id="STATUS"></label></p>`)

    ChooseBG.style = `display: flex; flex-direction: column;`

    var IMGURL = document.getElementById("IMGFORBG")
    IMGURL.style = `width:200px;  margin-bottom: 10px;`

    IMGURL.addEventListener('change', function () {
        ShowTexForIMG("Please wait...")
        DOwithindexed(function () {
            store.put(IMGURL.value, "BGIMG")
            update()
            ShowTexForIMG("Successful.</br>(If an image didn't show up.Then the URL can't access.)")
            IMGURL.value = ``
        })
    })

    var Par = document.createElement('p')
    Par.style = "margin-block: 10px; width:100%;"
    var ThisIMG = document.createElement('canvas')
    ThisIMG.id = "BGIMG"
    ThisIMG.style = `width:100%;`

    ChooseBG.appendChild(Par)
    Par.appendChild(ThisIMG)

    var input = document.getElementById('ChooseBG');
    input.style = "margin-block: 10px; padding:10px; color:white; border-radius:10px; background:rgb(37, 37, 37);"
    input.setAttribute('Newtube', '')
    input.onchange = function (evt) {
        ShowTexForIMG("Please wait...")
        var file = evt.target.files[0]
        if (localStorage["nt-APIT"] == "true") {
            if (request) {
                request.abort();
            }

            ShowTexForIMG("Uploading...")

            d = new Date();
            body = new FormData();
            body.append("image", evt.target.files[0]);
            body.append("name", d.getTime());

            request = new XMLHttpRequest();
            request.open('POST', 'https://api.imgbb.com/1/upload?key=7a66c339da2a9aefedd8ad5e6c62e89f');

            request.upload.addEventListener('progress', function (e) {
                percent_completed = (e.loaded / e.total) * 100;
                ShowTexForIMG("Uploading...(" + percent_completed.toFixed(2) + "%)");
            });

            request.addEventListener('load', function (e) {
                serverSent = null
                try {
                    serverSent = JSON.parse(request.response)
                } catch (error) {
                    serverSent = JSON.parse(request.response.split("\n")[request.response.split("\n").length - 1])
                }

                if (serverSent["success"] == true) {
                    // console.log(serverSent)
                    DOwithindexed(function () {
                        store.put(serverSent["data"]["url"], "BGIMG")
                        update()
                        ShowTexForIMG("Successful.</br>(If an image not show yet please wait.)")
                    })
                } else {
                    ShowTexForIMG("Eror!</br>Make sure your image not over 32MB then try again")
                }
                request = null
                input.value = null
            });
            request.send(body);
        } else {
            const reader = new FileReader();
            reader.addEventListener('loadend', () => {
                DOwithindexed(function () {
                    store.put(reader.result, "BGIMG")
                    update()
                    ShowTexForIMG("Successful.</br>(If an image not show yet please wait.)")
                })
            });
            try {
                reader.readAsDataURL(file);
            } catch (e) {

            }
        }
    }

    let imgid = document.createElement('a')
    imgid.className = "DES"
    imgid.style = `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;`
    imgid.id = "Imgid"
    imgid.target = "_blank"

    ChooseBG.appendChild(imgid)


    var RemoveBu = document.createElement('button')
    RemoveBu.innerHTML = "Remove"
    RemoveBu.className = "Reset"
    RemoveBu.style = `margin-block-start: 10px;
    color: #ffffff;
    border-radius: 10px;
    transition: all 0.2s;
    background: #242424;
    border: transparent;
    padding: 5px;
    padding-inline: 10px;`
    RemoveBu.onclick = function () {
        if (request) {
            request.abort();
        }
        DOwithindexed(function () {
            store.put("", "BGIMG")
            update()
        })
    }
    ChooseBG.appendChild(RemoveBu)

    CreateXY("X")
    CreateXY("Y")
    CreateXY("S")

    createCheck("Flip", "Enable flip image")

    createCheck("Repeat", "Enable repeat image")


    //blur-------------------------------------------------------------------------------

    THISPar = "🪟 Blur"

    createTextBox("BlurAm", "Blur amount")

    createselect("BlurWhat",
        `<option value="all">All (Lag!)</option>
	<option value="main">Main-things</option>
	<option value="none">None</option>`,
        "Things to blur")

    //Animate-------------------------------------------------------------------------------

    THISPar = "🚶 Animations"

    createCheck("Ptran", "Enable Page transition")

    //Hover-------------------------------------------------------------------------------

    THISPar = "🖱️ Hover/Click color"

    createColor("Themehover", "Most hover background color")

    createColor("Playlisthover", "(Playlist) hover background color")

    //-------------------------------------------------------------------------------

    THISPar = "⚛️ Other settings"

    createTextBox("ScWidth", "(Scrollbar) width")

    createCheck("VBG", "(Video) remove background solid color (Theater mode)")

    DOwithindexed(function () {
        let get = store.get("BGIMG")
        get.onsuccess = function (e) {
            RenderPreImg(e.target.result)
        }
    })


    //-------------------------------------------------------------------------------

    THISPar = "🔠 Fonts"

    FontLocatePar = createMainframe()

    //Add Added Font

    AddedFontFrame = createframe(`<div class="DES" style="text-align: center;width: 100%; margin-bottom:30px;">Added Fonts</div>`, true)
    AddedFontFrame.style = `display: flex;
    flex-direction: column;`

    CreateAddedFont()

    AddFontFrame = createframe(`<a id="HOVERLINK" style="margin-bottom: 20px;font-size: 18px;background: #4b4b4b;padding: 10px;border-radius: 10px;" href="https://youtu.be/Lk145lrTIcU" target="_blank" class="DES" >See how to add fonts!</a>
    <textarea id="NTInstallFont" style="background: rgb(30, 30, 30); color: white; width: 100%; resize: vertical; height: 200px; font-size: 18px;" placeholder="Paste Fonts here."></textarea>
    <div id="ntAddFont" class="DES" style="background: #005100; border: #72ff72 solid 1px; border-radius: 10px; padding: 10px; margin-top: 20px;">✳️ Add fonts ✳️</div>`, true)

    AddFontFrame.style = `display: flex;flex-direction: column;align-content: center;align-items: center; width: 100%;`

    let InstallFont = document.getElementById("NTInstallFont")

    document.getElementById("ntAddFont").onclick = function () {
        AddedFont = UnCompressAddedFont()
        ThisFontLinkName = GetFontName(InstallFont.value)
        FontID = JSON.stringify(ThisFontLinkName)
        FontID = FontID.replaceAll('"', "Quote")

        if (AddedFont[FontID] == null) {
            AddListFont(InstallFont.value)
            update()
            CreateFontsList()
            CreateAddedFont()
        } else {
            alert("This font has already Added")
        }

        InstallFont.value = ""
    }

    CreateFontsList()

    //-------------------------------------------------------------------------------

    THISPar = "⏫ Additional CSS"

    createCheck("EnaADDCSS", "Enable Additional CSS")

    createframe(`<textarea id="Additional_CSS" placeholder="Paste CSS here." style="background: rgb(30, 30, 30); color: white; width: 100%; resize: vertical; font-size: 18px; height: 400px;"></textarea>`)

    ADDTEXT = document.getElementById("Additional_CSS")

    ADDTEXT.value = localStorage["nt-ADDCUSTOM"]

    ADDTEXT.addEventListener('change', function () {
        localStorage["nt-ADDCUSTOM"] = ADDTEXT.value
        update()
    })

    //-------------------------------------------------------------------------------

    THISPar = "📜 Import / Export Style"

    imexstyle = `width: 100%;
    padding: 10px;
    margin-block: 5px;
    right: 0px;
    top: 560px;
    background: rgb(56 56 56);
    color: white;
    border-radius: 10px;
    transition: all 0.5s ease 0s;
    border: transparent;`

    LocatePar = createMainframe()


    createframe(`<textarea id="Export" style="background: rgb(30, 30, 30); color: white; width: 100%; resize: vertical; height: 400px; font-size: 18px;" placeholder="Paste NTubeCode here."></textarea>`)

    var ExportTEXT = document.getElementById("Export")


    var Import = document.createElement('button')
    Import.innerHTML = "Import NTubeCode"
    Import.className = "Reset"
    Import.style = imexstyle

    LocatePar.appendChild(Import)

    var Export = document.createElement('button')
    Export.innerHTML = "Export NTubeCode"
    Export.className = "Reset"
    Export.style = imexstyle

    LocatePar.appendChild(Export)

    var Export2 = document.createElement('button')
    Export2.innerHTML = "Export Style as CSS"
    Export2.className = "Reset"
    Export2.style = imexstyle

    LocatePar.appendChild(Export2)


    Import.onclick = function () {
        let save = ExportTEXT.value
        ExportTEXT.value = "Please wait...(If it's take too long it might eror!)"
        save.LoadNTubeCode()
        ExportTEXT.value = "Successful."
    }

    Export.onclick = function () {
        ExportTEXT.value = "Please wait..."
        DOwithindexed(function () {
            let get = store.get("BGIMG")
            get.onsuccess = function (e) {
                let arr = GenNTubeCode()
                if (e.target.result == null) {
                    arr["BGIMG"] = ""
                } else {
                    arr["BGIMG"] = e.target.result
                }
                gentext = JSON.stringify(arr).replace(/",/g, '",\n')
                gentext = gentext.substring(0, 1) + '\n' + gentext.substring(1)
                gentextL = gentext.length
                gentext = gentext.substring(0, gentextL - 1) + '\n' + gentext.substring(gentextL - 1)
                ExportTEXT.value = gentext
            }
        })
    }

    Export2.onclick = function () {
        ExportTEXT.value = "Please wait..."
        ExportTEXT.value = Collect_Style
    }

    //-------------------------------------------------------------------------------

    THISPar = "📝 Custom CSS"

    createCheck("EnaCUSCSS", "Enable Custom CSS")

    createframe(`<textarea id="Custom_CSS" placeholder="Paste CSS here." style="background: rgb(30, 30, 30); color: white; width: 100%; resize: vertical; font-size: 18px; height: 400px;"></textarea>`)

    CusText = document.getElementById("Custom_CSS")

    CusText.value = localStorage["nt-CUSTOM"]

    CusText.addEventListener('change', function () {
        localStorage["nt-CUSTOM"] = CusText.value
        update()
    })

    //-------------------------------------------------------------------------------

    THISPar = "🌠 Beta features!"

    createframe(`<label class="DES">Maybe need to reload website</label>`)

    createCheck("Visual", "Audio Visualizer")

    createCheck("NewVDOanima", "New video animation (Volume up/down,Pause,Play)")

    createCheck("DelBar", "Remove black bar top-bottom (Background VDO Should Enabled)")
    createCheck("DropFrame", "Remove black bar Lazy Check (Drop frame)")
    createCheck("DelBarDebug", "Remove black bar Debug")
    createCheck("CheckStatic", "Check Static video (for Background VDO & Remove black bar)")




    //----------------------------------------------------------------------------------

    var NewtubeSearch = document.createElement('input')
    NewtubeSearch.id = "NtSearch"
    NewtubeSearch.style = `
    position: absolute;
    width: -webkit-fill-available;
    width: -moz-available;
    height: 40px;
    top: 20px;
    border-radius: 0px 0px 20px 20px;
    color: white;
    font-size: 20px;
    padding-left: 20px;
    background: transparent;
    border: none;
    border-bottom: #d084ffb8 dotted;
    `
    NewtubeSearch.placeholder = "Search"
    SetBg.appendChild(NewtubeSearch)

    function StartSearch() {
        var SearchText = NewtubeSearch.value
        var RegExpText = new RegExp(SearchText, "gi")
        var All = SetBg.getElementsByClassName("DES")

        var AllMain = SetBg.childNodes

        AllMain.forEach(element => {
            if (element != NewtubeSearch) {
                element.style.display = "none"
            }

            if (SearchText == "") {
                element.style.display = ""
            }
        })

        for (let index = 0; index < All.length; index++) {
            var element = All[index]
            GetMainSetting(element)
            var inner = element.innerHTML

            inner = inner.replaceAll("<mark>", '')
            inner = inner.replaceAll("</mark>", '')

            if (SearchText == "") {
                ThisCheckMainSetting.style.display = ""
            } else {
                // if (inner.search(SearchText) >= 0) {
                //     ThisCheckMainSetting.style.display = ""
                // }

                inner = inner.replace(RegExpText, function name(match) {
                    ThisCheckMainSetting.style.display = ""
                    return `<mark>${match}</mark>`
                })
            }

            element.innerHTML = inner

        }
    }

    var changing = 0
    NewtubeSearch.addEventListener("input", function () {
        changing += 1
        setTimeout(() => {
            changing -= 1
            if (changing == 0) {
                StartSearch()
            }
        }, 100);
    })
}

function GetMainSetting(thisElement) {
    var ParElement = thisElement.parentNode
    if (ParElement == SetBg) {
        ThisCheckMainSetting = thisElement
    } else {
        GetMainSetting(ParElement)
    }
}
























//----------------------------------------------------------------------------------
function Show() {
    document.getElementById("NEWTUBEBG").style.setProperty('left', "calc(100% - 755px)");
    document.getElementById("NEWTUBEBG").style.setProperty('opacity', "1");
}

function Hide() {
    document.getElementById("NEWTUBEBG").style.setProperty('left', "95%");
    document.getElementById("NEWTUBEBG").style.setProperty('opacity', "0");
}

var Can = false
function clickSetting() {
    // console.log(Can)
    if (Can == true) {
        if (document.getElementById("NEWTUBEBG") == null) {
            Can = false
            CreateMENU()
            Hide()
            setTimeout(() => {
                Show()
            }, 1);

            Arr = document.getElementById("NEWTUBELIST").getElementsByTagName("label")

            setTimeout(() => {
                Can = true
            }, 500);

            for (z = 0; z < Arr.length; z++) {
                let mem = z
                Arr[mem].style.setProperty('opacity', "0");
                Arr[mem].style.setProperty('margin-block-start', "20px");
                setTimeout(() => {
                    Arr[mem].style.setProperty('opacity', "1");
                    Arr[mem].style.setProperty('margin-block-start', "0px");
                }, mem * 80);
            }

        } else {
            Can = false
            Hide()
            setTimeout(() => {
                document.getElementById("NEWTUBEBG").remove()
            }, 505)
            setTimeout(() => {
                Can = true
            }, 600)
        }
    }
}



let volchange = 0

function UpdateVol() {
    volchange++
    voldata = document.getElementsByClassName("ytp-volume-panel")[0]
    volvalue = voldata.getAttribute('aria-valuenow')
    volpanel.innerHTML = volvalue + `%`

    if (volchange == 1) {
        volpanel.style.opacity = 1
        volpanel.style.top = '10px'
    }

    setTimeout(() => {
        volchange--
        if (volchange == 0) {
            volpanel.style.opacity = 0
            volpanel.style.top = '-50px'
        }
    }, 1000);
}


function ShowUpdated() {
    // console.log("ShowUp")
    upbg = document.createElement('div')
    upbg.style = `
    width: 800px;
    height: 160px;
    position: fixed;
    z-index: 3000;
    transition: all 0.5s ease 0s;
    opacity: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    left: calc(50% - 400px);
    bottom: -160px;
    background: #00000087;
    border-radius: 20px;
    box-shadow: white 0px 0px 4px;
    backdrop-filter: blur(10px);
    `

    upbg.innerHTML = `
    <div style="
    width: 100%;
    height: 60%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    ">
    
    <img src=https://media.tenor.com/gNcXkIbCvpsAAAAj/tsurumaki-kokoro.gif"
    style="height:60%;
    padding: 20px;">
    <p style="
    font-size: 28px;
    padding: 10px;
    color: white;
    font-weight: 700;
    font-family: cursive !important;
    ">🎉</p>
    <img src=`+ chrome.runtime.getURL('icon/64.png') + `
    style="
    filter: drop-shadow(0px 0px 8px rgba(255,255,255,0.7));
    ">
    <p style="
    font-size: 28px;
    padding: 10px;
    color: white;
    font-weight: 700;
    font-family: cursive !important;
    "> Newtube `+ Ver + ` has updated! 🎉</p>
    <img src=https://media.tenor.com/gNcXkIbCvpsAAAAj/tsurumaki-kokoro.gif"
    style="height:60%;
    padding: 20px;">
    
    </div>
    
    
    <div id="sndUpdatedBlock" style="
    width: 100%;
    height: 25%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    ">
    
    </div>`

    document.body.append(upbg)
    sndblock = document.getElementById('sndUpdatedBlock')

    okbut = document.createElement('div')
    okbut.className = `Reset`
    okbut.style = `
    width: 40%;
    height: 30px;
    box-shadow: inset rgb(87, 255, 188) 0px 0px 1px 1px;
    background: transparent;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease 0s;
    padding: 5px;
    color: rgb(87, 255, 188);
    font-family: cursive !important;
    `
    okbut.innerHTML = "Ok !"

    sndblock.append(okbut)


    setTimeout(() => {
        upbg.style.bottom = '10px'
        upbg.style.opacity = '1'
        setTimeout(() => {
            upbg.style.transition = "all 0.5s ease"
        }, 1000)
    }, 200);

    okbut.onclick = function () {
        upbg.style.opacity = '0'
        upbg.style.bottom = '-130px'
        DOwithindexed(function () {
            store.put(Ver, "Oldver")
        })
        setTimeout(() => {
            upbg.remove()
        }, 500)
    }

    changelogbt = document.createElement('div')
    changelogbt.className = `Reset`
    changelogbt.style = `
    width: 40%;
    height: 30px;
    box-shadow: inset rgb(255 201 87) 0px 0px 1px 1px;
    background: transparent;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease 0s;
    padding: 5px;
    margin-left: 10px;
    color: rgb(255 201 87);
    font-family: cursive !important;
    `
    changelogbt.innerHTML = "Changes log"

    changelogbt.onclick = function () {
        window.open(
            'https://github.com/AzPepoze/Newtube',
            '_blank'
        )
    }

    sndblock.append(changelogbt)
}

SeeRemove = 1

function SettoEnd() {
    setTimeout(() => {
        if (document.getElementById("end") == null) {
            SettoEnd()
        }
        else {
            if (document.getElementById("NEWTUBESET") == null) {
                document.getElementById("end").appendChild(Set);

                // window.addEventListener('yt-page-data-updated', FindBelow)
                // FindBelow()
                if (SeeRemove == 1) {
                    if (localStorage["nt-SHOWPRESET"] == "true") {
                        //-----------DEFAULT PRESET------------------
                        DOwithindexed(function () {
                            store.put(Ver, "Oldver")

                            store.put("https://i.ibb.co/WpFdcc2/128.png", "IconURL")
                            UpdateIcon()
                            SetidxTo("BGIMG", "https://i.ibb.co/FYPBxC5/1647030608836.jpg")
                            SetNormalPre()

                            update()
                            PRESET()
                        })
                        localStorage["nt-SHOWPRESET"] = "STOP"

                        setTimeout(() => {
                            window.alert(`*Warning*

                    If you use ** Dark Reader ** please do this step!
                    (I'm sorry,for inconvenience.)

                    1.Go to Dark Reader Menu
                    2.Go to tab "Site list"
                    3.Choose "Not invert listed"
                    4.Add "www.youtube.com" to the list
                    
                    Done!`)
                        }, 200);
                    } else {
                        DOwithindexed(function () {

                            get = store.get("Oldver")
                            get.onsuccess = function (e) {

                                if (e.target.result != Ver) {
                                    ShowUpdated()
                                    DOwithindexed(function () {
                                        SetNormalPre()
                                    })

                                    SetWhenUpdate()
                                }

                            }

                        })
                    }

                    var YTAPP

                    if (document.getElementById('BGFRAME') == null) {
                        BGFRAME = document.createElement('div')
                        BGFRAME.id = "BGFRAME"
                        YTAPP = document.getElementsByTagName('ytd-app')[0]
                        YTAPP.appendChild(BGFRAME)
                    }

                    Can = true
                    Set.addEventListener('click', clickSetting);









                    if (localStorage["nt-" + 'NewVDOanimaT'] == 'true') {
                        function ThisFunc() {
                            if (FindVideo()) {
                                thisStyle = document.createElement('style')
                                thisStyle.textContent = `
                            .ytp-doubletap-ui-legacy{
                                display: flex !important;
                                align-content: center;
                                justify-content: center;
                                opacity: 0;
                                transition: all 0.5s;
                                pointer-events: none;
                                border-radius: var(--theme-radius-big) !important;
                                height: 0% !important;
                                margin: auto;
                            }
                            
                            .ytp-doubletap-ui-legacy.ytp-time-seeking{
                                opacity: 1 !important;
                                height: 20% !important;
                            }
                            
                            .ytp-doubletap-overlay-a11y{
                                background: transparent !important;
                            }
                            
                            .ytp-doubletap-static-circle{
                                background: radial-gradient(circle, rgba(0,0,0,.8), transparent 50%) !important;
                                height: 100% !important;
                                left: 0px !important;
                                width: 100% !important;
                                top: 50% !important;
                                border-radius: var(--theme-radius-big) !important;
                            }
                            
                            .ytp-doubletap-seek-info-container{
                                text-align: center;
                                left: 0px !important;
                                top: 0px !important;
                                font-weight: 700;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                transition:all 1s;
                                filter: drop-shadow(0px 0px 10px white) drop-shadow(0px 0px 0px var(--theme)) drop-shadow(0px 0px 1px black);
                            }
                            
                            .ytp-doubletap-ui-legacy.ytp-time-seeking > .ytp-doubletap-seek-info-container{
                                transform: scale(2);
                            }
                            
                            .ytp-doubletap-ui-legacy[data-side=forward] .ytp-doubletap-base-arrow{
                                border-left-color: var(--theme) !important;
                            }
                            
                            .ytp-doubletap-ui-legacy[data-side=back] .ytp-doubletap-base-arrow{
                                border-right-color: var(--theme) !important;
                            }
                            
                            .ytp-bezel{
                                display: block !important;
                            }

                            .ytp-bezel-text-wrapper{
                                display: none !important;
                            }
                            
                            .ytp-bezel{
                                background: black !important;
                                filter: drop-shadow(0px 0px 10px var(--theme)) drop-shadow(0px 0px 10px white);
                            }
                            
                            .ytp-bezel path{
                                fill: var(--theme);
                            }`

                                document.head.append(thisStyle)

                                vdpar = FindVideo().parentNode

                                volpanel = document.createElement('p')

                                volpanel.style = `top: -50px;
                                background: #0000008c;
                                width: 100px;
                                height: 50px;
                                opacity:0;
                                position: absolute;
                                margin: auto;
                                z-index: 1;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 30px;
                                backdrop-filter: blur(10px);
                                font-weight: 600;
                                transition: all 0.5s ease;
                                box-shadow: 0px 0px 10px white;
                                left: calc(50% - 50px);`

                                volpanel.setAttribute('round', '')

                                vdpar.append(volpanel)

                                FindVideo().addEventListener('volumechange', function () {
                                    UpdateVol()
                                })
                            }
                            else {
                                setTimeout(() => {
                                    ThisFunc()
                                }, 1000);
                            }
                        }
                        ThisFunc()
                    }











                    // var audioCtx = new AudioContext()  
                    // var audioSrc = audioCtx.createMediaElementSource(FindVideo())
                    // var analyser = audioCtx.createAnalyser()


                    // if (localStorage["nt-EQT"] == 'true') {
                    //     console.log("RunEQ")

                    //     var AudioFilter = audioCtx.createBiquadFilter()
                    //     AudioFilter.type = "peaking"
                    //     AudioFilter.frequency.value = 50
                    //     AudioFilter.gain.value = 0

                    //     audioSrc.connect(AudioFilter)
                    //     AudioFilter.connect(analyser)
                    //     analyser.connect(audioCtx.destination)
                    // }








                    if (localStorage["nt-VisualT"] == 'true') {

                        setTimeout(() => {
                            // we have to connect the MediaElementSource with the analyser
                            // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
                            var audioCtx = new AudioContext()
                            var audioSrc = audioCtx.createMediaElementSource(FindVideo())
                            var analyser = audioCtx.createAnalyser()

                            audioSrc.connect(analyser)
                            analyser.connect(audioCtx.destination)

                            analyser.fftSize = 1024;

                            // we're ready to receive some data!
                            canvas3 = document.createElement('canvas')
                            canvas3.id = "Newtube_Visaulizer"

                            canvas3.style = `position: fixed;
                            z-index: 1;
                            bottom: 0px;
                            pointer-events: none;
                            filter: drop-shadow(0px 0px 3px white);`
                            canvas3.width = 1920
                            canvas3.height = 250

                            var cwidth = canvas3.width,
                                cheight = canvas3.height,
                                meterWidth = 5, //width of the meters in the spectrum
                                gap = 4, //gap between meters
                                capHeight = 2,
                                capStyle = '#fff',
                                meterNum = 1024, //count of the meters
                                capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame

                            YTAPP.insertBefore(canvas3, YTAPP.firstChild)

                            ctx = canvas3.getContext('2d'),
                                gradient = ctx.createLinearGradient(0, 0, 0, 300);
                            gradient.addColorStop(1, '#ffffff00');
                            gradient.addColorStop(0.5, '#ffffff');
                            gradient.addColorStop(0, '#ffffff');
                            // loop
                            function renderFrame() {
                                var array = new Uint8Array(analyser.frequencyBinCount);
                                analyser.getByteFrequencyData(array);
                                var step = 1; //sample limited data from the total array
                                ctx.clearRect(0, 0, cwidth, cheight);
                                for (var i = 0; i < meterNum; i++) {
                                    var value = array[i * step]
                                    value = ((value * value) / 500) - 20
                                    if (capYPositionArray.length < Math.round(meterNum)) {
                                        capYPositionArray.push(value);
                                    };
                                    ctx.fillStyle = capStyle;
                                    //draw the cap, with transition effect
                                    if (value < capYPositionArray[i]) {
                                        ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                                    } else {
                                        ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                                        capYPositionArray[i] = value;
                                    };
                                    ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
                                    ctx.fillRect(i * 12 /*meterWidth+gap*/, cheight - value + capHeight, meterWidth, cheight); //the meter
                                }
                                requestAnimationFrame(renderFrame);
                            }
                            renderFrame();
                        }, 1000);
                    }











                    if (localStorage["nt-EnableButtonT"] == 'true') {
                        function RemoveCinema() {
                            if (document.getElementById("cinematics")) {
                                // console.log("Removed")
                                document.getElementById("cinematics").remove()
                            } else {
                                setTimeout(() => {
                                    RemoveCinema()
                                }, 1000)
                            }
                        }
                        RemoveCinema()
                    }
                }
            }
            if (SeeRemove == 1) {
                SeeRemove = 0

                ENDobserver = new MutationObserver(function (mutations_list) {
                    mutations_list.forEach(function (mutation) {
                        mutation.removedNodes.forEach(function (removed_node) {
                            if (removed_node.id == 'child') {
                                // console.log('#child has been removed');
                                SettoEnd()
                                observer.disconnect();
                            }
                        });
                    });
                });

                ENDobserver.observe(document.getElementById("end"), { subtree: false, childList: true });
            }
        }
    }, 1000);
}

SetNull()





























//---------------------------------------------------------------------------

var CanDropFrame = JSON.parse(localStorage["nt-DropFrameT"]),
    CanCheckStatic = JSON.parse(localStorage["nt-CheckStaticT"])

//--EX-----

var UPSEQ = 33,
    NotOverFlow,

    canvas,
    context,
    cw,
    ch,

    canvas2,
    context2,
    cw2,
    ch2,

    // ReBlack,
    // ReBlackctx,
    // ReBlackcw,
    // ReBlackch,

    BlackOverlay,

    Cloning,
    YTAPP,
    BGFRAME

var CanvasQua,
    CanvasNewQua,
    VDOBOUND

function ChangeCanvasQua() {
    cw = Math.floor(Math.floor(VDOBOUND.width) * CanvasNewQua)
    ch = Math.floor(Math.floor(VDOBOUND.height) * CanvasNewQua)

    CanvasQua = CanvasNewQua
    canvas.width = cw
    canvas.height = ch
}

function SetCanvas() {
    if (canvas && !ADDFlyout) {
        VDOBOUND = FindVideo().getBoundingClientRect()

        VcenY = VDOBOUND.top + VDOBOUND.height / 2
        canvasbound = canvas.getBoundingClientRect()

        var Distance = (VcenY) - (canvasbound.top + canvasbound.height / 2)

        if (Distance < 0) {
            Distance = Distance * -1
        }

        CanvasNewQua = localStorage["nt-CanvasQua"] / 100

        if (CanvasQua != CanvasNewQua) {
            ChangeCanvasQua()
        }

        if (Distance > 1) {
            // console.log("SetCanvasPo")

            canvas.style.setProperty('margin-top', VDOBOUND.top + window.pageYOffset + 'px')
            canvas.style.setProperty('margin-left', VDOBOUND.left + window.pageXOffset + 'px')
        }

        VdoWith = VDOBOUND.width + "px"

        if (canvas.style.width != VdoWith) {
            // console.log("SetCanvasSize")

            let KeeplastFrame = true
            if (canvas.style.width == "0px") {
                KeeplastFrame = false
            }

            VdoHeight = VDOBOUND.height + "px"

            var tempCanvas
            if (KeeplastFrame == true) {
                tempCanvas = context.getImageData(0, 0, cw, ch);
            }

            canvas.style.width = VdoWith
            canvas.style.height = VdoHeight

            ChangeCanvasQua()

            if (KeeplastFrame == true) {
                context.putImageData(tempCanvas, 0, 0)
                tempCanvas = null
            }

            // if (BlackMode == true) {
            //     ReBlack.style.width = VdoWith
            //     ReBlack.style.height = VdoHeight
            // }
        }

        if (EnaCanvas2 == true) {
            if (canvas2.height != VDOBOUND.height) {
                canvas2.width = 5
                canvas2.height = VDOBOUND.height
            }
        }

        var CalOverlay
        if (VDOBOUND.height <= VDOBOUND.width) {
            CalOverlay = VDOBOUND.height * 0.2
        } else {
            CalOverlay = VDOBOUND.width * 0.2
        }

        BlackOverlay.style = canvas.getAttribute("style") + `
        box-shadow: inset black 0px 0px ${CalOverlay}px ${CalOverlay}px;
        position:absolute;
        padding:1px;`
        BlackOverlay.style.zIndex = 1

        canvas.style.zIndex = 0
    }
    // else {
    //     setTimeout(() => {
    //         SetCanvas()
    //     }, 100);
    // }
}

function StartDraw() {
    // console.log("PLAY")
    SetCanvas()
    thisframe = 0
    drawpic()
    // WaitForFrame()
}

function SetBGTran(Status) {
    if (YTAPP == null) {
        YTAPP = document.getElementsByTagName('ytd-app')[0]
    }
    if (Status == true) {
        YTAPP.style = `background: transparent !important;
        width: 100%;`
    } else {
        YTAPP.style = `background:var(--bg-color) !important;
        width: 100%;`
    }
}

LastMode = null

function CheckVDO() {
    if (FindVideo().parentNode) {

        VDOPARCLASS = FindVideo().parentNode.parentNode.className

        pg = document.getElementById("page-manager")

        if (VDOPARCLASS.search("ytp-fullscreen") == -1) {
            pg.style = ``
        } else {
            pg.style = `margin-top:0px;`
            v.style.marginTop = "unset"
            v.parentNode.style.height = "100%"
            v.parentNode.style.marginTop = "unset"

            // console.log("Set LastHeight")
            LastHeight = 0
        }

        if (

            VDOPARCLASS.search('ytp-small-mode') == -1
            && VDOPARCLASS.search("ytp-fullscreen") == -1
            && (VDOPARCLASS.search("unstarted-mode") == -1 || VDOPARCLASS.search("playing-mode") > 0)

        ) {
            if (Cloning == false) {
                CreateCanvas()
            }
            if (StaticVDO) {
                console.log("Setcanvas")
                SetCanvas()
                drawOnePic()
            }

        } else {
            if (Cloning == true) {
                RemoveCanvas()
                // console.log("Set LastHeight")
                LastHeight = 0
            }
        }
    } else {
        setTimeout(() => {
            CheckVDO()
        }, 500);
    }
}

function CheckVDOSTATUS() {
    if (!inIframe()) {
        setTimeout(() => {
            // console.log("CheckStatus")
            YTAPP = document.getElementsByTagName('ytd-app')[0]
            BGFRAME = document.getElementById("BGFRAME")
            if (FindVideo() == null || YTAPP == null || BGFRAME == null) {
                setTimeout(() => {
                    CheckVDOSTATUS()
                }, 1000);
            } else {
                VDOChangeEvent.observe(FindVideo().parentNode.parentNode, { attributes: true })
                CheckVDO()
            }
        }, 1);
    }
}


BlackMode = false
BlackBar = JSON.parse(localStorage["nt-DelBarT"])
EnaCanvas2 = JSON.parse(localStorage["nt-DelBarT"])

let drawing = false,
    CheckBlackQua = 300
CheckBlackThreshold = 20,
    LastFind = null,
    ThisR = null,
    ThisG = null,
    ThisB = null

BlackDebug = JSON.parse(localStorage["nt-DelBarDebugT"])

addMultiply = 1.2

function CheckAddMultiply(R, G, B) {
    // if (R < 100) {
    //     R *= addMultiply
    // }

    // if (G < 100) {
    //     G *= addMultiply
    // }

    // if (B < 100) {
    //     B *= addMultiply
    // }

    return [R, G, B]
}

function CheckThisPX(R, G, B) {
    GetRGB = CheckAddMultiply(R, G, B)
    R = GetRGB[0]
    G = GetRGB[1]
    B = GetRGB[2]

    return Math.abs(R - ThisR) + Math.abs(G - ThisG) + Math.abs(B - ThisB) > CheckBlackThreshold
}

function Check2ThisPX(R, G, B) {
    GetRGB = CheckAddMultiply(R, G, B)
    R = GetRGB[0]
    G = GetRGB[1]
    B = GetRGB[2]

    return Math.abs(R - ThisR) + Math.abs(G - ThisG) + Math.abs(B - ThisB) > 10
}

function contrastImage(imgData, contrast) {  //input range [-100..100]
    var d = imgData.data;
    contrast = (contrast / 100) + 1;  //convert to decimal & shift range: [0..2]
    var intercept = 128 * (1 - contrast);
    for (var i = 0; i < d.length; i += 4) {   //r,g,b,a
        d[i] = d[i] * contrast
        d[i + 1] = d[i + 1] * contrast
        d[i + 2] = d[i + 2] * contrast
    }
    return imgData;
}

var LastFrame
var LastHeight = 0
var LastFrame = null

var NoWaitFrame = true

var SkipFrame = 5
var ThisFrame = 0

var CompleteCal = true

function WatingFrame(ThisFrame, TargetFrame, Func, arg) {
    if (ThisFrame == TargetFrame) {
        Func(arg)
    } else {
        ThisFrame++
        requestAnimationFrame(function () {
            WatingFrame(ThisFrame, TargetFrame, Func, arg)
        })
    }
}

function WaitFrame(TargetFrame, Func, arg) {
    WatingFrame(0, TargetFrame, Func, arg)
}

var GetThisTime

function CalVdoHeight() {
    var mf = 0;
    var m = 0;
    var SureTHisHeight;

    for (var i = 0; i < ThisHeightArray.length; i++) {
        lowest = null
        for (var j = i; j < ThisHeightArray.length; j++) {
            if (ThisHeightArray[i] == ThisHeightArray[j] || Math.abs(ThisHeightArray[i] - ThisHeightArray[j]) < 5) {
                if (ThisHeightArray[i] == "inf") {
                    lowest = "inf"
                } else {
                    if (ThisHeightArray[j] > lowest || lowest == null) {
                        lowest = ThisHeightArray[j]
                    }
                }
                m++;
            }
        }

        if (lowest == "inf") {
            if (m > mf) {
                mf = m;
                SureTHisHeight = lowest;
            }
        } else {
            if (m > mf || (m == mf && lowest > SureTHisHeight)) {
                mf = m;
                SureTHisHeight = lowest;
            }
        }
        m = 0;
    }

    if (BlackDebug) {
        YellowLinePX = context2.createImageData(VDOBOUND.width, 1)

        for (i = 0; i < VDOBOUND.width; i++) {
            YellowLinePX.data[i * 4] = 255
            YellowLinePX.data[i * 4 + 1] = 255
            YellowLinePX.data[i * 4 + 3] = 255
        }

        context2.putImageData(YellowLinePX, 0, 10)
    }

    // ThisFrame = context2.getImageData(VDOBOUND.width / 2, 0, 1, VDOBOUND.height)
    // ThisFrameData = ThisFrame.data

    // if (LastFrame) {
    //     for (i = 0; i < VDOBOUND.height; i += 4) {
    //         if (ThisFrameData[i] == LastFrame[i] && ThisFrameData[i + 1] == LastFrame[i + 1] && ThisFrameData[i+2] == LastFrame[i+2]) {
    //             context2.putImageData(redPX, VDOBOUND.width / 2, i/4)
    //         } else {
    //             i = VDOBOUND.height
    //         }
    //     }
    // }

    // LastFrame = ThisFrameData

    if (mf < 6 || SureTHisHeight == "inf") {
        SureTHisHeight = LastHeight
    }

    if (SureTHisHeight > 10 && (Math.abs(SureTHisHeight - LastHeight) > 10 || SureTHisHeight > LastHeight)) {

        if (SureTHisHeight > LastHeight) {
            // v.style.transition = "none"
            v.parentNode.style.transition = "none"
        } else {
            // v.style.transition = "margin-top 0.5s"
            v.parentNode.style.transition = "all 0.5s ease-out"
        }

        LastHeight = SureTHisHeight

        // v.parentNode.style.overflow = "hidden"
        // v.parentNode.style.position = "absolute"
        // v.parentNode.style.width = "100%"

        // v.style.marginTop = -LastHeight - 1 + 'px'
        v.parentNode.style.height = VDOBOUND.height - LastHeight * 2 - 2 + 'px'
    } else {
        if (SureTHisHeight <= 10) {
            // v.style.transition = "margin-top 0.5s"
            v.parentNode.style.transition = "all 0.5s ease-out"
            LastHeight = 0
            // v.style.marginTop = "unset"
            v.parentNode.style.height = VDOBOUND.height + "px"
            // v.parentNode.style.marginTop = "unset"
            // v.parentNode.style.borderRadius = "unset"
        }
    }

    if (BlackDebug) {
        GreenLinePX = context2.createImageData(VDOBOUND.width, 1)

        for (i = 0; i < VDOBOUND.width; i++) {
            GreenLinePX.data[i * 4 + 1] = 255
            GreenLinePX.data[i * 4 + 3] = 255
        }

        context2.putImageData(GreenLinePX, 0, LastHeight)
        context2.putImageData(GreenLinePX, 0, VDOBOUND.height - LastHeight)
    }

    CompleteCal = true

    // console.log("Complete",Date.now() - GetThisTime)
}

function CheckPxLine(x) {
    var ThisFind = x
    var ThisR = FistGetRGB[0]
    var ThisG = FistGetRGB[1]
    var ThisB = FistGetRGB[2]

    Find = null
    ThisActualPX = context2.getImageData(ThisFind, 0, 1, halfVDO)
    ThisPX = ThisActualPX.data

    for (i = 5; i < halfVDO; i++) {
        if (CheckThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
            i += 10
            if (CheckThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
                Find = i - 10
                i = halfVDO
            }
        } else {
            if (!Check2ThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
                ThisR = ThisPX[i * 4]
                ThisG = ThisPX[i * 4 + 1]
                ThisB = ThisPX[i * 4 + 2]
            }
        }
    }

    if (Find) {
        ThisHeightArray.push(Find)

        if (BlackDebug) {
            for (i = 5; i < Find; i++) {
                context2.putImageData(redPX, ThisFind, i)
            }
        }
    } else {
        ThisHeightArray.push("inf")
    }

    //-----------------------------------------------------------------
    if (CanDropFrame) {
        setTimeout(() => {
            CheckBottom(x)
        }, 0);
    } else {
        CheckBottom(x)
    }

}

function CheckBottom(x) {
    var ThisFind = x

    var ThisR = FistGetRGB[0]
    var ThisG = FistGetRGB[1]
    var ThisB = FistGetRGB[2]

    Find = null
    ThisActualPX = context2.getImageData(ThisFind, halfVDO, 1, halfVDO)
    ThisPX = ThisActualPX.data

    for (i = halfVDO - 5; i > 0; i--) {
        if (CheckThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
            i -= 10
            if (CheckThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
                Find = i + 10
                i = 0
            }
        } else {
            if (!Check2ThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
                ThisR = ThisPX[i * 4]
                ThisG = ThisPX[i * 4 + 1]
                ThisB = ThisPX[i * 4 + 2]
            }
        }
    }

    if (Find) {
        Find += halfVDO
        ThisHeightArray.push(VDOBOUND.height - Find)

        if (BlackDebug) {
            for (i = VDOBOUND.height - 5; i > Find; i--) {
                context2.putImageData(redPX, ThisFind, i)
            }
        }
    } else {
        ThisHeightArray.push("inf")
    }


    // ThisFind += CheckBlackQua

    if (x == 4) {
        CalVdoHeight()
    } else {
        if (CanDropFrame) {
            setTimeout(() => {
                CheckPxLine(x + 1)
            }, 0);
        } else {
            CheckPxLine(x + 1)
        }
    }
}

function CheckNumLine(from, to) {
    for (x = from; x < to; x++) {
        CheckPxLine(x)
    }
}

function CheckBlackBar() {
    CompleteCal = false

    redPX = context2.createImageData(1, 1)
    redPX.data[0] = 255
    redPX.data[3] = 255

    // context2.clearRect(0, 0, VDOBOUND.width, VDOBOUND.height);

    context2.drawImage(v, 0, 0, 5, VDOBOUND.height);

    ThisActualPX = context2.getImageData(1, 3, 1, 1)
    ThisPX = ThisActualPX.data

    FistGetRGB = CheckAddMultiply(ThisPX[0], ThisPX[1], ThisPX[2])

    ThisR = FistGetRGB[0]
    ThisG = FistGetRGB[1]
    ThisB = FistGetRGB[2]

    ThisHeightArray = []

    halfVDO = Math.floor(VDOBOUND.height / 2)

    if (CanDropFrame) {
        setTimeout(() => {
            CheckPxLine(0)
        }, 0);
    } else {
        CheckPxLine(0)
    }


    // WaitFrame(1,CheckPxLine,0)
}

function drawOnePic() {
    if (NoWaitFrame) {
        NoWaitFrame = false
        setTimeout(() => {
            // console.log("Check")
            // console.log("Draw")
            SetCanvas()
            Scale = 1

            // Bcontext.globalCompositeOperation = "copy"

            // var Xgradient = Bcontext.createLinearGradient(0, 0, cw, 0);
            // Xgradient.addColorStop(0, "black");
            // Xgradient.addColorStop(0.2, "transparent");
            // Xgradient.addColorStop(0.8, "transparent");
            // Xgradient.addColorStop(1, "black");

            // var Ygradient = Bcontext.createLinearGradient(0, 0, 0, ch);
            // Ygradient.addColorStop(0, "black");
            // Ygradient.addColorStop(0.2, "transparent");
            // Ygradient.addColorStop(0.8, "transparent");
            // Ygradient.addColorStop(1, "black");

            // Bcontext.fillStyle = Xgradient;
            // Bcontext.fillRect(0, 0, cw, ch);
            // Bcontext.globalCompositeOperation = "source-over"
            // Bcontext.fillStyle = Ygradient;
            // Bcontext.fillRect(0, 0, cw, ch);

            // context.globalAlpha = 1
            // if (BGSmooth != 1) {
            //     context.globalCompositeOperation = "copy"
            //     if (LastFrame) {
            //         context.putImageData(LastFrame,0,0);
            //     }

            if (StaticVDO) {
                context.globalAlpha = 1
            } else {
                context.globalAlpha = BGSmooth
            }

            // }

            // context.globalCompositeOperation = "source-over"
            context.filter = `blur(${localStorage["nt-NVDOB"]}px)`

            // createImageBitmap(v, { resizeWidth: cw, resizeHeight: ch })
            //     .then((img) => {
            //         // Draw each sprite onto the canvas
            //         context.drawImage(img, 0, 0)
            //     })

            context.drawImage(v, (cw * (1 - Scale) / 2), (ch * (1 - Scale) / 2), cw * Scale, ch * Scale);


            // if (BGSmooth != 1)
            //     LastFrame = context.getImageData(0,0,cw,ch);
            // }
            // context.filter = `none`

            // context.globalCompositeOperation = "destination-out"
            // context.globalAlpha = 1

            // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);
            // Scale = 0.8
            // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);
            // Scale = 0.7
            // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);
            // Scale = 0.6
            // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);
            // Scale = 0.55
            // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);

            // if (BGSmooth != 1) {
            //     context.globalAlpha = 1
            // }
            // var Xgradient = context.createLinearGradient(0, 0, cw, 0);
            // Xgradient.addColorStop(0, "black");
            // Xgradient.addColorStop(0.2, "transparent");
            // Xgradient.addColorStop(0.8, "transparent");
            // Xgradient.addColorStop(1, "black");

            // var Ygradient = context.createLinearGradient(0, 0, 0, ch);
            // Ygradient.addColorStop(0, "black");
            // Ygradient.addColorStop(0.2, "transparent");
            // Ygradient.addColorStop(0.8, "transparent");
            // Ygradient.addColorStop(1, "black");

            // context.fillStyle = Xgradient;
            // context.fillRect(0, 0, cw, ch);
            // context.fillStyle = Ygradient;
            // context.fillRect(0, 0, cw, ch);


            if (BlackMode == true) {
                ReBlackctx.drawImage(v, 0, 0, VDOBOUND.width, VDOBOUND.height);
                frame = ReBlackctx.getImageData(0, 0, VDOBOUND.width, VDOBOUND.height)
                l = frame.data.length / 4
                for (let i = 0; i < l; i++) {
                    frame.data[i * 4 + 3] = (frame.data[i * 4 + 0] * 10 +
                        frame.data[i * 4 + 1] * 10 +
                        frame.data[i * 4 + 2] * 10) / 10
                }
                ReBlackctx.putImageData(frame, 0, 0)
            }

            if (BlackBar == true) {
                // console.log("VDO Update Frame")
                if (CompleteCal) {
                    // GetThisTime = Date.now()
                    CheckBlackBar()
                }
                // else {
                //     console.log("DropFrame")
                // }

                // if (ThisFrame > SkipFrame) {
                //     ThisFrame = 0
                // }
                // CheckPxLine(ThisFrame)
                // ThisFrame++
            }

            NoWaitFrame = true
        }, 0)

    } else {
        console.log("Drop frame")
    }
}

let fps = 30,
    calPerFrameTime = 1000 / fps,
    Support = ('requestVideoFrameCallback' in HTMLVideoElement.prototype),
    StaticVDO = false

function drawpic() {
    if (drawing == false) {
        drawing = true

        function DrawApic() {
            FindVideo()
            if (v.paused || v.ended || Cloning == false || StaticVDO == true || PipMode == true || document.visibilityState == 'hidden') {
                drawing = false
                // console.log("CancelDraw")
            } else {
                drawOnePic()
                if (!StaticVDO) {
                    if (Support == true) {
                        v.requestVideoFrameCallback(DrawApic)
                    } else {
                        setTimeout(() => {
                            DrawApic()
                        }, calPerFrameTime);
                    }
                }
            }
        }
        DrawApic()
    }
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function callback(mutationsList, observer) {
    if (mutationsList[0].type == "attributes") {
        // console.log("CHANGE")
        CheckVDOSTATUS()

        if (!FindVideo().paused) {
            SetCanvas()
        }
    }
}

var VDOChangeEvent = new MutationObserver(callback)

let CanvasSpawned = false

var PipMode = false

function EnterPip() {
    PipMode = true
}

function LeavePip() {
    PipMode = false
    requestAnimationFrame(StartDraw)
}


function CreateCanvas() {
    CanvasSpawned = true
    drawing = 0
    // console.log("CreateCanvas")

    Cloning = true

    if (!NotOverFlow) {
        canvas = document.createElement('canvas');
        NotOverFlow = document.createElement('div')
        YTAPP.append(NotOverFlow)
        NotOverFlow.style = `width: 100%;
                height: 100%;
                top: 0px;
                position: absolute;
                object-position: center;
                overflow: hidden;
                z-index: -1;
                image-rendering: pixelated;
                }`
        canvas.id = "NewtubeBlurBG"
        canvas.style.position = "static"
        NotOverFlow.style.opacity = 0

        BlackOverlay = document.createElement('div')
        BlackOverlay.id = "nt-black-overlay"
        NotOverFlow.append(BlackOverlay)
        NotOverFlow.append(canvas)
    }
    setTimeout(() => {
        NotOverFlow.style.opacity = 1
    }, 0);

    context = canvas.getContext('2d', { alpha: false })
    context.imageSmoothingEnabled = false

    if (EnaCanvas2 == true) {
        canvas2 = document.createElement('canvas')
        v.parentNode.parentNode.append(canvas2)
        canvas2.style = `position: absolute;
        top: 0px;
        image-rendering: pixelated;
        z-index:100;
        width:50px;
        height:calc(100% - 70px);
        left:0px;`

        canvas2.id = "NewtubeVDOCanvas"
        context2 = canvas2.getContext('2d', { alpha: false })
        context2.imageSmoothingEnabled = false
    }

    v.addEventListener('play', StartDraw)
    v.addEventListener("enterpictureinpicture", EnterPip)
    v.addEventListener("leavepictureinpicture", LeavePip)

    v.pause()

    try {
        v.play()
    } catch (e) {

    }

    SetBGTran(true)
    BGFRAME.style.setProperty("opacity", "0")

    if (EnaCanvas2 == true || BlackDebug == true) {
        if (BlackDebug == true) {
            FindVideo().style.setProperty("opacity", "1")
        } else {
            canvas2.style.setProperty("display", "none")
        }
    }
}

function RemoveCanvas(Force) {
    // console.log("Remove")
    Cloning = false

    if (CanvasSpawned == true) {
        if (localStorage["nt-VDOBGT"] == 'true' && localStorage["nt-EnableButtonT"] == 'true' && !Force) {
            NotOverFlow.style.opacity = 0
        } else {
            NotOverFlow.remove()
            NotOverFlow = null
        }
        if (canvas2) {
            canvas2.remove()
        }
        SetBGTran(false)
        BGFRAME.style.setProperty("opacity", "1")

        FindVideo()
        v.style.setProperty("opacity", "1")
        v.removeEventListener('play', StartDraw, false)
        v.removeEventListener("enterpictureinpicture", EnterPip)
        v.removeEventListener("leavepictureinpicture", LeavePip)

        CanvasSpawned = false
    }
    drawing = 0
}

function CheckLoop() {
    if (FindVideo() && BGFRAME) {
        CheckVDO()
    }
    setTimeout(() => {
        CheckLoop()
    }, 100);
}

function CheckStaticVDO() {
    if (CanCheckStatic) {
        console.log("Check if static")
        videoID = document.getElementsByTagName("ytd-watch-flexy")[0].getAttribute("video-id")
        console.log(videoID)

        var Frame1Loaded,
            Frame2Loaded,
            Frame3Loaded

        var frame1 = new Image()
        frame1.crossOrigin = "anonymous"
        frame1.onload = function () {
            Frame1Loaded = getBase64Image(frame1).length
        }
        frame1.src = `http://i.ytimg.com/vi/${videoID}/1.jpg`

        var frame2 = new Image()
        frame2.crossOrigin = "anonymous"
        frame2.onload = function () {
            Frame2Loaded = getBase64Image(frame2).length
        }
        frame2.src = `http://i.ytimg.com/vi/${videoID}/2.jpg`

        var frame3 = new Image()
        frame3.crossOrigin = "anonymous"
        frame3.onload = function () {
            Frame3Loaded = getBase64Image(frame3).length
        }
        frame3.src = `http://i.ytimg.com/vi/${videoID}/3.jpg`


        setTimeout(() => {
            if (isNaN(Frame1Loaded) || isNaN(Frame2Loaded) || isNaN(Frame3Loaded)) {
                CheckStaticVDO()
            } else {
                Max = Math.max(Frame1Loaded, Frame2Loaded, Frame3Loaded)
                Min = Math.min(Frame1Loaded, Frame2Loaded, Frame3Loaded)
                CalDiff = Max / Min
                console.log(Max, Min, CalDiff)
                StaticVDO = Math.abs(CalDiff - 1) < 0.03
                console.log(StaticVDO)
                drawpic()
            }
        }, 500);
    }
}


function EnableBGBlur() {
    // console.log("EnaVDOBG")
    Cloning = false

    CheckVDOSTATUS()

    window.addEventListener('yt-page-data-updated', CheckVDOSTATUS)
    window.addEventListener('yt-page-data-updated', CheckStaticVDO)
}

function DisableBGBlur(Force) {
    // console.log("DisaVDOBG")
    RemoveCanvas(Force)

    window.removeEventListener('yt-page-data-updated', CheckVDOSTATUS)
    window.removeEventListener('yt-page-data-updated', CheckStaticVDO)
    VDOChangeEvent.disconnect()
}


function download(data, filename, type) {
    var file = new Blob([data], { type: type })
    var a = document.createElement("a"),
        url = URL.createObjectURL(file)
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function () {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }, 0)
}

chrome.runtime.onMessage.addListener(function (recived) {
    // console.log("revice " + recived)
    if (recived == 'Enable') {
        if (localStorage["nt-EnableButtonT"] == "true") {
            localStorage["nt-EnableButtonT"] = "false"
        } else {
            localStorage["nt-EnableButtonT"] = "true"
        }
        update()
    }

    if (recived == 'Setting') {
        clickSetting()
    }
})

var rqpip = false

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState == 'hidden' && rqpip == true && localStorage["nt-AutoPIPT"] == "true") {
        rqpip = false
        if (document.pictureInPictureElement == null) {
            FindVideo().requestPictureInPicture()
        }
    }
})

window.addEventListener('focus', function () {
    if (localStorage["nt-AutoEXPIPT"] == "true") {
        // console.log("Focus")
        // console.log(document.pictureInPictureElement)
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        }
    }
})

window.addEventListener('blur', function () {
    // console.log("Bruh")
    rqpip = true
})

function listFonts() {
    let { fonts } = document
    const it = fonts.entries()

    let arr = []
    let done = false

    while (!done) {
        const font = it.next()
        if (!font.done) {
            arr.push(font.value[0])
        } else {
            done = font.done
        }
    }
    arr = arr.map(obj => obj.family)
    let ArrayFont = []
    arr.forEach(font => {
        if (!ArrayFont.includes(font)) {
            ArrayFont.push(font)
        }
    })
    return ArrayFont
}














// document.addEventListener('DOMContentLoaded',function() {
//     // will set to true when video can be copied to texture
//     var copyVideo = false;
//     const video = document.getElementsByTagName("video")[0];

//     // immediately after finding the video, create canvas and set its dimensions
//     let canvas = document.createElement('canvas');
//     canvas.setAttribute('id', 'glcanvas');
//     canvas.setAttribute('width', '300');
//     canvas.setAttribute('height', '200');
//     canvas.setAttribute('style', 'position: absolute;');
//     video.parentElement.appendChild(canvas);
//     video.requestVideoFrameCallback(function() {
//         copyVideo=true;
//     });

//     // Initialize the GL context
//     const gl = canvas.getContext("webgl");

//     // Only continue if WebGL is available and working
//     if (gl === null) {
//         alert("Unable to initialize WebGL. Your browser or machine may not support it.");
//         return;
//     }

//     // Vertex shader program
//     const vsSource = `
// attribute vec2 a_position;
// varying vec2 v_texCoord;

// void main() {
//    gl_Position = vec4(a_position, 0.0, 1.0);
//    v_texCoord = a_position*.5+.5;
//    v_texCoord.y = 1.-v_texCoord.y;
// }
// `;

//     // Fragment shader program
//     const fsSource = `
// precision mediump float;

// uniform sampler2D u_image;
// varying vec2 v_texCoord;

// void main() {
//    gl_FragColor = texture2D(u_image, v_texCoord);
// }
//   `;

//     const positionData = new Float32Array([
//         -1.0,-1.0,
//          1.0,-1.0,
//         -1.0, 1.0,
//          1.0,-1.0,
//          1.0, 1.0,
//         -1.0, 1.0
//     ]);


//     // Initialize a shader program, so WebGL knows how to draw our data
//     function initShaderProgram(gl, vsSource, fsSource) {
//         const shaderProgram = gl.createProgram();
//         gl.attachShader(shaderProgram, loadShader(gl, gl.VERTEX_SHADER, vsSource));
//         gl.attachShader(shaderProgram, loadShader(gl, gl.FRAGMENT_SHADER, fsSource));
//         gl.linkProgram(shaderProgram);

//         // If creating the shader program failed, alert
//         if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
//             alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
//             return null;
//         }

//         return shaderProgram;
//     }

//     // creates a shader of the given type, uploads the source and compiles it.
//     function loadShader(gl, type, source) {
//         const shader = gl.createShader(type);
//         gl.shaderSource(shader, source);
//         gl.compileShader(shader);

//         // See if it compiled successfully
//         if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//             alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
//             gl.deleteShader(shader);
//             return null;
//         }

//         return shader;
//     }

//     // Initialize shader program
//     const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

//     // look up where the vertex data needs to go.
//     var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
//     var textureLoc = gl.getUniformLocation(shaderProgram, "u_image");

//     // Create a vertex buffer
//     var positionBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

//     // Create texture
//     var texture = gl.createTexture();
//     gl.bindTexture(gl.TEXTURE_2D, texture);
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255]));
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//     // Initialize rendering
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//     gl.clearColor(1.0,0.0,0.0,1.0);

//     function drawScene() {
//         gl.clear(gl.COLOR_BUFFER_BIT);
//         gl.useProgram(shaderProgram);

//         // Turn on the vertex attribute
//         gl.enableVertexAttribArray(positionLocation);
//         gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//         gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

//         // Draw the rectangle
//         gl.drawArrays(gl.TRIANGLES, 0, 6);
//     }

//     // Draw the scene repeatedly
//     function render() {
//         if (copyVideo)
//             gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);

//         drawScene();
//         requestAnimationFrame(render);
//     }
//     requestAnimationFrame(render);
// })



// AddListFont(`<style>
// @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@200&family=Noto+Sans+JP:wght@200&family=Noto+Sans+Thai:wght@200&display=swap');
// </style>`)

// console.log(AllFont, AddedFont)