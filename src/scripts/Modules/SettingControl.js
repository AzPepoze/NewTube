var NewtubeSetting,
    NewtubeMain,
    LeftCount,
    NewtubeLeftSetting,
    NewtubeRightSetting,
    DefaultSettingTransition = "opacity 0.5s, transform 0.5s, left 0.5s",
    DragingSettingTransition = "opacity 0.5s, transform 0.5s"

async function OpenSetting(animation) {
    if (inIframe) return
    if (NewtubeMain == null) {
        await sleep(100)
        return await OpenSetting(animation)
    }

    if (in_Setting_Page) {

    } else {
        NewtubeMain.style.left = '100%'
    }


    await sleep(1)


    if (in_Setting_Page) {
        NewtubeMain.style.width = "100%"
        NewtubeMain.style.height = "100%"
        NewtubeMain.style.top = "0"
        NewtubeMain.style.left = "0"

        NewtubeMain.style.padding = "0"
        NewtubeMain.style.resize = "none"
        NewtubeMain.style.borderRadius = "0"
    } else {
        NewtubeMain.style.left = 'calc(100% - 755px - 10px)'

        NewtubeMain.style.width = '755px'
        NewtubeMain.style.height = '600px'
    }



    NewtubeMain.setAttribute("Open", "true")

    await sleep(1000)
}

async function CloseSetting(Remove) {
    if (NewtubeMain == null) {
        await sleep(100)
        return await CloseSetting(animation)
    }

    NewtubeMain.setAttribute("Open", "false")

    if (Remove) {
        if (WatchNewtubeSettingScrollObserver) {
            NewtubeSetting.removeEventListener("scroll", CheckSettingWhenScroll)
            WatchNewtubeSettingScrollObserver = undefined
        }
        var OldNewtubeMain = NewtubeMain
        setTimeout(() => {
            OldNewtubeMain.remove()
        }, 1000);

        ClearOnChangeSettingUI()

        NewtubeMain = null
    }
}

var ClickSettingCoolDown = false

async function clickSetting() {
    if (ClickSettingCoolDown == true) {
        return
    }

    ClickSettingCoolDown = true

    if (NewtubeMain) {
        CloseSetting(true)
    } else {
        CreateSetting()
        OpenSetting(true)
    }

    await sleep(500)
    ClickSettingCoolDown = false
}

async function AppendSetting() {
    if (document.body) {
        document.body.append(NewtubeMain)
    } else {
        await sleep(100)
        return AppendSetting()
    }
}

async function CreateSetting() {
    console.log("Create Setting")

    LeftCount = 0

    if (await GetLoad("RealtimeT") == true) {
        MODE = 'input'
    } else {
        MODE = 'change'
    }

    NewtubeMain = document.createElement("div")
    NewtubeMain.id = "NEWTUBEBG"
    NewtubeMain.className = "NEWTUBE"

    NewtubeMain.style.transition = DefaultSettingTransition

    NewtubeMain.setAttribute("Open", "Prepare")

    if (!in_Setting_Page) {
        let MoveBar = document.createElement("div")
        MoveBar.innerHTML = "="
        MoveBar.id = "NEWTUBEHOVER"
        NewtubeMain.appendChild(MoveBar)

        let CalMousePo = null

        async function MoveToMouse(Mouse) {
            Mouse.preventDefault();
            NewtubeMain.style.left = Mouse.clientX - CalMousePo[0] + "px"
            NewtubeMain.style.top = Mouse.clientY - CalMousePo[1] + "px"
        }

        MoveBar.onmousedown = async function (Mouse) {
            WidnowW = window.innerWidth
            CalMousePo = [Mouse.clientX - NewtubeMain.offsetLeft, Mouse.clientY - NewtubeMain.offsetTop]
            NewtubeMain.style.transition = DragingSettingTransition
            addEventListener("mousemove", MoveToMouse)
        }

        document.onmouseup = async function () {
            if (NewtubeMain == null) {
                return
            }
            NewtubeMain.style.transition = DefaultSettingTransition
            removeEventListener("mousemove", MoveToMouse)
        }

        var CloseButton = document.createElement("div")
        CloseButton.id = "CloseButton"
        NewtubeMain.appendChild(CloseButton)
        CloseButton.style = `
        position: absolute;
        width: 30px;
        height: 30px;
        top: 5px;
        right: 5px;
        color: white;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        cursor: pointer; 
        transition: all 0.2s ease 0s;
        border: 1px solid #ffffff47;`

        CloseButton.onclick = clickSetting

        var CloseImage = document.createElement("img")
        CloseImage.src = chrome.runtime.getURL("asset/Close.png")
        CloseImage.style = `
        filter: invert(1);
        height: 50%;
        pointer-events: none;`

        CloseButton.append(CloseImage)
    }


    NewtubeLeftSetting = document.createElement("div")
    NewtubeLeftSetting.id = "NEWTUBELIST"
    NewtubeLeftSetting.className = "NEWTUBE"
    NewtubeLeftSetting.style = `
    width: 210px;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    min-width: 210px;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 10%));
    margin: 10px;
    margin-top:0px;
    padding-block: 10px;
    scrollbar-color: rgb(137 137 137) transparent !important;
    resize: horizontal;
    transform: translateZ(0);`

    NewtubeMain.appendChild(NewtubeLeftSetting)

    NewtubeRightSetting = document.createElement("div")
    NewtubeRightSetting.id = "NEWTUBERight";
    NewtubeMain.appendChild(NewtubeRightSetting)

    NewtubeSetting = document.createElement("body")
    NewtubeSetting.id = "NEWTUBE";
    NewtubeSetting.className = "NEWTUBE"
    NewtubeSetting.style = `
    width: -webkit-fill-available;
    height: calc(100% - 50px);
    margin-top: 50px;
    margin-bottom: 0px;`
    NewtubeRightSetting.appendChild(NewtubeSetting)

    await CreateNewtubeSearch()

    await AppendSetting()

    await CreateSettingElement()
}

var Category
var OldCategory
var CategoryElement

var SubCategory
var OldSubCategory
var SubCategoryElement

var RainbowCategory

var NowLeftCategory

var NewFeature

function CreateMainFrame() {

    var GenID = makeid(10)

    CategoryElement = document.createElement("div");
    CategoryElement.className = "MainBox";
    CategoryElement.id = GenID

    var DefaultLabelStyle = `
    width: -webkit-fill-available;
    font-size: 18px;
    padding: 10px;
    margin-inline: -10px;
    background: radial-gradient(at center top, rgb(255 255 255), #ffffff9e);
    text-align: center;
    border-radius: 20px;
    color: black !important;
    text-shadow: 0px 0px 0px black;
    margin-bottom: 10px;`

    var LabelCategory = document.createElement('label');
    LabelCategory.className = "DES"
    LabelCategory.innerHTML = Category
    LabelCategory.style = DefaultLabelStyle

    if (RainbowCategory) {
        LabelCategory.style = DefaultLabelStyle + `
        text-stroke: 1px black;
        text-shadow: white 0px 0px 3px;
        color: black !important;
        background: linear-gradient(45deg, rgb(255, 0, 0), rgb(255, 115, 0), rgb(255, 251, 0), rgb(72, 255, 0), rgb(0, 255, 213), rgb(0, 43, 255), rgb(122, 0, 255), rgb(255, 0, 200), rgb(255, 0, 0)) 0% 0% / 400%;
        animation: 20s linear 0s infinite normal none running glowing;
        `
    }


    CategoryElement.appendChild(LabelCategory)

    var LeftCategory = document.createElement('label');
    NowLeftCategory = LeftCategory
    LeftCategory.id = GenID
    LeftCategory.className = "HoverList"
    LeftCategory.innerHTML = `<div class="NewtubeLeftText">${Category}</div>`

    LeftCategory.style = `
    position:relative;
    width: -webkit-fill-available;
    padding: 10px;
    color: white;
    
    margin-top: 10px;
    opacity:0;`

    setTimeout(() => {
        LeftCategory.style.opacity = "1"
        LeftCategory.style.marginTop = "-3px"
    }, 70 * LeftCount);

    LeftCount++

    // document.getElementById("NEWTUBEBG").style.maxHeight = (LeftCount * 41) + "px"

    var ScrollToElement = CategoryElement

    LeftCategory.onclick = async function () {
        ScrollToElement.scrollIntoView({ behavior: 'smooth' });
    }

    NewtubeSetting.appendChild(CategoryElement)
    NewtubeLeftSetting.appendChild(LeftCategory)

    return CategoryElement
};

function CreateSubFrame() {
    SubCategoryElement = document.createElement("div")
    SubCategoryElement.style = `
    padding-inline: 10px;
    `
};

function CreateNew(E) {
    var New = document.createElement("p")
    E.append(New)
    New.className = "New"

    New.innerHTML = "N"

    New.style = `
        position: absolute;
        top: -3.5px;
        left: 0px;
        width: 20px;
        height: 20px;
        background: #ff1308;
        border-radius: 3px;
        foweight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;`
}

async function CheckNewtubeSetting() {
    if (NewtubeSetting == null) {
        await sleep(100)
        return await CheckNewtubeSetting()
    }

    if (Category != OldCategory) {
        CreateMainFrame()
        OldCategory = Category
    }

    if (SubCategory != OldSubCategory) {
        CreateSubFrame()
        OldSubCategory = SubCategory
    }
}

async function CreateFrame() {
    await CheckNewtubeSetting()

    var Frame = document.createElement("div")

    Frame.style = `
    margin-block: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: -webkit-fill-available;
    padding-block:10px;
    position:relative;
    `

    if (SubCategoryElement) {
        SubCategoryElement.append(Frame)
    } else if (CategoryElement) {
        CategoryElement.append(Frame)
    } else {
        NewtubeSetting.append(Frame)
    }

    if (NewFeature) {
        CreateNew(Frame)
        CreateNew(NowLeftCategory)
    }

    return Frame
}

function UpgradeFrame(Frame) {
    Frame.style.background = "linear-gradient(45deg,  rgba(255, 255, 255, 0.1), transparent)"
    Frame.style.borderRadius = "20px"
    Frame.style.paddingInline = "5px"
}

function CreateDescription(description, Frame) {
    var DescriptionElement = document.createElement("div")

    DescriptionElement.className = "DES"
    DescriptionElement.innerHTML = description

    if (Frame) {
        Frame.append(DescriptionElement)
    }

    return DescriptionElement
}

async function NewtubeFindElementByID(id) {
    return NewtubeSetting.querySelector(`#${id}`)
}

var WatchNewtubeSettingScrollObserver
var AllMainBox

function CheckSettingWhenScroll() {

    var NowSelect = {
        element: null,
        distance: Infinity
    }

    for (let element of AllMainBox) {
        var GetLeftElement = NewtubeLeftSetting.querySelector(`#${element.id}`)
        var Distance = DistanceFromRootTop(element, NewtubeSetting)

        if (!NowSelect.element || NowSelect.distance > Distance) {

            if (NowSelect.element) {
                NowSelect.element.removeAttribute("selected")
            }

            NowSelect = {
                element: GetLeftElement,
                distance: Distance
            }

            GetLeftElement.setAttribute("selected", "true")

        } else {
            GetLeftElement.removeAttribute("selected")
        }
    }
}

async function WatchNewtubeSettingScroll() {
    AllMainBox = NewtubeSetting.getElementsByClassName("MainBox")

    WatchNewtubeSettingScrollObserver = NewtubeSetting.addEventListener("scroll", CheckSettingWhenScroll)

    CheckSettingWhenScroll()
}