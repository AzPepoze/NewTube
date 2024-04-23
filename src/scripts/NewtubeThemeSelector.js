let GetURL = window.location.href

if (GetURL.includes("callbyNewtube")) {
    console.log("Run Theme")

    document.documentElement.style.background = "transparent"

    let Loading = document.createElement('div')
    Loading.style = `
    width: 100%;
    height: 100%;
    background: black;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 20px;
    flex-direction: row;
    align-content: center;
    z-index:100;
    transition: all 1s;
    `
    document.documentElement.append(Loading)

    let Logo = document.createElement('img')
    Logo.src = chrome.runtime.getURL('icon/128.png')
    Logo.style = `
    width: 20%;
    height: 20%;
    object-fit: contain;
    `

    Loading.append(Logo)

    let MainElement

    function FindMainElement() {
        document.title = "Newtube - Themes store"

        let GetIcon = chrome.runtime.getURL('icon/128.png')
        icon = document.getElementsByTagName('link')
        Array.from(icon).forEach(e => {
            if (e.getAttribute('rel') == "icon" || e.getAttribute('rel') == "shortcut icon") {
                e.href = GetIcon
            }
        })

        MainElement = document.getElementById("__next")
        if (MainElement == null) {
            setTimeout(() => {
                FindMainElement()
            }, 100);
        } else {
            MainElement.style = `display:none !important;`

            let TimeLine
            function GetTimeLine() {
                TimeLine = MainElement.getElementsByClassName("gsc-timeline")[0]
                if (TimeLine == null) {
                    setTimeout(() => {
                        GetTimeLine()
                    }, 100);
                } else {

                    document.title = "Newtube - Themes store"

                    Loading.style.opacity = 0
                    Loading.style.pointerEvents = "none"
                    setTimeout(() => {
                        Loading.remove()
                    }, 1000);

                    var css = `
                    .ntframe,
                    .Button{
                        border: solid 1px transparent;
                        transition: all 0.2s;
                        cursor: context-menu;
                    }

                    .ntframe:hover{
                        border-color: grey;
                    }

                    .Button:hover{
                        border-color: white !important;
                    }

                    /* width */
                    ::-webkit-scrollbar {
                    width: 2px;
                    height: 5px;
                    }

                    /* Track */
                    ::-webkit-scrollbar-track {
                    background: rgb(30 30 30);
                    }

                    /* Handle */
                    ::-webkit-scrollbar-thumb {
                    background: white;
                    border-radius: 10px;
                    }

                    /* Handle on hover */
                    ::-webkit-scrollbar-thumb:hover {
                    background: white;
                    }
                    `
                    var style = document.createElement('style')

                    if (style.styleSheet) {
                        style.styleSheet.cssText = css
                    } else {
                        style.appendChild(document.createTextNode(css))
                    }

                    document.head.appendChild(style);
                    //----------------------------------------------------------------------

                    let ThemeSelecter = document.createElement("div")
                    ThemeSelecter.style = `
                    width: 100%;
                    height: 100%;
                    background: rgb(20,20,20);
                    position: absolute;
                    overflow-y: scroll;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    padding-top: 20px;
                    flex-direction: row;
                    align-content: flex-start;
                    `
                    document.body.append(ThemeSelecter)




                    //----------------------------------------------------------------------

                    function CreateTheme(Comment) {
                        console.log(Comment)
                        let CommentContent = Comment.getElementsByClassName("gsc-comment-content")[0]

                        console.log(CommentContent)

                        let GetUpVote = Comment.getElementsByClassName("gsc-social-reaction-summary-item-count")[0].textContent
                        let GetAuthor = Comment.getElementsByClassName("gsc-comment-author-avatar")[0].getElementsByTagName("span")[0].textContent
                        let GetAvatar = Comment.getElementsByClassName("gsc-comment-author-avatar")[0].getElementsByTagName("img")[0].src
                        let GetLink = Comment.getElementsByClassName("link-secondary")[0].href
                        let GetName
                        let GetDes
                        let GetThumbnail
                        let GetPictures = []
                        let GetCode = JSON.parse(CommentContent.getElementsByTagName("code")[0].textContent)

                        Array.from(CommentContent.getElementsByTagName("p")).forEach(ThisPart => {
                            let GetText = ThisPart.textContent
                            if (ThisPart.id == "user-content-nt-name") {
                                GetName = ThisPart.textContent.replace("\n", "")
                            }
                            if (ThisPart.id == "user-content-nt-description") {
                                GetDes = ThisPart.textContent.replace("\n", "")
                            }
                            if (GetText.includes("^thumbnail")) {
                                var GetThumbnail_Element = ThisPart.getElementsByTagName("img")[0]
                                if (GetThumbnail_Element) {
                                    GetThumbnail = GetThumbnail_Element.src
                                }

                            }
                            if (GetText.includes("^pictures")) {
                                GetPics = ThisPart.getElementsByTagName("img")
                                Array.from(GetPics).forEach(element => {
                                    GetPictures.push(element.src)
                                });
                            }
                        })

                        //----------------------------------------------------------------------

                        let Frame = document.createElement("div")
                        Frame.style = `
                        min-width: 350px;
                        max-width: 350px;
                        display: flex;
                        background: rgb(255 255 255 / 11%);
                        border-radius: 10px;
                        margin: 10px;
                        position: relative;
                        padding: 10px;
                        flex-direction: column;
                        border: 1px solid;
                        border-color: rgb(255 255 255 / 51%);
                        `
                        Frame.className = "ntframe"
                        ThemeSelecter.append(Frame)

                        //----------------------------------------------------------------------

                        let MainImage = document.createElement("div")
                        MainImage.style = `
                        object-fit: contain;
                        width: 330px;
                        border-radius: 10px;
                        height: 210px;
                        aspect-ratio: 16 / 9;
                        overflow-x: scroll;
                        scroll-snap-type: x mandatory;
                        display: flex;
                        flex-flow: row;
                        align-items: center;
                        `
                        Frame.append(MainImage)

                        MainImage.addEventListener("wheel", function (e) {
                            if (e.deltaY > 0) {
                                MainImage.scrollTo({
                                    top: 0,
                                    left: MainImage.scrollLeft + 330,
                                    behavior: "smooth",
                                });
                            }
                            else {
                                MainImage.scrollTo({
                                    top: 0,
                                    left: MainImage.scrollLeft - 330,
                                    behavior: "smooth",
                                });
                            }
                            e.preventDefault();
                        }, { passive: false });

                        GetPictures.unshift(GetThumbnail)

                        Array.from(GetPictures).forEach(element => {
                            let Thumbnail = document.createElement("img")
                            Thumbnail.style = `
                            object-fit: contain;
                            width: 100%;
                            border-radius: 10px;
                            height: fit-content;
                            aspect-ratio: 16/9;
                            scroll-snap-align: center;
                            `
                            Thumbnail.src = element
                            MainImage.append(Thumbnail)
                        });

                        //----------------------------------------------------------------------

                        let ThemeName = document.createElement("div")
                        ThemeName.style = `
                        text-wrap: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        font-size: x-large;
                        font-family: monospace;
                        margin-top:10px;
                        `
                        ThemeName.innerText = GetName
                        ThemeName.title = GetName
                        Frame.append(ThemeName)

                        //----------------------------------------------------------------------

                        let Vote = document.createElement("div")
                        Vote.className = "Button"
                        Vote.style = `
                        text-wrap: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        font-family: monospace;
                        margin-top:10px;
                        background: #1c1c1c;
                        border: 1px solid;
                        border-color: rgb(255 255 255 / 51%);
                        width: fit-content;
                        padding-inline: 10px;
                        border-radius: 10px;
                        font-size: large;
                        `
                        Vote.innerText = "⏫ " + GetUpVote
                        Frame.append(Vote)

                        Vote.onclick = async function () {
                            window.open(GetLink)
                        }

                        //----------------------------------------------------------------------

                        let AuthorContainer = document.createElement("div")
                        AuthorContainer.style = `
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        margin-top: 10px;
                        margin-bottom: 20px;
                        `
                        Frame.append(AuthorContainer)

                        let ThemeAvatar = document.createElement("img")
                        ThemeAvatar.style = `
                        width:30px;
                        height:30px;
                        border-radius:40px;
                        `
                        ThemeAvatar.src = GetAvatar
                        AuthorContainer.append(ThemeAvatar)

                        let ThemeAuthor = document.createElement("div")
                        ThemeAuthor.style = `
                        text-wrap: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        font-size: medium;
                        font-family: monospace;
                        color: #ff87b8;
                        font-weight: bolder;
                        margin-left: 10px;
                        `
                        ThemeAuthor.innerText = GetAuthor
                        AuthorContainer.append(ThemeAuthor)

                        //----------------------------------------------------------------------

                        if (GetDes != null && GetDes.replaceAll("\n", "") != "") {
                            let ThemeDes = document.createElement("div")
                            ThemeDes.style = `
                            text-wrap: wrap;
                            font-size: medium;
                            font-family: monospace;
                            color: white;
                            padding: 10px;
                            background: #1c1c1c;
                            border-radius: 10px;
                            margin-bottom: 20px;
                            max-height: 100px;
                            overflow-y: scroll;
                            `
                            ThemeDes.innerText = GetDes
                            Frame.append(ThemeDes)
                        }

                        //----------------------------------------------------------------------

                        let Install = document.createElement("div")
                        Install.className = "Button"
                        Install.style = `
                        text-wrap: wrap;
                        font-size: medium;
                        font-family: monospace;
                        color: white;
                        padding: 10px;
                        background: rgb(39 91 43);
                        border-radius: 10px;
                        margin-top: 5px;
                        max-height: 100px;
                        text-align: center;
                        margin-top: auto;
                        `
                        Install.innerText = "❇️ Install ❇️ (Replace Your theme)"
                        Frame.append(Install)

                        Install.onclick = async function () {
                            Install.innerText = "Installing..."
                            let ThisTheme = GetCode
                            ThisTheme = await ConvertToNewSave(ThisTheme)

                            console.log(ThisTheme)

                            var NowCached = await Load()

                            Object.keys(ThisTheme).forEach(async function (key) {
                                if (CheckCanSaveForThemeSelector(key)) {
                                    NowCached[key] = ThisTheme[key]
                                    console.log("Added", key)
                                }
                            })

                            console.log(NowCached)

                            await SaveCached(NowCached)

                            chrome.runtime.sendMessage("ReloadSave")
                            Install.innerText = "❇️ Installed! ❇️"

                            setTimeout(() => {
                                Install.innerText = "❇️ Install ❇️ (Replace Your theme)"
                            }, 1000);
                        }

                        //----------------------------------------------------------------------

                        let Save = document.createElement("div")
                        Save.className = "Button"
                        Save.style = `
                        text-wrap: wrap;
                        font-size: medium;
                        font-family: monospace;
                        color: white;
                        padding: 10px;
                        background: rgb(105 89 33);
                        border-radius: 10px;
                        margin-top: 5px;
                        max-height: 100px;
                        text-align: center;
                        `
                        Save.innerText = "✨ Save as preset ✨ (Add to your preset)"
                        Frame.append(Save)

                        Save.onclick = async function () {
                            Save.innerText = "Saving..."
                            let AzCached
                            await chrome.storage.local.get("CachedSave").then((Loaded) => {
                                AzCached = Loaded["CachedSave"]
                            })

                            let GetPreset = AzCached["PRESET"]
                            GetPreset[GetName] = GetCode

                            AzCached["PRESET"] = GetPreset

                            await chrome.storage.local.set({ "CachedSave": AzCached })
                            Save.innerText = "✨ Saved! ✨"

                            setTimeout(() => {
                                Save.innerText = "✨ Save as preset ✨ (Add to your preset)"
                            }, 1000);
                        }

                        let Link = document.createElement("div")
                        Link.className = "Button"
                        Link.style = `
                        text-wrap: wrap;
                        font-size: medium;
                        font-family: monospace;
                        color: white;
                        padding: 10px;
                        background: rgb(163 94 154);
                        border-radius: 10px;
                        margin-top: 5px;
                        max-height: 100px;
                        text-align: center;
                        `
                        Link.innerHTML = "🎉 Go to post 🎉<br>(to say something to this theme author)"
                        Frame.append(Link)

                        Link.onclick = async function () {
                            window.open(GetLink)
                        }

                        let ThemeColor = GetCode["ThemeC"]
                        let BGColor = GetCode["BGC"]

                        if (ThemeColor && BGColor) {
                            ThemeAuthor.style.color = ThemeColor
                            Frame.style.background = BGColor
                            Frame.style.borderColor = ThemeColor
                            Vote.style.borderColor = ThemeColor
                            ThemeName.style.color = ThemeColor
                        }

                    }

                    //----------------------------------------------------------------------

                    var observer = new MutationObserver(function (mutations) {
                        console.log(mutations)
                        Array.from(mutations).forEach(mutation => {
                            Array.from(mutation.addedNodes).forEach(element => {
                                if (element.className = "gsc-comment") {
                                    CreateTheme(element)
                                }
                            });
                        })
                    });

                    observer.observe(TimeLine, { attributes: false, childList: true, characterData: false, subtree: true });

                    console.log(MainElement)

                    console.log(MainElement.getElementsByClassName("gsc-comment"))
                    Array.from(MainElement.getElementsByClassName("gsc-comment")).forEach(element => {
                        CreateTheme(element)
                    });


                }
            }

            GetTimeLine()
        }
    }

    FindMainElement()
}