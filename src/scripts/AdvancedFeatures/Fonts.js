var FontHolder;
var EnableFontHolder;

async function CreateFontHolder() {
	FontHolder = document.createElement("link");
	FontHolder.id = "NewtubeAddFont";

	EnableFontHolder = document.createElement("style");
	EnableFontHolder.id = "NewtubeEnableFont";

	if (DebugMode) {
		console.log(EnableFontHolder);
	}

	var Head = await GetDocumentHead();
	Head.append(FontHolder);
	Head.append(EnableFontHolder);
}

var OldFont = {};

async function UpdateAllFont() {
	//await WaitDocumentLoaded()
	await LoadFonts();

	if ((await Load("EnableButton")) && OldFont == JSON.stringify(Font)) {
		return;
	}

	if (!FontHolder || !EnableFontHolder) {
		await CreateFontHolder();
	}

	if (await Load("EnableButton")) {
		OldFont = JSON.stringify(Font);

		var FontHolderHTML = "";

		for (var ThisFontOBJ of Object.values(Font)) {
			if (DebugMode) {
				console.log(ThisFontOBJ.Import);
			}
			if (ThisFontOBJ.Import) {
				FontHolderHTML += ThisFontOBJ.Import;
			}
		}

		FontHolder.innerHTML = FontHolderHTML;

		var FontFamily = "";

		for (var ThisFontOBJ of Object.values(Font)) {
			for (var [FontName, FontEnable] of Object.entries(ThisFontOBJ.ContainFont)) {
				if (FontEnable == true) {
					FontFamily += `'${FontName}',`;
				}
			}
		}

		FontFamily = FontFamily.slice(0, -1);
		FontFamily += "!important";

		EnableFontHolder.innerHTML = `
        * {
            font-family: ${FontFamily};
        }`;
	} else {
		OldFont = null;
		FontHolder.innerHTML = "";
		EnableFontHolder.innerHTML = "";
	}
}

var FontStart = `family=`;
var FontResult = [];

async function FindFontFamily(FontLink) {
	Startidx = FontLink.indexOf(FontStart);
	FontLink = FontLink.substring(Startidx, FontLink.length);
	Endidx = FontLink.indexOf(":");
	if (Endidx == -1) {
		Endidx = FontLink.indexOf("&");
	}
	FontName = FontLink.substring(FontStart.length, Endidx);
	FontName = FontName.replaceAll("+", " ");
	FontResult.push(FontName);
	FontLink = FontLink.substring(Endidx, FontLink.length);
	return FontLink;
}

async function GetAllFont(FontLink) {
	if (FontLink.includes(FontStart)) {
		await GetAllFont(await FindFontFamily(FontLink));
	} else {
		return FontLink;
	}
}

async function GetFontList(FontLink) {
	FontResult = [];
	await GetAllFont(FontLink);
	return FontResult;
}

var DefaultFonts = ["Roboto", "YouTube Sans", "Roboto Mono"];

var Font = {};

async function LoadFonts() {
	Font = await Load("Font");
	if (!Font[0]) {
		Font[0] = {
			ContainFont: {},
			Default: true,
		};
	}

	for (var ThisDefaultFont of DefaultFonts) {
		if (Font[0].ContainFont[ThisDefaultFont] == null) {
			Font[0].ContainFont[ThisDefaultFont] = false;
		}
	}
}

async function SaveFonts() {
	if (DebugMode) {
		console.log(Font);
	}
	SetSetting("Font", Font);
}

CreateSettingUI["FontManager"] = async function () {
	await LoadFonts();

	var AddedFontFrame = await CreateFrame();
	UpgradeFrame(AddedFontFrame);
	AddedFontFrame.style.justifyContent = "center";
	AddedFontFrame.style.flexDirection = "column";

	var AddedFontLabel = CreateDescription("Added Fonts", AddedFontFrame);
	AddedFontLabel.style.marginBottom = "10px";
	AddedFontLabel.style.fontSize = "20px";

	//-----------------------------------------------

	var AddFontFrame = await CreateFrame();
	UpgradeFrame(AddFontFrame);

	AddFontFrame.style.justifyContent = "center";
	AddFontFrame.style.flexDirection = "column";

	var AddFontLabel = CreateDescription("Add Fonts", AddFontFrame);
	AddFontLabel.style.marginBottom = "10px";
	AddFontLabel.style.fontSize = "20px";

	var HowAddFontButton = document.createElement("div");
	HowAddFontButton.className = "NewtubeHoverButton Button";
	HowAddFontButton.innerHTML = "See how to add fonts (*￣3￣)╭";
	HowAddFontButton.style = `
    background: rgb(20 45 79);
    border-color: rgb(153 200 249);
    `;
	HowAddFontButton.onclick = function () {
		window.open("https://youtu.be/Lk145lrTIcU");
	};
	AddFontFrame.append(HowAddFontButton);

	var AddFontTextArea = document.createElement("textarea");
	AddFontTextArea.placeholder = "Paste Fonts Here! ♪(´▽｀)";
	AddFontTextArea.style = `
    background: rgb(30, 30, 30);
    color: white;
    width: -webkit-fill-available;
    resize: vertical;
    height: 200px;
    font-size: 18px;
    margin: 10px;`;
	AddFontFrame.append(AddFontTextArea);

	var AddFontButton = document.createElement("div");
	AddFontButton.className = "NewtubeHoverButton Button";
	AddFontButton.innerHTML = "✳️ Add Fonts ✳️";
	AddFontButton.style = `
    background: rgb(20 79 44);
    border-color: rgb(153 249 174);
    `;
	AddFontButton.onclick = async function () {
		var ContainFont = {};

		AddFontTextArea.value = await RemoveNewLine(AddFontTextArea.value);

		for (var FontName of await GetFontList(AddFontTextArea.value)) {
			ContainFont[FontName] = false;
		}

		if (DebugMode) {
			console.log(ContainFont);
		}

		if (Object.keys(ContainFont).length == 0) {
			var OldAddFont = AddFontTextArea.value;
			AddFontTextArea.value = "Error! (っ °Д °;)っ";
			await sleep(2000);
			AddFontTextArea.value = OldAddFont;
			return;
		}

		Font[Date.now()] = {
			ContainFont: ContainFont,
			Import: AddFontTextArea.value,
		};

		if (DebugMode) {
			console.log(Font);
		}

		AddFontTextArea.value = "";
		SaveFonts();
		UpdateAddedFont();
	};
	AddFontFrame.append(AddFontButton);

	//-----------------------------------------------

	var AvailableFont = await CreateFrame();
	UpgradeFrame(AvailableFont);

	AvailableFont.style.justifyContent = "center";
	AvailableFont.style.flexDirection = "column";

	var AvailableFontLabel = CreateDescription("Available Fonts", AvailableFont);
	AvailableFontLabel.style.marginBottom = "10px";
	AvailableFontLabel.style.fontSize = "20px";

	var AvailableFontFrame = document.createElement("div");
	AvailableFontFrame.style = `
    padding: 10px;
    background: rgba(20, 20, 20, 0.8);
    border-radius: 20px;
    border: 1px solid;
    border-color: rgba(255, 255, 255, 0.5);
    width: -webkit-fill-available;
    margin: 10px;`;
	AvailableFont.append(AvailableFontFrame);
	AvailableFontFrame.id = "AvailableFontFrame";

	//------------------------------------------------

	var OldFontUI;

	async function UpdateAddedFont() {
		if (OldFontUI == JSON.stringify(Font)) {
			return;
		}

		if (DebugMode) {
			console.log("Create Font UI");
		}

		OldFontUI = JSON.stringify(Font);

		Array.from(AddedFontFrame.getElementsByClassName("FontFrame")).forEach((element) => {
			element.remove();
		});

		Array.from(AvailableFontFrame.getElementsByClassName("AvailableFontButtonGroup")).forEach(
			(element) => {
				element.remove();
			}
		);

		//--------------------------------------------------------

		if (DebugMode) {
			console.log(Font);
		}

		Object.entries(Font).forEach(([FontID, ThisFontOBJ]) => {
			var ButtonGroup = document.createElement("div");
			ButtonGroup.className = "AvailableFontButtonGroup";
			AvailableFontFrame.append(ButtonGroup);

			for (var [FontName, FontEnable] of Object.entries(ThisFontOBJ.ContainFont)) {
				let ButtonFrame = document.createElement("div");
				ButtonFrame.className = "AvailableFontButton";
				ButtonFrame.style = `
                display: flex;
                flex-direction: row;
                align-items: center;`;
				ButtonGroup.append(ButtonFrame);
				LastButton = ButtonFrame;

				let Button = document.createElement("input");
				Button.className = "CheckBox";
				Button.type = "checkbox";
				ButtonFrame.append(Button);
				Button.checked = FontEnable;

				(function (Button, FontID, FontName) {
					Button.addEventListener("change", async function () {
						Font[FontID].ContainFont[FontName] = Button.checked;
						SaveFonts();
					});
				})(Button, FontID, FontName);

				CreateDescription(FontName, ButtonFrame);
			}

			//--------------------------------------------------------

			if (!ThisFontOBJ.Default) {
				var ThisFontFrame = document.createElement("div");
				ThisFontFrame.className = "FontFrame";
				ThisFontFrame.id = FontID;
				AddedFontFrame.append(ThisFontFrame);

				//--------------------------------------

				var FontTopFrame = document.createElement("div");
				FontTopFrame.className = "FontTopFrame";
				ThisFontFrame.append(FontTopFrame);

				var FontNameList = document.createElement("div");
				FontNameList.className = "DES";
				FontNameList.style = `
                width: 30%;
                border-right: 1px solid cornflowerblue;
                `;

				var FontNameListText = ``;
				for (var FontName of Object.keys(ThisFontOBJ.ContainFont)) {
					FontNameListText += FontName + "<br><br>";
				}
				FontNameListText = FontNameListText.slice(0, -8);

				FontNameList.innerHTML = FontNameListText;
				FontTopFrame.append(FontNameList);

				var FontImport = document.createElement("div");
				FontImport.className = "DES";
				FontImport.innerText = ThisFontOBJ.Import;
				FontImport.style = `
                width:70%;
                text-overflow:ellipsis;
                overflow:hidden;
                color: aquamarine;
                `;
				FontTopFrame.append(FontImport);

				//--------------------------------------

				var FontBottomFrame = document.createElement("div");
				FontBottomFrame.className = "FontBottomFrame";
				ThisFontFrame.append(FontBottomFrame);

				var CopyFont = document.createElement("div");
				CopyFont.className = "NewtubeHoverButton Button";
				CopyFont.innerHTML = "Copy fonts to clipboard";
				FontBottomFrame.append(CopyFont);
				CopyFont.onclick = async function () {
					CopyFont.innerHTML = "Copied! (/≧▽≦)/";
					CopyToClipboard(ThisFontOBJ.Import);

					await sleep(1000);
					CopyFont.innerHTML = "Copy fonts to clipboard";
				};

				var RemoveFont = document.createElement("div");
				RemoveFont.className = "NewtubeHoverButton Button";
				RemoveFont.innerHTML = "Remove";
				RemoveFont.style = `
                background: #762b2b;
                border-color: #f99999;
                `;
				FontBottomFrame.append(RemoveFont);

				RemoveFont.onclick = async function () {
					delete Font[FontID];
					await SaveFonts();
				};

				//--------------------------------------

				if (DebugMode) {
					console.log(ThisFontOBJ);
				}
			}
		});
	}

	UpdateAddedFont();
	SetOnChangeSettingUI("Font", UpdateAddedFont);
};

RunAfterLoaded.AllYoutubeMode.push(async function () {
	UpdateAllFont();
	AddOnChangeFunction("Font", UpdateAllFont);

	AddOnChangeFunction("EnableButton", UpdateAllFont);
});
