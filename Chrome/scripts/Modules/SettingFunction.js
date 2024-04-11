var SettingFuction = {}

function ADDargs(args) {
    args.Category = Category
    args.SubCategory = SubCategory
    args.RainbowCategory = RainbowCategory
    return args
}

function CheckUpdateFunction(ThisType) {
    if (SettingFuction[ThisType] == null) {
        SettingFuction[ThisType] = {}
    }
}

async function SetDefaultValueByArgs(args) {
    if (args.Default == null) {
        return
    }
    await MissingSetTo(args.id, args.Default)
}

async function CreateFeatures(ThisType, args) {

    if (!args) {
        args = {}
    }

    if (ThisType == "ColorPicker") {
        await MissingSetTo(args.id + "C", args.Default.Color)
        await MissingSetTo(args.id + "O", args.Default.Opacity)
    } else {
        await SetDefaultValueByArgs(args)
    }

    args = ADDargs(args)

    if (ThisType == "Check" || ThisType == "NumberBox" || ThisType == "ColorPicker" || ThisType == "Select" || ThisType == "CombinationFunc" || ThisType == "NumberSlide") {
        CheckUpdateFunction(ThisType)
    }

    //----------------------------------------------------------------------------

    if (ThisType == "Check") {
        var enable = args.enable
        var disable = args.disable
        var AutoAddCSS = args.AutoAddCSS

        //--------------------------------

        if (enable == null) {
            enable = ''
        }

        if (disable == null) {
            disable = ''
        }

        if (enable == '' && disable == '' && AutoAddCSS == null) {
            AutoAddCSS = false
            args.AutoUpdate = true
        } else {
            if (AutoAddCSS == null || AutoAddCSS == true) {
                AutoAddCSS = true
                args.AutoUpdate = false
            } else {
                AutoAddCSS = false
                args.AutoUpdate = true
            }
        }

        SettingFuction[ThisType][args.id] = {
            true: enable,
            false: disable,
            AutoAddCSS: AutoAddCSS,
            AutoUpdate: args.AutoUpdate
        }
    }

    //----------------------------------------------------------------------------

    if (ThisType == "Button") {
        if (args.align == null) {
            args.align = "center"
        }

        if (args.align == "left") {
            args.align = "flex-start"
        }

        if (args.color == null) {
            args.color = "white"
        }

        if (args.bg == null) {
            args.bg = "#ffffff14"
        }

        if (args.border == null) {
            args.border = "#a6a6a6"
        }
    }

    //----------------------------------------------------------------------------

    if (ThisType == "JustText") {
        if (args.align == null) {
            args.align = "center"
        }

        if (args.align == "left") {
            args.align = "flex-start"
        }
    }

    //----------------------------------------------------------------------------

    if (ThisType == "TextArea") {
        if (args.innerHTML == null) {
            args.innerHTML = ""
        }
    }

    //----------------------------------------------------------------------------

    if (ThisType == "NumberBox") {

        if (args.CSSFunc) {
            args.AutoAddCSS = true
        }

        if (args.CSSFunc == null && args.AutoUpdate == null) {
            args.AutoUpdate = true
        }

        SettingFuction[ThisType][args.id] = {
            CSSFunc: args.CSSFunc,
            AutoAddCSS: args.AutoAddCSS,
            AutoUpdate: args.AutoUpdate
        }
    }

    //----------------------------------------------------------------------------

    if (ThisType == "Select") {

        if (!args.AutoUpdate) {
            if (args.ItemsCSS) {
                args.AutoAddCSS = true
            } else {
                args.AutoAddCSS = false
                args.AutoUpdate = true
            }
        }

        SettingFuction[ThisType][args.id] = {
            ...args.ItemsCSS,
            AutoAddCSS: args.AutoAddCSS,
            AutoUpdate: args.AutoUpdate
        }

    }

    //----------------------------------------------------------------------------

    if (ThisType == "CombinationFunc") {

        if (args.CSSFunc) {
            args.AutoAddCSS = true
        }

        SettingFuction[ThisType][args.id] = {
            CSSFunc: args.CSSFunc,
            AutoAddCSS: args.AutoAddCSS
        }

        for (var id of args.multi_id) {
            AddOnChangeFunction(id, async function () {
                await RunUpdateSettingCSS(args.id)
            })
        }

    }

    //----------------------------------------------------------------------------

    if (ThisType == "NumberSlide") {

        if (args.CSSFunc) {
            args.AutoAddCSS = true
        } else {
            args.AutoAddCSS = false
            args.AutoUpdate = true
        }

        SettingFuction[ThisType][args.id] = {
            CSSFunc: args.CSSFunc,
            AutoAddCSS: args.AutoAddCSS,
            AutoUpdate: args.AutoUpdate
        }
    }

    //----------------------------------------------------------------------------

    if (ThisType == "ColorPicker") {

        if (args.CSSFunc) {
            args.AutoAddCSS = true
            args.AutoUpdate = false
        } else {
            args.AutoAddCSS = false
            args.AutoUpdate = true
        }

        SettingFuction[ThisType][args.id] = {
            CSSFunc: args.CSSFunc,
            AutoAddCSS: args.AutoAddCSS,
            AutoUpdate: args.AutoUpdate
        }

        SettingFuction[ThisType][args.id + "C"] = {
            AutoAddCSS: false,
            AutoUpdate: args.AutoUpdate
        }

        SettingFuction[ThisType][args.id + "O"] = {
            AutoAddCSS: false,
            AutoUpdate: args.AutoUpdate
        }

        AddOnChangeFunction(args.id + "C", async function () {
            await RunUpdateSettingCSS(args.id)
        })

        AddOnChangeFunction(args.id + "O", async function () {
            await RunUpdateSettingCSS(args.id)
        })
    }

    //----------------------------------------------------------------------------

    delete args.AutoAddCSS
    delete args.AutoUpdate
    delete args.CSSFunc
    delete args.true
    delete args.false

    AddSettingUI(ThisType, args)
}

function GetSettingFunction(Name) {
    for (var ThisTypeName in SettingFuction) {
        var ThisFeature = SettingFuction[ThisTypeName][Name]
        if (ThisFeature) {

            ThisFeature["FeatureType"] = ThisTypeName

            return ThisFeature

        }
    }
}

async function GetSettingCSS(Name) {

    let GetLoad = await Load(Name)

    var ThisFeature = GetSettingFunction(Name)
    var ThisTypeName = ThisFeature.FeatureType

    if (ThisTypeName == "Check" || ThisTypeName == "Select") {
        return ThisFeature[GetLoad]
    }

    if (ThisFeature.CSSFunc) {
        return await ThisFeature.CSSFunc()
    }
}