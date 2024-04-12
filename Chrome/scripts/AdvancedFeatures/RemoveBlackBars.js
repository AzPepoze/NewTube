function CheckThisPX(R, G, B) {
     return Math.abs(R - ThisR) + Math.abs(G - ThisG) + Math.abs(B - ThisB) > CheckBlackThreshold
}

function Check2ThisPX(R, G, B) {
     return Math.abs(R - ThisR) + Math.abs(G - ThisG) + Math.abs(B - ThisB) > 10
}

let EnaCanvas2

let
     CheckBlackThreshold = 20,
     LastFind = null,
     ThisR = null,
     ThisG = null,
     ThisB = null

var LastFrame
var LastHeight = 0
var LastFrame = null

var NoWaitFrame = true

var SkipFrame = 5
var ThisFrame = 0

var CanCheckBlackBars = true

var GetThisTime

function CalVdoHeight() {
     var mf = 0;
     var m = 0;
     var SureTHisHeight;

     for (var i = 0; i < ThisHeightArray.length; i++) {
          lowest = null
          for (var j = i; j < ThisHeightArray.length; j++) {
               if (ThisHeightArray[i] == ThisHeightArray[j] || Math.abs(ThisHeightArray[i] - ThisHeightArray[j]) < 5) {
                    if (ThisHeightArray[i] == "inf") {
                         lowest = "inf"
                    } else {
                         if (ThisHeightArray[j] > lowest || lowest == null) {
                              lowest = ThisHeightArray[j]
                         }
                    }
                    m++;
               }
          }

          if (lowest == "inf") {
               if (m > mf) {
                    mf = m;
                    SureTHisHeight = lowest;
               }
          } else {
               if (m > mf || (m == mf && lowest > SureTHisHeight)) {
                    mf = m;
                    SureTHisHeight = lowest;
               }
          }
          m = 0;
     }

     if (BlackDebug) {
          YellowLinePX = BlackBarsContext.createImageData(VideoBound.width, 1)

          for (i = 0; i < VideoBound.width; i++) {
               YellowLinePX.data[i * 4] = 255
               YellowLinePX.data[i * 4 + 1] = 255
               YellowLinePX.data[i * 4 + 3] = 255
          }

          BlackBarsContext.putImageData(YellowLinePX, 0, 10)
     }

     if (mf < 6 || SureTHisHeight == "inf") {
          SureTHisHeight = LastHeight
     }

     if (SureTHisHeight > 10 && (Math.abs(SureTHisHeight - LastHeight) > 10 || SureTHisHeight > LastHeight)) {

          if (SureTHisHeight > LastHeight) {
               v.parentElement.style.transition = "none"
          } else {
               v.parentElement.style.transition = "all 0.5s ease-out"
          }

          LastHeight = SureTHisHeight

          v.parentElement.style.height = VideoBound.height - LastHeight * 2 - 2 + 'px'
     } else {
          if (SureTHisHeight <= 10) {
               v.parentElement.style.transition = "all 0.5s ease-out"
               LastHeight = 0
               v.parentElement.style.height = VideoBound.height + "px"
          }
     }

     if (BlackDebug) {
          GreenLinePX = BlackBarsContext.createImageData(VideoBound.width, 1)

          for (i = 0; i < VideoBound.width; i++) {
               GreenLinePX.data[i * 4 + 1] = 255
               GreenLinePX.data[i * 4 + 3] = 255
          }

          BlackBarsContext.putImageData(GreenLinePX, 0, LastHeight)
          BlackBarsContext.putImageData(GreenLinePX, 0, VideoBound.height - LastHeight)
     }

     CanCheckBlackBars = true
}

let NowCooldownEveryPixel = 0

async function WaitCheckCoolDown() {
     if (CooldownEveryPixel > -1) {
          NowCooldownEveryPixel++
          if (NowCooldownEveryPixel >= CooldownEveryPixel) {
               NowCooldownEveryPixel = 0
               if (CanDropFrame) {
                    await sleep(0)
               }
          }
     }
}

async function CheckPxLine(x) {
     var ThisFind = x
     var ThisR = SampleBlackBarRGB[0]
     var ThisG = SampleBlackBarRGB[1]
     var ThisB = SampleBlackBarRGB[2]

     Find = null
     try {
          ThisActualPX = BlackBarsContext.getImageData(ThisFind, 0, 1, halfVDO)
     } catch (error) {
          CanCheckBlackBars = true
          return
     }
     ThisPX = ThisActualPX.data

     NowCooldownEveryPixel = 0

     for (i = 5; i < halfVDO; i++) {
          await WaitCheckCoolDown()
          if (CheckThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
               i += 10
               if (CheckThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
                    Find = i - 10
                    i = halfVDO
               }
          } else {
               if (!Check2ThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
                    ThisR = ThisPX[i * 4]
                    ThisG = ThisPX[i * 4 + 1]
                    ThisB = ThisPX[i * 4 + 2]
               }
          }
     }

     if (Find) {
          ThisHeightArray.push(Find)

          if (BlackDebug) {
               for (i = 5; i < Find; i++) {
                    BlackBarsContext.putImageData(redPX, ThisFind, i)
               }
          }
     } else {
          ThisHeightArray.push("inf")
     }

     //-----------------------------------------------------------------
     if (CanDropFrame) {
          await sleep(0)
          CheckBottom(x)
     } else {
          CheckBottom(x)
     }

}

async function CheckBottom(x) {
     var ThisFind = x

     var ThisR = SampleBlackBarRGB[0]
     var ThisG = SampleBlackBarRGB[1]
     var ThisB = SampleBlackBarRGB[2]

     Find = null
     try {
          ThisActualPX = BlackBarsContext.getImageData(ThisFind, halfVDO, 1, halfVDO)
     } catch (error) {
          CanCheckBlackBars = true
          return
     }
     ThisPX = ThisActualPX.data

     NowCooldownEveryPixel = 0
     for (i = halfVDO - 5; i > 0; i--) {
          await WaitCheckCoolDown()
          if (CheckThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
               i -= 10
               if (CheckThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
                    Find = i + 10
                    i = 0
               }
          } else {
               if (!Check2ThisPX(ThisPX[i * 4], ThisPX[i * 4 + 1], ThisPX[i * 4 + 2])) {
                    ThisR = ThisPX[i * 4]
                    ThisG = ThisPX[i * 4 + 1]
                    ThisB = ThisPX[i * 4 + 2]
               }
          }
     }

     if (Find) {
          Find += halfVDO
          ThisHeightArray.push(VideoBound.height - Find)

          if (BlackDebug) {
               for (i = VideoBound.height - 5; i > Find; i--) {
                    BlackBarsContext.putImageData(redPX, ThisFind, i)
               }
          }
     } else {
          ThisHeightArray.push("inf")
     }


     // ThisFind += CheckBlackQua

     if (x == 4) {
          CalVdoHeight()
     } else {
          if (CanDropFrame) {
               await sleep(0)
               CheckPxLine(x + 1)
          } else {
               CheckPxLine(x + 1)
          }
     }
}

function CheckNumLine(from, to) {
     for (x = from; x < to; x++) {
          CheckPxLine(x)
     }
}

var SampleBlackBarRGB

async function RunCheckBlackBars() {

     await GetVideoBound()

     if (CanCheckBlackBars == false) {
          return
     }

     if (!await FindMainVideo()) {
          if (v.parentElement.style.height != "") {
               v.parentElement.style.height = ""
          }
          return
     }

     CanCheckBlackBars = false

     if (VideoBound.height != BlackBarsCanvas.height) {
          BlackBarsCanvas.height = VideoBound.height
          BlackBarsCanvas.style.height = VideoBound.height + "px"
     }

     redPX = BlackBarsContext.createImageData(1, 1)
     redPX.data[0] = 255
     redPX.data[3] = 255

     BlackBarsContext.drawImage(v, 0, 0, 5, VideoBound.height);

     try {
          ThisActualPX = BlackBarsContext.getImageData(1, 3, 1, 1)
     } catch (error) {
          CanCheckBlackBars = true
          return
     }

     ThisPX = ThisActualPX.data

     SampleBlackBarRGB = ThisActualPX.data

     ThisR = ThisPX[0]
     ThisG = ThisPX[1]
     ThisB = ThisPX[2]

     ThisHeightArray = []

     halfVDO = Math.floor(VideoBound.height / 2)

     if (CanDropFrame) {
          await sleep(0)
          CheckPxLine(0)
     } else {
          CheckPxLine(0)
     }
}

async function BlackBarsRunFrame() {
     RunCheckBlackBars()
}

var BlackBarsCanvas
var BlackBarsContext
var BlackBarsRunWithVideo
var BlackBarsWhenChangeVideo

async function CreateRemoveBlackBarsCanvas() {
     BlackBarsCanvas = document.createElement('canvas')
     await FindVideo()
     v.parentElement.parentElement.append(BlackBarsCanvas)
     BlackBarsCanvas.style = `position: absolute;
         top: 0px;
         image-rendering: pixelated;
         z-index:100;
         width:50px;
         left:0px;`

     UpdateBlackBarsDebug()

     BlackBarsCanvas.id = "NewtubeVDOCanvas"
     BlackBarsCanvas.width = 5
     BlackBarsContext = BlackBarsCanvas.getContext('2d', { alpha: false })
     BlackBarsContext.imageSmoothingEnabled = false

     if (!BlackBarsRunWithVideo) {
          BlackBarsRunWithVideo = await RunFunctionWithVideo(
               BlackBarsRunFrame
          )
     }

     if (!BlackBarsWhenChangeVideo) {
          BlackBarsWhenChangeVideo = await WhenChangeVideo(
               function () {
                    LastHeight = 0
               }
          )
     }

}

async function StartRemoveBlackBars() {
     CreateRemoveBlackBarsCanvas()
}

async function StopRemoveBlackBars() {
     if (CanCheckBlackBars == false) {
          await sleep(100)
          StopRemoveBlackBars()
     }
     v.parentElement.style.height = ""
     if (BlackBarsWhenChangeVideo) {
          BlackBarsWhenChangeVideo.Stop()
          BlackBarsWhenChangeVideo = null
     }
     if (BlackBarsRunWithVideo) {
          BlackBarsRunWithVideo.Stop()
          BlackBarsRunWithVideo = null
     }
     if (BlackBarsCanvas) {
          BlackBarsCanvas.remove()
     }
}

var CanDropFrame

async function OnChangeRemoveBlackBarsCanDropFrame() {
     CanDropFrame = await Load("DropFrame")
}

var BlackDebug

async function UpdateBlackBarsDebug() {
     BlackDebug = await Load("DelBarDebug")
     if (BlackBarsCanvas) {
          if (BlackDebug) {
               BlackBarsCanvas.style.display = ''
          } else {
               BlackBarsCanvas.style.display = 'none'
          }
     }
}

async function OnChangeRemoveBlackBarsDebug() {
     UpdateBlackBarsDebug()
}

var CooldownEveryPixel

async function OnChangeRemoveBlackBarsCooldownEveryPixel() {
     CooldownEveryPixel = await Load("LazyAmount")
     if (CooldownEveryPixel < -1) {
          CooldownEveryPixel = -1
     }
}

RunAfterLoaded.NormalYoutube.push(function () {

     OnChangeRemoveBlackBarsCanDropFrame()
     AddOnChangeFunction("DropFrame", OnChangeRemoveBlackBarsCanDropFrame)

     OnChangeRemoveBlackBarsDebug()
     AddOnChangeFunction("DelBarDebug", OnChangeRemoveBlackBarsDebug)

     OnChangeRemoveBlackBarsCooldownEveryPixel()
     AddOnChangeFunction("LazyAmount", OnChangeRemoveBlackBarsCooldownEveryPixel)

     OnChangeButton(
          "DelBar",
          StartRemoveBlackBars,
          StopRemoveBlackBars
     )
})