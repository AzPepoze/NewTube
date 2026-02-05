import { save_any } from "@core/save";
import { advance_setting_ui } from "./components/advance/advance";
import { developer_setting_ui } from "./components/dev/dev";
import { main_setting_ui } from "./components/main/main";
import { mount } from "svelte";
import SettingsWindow from "./components/main/SettingsWindow.svelte";
import ConfigWindow from "./components/dev/ConfigWindow.svelte";
import SettingRenderer from "./components/main/SettingRenderer.svelte";
import ConfigEditorRenderer from "./components/dev/ConfigEditorRenderer.svelte";

export async function set_and_save(this_setting, value) {
	// this_setting.value = value;
	// await save_all();
	await save_any(this_setting.id, value);
}

export const settings_ui = {
	...main_setting_ui,
	...advance_setting_ui,
	...developer_setting_ui,
	render_setting: function (setting, on_update?, target: HTMLElement = document.createElement("div")) {
		mount(SettingRenderer as any, {
			target,
			props: { setting, onUpdate: on_update },
		});
		return target.firstElementChild as HTMLElement;
	},
	render_component: function (component, props = {}, target: HTMLElement = document.createElement("div")) {
		mount(component as any, {
			target,
			props,
		});
		return target.firstElementChild as HTMLElement;
	},
	settings_window: function (props, target) {
		return mount(SettingsWindow as any, {
			target,
			props,
		});
	},
	config_window: function (props, target) {
		return mount(ConfigWindow as any, {
			target,
			props,
		});
	},
	config_editor_renderer: function (props, target) {
		return mount(ConfigEditorRenderer as any, {
			target,
			props,
		});
	},
};
