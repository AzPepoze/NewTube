RunAfterLoaded.AllYoutubeMode.push(
    async function () { 
        let volchange = 0

        async function UpdateVol() {
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

        if (await Load('NewVDOanima') == true) {
            async function ThisFunc() {
                await FindVideo()
                if (v) {
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
             overflow:visible;
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
             overflow: visible;
         }
         
         .ytp-doubletap-seek-info-container{
             text-align: center;
             left: 0px !important;
             top: 0px !important;
             foweight: 700;
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

                    await FindVideo()
                    vdpar = v.parentElement

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
             foweight: 600;
             transition: all 0.5s ease;
             box-shadow: 0px 0px 10px white;
             left: calc(50% - 50px);`

                    volpanel.setAttribute('round', '')

                    vdpar.append(volpanel)

                    v.addEventListener('volumechange', async function () {
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
    }
)