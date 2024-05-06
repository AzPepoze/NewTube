

async function EnableFlyout() {
    v.setAttribute('NewtubeFlyout', '')
    v.parentElement.parentElement.setAttribute('NewtubeMainPlayerFlyout', '')
    PlayerContainer.setAttribute('NewtubePlayerContainerFlyout', '')
}

async function DisableFlyout() {
    v.removeAttribute('NewtubeFlyout')
    v.parentElement.parentElement.removeAttribute('NewtubeMainPlayerFlyout')
    PlayerContainer.removeAttribute('NewtubePlayerContainerFlyout')
}

async function CheckCanSetFlyout() {
    await FindVideo()
    await GetPlayerContainer()
    await GetPlayer()
}

async function FlyoutOnScroll() {
    if (await Load("SrollRow")) return
    await CheckCanSetFlyout()

    if (isElementVerticallyInViewport(PlayerContainer.parentElement)) {
        DisableFlyout()
    } else {
        EnableFlyout()
    }
}

var RunWhenScrollFlyout

async function StartFlyout() {
    if (!RunWhenScrollFlyout) {
        RunWhenScrollFlyout = RunWhenScroll(window, FlyoutOnScroll)
    }
}

async function StopFlyout() {
    if (RunWhenScrollFlyout) {
        RunWhenScrollFlyout.Stop()
        RunWhenScrollFlyout = null
    }
    await CheckCanSetFlyout()
    DisableFlyout()
}

RunAfterLoaded.NormalYoutube.push(function () {
    OnChangeButton(
        "Flyout",
        StartFlyout,
        StopFlyout
    )
})