async function ChangeYoutubeLayout() {
     if (localStorage["Newtube_NewYoutubeLayout"] == "true") {
          yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid = true
          yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments = true
          yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments_ep = true
     } else {
          yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid = false
          yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments = false
          yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments_ep = false
     }
}

ChangeYoutubeLayout()