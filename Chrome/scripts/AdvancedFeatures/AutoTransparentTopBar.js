var TopBar

async function GetTopBarBackground() {
     TopBar = document.querySelector("#masthead > #background")

     if (TopBar) {
          return TopBar
     } else {
          await sleep(100)
          return await GetTopBarBackground()
     }
}

var TransparentBackground

async function EnableTransparentBackground() {
     if (!TransparentBackground) {
          TransparentBackground = true
          TopBar.style = `
          backdrop-filter: none !important;
          box-shadow: 0px 0px transparent !important;
          outline: transparent !important;
          background:transparent;`
     }
}

async function DisableTransparentBackground() {
     if (TransparentBackground) {
          TransparentBackground = false
          TopBar.style = ``
     }
}

async function TransparentTopBarOnScroll(ScrollTop) {
     await GetTopBarBackground()

     if (ScrollTop == 0) {
          EnableTransparentBackground()
     } else {
          DisableTransparentBackground()
     }
}

var RunWhenScrollTransparentTopBar

async function StartTransparentTopbar() {
     if (!RunWhenScrollTransparentTopBar) {
          RunWhenScrollTransparentTopBar = RunWhenScroll(window, TransparentTopBarOnScroll)
     }
}

async function StopTransparentTopbar() {
     if (RunWhenScrollTransparentTopBar) {
          RunWhenScrollTransparentTopBar.Stop()
          RunWhenScrollTransparentTopBar = null
     }
     DisableTransparentBackground()
}

RunAfterLoaded.NormalYoutube.push(function () {
     OnChangeButton(
          "Scroll",
          StartTransparentTopbar,
          StopTransparentTopbar
     )
})