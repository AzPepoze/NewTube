var BackgroundTint

async function CreateBackgroundTint() {
     var Body = await GetDocumentBody()
     BackgroundTint = document.createElement('div')
     BackgroundTint.id = "NewtubeTint"
     Body.append(BackgroundTint)
}

async function OnChangeBackgroundTint(params) {
     if (await Load('EnableButton') == false) {
          if (BackgroundTint) {
               BackgroundTint.remove()
               BackgroundTint = null
          }

          return
     }

     if (!BackgroundTint) {
          CreateBackgroundTint()
     }
}

RunAfterLoaded.NormalYoutube.push(function () {
     OnChangeBackgroundTint()
     AddOnChangeFunction("BG", OnChangeBackgroundTint)
     AddOnChangeFunction("EnableButton", OnChangeBackgroundTint)
})