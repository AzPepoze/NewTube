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

const build_in_functions = {
	/*
	-------------------------------------------------------
	For normal user !!!
	-------------------------------------------------------
	*/

	set_value: function (id: string, value: any) {
		window["StyleShift"]["build-in"]["_variables"][id] = value;
	},

	get_value: function (id: string) {
		return window["StyleShift"]["build-in"]["_variables"][id];
	},

	/*
	-------------------------------------------------------
	For advanced user !!!
	-------------------------------------------------------
	*/

	load_styleshift_value: async function (id) {
		return JSON.parse(await StyleShift["build-in"]["_call_function"]("_load_styleshift_value", id));
	},

	save_styleshift_value: async function (id, value) {
		return JSON.parse(
			await StyleShift["build-in"]["_call_function"]("_save_styleshift_value", id, JSON.stringify(value)),
		);
	},

	create_styleshift_setting_ui: async function (type, this_setting, ...args) {
		const ui_id = await StyleShift["build-in"]["_call_function"](
			"create_styleshift_setting_ui",
			type,
			this_setting,
			...args,
		);

		const ui = await StyleShift["build-in"]["wait_for_element"](
			`.StyleShift-Station [styleshift-ui-id="${ui_id}"]`,
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
	_call_function: async function (function_name, ...args) {
		return await StyleShift["build-in"]["fire_function_event_with_return"]("StyleShift", function_name, ...args);
	},
};

for (const [function_name, this_function] of Object.entries(build_in_functions)) {
	StyleShift["build-in"][function_name] = this_function;
}
