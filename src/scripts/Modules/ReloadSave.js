var CanReloadSave = true

async function ReloadSave() {
     if (!CanReloadSave) return
     await LoadCached()
     await RunAllOnChange()
     update()
}

AddWhenFocusWindow(ReloadSave)