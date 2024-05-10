var OnSettingChange = {}

async function RunOnChange(Name) {
     var OnChangeFunction = GetOnChangeFunction(Name)

     if (OnChangeFunction) {
          for (var callback of OnChangeFunction) {
               await callback()
          }
     }

     var OnChangeSettingUI = GetOnChangeSettingUI(Name)

     if (OnChangeSettingUI) {
          for (var callback of OnChangeSettingUI) {
               await callback()
          }
     }
}

async function RunUpdateSettingCSS(Name) {
     var ThisSettingCSSFunction = await GetSettingFunction(Name)

     if (ThisSettingCSSFunction) {

          console.log(ThisSettingCSSFunction)

          if (ThisSettingCSSFunction["AutoUpdate"] === true) {
               return false
          }

          if (ThisSettingCSSFunction["AutoAddCSS"] == true) {
               UpdateSettingCSS(Name)
               return true
          }

          if (ThisSettingCSSFunction["AutoUpdate"] === false) {
               return true
          }
     }

     return false
}

async function SetSetting(Name, Value) {
     if (DebugMode) {
          console.log("Set", Name, Value)
     }

     await Save(Name, Value)
     await RunOnChange(Name)

     if (await RunUpdateSettingCSS(Name)) {
          return
     }

     console.log(`*${Name}*`)
     update()
}

async function RunAllOnChange() {
     for (var Name in OnSettingChange) {
          RunOnChange(Name)
     }
}

async function AddOnChangeFunction(id, callback) {
     CheckOnChangeID(id)
     CheckOnChangeFunction(id)

     GetOnChangeFunction(id).push(callback)
}

async function ClearOnChangeSettingUI() {
     Object.keys(OnSettingChange).forEach(id => {
          delete GetOnChangeSettingUI(id)
     });
}

function CheckOnChangeID(id) {
     if (OnSettingChange[id] == null) {
          OnSettingChange[id] = {}
     }
}

async function CheckOnChangeFunction(id) {
     if (GetOnChangeFunction(id) == null) {
          OnSettingChange[id]["Function"] = []
     }
}

async function CheckOnChangeSettingUI(id) {
     if (GetOnChangeSettingUI(id) == null) {
          OnSettingChange[id]["SettingUI"] = []
     }
}

function GetOnChangeFunction(id) {
     if (OnSettingChange[id]) {
          return OnSettingChange[id]["Function"]
     } else {
          return null
     }
}

function GetOnChangeSettingUI(id) {
     if (OnSettingChange[id]) {
          return OnSettingChange[id]["SettingUI"]
     } else {
          return null
     }
}