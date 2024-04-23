async function ShowChatReplay(Times) {
     if (Times == null) {
          Times = 10
     }
     Times -= 1
     if (await Load("ChatReplay") == true) {
          let FindReplayChatButton = document.querySelector(`ytd-live-chat-frame[collapsed] button`)
          console.log(FindReplayChatButton)
          if (FindReplayChatButton) {
               FindReplayChatButton.click()
          } else {
               setTimeout(() => {
                    ShowChatReplay(Times)
               }, 1000);
          }
     }
}

var WhenYoutubeChangePage_ShowChatReplay

async function StartShowChatReplay() {
     if (WhenYoutubeChangePage_ShowChatReplay == null) {
          ShowChatReplay()
          WhenYoutubeChangePage_ShowChatReplay = WhenYoutubeChangePage(ShowChatReplay)
     }
}

async function StopShowChatReplay() {
     if (WhenYoutubeChangePage_ShowChatReplay) {
          WhenYoutubeChangePage_ShowChatReplay.Stop()
          WhenYoutubeChangePage_ShowChatReplay = null
     }
}

RunAfterLoaded.NormalYoutube.push(function () {
     OnChangeButton(
          "ChatReplay",
          StartShowChatReplay,
          StopShowChatReplay
     )
})