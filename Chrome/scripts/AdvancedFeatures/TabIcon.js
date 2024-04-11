async function GetFavIcons() {
     var FavIcons = document.querySelectorAll(`link[rel="shortcut icon"] , link[rel="icon"]`)
     if (FavIcons.length > 0) {
          return FavIcons
     } else {
          await sleep(100)
          return await GetFavIcons()
     }
}

async function UpdateTabIcon() {
     if (await Load("CustomIcon") && await Load("EnableButton")) {
          ImageURL = await Load("IconURL")
     } else {
          ImageURL = DefaultYouTubeLogo
     }

     if (DebugMode) {
          console.log(await GetFavIcons())
          console.log(ImageURL)
     }

     for (var ThisFavIcon of await GetFavIcons()) {
          ThisFavIcon.href = ImageURL
     }
}

RunAfterLoaded.NormalYoutube.push(function () {

     UpdateTabIcon()

     AddOnChangeFunction("CustomIcon", UpdateTabIcon)

     AddOnChangeFunction("IconURL", UpdateTabIcon)

     AddOnChangeFunction("EnableButton", UpdateTabIcon)
})