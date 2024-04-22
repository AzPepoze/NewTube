var StyleElementHolder
var SettingCSS = {}

var Collect_Style
var NTstyle = document.createElement("style");
NTstyle.id = "NEWTUBESTYLE";

async function AddNewtubeStyle() {
    var Head = await GetDocumentHead()
    Head.append(NTstyle)
}

AddNewtubeStyle()

async function UpdateSettingCSS(id) {
    if (DebugMode) {
        console.log("Update", id)
    }

    SettingCSS[id]()
}

async function CheckStyleElementHolder() {

    if (StyleElementHolder) {
        return StyleElementHolder
    }

    var Head = document.head

    if (Head) {
        StyleElementHolder = document.createElement("fieldset")
        StyleElementHolder.id = "NewtubeStyleHolder"
        Head.append(StyleElementHolder)

        return StyleElementHolder
    } else {
        await sleep(100)
        return await CheckStyleElementHolder()
    }
}

async function CreateStyleElement(id) {
    await CheckStyleElementHolder()
    var ThisStyle = document.createElement("style")
    StyleElementHolder.append(ThisStyle)

    async function UpdateStyle() {
        if (await Load("EnableButton") && !await Load("EnaCUSCSS")) {
            ThisStyle.innerHTML = await GetSettingCSS(id)
        } else {
            ThisStyle.innerHTML = ``
        }
    }

    UpdateStyle()

    AddOnChangeFunction("EnableButton", UpdateStyle)
    AddOnChangeFunction("EnaCUSCSS", UpdateStyle)

    SettingCSS[id] = UpdateStyle
}

var AlreadyCreatedSeparateSettingCSS = false

async function CreateSeparateSettingCSS() {
    if (DebugMode) {
        console.log("CreateSeparateSettingCSS")
    }

    for (var [ThisType, ThisFeature] of Object.entries(SettingFuction)) {
        for (var [id, ThisSetting] of Object.entries(ThisFeature)) {
            if (ThisSetting.AutoAddCSS) {
                CreateStyleElement(id)
            }
        }
    }

    if (DebugMode) {
        console.log(SettingCSS)
    }

    AlreadyCreatedSeparateSettingCSS = true
}

async function WaitCreatedSeparateSettingCSS() {
    if (AlreadyCreatedSeparateSettingCSS) {
        return true
    } else {
        await sleep(100)
        return await WaitCreatedSeparateSettingCSS()
    }
}

async function update() {
    if (DebugMode) {
        console.log("UPDATE");
    }

    Collect_Style = ``

    if (await Load("EnaADDCSS") == true) {
        ADDCSS = await Load("ADDCUSTOM")
    }

    if (await Load("EnableButton") == false) {
        NTstyle.textContent = ``;
    }
    else if (await Load("EnaCUSCSS") == true) {
        NTstyle.textContent = await Load("CUSTOM")
    } else {

        let ThemeColor
        let ThemeColor2
        let ThemeColor3
        let TextColor
        let TextColor2
        let BG
        let PlayListColor
        let LinkColor
        let ControlPanel
        let TimeText
        let TimeLineBG
        let TimeLoaded

        if (await Load("Theme_by_video") && await GetVideoID()) {
            let GetColor = await GetSampleColor(await GetVideoThumbnail())

            if (GetColor[0] == GetColor[1] && GetColor[1] == GetColor[2]) {
                GetColor = await GetSampleColor(await GetVideoFirstFrame())
            }

            console.log("Before", GetColor)

            let Max = 0

            for (let i = 0; i <= 2; i++) {
                let ThisValue = GetColor[i]
                if (ThisValue > Max) {
                    Max = ThisValue
                }
            }

            let GetAdd = 255 - Max

            for (let i = 0; i <= 2; i++) {
                GetColor[i] += GetAdd
            }

            let hsv = RGBtoHSV(GetColor)
            hsv[1] *= 1.5
            if (true && hsv[1] > 0.6) {
                hsv[1] = 0.6
            }
            console.log(hsv[1])
            GetColor = HSVtoRGB(hsv)

            console.log("After", GetColor)

            ThemeColor = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${1})`
            ThemeColor2 = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${0.3})`
            ThemeColor3 = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${0.3})`
            PlayListColor = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${0.3})`
            LinkColor = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${1})`

            hsv[2] *= 0.4
            GetColor = HSVtoRGB(hsv)
            TimeBG = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${0.8})`
            hsv[2] *= 1 / 0.4

            hsv[1] *= 0.8
            GetColor = HSVtoRGB(hsv)
            TextColor2 = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${1})`
            hsv[1] *= 1 / 0.8

            hsv[1] *= 0.5
            GetColor = HSVtoRGB(hsv)
            TimeText = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${1})`
            hsv[1] *= 1 / 0.5

            hsv[1] *= 0.4
            GetColor = HSVtoRGB(hsv)
            TextColor = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${1})`
            hsv[1] *= 1 / 0.4

            hsv[2] *= 0.15
            GetColor = HSVtoRGB(hsv)
            if (await Load("Solid_BG_Theme_by_video")) {
                BG = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${1})`
            } else {
                BG = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${await Load("BGO") / 100})`
            }
            hsv[2] *= 1 / 0.15

            hsv[2] *= 0.4
            GetColor = HSVtoRGB(hsv)
            TimeLineBG = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${1})`
            hsv[2] *= 1 / 0.4

            hsv[1] *= 0.5
            hsv[2] *= 0.6
            GetColor = HSVtoRGB(hsv)
            TimeLoaded = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${1})`
            hsv[1] *= 1 / 0.5
            hsv[2] *= 1 / 0.6

            hsv[2] *= 0.2
            GetColor = HSVtoRGB(hsv)
            ControlPanel = `rgba(${GetColor[0]},${GetColor[1]},${GetColor[2]},${0.7})`
        } else {
            ThemeColor = await LoadRgba("Theme")
            ThemeColor2 = await LoadRgba("ThemeThr")
            TextColor = await LoadRgba("Text")
            TextColor2 = await LoadRgba("NdText")
            ThemeColor3 = await LoadRgba("ThemeFort")
            BG = await LoadRgba("BG")
            PlayListColor = await LoadRgba("Playlisthover")
            LinkColor = await LoadRgba("LinkColor")
            ControlPanel = await LoadRgba("MediaBG")
            TimeBG = await LoadRgba("TimeBG")
            TimeText = await LoadRgba("TIMETEXT")
            TimeLineBG = await LoadRgba("Time-LineBG")
            TimeLoaded = await LoadRgba("TimeLoaded")
        }

        Collect_Style = `
                .sbfl_b,.sbsb_a,
                #container.style-scope.ytd-masthead,
                ytd-mini-guide-renderer,
                ytd-mini-guide-entry-renderer,
                ytd-page-manager>*.ytd-page-manager,
                `+ await GetSettingCSS("VBG") + `
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
                .ytp-endscreen-content
                {
                    background: transparent !important;
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
                    --NewtubeTheme: ${ThemeColor};
                    --blur-amount: `+ await Load("BlurAm") + `px;
                    --Bg-blur: `+ await Load("BlurBGAM") + `px;
                    --theme-fort: ${ThemeColor3};
                    --playlist-bg: `+ PlayListColor + `;
                    --text-color: `+ TextColor + `;
                    --nd-text-color: `+ TextColor2 + `;
                    --border-width: `+ await Load("Border") + `px;
                    --player-bg-border-width: `+ await Load("PlayerBorder") + `px;
                    --border-color: `+ await LoadRgba("OutSha") + `;
                    --border-hover-color: `+ await LoadRgba("ThumbHoverColor") + `;
                    --border-click-color: `+ await LoadRgba("ThumbClick") + `;
                    --bg-color: `+ BG + `;
                    --in-player-bg-color: `+ ControlPanel + `;
                    --top-bar-and-search-background: `+ await LoadRgba("ThemeSnd") + `;
                    --things-end-on-video: `+ await LoadRgba("EndBG") + `;
                    --hover-time-background: `+ TimeBG + `;
                    --search-background-hover: `+ await LoadRgba("Themehover") + `;
                    --theme-radius: `+ await Load("Edge") + `px;
                    --theme-time-radius: `+ await Load("TimeEdge") + `px;
                    --theme-radius-big: `+ await Load("PlayerEdge") + `px;
                    --border-minus: calc(var(--border-width) * -1);
                    --bg-border-minus: calc(var(--player-bg-border-width) * -1);
                    
                    --border-width-hover: `+ await Load("HoverBorder") + `px;
                    --border-minus-hover: calc(var(--border-width-hover) * -1);
                    
                    --theme-third: `+ ThemeColor2 + `;
                    --Zoom: `+ await Load("Zoom") + `;

                    --sub-ShaWidth: `+ await Load("subShaWidth") + `px;
                    --sub-ShaBlur: `+ await Load("subShaBlur") + `px;

                    --sub-Width: `+ await Load("subWidth") + `;
                    --sub-Space: `+ await Load("subSpace") + `px;
                    --sub-color: ` + await LoadRgba("Subtitle") + `;
                    --sub-bg: ` + await LoadRgba("CapBG") + `;
                    --sub-sha-color: `+ await LoadRgba("subShaColor") + `;

                    --SubSc-BG : ${await LoadRgba("SPSubScribeBG")};
                    --SubSc-Tx : ${await LoadRgba("SPSubScribeColor")};
                }

                .ytp-contextmenu .ytp-menuitem {
                    display: flex !important;
                    align-items: center;
                    flex-direction: row;
                }

                #search::placeholder {
                    color: var(--nd-text-color) !important;
                }

                .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline,{
                    background: var(--top-bar-and-search-background);
                }

                ytd-text-inline-expander yt-attributed-string a{
                    color: ${LinkColor} !important;
                }

                ytd-menu-renderer .ytd-menu-renderer[style-target=button] yt-icon{
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

                .ytp-gradietop{
                    border-radius: var(--theme-radius-big) var(--theme-radius-big) 0px 0px;
                }
                  
                ytd-menu-renderer .ytd-menu-renderer[style-target=button]:hover yt-icon{
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
                    background: ${await LoadRgba("ThemeChips")} !important;
                }

                @supports (scrollbar-width: auto) {
                    *{
                        scrollbar-width: `+ await Load("ScWidthNew") + `;
                        scrollbar-color: var(--NewtubeTheme) transparent;
                    }

                    ytd-app {
                        scrollbar-width: none;
                    }

                    body::-webkit-scrollbar-track
                    {
                        scrollbar-color: var(--NewtubeTheme) ` + await Load("BGC") + ` !important;
                    }
                }

                @supports selector(::-webkit-scrollbar) {
                    *::-webkit-scrollbar
                    {
                        width: `+ await Load("ScWidth") + `px  !important;
                        height: `+ await Load("ScWidth") + `px  !important;

                        background-color: transparent !important;
                        color: var(--NewtubeTheme) !important;
                    }
                    
                    *::-webkit-scrollbar-thumb
                    {
                        border-radius:10px;
                        background-color: var(--NewtubeTheme) !important;
                    }

                    *:not(body)::-webkit-scrollbar-track{
                        background: transparent !important;
                    }

                    ytd-app::-webkit-scrollbar {
                        width: 0px  !important;
                    }

                    body::-webkit-scrollbar-track
                    {
                        background: `+ await Load("BGC") + ` !important;
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
                    height: `+ await Load("TimeH") + `px !important;
                }

                .ytp-time-current, .ytp-time-separator, .ytp-time-duration
                {
                    color: `+ await LoadRgba("VDOTEXT") + `!important;
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
                .ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title,
                ytd-thumbnail-overlay-side-panel-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer,
                `+ await GetSettingCSS("PlayerOut") + `
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
                `+ await GetSettingCSS("TopOut") + `
                `+ await GetSettingCSS("CapOut") + `
                `+ await GetSettingCSS("SubOut") + `
                `+ await GetSettingCSS("TimeOut") + `
                `+ await GetSettingCSS("SndOut") + `
                .ytp-show-tiles .ytp-videowall-still,
                #tabs-container,
                yt-confirm-dialog-renderer[dialog][dialog][dialog],
                .ytp-ce-element.ytp-ce-elemeshow,
                #contentWrapper.tp-yt-iron-dropdown > *,
                .ytp-tooltip-bg,
                .skeleton-bg-color.ytd-ghost-grid-renderer
                {
                    border-collapse: separate;
                    `+ JSON.parse(await GetSettingCSS("OutOrSha"))[0] + `
                }

                div.html5-video-player:not(.ytp-small-mode){
                    overflow: visible;
                    position: absolute !important;
                }

                #container {
                    position: relative !important;
                }
                
                `+ await GetSettingCSS("PlayerOut") + `
                .ytp-popup.ytp-settings-menu,
                #NEWTUBEBG,
                .NEWTUBEMAIN
                {
                    border-collapse: separate;
                    `+ JSON.parse(await GetSettingCSS("OutOrSha"))[1] + `
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
                    --yt-spec-call-to-action: var(--NewtubeTheme) !important;
                    --yt-spec-suggested-action: var(--theme-fort) !important;
                    --yt-spec-badge-chip-background: var(--theme-fort) !important;
                    --yt-spec-text-primary: var(--text-color) !important;
                    --yt-spec-text-secondary: var(--nd-text-color) !important;
                    --yt-spec-brand-button-background: var(--NewtubeTheme) !important;
                    --yt-spec-static-brand-red: var(--NewtubeTheme) !important;
                    --yt-spec-brand-icon-inactive: var(--NewtubeTheme) !important;
                    --yt-spec-10-percelayer: var(--theme-third) !important;
                    --yt-spec-general-background-b: transparent !important;
                    --yt-spec-wordmark-text: var(--text-color) !important;
                    --yt-spec-button-chip-background-hover: var(--search-background-hover) !important;
                    --yt-spec-text-primary-inverse: var(--top-bar-and-search-background) !important;
                    --yt-spec-static-brand-white: var(--text-color) !important;
                    --yt-spec-base-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-raised-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-menu-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-static-overlay-text-primary: var(--text-color) !important;
                    --ytd-author-comment-badge-background-color: var(--theme-third) !important;
                    --yt-spec-10-percent-layer: var(--theme-third) !important;
                    --yt-spec-static-brand-black: var(--text-color) !important;
                    --yt-spec-additive-background: var(--theme-third) !important;
                    --yt-spec-static-overlay-background-brand: var(--theme-fort) !important;
                    --yt-spec-text-primary-inverse: var(--text-color) !important;
                    --yt-spec-inverted-background: var(--top-bar-and-search-background) !important;
                    --yt-spec-themed-blue: var(--NewtubeTheme) !important;
                    --yt-live-chat-vem-background-color: var(--top-bar-and-search-background) !important;
                    --ytmusic-background: transparent !important;
                }

                ytd-tabbed-page-header{
                    --yt-lightsource-section1-color: transparent !important;
                }

                .ytp-preview .ytp-tooltip-text-no-title,
                .ytd-thumbnail-overlay-bottom-panel-renderer,
                #time-status{
                    color: `+ TimeText + ` !important;
                }

                #progress-bar.ytmusic-player-bar{

                }

                tp-yt-paper-slider{
                    --paper-progress-active-color: var(--NewtubeTheme) !important;
                }

                tp-yt-paper-button.ytd-expander span,
                .yt-spec-button-shape-next--outline,
                tp-yt-paper-button.ytd-text-inline-expander,
                .yt-spec-button-shape-next--filled,
                #reply-button-end button,
                .ytp-tooltip-text{
                    color: var(--text-color) !important;
                }

                .ytd-comment-renderer:hover{
                    text-decoration: none !important;
                }

                #search-icon-legacy{
                    background: var(--theme-third) !important;
                    border-color: transparent !important;
                    transition: all 0.1s;
                }

                tp-yt-paper-button.ytd-expander,
                tp-yt-paper-button.ytd-text-inline-expander,
                .yt-spec-button-shape-next--outline,
                #reply-button-end button,
                .yt-spec-button-shape-next--filled,
                .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text{
                    border: 1px solid transparent !important;
                    transition: all 0.1s;
                }

                tp-yt-paper-button.ytd-expander,
                tp-yt-paper-button.ytd-text-inline-expander{
                    padding-inline: 10px !important;
                }

                #text-container.yt-notification-action-renderer{
                    border: 1px solid var(--theme-third);
                }

                #search-icon-legacy:hover,
                tp-yt-paper-button.ytd-expander:hover,
                tp-yt-paper-button.ytd-text-inline-expander:hover,
                .yt-spec-button-shape-next--outline:hover,
                #reply-button-end button:hover,
                .yt-spec-button-shape-next--filled:hover,
                .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text:hover{
                    border-color: var(--NewtubeTheme) !important;
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
                .yt-spec-button-shape-next--filled,
                .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text:hover{
                    background: var(--theme-third) !important;
                }

                ytd-playlist-panel-video-renderer:hover {
                    background-color: var(--playlist-bg) !important;
                }

                ytd-app,
                .background-gradient,
                ytmusic-app-layout:has(ytmusic-nav-bar[is-search-page]){
                    background: transparent !important;
                }

                .ytp-tooltip-text-no-title
                {
                    color: var(--yt-spec-static-brand-white) !important;
                }

                .ytp-tooltip-text-no-title{
                    background: var(--hover-time-background) !important;
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
                    border-bottom: var(--yt-spec-10-percelayer) !important;
                }
                
                .ytp-ce-expanding-overlay-background,
                .ytp-ce-playlist-count
                {
                    background: var(--things-end-on-video) !important;
                }
                
                .sbdd_b,
                #scrim,
                tp-yt-iron-overlay-backdrop,
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
                div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-inline-preview-mode):not(.ytp-player-minimized) .html5-video-container,
                .ytp-offline-slate-background,
                .ytp-storyboard-framepreview,
                .ytp-storyboard-framepreview-img,
                .videowall-endscreen
                {   
                    border-radius: var(--theme-radius-big) !important;
                }

                div.html5-video-player.ytp-inline-preview-mode .html5-video-container {
                    border-radius: var(--theme-radius) !important;
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
                ytd-engagemepanel-section-list-renderer,
                #tooltip,
                ytd-compact-link-renderer,
                ytd-notification-renderer,
                #time.ytd-macro-markers-list-item-renderer,
                ytd-macro-markers-list-item-renderer,
                .ytp-menuitem,
                tp-yt-paper-button.ytd-expander,
                #text-container.yt-notification-action-renderer,
                tp-yt-paper-button.ytd-text-inline-expander,
                ytd-menu-service-item-renderer tp-yt-paper-item,
                .ytp-menuitem,
                yt-live-chat-text-message-renderer,
                yt-img-shadow img,
                ytmusic-player-queue-item,
                yt-dynamic-text-view-model,
                .ytp-inline-preview-controls
                {
                    border-radius: var(--theme-radius) !important;
                }

                ytd-engagemepanel-section-list-renderer
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
                    overflow: visible !important;
                }
                
                .ytp-menuitem-icon path:not([fill="none"]),
                .ytd-thumbnail-overlay-hover-text-renderer path,
                .ytd-thumbnail-overlay-bottom-panel-renderer path,
                #search-icon.ytd-searchbox path,
                svg path[fill="#FF0000"],
                svg [fill="#FF0000"],
                svg [fill="red"],
                svg [fill="#F00"],
                button:not(.yt-share-target-renderer) path:not([fill="none"]),
                [role="button"] path,
                [role="option"]:not(.yt-third-party-share-target-section-renderer) path,
                .ytp-heat-map-graph
                {
                    fill: var(--NewtubeTheme) !important;
                }

                ytd-author-commebadge-renderer,
                yt-dynamic-text-view-model{
                    background: var(--theme-fort) !important;
                }

                #text.ytd-channel-name,
                yt-button-renderer.yt-formatted-string.yt-button-renderer,
                paper-ripple,
                a.yt-simple-endpoint.yt-formatted-string,
                .style-scope.ytd-menu-renderer.force-icon-button.style-default-active,
                .badge-style-type-live-now.ytd-badge-supported-renderer, .badge-style-type-starting-soon.ytd-badge-supported-renderer
                {   
                    border-color : var(--NewtubeTheme) !important;
                    color: var(--NewtubeTheme) !important;
                }

                .badge-style-type-live-now-alternate.ytd-badge-supported-renderer,
                .badge-style-type-verified svg{
                    color: var(--NewtubeTheme) !important;
                }
                
                paper-ripple,
                .ytp-swatch-color,
                a.ytp-ce-link,
                yt-icon.ytd-compact-link-renderer,
                yt-icon.ytd-toggle-theme-compact-link-renderer {
                    border-radius: var(--theme-radius) !important;
                    color: var(--NewtubeTheme) !important;
                }
                
                .ytp-swatch-background-color,
                .ytp-settings-button.ytp-hd-quality-badge:after,
                .ytp-chrome-controls .ytp-button[aria-pressed]:after,
                .ytp-sb-subscribe, a.ytp-sb-subscribe,
                yt-icon-button.yt-live-chat-item-list-renderer
                {
                    background-color: var(--NewtubeTheme) !important;
                }
                
                ytd-thumbnail-overlay-time-status-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer,
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
                    background: var(--NewtubeTheme) !important;
                    color: var(--text-color) !important;
                }

                #container.ytd-searchbox input.ytd-searchbox,
                .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text{
                    color: var(--NewtubeTheme) !important;
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
                    outline: var(--border-width) solid var(--border-click-color) !important;
                }
                
                .ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]):hover > svg path
                {
                    fill: `+ await LoadRgba("HBT") + ` !important;
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
                
                .ytp-button:not(.ytp-chapter-title):not(.ytp-ad-skip-button):not(.ytp-fullerscreen-edu-button):not(.iv-branding *):hover,
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
                
                .ytp-progress-list
                {
                    background: `+ TimeLineBG + ` !important;
                }
                
                .ytp-load-progress
                {
                    background: `+ TimeLoaded + ` !important;
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
                ytd-playlist-thumbnail > a > div > ytd-playlist-custom-thumbnail-renderer > yt-img-shadow > img,
                .thumbnail-overlay.ytmusic-player-queue-item
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

                yt-chip-cloud-chip-renderer[selected]{
                    color: var(--bg) !important;
                    background: var(--NewtubeTheme) !important;
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
                    color: var(--NewtubeTheme) !important;
                }
                    
                .sbse:not(.sbpqs_d) .sbpqs_a{
                    color: var(--nd-text-color) !important;
                }
                    
                .sbpqs_a:before{
                    filter: invert(0.5);
                }

                #guide-content,
                #mini-guide-background{
                    background: `+ await LoadRgba("LeftBar") + ` !important;
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
                    height: `+ await Load("MediaH") + `px !important;
                    border-radius: var(--theme-radius-big) !important;
                    `+ await GetSettingCSS("BottomG") + `
                }

                .ytp-fullscreen .ytp-gradient-bottom{
                    height: `+ await Load("MediaHFull") + `px !important;
                }

                
                #NewtubeVDOCanvas,
                .song-media-controls{
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
                    border-color: var(--NewtubeTheme) var(--NewtubeTheme) transparent !important;
                }

                path[stroke="rgb(255,255,255)"] {
                    stroke: var(--NewtubeTheme) !important;
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
                    background: linear-gradient(-70deg, var(--NewtubeTheme), var(--theme-third) ) !important;
                }

                ytmusic-player-queue-item[play-button-state=playing],
                ytmusic-player-queue-item[play-button-state=paused]{
                    background: linear-gradient(70deg, var(--theme-third) , transparent ) !important;
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
                }
                 
                #text.ytd-channel-name:not(.complex-string):hover {
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
                    margin-top:`+ await Load("BelowSpace") + `px;
                }

                .playlist-items.ytd-playlist-panel-renderer{
                    transform: translateZ(0);
                    -webkit-transform: translateZ(0);
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
                    background-color: var(--theme-fort) !important;
                }

                .ytp-autonav-toggle-button[aria-checked="true"]::after{
                    background-color: var(--NewtubeTheme) !important;
                    -webkit-mask-box-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNyA4LjVhOC41IDguNSAwIDExLTE3IDAgOC41IDguNSAwIDAxMTcgMHptLTUgMEw2LjUgNXY3TDEyIDguNXptLTEuODYgMEw3LjUgNi44MnYzLjM2bDIuNjQtMS42OHpNOC41IDE2YTcuNSA3LjUgMCAxMDAtMTUgNy41IDcuNSAwIDAwMCAxNXoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYgOC41YTcuNSA3LjUgMCAxMS0xNSAwIDcuNSA3LjUgMCAwMTE1IDB6bS00IDBMNi41IDEyVjVMMTIgOC41eiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=")
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
                `

        NTstyle.textContent = Collect_Style;

        await WaitCreatedSeparateSettingCSS()

        Array.from(StyleElementHolder.children).forEach(style => {
            if (style.textContent == "") return
            Collect_Style += `\n\n/*----------------------------------*/\n${style.textContent}`
        });
    }
}