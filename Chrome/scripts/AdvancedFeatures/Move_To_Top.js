// var Move_to_top_UI

// async function Start_Move_to_top() {
//      if (Move_to_top_UI) {
//           return
//      }
//      Move_to_top_UI = document.createElement("div")
//      Move_to_top_UI.id = "Newtube_Move_To_Top"
//      var Body = await GetDocumentBody()
//      Body.append(Move_to_top_UI)
//      console.log(Body)
// }

// function Stop_Move_to_top() {
//      if (Move_to_top_UI) {
//           Move_to_top_UI.remove()
//           Move_to_top_UI = null
//      }
// }

// RunAfterLoaded.NormalYoutube.push(function () {
//      OnChangeButton(
//           "MoveToTop",
//           Start_Move_to_top,
//           Stop_Move_to_top
//      )
// })