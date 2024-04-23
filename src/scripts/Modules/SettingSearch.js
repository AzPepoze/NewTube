function GetMainSetting(thisElement) {
     var ParElement = thisElement.parentElement
     if (ParElement == NewtubeSetting) {
          return thisElement
     } else {
          return GetMainSetting(ParElement)
     }
}

var NewtubeSearch

async function StartSearch() {
     var SearchText = NewtubeSearch.value
     var RegExpText = new RegExp(SearchText, "gi")
     var All = NewtubeSetting.getElementsByClassName("DES")

     var AllMain = NewtubeSetting.childNodes

     var DefaultDisplay = ""

     AllMain.forEach(element => {
          if (element != NewtubeSearch) {
               element.style.display = "none"
          }

          if (SearchText == "") {
               element.style.display = DefaultDisplay
          }
     })

     for (let index = 0; index < All.length; index++) {
          var element = All[index]
          console.log(element)
          var ThisCheckMainSetting = GetMainSetting(element)
          console.log(ThisCheckMainSetting)
          var inner = element.innerHTML

          inner = inner.replaceAll("<mark>", '')
          inner = inner.replaceAll("</mark>", '')

          if (SearchText == "") {
               ThisCheckMainSetting.style.display = DefaultDisplay
          } else {
               // if (inner.search(SearchText) >= 0) {
               //     ThisCheckMainSetting.style.display = ""
               // }

               inner = inner.replace(RegExpText, function name(match) {
                    ThisCheckMainSetting.style.display = DefaultDisplay
                    return `<mark>${match}</mark>`
               })
          }

          element.innerHTML = inner

     }
}

async function CreateNewtubeSearch() {
     NewtubeSearch = document.createElement('input')
     NewtubeSearch.id = "NtSearch"
     NewtubeSearch.placeholder = "🔍 Search"
     NewtubeRightSetting.appendChild(NewtubeSearch)

     if (in_Setting_Page) {
          NewtubeSearch.style.top = "5px"
     }

     var changing = 0
     NewtubeSearch.addEventListener("input", async function () {
          changing += 1
          setTimeout(() => {
               changing -= 1
               if (changing == 0) {
                    StartSearch()
               }
          }, 100);
     })
}