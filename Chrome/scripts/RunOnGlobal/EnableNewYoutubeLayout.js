Newtube.NewYoutubeLayout = {}

Newtube.NewYoutubeLayout.Enable = async function () {
     yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid = true
     yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments = true
     yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments_ep = true
}

Newtube.NewYoutubeLayout.Disable = async function () {
     yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid = false
     yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments = false
     yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments_ep = false
}

Newtube.OnSaveChangeWithAutoRun("NewYoutubeLayout",function(Value,FirstRun){
     if (!FirstRun) {
          Newtube.AskForReload()
          return
     }

     if (Value) {
          Newtube.NewYoutubeLayout.Enable()
     } else {
          Newtube.NewYoutubeLayout.Disable()
     }
})