/* Yeaaaaaah :3 AzPepoze https://www.youtube.com/channel/UCJ2C0UTfxQo6iGTfudPfoRQ */

async function NormalYoutube() {
    if (await Load("NewUser")) {
        NewUser()
    } else {
        let GetOldVersion = await Load("OldVer")

        if (DebugMode) {
            console.log(GetOldVersion, Ver)
        }

        if (GetOldVersion != Ver) {
            ShowUpdated()
            await SetWhenUpdate()
        }
    }

    if (await GetLoad("JSAuto") == true) {
        chrome.runtime.sendMessage("RunScript")
    }

    CreateSettingButton()

    //------------------------------------------------
    RunAllCallback(RunAfterLoaded.NormalYoutube)
}

async function MiniPlayerYoutube() {

    //------------------------------------------------
    RunAllCallback(RunAfterLoaded.MiniPlayerYoutube)
}

async function AllYoutubeMode() {
    update()

    //------------------------------------------------
    RunAllCallback(RunAfterLoaded.AllYoutubeMode)
}

async function Run() {
    await AddMissingSave()
    await CreateSettingFeatures()

    if (DebugMode) {
        console.log(RunAfterLoaded)

        console.log(inIframe)
    }

    if (!inIframe) {
        if (document.documentElement.getAttribute("dark") == null) {
            await WaitYoutubeLoaded()
            ChangeToDarkMode()
        } else {
            AllYoutubeMode()
            NormalYoutube()
        }
    } else {
        AllYoutubeMode()
        MiniPlayerYoutube()
    }
}

Run()