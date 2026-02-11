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
	try {
		console.debug("StyleShift: Background script injecting into Main World");
		const script = document.createElement("script");
		let trustedContent = execText;

		if (window.trustedTypes) {
			if (!window.__styleshift_policy) {
				try {
					window.__styleshift_policy = window.trustedTypes.createPolicy("styleshift-policy", {
						createScript: (s) => s,
						createHTML: (h) => h,
					});
				} catch (_e) {
					window.__styleshift_policy = window.trustedTypes.defaultPolicy || null;
				}
			}

			const policy = window.__styleshift_policy;
			if (policy && policy.createScript) {
				trustedContent = policy.createScript(execText);
			}
		}

		script.textContent = trustedContent;
		(document.head || document.documentElement).appendChild(script);
		script.remove();
	} catch (error) {
		console.error("StyleShift: Execution failed", error);

		const errorMsg = error instanceof Error ? error.message : String(error);
		if (typeof StyleShift !== "undefined" && StyleShift["build-in"] && StyleShift["build-in"]["_call_function"]) {
			StyleShift["build-in"]["_call_function"]("createError", "Injection failed: " + errorMsg);
		}

		try {
			new Function(execText)();
		} catch (_e) {}
	}
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
						preCode += `
                            if (window.trustedTypes && thisSettingFrame) {
                                if (!window.__styleshift_html_policy) {
                                    try {
                                        window.__styleshift_html_policy = window.trustedTypes.createPolicy("styleshift-policy-html", { createHTML: (h) => h });
                                    } catch (_e) {
                                        window.__styleshift_html_policy = window.trustedTypes.defaultPolicy || null;
                                    }
                                }
                                const policy = window.__styleshift_html_policy;
                                
                                if (policy && !thisSettingFrame.__styleshift_policy_set) {
                                    const originalSetInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
                                    Object.defineProperty(thisSettingFrame, 'innerHTML', {
                                        set: function(html) {
                                            originalSetInnerHTML.call(this, policy.createHTML(html));
                                        },
                                        configurable: true
                                    });
                                    thisSettingFrame.__styleshift_policy_set = true;
                                }
                            }\n`;
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

			const excuteData = `(async () => {
                try {
                    ${preCode}\n\n${recivedMsg.Script}
                } catch (e) {
                    console.error("StyleShift: Script execution failed", e);
                    if (typeof StyleShift !== "undefined" && StyleShift["build-in"] && StyleShift["build-in"]["_call_function"]) {
                        StyleShift["build-in"]["_call_function"]("createError", "Script Error: " + e.message);
                    }
                }
            })()`;

			const res = await chrome.scripting.executeScript({
				target: { tabId: sender.tab.id },
				func: execFunction,
				args: [excuteData],
				world: "MAIN",
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
