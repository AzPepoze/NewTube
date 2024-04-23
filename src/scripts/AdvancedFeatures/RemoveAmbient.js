var RunningRemoveDefaultAmbient = false

function StartRemoveDefaultAmbient() {
     if (RunningRemoveDefaultAmbient) return
     
     RunningRemoveDefaultAmbient = true

     async function RemoveDefaultAmbient() {
          if (document.getElementById("cinematics")) {
               document.getElementById("cinematics").remove()
               RunningRemoveDefaultAmbient = false
          } else {
               await sleep(100)
               RemoveDefaultAmbient()
          }
     }

     RemoveDefaultAmbient()
}

RunAfterLoaded.NormalYoutube.push(function () {
     OnChangeButton(
          "RemoveAmbient",
          StartRemoveDefaultAmbient,
          function () { }
     )
})