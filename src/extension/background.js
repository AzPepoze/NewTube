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
	const query_options = { active: true, lastFocusedWindow: true };
	const [tab] = await chrome.tabs.query(query_options);
	logger.info("command", command);
	chrome.tabs.sendMessage(tab.id, command);
});

// let build_in_functions_Data;

// fetch(chrome.runtime.getURL("build_in_functions.js"))
// 	.then((response) => response.text())
// 	.then((data) => {
// 		build_in_functions_Data = data;
// 	});

async function exec_function(exec_text) {
	setTimeout(exec_text, 0);
}

chrome.runtime.onMessage.addListener(async (recived_msg, sender) => {
	logger.info("message", recived_msg);

	switch (recived_msg.Command) {
		case "runScript":
			// while (!build_in_functions_Data) {
			// 	logger.info(build_in_functions_Data);
			// 	await sleep(10);
			// }

			let pre_code = "";

			if (recived_msg.args != "") {
				const args = JSON.parse(recived_msg.args);

				if (args) {
					const setting_id = args["setting_id"];
					if (setting_id) {
						// pre_code += `StyleShift.logger.info(StyleShift["build-in"]["_call_function"]());\n`;
						pre_code += `let this_setting_frame = document.querySelector(".STYLESHIFT-Window #${setting_id}");\n`;
						pre_code += `async function save_setting_value(value){
                                   return await StyleShift["build-in"]["_call_function"]("save_styleshift_value", "${setting_id}", value)
                              }\n`;
						pre_code += `async function load_setting_value(){
                                   return await StyleShift["build-in"]["_call_function"]("load_styleshift_value", "${setting_id}")
                              }\n`;
					}
					for (const [key, value] of Object.entries(args)) {
						pre_code += `let ${key} = "${value}";\n`;
					}
				}
			}

			const excute_data = `(async () => {${pre_code}\n\n${recived_msg.Script}})()`;

			const res = await chrome.scripting.executeScript({
				target: { tabId: sender.tab.id },
				func: exec_function,
				args: [excute_data],
			});

			logger.info("script", "Excuted Script");
			logger.info("script", res);
			logger.info("script", sender);
			logger.info("script", excute_data);
			logger.info("script", recived_msg.Script);

			break;
	}

	logger.info("message", "---------------------------------");
});
