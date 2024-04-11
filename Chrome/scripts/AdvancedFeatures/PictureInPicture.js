var PipMode = false

function EnterPip() {
    PipMode = true
}

function LeavePip() {
    PipMode = false
    requestAnimationFrame(StartDraw)
}