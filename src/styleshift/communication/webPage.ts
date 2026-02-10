// @ts-nocheck

const logger = (window as any).StyleShift?.logger || {
	info: (category, ...args: any[]) =>
		(window as any).StyleShift?.logger?.info(category, ...args) ||
		console.log(
			`%c StyleShift %c [INFO] %c [${category}]`,
			"color: #bada55",
			"color: #00ffff",
			"color: #888",
			...args,
		),
	warn: (category, ...args: any[]) =>
		(window as any).StyleShift?.logger?.warn(category, ...args) ||
		console.warn(
			`%c StyleShift %c [WARN] %c [${category}]`,
			"color: #bada55",
			"color: #ffae00",
			"color: #888",
			...args,
		),
	error: (category, ...args: any[]) =>
		(window as any).StyleShift?.logger?.error(category, ...args) ||
		console.error(
			`%c StyleShift %c [ERROR] %c [${category}]`,
			"color: #bada55",
			"color: #ff0000",
			"color: #888",
			...args,
		),
};

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

		const ui = await StyleShift["build-in"]["waitForElement"](
			`.StyleShift-Station [styleshift-ui-id="${uiId}"]`,
		);

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
		return await StyleShift["build-in"]["fireFunctionEventWithReturn"]("StyleShift", functionName, ...args);
	},
};

for (const [functionName, thisFunction] of Object.entries(buildInFunctions)) {
	StyleShift["build-in"][functionName] = thisFunction;
}
