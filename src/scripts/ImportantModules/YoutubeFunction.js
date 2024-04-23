async function GetYoutubeApp() {
     var YTAPP = document.getElementsByTagName('ytd-app')[0] || document.getElementsByClassName("background-gradient")[0]

     if (YTAPP) {
          return YTAPP
     } else {
          await sleep(100)
          return await GetYoutubeApp()
     }
}