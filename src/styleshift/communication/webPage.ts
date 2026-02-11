// @ts-nocheck
const buildInFunctions = {
	/*
	-------------------------------------------------------
	For normal user !!!
	-------------------------------------------------------
	*/

	setValue: function (id: string, value: any) {
		window["StyleShift"]["build-in"]["_variables"][id] = value;
	},

	getValue: function (id: string) {
		return window["StyleShift"]["build-in"]["_variables"][id];
	},

	/*
	-------------------------------------------------------
	For advanced user !!!
	-------------------------------------------------------
	*/

	loadStyleshiftValue: async function (id) {
		return JSON.parse(await StyleShift["build-in"]["_call_function"]("_load_styleshift_value", id));
	},

	saveStyleshiftValue: async function (id, value) {
		return JSON.parse(
			await StyleShift["build-in"]["_call_function"]("_save_styleshift_value", id, JSON.stringify(value)),
		);
	},

	createStyleshiftSettingUi: async function (type, thisSetting, ...args) {
		const uiId = await StyleShift["build-in"]["_call_function"](
			"createStyleshiftSettingUi",
			type,
			thisSetting,
			...args,
		);

		const ui = await StyleShift["build-in"]["waitForElement"](`.StyleShift-Station [styleshift-ui-id="${uiId}"]`);

		logger.info("ui", ui);

		ui.removeAttribute("styleshift-ui-id");

		return ui;
	},

	/*
	-------------------------------------------------------
	Danger zone !!!
	-------------------------------------------------------
	*/

	_variables: {},
	_call_function: async function (functionName, ...args) {
		StyleShift.logger.debug("runtime", `Main World calling function: ${functionName}`, args);

		if (
			(window as any).StyleShift &&
			(window as any).StyleShift.functions &&
			typeof (window as any).StyleShift.functions[functionName] === "function"
		) {
			StyleShift.logger.debug("runtime", `Directly calling function: ${functionName}`);
			return await (window as any).StyleShift.functions[functionName](...args);
		}

		return await StyleShift["build-in"]["fireFunctionEventWithReturn"]("StyleShift", functionName, ...args);
	},
};

for (const [functionName, thisFunction] of Object.entries(buildInFunctions)) {
	StyleShift["build-in"][functionName] = thisFunction;
}
