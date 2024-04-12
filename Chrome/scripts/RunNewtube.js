/* Yeaaaaaah :3 AzPepoze https://www.youtube.com/channel/UCJ2C0UTfxQo6iGTfudPfoRQ */

async function RunOnGlobal(Name) {
    var s = document.createElement('script');
    s.id = "NewtubeGlobalScript"
    s.setAttribute("ExtensionPath", chrome.runtime.getURL(''));

    s.src = chrome.runtime.getURL(`scripts/RunOnGlobal/${Name}`);
    (document.head || document.documentElement).appendChild(s);
}

RunAfterLoaded.AllYoutubeMode.push(function(){
    RunOnGlobal("NewtubeEnvironment.js")
})


RunAfterLoaded.NormalYoutube.push(function(){
    RunOnGlobal("EnableNewYoutubeLayout.js")
})


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