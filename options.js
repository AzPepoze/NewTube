/* Yeaaaaaah :3 AzPepoze https://www.youtube.com/channel/UCJ2C0UTfxQo6iGTfudPfoRQ*/

Ver = "2.10"

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
    ADDEVENT = false,
    ADDScrollEVENT = false,
    VDOBG = false,
    TranHead = false,
    EPar,
    LoopCheck

style = document.createElement("style");

style.id = "NEWTUBESTYLE";

Set.innerHTML = "<span>◉</span>";
Set.id = "NEWTUBESET";
Set.style = `display: inline-block;
background-color: transparent;
border: transparent;
color: var(--yt-spec-text-primary);
text-align: center;
font-size: 15px;
transition: all 0.5s;
margin: 5px;
width: 50px;`

function DOwithindexed(Successdo) {
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
    if (localStorage[THIS] == null) {
        localStorage[THIS] = DE
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

    SetValueCheck2("PlayerOut", `.ytp-gradient-bottom,`, ``)

    SetValueCheck2("TopOut", `#masthead,`, ``)

    SetValueCheck2("TimeOut", `ytd-thumbnail-overlay-time-status-renderer,`, ``)

    SetValueCheck2("SubOut", `tp-yt-paper-button.ytd-subscribe-button-renderer,`, ``)

    SetValueCheck2("CapOut", `.html5-video-player .caption-visual-line .ytp-caption-segment:last-child,`, ``)

    SetValueCheck2("CenterTime", `
    ytd-thumbnail-overlay-time-status-renderer
    {
        width: 100% !important;
        margin: 0px !important;
        padding: 0px !important;
        bottom: 0px;
    }
    
    #text.ytd-thumbnail-overlay-time-status-renderer
    {
        margin-left: auto;
        margin-right: auto;
    }
    
    .ytp-ce-video-duration
    {
        width: 97% !important;
        margin: -2px !important;
        text-align:center !important;
    }`, ``)

    SetValueCheck2("transition", 'transition', ``)

    SetValueCheck2("SyncLogo", `
    [d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"]
    {
        fill: var(--theme) !important;
    }`, ``)

    SetValueCheck2("BlurSub", `
    .html5-video-player .caption-visual-line .ytp-caption-segment:last-child
    {
        backdrop-filter: blur(var(--blur-amount)) !important;
    }`, ``)

    SetValueCheck2("Repeat", `background-repeat: repeat !important;`, `background-repeat: no-repeat !important;`)

    SetValueCheck2("BottomG", 'background-image: none !important;', ``)

    SetValueCheck2("VBG", `ytd-watch-flexy[theater] #player-theater-container.ytd-watch-flexy,
    ytd-watch-flexy[fullscreen] #player-theater-container.ytd-watch-flexy,`, ``)

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

    SetValueCheck2("CenterUD", `#title.ytd-watch-metadata {
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

    SetValueCheck2("Scroll", `#masthead{
        transition: background .2s;
    }`, ``)

    SetValueCheck2("LeftBar", `#guide-content{
        background:transparent !important;
    }`, ``)

    SetValueCheck2("Ptran", `ytd-page-manager{
        transition: all 0.5s;
    }`, ``)

    SetValueCheck2("NewSub", `
    .ytp-caption-segment {
        background: transparent !important;

        text-shadow:
        rgb(0 0 0) var(--sub-ShaWidth) 0px var(--sub-ShaBlur),
        rgb(0 0 0) calc(var(--sub-ShaWidth) * -1) 0px var(--sub-ShaBlur),
        rgb(0 0 0) 0px var(--sub-ShaWidth) var(--sub-ShaBlur),
        rgb(0 0 0) 0px calc(var(--sub-ShaWidth) * -1) var(--sub-ShaBlur),
        rgb(0 0 0) 1.25px 1.25px var(--sub-ShaBlur),
        rgb(0 0 0) -1.25px -1.25px var(--sub-ShaBlur);

        font-weight: var(--sub-Width);

        letter-spacing: var(--sub-Space);
    }

    .html5-video-player .caption-visual-line .ytp-caption-segment:last-child
    {
        color: var(--sub-color) !important;
    }
    
    .captions-text{
        background: var(--sub-bg) !important;
    }
    `, ``)
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
    .ytp-iv-drawer-open .iv-drawer,
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
    .ytp-ad-skip-button
    {
        backdrop-filter: blur(var(--blur-amount)) !important;
    }
    
    ytd-compact-radio-renderer > #dismissible > ytd-thumbnail > a > yt-img-shadow > img,
    ytd-playlist-thumbnail > a > #playlist-thumbnails > ytd-playlist-video-thumbnail-renderer > yt-img-shadow > img,
    ytd-playlist-thumbnail > a > div > ytd-playlist-custom-thumbnail-renderer > yt-img-shadow > img
    {
        filter: blur(0px);
    }

    ytd-compact-radio-renderer > #dismissible > ytd-thumbnail:hover > a > yt-img-shadow > img,
    ytd-playlist-thumbnail:hover > a > #playlist-thumbnails > ytd-playlist-video-thumbnail-renderer > yt-img-shadow > img,
    ytd-playlist-thumbnail:hover > a > div > ytd-playlist-custom-thumbnail-renderer > yt-img-shadow > img
    {
        filter: blur(var(--blur-amount)) !important;
    }`)

    SetValueSelect2("BlurWhat", "main", `.sbdd_b,
    #masthead,
    ytd-multi-page-menu-renderer,
    .ytp-popup.ytp-settings-menu,
    #chips-wrapper.ytd-feed-filter-chip-bar-renderer,
    .ytp-iv-drawer-open .iv-drawer,
    #card.ytd-miniplayer,
    ytd-miniplayer
    {
        backdrop-filter: blur(var(--blur-amount)) !important;
    }`)
    SetValueSelect2("BlurWhat", "none", ``)





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
    
    ytd-compact-playlist-renderer:hover>div>div>div>a,
    ytd-compact-video-renderer:hover>div>div>div>a,
    ytd-compact-radio-renderer:hover>div>div>div>a
    {
        margin-inline-end: 15px !important;
    }
    
    ytd-playlist-panel-video-renderer:hover > .yt-simple-endpoint.ytd-playlist-panel-video-renderer,
    a:hover > tp-yt-paper-item
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
    
    ytd-thumbnail:hover,
    ytd-playlist-thumbnail:hover
    {   
        transform: scale(var(--Zoom)) !important;
        z-index: 400;
    }
    
    ytd-playlist-panel-video-renderer:hover > .yt-simple-endpoint.ytd-playlist-panel-video-renderer,
    a:hover > tp-yt-paper-item
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
    IWantTOset = [localStorage[Id + "T"], Id]
    SetValueCheck()
    SetValueSelect()
    return ReturnCode
}

//-----------------------------------------------------------------

function SetNull() {
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

    SetTo("NVDOB", `60`)
    SetTo("NVDOC", `1`)
    SetTo("NVDOBGT", `0.4`)
    SetTo("NVDOT", `2`)

    SetTo("subWidth", `700`)
    SetTo("subSpace", `2`)

    SetTo("subShaWidth", `0`)
    SetTo("subShaBlur", `2`)

    //Check------------------------

    SetTo("APIT", false)
    SetTo("RealtimeT", false)
    SetTo("FlipT", false)
    SetTo("EnableButtonT", true)
    SetTo("TopOutT", true)
    SetTo("TimeOutT", true)
    SetTo("PlayerOutT", true)
    SetTo("SubOutT", false)
    SetTo("CapOutT", false)
    SetTo("transitionT", true)
    SetTo("SyncLogoT", true)
    SetTo("BlurSubT", true)
    SetTo("RepeatT", false)
    SetTo("CenterTimeT", true)
    SetTo("BottomGT", true)
    SetTo("VBGT", true)
    SetTo("EnaCUSCSST", false)
    SetTo("CenterMediaT", true)
    SetTo("MediaBlurT", true)
    SetTo("CenterUDT", true)
    SetTo("CenterUDFT", true)
    SetTo("TimeAniT", true)
    SetTo("LoadVDOT", true)
    SetTo("ScrollT", true)
    SetTo("VDOBGT", false)
    SetTo("LeftBarT", true)
    SetTo("PtranT", false)

    SetTo("VDOSYT", true)

    SetTo("NewSubT", true)

    SetTo("VisualT", false)
    SetTo("ConUnderVDOT", false)
    SetTo("NewVDOanimaT", false)

    //Select------------------------

    SetTo("BlurWhatT", "none")
    SetTo("ThumbHoverT", "Slide")
    SetTo("OutOrShaT", "Out")

    //Color------------------------

    NUllColor("Theme", `#ff94f6`, `100`)
    NUllColor("ThemeSnd", `#000000`, `50`)
    NUllColor("ThemeThr", `#ff94f6`, `20`)
    NUllColor("ThemeFort", `#ff94f6`, `100`)

    NUllColor("OutSha", `#ff94f6`, `50`)
    NUllColor("BG", `#000000`, `70`)
    NUllColor("Themehover", `#ff94f6`, `50`)
    NUllColor("Playlisthover", `#ff94f6`, `50`)
    NUllColor("Subtitle", `#ff94f6`, `100`)

    NUllColor("Time-LineBG", `#ffffff`, `20`)
    NUllColor("TimeLoaded", `#ffffff`, `50`)

    NUllColor("MediaBG", `#000000`, `50`)

    NUllColor("TimeBG", `#000000`, `50`)

    NUllColor("ThumbHoverColor", `#ff94f6`, `100`)

    NUllColor("ThumbClick", `#ffffff`, `100`)

    NUllColor("Text", `#ffffff`, `100`)

    NUllColor("NdText", `#c4c4c4`, `100`)

    NUllColor("EndBG", `#000000`, `50`)

    NUllColor("CapBG", `#000000`, `50`)

    NUllColor("VDOTEXT", `#ffffff`, `100`)

    NUllColor("TIMETEXT", `#ffffff`, `100`)

    NUllColor("HBT", `#ffffff`, `100`)
}

let NORMAL = `
    @keyframes glowing {
        0% { background-position: 0 0; }
        50% { background-position: 400% 0; }
        100% { background-position: 0 0; }
    }

    .NDel:hover {
        background: #41ffe5 !important;
    }

    input#ChooseBG::-webkit-file-upload-button{
        border-radius: 10px;
        border: transparent;
        padding: 10px;
        margin-inline-end: 10px;
        transition: all 0.2s;
    }

    input#ChooseBG::-webkit-file-upload-button:hover{
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
        content: '\◀';
        position: absolute;
        opacity: 0;
        top: 0;
        right: -20px;
        transition: 0.5s;
	}

	#NEWTUBESET:hover span {
	    padding-right: 25px;
	}
	#NEWTUBESET:hover span:after {
        opacity: 1;
        right: 0;
	}

	[hover]:hover
	{
		background:rgb(100, 100, 100) !important;
	}

    .HoverList {
        border-radius: 10px;
        transition: all 0.2s;
        margin-inline-start: 10px;
        user-select: none;
    }

    .HoverList:hover {
        background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%) !important;
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
		padding: 10px;
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

    .ListBox {
        padding: 10px;
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
		border-radius: 10px;
        background: rgb(60 60 60 / 40%);
        padding: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        font-size: 10px;
        margin-inline: -10px;
        margin-block: 10px;
        border-bottom: 1px solid #ffffff6b;
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
		background: rgba(0, 0, 0);
		border-radius:10px;
	}

	.NEWTUBE::-webkit-scrollbar,
	#MAINPRESET::-webkit-scrollbar
	{
		width:6px !important;
	}

	.NEWTUBE::-webkit-scrollbar-track,
	#MAINPRESET::-webkit-scrollbar-track
	{
		background: transparent;
		border-radius:10px !important;
	}

	.NEWTUBE::-webkit-scrollbar-thumb,
	#MAINPRESET::-webkit-scrollbar-thumb
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
		width: 3.5em;
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
		background: #0ebeff;
	}
		
	.CheckBox:after{
		position: absolute;
		content: "";
		width: 1.5em;
		height: 1.5em;
		border-radius: 50%;
		background: #fff !important;
		-webkit-box-shadow: 0 0 .25em rgba(0,0,0,.3);
				box-shadow: 0 0 .25em rgba(0,0,0,.3);
		-webkit-transform: scale(.7);
				transform: scale(.7);
		left: 0;
        transition: all .2s;
	}

    .NDel
	{
		transition: background .2s;
	}
		
	.CheckBox:checked:after{
		left: calc(100% - 1.5em);
	}

	#header
	{
		z-index:999 !important;
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
	`, AfterNEWTUBE = `#NEWTUBEBG,
    .NEWTUBEMAIN {
        background: rgba(0,0,0,0.9) !important;
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
        ` + GetCodeC("transition") + `: opacity 0.2s;
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
        ` + GetCodeC("transition") + `: all 2s;
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

function ScrollEv() {
    toppo = document.documentElement.scrollTop
    var Masterhead = document.getElementById("masthead")

    if (toppo == 0 && TranHead == false) {
        TranHead = true
        Masterhead.style = `background:transparent;
        backdrop-filter: none !important;
        box-shadow: 0px 0px transparent !important;
        outline: transparent !important;`
    } else {
        if (toppo > 0 && TranHead == true) {
            TranHead = false
            Masterhead.style = ``
        }
    }
}

function update() {
    console.log("UPDATE");
    Collect_Style = ``

    if (localStorage["VDOBGT"] != 'true' || localStorage["EnableButtonT"] != 'true') {
        if (VDOBG == true) {
            VDOBG = false
            DisableBGBlur()
        }
    }

    if (localStorage["EnableButtonT"] == 'false') {
        style.textContent = NORMAL;
    }
    else if (localStorage["EnaCUSCSST"] == 'true') {
        style.textContent = NORMAL + localStorage["CUSTOM"] + AfterNEWTUBE
    } else {

        if (localStorage["LoadVDOT"] == 'true' && localStorage["EnableButtonT"] == 'true') {
            if (ADDEVENT == false) {
                ADDEVENT = true
                document.addEventListener("click", LOADANIMATION, true)
            }
        } else {
            if (ADDEVENT == true) {
                ADDEVENT = false
                document.removeEventListener("click", LOADANIMATION, true)
            }
        }

        if (localStorage["ScrollT"] == 'true' && localStorage["EnableButtonT"] == 'true') {
            if (ADDScrollEVENT == false) {
                ADDScrollEVENT = true
                document.addEventListener("scroll", ScrollEv, true)
                ScrollEv()
            }
        } else {
            if (ADDScrollEVENT == true) {
                ADDScrollEVENT = false
                document.removeEventListener("scroll", ScrollEv, true)
                document.getElementById("masthead").style.removeProperty("background")
            }
        }

        DOwithindexed(function () {
            let get = store.get("BGIMG")
            get.onsuccess = function () {
                let BGIMGCODE = ``,
                    BGBLURCODE = ``,
                    Flip = ``

                if (localStorage["BlurBGAM"] > 0 && get.result != null) {
                    BGBLURCODE = `#BGFRAME
                {
                    filter: blur(var(--Bg-blur)) !important;
                }`
                }

                if (localStorage["FlipT"] == `true`) {
                    Flip = `transform: scaleX(-1);`
                }

                if (get.result != null) {
                    BGIMGCODE = `#BGFRAME
                {
                    width:100%;
                    height:100%;
                    background-image : url("` + get.result + `");
                    `+ GetCodeC("Repeat") + `
                    background-position: `+ localStorage["IMGX"] + `% ` + localStorage["IMGY"] + `% !important;
                    background-size: `+ localStorage["IMGS"] + `% !important;
                    top:0;
                    position:fixed;
                    z-index: -10000;
                    `+ Flip + `;`
                        + GetCodeC("transition") + `: opacity 2s;
                }`

                }

                setTimeout(() => {
                    if (localStorage["VDOBGT"] == 'true' && localStorage["EnableButtonT"] == 'true') {
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
                    --blur-amount: `+ localStorage["BlurAm"] + `px;
                    --Bg-blur: `+ localStorage["BlurBGAM"] + `px;
                    --theme: `+ 'Theme'.GetSaveRgba() + `;
                    --playlist-bg: `+ 'Playlisthover'.GetSaveRgba() + `;
                    --text-color: `+ 'Text'.GetSaveRgba() + `;
                    --nd-text-color: `+ 'NdText'.GetSaveRgba() + `;
                    --border-width: `+ localStorage["Border"] + `px;
                    --player-bg-border-width: `+ localStorage["PlayerBorder"] + `px;
                    --border-color: `+ 'OutSha'.GetSaveRgba() + `;
                    --border-hover-color: `+ 'ThumbHoverColor'.GetSaveRgba() + `;
                    --border-click-color: `+ 'ThumbClick'.GetSaveRgba() + `;
                    --bg-color: `+ 'BG'.GetSaveRgba() + `;
                    --in-player-bg-color: `+ 'MediaBG'.GetSaveRgba() + `;
                    --top-bar-and-search-background: `+ 'ThemeSnd'.GetSaveRgba() + `;
                    --things-end-on-video: `+ 'EndBG'.GetSaveRgba() + `;
                    --hover-time-background: `+ 'TimeBG'.GetSaveRgba() + `;
                    --search-background-hover: `+ 'Themehover'.GetSaveRgba() + `;
                    --theme-radius: `+ localStorage["Edge"] + `px;
                    --theme-time-radius: `+ localStorage["TimeEdge"] + `px;
                    --theme-radius-big: `+ localStorage["PlayerEdge"] + `px;
                    --border-minus: calc(var(--border-width) * -1);
                    --bg-border-minus: calc(var(--player-bg-border-width) * -1);
                    
                    --border-width-hover: `+ localStorage["HoverBorder"] + `px;
                    --border-minus-hover: calc(var(--border-width-hover) * -1);
                    
                    --ThirdTheme: `+ 'ThemeThr'.GetSaveRgba() + `;
                    --Zoom: `+ localStorage["Zoom"] + `;

                    --sub-ShaWidth: `+ localStorage["subShaWidth"] + `px;
                    --sub-ShaBlur: `+ localStorage["subShaBlur"] + `px;
                    --sub-Width: `+ localStorage["subWidth"] + `;
                    --sub-Space: `+ localStorage["subSpace"] + `px;
                    --sub-bg: ` + 'CapBG'.GetSaveRgba() + `;
                    --sub-color: `+ 'Subtitle'.GetSaveRgba() + `;
                }

                ytd-app::-webkit-scrollbar {
                    width: 0px !important;
                }
                
                ::-webkit-scrollbar,
                .playlist-items.ytd-playlist-panel-renderer::-webkit-scrollbar,
                #guide-inner-content.ytd-app:hover::-webkit-scrollbar
                {
                width: `+ localStorage["ScWidth"] + `px  !important;
                }
                
                ::-webkit-scrollbar-thumb,
                .playlist-items.ytd-playlist-panel-renderer::-webkit-scrollbar-thumb,
                #guide-inner-content.ytd-app:hover::-webkit-scrollbar-thumb,
                yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer:first-of-type
                {
                    background-color: var(--theme) !important;
                }
                
                *:not(body)::-webkit-scrollbar-track
                {
                    background: transparent !important;
                }
                
                body::-webkit-scrollbar-track
                {
                    background: `+ localStorage["BGC"] + ` !important;
                }
                
                ytd-thumbnail-overlay-time-status-renderer
                {
                    height: `+ localStorage["TimeH"] + `px;
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
                #player-container-outer,
                #player,
                .ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title,
                #container.ytd-playlist-panel-renderer,
                ytd-live-chat-frame,
                ytd-thumbnail-overlay-side-panel-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer,
                `+ GetCodeC("PlayerOut") + `
                .ytp-popup.ytp-settings-menu,
                .ytp-iv-drawer-open .iv-drawer,
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
                `+ GetCodeC("TopOut") + `
                ytd-video-preview,
                `+ GetCodeC("CapOut") + `
                `+ GetCodeC("SubOut") + `
                `+ GetCodeC("TimeOut") + `
                .ytp-show-tiles .ytp-videowall-still,
                #tabs-container,
                yt-confirm-dialog-renderer[dialog][dialog][dialog],
                .ytp-ce-element.ytp-ce-element-show,
                #contentWrapper.tp-yt-iron-dropdown > *,
                .ytp-tooltip-bg,
                .skeleton-bg-color.ytd-ghost-grid-renderer
                {
                    border-collapse: separate;
                    overflow: hidden !important;
                    `+ JSON.parse(GetCodeC("OutOrSha"))[0] + `
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

                html[dark], [dark] {
                    --ytd-chip-cloud-background: rgba(0,0,0,.3) !important;
                    --yt-spec-brand-background-primary: var(--top-bar-and-search-background) !important;
                    --yt-spec-brand-background-solid: var(--bg-color) !important;
                    --yt-spec-general-background-a: var(--bg-color) !important;
                    --yt-spec-call-to-action: var(--theme) !important;
                    --yt-spec-badge-chip-background: var(--playlist-bg) !important;
                    --yt-spec-text-primary: var(--text-color) !important;
                    --yt-spec-text-secondary: var(--nd-text-color) !important;
                    --yt-spec-brand-button-background: var(--theme) !important;
                    --yt-spec-static-brand-red: var(--theme) !important;
                    --yt-spec-brand-icon-inactive: var(--theme) !important;
                    --yt-spec-10-percent-layer: var(--ThirdTheme) !important;
                    --yt-spec-general-background-b: transparent !important;
                    --yt-spec-wordmark-text: var(--text-color) !important;
                    --yt-spec-button-chip-background-hover: var(--search-background-hover) !important;
                    --yt-spec-text-primary-inverse: var(--top-bar-and-search-background) !important;
                    --yt-spec-static-brand-white: `+ 'TIMETEXT'.GetSaveRgba() + ` !important;
                }

                ytd-app[darker-dark-theme] {
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
                
                #hover-overlays
                {
                    ` + GetCodeC("transition") + `: opacity .4s  !important;
                    opacity: 0 !important;
                }

                #NewtubeBlurBG{
                    ` + GetCodeC("transition") + `: opacity 2s;
                    filter: blur(` + localStorage["NVDOB"] + `px) contrast(` + localStorage["NVDOC"] + `) brightness(` + localStorage["NVDOBGT"] + `);
                    transform: scale(` + localStorage["NVDOT"] + `);
                }
                
                #thumbnail:hover > #hover-overlays
                {
                    opacity: 1 !important;
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
                tp-yt-paper-item,
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
                ytd-playlist-renderer
                {
                    ` + GetCodeC("transition") + `: all .2s !important;
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
                ytd-simple-menu-header-renderer
                {
                    background: transparent !important;
                }
                
                .sbsb_d,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,
                .ytp-menuitem:not([aria-disabled=true]):hover,
                ytd-mini-guide-entry-renderer:hover {
                    background: var(--search-background-hover) !important;
                    ` + GetCodeC("transition") + `: all .2s cubic-bezier(0.1,0.7,1,1) !important;
                }
                
                .gsfs,
                .ytp-ce-channel-metadata,
                .ytp-cards-teaser .ytp-cards-teaser-text,
                .ytp-panel-menu,
                .ytp-ce-website-title, .ytp-ce-merchandise-title
                {
                    color: var(--text-color) !important;
                }
                
                #player-container-outer,
                #player,
                ytd-multi-page-menu-renderer
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
                .ytp-iv-drawer-open .iv-drawer,
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
                tp-yt-paper-item.ytd-menu-service-item-renderer,
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
                [round]
                {
                    border-radius: var(--theme-radius) !important;
                }
                
                .ytp-gradient-bottom
                {
                    border-radius: var(--theme-radius) var(--theme-radius) 0px 0px !important;
                }
                
                #masthead
                {
                    border-radius: 0px 0px var(--theme-radius) var(--theme-radius) !important;
                }
                
                svg > path,
                svg > g > path
                {
                    fill:`+ "ThemeFort".GetSaveRgba() + ` !important;
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
                
                a.yt-simple-endpoint.yt-formatted-string::selection,
                span::selection,
                yt-formatted-string::selection,
                .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox,
                .ytp-volume-slider-handle,
                .ytp-volume-slider-handle:before
                {
                    background: var(--theme) !important;
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
                
                .ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]):hover > svg > path
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
                    ` + GetCodeC("transition") + `: all .2s  !important;
                }
                
                .ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-top, .ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-bottom
                {
                    display: block !important;
                }
                
                .ytp-gradient-bottom
                {
                    height: `+ localStorage["MediaH"] + `px !important;
                    `+ GetCodeC("BottomG") + `
                }
                
                .ytp-popup.ytp-settings-menu,
                .ytp-gradient-bottom,
                .ytp-iv-drawer-open .iv-drawer,
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
                    ` + GetCodeC("transition") + `: all .1s cubic-bezier(0.1,0.5,1,0) !important;
                }
                
                
                .ytp-button,
                .ytp-cards-button-icon
                {
                    ` + GetCodeC("transition") + `: all .2s  !important;
                }

                .ytp-tooltip-text-wrapper{
                    ` + GetCodeC("transition") + `: margin-block .5s  !important;
                }

                #show-more-button
                {
                    ` + GetCodeC("transition") + `: background .2s  !important;
                }

                ytd-app{
                    ` + GetCodeC("transition") + `: background 2s  !important;
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
                    ` + GetCodeC("transition") + `: all .2s ;
                }
                
                `+ BGBLURCODE + `
                
                `+ BGIMGCODE + `

                `+ GetCodeC("CenterMedia") + `

                `+ GetCodeC("MediaBlur") + `
                
                `+ GetCodeC("BlurWhat") + `
                
                `+ GetCodeC("ThumbHover") + `
                
                `+ GetCodeC("BlurSub") + `
                
                `+ GetCodeC("SyncLogo") + `
                
                `+ GetCodeC("CenterTime") + `

                `+ GetCodeC("CenterUD") + `

                `+ GetCodeC("CenterUDF") + `

                `+ GetCodeC("TimeAni") + `

                `+ GetCodeC("Scroll") + `

                `+ GetCodeC("LeftBar") + `

                `+ GetCodeC("Ptran") + `

                `+ GetCodeC("NewSub") + `
                
                `
                style.textContent = NORMAL + Collect_Style + AfterNEWTUBE
            };
        })
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
    width: 92%;
    flex-direction: row;
    align-items: center;
    transition: all 0.2s;`

    TellName = document.createElement("lable")
    TellName.style = `word-wrap: break-word;
    width: 400px;`
    TellName.innerHTML = Name
    TellName.className = `DES`

    LIST.appendChild(ThisList)
    ThisList.appendChild(TellName)

    if (Name == "(Current)") {
        CHOOSE = ThisList
        ThisList.style.setProperty("background", "#747474")
    } else {
        ThisDel = document.createElement("img")
        ThisDel.src = "https://upload.wikimedia.org/wikipedia/commons/7/7d/Trash_font_awesome.svg"
        ThisDel.className = "NDel"
        ThisDel.style = `filter: invert(1);
        width: 28px;
        border-radius: 10px;
        background: white;
        padding: 5px;
        margin-left: 10px;`
        ThisList.appendChild(ThisDel)
    }

    var busy = false

    USEING = `(Current)`

    ThisList.onclick = function (v) {
        Tar = v.target
        if (Tar.className == "NDel") {
            let Par = Tar.parentNode,
                arr = JSON.parse(localStorage["NUMPRESET"]),
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
            localStorage["NUMPRESET"] = JSON.stringify(arr)
            console.log(arr)
            setTimeout(() => {
                Par.remove()
            }, 200);
        } else {
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
                    DisableBGBlur()
                }

                DOwithindexed(function () {
                    let get = store.get("PRESET" + TarID)
                    get.onsuccess = function () {
                        get.result.LoadNTubeCode()
                        Tar.style.setProperty("background", "#747474")
                        setTimeout(() => {
                            busy = false
                        }, 1);
                    }
                })
            }
        }
    }
    return ThisList
};

function CreateBG() {
    BG = document.createElement("body")
    BG.className = "NEWTUBEBG"
    BG.style = `width:100%;
		height:100%;
		background: rgba(0,0,0,0.5) !important;
		z-index:5000;
		top:0;
		position:fixed;
        opacity:0;
        transition: opacity .2s;
        `

    setTimeout(() => {
        BG.style.setProperty('opacity', 1)
    }, 1);

    document.body.appendChild(BG)

    Main = document.createElement('body')
    BG.appendChild(Main)
    Main.className = "NEWTUBEMAIN"
    Main.style = `position: absolute;
		width:580px;
		height:400px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgb(20,20,20);
        display: flex;
        flex-direction: column;
        align-items: center;
		border-radius: 10px;
        `

    return ([BG, Main])
}

//Preset--------------------------------------------------------------------------------------

function PRESET() {
    var hover = false

    let CBG = CreateBG()
    PRESETBG = CBG[0]
    Main = CBG[1]

    Main.addEventListener('mouseover', function () {
        hover = true
    })

    Main.addEventListener('mouseout', function () {
        hover = false
    })


    OK = document.createElement("button")
    OK.innerHTML = "OK"
    OK.className = "Reset"

    OK.style = `position:fixed;
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
            PRESETBG.style.setProperty('opacity', 0)
            setTimeout(() => {
                localStorage.removeItem("PRESET(Current)")
                PRESETBG.remove()
            }, 500);
        }
    }

    Cancel = document.createElement("button")
    Cancel.innerHTML = "Cancel"
    Cancel.className = "Reset"

    Cancel.style = `position:fixed;
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
            PRESETBG.style.setProperty('opacity', 0)
            if (USEING != `(Current)`) {
                DOwithindexed(function () {
                    let get = store.get("PRESET(Current)")
                    get.onsuccess = function () {
                        get.result.LoadNTubeCode()
                        store.delete("PRESET(Current)")
                    }
                    store.delete("PRESET(Current)")
                })
            }
            setTimeout(() => {
                DOwithindexed(function () {
                    store.delete("PRESET(Current)")
                })
                PRESETBG.remove()
            }, 500);
        }
    }

    Cancel.onclick = function () {
        CancelCode()
    }

    THISDES = createDes("Select preset", Main).style = `padding:10px`

    THISDES.style = 'font-size:20px'

    Clicked = false

    PRESETBG.onclick = function () {
        if (hover == false) {
            CancelCode()
        }
    }

    LIST = document.createElement("body")
    LIST.style = `width: 90%;
    height: 64%;
    top: 50%;
    left: 50%;
    border-radius: 10px;
    border-bottom: solid white 1px;`

    LIST.id = `MAINPRESET`

    Main.appendChild(LIST)


    DOwithindexed(function () {
        let get = store.get("BGIMG")
        get.onsuccess = function () {
            let arr = GenNTubeCode()
            arr = [...arr, "BGIMG", get.result]
            store.put(JSON.stringify(arr), "PRESET(Current)")
        }
    })

    let ALLPRE = JSON.parse(localStorage["NUMPRESET"]),
        num


    for (num = 0; num < ALLPRE.length; num++) {
        createList(ALLPRE[num])
    }

    BoxSave = document.createElement("div")
    BoxSave.innerHTML = `<input type="text" id="TextPreset" placeholder="Enter preset name.">
    <button id="OKOver" disabled>Yes!</button>
    <button id="SavePreset">Save</button>`

    BoxSave.style = `display: flex;
    position: fixed;
    bottom: 60px;
    width: 93%;
    height: 35px;
    flex-direction: row;`

    Main.appendChild(BoxSave)

    let TextPre = document.getElementById("TextPreset")
    let OKOver = document.getElementById("OKOver")
    let SavePRe = document.getElementById("SavePreset")

    TextPre.style = `width: 85%;
    background: rgb(56, 56, 56);
    border-radius: 10px;
    border: transparent;
    color: white;
    text-align: center;
    transition: all 0.2s;`

    SavePRe.className = "Reset"
    SavePRe.style = `background: rgb(56, 56, 56);
    color: white;
    border-radius: 10px;
    border: transparent;
    width: 70px;
    height: 100%;
    position: absolute;
    right: 0px;
    transition: all 0.2s;`

    OKOver.className = "Reset"
    OKOver.style = `background: rgb(56, 56, 56);
    color: white;
    border-radius: 10px;
    border: transparent;
    width: 70px;
    height: 100%;
    position: absolute;
    right: 76px;
    opacity: 0;
    transition: all 0.2s;`

    var OverName

    OKOver.onclick = function () {
        DOwithindexed(function () {
            let get = store.get("BGIMG")
            get.onsuccess = function () {
                let arr = GenNTubeCode()
                arr = [...arr, "BGIMG", get.result]
                store.put(JSON.stringify(arr), "PRESET" + OverName)
                SavePRe.innerHTML = "Save"
                OKOver.style.opacity = "0"
                OKOver.setAttribute("disabled", "")
                TextPre.style.width = "85%"
                CanSave = true
                TextPre.value = OverName
            }
        })
    }

    SavePRe.onclick = function () {
        if (CanSave == "Over") {
            SavePRe.innerHTML = "Save"
            OKOver.style.opacity = "0"
            OKOver.setAttribute("disabled", "")
            TextPre.style.width = "85%"
            CanSave = true
            TextPre.value = OverName
        } else {
            if (CanSave == true) {
                if (TextPre.value != null && TextPre.value != "") {
                    CanSave = false
                    let f = 0,
                        arr = JSON.parse(localStorage["NUMPRESET"]),
                        last = ``

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
                        TextPre.style.width = "71%"
                        OKOver.removeAttribute("disabled")
                        OKOver.style.opacity = "1"
                    } else {
                        let Par = createList(OverName + last)
                        Par.style.height = "0px"
                        Par.style.padding = "0px"
                        Par.style.opacity = "0"

                        DOwithindexed(function () {
                            let get = store.get("BGIMG")
                            get.onsuccess = function () {
                                let arr2 = GenNTubeCode(),
                                    Name = OverName + last
                                arr2 = [...arr2, "BGIMG", get.result]
                                store.put(JSON.stringify(arr2), "PRESET" + Name)
                                localStorage["NUMPRESET"] = JSON.stringify([...arr, Name])
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

    Main.appendChild(OK)
    Main.appendChild(Cancel)
}

//Function----------------------------------------------------------------------------

var THISPar = "NEWTUBE",
    LeftCount

function createMainframe() {
    var List = document.createElement("p");
    List.className = "MainBox";
    List.id = THISPar

    var Head = document.createElement('label');
    Head.className = "DES"
    Head.innerHTML = THISPar
    Head.style = `width: -webkit-fill-available;
    font-size: 18px;
    padding: 10px;
    margin-inline: -10px;
    color: black !important;
    background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,0,0,0) 100%);
    border-radius: 10px;`

    List.appendChild(Head)

    var LeftList = document.createElement('label');
    LeftList.className = "HoverList"
    LeftList.innerHTML = THISPar
    LeftList.style = `width: -webkit-fill-available;
    font-size: 16px;
    padding: 10px;
    color: white;`
    LeftCount++
    document.getElementById("NEWTUBEBG").style.height = (LeftCount * 41) + "px"

    LeftList.onclick = function () {
        List.scrollIntoView({ behavior: 'smooth' });
    }

    document.getElementById("NEWTUBE").appendChild(List)
    document.getElementById("NEWTUBELIST").appendChild(LeftList)

    return List
};

function createframe(inner) {
    var List = document.createElement("p");
    List.className = "SndBox";
    List.innerHTML = inner;

    if (document.getElementById(THISPar) == null) {
        createMainframe()
    }

    document.getElementById(THISPar).appendChild(List)

    return List
};

function createDes(Des, Box) {
    var Descrip = document.createElement('label');
    Descrip.className = "DES";
    Descrip.innerHTML = Des;
    Box.appendChild(Descrip);

    return Descrip
};

function createCheck(id, Des) {
    var Box = createframe('<input type="checkbox" id=' + id + ' class="CheckBox" >');
    createDes(Des, Box);

    ThisCheck = document.getElementById(id);

    ThisCheck.checked = JSON.parse(localStorage[id + "T"])

    ThisCheck.addEventListener('input', function (WHAT) {
        var Tar = WHAT.target
        var Tarid = Tar.id

        localStorage[Tarid + "T"] = Tar.checked

        if (Tarid == "Realtime") {
            RESETTUBE()
        }

        update()
    });
};


function createTextBox(id, Des) {
    var Box = createframe('<input type="number" id=' + id + ' class="TextBox" >');
    createDes(Des, Box);

    ThisText = document.getElementById(id);

    ThisText.value = localStorage[id]

    ThisText.addEventListener(MODE, function (WHAT) {
        var Tar = WHAT.target
        localStorage[Tar.id] = Tar.value
        update()
    });

    return Box
};


function PickerAndSlide(thiscolor) {
    localStorage[thiscolor.id] = thiscolor.value
}

function createColor(id, Des) {
    var Box = createframe('<input type="color" id=' + id + 'C class="ColorPick" > <p> <label class="DES" >Opacity : </label> <input type="range" id=' + id + 'O class="slidebar" min="0" max="100" > </p>');

    Box.className = "DoY";

    var Box2 = document.createElement('p');
    Box2.className = "SndBox"

    document.getElementById(THISPar).appendChild(Box2)

    Box2.appendChild(Box)

    var THISDES = createDes(Des, Box2);

    THISDES.style = "padding:10px;"

    var thiscolor = document.getElementById(id + 'C');
    var thisopa = document.getElementById(id + 'O');


    thiscolor.value = localStorage[id + 'C']
    thisopa.value = localStorage[id + 'O']

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
    thisSelect.value = localStorage[id + 'T']

    thisSelect.addEventListener("change", function (WHAT) {
        localStorage[WHAT.target.id + 'T'] = WHAT.target.value
        update();
    });
};

String.prototype.GetSaveRgba = function () {
    var HEX = localStorage[this + "C"].replace('#', '')
    var aRgbHex = HEX.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16) + ',' + parseInt(aRgbHex[1], 16) + ',' + parseInt(aRgbHex[2], 16)
    ]

    return `rgba(` + aRgb + `,` + (localStorage[this + "O"] / 100) + `)`
}

function applyIMG() {
    DOwithindexed(function () {
        let get = store.get("BGIMG")
        get.onsuccess = function () {
            document.getElementById("BGIMG").style.setProperty("background-image", 'url("' + get.result + '")')
            document.getElementById("Imgid").href = get.result
            document.getElementById("Imgid").innerHTML = get.result
        };
    })
}

function ShowTexForIMG(Text) {
    document.getElementById("STATUS").innerHTML = Text
}

function IMGXY(Tar, S) {
    if (S == "S") {
        document.getElementById(Tar.id + "BOX").value = Tar.value
        update()
    } else {
        document.getElementById(Tar.id.substring(0, 4)).value = Tar.value
    }
    localStorage[Tar.id.substring(0, 4)] = Tar.value
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

    ThisSlide.value = localStorage["IMG" + XorY]
    ThisText.value = localStorage["IMG" + XorY]

    if (localStorage["RealtimeT"] == "true") {
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
    for (v = 0; v < array.length; v = v + 2) {
        if (array[v] == "BGIMG") {
            BG = array[v + 1]
        } else {
            localStorage[array[v]] = array[v + 1]
        }
    }
    DOwithindexed(function () {
        store.put(BG, "BGIMG")
        update()
        RESETTUBE()
    })
}

function GenNTubeCode() {
    arrdata = []
    for (z in localStorage) {
        if (z.substring(0, 2) != "yt" && z.length < 20 && z != "clear" && z != "getItem" && z != "key" && z != "removeItem" && z != "setItem" && z.substring(0, 6) != "PRESET" && z.substring(0, 6) != "length" && z.substring(0, 10) != "SHOWPRESET" && z != "NUMPRESET" && z != "EnableButtonT" && z != "APIT" && z != "RealtimeT" && z != "Ver") {
            arrdata.push(z)
            arrdata.push(localStorage[z])
        }
    }
    return arrdata
}

function ChTitan(inht, Size) {
    let ThisText = document.createElement('label')
    if (Size == null) {
        Size = 20
    }
    ThisText.style = `color:white;
    margin-inline-start:20px;
    margin-block:20px;
    font-size: `+ Size + `px;`
    ThisText.className = "BIGNTUBET"
    ThisText.innerHTML = inht
    ChangeslogMain.appendChild(ThisText)
}

function ChTiny(inht, Size) {
    let ThisText = document.createElement('label')
    if (Size == null) {
        Size = 15
    }
    ThisText.style = `color:white;
    margin-inline-start:40px;
    margin-block:5px;
    font-size: `+ Size + `px;`
    ThisText.className = "NTUBET"
    ThisText.innerHTML = inht
    ChangeslogMain.appendChild(ThisText)
}

let v

function setV() {
    v = document.getElementsByClassName('video-stream html5-main-video')[0]
}

function FindVideo() {
    try {
        v.tagName
        if (v.tagName != "VIDEO") {
            console.log("fixed bug")
            setV()
        }
    } catch (e) {
        console.log("fixed bug")
        setV()
    }
    return v
}



























//Create MENU----------------------------------------------------------------------------

function CreateMENU() {

    LeftCount = 0

    let DeBu = `width: -webkit-fill-available;
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

    if (localStorage["RealtimeT"] == 'true') {
        MODE = 'input'
    } else {
        MODE = 'change'
    }

    let BG = document.createElement("div")
    BG.id = "NEWTUBEBG";
    BG.className = "NEWTUBE"
    BG.style = "width: 750px; height: 0px; position: fixed; top:56px; right: 0px; transition: all 0.5s; z-index: 2020; display: flex; flex-direction: row;";
    document.body.appendChild(BG)

    let LIST = document.createElement("div")
    LIST.id = "NEWTUBELIST"
    LIST.className = "NEWTUBE"
    LIST.style = "width: 210px; height: 100%; display: flex; flex-direction: column;";
    BG.appendChild(LIST)

    let SetBg = document.createElement("body")
    SetBg.id = "NEWTUBE";
    SetBg.className = "NEWTUBE"
    SetBg.style = "width: 550px; height: 100%;";
    BG.appendChild(SetBg)

    var Reset = document.createElement('button')
    Reset.innerHTML = "Reset Extention (fix bugs)"
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

    THISPar = "💵 Donate :3"

    DonateFrame = createframe(`<p style="display: flex; align-items: center; padding:10px; width: 100%;"><img src="https://i.ibb.co/269h23M/2020021209494988264-logo-truemoneywallet-300x300.jpg" class="DONATEIMG"><lable class="DES">Wallet ID : AzDonate</lable></p>
    <p style="display: flex; align-items: center; padding:10px; width: 100%;"><img src="https://i.ibb.co/4sCYzXK/index.jpg" class="DONATEIMG"><a id="HOVERLINK" href="https://www.paypal.com/signin?returnUri=https%3A%2F%2Fwww.paypal.com%2Fmyaccount%2Ftransfer%2Fhomepage%2Fexternal%2Fprofile%3FflowContextData%3DTmV7sH9Ip5x6ax_bhu-4ib7mr3qtJYLUST5ILgPTUCV-aPS5wiTHYReTyrjZUrzo6RnqrG_IGcMdzZxRSNMClpiXW_YUozCtGT_myuY-Iz482jS6LkbxXl-gkNRo--RFIFS5jtg954mBPuxa3P8N6dBFNsBMVJEOLK1-ZP-PxAwS6mdpbwpVFeEEuJwof9Nl2PE-NgFySGvPQWI_rjkTbugXS-O6HuRR3SRqTTe1SuhE25IMdYvBvUBK2y4zpVk2KbEVhQg63WzznD1emOkCq2orEG1bCTi0M4Txky3iSId11K7Xg8e_qpf4rjOaXEPDsIlw1IbKw3WAJRLdIHx0MJFLL0yfGjE7GzR42C0GeYLnods79sPkPJCqo2GjLZzLJ07epiRk2bv33AnwcLEwp4_eVm8TMwNFK-5JX_RZOd8AiOzq3_Q9hY_A19S&onboardData=%7B%22country.x%22%3A%22US%22%2C%22locale.x%22%3A%22en_US%22%2C%22intent%22%3A%22paypalme%22%2C%22redirect_url%22%3A%22https%253A%252F%252Fwww.paypal.com%252Fmyaccount%252Ftransfer%252Fhomepage%252Fexternal%252Fprofile%253FflowContextData%253DTmV7sH9Ip5x6ax_bhu-4ib7mr3qtJYLUST5ILgPTUCV-aPS5wiTHYReTyrjZUrzo6RnqrG_IGcMdzZxRSNMClpiXW_YUozCtGT_myuY-Iz482jS6LkbxXl-gkNRo--RFIFS5jtg954mBPuxa3P8N6dBFNsBMVJEOLK1-ZP-PxAwS6mdpbwpVFeEEuJwof9Nl2PE-NgFySGvPQWI_rjkTbugXS-O6HuRR3SRqTTe1SuhE25IMdYvBvUBK2y4zpVk2KbEVhQg63WzznD1emOkCq2orEG1bCTi0M4Txky3iSId11K7Xg8e_qpf4rjOaXEPDsIlw1IbKw3WAJRLdIHx0MJFLL0yfGjE7GzR42C0GeYLnods79sPkPJCqo2GjLZzLJ07epiRk2bv33AnwcLEwp4_eVm8TMwNFK-5JX_RZOd8AiOzq3_Q9hY_A19S%22%2C%22sendMoneyText%22%3A%22You%2520are%2520sending%2520Jakkrit%2520Kaewtong%22%7D" target="_blank" class="DES" >jakkrit_portraitist@hotmail.com</a></p>
    <p style="display: flex; align-items: center; padding:10px; width: 100%;"><img src="https://theme.zdassets.com/theme_assets/948919/d80b722da9edc37805def78a512b90c5772434a6.png" class="DONATEIMG"><a id="HOVERLINK" href="https://streamlabs.com/gfirstg/tip" target="_blank" class="DES" >streamlabs (PayPal / VISA / mastercard / AMEX / DISCOVER)</a></p>`);

    document.getElementById(THISPar).getElementsByTagName("label")[0].style = `
    -webkit-text-stroke: black 1px;
    text-shadow: 0px 0px 3px white;;
    width: -webkit-fill-available;
    font-size: 18px;
    padding: 10px;
    margin-inline: -10px;
    border-radius: 10px;
    color: black;
    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
    animation: glowing 20s linear infinite;
    background-size: 400%;`

    DonateFrame.style = `display: flex;
    flex-direction: column;`

    //----------------------------------------------------------------------------------------------

    THISPar = "🎉 Join my discord 🎉"

    createframe(`<p style="display: flex; align-items: center;"><img src="https://brandlogos.net/wp-content/uploads/2021/11/discord-logo.png" class="DONATEIMG"><a id="HOVERLINK" href="https://discord.gg/BgxvVqap4G" target="_blank" class="DES" >NEWTUBE</a></p>`)

    //----------------------------------------------------------------------------------------------

    THISPar = "⚙️ Extention's settings"

    Frame = createMainframe()

    var Preset = document.createElement('button')
    Preset.innerHTML = "Select Preset"
    Preset.className = "Reset"
    Preset.style = DeBu + `width: 100% !important;
    margin-inline: 0px !important;
    margin-block-start: 20px !important;`
    Preset.onclick = function () {
        PRESET()
    }
    Frame.appendChild(Preset)

    createCheck("EnableButton", "Enable");

    createCheck("Realtime", "Realtime Changing (lag when changing!)");

    var Chlog = document.createElement('button')
    Chlog.innerHTML = "Changes log"
    Chlog.className = "Reset"
    Chlog.style = DeBu
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
            'https://github.com/AzPepoze/Newtube/issues',
            '_blank'
        )
    }
    
    SetBg.appendChild(Rebug)

    //-------------------------------------------------------------------------------

    THISPar = "🪄 Enhancement"

    createCheck("LoadVDO", "Video click animation");

    createCheck("Scroll", "Auto transparent top bar");

    createframe(`<label class="DES">Background Video</label>`)

    createCheck("VDOBG", "Background Video<br>(NOT RECOMMEND FOR LOW END PC!)");

    createTextBox("NVDOB", `(Background VDO) Blur amount`)
    createTextBox("NVDOC", `(Background VDO) Contrast`)
    createTextBox("NVDOBGT", `(Background VDO) Brightness`)
    createTextBox("NVDOT", `(Background VDO) Size`)

    createframe(`<label class="DES">New Subtitles/Captions</label>`)

    createCheck("NewSub", `New Subtitles/Captions`)

    createColor("Subtitle", "Subtitles/Captions color")
    createColor("CapBG", "Subtitles/Captions background color")

    createTextBox("subWidth", `(Text) Width`)
    createTextBox("subSpace", `(Text) Space by letters`)

    createTextBox("subShaWidth", `(Shadow) Width`)
    createTextBox("subShaBlur", `(Shadow) Blur amount`)

    //-------------------------------------------------------------------------------

    THISPar = "📝 Custom CSS"

    createCheck("EnaCUSCSS", "Enable Custom CSS")

    createframe(`<textarea id="Custom_CSS" placeholder="Paste CSS here." style="background: rgb(30, 30, 30); color: white; width: 100%; resize: vertical; height: 200px;"></textarea>`)

    CusText = document.getElementById("Custom_CSS")

    CusText.value = localStorage["CUSTOM"]

    CusText.addEventListener('change', function () {
        localStorage["CUSTOM"] = CusText.value
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


    createframe(`<textarea id="Export" style="background: rgb(30, 30, 30); color: white; width: 100%; resize: vertical; height: 200px;" placeholder="Paste NTubeCode here."></textarea>`)

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
            get.onsuccess = function () {
                let arr = GenNTubeCode()
                arr = [...arr, "BGIMG", get.result]
                ExportTEXT.value = JSON.stringify(arr)
            }
        })
    }

    Export2.onclick = function () {
        ExportTEXT.value = "Please wait..."
        ExportTEXT.value = Collect_Style
    }




    function download(data, filename, type) {
        var file = new Blob([data], { type: type });
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }


    //EDGE-------------------------------------------------------------------------------

    THISPar = "⏹️ Round Edges"

    createTextBox("Edge", "Round edges amount")

    createTextBox("TimeEdge", "Round UI on thumbnail edges amount")

    createTextBox("PlayerEdge", "Round video player edges amount")

    //theme-------------------------------------------------------------------------------

    THISPar = "🏳️‍🌈 Color/Theme"

    createColor("Theme", "1 Theme color")

    createCheck("SyncLogo", "Logo theme color sync");

    createColor("ThemeSnd", "2 theme color")

    createColor("ThemeThr", "3 theme color")

    createColor("ThemeFort", "4 theme color")

    createColor("Time-LineBG", "Time-line background color")

    createColor("TimeLoaded", "Time-line loaded color")

    createColor("Text", "Main text color")

    createColor("NdText", "Second text color")

    createColor("VDOTEXT", "Video controls panel text color")

    createColor("TIMETEXT", "Thumbnails time text color")

    createColor("MediaBG", "Video controls panel background color")

    createColor("TimeBG", "Video preview time background color")

    createColor("EndBG", "End of video chanel hover background")


    //Outline-------------------------------------------------------------------------------

    THISPar = "🔳 Borders / Shadows"

    createselect("OutOrSha",
        `<option value="Out">Borders</option>
	<option value="Sha">Shadows</option>
	<option value="None">None</option>`,
        "Borders or Shadows")

    createTextBox("Border", "Borders/Shadows width")

    createTextBox("PlayerBorder", "(Video controls panel) Borders/Shadows width")

    createColor("OutSha", "Borders/Shadows color")

    createCheck("TopOut", "Enable top_bar Borders/Shadows");

    createCheck("TimeOut", "(Clip cover) enable time Borders/Shadows");

    createCheck("PlayerOut", "(Video controls panel) enable Borders/Shadows");

    createCheck("CapOut", "(Subtitles/Captions) enable Borders/Shadows");

    createCheck("SubOut", "(Subscribe button) enable Borders/Shadows");

    //Text-------------------------------------------------------------------------------

    THISPar = "Text"

    //BG-------------------------------------------------------------------------------

    THISPar = "🎴 Background"

    createColor("BG", " Change background/tint color")

    createTextBox("BlurBGAM", "Background blur amount (0 = None)")

    createCheck("API", "Use upload api (imgbb.com)");

    var ChooseBG = createframe(`<lable class="DES">Background Image.</lable>
    <p><input id="ChooseBG" type="file" accept="image/*" > </p>
    <p><label class="DES" style="display: flex; text-align: center; margin-block: 15px; flex-direction: column;">If your computer is slow. You should enable</br>"Use upload api" button for saving your computer. ♥♥♥</br>(If not please disable it for save saving internet. ♥♥♥)</label> </p>
    <p><label class="DES" style="display: flex; text-align: center; margin-bottom: 30px;">(Thanks you imgbb.com for free api image upload! ♥)</label> </p>
    <p><label class="DES">Enter url :</label><input id="IMGFORBG" class="TextBox" type="text" style="display: flex;"></p>
    <p><lable class="DES" style="display: flex; text-align: center;" id="STATUS"></label></p>`)

    ChooseBG.style = `display: flex; flex-direction: column;`

    var IMGURL = document.getElementById("IMGFORBG")
    IMGURL.style = `width:200px;  margin-bottom: 10px;`

    IMGURL.addEventListener('change', function () {
        ShowTexForIMG("Please wait...")
        DOwithindexed(function () {
            store.put(IMGURL.value, "BGIMG")
            update()
            applyIMG()
            ShowTexForIMG("Successful.</br>(If an image didn't show up.Then the url can't access.)")
            IMGURL.value = ``
        })
    })

    var Par = document.createElement('p')
    Par.style = "margin-block: 10px; width:100%;"
    var ThisIMG = document.createElement('canvas')
    ThisIMG.id = "BGIMG"
    ThisIMG.style = `background-repeat: no-repeat; background-position: center; background-size: contain; width:100%;`

    ChooseBG.appendChild(Par)
    Par.appendChild(ThisIMG)

    var input = document.getElementById('ChooseBG');
    input.style = "margin-block: 10px; padding:10px; color:white; border-radius:10px; background:rgb(37, 37, 37);"
    input.onchange = function (evt) {
        ShowTexForIMG("Please wait...")
        var file = evt.target.files[0]
        if (localStorage["APIT"] == "true") {
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
                    console.log(serverSent)
                    DOwithindexed(function () {
                        store.put(serverSent["data"]["url"], "BGIMG")
                        applyIMG()
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
                    applyIMG()
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
            applyIMG()
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

    createCheck("BlurSub", "(Caption/Subtitle) blur background")

    createCheck("MediaBlur", "(Video controls panel) blur background")

    //Animate-------------------------------------------------------------------------------

    THISPar = "🚶 Animations"

    createCheck("transition", "Enable smooth animations")


    createselect("ThumbHover",
        `<option value="Slide">Slide</option>
	<option value="Zoom">Zoom</option>
    <option value="Slide&Zoom">Slide&Zoom</option>
	<option value="none">None</option>`,
        "Thumbnail hover style")

    createTextBox("Zoom", 'Zoom amount (If you choose "Zoom")')

    createCheck("TimeAni", "Enable hide video time when hover")

    createCheck("Ptran", "Enable Page transition")

    //Hover-------------------------------------------------------------------------------

    THISPar = "🖱️ Hover/Click color"

    createTextBox("HoverBorder", "(Clip cover) hover Borders width")

    createColor("ThumbHoverColor", "(Clip cover) Borders/Shadows on hover color")

    createColor("ThumbClick", "(Clip cover) Borders/Shadows on click color")

    createColor("Themehover", "Most hover background color")

    createColor("Playlisthover", "(Playlist) hover background color")

    createColor("HBT", "(Video controls panel) button hover color")

    //-------------------------------------------------------------------------------

    THISPar = "⚛️ Other settings"

    createCheck("CenterUD", "(Under Video) Move tittle to the center")

    createCheck("CenterUDF", "(Fullscreen) Move tittle to the center")

    createCheck("CenterTime", "(Clip cover) Move the time position to the center")

    createTextBox("TimeH", "(Clip cover) time height")

    createTextBox("ScWidth", "(Scrollbar) width")

    createCheck("CenterMedia", "(Video controls panel) Move to center")

    createCheck("BottomG", "(Video controls panel) remove background gradient")

    createTextBox("MediaH", "(Video controls panel) Background height")

    createCheck("VBG", "(Video) remove background solid color (Theater mode)")

    createCheck("LeftBar", "(Left Menu) remove background")

    applyIMG()

    //-------------------------------------------------------------------------------

    THISPar = "🌠 Beta features!"

    createframe(`<label class="DES">Maybe need to reload website</label>`)

    createCheck("ConUnderVDO", "Controls under video")

    createCheck("Visual", "Audio Visualizer")

    createCheck("NewVDOanima", "New video animation (Volume up/down,Pause,Play)")
}


























//----------------------------------------------------------------------------------
function Show() {
    document.getElementById("NEWTUBEBG").style.setProperty('right', "0px");
    document.getElementById("NEWTUBEBG").style.setProperty('opacity', "1");
}

function Hide() {
    document.getElementById("NEWTUBEBG").style.setProperty('right', "-700px");
    document.getElementById("NEWTUBEBG").style.setProperty('opacity', "0");
}

var Can = false
function clickSetting() {
    console.log(Can)
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

update()

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
    console.log("ShowUp")
    upbg = document.createElement('div')
    upbg.style = `
    width: 100%;
    height: 160px;
    position: fixed;
    z-index: 3000;
    bottom: -130px;
    border-radius: 15px;
    left: 0px;
    margin-left: 0px;
    box-shadow: white 0px 0px 200px 0px;
    background: rgb(0 0 0 / 52%);
    transition: all 1s ease;
    opacity: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(30px);
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
    
    <img src=`+ chrome.runtime.getURL('icon/64.png') + `
    style="
    filter: drop-shadow(0px 0px 8px rgba(255,255,255,0.7));
    ">
    <p style="
    font-size: 28px;
    padding: 10px;
    color: white;
    font-weight: 700;
    ">🎉 Newtube `+ Ver + ` has updated! 🎉</p>
    
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
    background: #57ffbc;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    cursor: pointer;
    transition:all 0.2s ease;
    padding: 5px;
    `
    okbut.innerHTML = "Ok !"

    sndblock.append(okbut)


    setTimeout(() => {
        upbg.style.width = '550px'
        upbg.style.opacity = '1'
        upbg.style.bottom = '20px'
        upbg.style.left = '50%'
        upbg.style["margin-left"] = "-275px"
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
    background: rgb(255 201 87);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    cursor: pointer;
    transition:all 0.2s ease;
    margin-left: 10px;
    padding: 5px;
    `
    changelogbt.innerHTML = "Changes log"

    changelogbt.onclick = function(){
        window.open(
            'https://github.com/AzPepoze/Newtube',
            '_blank'
        )
    }

    sndblock.append(changelogbt)
}



function SettoEnd() {
    setTimeout(() => {
        if (document.getElementById("end") == null) {
            SettoEnd()
        }
        else {
            if (document.documentElement.getAttribute("dark") == null) {
                document.documentElement.setAttribute("dark", "")
            }
            document.getElementById("end").appendChild(Set);

            if (localStorage["SHOWPRESET"] == "true") {
                //-----------PRESET------------------
                SetTo("NUMPRESET", JSON.stringify([
                    "(Current)",
                    "(Low PC) Purple",
                    "(Low-end PC) Cyan",
                    "(SUPER LOW PC) (CSS) Potato machine (less blur)",
                    "(SUPER_SUPER LOW PC) (CSS) Potato machine (none blur)",
                    "Light Theme",
                    "Dark Theme",
                    "Black Theme",
                    "Pink-Black",
                    "My Waifu ♥",
                    "I'm Using :D"
                ]))
                DOwithindexed(function () {
                    store.put(Ver, "Oldver")
                    function SetidxTo(Name, Va) {
                        store.put(Va, Name)
                    }
                    SetidxTo("BGIMG", "https://i.ibb.co/FYPBxC5/1647030608836.jpg")
                    SetidxTo("PRESETLight Theme", JSON.stringify(["SubtitleC", "#000000", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ffffff", "CUSTOM", "", "TextC", "#000000", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#ff0000", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#000000", "VDOTEXTC", "#000000", "MediaBGC", "#ffffff", "TimeBGC", "#ffffff", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "100", "Border", "3", "OutShaC", "#000000", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#383838", "CapOutT", "true", "PlaylisthoverO", "27", "ThemeO", "100", "ThemehoverC", "#ff0000", "ThumbHoverColorC", "#ff94f6", "ThemeFortC", "#ff0000", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#ffffff", "BlurBGAM", "10", "SubOutT", "true", "BlurWhatT", "all", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Sha", "ThumbClickO", "100", "ThemehoverO", "25", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#ff0000", "PlaylisthoverC", "#ff0000", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "50", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#ffffff", "ThemeSndC", "#ffffff", "BGO", "100", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "72", "OutShaO", "32", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#ffffff", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", ""]))
                    SetidxTo("PRESETDark Theme", JSON.stringify(["SubtitleC", "#ffffff", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#00eeff", "CUSTOM", "", "TextC", "#ffffff", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#ff0000", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeBGC", "#000000", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "100", "Border", "3", "OutShaC", "#000000", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#9e9e9e", "CapOutT", "true", "PlaylisthoverO", "50", "ThemeO", "100", "ThemehoverC", "#ff0000", "ThumbHoverColorC", "#eeff00", "ThemeFortC", "#ff0000", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "10", "SubOutT", "true", "BlurWhatT", "all", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Sha", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#ff0000", "PlaylisthoverC", "#ff0000", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "50", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#000000", "ThemeSndC", "#000000", "BGO", "85", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "72", "OutShaO", "100", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#1a1a1a", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", ""]))
                    SetidxTo("PRESETBlack Theme", JSON.stringify(["SubtitleC", "#ff8a8a", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ffffff", "CUSTOM", "", "TextC", "#ffffff", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#ff0000", "FlipT", "false", "BottomGT", "false", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeBGC", "#000000", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "100", "Border", "1", "OutShaC", "#ff0000", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#c4c4c4", "CapOutT", "false", "PlaylisthoverO", "50", "ThemeO", "100", "ThemehoverC", "#ff0000", "ThumbHoverColorC", "#00ffd5", "ThemeFortC", "#ff0000", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "10", "SubOutT", "false", "BlurWhatT", "all", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#ff0000", "PlaylisthoverC", "#ff0000", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "50", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#ffffff", "ThemeSndC", "#000000", "BGO", "70", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "80", "OutShaO", "50", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#000000", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", ""]))
                    SetidxTo("PRESETMy Waifu ♥", JSON.stringify(["SubtitleC", "#da8aff", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ff0000", "CUSTOM", "", "TextC", "#ffffff", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#bf70ff", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeBGC", "#000000", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "100", "Border", "1", "OutShaC", "#cd70ff", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#c4c4c4", "CapOutT", "false", "PlaylisthoverO", "50", "ThemeO", "100", "ThemehoverC", "#dc5cff", "ThumbHoverColorC", "#ff00dd", "ThemeFortC", "#c494ff", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "0", "SubOutT", "false", "BlurWhatT", "all", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#b061ff", "PlaylisthoverC", "#d666ff", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "15", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#ffffff", "ThemeSndC", "#000000", "BGO", "70", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "80", "OutShaO", "50", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#000000", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", "https://i.ibb.co/FYPBxC5/1647030608836.jpg"]))
                    SetidxTo("PRESET(SUPER_SUPER LOW PC) (CSS) Potato machine (none blur)", JSON.stringify(["VDOBGT", "false", "EnaCUSCSST", 'true', "CUSTOM", `:root{--blur-amount:10px;--theme:red;--playlist-bg:rgba(255,0,0,0.1);--text-color:#FFF;--nd-text-color:#7D7D7D;--border-width:1px;--player-bg-border-width:1px;--border-color:rgba(0,0,0,0);--border-hover-color:red;--border-click-color:#0FF;--bg-color:#000;--in-player-bg-color:rgba(0,0,0,0.5);--top-bar-and-search-background:rgba(0,0,0,0.507);--things-end-on-video:rgba(66,66,66,0.507);--hover-time-background:rgba(0,0,0,0.425);--search-background-hover:rgba(255,0,0,0.5);--theme-radius:10px;--theme-time-radius:10px;--theme-radius-big:20px;--border-minus:calc(var(--border-width) * -1);--bg-border-minus:calc(var(--player-bg-border-width) * -1)}html:not(.style-scope),:not(.style-scope),html:not(.style-scope){--yt-spec-brand-background-primary:var(--top-bar-and-search-background)!important;--yt-spec-brand-background-solid:var(--bg-color)!important;--yt-spec-general-background-a:var(--bg-color)!important;--yt-spec-call-to-action:var(--theme)!important;--yt-spec-badge-chip-background:var(--playlist-bg)!important;--yt-spec-text-primary:var(--text-color)!important;--yt-spec-text-secondary:var(--nd-text-color)!important;--yt-spec-brand-button-background:var(--theme)!important;--yt-spec-static-brand-red:var(--theme)!important;--yt-spec-brand-icon-inactive:var(--theme)!important}#tooltip.tp-yt-paper-tooltip{background-color:var(--bg-color)!important}body::-webkit-scrollbar,.playlist-items.ytd-playlist-panel-renderer::-webkit-scrollbar,#guide-inner-content.ytd-app:hover::-webkit-scrollbar{width:11px!important}.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title{display:block!important;background-color:var(--hover-time-background)!important}ytd-live-chat-frame{transition:all .2s cubic-bezier(0,1,1,1)!important}.ytp-ce-expanding-overlay-background,.ytp-ce-playlist-count{background:var(--things-end-on-video)!important}.sbdd_b,#scrim,tp-yt-iron-overlay-backdrop{background:var(--top-bar-and-search-background)!important}ytd-thumbnail-overlay-hover-text-renderer{background-color:var(--top-bar-and-search-background)!important}.sbfl_b,.sbsb_a,#container.style-scope.ytd-masthead{background:transparent!important}.sbsb_d,#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,.ytp-menuitem:not([aria-disabled=true]):hover{background:var(--search-background-hover)!important;transition:all .2s cubic-bezier(0.1,0.7,1,1)!important}.gsfs,.ytp-ce-channel-metadata,.ytp-cards-teaser .ytp-cards-teaser-text,.ytp-panel-menu,.ytp-ce-website-title,.ytp-ce-merchandise-title{color:var(--text-color)!important}#player,ytd-multi-page-menu-renderer{border-radius:var(--theme-radius-big)!important}a.thumbnail > .ytcd-basic-item-large-image,ytcp-thumbnail-with-title,ytd-playlist-thumbnail,ytd-thumbnail,#thumbnail,.thumbnail-container.ytd-notification-renderer,.sbdd_b,.ytp-ce-video,.ytp-ce-playlist,[aria-live="polite"],.ytp-tooltip-bg,.ytp-tooltip-text.ytp-tooltip-text-no-title,.branding-img.iv-click-target,.branding-context-container-inner,ytd-thumbnail-overlay-bottom-panel-renderer,.ytp-progress-list,.ytp-play-progress.ytp-swatch-background-color,.ytp-load-progress,.ytp-hover-progress.ytp-hover-progress-light,.ytp-gradient-bottom,.style-scope.ytd-subscribe-button-renderer,#container.ytd-playlist-panel-renderer,.header.ytd-playlist-panel-renderer,ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer,ytd-live-chat-frame,.ytp-ce-playlist-count,.ytp-ce-expanding-overlay-background,.ytp-popup.ytp-settings-menu,.ytp-sb-subscribe,.ytp-sb-unsubscribe,.ytp-iv-drawer-open .iv-drawer,.iv-card,.iv-card a.iv-click-target,.ytp-cards-teaser-box,.miniplayer.ytd-miniplayer,.ytp-popup,.badge.ytd-badge-supported-renderer,.ytp-ce-website .ytp-ce-expanding-image,.ytp-ce-merchandise .ytp-ce-expanding-image,.ytp-flyout-cta .ytp-flyout-cta-body,#ytp-ad-image,.ytp-ad-preview-container,.ytp-ad-message-container,#guide-content,.sbsb_d,#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,#masthead,#search-icon-legacy,.ytp-ad-skip-button.ytp-button,.ytp-flyout-cta .ytp-flyout-cta-icon,#banner > img,#icon > img,#action,.ytp-cards-teaser,.ytp-ce-video-duration,.ytp-show-tiles .ytp-videowall-still,.ytp-videowall-still-info-content,.ytp-videowall-still-listlabel-mix.ytp-videowall-still-listlabel,.style-scope.ytd-popup-container,.style-scope.ytd-miniplayer,#action-companion-ad-info-button.ytd-action-companion-ad-renderer,.ytp-flyout-cta .ytp-flyout-cta-action-button,.ytp-autonav-endscreen-upnext-thumbnail,.ytp-autonav-endscreen-upnext-button,ytd-playlist-panel-video-renderer,tp-yt-paper-item.ytd-menu-service-item-renderer,ytd-menu-service-item-renderer[use-icons],.ytp-ad-overlay-image,.ytp-ad-button-icon,.ytp-ad-overlay-close-button,.ytp-ad-text-overlay,.ytp-ad-button-icon,.ytp-ad-button-icon,.html5-video-player .caption-visual-line .ytp-caption-segment:last-child,#media-container.ytd-display-ad-renderer,ytd-display-ad-renderer[layout=display-ad-layout-top-landscape-image] #media-badge.ytd-display-ad-renderer,#chips-wrapper.ytd-feed-filter-chip-bar-renderer,ytd-mini-guide-entry-renderer{border-radius:var(--theme-radius)!important}a.thumbnail > .ytcd-basic-item-large-image,ytcp-thumbnail-with-title,ytd-playlist-thumbnail,ytd-thumbnail,#thumbnail,.thumbnail-container.ytd-notification-renderer,#avatar,#author-thumbnail.ytd-comment-simplebox-renderer,.style-scope.ytd-comment-renderer.no-transition,#player,.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title,#container.ytd-playlist-panel-renderer,ytd-live-chat-frame,ytd-thumbnail-overlay-side-panel-renderer,ytd-thumbnail-overlay-bottom-panel-renderer,.ytp-gradient-bottom,.ytp-popup.ytp-settings-menu,.ytp-iv-drawer-open .iv-drawer,.ytp-cards-teaser-box,.miniplayer.ytd-miniplayer,.ytp-flyout-cta .ytp-flyout-cta-body,#ytp-ad-image,.ytp-ad-preview-container,.ytp-ad-message-container,#guide-content,.ytp-ad-skip-button.ytp-button,#banner > img,#icon > img,#action,.ytp-show-tiles .ytp-videowall-still,yt-confirm-dialog-renderer[dialog][dialog][dialog],.ytp-ce-element.ytp-ce-element-show,#contentWrapper.tp-yt-iron-dropdown > *{border-collapse:separate!important;overflow:hidden!important;box-shadow:var(--border-minus) 0 var(--border-color),0 var(--border-width) var(--border-color),var(--border-width) 0 var(--border-color),0 var(--border-minus) var(--border-color)!important}.ytp-gradient-bottom,.ytp-popup.ytp-settings-menu,.ytp-tooltip-bg{box-shadow:var(--player-bg-border-width) 0 var(--border-color),0 var(--bg-border-minus) var(--border-color),var(--bg-border-minus) 0 var(--border-color),0 var(--player-bg-border-width) var(--border-color)!important}#text.ytd-channel-name,yt-button-renderer.yt-formatted-string.yt-button-renderer,paper-ripple,a.yt-simple-endpoint.yt-formatted-string,.style-scope.ytd-menu-renderer.force-icon-button.style-default-active,.badge-style-type-live-now.ytd-badge-supported-renderer,.badge-style-type-starting-soon.ytd-badge-supported-renderer{border-color:var(--theme)!important;color:var(--theme)!important}paper-ripple,.ytp-swatch-color,a.ytp-ce-link,yt-icon.ytd-compact-link-renderer,yt-icon.ytd-toggle-theme-compact-link-renderer{border-radius:var(--theme-radius)!important;color:var(--theme)!important}.ytp-swatch-background-color,.ytp-settings-button.ytp-hd-quality-badge:after,.ytp-chrome-controls .ytp-button[aria-pressed]:after,.ytp-sb-subscribe,a.ytp-sb-subscribe{background-color:var(--theme)!important}ytd-thumbnail-overlay-time-status-renderer,ytd-thumbnail-overlay-side-panel-renderer,ytd-thumbnail-overlay-toggle-button-renderer,.iv-branding-active .branding-context-container-inner,.ytp-ce-video-duration{border-radius:var(--theme-time-radius)!important;background-color:var(--hover-time-background)!important}a.yt-simple-endpoint.yt-formatted-string::selection,span::selection,yt-formatted-string::selection,.ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox,.ytp-volume-slider-handle,.ytp-volume-slider-handle:before{background:var(--theme)!important}#container.ytd-searchbox,.yt-ui-ellipsis,.ytp-tooltip.ytp-preview:not(.ytp-text-detail),#contentContainer,.ytp-videowall-still-info-duration{background-color:transparent!important;border-color:transparent!important}ytd-playlist-thumbnail,ytd-thumbnail,ytd-compact-playlist-renderer,ytd-compact-video-renderer,ytd-compact-radio-renderer,ytd-compact-playlist-renderer>div>div>div>a,ytd-compact-video-renderer>div>div>div>a,ytd-compact-radio-renderer>div>div>div>a,ytd-thumbnail.ytd-rich-grid-media,ytd-thumbnail.ytd-rich-grid-media>a,#button.ytd-menu-renderer.yt-icon.ytd-menu-renderer{transition:all .2s cubic-bezier(0.1,0.5,1,1)!important}ytd-thumbnail-overlay-toggle-button-renderer{background-color:transparent}ytd-compact-playlist-renderer:hover>div>ytd-playlist-thumbnail,ytd-compact-video-renderer:hover>div>ytd-thumbnail,ytd-compact-radio-renderer:hover>div>ytd-thumbnail{box-shadow:var(--border-minus) 0 var(--border-hover-color),0 var(--border-width) var(--border-hover-color),var(--border-width) 0 var(--border-hover-color),0 var(--border-minus) var(--border-hover-color)!important}ytd-thumbnail.ytd-rich-grid-media:hover{margin-block-start:-15px!important;margin-block-end:15px!important;box-shadow:var(--border-minus) 0 var(--border-hover-color),0 var(--border-width) var(--border-hover-color),var(--border-width) 0 var(--border-hover-color),0 var(--border-minus) var(--border-hover-color)!important}ytd-thumbnail.ytd-rich-grid-media:active{box-shadow:var(--border-minus) 0 var(--border-click-color),0 var(--border-width) var(--border-click-color),var(--border-width) 0 var(--border-click-color),0 var(--border-minus) var(--border-click-color)!important}ytd-compact-playlist-renderer:hover,ytd-compact-video-renderer:hover,ytd-compact-radio-renderer:hover{margin-inline-start:-15px!important}ytd-compact-playlist-renderer:hover>div>div>div>a,ytd-compact-video-renderer:hover>div>div>div>a,ytd-compact-radio-renderer:hover>div>div>div>a{margin-inline-end:15px!important}ytd-compact-playlist-renderer:active>div>ytd-playlist-thumbnail,ytd-compact-video-renderer:active>div>ytd-thumbnail,ytd-compact-radio-renderer:active>div>ytd-thumbnail{box-shadow:var(--border-minus) 0 var(--border-click-color),0 var(--border-width) var(--border-click-color),var(--border-width) 0 var(--border-click-color),0 var(--border-minus) var(--border-click-color)!important}.ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]):hover > svg > path,ytd-topbar-logo-renderer > a > div > yt-icon > svg > g > g > path{fill:var(--theme)!important}.ytp-chrome-top,.ytp-chrome-bottom,.ytp-gradient-bottom,.ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]) > svg > path{transition:all .2s cubic-bezier(0,1,1,1)!important}.ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-top,.ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-bottom{display:block!important}.ytp-gradient-bottom{height:30px!important;background-image:none!important}.ytp-popup.ytp-settings-menu,.ytp-gradient-bottom,.ytp-iv-drawer-open .iv-drawer,.ytp-cards-teaser-box,.ytp-popup,.ytp-bezel{background-color:var(--in-player-bg-color)!important}.ytp-gradient-top[aria-hidden=true],.ytp-gradient-bottom[aria-hidden=true],.ytp-autohide .ytp-gradient-top,.ytp-autohide .ytp-gradient-bottom,.ytp-autohide .ytp-playlist-menu-button,.ytp-autohide .ytp-back-button,.ytp-autohide .ytp-title-channel,.ytp-autohide .ytp-title,.ytp-autohide .ytp-chrome-top .ytp-watch-later-button,.ytp-autohide .ytp-chrome-top .ytp-share-button,.ytp-autohide .ytp-chrome-top .ytp-copylink-button,.ytp-autohide:not(.ytp-cards-teaser-shown) .ytp-cards-button,.ytp-autohide .ytp-overflow-button,.ytp-autohide .ytp-chrome-bottom,.ytp-chrome-top[aria-hidden=true],.ytp-chrome-bottom[aria-hidden=true]{margin-block-start:50px!important;margin-block-end:-50px!important;transition:all .1s cubic-bezier(0.1,0.5,1,0)!important}`]))
                    SetidxTo("PRESET(SUPER LOW PC) (CSS) Potato machine (less blur)", JSON.stringify(["VDOBGT", "false", "EnaCUSCSST", 'true', "CUSTOM", `:root{--blur-amount:10px;--theme:red;--playlist-bg:rgba(255,0,0,0.1);--text-color:#FFF;--nd-text-color:#7D7D7D;--border-width:1px;--player-bg-border-width:1px;--border-color:rgba(0,0,0,0);--border-hover-color:red;--border-click-color:#0FF;--bg-color:#000;--in-player-bg-color:rgba(0,0,0,0.5);--top-bar-and-search-background:rgba(0,0,0,0.507);--things-end-on-video:rgba(66,66,66,0.507);--hover-time-background:rgba(0,0,0,0.425);--search-background-hover:rgba(255,0,0,0.5);--theme-radius:10px;--theme-time-radius:10px;--theme-radius-big:20px;--border-minus:calc(var(--border-width) * -1);--bg-border-minus:calc(var(--player-bg-border-width) * -1)}html:not(.style-scope),:not(.style-scope),html:not(.style-scope){--yt-spec-brand-background-primary:var(--top-bar-and-search-background)!important;--yt-spec-brand-background-solid:var(--bg-color)!important;--yt-spec-general-background-a:var(--bg-color)!important;--yt-spec-call-to-action:var(--theme)!important;--yt-spec-badge-chip-background:var(--playlist-bg)!important;--yt-spec-text-primary:var(--text-color)!important;--yt-spec-text-secondary:var(--nd-text-color)!important;--yt-spec-brand-button-background:var(--theme)!important;--yt-spec-static-brand-red:var(--theme)!important;--yt-spec-brand-icon-inactive:var(--theme)!important}#tooltip.tp-yt-paper-tooltip{background-color:var(--bg-color)!important}body::-webkit-scrollbar,.playlist-items.ytd-playlist-panel-renderer::-webkit-scrollbar,#guide-inner-content.ytd-app:hover::-webkit-scrollbar{width:11px!important}.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title{display:block!important;background-color:var(--hover-time-background)!important}ytd-live-chat-frame{transition:all .2s cubic-bezier(0,1,1,1)!important}.sbdd_b,#container.style-scope.ytd-masthead,ytd-multi-page-menu-renderer,.ytp-gradient-bottom,.ytp-popup.ytp-settings-menu,#chips-wrapper.ytd-feed-filter-chip-bar-renderer,.ytp-iv-drawer-open .iv-drawer,#card.ytd-miniplayer,ytd-miniplayer,.ytp-bezel,.ytp-caption-segment,.ytp-bezel-text{backdrop-filter:blur(var(--blur-amount))!important}.ytp-ce-expanding-overlay-background,.ytp-ce-playlist-count{background:var(--things-end-on-video)!important}.sbdd_b,#scrim,tp-yt-iron-overlay-backdrop{background:var(--top-bar-and-search-background)!important}ytd-thumbnail-overlay-hover-text-renderer{background-color:var(--top-bar-and-search-background)!important}.sbfl_b,.sbsb_a,#container.style-scope.ytd-masthead{background:transparent!important}.sbsb_d,#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,.ytp-menuitem:not([aria-disabled=true]):hover{background:var(--search-background-hover)!important;transition:all .2s cubic-bezier(0.1,0.7,1,1)!important}.gsfs,.ytp-ce-channel-metadata,.ytp-cards-teaser .ytp-cards-teaser-text,.ytp-panel-menu,.ytp-ce-website-title,.ytp-ce-merchandise-title{color:var(--text-color)!important}#player,ytd-multi-page-menu-renderer{border-radius:var(--theme-radius-big)!important}a.thumbnail > .ytcd-basic-item-large-image,ytcp-thumbnail-with-title,ytd-playlist-thumbnail,ytd-thumbnail,#thumbnail,.thumbnail-container.ytd-notification-renderer,.sbdd_b,.ytp-ce-video,.ytp-ce-playlist,[aria-live="polite"],.ytp-tooltip-bg,.ytp-tooltip-text.ytp-tooltip-text-no-title,.branding-img.iv-click-target,.branding-context-container-inner,ytd-thumbnail-overlay-bottom-panel-renderer,.ytp-progress-list,.ytp-play-progress.ytp-swatch-background-color,.ytp-load-progress,.ytp-hover-progress.ytp-hover-progress-light,.ytp-gradient-bottom,.style-scope.ytd-subscribe-button-renderer,#container.ytd-playlist-panel-renderer,.header.ytd-playlist-panel-renderer,ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer,ytd-live-chat-frame,.ytp-ce-playlist-count,.ytp-ce-expanding-overlay-background,.ytp-popup.ytp-settings-menu,.ytp-sb-subscribe,.ytp-sb-unsubscribe,.ytp-iv-drawer-open .iv-drawer,.iv-card,.iv-card a.iv-click-target,.ytp-cards-teaser-box,.miniplayer.ytd-miniplayer,.ytp-popup,.badge.ytd-badge-supported-renderer,.ytp-ce-website .ytp-ce-expanding-image,.ytp-ce-merchandise .ytp-ce-expanding-image,.ytp-flyout-cta .ytp-flyout-cta-body,#ytp-ad-image,.ytp-ad-preview-container,.ytp-ad-message-container,#guide-content,.sbsb_d,#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,#masthead,#search-icon-legacy,.ytp-ad-skip-button.ytp-button,.ytp-flyout-cta .ytp-flyout-cta-icon,#banner > img,#icon > img,#action,.ytp-cards-teaser,.ytp-ce-video-duration,.ytp-show-tiles .ytp-videowall-still,.ytp-videowall-still-info-content,.ytp-videowall-still-listlabel-mix.ytp-videowall-still-listlabel,.style-scope.ytd-popup-container,.style-scope.ytd-miniplayer,#action-companion-ad-info-button.ytd-action-companion-ad-renderer,.ytp-flyout-cta .ytp-flyout-cta-action-button,.ytp-autonav-endscreen-upnext-thumbnail,.ytp-autonav-endscreen-upnext-button,ytd-playlist-panel-video-renderer,tp-yt-paper-item.ytd-menu-service-item-renderer,ytd-menu-service-item-renderer[use-icons],.ytp-ad-overlay-image,.ytp-ad-button-icon,.ytp-ad-overlay-close-button,.ytp-ad-text-overlay,.ytp-ad-button-icon,.ytp-ad-button-icon,.html5-video-player .caption-visual-line .ytp-caption-segment:last-child,#media-container.ytd-display-ad-renderer,ytd-display-ad-renderer[layout=display-ad-layout-top-landscape-image] #media-badge.ytd-display-ad-renderer,#chips-wrapper.ytd-feed-filter-chip-bar-renderer,ytd-mini-guide-entry-renderer{border-radius:var(--theme-radius)!important}a.thumbnail > .ytcd-basic-item-large-image,ytcp-thumbnail-with-title,ytd-playlist-thumbnail,ytd-thumbnail,#thumbnail,.thumbnail-container.ytd-notification-renderer,#avatar,#author-thumbnail.ytd-comment-simplebox-renderer,.style-scope.ytd-comment-renderer.no-transition,#player,.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text-no-title,#container.ytd-playlist-panel-renderer,ytd-live-chat-frame,ytd-thumbnail-overlay-side-panel-renderer,ytd-thumbnail-overlay-bottom-panel-renderer,.ytp-gradient-bottom,.ytp-popup.ytp-settings-menu,.ytp-iv-drawer-open .iv-drawer,.ytp-cards-teaser-box,.miniplayer.ytd-miniplayer,.ytp-flyout-cta .ytp-flyout-cta-body,#ytp-ad-image,.ytp-ad-preview-container,.ytp-ad-message-container,#guide-content,.ytp-ad-skip-button.ytp-button,#banner > img,#icon > img,#action,.ytp-show-tiles .ytp-videowall-still,yt-confirm-dialog-renderer[dialog][dialog][dialog],.ytp-ce-element.ytp-ce-element-show,#contentWrapper.tp-yt-iron-dropdown > *{border-collapse:separate!important;overflow:hidden!important;box-shadow:var(--border-minus) 0 var(--border-color),0 var(--border-width) var(--border-color),var(--border-width) 0 var(--border-color),0 var(--border-minus) var(--border-color)!important}.ytp-gradient-bottom,.ytp-popup.ytp-settings-menu,.ytp-tooltip-bg{box-shadow:var(--player-bg-border-width) 0 var(--border-color),0 var(--bg-border-minus) var(--border-color),var(--bg-border-minus) 0 var(--border-color),0 var(--player-bg-border-width) var(--border-color)!important}#text.ytd-channel-name,yt-button-renderer.yt-formatted-string.yt-button-renderer,paper-ripple,a.yt-simple-endpoint.yt-formatted-string,.style-scope.ytd-menu-renderer.force-icon-button.style-default-active,.badge-style-type-live-now.ytd-badge-supported-renderer,.badge-style-type-starting-soon.ytd-badge-supported-renderer{border-color:var(--theme)!important;color:var(--theme)!important}paper-ripple,.ytp-swatch-color,a.ytp-ce-link,yt-icon.ytd-compact-link-renderer,yt-icon.ytd-toggle-theme-compact-link-renderer{border-radius:var(--theme-radius)!important;color:var(--theme)!important}.ytp-swatch-background-color,.ytp-settings-button.ytp-hd-quality-badge:after,.ytp-chrome-controls .ytp-button[aria-pressed]:after,.ytp-sb-subscribe,a.ytp-sb-subscribe{background-color:var(--theme)!important}ytd-thumbnail-overlay-time-status-renderer,ytd-thumbnail-overlay-side-panel-renderer,ytd-thumbnail-overlay-toggle-button-renderer,.iv-branding-active .branding-context-container-inner,.ytp-ce-video-duration{border-radius:var(--theme-time-radius)!important;background-color:var(--hover-time-background)!important}a.yt-simple-endpoint.yt-formatted-string::selection,span::selection,yt-formatted-string::selection,.ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox,.ytp-volume-slider-handle,.ytp-volume-slider-handle:before{background:var(--theme)!important}#container.ytd-searchbox,.yt-ui-ellipsis,.ytp-tooltip.ytp-preview:not(.ytp-text-detail),#contentContainer,.ytp-videowall-still-info-duration{background-color:transparent!important;border-color:transparent!important}ytd-playlist-thumbnail,ytd-thumbnail,ytd-compact-playlist-renderer,ytd-compact-video-renderer,ytd-compact-radio-renderer,ytd-compact-playlist-renderer>div>div>div>a,ytd-compact-video-renderer>div>div>div>a,ytd-compact-radio-renderer>div>div>div>a,ytd-thumbnail.ytd-rich-grid-media,ytd-thumbnail.ytd-rich-grid-media>a,#button.ytd-menu-renderer.yt-icon.ytd-menu-renderer{transition:all .2s cubic-bezier(0.1,0.5,1,1)!important}ytd-thumbnail-overlay-toggle-button-renderer{background-color:transparent}ytd-compact-playlist-renderer:hover>div>ytd-playlist-thumbnail,ytd-compact-video-renderer:hover>div>ytd-thumbnail,ytd-compact-radio-renderer:hover>div>ytd-thumbnail{box-shadow:var(--border-minus) 0 var(--border-hover-color),0 var(--border-width) var(--border-hover-color),var(--border-width) 0 var(--border-hover-color),0 var(--border-minus) var(--border-hover-color)!important}ytd-thumbnail.ytd-rich-grid-media:hover{margin-block-start:-15px!important;margin-block-end:15px!important;box-shadow:var(--border-minus) 0 var(--border-hover-color),0 var(--border-width) var(--border-hover-color),var(--border-width) 0 var(--border-hover-color),0 var(--border-minus) var(--border-hover-color)!important}ytd-thumbnail.ytd-rich-grid-media:active{box-shadow:var(--border-minus) 0 var(--border-click-color),0 var(--border-width) var(--border-click-color),var(--border-width) 0 var(--border-click-color),0 var(--border-minus) var(--border-click-color)!important}ytd-compact-playlist-renderer:hover,ytd-compact-video-renderer:hover,ytd-compact-radio-renderer:hover{margin-inline-start:-15px!important}ytd-compact-playlist-renderer:hover>div>div>div>a,ytd-compact-video-renderer:hover>div>div>div>a,ytd-compact-radio-renderer:hover>div>div>div>a{margin-inline-end:15px!important}ytd-compact-playlist-renderer:active>div>ytd-playlist-thumbnail,ytd-compact-video-renderer:active>div>ytd-thumbnail,ytd-compact-radio-renderer:active>div>ytd-thumbnail{box-shadow:var(--border-minus) 0 var(--border-click-color),0 var(--border-width) var(--border-click-color),var(--border-width) 0 var(--border-click-color),0 var(--border-minus) var(--border-click-color)!important}.ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]):hover > svg > path,ytd-topbar-logo-renderer > a > div > yt-icon > svg > g > g > path{fill:var(--theme)!important}.ytp-chrome-top,.ytp-chrome-bottom,.ytp-gradient-bottom,.ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]) > svg > path{transition:all .2s cubic-bezier(0,1,1,1)!important}.ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-top,.ytp-autohide:not(.ytp-autohide-active) .ytp-gradient-bottom{display:block!important}.ytp-gradient-bottom{height:30px!important;background-image:none!important}.ytp-popup.ytp-settings-menu,.ytp-gradient-bottom,.ytp-iv-drawer-open .iv-drawer,.ytp-cards-teaser-box,.ytp-popup,.ytp-bezel{background-color:var(--in-player-bg-color)!important}.ytp-gradient-top[aria-hidden=true],.ytp-gradient-bottom[aria-hidden=true],.ytp-autohide .ytp-gradient-top,.ytp-autohide .ytp-gradient-bottom,.ytp-autohide .ytp-playlist-menu-button,.ytp-autohide .ytp-back-button,.ytp-autohide .ytp-title-channel,.ytp-autohide .ytp-title,.ytp-autohide .ytp-chrome-top .ytp-watch-later-button,.ytp-autohide .ytp-chrome-top .ytp-share-button,.ytp-autohide .ytp-chrome-top .ytp-copylink-button,.ytp-autohide:not(.ytp-cards-teaser-shown) .ytp-cards-button,.ytp-autohide .ytp-overflow-button,.ytp-autohide .ytp-chrome-bottom,.ytp-chrome-top[aria-hidden=true],.ytp-chrome-bottom[aria-hidden=true]{margin-block-start:50px!important;margin-block-end:-50px!important;transition:all .1s cubic-bezier(0.1,0.5,1,0)!important}`]))
                    SetidxTo("PRESETPink-Black", JSON.stringify(["SubtitleC", "#ff94f6", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "NdTextO", "100", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ffffff", "CUSTOM", "", "TextC", "#ffffff", "CenterMediaT", "true", "SubtitleO", "100", "IMGS", "100", "ThemeC", "#ff94f6", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "Edge", "10", "TIMETEXTC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeBGC", "#000000", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "HBTO", "100", "PlayerOutT", "true", "ThemeFortO", "100", "Border", "1", "OutShaC", "#ff94f6", "ThumbHoverT", "Slide", "ThemeThrO", "20", "NdTextC", "#c4c4c4", "CapOutT", "false", "PlaylisthoverO", "50", "ThemeO", "100", "ThemehoverC", "#ff94f6", "ThumbHoverColorC", "#ff94f6", "ThemeFortC", "#ff94f6", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "10", "SubOutT", "false", "BlurWhatT", "all", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "TopOutT", "true", "ThemeThrC", "#ff94f6", "PlaylisthoverC", "#ff94f6", "TimeLoadedO", "50", "CenterTimeT", "true", "IMGY", "50", "BlurAm", "5", "PlayerEdge", "20", "Time-LineBGC", "#ffffff", "ThemeSndC", "#000000", "BGO", "70", "EnaCUSCSST", "false", "BlurSubT", "true", "CapBGO", "50", "OutShaO", "50", "VDOTEXTO", "100", "MediaBGO", "50", "TimeBGO", "50", "CenterMedia", "true", "VBGT", "true", "TextO", "100", "BGC", "#000000", "TimeH", "18", "Time-LineBGO", "20", "Zoom", "1.075", "SyncLogoT", "true", "ScWidth", "11", "BGIMG", ""]))
                    SetidxTo("PRESET(Low PC) Purple", JSON.stringify(["SubtitleC", "#da8aff", "RepeatT", "false", "TimeEdge", "10", "EndBGO", "50", "CenterUDT", "true", "ThemeSndO", "50", "MediaBlurT", "true", "ThumbClickC", "#ff0000", "TextC", "#ffffff", "HBTO", "100", "SubtitleO", "100", "IMGS", "100", "ThemeFortC", "#c494ff", "CenterMediaT", "true", "ThemeC", "#bf70ff", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "NVDOC", "1", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeAniT", "true", "TimeLoadedC", "#ffffff", "TimeOutT", "true", "HBTC", "#ffffff", "PlayerOutT", "true", "VDOSYT", "true", "ThemeThrO", "20", "Border", "1", "OutShaC", "#cd70ff", "ThumbHoverT", "Slide", "Edge", "10", "Zoom", "1.075", "NdTextC", "#c4c4c4", "ScrollT", "false", "CapOutT", "false", "CapBGO", "80", "BlurWhatT", "main", "ThemehoverC", "#dc5cff", "TIMETEXTC", "#ffffff", "CenterMedia", "true", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "0", "TimeBGC", "#000000", "SubOutT", "false", "NVDOT", "2", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "NVDOB", "50", "NdTextO", "100", "ThemeFortO", "100", "ThemeThrC", "#b061ff", "PlaylisthoverC", "#d666ff", "TimeLoadedO", "50", "CenterUDFT", "true", "CenterTimeT", "true", "IMGY", "15", "BlurAm", "5", "PlayerEdge", "20", "ThemeSndC", "#000000", "BGO", "70", "VDOBGT", "false", "EnaCUSCSST", "false", "BlurSubT", "true", "CUSTOM", "", "OutShaO", "0", "VDOTEXTO", "100", "MediaBGO", "50", "NVDOBGT", "0.4", "ThemeO", "100", "TimeBGO", "50", "VBGT", "true", "TextO", "100", "LoadVDOT", "false", "BGC", "#000000", "TimeH", "18", "Time-LineBGO", "20", "Time-LineBGC", "#ffffff", "TopOutT", "true", "SyncLogoT", "true", "PlaylisthoverO", "50", "ScWidth", "0", "ThumbHoverColorC", "#ff00dd", "BGIMG", ""]))
                    SetidxTo("PRESETI'm Using :D", JSON.stringify(["CUSTOM", "", "RepeatT", "false", "LeftBar", "true", "EndBGO", "50", "SubtitleC", "#ffffff", "CenterUDT", "true", "ThemeSndO", "50", "MediaBlurT", "false", "ThumbClickC", "#ff0000", "TextC", "#ffffff", "HBTO", "100", "SubtitleO", "100", "IMGS", "100", "ThemeFortC", "#c494ff", "CenterMediaT", "true", "ThemeC", "#bf70ff", "FlipT", "false", "BottomGT", "false", "subShaBlur", "2", "IMGX", "50", "NVDOC", "1", "TimeLoadedC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeAniT", "true", "TimeEdge", "10", "TimeOutT", "true", "HBTC", "#ffffff", "PlayerOutT", "true", "VDOSYT", "true", "ThemeThrO", "20", "Border", "1", "OutShaC", "#cd70ff", "ThumbHoverT", "Slide", "Edge", "10", "Zoom", "1.075", "NdTextC", "#c4c4c4", "ScrollT", "true", "subShaWidth", "0", "CapOutT", "false", "CapBGO", "0", "BlurWhatT", "none", "PtranT", "true", "NewSub", "true", "ThemehoverC", "#dc5cff", "TIMETEXTC", "#ffffff", "CenterMedia", "true", "subSpace", "1", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "0", "TimeBGC", "#000000", "SubOutT", "false", "NVDOT", "2", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "NewSubT", "true", "STUPIDME", "true", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "700", "NVDOB", "50", "NdTextO", "100", "ThemeFortO", "100", "ThemeThrC", "#b061ff", "PlaylisthoverC", "#d666ff", "TimeLoadedO", "50", "CenterUDFT", "true", "CenterTimeT", "true", "IMGY", "0", "BlurAm", "5", "PlayerEdge", "20", "ThemeSndC", "#000000", "BGO", "70", "VDOBGT", "true", "EnaCUSCSST", "false", "transitionT", "true", "BlurSubT", "false", "OutShaO", "0", "VDOTEXTO", "100", "MediaBGO", "0", "NVDOBGT", "0.4", "ThemeO", "100", "TimeBGO", "50", "VBGT", "true", "TextO", "100", "LoadVDOT", "false", "BGC", "#000000", "TimeH", "18", "LeftBarT", "true", "subWidth", "700", "Time-LineBGO", "20", "Time-LineBGC", "#ffffff", "TopOutT", "true", "SyncLogoT", "true", "PlaylisthoverO", "50", "ScWidth", "0", "ThumbHoverColorC", "#ff00dd", "BGIMG", "https://i.ibb.co/m02hLkh/1658222393728.jpg"]))
                    SetidxTo("PRESET(Low-end PC) Cyan", JSON.stringify(["SubtitleC", "#8adcff", "RepeatT", "false", "LeftBar", "true", "EndBGO", "50", "CenterUDT", "true", "ThemeSndO", "50", "MediaBlurT", "false", "ThumbClickC", "#ff0000", "TextC", "#ffffff", "HBTO", "100", "SubtitleO", "100", "IMGS", "100", "ThemeFortC", "#94fff3", "CenterMediaT", "true", "ThemeC", "#70cfff", "FlipT", "false", "BottomGT", "true", "transitionT", "true", "IMGX", "50", "NVDOC", "1", "TimeLoadedC", "#ffffff", "VDOTEXTC", "#ffffff", "MediaBGC", "#000000", "TimeAniT", "true", "TimeEdge", "10", "TimeOutT", "true", "HBTC", "#ffffff", "PlayerOutT", "true", "VDOSYT", "true", "ThemeThrO", "20", "Border", "1", "OutShaC", "#cd70ff", "ThumbHoverT", "Slide", "Edge", "10", "Zoom", "1.075", "NdTextC", "#c4c4c4", "ScrollT", "false", "CapOutT", "false", "CapBGO", "80", "BlurWhatT", "none", "ThemehoverC", "#5cd6ff", "TIMETEXTC", "#ffffff", "CenterMedia", "true", "EndBGC", "#000000", "HoverBorder", "1", "CapBGC", "#000000", "BlurBGAM", "0", "TimeBGC", "#000000", "SubOutT", "false", "NVDOT", "2", "ThumbHoverColorO", "100", "PlayerBorder", "1", "TIMETEXTO", "100", "OutOrShaT", "Out", "ThumbClickO", "100", "ThemehoverO", "50", "MediaH", "24", "NVDOB", "50", "NdTextO", "100", "ThemeFortO", "100", "ThemeThrC", "#61fcff", "PlaylisthoverC", "#66d9ff", "TimeLoadedO", "50", "CenterUDFT", "true", "CenterTimeT", "true", "IMGY", "15", "BlurAm", "5", "PlayerEdge", "20", "ThemeSndC", "#000000", "BGO", "70", "VDOBGT", "false", "EnaCUSCSST", "false", "BlurSubT", "false", "CUSTOM", "", "OutShaO", "0", "VDOTEXTO", "100", "MediaBGO", "50", "NVDOBGT", "0.4", "ThemeO", "100", "TimeBGO", "50", "VBGT", "true", "TextO", "100", "LoadVDOT", "false", "BGC", "#000000", "TimeH", "18", "LeftBarT", "true", "Time-LineBGO", "20", "Time-LineBGC", "#ffffff", "TopOutT", "true", "SyncLogoT", "true", "PlaylisthoverO", "50", "ScWidth", "0", "ThumbHoverColorC", "#009dff", "BGIMG", ""]))

                    update()
                    PRESET()
                })
                localStorage["SHOWPRESET"] = "STOP"

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
                    get.onsuccess = function () {

                        if (get.result != Ver) {
                            ShowUpdated()
                        }

                    }

                })
            }

            var YTAPP

            if (document.getElementById('BGFRAME') == null) {
                BGFRAME = document.createElement('body')
                BGFRAME.id = "BGFRAME"
                YTAPP = document.getElementsByTagName('ytd-app')
                YTAPP[0].appendChild(BGFRAME)
            }

            Can = true
            Set.addEventListener('click', clickSetting);









            if (localStorage['NewVDOanimaT'] == 'true') {
                thisStyle = document.createElement('style')
                thisStyle.textContent = `
                .ytp-bezel,.ytp-bezel-text-wrapper{
                    display:none !important;
                }`

                document.head.append(thisStyle)

                vdpar = FindVideo().parentNode

                volpanel = document.createElement('p')

                volpanel.style = `top: -50px;
                background: #0000008c;
                width: 100px;
                height: 50px;
                opacity:0;
                position: inherit;
                margin: auto;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                backdrop-filter: blur(10px);
                font-weight: 600;
                transition: all 0.5s ease;
                box-shadow: 0px 0px 10px white;`

                volpanel.setAttribute('round', '')

                vdpar.append(volpanel)

                FindVideo().addEventListener('volumechange', function () {
                    UpdateVol()
                })
            }























            if (localStorage["VisualT"] == 'true') {
                window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

                setTimeout(() => {
                    var ctx = new AudioContext();
                    var analyser = ctx.createAnalyser();
                    var audioSrc = ctx.createMediaElementSource(v);
                    // we have to connect the MediaElementSource with the analyser 
                    audioSrc.connect(analyser);
                    console.log(audioSrc)
                    analyser.connect(ctx.destination);
                    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
                    analyser.fftSize = 1024;

                    // we're ready to receive some data!
                    canvas3 = document.createElement('canvas')

                    canvas3.style = `position: fixed;
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

                    YTAPP[0].insertBefore(canvas3, YTAPP.firstChild)

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
































            if (localStorage['ConUnderVDOT'] == 'true') {
                vdobottom = document.getElementsByClassName('ytp-chrome-bottom')[0]

                if (vdobottom.parentNode.id != "player") {
                    vdobottom.style.setProperty('margin-block-top', '20px')
                    vdobottom.style.setProperty('position', 'relative')
                    vdobottom.style.setProperty('overflow', 'hidden')

                    vdoPar = vdobottom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

                    vdoPar.style.setProperty('transition', 'all 0.5s')

                    vdoPar.addEventListener('mouseover', function () {
                        vdoPar.style.setProperty('background', 'rgba(0,0,0,0.5)')
                        vdobottom.style.setProperty('margin-top', '20px')
                        vdobottom.style.setProperty('height', '48px')
                        vdobottom.style.setProperty('margin-bottom', '0px')
                    })

                    vdoPar.addEventListener('mouseout', function () {
                        vdoPar.style.setProperty('background', 'transparent')
                        vdobottom.style.setProperty('margin-top', '0px')
                        vdobottom.style.setProperty('height', '0px')
                        vdobottom.style.setProperty('margin-bottom', '68px')
                    })

                    vdoPar.append(vdobottom)
                }
            }

        }
    }, 1000);
}

SettoEnd()

SetNull()

function styleloop() {
    if (document.head == null) {
        setTimeout(() => {
            styleloop()
        }, 10);
    } else {
        document.head.appendChild(style)
    }
}

styleloop()


//---------------------------------------------------------------------------

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

    Cloning,
    YTAPP,
    BGFRAME

function SetCanvas() {
    getbound = FindVideo().getBoundingClientRect()

    context = canvas.getContext('2d')
    cw = Math.floor(canvas.clientWidth)
    ch = Math.floor(canvas.clientHeight)

    canvas.style.setProperty("width", getbound.width + "px")
    canvas.style.setProperty("height", getbound.height + "px")

    canvas.style.setProperty("margin-top", getbound.top + window.scrollY + "px")
    canvas.style.setProperty("margin-left", getbound.left + window.scrollX + "px")

    console.log(getbound.top + window.scrollY, getbound.left + window.scrollX)

    //-------------------------------------------------

    context2 = canvas2.getContext('2d')
    cw2 = getbound.width
    ch2 = getbound.height

    canvas2.style.setProperty("width", getbound.width + "px")
    canvas2.style.setProperty("height", getbound.height + "px")
    canvas2.style.setProperty("left", FindVideo().style.getPropertyValue("left"))

    //-------------------------------------------------

    requestAnimationFrame(function () {
        if (canvas.width != getbound.width) {
            canvas.width = getbound.width
            canvas.height = getbound.height

            canvas2.width = getbound.width
            canvas2.height = getbound.height
        }
    })
}

function DetectPlay() {
    console.log("PLAY")
    SetCanvas()
    FindVideo().requestVideoFrameCallback(drawpic)
}

function SetBGTran(Status) {
    if (YTAPP == null) {
        YTAPP = document.getElementsByTagName('ytd-app')[0]
    }
    if (Status == true) {
        YTAPP.style = `background: transparent;
        width: 100%;`
    } else {
        YTAPP.style = `background:var(--bg-color);
        width: 100%;`
    }
}

function CheckVDO() {
    VDOPARCLASS = FindVideo().parentNode.parentNode.className

    pg = document.getElementById("page-manager")

    if (VDOPARCLASS.search("ytp-fullscreen") == -1) {
        pg.style = ``
    } else {
        pg.style = `margin-top:0px;`
    }

    if (

        VDOPARCLASS.search('ytp-small-mode') == -1
        && VDOPARCLASS.search("ytp-fullscreen") == -1
        && (VDOPARCLASS.search("unstarted-mode") == -1 || VDOPARCLASS.search("playing-mode") > 0)

    ) {
        if (Cloning == false) {
            CreateCanvas()
        }
    } else {
        if (Cloning == true) {
            RemoveCanvas()
        }
    }
}

function CheckVDOSTATUS() {
    setTimeout(() => {
        console.log("CheckStatus")
        YTAPP = document.getElementsByTagName('ytd-app')[0]
        BGFRAME = document.getElementById("BGFRAME")
        if (FindVideo() == null || YTAPP == null || BGFRAME == null) {
            setTimeout(() => {
                CheckVDOSTATUS()
            }, 100);
        } else {
            console.log(FindVideo())
            VDOChangeEvent.observe(FindVideo(), { attributes: true })
            CheckVDO()
        }
    }, 1);
}


BlackMode = false

let drawing = 0

function drawpic() {
    drawing++
    console.log(drawing)
    FindVideo()
    if (v.paused || v.ended || Cloning == false || drawing > 1) {
        drawing--
        console.log("CancelDraw")
    } else {
        console.log("draw")

        Scale = 1
        context.drawImage(v, (cw * (1 - Scale) / 2), (ch * (1 - Scale) / 2), cw * Scale, ch * Scale);
        // Scale = 0.9
        // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);
        // Scale = 0.8
        // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);
        // Scale = 0.7
        // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);
        // Scale = 0.6
        // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);
        // Scale = 0.55
        // context.drawImage(v, (cw*(1-Scale)/2), (ch*(1-Scale)/2), cw*Scale, ch*Scale);


        if (BlackMode == true) {
            context2.drawImage(v, 0, 0, cw2, ch2);
            frame = context2.getImageData(0, 0, cw, ch)
            l = frame.data.length / 4
            for (let i = 0; i < l; i++) {
                frame.data[i * 4 + 3] = (frame.data[i * 4 + 0] * 10 +
                    frame.data[i * 4 + 1] * 10 +
                    frame.data[i * 4 + 2] * 10) / 10
            }
            context2.putImageData(frame, 0, 0)
        }

        drawing--
        v.requestVideoFrameCallback(drawpic)
    }
}

function callback(mutationsList, observer) {
    console.log("CHANGE")
    CheckVDOSTATUS()
    if (!FindVideo().paused) {
        SetCanvas()
    }
}

VDOChangeEvent = new MutationObserver(callback)

let CanvasSpawned = false

function CreateCanvas() {
    CanvasSpawned = true
    drawing = 0
    console.log("CreateCanvas")

    Cloning = true
    canvas = document.createElement('canvas');
    NotOverFlow = document.createElement('div')
    YTAPP.append(NotOverFlow)
    NotOverFlow.append(canvas)
    NotOverFlow.style = `width: 100%;
            height: 100%;
            top: 0px;
            position: absolute;
            object-position: center;
            overflow: hidden;
            z-index: -1;
            }`
    canvas.id = "NewtubeBlurBG"
    canvas.style = `
            width: 1280px;
        }`

    canvas2 = document.createElement('canvas');
    FindVideo().parentNode.append(canvas2)
    canvas2.style = `position: absolute;`

    v.addEventListener('play', DetectPlay, false)

    v.pause();

    try {
        FindVideo().play()
    } catch (e) {

    }

    SetBGTran(true)
    BGFRAME.style.setProperty("opacity", "0")

    if (BlackMode == true) {
        FindVideo().style.setProperty("opacity", "0")
    }
}

function RemoveCanvas() {
    console.log("Remove")
    Cloning = false

    if (CanvasSpawned == true) {
        NotOverFlow.remove()
        canvas2.remove()

        SetBGTran(false)
        BGFRAME.style.setProperty("opacity", "1")

        FindVideo()
        console.log(v)
        v.style.setProperty("opacity", "1")
        v.removeEventListener('play', DetectPlay, false)

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


function EnableBGBlur() {
    console.log("EnaVDOBG")
    Cloning = false

    if (document.getElementById("NewtubeBlurBG") == null) {
        CheckVDOSTATUS()
    }

    window.addEventListener('yt-page-data-updated', CheckVDOSTATUS)
}

function DisableBGBlur() {
    console.log("DisaVDOBG")
    RemoveCanvas()

    window.removeEventListener('yt-page-data-updated', CheckVDOSTATUS)
    VDOChangeEvent.disconnect()
}