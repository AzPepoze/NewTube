var BackgroundIframe = document.createElement("iframe")

async function StartYoutubeAsBackground(){
     var VideoID = "rPLh5QAedUE"
     BackgroundIframe.src = `https://www.youtube.com/embed/${VideoID}?version=3&cc_load_policy=3&iv_load_policy=3&autoplay=1&controls=0&rel=0&showinfo=0&loop=1&color=white&playlist=${VideoID}` + "&mute=1"

     BackgroundIframe.style = `
     width:100%;
     height:100%;`
     
     var Body = await GetDocumentBody()
     Body.append(BackgroundIframe)

     BackgroundIframe.onload = function(){
          console.log(BackgroundIframe)
     }
}

//RunAfterLoaded.NormalYoutube.push(StartYoutubeAsBackground)