function sleep(delay) { return new Promise((resolve) => setTimeout(resolve, delay)) }

var Newtube = window.Newtube

Newtube = {}

Newtube.ExtensionPath = document.currentScript.getAttribute("ExtensionPath")
Newtube.ExtensionID = Newtube.ExtensionPath.slice(19, -1)

Newtube.RequestSave = async function (Name) {
     return new Promise((resolve) => {
          var UniqueID = Date.now()

          document.dispatchEvent(new CustomEvent(Newtube.ExtensionID + "_Save_Request", {
               detail: {
                    UniqueID: UniqueID,
                    Name: Name
               }
          }));

          document.addEventListener(Newtube.ExtensionID + "_Save_Recive", function (e) {
               var Data = e.detail
               if (Data.UniqueID == UniqueID) {
                    resolve(Data.Value)
               }
          }, { once: true })
     })
}

Newtube.OnSaveChangeWithAutoRun = async function (Name, callback) {
     callback(await Newtube.RequestSave(Name), true)

     document.addEventListener(Newtube.ExtensionID + "_Save_Change_" + Name, function (e) {
          callback(e.detail)
     })
}

Newtube.AskForReload = function () {
     if (confirm(`NEWTUBE : This feature is need to reload website\n\nAre you want to reload website?`)) window.location.reload()
}

Newtube.GetDocumentHead = async function () {
     let DocumentHead = document.head

     if (DocumentHead) {
          return DocumentHead
     } else {
          await sleep(100)
          return await GetDocumentBody()
     }
}

Newtube.ScriptHolder = document.createElement('fieldset')

Newtube.RunScript = async function (params) {
     return new Promise(async function (res, rej) {
          var s = document.createElement('script');

          s.onload = function () {
               res()
          }

          s.id = "Newtube_Script"
          s.src = Newtube.ExtensionPath + "scripts/" +params
          Newtube.ScriptHolder.appendChild(s);
     })
}

Newtube.RunSciptList = async function () {
     var Head = await Newtube.GetDocumentHead()
     Head.append(Newtube.ScriptHolder)

     await Newtube.RunScript("RunAfterLoaded/EnableNewYoutubeLayout.js")
     await Newtube.RunScript("RunAfterLoaded/VsCode.js")
}

Newtube.RunSciptList()
//-------------------------------------------

//console.log(window.Newtube)