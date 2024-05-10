var PreloadBackgroundImage = new Image
var UpdateUI

PreloadBackgroundImage.onload = function () {
     UpdateBackgroundImage()
     if (UpdateUI) {
          UpdateUI()
     }
}

async function OnChangeBackground() {
     if (await Load('EnableButton') == false) {
          if (BackgroundImage) {
               BackgroundImage.remove()
               BackgroundImage = null
               PreloadBackgroundImage.src = ""
          }
          return
     }

     if (!BackgroundImage) {
          CreateBackgroundImage()
     }

     if (PreloadBackgroundImage.src == await Load("BGIMG")) return

     PreloadBackgroundImage.src = await Load("BGIMG")
     UpdateBackgroundImage()
}

var BackgroundImage

async function CreateBackgroundImage() {
     BackgroundImage = document.createElement("div")
     BackgroundImage.id = "NewtubeBackground"
     BackgroundImage.style = `
     width:100%;
     height:100%;
     top:0;
     position:fixed;
     z-index: -10000;
     transition: opacity 1s;`

     var Body = await GetDocumentBody()
     //console.log(Body)
     Body.append(BackgroundImage)
}

async function UpdateBackgroundImage() {
     BackgroundImage.style.backgroundImage = `url("${PreloadBackgroundImage.src}")`

     OnChangeBackground_Size()
}

CreateSettingUI["PreviewBackgroundImage"] = async function () {
     var Frame = await CreateFrame()

     var Element = document.createElement("canvas")
     Element.id = "BGIMG"

     Element.style = `
     border-radius: 10px;
     outline: 3px solid #ffffff54;
     box-shadow: 0px 0px 20px #00000094;
     `
     Frame.append(Element)

     var NoImageText = document.createElement("div")
     NoImageText.innerText = "No Image (￣﹃￣)"
     NoImageText.style = `
     width: 100%;
     height: 100%;
     position: absolute;
     color: white;
     display: flex;
     align-items: center;
     justify-content: center;
     font-size: 4em;
     `
     Frame.append(NoImageText)

     Frame.style = `
     width: 100%;
     max-width: 600px;
     max-height: 400px;
     display: flex;
     align-items: center;
     justify-content: center;
     margin-block: 20px;
     position: relative;
     `

     var ctx = Element.getContext("2d", { alpha: false })
     ctx.fillStyle = "black";
     ctx.imageSmoothingEnabled = false

     UpdateUI = async function () {
          if (PreloadBackgroundImage.width) {
               NoImageText.style.opacity = 0

               if (PreloadBackgroundImage.width > PreloadBackgroundImage.height) {
                    Element.style.width = "100%"
                    Element.style.height = ""
               } else {
                    Element.style.width = ""
                    Element.style.height = "400px"
               }

               Element.style.aspectRatio = PreloadBackgroundImage.width / PreloadBackgroundImage.height

               ctx.clearRect(0, 0, Element.width, Element.height);

               await sleep(1)

               Element.width = Element.clientWidth
               Element.height = Element.clientHeight
               ctx.drawImage(PreloadBackgroundImage,
                    0, 0, PreloadBackgroundImage.width, PreloadBackgroundImage.height,
                    0, 0, Element.clientWidth, Element.clientHeight);
          } else {
               NoImageText.style.opacity = 1

               Element.style.width = "100%"
               Element.style.height = "400px"

               ctx.clearRect(0, 0, Element.width, Element.height);
          }

     }

     UpdateUI()

     SetOnChangeSettingUI(Element.id, UpdateUI)
}

CreateSettingUI["UploadBackgroundImage"] = async function () {
     var Frame = await CreateFrame()

     Frame.style.flexDirection = "column-reverse"

     var Element = document.createElement("input")
     Element.type = "file"
     Element.accept = "image/*"
     Element.id = "BGIMG"

     Element.style = `
     border-radius: 10px;
     outline: rgba(255, 255, 255, 0.33) solid 2px;
     margin: 10px;
     width: -webkit-fill-available;
     padding: 10px;
     background: rgb(33, 33, 33);
     color: white;border-radius: 10px;
     outline: rgba(255, 255, 255, 0.33) solid 2px;
     margin: 10px;
     width: -webkit-fill-available;
     padding: 10px;
     background: rgb(33, 33, 33);
     color: white;
     `
     Frame.append(Element)

     var Label = document.createElement("div")
     Label.innerHTML = ""
     Label.style = `
     color: white;
     font-size: 14px;
     width: -webkit-fill-available;
     padding-inline: 10px;
     display: flex;
     justify-content: center;
     height: 0px;
     align-items: center;
     overflow:hidden;
     transition: all 0.5s;
     text-align: center;
     `
     Frame.append(Label)

     CreateDescription("Upload Background Image", Frame)

     UpgradeFrame(Frame)

     Element.onchange = async function (Event) {
          var File = await GetOneFileFromInput(Event)

          Label.style.height = "80px"
          Label.innerHTML = "Start Uploading! (╹ڡ╹ )"

          if (await Load("API") == true) {

               await UploadImageByAPI(File, function (NowPercent) {
                    Label.innerHTML = `Uploading : ${NowPercent}%`
               }).then(async (ImageURL) => {

                    SetSetting("BGIMG", ImageURL)

                    Label.innerHTML = "Complete! (/≧▽≦)/<br>(Please wait if image not showing!)"

                    await sleep(5000)

                    Label.style.height = "0px"

               }).catch((reason) => {
                    Label.innerHTML = reason
               })

          } else {

               CanReloadSave = false

               await ReadFileToURL(File, 10000000)
                    .then(async (result) => {

                         SetSetting("BGIMG", result)

                         Label.innerHTML = "Complete! (/≧▽≦)/<br>(Please wait if image not showing!)"

                         await sleep(5000)

                         Label.style.height = "0px"
                    }).catch((reason) => {
                         Label.innerHTML = reason
                    })

               CanReloadSave = true
               ReloadSave()
          }
     }
}

const Background_Size_StyleSheet = Create_StyleSheet()

async function OnChangeBackground_Size() {
     const Background_Bound = BackgroundImage.getBoundingClientRect()
     const Imagine_Background_Height = ((PreloadBackgroundImage.height / PreloadBackgroundImage.width) * window.innerWidth)
     const zoomValue = await Load("BackgroundS")

     if (Imagine_Background_Height < Background_Bound.height) {
          Background_Size_StyleSheet.textContent = `
          #NewtubeBackground{
               background-size: ${(Background_Bound.height / Imagine_Background_Height) * zoomValue}%;
          }`
     } else {
          Background_Size_StyleSheet.textContent = `
          #NewtubeBackground{
               background-size: ${zoomValue}%;
          }`
     }

     console.log(Background_Size_StyleSheet)
}

RunAfterLoaded.NormalYoutube.push(function () {
     OnChangeBackground()
     AddOnChangeFunction("BGIMG", OnChangeBackground)

     AddOnChangeFunction("BackgroundS", OnChangeBackground_Size)
     window.addEventListener('resize', OnChangeBackground_Size)

     AddOnChangeFunction("EnableButton", OnChangeBackground)
})