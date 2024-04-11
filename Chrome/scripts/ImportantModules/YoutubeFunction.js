async function GetYoutubeApp(){
     var YTAPP = document.getElementsByTagName('ytd-app')[0] || document.getElementsByClassName("background-gradient")[0]

     if (YTAPP) {
          return YTAPP
     } else {
          await sleep(100)
          return await GetYoutubeApp()
     }
}

async function RemoveDefaultAmbient() {
     if (await Load("EnableButton") == true) {
          if (document.getElementById("cinematics")) {
               // console.log("Removed")
               document.getElementById("cinematics").remove()
          } else {
               await sleep(100)
               RemoveDefaultAmbient()
          }
     }
}