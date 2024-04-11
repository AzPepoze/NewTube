async function OnChangeButton(id, EnableCallBack, DisableCallback) {

     var Enabled = false

     async function OnButtonChange() {
          if (await Load("EnableButton")) {
               if (await Load(id)) {
                    if (!Enabled) {
                         Enabled = true
                         EnableCallBack()
                    }
               } else {
                    if (Enabled) {
                         Enabled = false
                         DisableCallback()
                    }
               }
          } else {
               if (Enabled) {
                    Enabled = false
                    DisableCallback()
               }
          }
     }

     OnButtonChange()
     AddOnChangeFunction(id, OnButtonChange)
     AddOnChangeFunction("EnableButton", OnButtonChange)
}