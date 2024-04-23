var WindowVisible = false

var WhenHideWindow = []
var WhenShowWindow = []
var WhenFocusWindow = []

document.addEventListener('visibilitychange', async function () {
     if (document.visibilityState == 'visible') {
          RunAllCallback(WhenShowWindow)
     }

     if (document.visibilityState == 'hidden') {
          RunAllCallback(WhenHideWindow)
     }
})

window.addEventListener('focus', async function () {
     WindowVisible = true
     RunAllCallback(WhenFocusWindow)
})

window.addEventListener('blur', function () {
     WindowVisible = false
})

async function IsWindowVisible() {
     return WindowVisible
}

async function AddWhenShowWindow(callback) {
     WhenShowWindow.push(callback)
}

async function AddWhenHideWindow(callback) {
     WhenHideWindow.push(callback)
}

async function AddWhenFocusWindow(callback) {
     WhenFocusWindow.push(callback)
}