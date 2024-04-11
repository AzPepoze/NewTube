async function ShowReplayChat(Times) {
     if (Times == null) {
          Times = 10
     }
     Times -= 1
     if (await GetLoad("ChatReplayT") == true) {
          let FindReplayChatButton = document.querySelector(`ytd-live-chat-frame[collapsed] ytd-toggle-button-renderer button[aria-pressed="false"]`)
          if (FindReplayChatButton) {
               FindReplayChatButton.click()
          } else {
               setTimeout(() => {
                    ShowReplayChat(Times)
               }, 1000);
          }
     }
}