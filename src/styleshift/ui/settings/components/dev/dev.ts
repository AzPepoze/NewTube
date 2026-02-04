import { rearrange_selector } from "../../../../build-in-functions/normal";
import { Setting } from "../../../../types/store";
import { settings_ui } from "../../setting-components";

// @ts-ignore
// @ts-ignore
import DevSettingSectionComponent from "./DevSettingSection.svelte";
// @ts-ignore
import ConfigSubSectionComponent from "./ConfigSubSection.svelte";
// @ts-ignore
import ConfigMainSectionComponent from "./ConfigMainSection.svelte";
// @ts-ignore
import AddSettingButtonComponent from "./AddSettingButton.svelte";
// @ts-ignore
import { mount } from "svelte";

export const developer_setting_ui = {
	["setting_developer_text_editor"]: async function (
		parent: HTMLElement,
		this_setting,
		this_property,
		update_ui = function (value) {},
	) {
		const main_ui = settings_ui["setting_frame"](true, true);
		main_ui.className += " STYLESHIFT-Config-Sub-Frame";

		const text_editors = {};

		for (const [title, property] of Object.entries(this_property)) {
			main_ui.append(settings_ui["Sub_title"](title));
			const setting_developer_text_editor = settings_ui["text_editor"](this_setting, property as string);
			setting_developer_text_editor.additinal_onchange(update_ui);
			main_ui.append(setting_developer_text_editor.text_editor);
			text_editors[title] = setting_developer_text_editor;
		}

		parent.appendChild(main_ui);

		return { main_ui, text_editors };
	},

	["Setting_Developer_frame"]: async function (
		parent,
		this_setting,
		run_type,
		ext_array = ["function", "css"],
		update_config,
	) {
		const target = document.createElement("div");
		parent.append(target);

		mount(DevSettingSectionComponent as any, {
			target: target,
			props: {
				setting: this_setting,
				runType: run_type,
				extArray: ext_array,
				onUpdateConfig: update_config,
			},
		});

		return target.firstElementChild as HTMLDivElement;
	},

	["Config_Main_Section"]: async function (parent, this_setting, props, update_ui = function () {}) {
		mount(ConfigMainSectionComponent as any, {
			target: parent,
			props: {
				setting: this_setting,
				props: props,
				updateUI: update_ui,
			},
		});
	},

	["Config_Sub_Section"]: async function (parent, this_setting, props) {
		mount(ConfigSubSectionComponent as any, {
			target: parent,
			props: {
				setting: this_setting,
				props: props,
			},
		});
	},

	["selector_text_editor"]: async function (parent, this_category) {
		const selector_text_editor = await settings_ui["text_editor"](this_category, "Selector");
		selector_text_editor.text_editor.className += " STYLESHIFT-Selector-Text-Editor";
		selector_text_editor.rearrange_value(function (value: string) {
			return rearrange_selector(value);
		});
		parent.append(selector_text_editor.text_editor);
		return selector_text_editor;
	},

	["setting_delete_button"]: async function (parent, when_click, type: "full" | "mini" = "full") {
		const setting_delete_button = await settings_ui["button"]({
			name: "🗑️",
			color: "#FF0000",
			align: "center",
		});
		(setting_delete_button.button as HTMLDivElement).addEventListener("click", when_click);
		parent.append(setting_delete_button.button);

		switch (type) {
			case "full":
				(setting_delete_button.button as HTMLDivElement).style.width = "100%";
				break;
			case "mini":
				(setting_delete_button.button as HTMLDivElement).style.width = "30px";
				break;
		}

		return setting_delete_button;
	},

	["add_setting_button"]: async function (category_settings: Setting[]) {
		const target = document.createElement("div");

		mount(AddSettingButtonComponent as any, {
			target: target,
			props: {
				categorySettings: category_settings,
			},
		});

		return { frame: target.firstElementChild as HTMLDivElement };
	},
};
