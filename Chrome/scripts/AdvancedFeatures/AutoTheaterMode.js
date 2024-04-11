async function AutoTheaterMode() {
     if (await GetLoad("AutoTheater") == true) {
          let GetTheaterButton = await TryFindElement(`.ytp-size-button`)
          if (GetTheaterButton) {
               let IsPlayerInNormalMode = await TryFindElement(`#player .html5-video-player`)
               console.log(IsPlayerInNormalMode)
               if (IsPlayerInNormalMode) {
                    console.log(GetTheaterButton)
                    GetTheaterButton.click()
                    await sleep(1000)
                    IsPlayerInNormalMode = await TryFindElement(`#player .html5-video-player`)
                    if (IsPlayerInNormalMode) {
                         AutoTheaterMode()
                    }
               }
          }
     }
}