async function MissingSetTo(Name, Value) {

    if (!NewtubeAllSaveKey.includes(Name)) {
        NewtubeAllSaveKey.push(Name)
    }

    let ThisLoad = await GetLoad(Name)
    if (ThisLoad == null || (ThisLoad.constructor === Object && Object.keys(ThisLoad).length == 0)) {
        await Save(Name, Value)
    }
}

async function MissingSetTo_Color(THIS, Color, Opa) {
    await MissingSetTo(THIS + 'C', Color)
    await MissingSetTo(THIS + 'O', Opa)
}

async function AddMissingSave() {
    await MissingSetTo("PRESET", {})
    await SetNormalPre()

    await MissingSetTo("CUSTOM", ``)
    await MissingSetTo("ADDCUSTOM", ``)

    await MissingSetTo("Font",{})

    await MissingSetTo("ADDScript", ``)

    await MissingSetTo("NewUser", true)
}