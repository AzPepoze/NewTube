USEING = `(Current)`;
var CanSave = true;

async function createList(Name) {
	ThisList = document.createElement("body");

	ThisList.className = "ListBox";
	ThisList.setAttribute("hover", "");
	ThisList.style = `display: flex;
     overflow: hidden;
     width: -webkit-fill-available;
     flex-direction: row;
     align-items: center;
     transition: all 0.2s;
     position: relative;`;

	TellName = document.createElement("lable");
	TellName.style = `overflow-wrap: break-word;
     word-break: break-all;
     width: -webkit-fill-available;`;
	TellName.innerHTML = Name;
	TellName.className = `DES`;

	LIST.appendChild(ThisList);
	ThisList.appendChild(TellName);

	if (Name == "(Current)") {
		CHOOSE = ThisList;
		ThisList.style.setProperty("background", "#747474");
		ThisList.style.height = "40px";
	} else {
		ThisUp = document.createElement("img");
		ThisUp.src = chrome.runtime.getURL("asset/Upload_file.png");
		ThisUp.className = "NUp";
		ThisUp.style = `filter: invert(1);
         width: 30px;
         border-radius: 10px;
         background: white;
         padding: 5px;
         margin-inline: 10px;`;
		ThisList.appendChild(ThisUp);

		var found = false;
		for (var i = 0; i < ForcePre.length; i++) {
			if (Name == ForcePre[i]) {
				found = true;
			}
		}
		if (found == false) {
			ThisDel = document.createElement("img");
			ThisDel.src = chrome.runtime.getURL("asset/Del.svg");
			ThisDel.className = "NDel";
			ThisDel.style = `filter: invert(1);
                 width: 30px;
                 border-radius: 10px;
                 background: white;
                 padding: 5px;`;
			ThisList.appendChild(ThisDel);
		}
	}

	var busy = false;

	USEING = `(Current)`;

	ThisList.onclick = async function (v) {
		Tar = v.target;
		if (Tar.className == "NDel") {
			let Par = Tar.parentElement,
				arr = await GetLoad("PRESET"),
				ThisName = Par.getElementsByTagName("lable")[0].textContent;

			Par.style.setProperty("height", "0px");
			Par.style.setProperty("padding", "0px");
			Par.style.setProperty("opacity", "0");
			for (let i = 0; i < arr.length; i++) {
				if ("PRESET" + arr[i] == ThisName) {
					arr.splice(i, 1);
				}
			}
			delete arr[ThisName];
			await MainSave({ PRESET: arr });
			setTimeout(() => {
				Par.remove();
			}, 200);
		} else if (Tar.className == "NUp") {
			ParName = Tar.parentElement.getElementsByTagName("lable")[0].textContent;
			arr = await GetLoad("PRESET");
			download(JSON.stringify(arr[ParName]), ParName + ".NPreset");
		} else {
			if (Tar.className == "DES") {
				Tar = v.target.parentElement;
			}
			let TarID = Tar.getElementsByTagName("lable")[0].textContent;
			if (busy == false) {
				busy = true;
				CHOOSE.style.setProperty("background", "");
				CHOOSE = Tar;
				USEING = TarID;

				arr = await GetLoad("PRESET");
				LoadNTubeCode(arr[TarID]);
				Tar.style.setProperty("background", "#747474");
				setTimeout(() => {
					busy = false;
				}, 1000);
			}
		}
	};
	return ThisList;
}

async function setnewtubebg(opacity) {
	newtubebg = document.getElementById("NEWTUBEBG");
	if (newtubebg) {
		newtubebg.style.opacity = opacity;
	}
}

async function ShowPreset() {
	var hover = false;

	var BG = document.createElement("body");
	BG.id = "NewtubeFullScreen";
	BG.style = `opacity:0;`;
	BG.className = "NewtubeTransition";

	setTimeout(() => {
		BG.style.setProperty("opacity", 1);
	}, 1);

	var DocumentBody = await GetDocumentBody();
	DocumentBody.appendChild(BG);

	leftbar = document.createElement("div");
	BG.append(leftbar);

	leftbar.style = `background: rgb(90 90 90 / 51%);
     width: 15%;
     margin-left:-15%;
     height: 100%;
     border-radius: 0px 20px 20px 0px;
     border-right: 1px solid white;
     font-size: 2vw;
     color: #ffffff82;
     display: flex;
     justify-content: center;
     align-items: center;
     text-align: center;
     transition:all 0.5s`;
	leftbar.innerHTML =
		"Hover Here<br>to hide menu<br><br>Click anywhere<br>to close menu<br><br>Drop file here<br>to import preset";

	Main = document.createElement("body");
	BG.appendChild(Main);
	Main.className = "NEWTUBEMAIN";
	Main.style = `position: absolute;
           width:70%;
           height:85%;
           top: 50%;
           left: 60%;
           transform: translate(-50%, -50%);
           background: rgb(20,20,20);
         display: flex;
         flex-direction: column;
         align-items: center;
           border-radius: 10px;
         transition:all 0.2s ease;
         border:solid white 1px;
         opacity: 0;
         `;
	setTimeout(() => {
		leftbar.style.marginLeft = "0px";
		Main.style.left = "55%";
		Main.style.opacity = "";
	}, 0);
	async function ShowPre() {
		Main.style.opacity = "1";
		Main.style.left = "55%";
		BG.style = "";
		setnewtubebg("");
		leftbar.style.opacity = "";
	}

	async function HidePre() {
		Main.style.opacity = "0";
		Main.style.left = "60%";
		BG.style = `backdrop-filter: blur(0px) !important;
                     background:transparent !important;`;
		setnewtubebg("0");
		leftbar.style.opacity = "0";
	}

	BG.style.setProperty("backdrop-filter", "blur(0px) !important");

	leftbar.addEventListener("mouseover", async function () {
		if (Clicked == false) {
			HidePre();
		}
	});

	leftbar.addEventListener("mouseout", async function () {
		if (Clicked == false) {
			ShowPre();
		}
	});

	Main.addEventListener("mouseover", async function () {
		if (Clicked == false) {
			hover = true;
		}
	});

	Main.addEventListener("mouseout", async function () {
		if (Clicked == false) {
			hover = false;
		}
	});

	leftbar.addEventListener("dragover", async function (e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
	});

	leftbar.addEventListener("drop", async function (e) {
		console.log("Drop");
		e.stopPropagation();
		e.preventDefault();
		var files = e.dataTransfer.files; // Array of all files

		F_NameArr = [];
		F_ReaderArr = [];

		for (var i = 0, file; (file = files[i]); i++) {
			var reader = new FileReader();
			var FileName = file.name;
			if (".NPreset" == FileName.substring(FileName.length - 8, FileName.length)) {
				F_NameArr.push(FileName.substring(0, FileName.length - 8));
				reader.onload = async function (e) {
					await F_ReaderArr.push(e.target.result);
				};
				reader.readAsText(file);
			}
		}

		arr = await GetLoad("PRESET");

		async function SetFile() {
			console.log(arr);
			if (F_NameArr.length == F_ReaderArr.length) {
				for (var i = 0; i < F_NameArr.length; i++) {
					var Name = F_NameArr[i],
						f = 0;

					if (arr[Name] != null) {
						f++;
					}

					console.log(arr);

					var Par;

					if (f == 0) {
						Par = await createList(Name);
						Par.style.height = "0px";
						Par.style.padding = "0px";
						Par.style.opacity = "0";
					}

					arr[Name] = JSON.parse(F_ReaderArr[i]);

					console.log(arr);

					await MainSave({ PRESET: arr });

					if (Par) {
						Par.style.height = null;
						Par.style.padding = null;
						Par.style.opacity = null;
					}
				}
			} else {
				setTimeout(async () => {
					await SetFile();
				}, 100);
			}
		}

		SetFile();
	});

	sndmain = document.createElement("div");

	sndmain.style = `width:100%;
     position: relative;
     min-height: 110px;`;

	OK = document.createElement("button");
	OK.innerHTML = "OK";
	OK.className = "Reset";

	OK.style = `position: absolute;
         left:20px;
         bottom:-3px;
         width: 45%;
         height:35px;
         background: #383838;
         color:white;
         border-radius: 10px;
         transition: all .2s ;
         margin-block: 15px;
         border:transparent;`;

	OK.onclick = async function () {
		if (Clicked == false) {
			Clicked = true;
			HidePre();
			leftbar.style.marginLeft = "-15%";
			setnewtubebg("");
			BG.style.setProperty("opacity", 0);
			setTimeout(async () => {
				arr = await GetLoad("PRESET");
				delete arr["(Current)"];
				await MainSave({ PRESET: arr });
				BG.remove();
			}, 500);
			setTimeout(() => {
				BG.remove();
			}, 500);
		}
	};

	Cancel = document.createElement("button");
	Cancel.innerHTML = "Cancel";
	Cancel.className = "Reset";

	Cancel.style = `position: absolute;
         right:20px;
         bottom:-3px;
         width: 45%;
         height:35px;
         background: #383838;
         color:white;
         border-radius: 10px;
         transition: all .2s ;
         margin-block: 15px;
         border:transparent;`;

	async function CancelCode() {
		if (Clicked == false) {
			Clicked = true;
			HidePre();
			leftbar.style.marginLeft = "-15%";
			setnewtubebg("");
			BG.style.setProperty("opacity", 0);
			let arr;
			if (USEING != `(Current)`) {
				arr = await GetLoad("PRESET");
				LoadNTubeCode(arr["(Current)"]);
			}
			setTimeout(async () => {
				BG.remove();
				console.log("Del Current");
				delete arr["(Current)"];
				await MainSave({ PRESET: arr });
			}, 500);
		}
	}

	Cancel.onclick = async function () {
		CancelCode();
	};

	THISDES = CreateDescription("✨ Select preset ✨", Main);
	THISDES.style = `font-size: 25px; padding:10px; fowidth:700;`;

	THISDES.style = "font-size:20px";

	Clicked = false;

	BG.onclick = async function () {
		if (hover == false) {
			CancelCode();
		}
	};

	LIST = document.createElement("body");
	LIST.style = `width: 90%;
     height: width: -webkit-fill-available;
     top: 50%;
     left: 50%;
     border-radius: 10px;
     border-bottom: solid white 1px;`;

	LIST.id = `MAINPRESET`;

	Main.appendChild(LIST);
	Main.append(sndmain);

	let ALLPRE = await GetLoad("PRESET");
	ALLPRE = { "(Current)": await GenNTubeCode(), ...ALLPRE };
	await MainSave({ PRESET: ALLPRE });

	//console.log(ALLPRE)

	Object.keys(ALLPRE).forEach(function (ThisPreset) {
		createList(ThisPreset);
	});

	BoxSave = document.createElement("div");
	BoxSave.innerHTML = `<input type="text" id="TextPreset" placeholder="Enter preset name.">
     <button id="OKOver" disabled>Yes!</button>
     <button id="SavePreset">Save</button>`;

	BoxSave.style = `display: flex;
     position: absolute;
     bottom: 60px;
     width: 95%;
     margin-left: 2.5%;
     height: 35px;
     flex-direction: row;`;

	sndmain.appendChild(BoxSave);

	let TextPre = document.getElementById("TextPreset");
	let OKOver = document.getElementById("OKOver");
	let SavePRe = document.getElementById("SavePreset");

	TextPre.style = `width: -webkit-fill-available;
     background: rgb(56, 56, 56);
     border-radius: 10px;
     border: transparent;
     color: white;
     text-align: center;
     transition: all 0.2s ease 0s;`;

	SavePRe.className = "Reset";
	SavePRe.style = `background: rgb(56, 56, 56);
     color: white;
     border-radius: 10px;
     border: transparent;
     height: 100%;
     width: 100px;
     margin-left: 10px;
     transition: all 0.2s ease 0s;`;

	OKOver.className = "Reset";
	OKOver.style = `background: rgb(56, 56, 56);
     color: white;
     border-radius: 10px;
     border: transparent;
     width: 0px;
     height: 100%;
     opacity: 0;
     margin-left: 0px;
     padding:0px;
     transition: all 0.2s ease 0s;`;

	var OverName;

	OKOver.onclick = async function () {
		hideOkOver();
	};

	async function hideOkOver() {
		SavePRe.innerHTML = "Save";
		OKOver.style.opacity = "0";
		OKOver.style.width = "0px";
		OKOver.style.marginLeft = "0px";
		OKOver.style.padding = "0px";
		OKOver.setAttribute("disabled", "");
		CanSave = true;
		TextPre.value = OverName;
	}

	SavePRe.onclick = async function () {
		if (CanSave == "Over") {
			hideOkOver();
		} else {
			if (CanSave == true) {
				if (TextPre.value != null && TextPre.value != "") {
					CanSave = false;
					let f = 0,
						arr = await GetLoad("PRESET");

					OverName = TextPre.value;

					for (let i = 0; i < arr.length; i++) {
						if (arr[i] == OverName) {
							f++;
						}
					}

					if (f > 0) {
						CanSave = "Over";
						SavePRe.innerHTML = "Cancel";
						TextPre.value = "This name has already exists , overwrite?";
						OKOver.removeAttribute("disabled");
						OKOver.style.opacity = "1";
						OKOver.style.width = "70px";
						OKOver.style.marginLeft = "10px";
						OKOver.style.paddingInline = "5px";
					} else {
						let Par = await createList(OverName);
						Par.style.height = "0px";
						Par.style.padding = "0px";
						Par.style.opacity = "0";

						arr[OverName] = await GenNTubeCode();
						await MainSave({ PRESET: arr });

						Par.style.height = null;
						Par.style.padding = null;
						Par.style.opacity = null;
						CanSave = true;

						setTimeout(() => {
							Par.scrollIntoView();
						}, 100);
					}
				}
			}
		}
	};

	sndmain.appendChild(OK);
	sndmain.appendChild(Cancel);
}
