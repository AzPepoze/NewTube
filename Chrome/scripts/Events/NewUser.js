async function NewUser() {
      await Save("OldVer", Ver)

      update()
      ShowPreset()
      await Save("NewUser", false)

      await sleep(200)
}