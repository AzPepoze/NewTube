var WhenChangeVideo_Update_Theme_by_video

async function Start_Theme_by_video() {
     if (!WhenChangeVideo_Update_Theme_by_video) {
          WhenChangeVideo_Update_Theme_by_video = WhenYoutubeChangePage(function () {
               update()
          })
     }
}

async function Stop_Theme_by_video() {
     if (WhenChangeVideo_Update_Theme_by_video) {
          WhenChangeVideo_Update_Theme_by_video.Stop()
          WhenChangeVideo_Update_Theme_by_video = null
     }
}

RunAfterLoaded.NormalYoutube.push(function () {
     OnChangeButton(
          "Theme_by_video",
          Start_Theme_by_video,
          Stop_Theme_by_video
     )
})