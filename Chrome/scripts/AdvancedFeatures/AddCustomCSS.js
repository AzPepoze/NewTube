var AddCSS_Style

async function CreateAddCSS_Style() {
     AddCSS_Style = document.createElement("style")
     AddCSS_Style.id = "NewtubeAddCSS"
     var Head = await GetDocumentHead()
     Head.append(AddCSS_Style)
}

async function UpdateAddCSS() {
     if (!AddCSS_Style) return
     AddCSS_Style.textContent = await Load("ADDCUSTOM")
}

async function StartAddCSS() {
     if (!AddCSS_Style) {
          CreateAddCSS_Style()
     }

     UpdateAddCSS()
}

async function StopAddCSS() {
     if (AddCSS_Style) {
          AddCSS_Style.remove()
          AddCSS_Style = null
     }
}

RunAfterLoaded.NormalYoutube.push(function () {
     
     AddOnChangeFunction("ADDCUSTOM", UpdateAddCSS)

     OnChangeButton(
          "EnaADDCSS",
          StartAddCSS,
          StopAddCSS
     )
})