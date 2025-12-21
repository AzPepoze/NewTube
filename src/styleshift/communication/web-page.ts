// @ts-nocheck

const build_in_functions = {
	/*
	-------------------------------------------------------
	For normal user !!!
	-------------------------------------------------------
	*/

	set_value: function (id: string, value: any) {
		window["StyleShift"]["Build-in"]["_Variables"][id] = value;
	},

	Get_value: function (id: string) {
		return window["StyleShift"]["Build-in"]["_Variables"][id];
	},

	/*
	-------------------------------------------------------
	For advanced user !!!
	-------------------------------------------------------
	*/

	load_styleshift_value: async function (id) {
		return JSON.parse(await StyleShift["Build-in"]["_Call_Function"]("_load_styleshift_value", id));
	},

	save_styleshift_value: async function (id, value) {
		return JSON.parse(
			await StyleShift["Build-in"]["_Call_Function"]("_save_styleshift_value", id, JSON.stringify(value))
		);
	},

	Create_StyleShift_Setting_ui: async function (type, this_setting, ...args) {
		const ui_id = await StyleShift["Build-in"]["_Call_Function"](
			"create_styleshift_setting_ui",
			type,
			this_setting,
			...args
		);

		const ui = await StyleShift["Build-in"]["wait_for_element"](
			`.StyleShift-Station [styleshift-ui-id="${ui_id}"]`
		);

		console.log("ui", ui);

		ui.removeAttribute("styleshift-ui-id");

		return ui;
	},

	/*
	-------------------------------------------------------
	Danger zone !!!
	-------------------------------------------------------
	*/

	_Variables: {},
	_Call_Function: async function (function_name, ...args) {
		return await StyleShift["Build-in"]["fire_function_event_with_return"]("StyleShift", function_name, ...args);
	},
};

for (const [function_name, this_function] of Object.entries(build_in_functions)) {
	StyleShift["Build-in"][function_name] = this_function;
}
