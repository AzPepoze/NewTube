async function WaitYoutubeLoaded() {
    return new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", resolve, { once: true })
    })
}

async function WhenYoutubeChangePage(callback) {
    window.addEventListener('yt-page-data-updated', callback)

    return {
        Stop: async function () {
            window.removeEventListener('yt-page-data-updated', callback)
        }
    }
}