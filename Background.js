/* Yeaaaaaah :3 AzPepoze https://www.youtube.com/channel/UCJ2C0UTfxQo6iGTfudPfoRQ */
chrome.tabs.query({}, function (tabs) {
    tabs.forEach(tab => {
        try {
            if (tab.url.substring(0, 23) === "https://www.youtube.com") {
                chrome.tabs.reload(tab.id)
            }
        } catch (e) {

        }
    });
});