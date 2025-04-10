async function CreateSettingButton() {
	var RightTopBar =
		document.querySelector("ytmusic-nav-bar #right-content") ||
		document.querySelector("#masthead-container #end") ||
		document.querySelector("ytd-masthead #end") ||
		document.querySelector("#end.ytd-masthead") ||
		document.querySelector("#container > #end") ||
		document.querySelector("ytd-masthead");

	console.log("NewTube - RightTopBar", RightTopBar);

	if (RightTopBar) {
		var SettingButton = document.createElement("button");
		SettingButton.addEventListener("click", clickSetting);
		SettingButton.innerHTML = "<span>✦</span>";
		SettingButton.id = "NEWTUBESET";
		SettingButton.style = `display: inline-block;
          background-color: transparent;
          border: transparent;
          color: var(--yt-spec-text-primary);
          text-align: center;
          font-size: 20px;
          transition: all 0.5s;
          margin: 5px;
          width: 50px;`;

		RightTopBar.append(SettingButton);
	} else {
		await sleep(100);
		await CreateSettingButton();
	}
}
