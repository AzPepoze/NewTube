/* Yeaaaaaah :3 AzPepoze https://www.youtube.com/channel/UCJ2C0UTfxQo6iGTfudPfoRQ */

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(async tab => {
                try {
                    if (tab.url.substring(0, 23) === "https://www.youtube.com") {
                        chrome.tabs.reload(tab.id)
                    }
                } catch (e) {
                    
                }
            });
        });
    }else if(details.reason == "update"){
        console.log("Updated from " + details.previousVersion + " to " + chrome.runtime.getManifest().version);
    }
})

chrome.commands.onCommand.addListener(async (command) => {
    console.log(`Command "${command}" triggered`);
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions)
    chrome.tabs.sendMessage(tab.id, command);
});