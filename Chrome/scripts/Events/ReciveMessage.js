chrome.runtime.onMessage.addListener(async function (recived) {
     console.log("revice " + recived)
     if (recived == 'Enable') {
          if (await GetLoad("EnableButton") == true) {
               await SetSetting("EnableButton", false)
          } else {
               await SetSetting("EnableButton", true)
          }
          update()
     }

     if (!in_Setting_Page && recived == 'Setting') {
          clickSetting()
     }

     if (recived == 'ReloadSave') {
          ReloadSave()
     }
})