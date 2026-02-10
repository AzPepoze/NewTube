const logger = {
	info: (category, ...args) =>
		console.log(
			`%c StyleShift %c [INFO] %c [${category.toUpperCase()}]`,
			"color: #bada55",
			"color: #00ffff",
			"color: #6a6a6a",
			...args,
		),
	warn: (category, ...args) =>
		console.warn(
			`%c StyleShift %c [WARN] %c [${category.toUpperCase()}]`,
			"color: #bada55",
			"color: #ffae00",
			"color: #6a6a6a",
			...args,
		),
	error: (category, ...args) =>
		console.error(
			`%c StyleShift %c [ERROR] %c [${category.toUpperCase()}]`,
			"color: #bada55",
			"color: #ff0000",
			"color: #6a6a6a",
			...args,
		),
};

chrome.commands.onCommand.addListener(async (command) => {
	logger.info("command", `Command "${command}" triggered`);
	const queryOptions = { active: true, lastFocusedWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	logger.info("command", command);
	chrome.tabs.sendMessage(tab.id, command);
});

async function execFunction(execText) {
	setTimeout(execText, 0);
}

chrome.runtime.onMessage.addListener(async (recivedMsg, sender) => {
	logger.info("message", recivedMsg);

	switch (recivedMsg.Command) {
		case "runScript":
			let preCode = "";

			if (recivedMsg.args != "") {
				const args = JSON.parse(recivedMsg.args);

				if (args) {
					const settingId = args["settingId"];
					if (settingId) {
						preCode += `let thisSettingFrame = document.querySelector(".STYLESHIFT-Window #${settingId}");\n`;
						preCode += `async function saveSettingValue(value){
                                   return await StyleShift["build-in"]["_call_function"]("saveStyleshiftValue", "${settingId}", value)
                              }\n`;
						preCode += `async function loadSettingValue(){
                                   return await StyleShift["build-in"]["_call_function"]("loadStyleshiftValue", "${settingId}")
                              }\n`;
					}
					for (const [key, value] of Object.entries(args)) {
						preCode += `let ${key} = "${value}";\n`;
					}
				}
			}

			const excuteData = `(async () => {${preCode}\n\n${recivedMsg.Script}})()`;

			const res = await chrome.scripting.executeScript({
				target: { tabId: sender.tab.id },
				func: execFunction,
				args: [excuteData],
			});

			logger.info("script", "Excuted Script");
			logger.info("script", res);
			logger.info("script", sender);
			logger.info("script", excuteData);
			logger.info("script", recivedMsg.Script);

			break;
	}

	logger.info("message", "---------------------------------");
});
