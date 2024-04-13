let AzCached = {}
let Loaded = false

async function MainLoad(GetLoadArray) {
    if (Loaded == false) {
        await sleep(100)
        return await MainLoad(GetLoadArray)
    } else {
        if (GetLoadArray == null) {
            return AzCached
        } else {
            return AzCached[GetLoadArray]
        }
    }
}

async function GetLoad(GetLoad) {
    let ThisLoad = await MainLoad(GetLoad)
    return ThisLoad
}

async function LoadCached() {
    await chrome.storage.local.get("CachedSave").then((Loaded) => {
        AzCached = Loaded["CachedSave"]
    })

    if (AzCached == null) {
        AzCached = {}
    } else {
        if (AzCached["CachedSave"]) {
            delete AzCached["CachedSave"]
        }
    }

    Loaded = true
}

LoadCached()

async function MainSave(TheSave) {
    if (true) {
        Object.keys(TheSave).forEach(function (ThisKey) {
            AzCached[ThisKey] = TheSave[ThisKey]
        })
    }

    await SaveCached(AzCached)
}

async function LoadToConsole(GetLoadArray) {
    let Get = await MainLoad(GetLoadArray)
}

async function ClearSave() {
    await chrome.storage.local.clear()
    AzCached = {}
}

async function LoadRgba(Text) {
    var HEX = await Load(Text + "C")
    HEX = HEX.replace('#', '')
    var aRgbHex = HEX.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16) + ',' + parseInt(aRgbHex[1], 16) + ',' + parseInt(aRgbHex[2], 16)
    ]

    return `rgba(` + aRgb + `,` + (await Load(Text + "O") / 100) + `)`
}




async function Save(Name, Value) {
    
    document.dispatchEvent(new CustomEvent(`${ExtensionID}_Save_Change_${Name}`, {
        detail: Value
    }))

    return await MainSave({ [Name]: Value })
}

async function Load(LoadName) {
    return await MainLoad(LoadName)
}


var NewtubeSavePrevent = [
    "PRESET",
    'SHOWPRESET',
    'EnableButton',
    'Realtime',
    'ErrorCollect',
    "CachedSave",
    "JSAuto",
    "OldVer"
]

var NewtubeAllSaveKey = []

function CheckCanSave(KeyName) {
    var CanAdd = true
    if (NewtubeSavePrevent.includes(KeyName) || !NewtubeAllSaveKey.includes(KeyName)) {
        CanAdd = false
    }
    return CanAdd
}

function CheckCanSaveForThemeSelector(KeyName) {
    var CanAdd = true
    if (NewtubeSavePrevent.includes(KeyName) || AzCached[KeyName] == null) {
        CanAdd = false
    }
    return CanAdd
}

async function LoadNTubeCode(Preset) {
    let array = Preset

    if (Object.prototype.toString.call(array) == '[object Object]') {
        for (var key of Object.keys(array)) {
            //--------------------
            if (!CheckCanSave(key)) {
                continue
            }
            //--------------------

            let value = array[key];
            let TryToParse
            try {
                TryToParse = JSON.parse(value)
            } catch (error) {

            }
            if (TryToParse != null) {
                value = TryToParse
            }

            await SetSetting(key, value)

            if (key == "ADDScript" && value.replaceAll("\n", "").replaceAll(" ", "") != "") {
                if (confirm(`⚠️*WARINING*⚠️\nThis Preset/Theme contain JS code.\nYou can be hacked if you continue.\n(Please make sure this code is from who you trust!)\n\nAre you want to load JS code?`)) {
                    await SetSetting(key, value)
                } else {
                    await SetSetting(key, "")
                }
            }
        }
    } else {
        for (let i = 0; i < array.length; i += 2) {

            //--------------------
            if (CheckCanSave(key)) {
                continue
            }
            //--------------------

            let value = array[i + 1]
            let TryToParse
            try {
                TryToParse = JSON.parse(value)
            } catch (error) {

            }
            if (TryToParse != null) {
                value = TryToParse
            }
            await SetSetting(array[i], array[i + 1])
        }
    }

    update()
}

async function LoadNTubeCodeString(string) {
    if (DebugMode) {
        console.log(await ConvertStringToPreset(string))
    }
    return await LoadNTubeCode(await ConvertStringToPreset(string))
}

async function GenNTubeCode() {
    arrdata = {}

    let ThisSave = await MainLoad(null)
    for (var z in ThisSave) {
        //--------------------
        var Skip = false
        for (var i of NewtubeSavePrevent) {
            if (i == z) {
                Skip = true
                break
            }
        }
        if (Skip) {
            continue
        }
        //--------------------
        arrdata[z] = ThisSave[z]
    }

    return arrdata
}

async function GenNTubeCodeString() {
    let arr = await GenNTubeCode()
    gentext = JSON.stringify(arr).replace(/,"/g, ',\n"')
    gentext = gentext.substring(0, 1) + '\n' + gentext.substring(1)
    gentextL = gentext.length
    gentext = gentext.substring(0, gentextL - 1) + '\n' + gentext.substring(gentextL - 1)
    return gentext
}

async function ConvertStringToPreset(string) {
    return JSON.parse(string)
}

async function ConvertToNewSave(Save) {
    var NewSave = { ...Save }

    await Promise.all(Object.keys(NewSave).map(async (id) => {
        if (NewSave[id] == "true") {
            NewSave[id] = true
        }

        if (NewSave[id] == "false") {
            NewSave[id] = false
        }


        if (id.slice(-1) == "T" && (NewSave[id] === true || NewSave[id] === false)) {
            NewSave[id.slice(0, -1)] = NewSave[id]
            delete NewSave[id]
        }
    }))

    return NewSave
}

async function SaveCached(Cached) {
    chrome.storage.local.set({ "CachedSave": Cached })
}

document.addEventListener(ExtensionID + "_Save_Request", async function (e) {
    document.dispatchEvent(new CustomEvent(`${ExtensionID}_Save_Recive`, {
        detail: {
            UniqueID: e.detail.UniqueID,
            Value:await Load(e.detail.Name)
        }
    }))
})