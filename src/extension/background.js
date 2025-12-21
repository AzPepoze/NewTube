function sleep(delay) {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

async function get_now_tab() {
	let query_options = { active: true, currentwindow_element: true };

	try {
		let tabs_array = await chrome.tabs.query(query_options);

		if (tabs_array && tabs_array.length > 0) {
			return tabs_array[0];
		}

		query_options = { active: true };
		tabs_array = await chrome.tabs.query(query_options);

		if (tabs_array && tabs_array.length > 0) {
			return tabs_array[0];
		}

		return null;
	} catch (error) {
		console.error("Failed to get the current active tab:", error);
		return null;
	}
}

chrome.commands.onCommand.addListener(async (command) => {
	console.log(`Command "${command}" triggered`);
	const query_options = { active: true, lastFocusedWindow: true };
	const [tab] = await chrome.tabs.query(query_options);
	console.log(command);
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
	console.log(recived_msg);

	switch (recived_msg.Command) {
		case "runScript":
			// while (!build_in_functions_Data) {
			// 	console.log(build_in_functions_Data);
			// 	await sleep(10);
			// }

			let pre_code = "";

			if (recived_msg.args != "") {
				const args = JSON.parse(recived_msg.args);

				if (args) {
					const setting_id = args["setting_id"];
					if (setting_id) {
						// pre_code += `console.log(StyleShift["Build-in"]["_Call_Function"]());\n`;
						pre_code += `let this_setting_frame = document.querySelector(".STYLESHIFT-Window #${setting_id}");\n`;
						pre_code += `async function save_setting_value(value){
                                   return await StyleShift["Build-in"]["_Call_Function"]("save_styleshift_value", "${setting_id}", value)
                              }\n`;
						pre_code += `async function load_setting_value(){
                                   return await StyleShift["Build-in"]["_Call_Function"]("load_styleshift_value", "${setting_id}")
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

			console.log("Excuted Script");
			console.log(res);
			console.log(sender);
			console.log(excute_data);
			console.log(recived_msg.Script);

			break;
	}

	console.log("---------------------------------");
});
