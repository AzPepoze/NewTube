var WhenYoutubeChangePage = []

window.addEventListener('yt-page-data-updated', function (){
    RunAllCallback(WhenYoutubeChangePage)
})

async function WaitYoutubeLoaded() {
    return new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", resolve, { once: true })
    })
}