async function CreateSettingFeatures() {
     Category = null
     SubCategory = null
     RainbowCategory = false

     await CreateFeatures("Button", {
          innerHTML: "Reset Extension (Reset Save)",
          callback: function () {
               ClearSave()
               window.location.reload()
          },
     })

     Category = "☕ Buy me a coffee!"
     SubCategory = null
     RainbowCategory = true

     await CreateFeatures("Button", {
          innerHTML: "Wallet ID : AzDonate",
          border: "transparent",
          bg: "#ffffff14",
          align: "left",
          img: "https://i.ibb.co/269h23M/2020021209494988264-logo-truemoneywallet-300x300.jpg",
          CanClick: false
     })

     await CreateFeatures("Button", {
          innerHTML: "PayPal : jakkrit_portraitist@hotmail.com (My parents PayPal)",
          border: "rgb(112 192 255)",
          bg: "rgb(67 133 255 / 8%)",
          align: "left",
          img: "https://www.blognone.com/sites/default/files/styles/large/public/topics-images/paypal-big.png?itok=oCiREpSg",
          callback: function () {
               window.open("https://www.paypal.com/paypalme/jakkritportraitist");
          },
          color: "#bbe3ff"
     })

     await CreateFeatures("Button", {
          innerHTML: "streamlabs (PayPal / VISA / mastercard / AMEX / DISCOVER)",
          border: "rgb(113 255 193)",
          bg: "rgb(117 255 192 / 8%)",
          align: "left",
          img: "https://theme.zdassets.com/theme_assets/948919/d80b722da9edc37805def78a512b90c5772434a6.png",
          callback: function () {
               window.open("https://streamlabs.com/gfirstg/tip");
          },
          color: "#8fffd5"
     })

     Category = "🎉 Join my Discord 🎉"
     SubCategory = null
     RainbowCategory = false

     await CreateFeatures("Button", {
          innerHTML: "NEWTUBE",
          border: "rgb(85 96 193);",
          bg: "rgb(146 100 255 / 8%)",
          color: "#b0b3fb",
          align: "left",
          img: "https://brandlogos.net/wp-content/uploads/2021/11/discord-logo.png",
          callback: function () {
               window.open("https://discord.gg/BgxvVqap4G");
          }
     })

     //-------------------------------------------------------------------------------

     Category = "⚙️ Extention's settings"
     SubCategory = null

     await CreateFeatures("JustText", {
          innerHTML: "Version : " + Ver,
          align: "left"
     })

     await CreateFeatures("Check", {
          id: "EnableButton",
          description: "Enable",
          Default: true,
          AutoUpdate: true
     })

     await CreateFeatures("Check", {
          id: "Realtime",
          description: "Realtime Changing (lag when changing!)",
          Default: true,
     })

     await CreateFeatures("Check", {
          id: "SettingBlur",
          description: "Setting Background transparent",
          Default: true,

          enable: `
          #NEWTUBEBG{
               background: linear-gradient(-45deg, rgba(10, 10, 10, 0.8), rgba(43, 43, 43, 0.8)) !important;
          }`,

          new: true
     })

     await CreateFeatures("JustText", {
          innerHTML: `If your computer is slow. 
          You should enable "Use image upload api" button for saving your computer. (/≧▽≦)/<br><br>
          If not please disable it to save your internet. ( •̀ ω •́ )✧<br><br>
          Thanks you imgbb.com for free api image upload! ♪(´▽｀)`,
          align: "center"
     })

     await CreateFeatures("Check", {
          id: "API",
          description: "Use image upload api (imgbb.com)",
          Default: false
     })

     await CreateFeatures("Check", {
          id: "CheckStatic",
          description: "Check Static video (for Background VDO & Remove black bars)",
          Default: false
     })

     await CreateFeatures("Button", {
          innerHTML: "Github",
          border: "rgb(144 120 255)",
          bg: "rgb(170 125 255 / 11%)",
          color: "rgb(221 213 255)",
          align: "left",
          img: "https://pbs.twimg.com/profile_images/1372304699601285121/5yBS6_3F_400x400.jpg",
          callback: function () {
               window.open("https://github.com/AzPepoze/Newtube");
          }
     })

     await CreateFeatures("Button", {
          innerHTML: "❗Report bugs / Issues❗",
          border: "rgb(255 103 103)",
          bg: "rgb(255 4 4 / 12%)",
          color: "rgb(255 199 199)",
          callback: function () {
               window.open("https://github.com/AzPepoze/Newtube");
          }
     })

     //-------------------------------------------------------------------------------

     Category = "🛍️ Themes 🛍️"
     SubCategory = null

     await CreateFeatures("Button", {
          innerHTML: "✨ Select Theme ✨",
          border: "rgb(255 205 103)",
          bg: "rgb(255 202 4 / 12%)",
          color: "rgb(255 255 199)",
          callback: function () {
               ShowPreset()
          }
     })

     await CreateFeatures("Button", {
          innerHTML: "🛍️ Themes store 🛍️",
          border: "rgb(103 188 255)",
          bg: "rgb(4 46 255 / 12%)",
          color: "rgb(199 232 255)",
          callback: function () {
               SelectTheme()
          }
     })

     await CreateFeatures("Button", {
          innerHTML: "🛍️ Themes store 🛍️<br>(floating window)",
          border: "rgb(103 188 255)",
          bg: "rgb(4 46 255 / 12%)",
          color: "rgb(199 232 255)",
          callback: function () {
               SelectThemeFloat()
          }
     })

     await CreateFeatures("Button", {
          innerHTML: "✳️ Share your themes ✳️",
          border: "rgb(103 255 153)",
          bg: "rgb(4 255 94 / 12%)",
          color: "rgb(199 255 213)",
          callback: function () {
               window.open("https://github.com/AzPepoze/Newtube/discussions/6");
          }
     })

     //-------------------------------------------------------------------------------

     Category = "📜 Import / Export Style"
     SubCategory = null

     await CreateFeatures("TextArea", {
          id: "ImportExport",
          placeholder: "Paste NTubeCode here."
     })

     await CreateFeatures("Button", {
          innerHTML: "Import NTubeCode (Text)",
          callback: async function () {
               var ImportExport = await NewtubeFindElementByID("ImportExport")
               var GetText = ImportExport.value
               ImportExport.value = "Please wait... (￣﹃￣) (If it's take too long it might eror!)"

               try {
                    await LoadNTubeCodeString(GetText)

                    ImportExport.value = "Complete! (/≧▽≦)/"
                    await sleep(1000)
                    ImportExport.value = GetText
               } catch (error) {
                    ImportExport.value += `\n\nERROR : ` + error
               }

          }
     })

     await CreateFeatures("Button", {
          innerHTML: "Export NTubeCode (Text)",
          callback: async function () {
               var ImportExport = await NewtubeFindElementByID("ImportExport")
               ImportExport.value = "Please wait... (￣﹃￣)"
               var gentext = await GenNTubeCodeString()
               ImportExport.value = gentext
          }
     })

     await CreateFeatures("Button", {
          innerHTML: "Export NTubeCode to clipboard (Text)",
          callback: async function (Element) {
               Element = Element.getElementsByClassName("DES")[0]
               var OldText = Element.innerHTML
               Element.innerHTML = "Please wait... (￣﹃￣)"
               var gentext = await GenNTubeCodeString()
               CopyToClipboard(gentext)
               Element.innerHTML = "Copied! (/≧▽≦)/"
               await sleep(1000)
               Element.innerHTML = "Export NTubeCode to clipboard (Text)"
          }
     })

     await CreateFeatures("Button", {
          innerHTML: "Export Style as CSS (Text)",
          callback: async function () {
               var ImportExport = await NewtubeFindElementByID("ImportExport")
               ImportExport.value = "Please wait... (￣﹃￣)"
               ImportExport.value = Collect_Style
          }
     })

     await CreateFeatures("Button", {
          innerHTML: "Export to NPreset (File)",
          callback: async function () {
               var ImportExport = await NewtubeFindElementByID("ImportExport")
               ImportExport.value = "Exporting... ♪(´▽｀)"
               ExportFile(await GenNTubeCodeString(), 'Export.NPreset')
               ImportExport.value = "Complete! (/≧▽≦)/"
               setTimeout(() => {
                    ImportExport.value = ""
               }, 1000);
          }
     })

     //-------------------------------------------------------------------------------

     Category = "📺 Video"
     SubCategory = null

     await CreateFeatures("NumberSlide", {
          id: "PlayerEdge",
          description: "Round edges amount",
          Default: 20
     })

     await CreateFeatures("Check", {
          id: "VdoAnim",
          description: "Enable Chaning Video transition",
          Default: true,

          enable: `
          div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed) .html5-video-container{
               transition: all 1s ,background 0.1s;
               top: 0px !important
          }
         
          div.ended-mode .html5-video-container,
          div.unstarted-mode:not(.ytp-small-mode) .html5-video-container{
               transform:scale(0.5);
               opacity:0 !important;
          }
          `
     })

     await CreateFeatures("ColorPicker", {
          id: "Time-LineBG",
          description: "Time-line background color",
          Default: {
               Color: "#ffffff",
               Opacity: 20
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "TimeLoaded",
          description: "Time-line loaded color",
          Default: {
               Color: "#ffffff",
               Opacity: 50
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "EndBG",
          description: "End of video chanel hover background color",
          Default: {
               Color: "#000000",
               Opacity: 50
          }
     })


     await CreateFeatures("Check", {
          id: "CenterUD",
          description: "(Under Video) Move tittle to the center",
          Default: true,

          enable: `
          #title.ytd-watch-metadata,#container.ytd-video-primary-info-renderer {
          display: flex;
          flex-direction: column;
          align-ItemsLabel: center;
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
          }
          `
     })

     await CreateFeatures("Check", {
          id: "CenterUDF",
          description: "(Fullscreen) Move tittle to the center",
          Default: true,

          enable: `
          .ytp-big-mode .ytp-title-text {
               text-align: center;
          }
          `
     })

     await CreateFeatures("Check", {
          id: "AutoTheater",
          description: "Auto Enter Theater Mode",
          Default: false
     })

     await CreateFeatures("Check", {
          id: "FullTheater",
          description: "Enable Full Theater (In Theater Mode)",
          Default: false,

          enable: `
          #full-bleed-container:has(div.html5-video-player:not(.ytp-fullscreen)){
               height: calc(100vh - 56px) !important;
               max-height: unset !important;
          }
          `
     })

     await CreateFeatures("Check", {
          id: "AutoPIP",
          description: "Auto Pictue In Pictue mode<br>(Pls click anywhere In page after you back to page)<br>(Security problem) (I do my best T_T)",
          Default: true
     })

     await CreateFeatures("Check", {
          id: "AutoEXPIP",
          description: "Auto exit Pictue In Pictue mode",
          Default: true
     })

     await CreateFeatures("NumberSlide", {
          id: "BelowSpace",
          description: "Space at Under of video",
          Default: 0
     })

     //-------------------------------------------------------------------------------

     Category = "🎚️ Video control panel"
     SubCategory = null

     await CreateFeatures("ColorPicker", {
          id: "VDOTEXT",
          description: "Text color",
          Default: {
               Color: "#ffffff",
               Opacity: 100
          }
     })


     await CreateFeatures("ColorPicker", {
          id: "HBT",
          description: "Button hover color",
          Default: {
               Color: "#ffffff",
               Opacity: 100
          }
     })

     await CreateFeatures("Check", {
          id: "ControlUnderVDO",
          description: "Move to under of video",
          Default: true,

          enable: `
           #player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not([NewtubePlayerClassFlyout]){
                padding-bottom: var(--Media-Space);
           }
           
           div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not([NewtubePlayerClassFlyout]) .ytp-chrome-bottom{
                padding-top: 0px !important;
           }
           
           div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode) .ytp-chrome-bottom{
                overflow: visible !important;
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
           
           #player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed):not([NewtubePlayerClassFlyout]) .ytp-caption-window-container,
           #player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed):not([NewtubePlayerClassFlyout]) .ytp-player-content,
           #player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed):not([NewtubePlayerClassFlyout]) .ytp-cued-thumbnail-overlay{
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
           `,
          disable: `
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
 
           .ytp-gradietop[aria-hidden=true], .ytp-gradient-bottom[aria-hidden=true], .ytp-autohide .ytp-gradietop, .ytp-autohide .ytp-gradient-bottom,.ytp-autohide .ytp-playlist-menu-button, .ytp-autohide .ytp-back-button, .ytp-autohide .ytp-title-channel, .ytp-autohide .ytp-title, .ytp-autohide .ytp-chrome-top .ytp-watch-later-button, .ytp-autohide .ytp-chrome-top .ytp-share-button, .ytp-autohide .ytp-chrome-top .ytp-copylink-button, .ytp-autohide:not(.ytp-cards-teaser-shown) .ytp-cards-button, .ytp-autohide .ytp-overflow-button, .ytp-autohide .ytp-chrome-bottom, .ytp-chrome-top[aria-hidden=true], .ytp-chrome-bottom[aria-hidden=true]
           {
           margin-block-start: 50px !important;
           margin-block-end: -50px !important;
           transition: all .1s cubic-bezier(0.1,0.5,1,0) !important;
           }
           #player{
                overflow: hidden;
           }`
     })

     await CreateFeatures("NumberSlide", {
          id: "MediaSpace",
          description: "Under video distance",
          Default: 70
     })

     await CreateFeatures("CombinationFunc", {
          id: "SetMediaSpace",
          multi_id: [
               "ControlUnderVDO",
               "MediaSpace"
          ],
          CSSFunc: async function () {
               if (await Load("ControlUnderVDO")) {
                    return `:root{
                          --Media-Space: ${await Load("MediaSpace")}px;
                     }`
               } else {
                    return ``
               }
          }
     })

     await CreateFeatures("Check", {
          id: "AutohideBar",
          description: "Autohide (If you enabled Under VDO)",
          Default: true,

          disable: `
           div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-gradient-bottom,
           div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-chrome-bottom
           {
                margin-left:0px !important;
                opacity: 1 !important;
           }
           
           div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.unstarted-mode).ytp-autohide .ytp-gradient-bottom
           {
                width:100% !important;
           }
           `
     })

     await CreateFeatures("CombinationFunc", {
          id: "UnderVideoAutoHide",
          multi_id: [
               "ControlUnderVDO",
               "AutohideBar"
          ],
          CSSFunc: async function () {
               if (await Load("AutohideBar") && await Load("ControlUnderVDO")) {
                    return `.ytp-gradient-bottom[aria-hidden=true],
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
                           width: 0px !important;
                     }`
               } else {
                    return ``
               }
          }
     })

     await CreateFeatures("Check", {
          id: "CenterMedia",
          description: "Move to center",
          Default: true,

          enable: `
           .ytp-chrome-controls {
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
           }
           `
     })

     await CreateFeatures("ColorPicker", {
          id: "MediaBG",
          description: "Background color",
          Default: {
               Color: "#000000",
               Opacity: 50
          }
     })

     await CreateFeatures("Check", {
          id: "BottomG",
          description: "Remove default background gradient",
          Default: false,

          enable: `
           background-image: none !important;
           `
     })

     await CreateFeatures("NumberSlide", {
          id: "MediaH",
          description: "Background height",
          Default: 65
     })

     await CreateFeatures("NumberSlide", {
          id: "MediaHFull",
          description: "(Full screen) Background height",
          Default: 70
     })

     await CreateFeatures("Check", {
          id: "PlayerOut",
          description: "Enable Borders/Shadows",
          Default: false,
          AutoAddCSS: false,

          enable: `
           .ytp-gradient-bottom,
           `
     })


     await CreateFeatures("NumberSlide", {
          id: "PlayerBorder",
          description: "Borders/Shadows width",
          Default: 1
     })


     await CreateFeatures("Check", {
          id: "MediaBlur",
          description: "Blur background",
          Default: true,

          enable: `
           .ytp-gradient-bottom{
                backdrop-filter: blur(var(--blur-amount)) !important;
           }
           `
     })

     //-------------------------------------------------------------------------------

     Category = "🎆 Background Video"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "VDOBG",
          description: "Enable<br>(NOT RECOMMEND FOR LOW END PC!)",
          Default: false
     })

     await CreateFeatures("Check", {
          id: "BackgroundVDOStick",
          description: "Force Background Video Stick to Video",
          Default: false,
          new: true
     })

     await CreateFeatures("Select", {
          id: "RenderEngine",
          ItemsLabel: {
               CPU: "CPU (2D Canvas)",
               GPU: "GPU (Webgl 2)"
          },
          Default: "GPU",
          AutoAddCSS: false,
          description: "Render by CPU or GPU<br>(if your Graphic card is powerful I recommend to use GPU)"
     })

     await CreateFeatures("NumberSlide", {
          id: "CanvasQua",
          description: "Quality",
          Default: 40
     })

     await CreateFeatures("NumberSlide", {
          id: "NVDOB",
          description: "Blur amount",
          Default: 40,
          max: 150
     })

     await CreateFeatures("NumberSlide", {
          id: "VDOSmooth",
          description: "Smooth frame",
          Default: 10,
          min: 1,
          max: 20
     })

     await CreateFeatures("NumberSlide", {
          id: "NVDOC",
          description: "Contrast",
          Default: 1,
          min: 0,
          max: 4,
          step: 0.2
     })

     await CreateFeatures("NumberSlide", {
          id: "NVDOBGT",
          description: "Brightness",
          Default: 0.4,
          min: 0,
          max: 4,
          step: 0.2
     })

     await CreateFeatures("CombinationFunc", {
          id: "BackgroundVideoFilter",
          multi_id: [
               "NVDOC",
               "NVDOBGT"
          ],
          CSSFunc: async function () {
               return `
               #NewtubeBlurBG
               {
                    filter: contrast(` + await Load("NVDOC") + `) brightness(` + await Load("NVDOBGT") + `);
               }`
          }
     })

     await CreateFeatures("NumberSlide", {
          id: "NVDOT",
          description: "Size",
          Default: 2.2,
          min: 1,
          max: 4,
          step: 0.2,
          CSSFunc: async function () {
               return `
               #NewtubeCanvasWraper
               {
                    transform: scale(` + await Load("NVDOT") + `);
               }`
          }
     })

     //-------------------------------------------------------------------------------

     Category = "🔳 Remove black bars on video"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "DelBar",
          description: "Remove black bars top-bottom",
          Default: false
     })

     await CreateFeatures("Check", {
          id: "DropFrame",
          description: "Remove black bars Lazy Check (Drop frame)",
          Default: false
     })

     await CreateFeatures("NumberSlide", {
          id: "LazyAmount",
          description: "CoolDown Every ... pixel<br>(Check black bars)<br>(less for more performance also more drop frame)<br>(-1 is none)",
          Default: 50,
          min: -1,
          max: 200
     })

     await CreateFeatures("Check", {
          id: "DelBarDebug",
          description: "Remove black bars Debug",
          Default: false
     })

     //-------------------------------------------------------------------------------

     Category = "🔤 Subtitles/Captions"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "NewSub",
          description: "New Subtitles/Captions",
          Default: true,

          enable: `
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
          `
     })


     await CreateFeatures("ColorPicker", {
          id: "Subtitle",
          description: "Subtitles/Captions color",
          Default: {
               Color: "#ffffff",
               Opacity: 100
          }
     })


     await CreateFeatures("ColorPicker", {
          id: "CapBG",
          description: "Subtitles/Captions background color",
          Default: {
               Color: "#000000",
               Opacity: 0
          }
     })

     await CreateFeatures("NumberSlide", {
          id: "subWidth",
          description: "(Text) Width",
          Default: 700,
          max: 700
     })

     await CreateFeatures("NumberSlide", {
          id: "subSpace",
          description: "(Text) Space by letters",
          Default: 2
     })


     await CreateFeatures("ColorPicker", {
          id: "subShaColor",
          description: "(Shadow) Color",
          Default: {
               Color: "#000000",
               Opacity: 100
          }
     })

     await CreateFeatures("NumberSlide", {
          id: "subShaBlur",
          description: "(Shadow) Blur amount",
          Default: 2
     })

     await CreateFeatures("Check", {
          id: "BlurSub",
          description: "Blur background",
          Default: false,

          enable: `
          .caption-window.ytp-caption-window-bottom
          {
               backdrop-filter: blur(var(--blur-amount)) !important;
          }`
     })

     await CreateFeatures("Check", {
          id: "CapOut",
          description: "Enable Borders/Shadows",
          Default: false,
          AutoAddCSS: false,

          enable: `
          .caption-window.ytp-caption-window-bottom,
          `
     })

     //-------------------------------------------------------------------------------

     Category = "🔎 Topbar & Search"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "Scroll",
          description: "(Topbar) Auto transparent",
          Default: true,

          enable: `
          #masthead > #background{
               transition: background .2s;
          }
          `
     })


     await CreateFeatures("ColorPicker", {
          id: "ThemeSnd",
          description: "(Topbar) Color",
          Default: {
               Color: "#000000",
               Opacity: 50
          }
     })

     await CreateFeatures("Check", {
          id: "TopOut",
          description: "(Topbar) Enable Borders/Shadows",
          Default: true,
          AutoAddCSS: false,

          enable: `
          #masthead > #background,
          `
     })


     await CreateFeatures("ColorPicker", {
          id: "ThemeChips",
          description: "(Second topbar) Topbar color",
          Default: {
               Color: "#000000",
               Opacity: 50
          }
     })

     await CreateFeatures("Check", {
          id: "SndOut",
          description: "(Second topbar) Enable Borders/Shadows",
          Default: false,
          AutoAddCSS: false,

          enable: `
          #chips-wrapper,
          `
     })


     await CreateFeatures("Check", {
          id: "SearchAnim",
          description: "Enable Search animation",
          Default: true,

          enable: `
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
          }
          `
     })


     //-------------------------------------------------------------------------------

     Category = "📰 Thumbnail/Clip cover"
     SubCategory = null

     await CreateFeatures("NumberSlide", {
          id: "TimeEdge",
          description: "(UI in Thumbnail) Round edges amount",
          Default: 10
     })

     //      await createColor("TimeBG", "Video preview time background color")

     await CreateFeatures("ColorPicker", {
          id: "TimeBG",
          description: "Video preview time background color",
          Default: {
               Color: "#000000",
               Opacity: 50
          }
     })

     await CreateFeatures("Check", {
          id: "TimeOut",
          description: "Enable time Borders/Shadows",
          Default: true,
          AutoAddCSS: false,

          enable: `
          ytd-thumbnail-overlay-time-status-renderer,
          `
     })



     await CreateFeatures("NumberSlide", {
          id: "HoverBorder",
          description: "Hover Borders width",
          Default: 1
     })

     await CreateFeatures("ColorPicker", {
          id: "ThumbHoverColor",
          description: "Borders/Shadows on hover color",
          Default: {
               Color: "#659aff",
               Opacity: 100
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "ThumbClick",
          description: "Borders/Shadows on click color",
          Default: {
               Color: "#ffffff",
               Opacity: 100
          }
     })

     await CreateFeatures("Select", {
          id: "ThumbHover",
          ItemsLabel: {
               Slide: "Slide",
               Zoom: "Zoom",
               "Slide&Zoom": "Slide&Zoom"
          },
          ItemsCSS: {
               Slide: `
               #dismissible.ytd-rich-grid-media:hover > ytd-thumbnail
          	{   
          		margin-block-start: -15px !important;
          		margin-block-end: 15px !important;;
          	}
          
               ytmusic-player-queue > .ytmusic-player-queue {
                   padding-left: 15px;
               }
        
               ytd-compact-playlist-renderer:hover,
               ytd-compact-video-renderer:hover,
               ytd-compact-radio-renderer:hover,
               ytd-video-renderer:hover,
               ytd-playlist-renderer:hover,
               ytmusic-player-queue-item:hover
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
               
               ytd-playlist-panel-video-renderer:hover > .yt-simple-endpoint.ytd-playlist-panel-video-renderer
               {
                   margin-inline-start: 10px !important;
                   margin-inline-end: -10px !important;
               }
        
               ytd-guide-entry-renderer:hover
               {
                   margin-inline-start: -10px !important;
                   margin-inline-end: 10px !important;
               }`,

               Zoom: `
               ytd-thumbnail:hover,
               ytd-playlist-thumbnail:hover
               {   
                    transform: scale(var(--Zoom)) !important;
                    z-index: 400;
               }`,

               "Slide&Zoom": `
               #dismissible.ytd-rich-grid-media:hover > ytd-thumbnail
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
               }`
          },
          Default: "Slide",
          description: "Hover animation style"
     })

     await CreateFeatures("NumberSlide", {
          id: "Zoom",
          description: `Zoom amount (If you choose "Zoom")`,
          Default: 1.075,
          step: 0.005,
          min: 0.5,
          max: 5
     })

     await CreateFeatures("Check", {
          id: "TimeAni",
          description: "Enable hide time when hover",
          Default: true,

          enable: `
          ytd-thumbnail-overlay-time-status-renderer{
               transition:all .2s;
          }
               
          #thumbnail:hover > #overlays > ytd-thumbnail-overlay-time-status-renderer {
               margin-bottom:-20px !important;
          }
          `
     })

     await CreateFeatures("Check", {
          id: "ThumbAnim",
          description: "Enable loaded animation",
          Default: true,

          enable: `
          #dismissible:has(.yt-core-image){
          transition: all 1s ease;
          margin-top: 100px !important;
          opacity:0 !important;
          }

          #dismissible:has(.yt-core-image--loaded){
          margin-top: 0px !important;
          opacity:1 !important;
          }
          `
     })

     await CreateFeatures("Check", {
          id: "CenterTime",
          description: "Move the time position to the center",
          Default: true,

          enable: `
          ytd-thumbnail-overlay-time-status-renderer,
          ytd-thumbnail-overlay-bottom-panel-renderer
          {
          width: 100% !important;
          margin: 0px !important;
          padding: 0px !important;
          bottom: 0px;
          justify-content: center !important;
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
          }
          `
     })

     await CreateFeatures("NumberSlide", {
          id: "TimeH",
          description: "Time height",
          Default: 18
     })

     //-------------------------------------------------------------------------------

     Category = "🎇 Enhancement"
     SubCategory = null

     await CreateFeatures("NumberSlide", {
          id: "Edge",
          description: "Round edges amount (Most UI)",
          Default: 10
     })

     await CreateFeatures("Check", {
          id: "SwapRow",
          description: "Swap left-right row (In watching mode)",
          Default: false,

          enable: `
          #columns{
          display:flex !important;
          flex-direction: row-reverse !important;
          }

          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)) #secondary{
          margin-left: 0px !important;
          direction: rtl;
          }

          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)) #secondary-inner{
          direction: ltr;
          }
          `,
          disable: `
          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)) #primary{
          direction: rtl;
          }

          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)) #primary-inner{
          direction: ltr;
          }
          `
     })

     await CreateFeatures("Check", {
          id: "SrollRow",
          description: "Srollable row<br>(In normal watching mode only)<br>Flyout will not working",
          Default: true,

          enable: `
          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #secondary,
          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #primary{
          height: 92vh;
          overflow-y: scroll;
          overflow-x: visible;
          transform: translateZ(0px);
          }

          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #secondary{
          margin-left: -20px;
          padding-left: 20px;
          -webkit-mask-image: var(--NewtubeRowMask);
          }

          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #primary{
          overflow-x: hidden;
          padding-left: 10px;
          margin-left: 0px;
          -webkit-mask-image: var(--NewtubeRowMask);
          }

          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #primary-inner{
          direction: ltr;
          }

          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) ytd-app,
          html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #content.ytd-app{
          height: 100vh;
          overflow:hidden;
          }
          `
     })

     await CreateFeatures("Check", {
          id: "SrollRowFade",
          description: "Srollable row Top-Bottom Fade<br>(Medium impact)",
          Default: true,

          enable: `
          :root {
               --NewtubeRowMask : linear-gradient(to bottom, transparent, black 20px, black 95%, transparent);
          }
          `,

          new: true
     })

     await CreateFeatures("Check", {
          id: "Flyout",
          description: "Enable Flyout Video (Show video after scroll down)",
          Default: true,

          enable: `
          [NewtubePlayerContainerFlyout]{
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

          [NewtubePlayerContainerFlyout] .html5-video-player{
              padding: 0px !important;
          }
          
          [NewtubePlayerContainerFlyout] video,
          [NewtubePlayerContainerFlyout]{
              width: 400px !important;
              height: auto !important;
              max-width: unset !important;
              min-width: unset !important;
          }
          
          [NewtubePlayerContainerFlyout] .html5-video-player:not(.ytp-autohide) .ytp-chrome-bottom{
              width: 400px !important;
          }
          
          [NewtubePlayerContainerFlyout] .ytp-right-controls,
          [NewtubePlayerContainerFlyout] .ytp-progress-bar-container,
          [NewtubePlayerContainerFlyout] .ytp-chapter-container,
          [NewtubePlayerContainerFlyout] .ytp-ce-element{
              display:none !important;
          }
          
          [NewtubePlayerContainerFlyout] .ytp-chapter-hover-container{
              width:100% !important;
          }
          
          ytd-channel-name{
              z-index: 0 !important;
          }

          [NewtubePlayerContainerFlyout] .html5-video-container{
              height: fit-content !important;
          }
          
          [NewtubePlayerContainerFlyout] .ytp-iv-video-content{
              width: 100% !important;
              height: 100% !important;
          }

          [NewtubePlayerContainerFlyout] .ytp-caption-segment{
              font-size: 15px !important;
          }
          
          [NewtubePlayerContainerFlyout] video{
              transition: none !important;
              height: 100% !important;
              width: max-content !important;
          }

          [NewtubePlayerContainerFlyout] .html5-video-container{
              transition: none !important;
              height: 100% !important;
          }`
     })

     await CreateFeatures("Check", {
          id: "ChatReplay",
          description: "Auto show chat replay",
          Default: false
     })

     //-------------------------------------------------------------------------------

     Category = "🌈 Color/Theme"
     SubCategory = null

     await CreateFeatures("ColorPicker", {
          id: "Theme",
          description: "Main Theme color",
          Default: {
               Color: "#659aff",
               Opacity: 100
          },
          CSSFunc: async function () {
               return `
               :root{
                    --NewtubeTheme: ${await LoadRgba("Theme")};
               }`
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "ThemeThr",
          description: "Transparent things theme color",
          Default: {
               Color: "#659aff",
               Opacity: 20
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "ThemeFort",
          description: "Other theme color",
          Default: {
               Color: "#659aff",
               Opacity: 20
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "LeftBar",
          description: "Left sidebar color",
          Default: {
               Color: "#000000",
               Opacity: 0
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "Text",
          description: "Main text color",
          Default: {
               Color: "#ffffff",
               Opacity: 100
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "NdText",
          description: "Second text color",
          Default: {
               Color: "#c4c4c4",
               Opacity: 100
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "LinkColor",
          description: "(Link) Text color",
          Default: {
               Color: "#5797ff",
               Opacity: 100
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "TIMETEXT",
          description: "Time text color",
          Default: {
               Color: "#ffffff",
               Opacity: 100
          }
     })

     //------------------------------------------------------------------------------

     Category = "▶️ Subscribe Button"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "SPSubScribe",
          description: "Enable Separate Subscribe Button Color",
          Default: false,

          enable: `
          .ytd-subscribe-button-renderer button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled{
               background: var(--SubSc-BG) !important;
               color: var(--SubSc-Tx) !important;
          }
          `
     })

     await CreateFeatures("ColorPicker", {
          id: "SPSubScribeBG",
          description: "(Separate) Background color",
          Default: {
               Color: "#ff0000",
               Opacity: 100
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "SPSubScribeColor",
          description: "(Separate) Text color",
          Default: {
               Color: "#ffffff",
               Opacity: 100
          }
     })

     await CreateFeatures("Check", {
          id: "SubOut",
          description: "Enable Borders/Shadows",
          Default: false,
          AutoAddCSS: false,

          enable: `
          tp-yt-paper-button.ytd-subscribe-button-renderer,
          `
     })

     //-------------------------------------------------------------------------------

     Category = "💠 Top-Left Icon"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "IconFill",
          description: "Icon theme sync with Main Theme<br>Work when disable *Custom Icon Image*",
          Default: true,

          disable: `
          #logo-icon g [fill="#FF0000"]{
               fill: red !important;
          }`
     })

     await CreateFeatures("Check", {
          id: "ReplaceYT",
          description: "Enable Custom Top-Left Icon Image",
          Default: false,
          enable: `ytd-topbar-logo-renderer`
     })

     await CreateFeatures("UploadImage", {
          id: "ReplaceYTURL",
          description: "Upload Icon Image",
          MaxFileSize: 1000000
     })

     await CreateFeatures("CombinationFunc", {
          id: "TopIcon",
          multi_id: [
               "ReplaceYT",
               "ReplaceYTURL"
          ],
          CSSFunc: async function () {
               if (await Load("ReplaceYT")) {
                    return `
                    ytd-topbar-logo-renderer{
                         background-image: url("${await Load("ReplaceYTURL")}");
                    }
                    
                    ytd-topbar-logo-renderer * {
                         opacity:0;
                    }`
               } else {
                    return ``
               }
          }
     })

     await CreateFeatures("URLBox", {
          id: "ReplaceYTURL",
          description: "Icon Image URL",
          Default: "https://i.gifer.com/17xo.gif"
     })

     await CreateFeatures("PreviewImage", {
          id: "ReplaceYTURL"
     })

     await CreateFeatures("Button", {
          innerHTML: "View Image",
          callback: async function () {
               window.open(await Load("ReplaceYTURL"))
          },
     })

     await CreateFeatures("Button", {
          innerHTML: "Remove Icon Image",
          callback: function () {
               SetSetting("ReplaceYTURL", "")
          },
     })

     await CreateFeatures("NumberSlide", {
          id: "TopIconX",
          description: "Image position X",
          Default: 50,
          CSSFunc: async function () {
               return `
               ytd-topbar-logo-renderer{
                    background-position-x: ${await Load("TopIconX")}%;
               }`
          },
          new: true
     })

     await CreateFeatures("NumberSlide", {
          id: "TopIconY",
          description: "Image position Y",
          Default: 50,
          CSSFunc: async function () {
               return `
               ytd-topbar-logo-renderer{
                    background-position-y: ${await Load("TopIconY")}%;
               }`
          },
          new: true
     })

     await CreateFeatures("NumberSlide", {
          id: "YTSize",
          description: "Image Size",
          Default: 100,
          CSSFunc: async function () {
               return `
               ytd-topbar-logo-renderer{
                    background-size: ${await Load("YTSize")}%;
               }`
          },
          max: 300
     })

     await CreateFeatures("Check", {
          id: "TopIconFlip",
          description: "Enable flip image",
          Default: false,
          enable: `
          ytd-topbar-logo-renderer{
               transform: scaleX(-1);
          }`,
          new: true
     })

     await CreateFeatures("Check", {
          id: "TopIconRepeat",
          description: "Enable repeat image",
          Default: false,
          enable: `
          ytd-topbar-logo-renderer{
               background-repeat: repeat;
          }`,
          disable: `
          ytd-topbar-logo-renderer{
               background-repeat: no-repeat;
          }`,
          new: true
     })

     //-------------------------------------------------------------------------------

     Category = "🔶 Tab Icon"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "CustomIcon",
          description: "Enable Custom Tab Icon Image",
          Default: true
     })

     await CreateFeatures("UploadImage", {
          id: "IconURL",
          description: "Upload Icon Image",
          MaxFileSize: 1000000
     })

     await CreateFeatures("URLBox", {
          id: "IconURL",
          description: "Icon Image URL",
          Default: DefaultNewTubeLogo
     })

     await CreateFeatures("PreviewImage", {
          id: "IconURL"
     })

     await CreateFeatures("Button", {
          innerHTML: "View Image",
          callback: async function () {
               window.open(await Load("IconURL"))
          },
     })

     await CreateFeatures("Button", {
          innerHTML: "Reset to default NewTube Icon",
          callback: function () {
               SetSetting("IconURL", DefaultNewTubeLogo)
          },
     })

     await CreateFeatures("Button", {
          innerHTML: "Reset to default YouTube Icon",
          callback: function () {
               SetSetting("IconURL", DefaultYouTubeLogo)
          },
     })


     //-------------------------------------------------------------------------------

     Category = "🔲 Borders / Shadows"
     SubCategory = null

     await CreateFeatures("Select", {
          id: "OutOrSha",
          ItemsLabel: {
               Out: "Borders",
               Sha: "Shadows",
               None: "None"
          },
          ItemsCSS: {
               Out: JSON.stringify([`outline: solid !important;
               outline-color: var(--border-color) !important;
               outline-width:var(--border-width) !important;`,
                    `outline: solid !important;
               outline-color: var(--border-color) !important;
               outline-width:var(--player-bg-border-width) !important;`]),
               Sha: JSON.stringify([`box-shadow: 0px 0px var(--border-width) var(--border-color) !important;`, `box-shadow: var(--player-bg-border-width) var(--player-bg-border-width) 10px var(--border-color) !important;`]),
               None: JSON.stringify([`outline-color: transparent !important;`, `outline-color: transparent !important;`])
          },
          Default: "Sha",
          AutoAddCSS: false,
          AutoUpdate: true,
          description: "Borders or Shadows"
     })

     await CreateFeatures("NumberSlide", {
          id: "Border",
          description: "Borders width/Shadows size",
          Default: 8,
          max: 50
     })

     await CreateFeatures("ColorPicker", {
          id: "OutSha",
          description: "Borders/Shadows Color",
          Default: {
               Color: "#099DFF",
               Opacity: 50
          }
     })

     //-------------------------------------------------------------------------------

     Category = "🎴 Background"
     SubCategory = null

     await CreateFeatures("ColorPicker", {
          id: "BG",
          description: "Background/tint color",
          Default: {
               Color: "#000000",
               Opacity: 70
          }
     })

     await CreateFeatures("NumberSlide", {
          id: "BlurBGAM",
          description: "Blur amount",
          Default: 10,
          CSSFunc: async function () {
               return `
               #NewtubeBackground{
                    filter: blur(${await Load("BlurBGAM")}px);
               }`
          },
          max: 50
     })

     await CreateFeatures("UploadBackgroundImage")

     await CreateFeatures("URLBox", {
          id: "BGIMG",
          description: "Background Image URL",
          Default: "https://i.ibb.co/4NWBbGH/FOABv-CHXMAER9-H3.jpg"
     })

     await CreateFeatures("PreviewBackgroundImage")

     await CreateFeatures("Button", {
          innerHTML: "View Image",
          callback: async function () {
               window.open(await Load("BGIMG"))
          },
     })

     await CreateFeatures("Button", {
          innerHTML: "Remove Background Image",
          callback: function () {
               SetSetting("BGIMG", "")
          },
     })

     await CreateFeatures("NumberSlide", {
          id: "BackgroundX",
          description: "Image position X",
          Default: 50,
          CSSFunc: async function () {
               return `
               #NewtubeBackground{
                    background-position-x: ${await Load("BackgroundX")}%;
               }`
          }
     })

     await CreateFeatures("NumberSlide", {
          id: "BackgroundY",
          description: "Image position Y",
          Default: 50,
          CSSFunc: async function () {
               return `
               #NewtubeBackground{
                    background-position-y: ${await Load("BackgroundY")}%;
               }`
          }
     })

     await CreateFeatures("NumberSlide", {
          id: "BackgroundS",
          description: "Image Size",
          Default: 100,
          CSSFunc: async function () {
               return `
               #NewtubeBackground{
                    background-size: ${await Load("BackgroundS")}%;
               }`
          },
          max: 300
     })

     await CreateFeatures("Check", {
          id: "Flip",
          description: "Enable flip image",
          Default: false,
          enable: `
          #NewtubeBackground{
               transform: scaleX(-1);
          }`
     })

     await CreateFeatures("Check", {
          id: "Repeat",
          description: "Enable repeat image",
          Default: false,
          enable: `
          #NewtubeBackground{
               background-repeat: repeat;
          }`,
          disable: `
          #NewtubeBackground{
               background-repeat: no-repeat;
          }`
     })


     //-------------------------------------------------------------------------------

     Category = "🪟 Blur"
     SubCategory = null

     await CreateFeatures("NumberSlide", {
          id: "BlurAm",
          description: "Blur amount",
          Default: 5
     })

     await CreateFeatures("Select", {
          id: "BlurWhat",
          ItemsLabel: {
               all: "All (Lag!)",
               main: "Main-things",
               justsetting: "Only Setting",
               none: "None"
          },
          ItemsCSS: {
               all: `
               .sbdd_b,
               #masthead > #background,
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
               }

               #NEWTUBEBG{
                    backdrop-filter: blur(100px);
               }
               `,
               main: `
               .sbdd_b,
               #masthead > #background,
               ytd-multi-page-menu-renderer,
               .ytp-popup.ytp-settings-menu,
               #chips-wrapper.ytd-feed-filter-chip-bar-renderer,
               .iv-drawer,
               #card.ytd-miniplayer,
               ytd-miniplayer
               {
                    backdrop-filter: blur(var(--blur-amount)) !important;
               }
               
               #NEWTUBEBG{
                    backdrop-filter: blur(100px);
               }`,
               justsetting: `
               * {
               -webkit-backdrop-filter: none !important;
               backdrop-filter: none !important;
               }
               
               #NEWTUBEBG{
                    backdrop-filter: blur(100px) !important;
               }`,
               none: `
               * {
               -webkit-backdrop-filter: none !important;
               backdrop-filter: none !important;
               }`
          },
          Default: "none",
          description: "Things to blur",
          new: true
     })

     //-------------------------------------------------------------------------------

     Category = "🚶 Animations"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "Ptran",
          description: "Enable Page transition",
          Default: true,

          enable: `
          ytd-page-manager:has(div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode)){
               transition: all 0.5s;
          }
          
          html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) ytd-watch-flexy #secondary,
          html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) ytd-watch-flexy #below,
          html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) ytd-watch-flexy div.ytp-gradient-bottom,
          html:not(:has(div.ytp-offline-slate)) div.html5-video-player.unstarted-mode:not(.ytp-small-mode) ytd-watch-flexy div.ytp-chrome-bottom
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
     })

     await CreateFeatures("CombinationFunc", {
          id: "PageSlideAnimationInNormalMode",
          multi_id: [
               "Ptran",
               "SwapRow"
          ],
          CSSFunc: async function () {
               if (await Load("Ptran") == true) {
                    if (await Load("SwapRow") == true) {
                         return `
                         html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) ytd-watch-flexy #secondary{
                             transform: translate(-100px,0);
                         }`
                    } else {
                         return `
                         html:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) ytd-watch-flexy #secondary{
                             transform: translate(100px,0);
                         }`
                    }
               } else {
                    return ``
               }
          }
     })

     //-------------------------------------------------------------------------------

     Category = "🖱️ Hover/Click color"
     SubCategory = null

     await CreateFeatures("ColorPicker", {
          id: "Themehover",
          description: "Most hover background color",
          Default: {
               Color: "#659aff",
               Opacity: 50
          }
     })

     await CreateFeatures("ColorPicker", {
          id: "Playlisthover",
          description: "(Playlist) hover background color",
          Default: {
               Color: "#659aff",
               Opacity: 50
          }
     })

     //-------------------------------------------------------------------------------

     Category = "⚛️ Other settings"
     SubCategory = null

     await CreateFeatures("NumberSlide", {
          id: "ScWidth",
          description: "(Scrollbar) width (Legacy)",
          Default: 11
     })

     await CreateFeatures("Select", {
          id: "ScWidthNew",
          ItemsLabel: {
               auto: "auto",
               thin: "thin",
               none: "none"
          },
          Default: "thin",
          AutoAddCSS: false,
          description: "(Scrollbar) width"
     })

     await CreateFeatures("Check", {
          id: "VBG",
          description: "(Video) remove background solid color (Theater mode)",
          Default: true,
          AutoAddCSS: false,

          enable: `
          #full-bleed-container:has(div.html5-video-player:not(.ytp-fullscreen)),
          `
     })

     await CreateFeatures("Check", {
          id: "HideYourChannel",
          description: `(Home page) Hide "Your channel"`,
          Default: false,

          enable: `
          #section-items > ytd-guide-entry-renderer:nth-child(1){
               display:none!important;
          }
          `
     })

     await CreateFeatures("Check", {
          id: "HideYourVID",
          description: `(Home page) Hide "Your videos"`,
          Default: false,

          enable: `
          #section-items > ytd-guide-entry-renderer:nth-child(3){
               display:none!important;
          }
          `
     })

     //      RenderPreImg(await GetLoad("BGIMG"))


     //-------------------------------------------------------------------------------

     Category = "🔠 Fonts"
     SubCategory = null

     await CreateFeatures("FontManager")

     Category = "⏫ Additional CSS"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "EnaADDCSS",
          description: "Enable Additional CSS",
          Default: false
     })

     await CreateFeatures("TextArea", {
          id: "ADDCUSTOM",
          placeholder: "Write/Paste CSS here. ♪(´▽｀)",
          SetOnChange: true,
          Default: ``
     })

     Category = "📝 Custom CSS"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "EnaCUSCSS",
          description: "Enable Custom CSS",
          Default: false
     })

     await CreateFeatures("TextArea", {
          id: "CUSTOM",
          placeholder: "Write/Paste CSS here. ♪(´▽｀)",
          SetOnChange: true,
          Default: ``
     })

     Category = "🌟 Additional JS"
     SubCategory = null

     await CreateFeatures("Check", {
          id: "JSAuto",
          description: "Enable Auto run JavaScript",
          Default: false,
          AskWhenEnable: `⚠️*WARNING*⚠️\nYou are trying to enable Auto run JS\n\nPlease keep in mind that if somethings wrong by that code.\nYou can reset it by reinstall the extension only!\n(I'll make unload JS shortcut later)\n\nAre you sure?`
     })

     await CreateFeatures("TextArea", {
          id: "ADDScript",
          placeholder: "Write/Paste JS here. ♪(´▽｀)",
          SetOnChange: true,
          Default: ``
     })

     await CreateFeatures("Button", {
          innerHTML: "Run Script",
          callback: function () {
               chrome.runtime.sendMessage("RunScript")
          },
     })

     //-------------------------------------------------------------------------------

     Category = "🌠 Beta features!"
     SubCategory = null

     //      createframe(`<label class="DES">Maybe need to reload website</label>`)

     await CreateFeatures("Check", {
          id: "Visual",
          description: "Audio Visualizer",
          Default: false
     })

     await CreateFeatures("Check", {
          id: "NewVDOanima",
          description: "New video animation (Volume up/down,Pause,Play)",
          Default: true
     })

     if (DebugMode) {
          console.log(NewtubeAllSaveKey)
          console.log(SettingFuction)
     }

     CreateSeparateSettingCSS()
}