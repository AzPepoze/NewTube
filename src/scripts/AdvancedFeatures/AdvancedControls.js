async function OnChangeButton(id, EnableCallBack, DisableCallback, Swap) {

     var Enabled = false

     if (Swap) {
          [EnableCallBack, DisableCallback] = [DisableCallback, EnableCallBack]
     }

     async function OnButtonChange() {
          if (await Load("EnableButton")) {

               var IsEnable = await Load(id)
               if (Swap) {
                    IsEnable = !IsEnable
               }

               if (IsEnable) {
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