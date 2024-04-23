async function GetVideoThumbnail() {
    videoID = await GetVideoID()
    let GetLink = `https://i.ytimg.com/vi/${videoID}/maxresdefault.jpg`
    if (DebugMode) {
        console.log(GetLink)
    }
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.crossOrigin = "Anonymous"
        img.src = GetLink
    })
}

async function GetVideoFirstFrame() {
    videoID = await GetVideoID()
    let GetLink = `https://i.ytimg.com/vi/${videoID}/0.jpg`
    if (DebugMode) {
        console.log(GetLink)
    }
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.crossOrigin = "Anonymous"
        img.src = GetLink
    })
}

let v
let vList
let vClass

async function setV() {
    if (DebugMode) {
        console.log("Finding Video")
    }

    v = document.querySelector(`#player-container[role="complementary"] video`)

    if (v == null) {
        await sleep(100)
        await setV()
    }
}

async function FindVideo() {
    try {
        v.parentElement.parentElement
    } catch (e) {
        // console.log("FindVDOE")
        await setV()

    }
    return v
}

async function GetVideoID(attemp) {
    if (attemp == null) {
        attemp = 10
    }

    if (attemp > 0) {
        var URLParams = getUrlParams(window.location.href)
        //console.log(URLParams)
        if (URLParams["v"]) {
            return URLParams["v"]
        }
    } else {
        console.error("Can't find video ID")
        return
    }
}

var CheckCanvas = new OffscreenCanvas(1, 1)
var CheckContext = CheckCanvas.getContext('2d')

async function GetImageColor(src) {
    return new Promise((resolve, reject) => {
        var frame = new Image()
        frame.crossOrigin = "https://www.youtube.com"
        frame.onload = function () {
            CheckContext.drawImage(frame, 0, 0, 1, 1)
            resolve(CheckContext.getImageData(0, 0, 1, 1).data)
        }
        frame.onerror = function () {
            reject()
        }
        frame.src = src
    })
}

var OldCheckStaticVideoID
var NowStaticVDO = false

async function CheckStaticVDO() {
    //console.log("Check if static")

    if (!await Load("CheckStatic")) {
        return false
    }

    var videoID = await GetVideoID()

    //console.log(videoID)

    if (videoID == OldCheckStaticVideoID) {
        return NowStaticVDO
    }

    OldCheckStaticVideoID = videoID

    if (!videoID) {
        return
    }

    var AllFrame = []

    AllFrame = [
        await GetImageColor(`http://i.ytimg.com/vi/${videoID}/1.jpg`),
        await GetImageColor(`http://i.ytimg.com/vi/${videoID}/2.jpg`),
        await GetImageColor(`http://i.ytimg.com/vi/${videoID}/3.jpg`)
    ]

    AllFrame = [
        AllFrame[0][0], AllFrame[0][1], AllFrame[0][2],
        AllFrame[1][0], AllFrame[1][1], AllFrame[1][2],
        AllFrame[2][0], AllFrame[2][1], AllFrame[2][2],
    ]

    if (DebugMode) {
        console.log(AllFrame)
    }

    MAX_RGB = [0, 0, 0]
    MIN_RGB = [255, 255, 255]

    for (let i = 0; i < 9; i++) {
        var NumColor = AllFrame[i],
            RGBPosition = i - Math.floor(i / 3) * 3

        if (NumColor > MAX_RGB[RGBPosition]) {
            MAX_RGB[RGBPosition] = NumColor
        }

        if (NumColor < MIN_RGB[RGBPosition]) {
            MIN_RGB[RGBPosition] = NumColor
        }
    }

    Max = MAX_RGB[0] + MAX_RGB[1] + MAX_RGB[2]
    Min = MIN_RGB[0] + MIN_RGB[1] + MIN_RGB[2]

    if (DebugMode) {
        console.log(Max, Min, (Max - Min))
    }

    NowStaticVDO = (Max - Min) <= 5

    return NowStaticVDO
}

async function VideoChanged(callback) {
    var WatchingVideoChangeClass = ELementChange(
        (await FindVideo()).parentElement.parentElement,

        callback,

        {
            attributes: true,
            attributeFilter: ['class'],
        }
    )

    return {
        Observe: WatchingVideoChangeClass,
        Stop: async function () {
            WatchingVideoChangeClass.disconnect()
        }
    }
}

async function WhenChangeVideo(callback) {
    var WatchingVideoChangeClass = ELementChange(
        (await FindVideo()),

        callback,

        {
            attributes: true,
            attributeFilter: ['src'],
        }
    )

    return {
        Observe: WatchingVideoChangeClass,
        Stop: async function () {
            WatchingVideoChangeClass.disconnect()
        }
    }
}

async function FindMainVideo() {
    var Video = await FindVideo()
    var ParentClass = Video.parentElement.parentElement.classList
    var FindMainVideo = !(Video.src == '') && !ParentClass.contains("ytp-player-minimized") && !ParentClass.contains("ytp-fullscreen")

    return FindMainVideo
}

async function FindMainVideoIncludeMinimized() {
    var Video = await FindVideo()
    var FindMainVideo = !(Video.src == '')

    return FindMainVideo
}

let fps = 30,
    calPerFrameTime = 1000 / fps,
    SupportFrameUpdate = ('requestVideoFrameCallback' in HTMLVideoElement.prototype)

/**
 * @param {Function} Runframe Runframe Function With StaticVDO
 * @param {Function} WhenNoVideo WhenNoVideo Function
 * @param {Function} WhenStaticVideo WhenStaticVideo Function
 */

var FunctionWithVideoTasks = {
    Runframe: {},
    WhenNoVideo: {},
    WhenStaticVideo: {}
}

async function AddFunctionWithVideoTasks(UniqueID, Runframe, WhenNoVideo, WhenStaticVideo) {
    FunctionWithVideoTasks.Runframe[UniqueID] = Runframe
    FunctionWithVideoTasks.WhenNoVideo[UniqueID] = WhenNoVideo
    FunctionWithVideoTasks.WhenStaticVideo[UniqueID] = WhenStaticVideo
}

async function RemoveFunctionWithVideoTasks(UniqueID) {
    delete FunctionWithVideoTasks.Runframe[UniqueID]
    delete FunctionWithVideoTasks.WhenNoVideo[UniqueID]
    delete FunctionWithVideoTasks.WhenStaticVideo[UniqueID]
}

var RunningSyncWithVideo = false

async function RunSyncWithVideo() {

    if (Object.keys(FunctionWithVideoTasks.Runframe).length == 0) {
        RunningSyncWithVideo = false
        return
    }

    if (DebugMode) {
        console.log("Sync With Video", FunctionWithVideoTasks.Runframe)
    }

    var Video = await FindVideo()

    if (DebugMode) {
        console.log(Video)
    }

    if (Video == null) {
        await RunAllCallbackOBJ(FunctionWithVideoTasks.WhenNoVideo)
        return
    }

    var StaticVDO = await CheckStaticVDO()

    if (DebugMode) {
        console.log(StaticVDO)
    }

    if (StaticVDO == true) {
        await RunAllCallbackOBJ(FunctionWithVideoTasks.WhenStaticVideo)
    } else {
        await RunAllCallbackOBJ(FunctionWithVideoTasks.Runframe, StaticVDO)
    }

    if (SupportFrameUpdate == true) {
        if (DebugMode) {
            console.log("WaitNextFrame")
        }
        v.requestVideoFrameCallback(RunSyncWithVideo)
    } else {
        setTimeout(() => {
            RunSyncWithVideo()
        }, calPerFrameTime);
    }

}

async function RunFunctionWithVideo(Runframe, WhenNoVideo, WhenStaticVideo) {


    var UniqueID = Date.now()

    async function StopFunction() {
        RemoveFunctionWithVideoTasks(UniqueID)
        StopFunction = undefined
        UniqueID = undefined
    }

    await AddFunctionWithVideoTasks(UniqueID, Runframe, WhenNoVideo, WhenStaticVideo)

    if (!RunningSyncWithVideo) {
        RunningSyncWithVideo = true
        RunSyncWithVideo()
    }

    return {
        Stop: StopFunction
    }
}

var VideoBound

async function GetVideoBound() {
    await FindVideo()
    VideoBound = v.getBoundingClientRect()
    return VideoBound
}

var PlayerContainer

async function GetPlayerContainer() {
    await FindVideo()
    PlayerContainer = v.parentElement.parentElement.parentElement.parentElement.parentElement
    return PlayerContainer
}


var Player

async function GetPlayer() {
    await GetPlayerContainer()
    Player = PlayerContainer.parentElement.parentElement.parentElement
    return Player
}