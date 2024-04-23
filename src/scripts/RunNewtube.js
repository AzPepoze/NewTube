/* Yeaaaaaah :3 AzPepoze https://www.youtube.com/channel/UCJ2C0UTfxQo6iGTfudPfoRQ */

async function RunScriptOnGlobal(Name) {
    return new Promise(async function (res, rej) {
        var s = document.createElement('script');

        s.onload = function () {
            res()
        }

        s.id = "NewtubeGlobalScript"
        s.setAttribute("ExtensionPath", chrome.runtime.getURL(''));
        s.src = chrome.runtime.getURL(`scripts/${Name}`);
        var Head = await GetDocumentHead()
        Head.appendChild(s);
    })
}

RunAfterLoaded.RunFirst.push(async function () {
    await RunScriptOnGlobal("RunOnGlobal/NewtubeEnvironment.js")
    //------------------------------------------------
    if (in_Setting_Page) {
        await RunScriptOnGlobal("libs/RequireJS.js")
        //------------------------------------------------
        await RunScriptOnGlobal("libs/vs/loader.js")
        await RunScriptOnGlobal("RunAfterLoaded/VsCode.js")
    }
})


// RunAfterLoaded.NormalYoutube.push(async function () {

// })


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
    if (!in_Setting_Page) {
        update()
    }


    //----------------------------------------------
    await sleep(1000)
    await RunFirst()
    //------------------------------------------------
    RunAllCallback(RunAfterLoaded.AllYoutubeMode)
}

async function RunFirst() {
    await RunAllCallback(RunAfterLoaded.RunFirst)
}

async function Run() {
    await AddMissingSave()
    await CreateSettingFeatures()

    if (DebugMode) {
        console.log(RunAfterLoaded)

        console.log(inIframe)
    }

    if (!inIframe) {
        if (!in_Setting_Page && document.documentElement.getAttribute("dark") == null) {
            await WaitYoutubeLoaded()
            ChangeToDarkMode()
        } else {
            await AllYoutubeMode()
            await NormalYoutube()
            if (in_Setting_Page) {
                CreateSetting()
                OpenSetting()
            }
        }
    } else {
        AllYoutubeMode()
        MiniPlayerYoutube()
    }
}

Run()