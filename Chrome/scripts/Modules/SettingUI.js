var SettingUI = []

function AddSettingUI(Type, args) {
     SettingUI.push({
          type: Type,
          args: args
     })
}

async function ShouldRealtime() {
     return await Load("Realtime")
}

function SetCategory(args) {
     Category = args.Category
     SubCategory = args.SubCategory
     RainbowCategory = args.RainbowCategory
}

async function SetOnChangeSettingUI(id, callback) {
     CheckOnChangeID(id)
     CheckOnChangeSettingUI(id)
     OnSettingChange[id]["SettingUI"].push(callback)
}

var CreateSettingUI = {}

CreateSettingUI["Check"] = async function (args) {
     var Frame = await CreateFrame()

     var Element = document.createElement("input")
     Element.className = "CheckBox"
     Element.type = "checkbox"

     Element.id = args.id

     async function UpdateUI() {
          Element.checked = await Load(args.id)
     }

     UpdateUI()

     SetOnChangeSettingUI(args.id, UpdateUI)

     Element.addEventListener("change", function () {
          if (Element.checked == true && args.AskWhenEnable) {
               if (!confirm(args.AskWhenEnable)) return
          }
          SetSetting(args.id, Element.checked)
     })

     Frame.append(Element)

     CreateDescription(args.description, Frame)

     UpgradeFrame(Frame)

}

CreateSettingUI["Button"] = async function (args) {
     var Frame = await CreateFrame()

     Frame.style.marginBlock = "6px"
     Frame.style.paddingBlock = ""

     var Element = document.createElement("button")

     if (args.CanClick == null || args.CanClick == true) {
          Element = document.createElement("button")
          Element.className = "NewtubeHoverButton"
     } else {
          Element = document.createElement("div")
     }

     Element.style = `
     width: 100%;
     padding: 10px;
     border-radius: 20px;
     border: 1px solid;
     border-color: ${args.border};
     background: ${args.bg};
     display: flex;
     align-items: center;
     flex-direction: row;
     font-size: 15px;
     
     justify-content: ${args.align};
     `

     if (args.img) {
          var IMG = document.createElement("img")
          Element.append(IMG)
          IMG.src = args.img
          IMG.style = `
          height: 50px;
          margin-right: 10px;
          border-radius: 10px;`
     }

     if (args.innerHTML) {
          var DES = document.createElement("span")
          DES.className = "DES"
          DES.innerHTML = args.innerHTML
          DES.style = `
          color: ${args.color};
          margin:0px;
          `
          Element.append(DES)
     }

     if (args.callback) {
          Element.addEventListener("click", function () {
               args.callback(Element)
          })
     }

     Frame.style.background = "radial-gradient(ellipse at top, #ffffff1a, transparent)"
     Frame.style.borderRadius = "20px"

     Frame.append(Element)
}

CreateSettingUI["JustText"] = async function (args) {
     var Frame = await CreateFrame()

     var Element = document.createElement("div")

     Element.className = "DES"

     Element.style = `
     width: 100%;
     padding: 10px;
     display: flex;
     align-items: center;
     flex-direction: row;
     
     justify-content: ${args.align};
     text-align: ${args.align};
     `

     Element.innerHTML += args.innerHTML

     Frame.append(Element)
}

CreateSettingUI["TextArea"] = async function (args) {
     var Frame = await CreateFrame()

     var Element = document.createElement("textarea")

     Element.className = "DES"

     Element.style = `
     background: rgb(30, 30, 30);
     color: white;
     width: 100%;
     resize: vertical;
     height: 400px;
     font-size: 18px;
     `

     Element.id = args.id

     Element.placeholder = args.placeholder

     Element.innerHTML += args.innerHTML

     if (args.SetOnChange) {

          async function UpdateUI() {
               Element.value = await Load(args.id)
          }

          UpdateUI()

          SetOnChangeSettingUI(args.id, UpdateUI)



          function UpdateSetting() {
               SetSetting(args.id, Element.value)
          }

          Element.addEventListener("input", async function () {
               if (await ShouldRealtime() == true) {
                    UpdateSetting()
               }
          })

          Element.addEventListener("change", async function () {
               if (await ShouldRealtime() == false) {
                    UpdateSetting()
               }
          })
     }

     Frame.append(Element)
}

CreateSettingUI["NumberBox"] = async function (args) {
     var Frame = await CreateFrame()

     var Element = document.createElement("input")
     Element.className = "TextBox"
     Element.type = "number"

     async function UpdateUI() {
          Element.value = await Load(args.id)
     }

     UpdateUI()

     SetOnChangeSettingUI(args.id, UpdateUI)

     function UpdateSetting() {
          SetSetting(args.id, Element.value)
     }

     Element.addEventListener("input", async function () {
          if (await ShouldRealtime() == true) {
               UpdateSetting()
          }
     })

     Element.addEventListener("change", async function () {
          if (await ShouldRealtime() == false) {
               UpdateSetting()
          }
     })

     Element.id = args.id

     Frame.append(Element)

     CreateDescription(args.description, Frame)

     UpgradeFrame(Frame)
}

CreateSettingUI["URLBox"] = async function (args) {
     var Frame = await CreateFrame()

     Frame.style.flexDirection = "column-reverse"

     var Element = document.createElement("input")
     Element.className = "TextBox"
     Element.placeholder = "Image URL Here! (>ω< )"
     Element.style = `
     margin: 10px;
     width: -webkit-fill-available;
     padding:10px;
     `

     Element.id = args.id

     Frame.append(Element)

     var Status = document.createElement("div")
     Status.style = `
     height: 0px;
     overflow: hidden;
     display: flex;
     justify-content: center;
     align-items: center;
     text-align: center;
     color: white;
     font-size: 15px;
     transition: all 0.2s;`
     Status.innerHTML = `Complete! (/≧▽≦)/<br>
          (If an image didn't show up. So the URL can't access.)`

     Frame.append(Status)

     Element.addEventListener("change", async function () {
          SetSetting(args.id, Element.value)
          Element.value = ""
          Status.style.height = `80px`
          await sleep(3000)
          Status.style.height = `0px`
     })

     CreateDescription(args.description, Frame)

     UpgradeFrame(Frame)
}

CreateSettingUI["ColorPicker"] = async function (args) {

     var Frame = await CreateFrame()

     Frame.style.flexDirection = "column"

     CreateDescription(args.description, Frame)

     var Group = document.createElement("div")
     Group.style = `
     padding: 5px;
     display: flex;
     flex-direction: row;
     align-items: center;
     margin-top: 20px;
     width: 90%;
     `

     Frame.append(Group)

     var Color = document.createElement("input")
     Color.className = "ColorPicker"
     Color.type = "color"

     Color.id = args.id + "C"

     Group.append(Color)

     //--------------------------------------

     var OpacityGroup = document.createElement("div")
     OpacityGroup.style = `
     display: flex;
     flex-direction: row;
     align-items: center;
     width: calc(100% - 50px);
     `

     Group.append(OpacityGroup)



     var OpacityText = document.createElement("span")
     OpacityText.innerText = "Opacity : "
     OpacityText.style = `
     font-size: 16px !important;
     color: white !important;
     margin-inline:10px;
     min-width:70px;
     `

     OpacityGroup.append(OpacityText)



     var Opacity = document.createElement("input")
     Opacity.className = "Opacity"
     Opacity.type = "range"

     Opacity.min = 0
     Opacity.max = 100

     Opacity.id = args.id + "O"

     OpacityGroup.append(Opacity)



     var OpacityBox = document.createElement("input")
     OpacityBox.className = "TextBox"
     OpacityBox.type = "number"
     OpacityBox.style = `
     margin-left:10px;
     `

     OpacityBox.id = args.id + "O"

     OpacityGroup.append(OpacityBox)

     //--------------------------------------

     async function UpdateUI() {
          Color.value = await Load(Color.id)
          Opacity.value = await Load(Opacity.id)
          if (document.activeElement != OpacityBox) OpacityBox.value = await Load(OpacityBox.id)
     }

     //--------------------------------------

     UpdateUI()

     SetOnChangeSettingUI(Color.id, UpdateUI)
     SetOnChangeSettingUI(Opacity.id, UpdateUI)

     var UpdateElement = [
          Color,
          Opacity,
          OpacityBox
     ]

     Array.from(UpdateElement).forEach(Element => {
          Element.addEventListener("input", async function () {
               if (await ShouldRealtime() == true) {
                    SetSetting(Element.id, Element.value)
               }
          })

          Element.addEventListener("change", async function () {
               if (await ShouldRealtime() == false) {
                    SetSetting(Element.id, Element.value)
               }
          })
     })

     UpgradeFrame(Frame)
}


// CreateSettingUI["ColorPicker"] = async function (args) {

//      var Frame = await CreateFrame()

//      Frame.style.flexDirection = "column"

//      CreateDescription(args.description, Frame)

//      var Group = document.createElement("div")
//      Group.style = `
//      padding: 5px;
//      display: flex;
//      flex-direction: row;
//      align-items: center;
//      margin-top: 20px;
//      width: 90%;
//      `

//      Frame.append(Group)

//      var Color = document.createElement("input")
//      Color.className = "ColorPicker"
//      Color.type = "color"

//      Color.id = args.id + "C"

//      Group.append(Color)

//      //--------------------------------------

//      var OpacityGroup = document.createElement("div")
//      OpacityGroup.style = `
//      display: flex;
//      flex-direction: row;
//      align-items: center;
//      width: calc(100% - 50px);
//      `

//      Group.append(OpacityGroup)



//      var OpacityText = document.createElement("span")
//      OpacityText.innerText = "Opacity : "
//      OpacityText.style = `
//      font-size: 16px !important;
//      color: white !important;
//      margin-inline:10px;
//      min-width:70px;
//      `

//      OpacityGroup.append(OpacityText)



//      var Opacity = CreateSlider(
//           OpacityGroup,
//           0,
//           100,
//           1,
//           0
//      )

//      var OpacityElement = Opacity.Element
//      OpacityElement.id = args.id + "O"

//      var OpacityBox = document.createElement("input")
//      OpacityBox.className = "TextBox"
//      OpacityBox.type = "number"
//      OpacityBox.style = `
//      margin-left:10px;
//      `

//      OpacityBox.id = args.id + "O"

//      OpacityGroup.append(OpacityBox)

//      //--------------------------------------

//      async function UpdateUI() {
//           Color.value = await Load(args.id + "C")
//           OpacityElement.setAttribute("value", await Load(args.id + "O"))
//           if (document.activeElement != OpacityBox) OpacityBox.value = await Load(args.id + "O")
//      }

//      //--------------------------------------

//      UpdateUI()

//      SetOnChangeSettingUI(args.id + "C", UpdateUI)
//      SetOnChangeSettingUI(args.id + "O", UpdateUI)

//      Opacity.OnInput = async function (Value) {
//           if (await ShouldRealtime() == true) {
//                SetSetting(args.id + "O", Value)
//           }
//      }

//      Opacity.OnChange = async function (Value) {
//           if (await ShouldRealtime() == false) {
//                SetSetting(args.id + "O", Value)
//           }
//      }

//      var UpdateElement = [
//           Color,
//           OpacityBox
//      ]

//      Array.from(UpdateElement).forEach(Element => {
//           Element.addEventListener("input", async function () {
//                if (await ShouldRealtime() == true) {
//                     SetSetting(Element.id, Element.value)
//                }
//           })

//           Element.addEventListener("change", async function () {
//                if (await ShouldRealtime() == false) {
//                     SetSetting(Element.id, Element.value)
//                }
//           })
//      })

//      UpgradeFrame(Frame)
// }



CreateSettingUI["Select"] = async function (args) {

     var Frame = await CreateFrame()

     var Element = document.createElement("select")
     Element.className = "Select"

     Element.id = args.id

     Frame.append(Element)

     //--------------------------------------

     Object.keys(args.ItemsLabel).forEach(Item => {
          var Option = document.createElement("option")
          Option.value = Item
          Option.innerHTML = args.ItemsLabel[Item]

          Element.append(Option)
     });

     //--------------------------------------

     async function UpdateUI() {
          Element.value = await Load(Element.id)
     }

     //--------------------------------------

     UpdateUI()

     SetOnChangeSettingUI(Element.id, UpdateUI)

     Element.addEventListener("change", async function () {
          SetSetting(Element.id, Element.value)
     })


     CreateDescription(args.description, Frame)
     UpgradeFrame(Frame)

}

CreateSettingUI["NumberSlide"] = async function (args) {

     if (!args.min) {
          args.min = 0
     }

     if (!args.max) {
          args.max = 100
     }

     if (!args.step) {
          args.step = 1
     }

     var Frame = await CreateFrame()

     Frame.style.flexDirection = "column"

     CreateDescription(args.description, Frame).style.textAlign = "center"

     //-------------------------------------------------

     var Group = document.createElement("div")
     Group.style = `
     display: flex;
     flex-direction: row;
     justify-content: center;
     width: -webkit-fill-available;
     padding: 10px;`

     Frame.append(Group)

     //-------------------------------------------------

     var Element = document.createElement("input")
     Element.className = "NumberSlide"
     Element.type = "range"
     Element.id = args.id
     Element.style = `
     width: -webkit-fill-available;
     margin-right: 10px;`

     Element.min = args.min
     Element.max = args.max
     Element.step = args.step

     Group.append(Element)

     //-------------------------------------------------

     var ValueBox = document.createElement("input")
     ValueBox.className = "TextBox"
     ValueBox.type = "number"
     ValueBox.id = args.id

     Group.append(ValueBox)

     //-------------------------------------------------

     async function UpdateUI() {
          Element.value = await Load(args.id)
          if (document.activeElement != ValueBox) ValueBox.value = await Load(args.id)
     }

     UpdateUI()

     SetOnChangeSettingUI(args.id, UpdateUI)

     var UpdateElement = [
          Element,
          ValueBox
     ]

     Array.from(UpdateElement).forEach(Element => {
          Element.addEventListener("input", async function () {
               if (await ShouldRealtime() == true) {
                    SetSetting(Element.id, Element.value)
               }
          })

          Element.addEventListener("change", async function () {
               if (await ShouldRealtime() == false) {
                    SetSetting(Element.id, Element.value)
               }
          })
     })

     UpgradeFrame(Frame)
}


// CreateSettingUI["NumberSlide"] = async function (args) {

//      if (!args.min) {
//           args.min = 0
//      }

//      if (!args.max) {
//           args.max = 100
//      }

//      if (!args.step) {
//           args.step = 1
//      }

//      var Frame = await CreateFrame()

//      Frame.style.flexDirection = "column"

//      CreateDescription(args.description, Frame).style.textAlign = "center"

//      //-------------------------------------------------

//      var Group = document.createElement("div")
//      Group.style = `
//      display: flex;
//      flex-direction: row;
//      justify-content: center;
//      width: -webkit-fill-available;
//      padding: 10px;
//      align-items: center;`

//      Frame.append(Group)

//      //-------------------------------------------------

//      var Slider = CreateSlider(
//           Group,
//           args.min,
//           args.max,
//           args.step
//      )

//      var Element = Slider.Element
//      Element.id = args.id
//      Element.style = `
//      width: -webkit-fill-available;
//      margin-right: 10px;`

//      //-------------------------------------------------

//      var ValueBox = document.createElement("input")
//      ValueBox.className = "TextBox"
//      ValueBox.type = "number"
//      ValueBox.id = args.id

//      Group.append(ValueBox)

//      //-------------------------------------------------

//      async function UpdateUI() {
//           Element.setAttribute("value", await Load(args.id))
//           if (document.activeElement != ValueBox) ValueBox.value = await Load(args.id)
//      }

//      UpdateUI()

//      SetOnChangeSettingUI(args.id, UpdateUI)

//      Slider.OnInput = async function (Value) {
//           if (await ShouldRealtime() == true) {
//                SetSetting(args.id, Value)
//           }
//      }

//      Slider.OnChange = async function (Value) {
//           if (await ShouldRealtime() == false) {
//                SetSetting(args.id, Value)
//           }
//      }

//      ValueBox.addEventListener("input", async function () {
//           if (await ShouldRealtime() == true) {
//                SetSetting(args.id, ValueBox.value)
//           }
//      })

//      ValueBox.addEventListener("change", async function () {
//           if (await ShouldRealtime() == false) {
//                SetSetting(args.id, ValueBox.value)
//           }
//      })

//      UpgradeFrame(Frame)
// }


CreateSettingUI["CombinationFunc"] = async function () { }


CreateSettingUI["PreviewImage"] = async function (args) {
     var Frame = await CreateFrame()

     var Element = document.createElement("img")
     Element.id = args.id

     Element.style = `
     border-radius: 10px;
     outline: 3px solid #ffffff54;
     box-shadow: 0px 0px 20px #00000094;
     background:black;
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

     UpdateUI = async function () {

          try {
               await (new Promise(async (resolve, reject) => {
                    Element.onload = () => resolve()
                    Element.onerror = () => reject()
                    Element.src = await Load(args.id)
               }))
          } catch (error) {

          }

          if (Element.naturalWidth) {
               NoImageText.style.opacity = 0

               if (Element.naturalWidth > Element.naturalHeight) {
                    Element.style.width = "100%"
                    Element.style.height = ""
               } else {
                    Element.style.width = ""
                    Element.style.height = "400px"
               }

               Element.style.aspectRatio = Element.naturalWidth / Element.naturalHeight
          } else {
               NoImageText.style.opacity = 1

               Element.style.width = "100%"
               Element.style.height = "400px"
          }
     }

     UpdateUI()

     SetOnChangeSettingUI(args.id, UpdateUI)
}

CreateSettingUI["UploadImage"] = async function (args) {
     var Frame = await CreateFrame()

     Frame.style.flexDirection = "column-reverse"

     var Element = document.createElement("input")
     Element.type = "file"
     Element.accept = "image/*"
     Element.id = args.id

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

     CreateDescription(args.description, Frame)

     UpgradeFrame(Frame)

     Element.onchange = async function (Event) {
          var File = await GetOneFileFromInput(Event)

          Label.style.height = "80px"
          Label.innerHTML = "Start Uploading! (╹ڡ╹ )"

          if (await Load("API") == true) {

               await UploadImageByAPI(File, function (NowPercent) {
                    Label.innerHTML = `Uploading : ${NowPercent}%`
               }).then(async (ImageURL) => {

                    SetSetting(args.id, ImageURL)

                    Label.innerHTML = "Complete! (/≧▽≦)/<br>(Please wait if image not showing!)"

                    await sleep(5000)

                    Label.style.height = "0px"

               }).catch((reason) => {
                    Label.innerHTML = reason
               })

          } else {

               CanReloadSave = false

               await ReadFileToURL(File, args.MaxFileSize)
                    .then(async (result) => {

                         SetSetting(args.id, result)

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





async function CreateSettingElement() {
     console.log("CreateSettingElement")

     for (var UI of SettingUI) {
          var type = UI.type
          var args = UI.args

          SetCategory(args)

          if (args.new) {
               console.log(args.id)
               NewFeature = true
          }

          await CreateSettingUI[type](args)

          NewFeature = false
     }

     console.log(SettingFuction)
     console.log(SettingUI)
     console.log(OnSettingChange)

     WatchNewtubeSettingScroll()

     Category = null
     SubCategory = null

     OldCategory = null
     OldSubCategory = null

     CategoryElement = null
     SubCategoryElement = null

     NewFeature = false
}