let MainChapters
let GetCurrentTimeElement

async function ForceUpdateTime() {
    await FindVideo()
    if (RunningForceUpdateTime == true) {
        if (MainChapters == null) {
            MainChapters = document.querySelector(".ytp-chapters-container")
            if (MainChapters == null) return
        }

        let Chapters = MainChapters.children

        let Sec = Math.floor(v.currentTime)
        let Minite = Math.floor(Sec / 60)
        let Hours = Math.floor(Minite / 60)

        Sec -= Minite * 60
        Minite -= Hours * 60

        let CalTime

        if (Sec < 10) {
            Sec = `0${Sec}`
        }

        if (Hours > 0) {
            if (Minite < 10) {
                Minite = `0${Minite}`
            }
            CalTime = `${Hours}:${Minite}:${Sec}`
        } else {
            CalTime = `${Minite}:${Sec}`
        }

        if (GetCurrentTimeElement == null) {
            GetCurrentTimeElement = document.querySelector(".ytp-time-current")
            if (GetCurrentTimeElement == null) return
        }

        GetCurrentTimeElement.textContent = CalTime


        ///////////////////////////

        let TimeLineMaxWidth = MainChapters.getBoundingClientRect().width

        let StartWidth = 0
        let NowShouldWidth = (v.currentTime / v.duration) * TimeLineMaxWidth
        let NowShouldBufferWidth

        for (var i = 0; i < v.buffered.length; i++) {
            let BufferStartTime = v.buffered.start(i)
            let BufferEndTime = v.buffered.end(i)

            if (v.currentTime > BufferStartTime && v.currentTime < BufferEndTime) {
                NowShouldBufferWidth = (BufferEndTime / v.duration) * TimeLineMaxWidth
            }
        }

        for (var i = 0; i < Chapters.length; i++) {
            let ThisChapter = Chapters[i]
            let ThisChapterWidth = ThisChapter.getBoundingClientRect().width

            let CalTimeForThisChapter

            if (NowShouldWidth < StartWidth) {
                CalTimeForThisChapter = 0
            } else {
                CalTimeForThisChapter = (NowShouldWidth - StartWidth) / ThisChapterWidth

                if (CalTimeForThisChapter > 1) {
                    CalTimeForThisChapter = 1
                }
            }

            ThisChapter.querySelector(".ytp-play-progress").style.transform = `scaleX(${CalTimeForThisChapter})`


            let CalBufferForThisChapter

            if (NowShouldBufferWidth < StartWidth) {
                CalBufferForThisChapter = 0
            } else {
                CalBufferForThisChapter = (NowShouldBufferWidth - StartWidth) / ThisChapterWidth

                if (CalBufferForThisChapter > 1) {
                    CalBufferForThisChapter = 1
                }
            }

            ThisChapter.querySelector(".ytp-load-progress").style.transform = `scaleX(${CalBufferForThisChapter})`

            if (Chapters[i + 1]) {
                StartWidth += 2
            }

            StartWidth += ThisChapterWidth
        }

    } else {
        v.removeEventListener("timeupdate", ForceUpdateTime)
    }
}

let RunningForceUpdateTime = false

async function StartForceUpdateTime() {
    if (RunningForceUpdateTime == false && await GetLoad("AutohideBarT") == false && !inIframe) {
        await FindVideo()
        RunningForceUpdateTime = true

        v.addEventListener("timeupdate", ForceUpdateTime)
    }
}