import { save_to_storage } from "@/styleshift/core/storage-manager";
import { advance_setting_ui } from "./components/advance/advance";
import { developer_setting_ui } from "./components/dev/dev";
import { main_setting_ui } from "./components/main/main";
import { mount } from "svelte";
import SettingsWindow from "./components/main/SettingsWindow.svelte";
import ConfigWindow from "./components/dev/ConfigWindow.svelte";
import SettingRenderer from "./components/main/SettingRenderer.svelte";
import ConfigEditorRenderer from "./components/dev/ConfigEditorRenderer.svelte";
import Confirm from "../components/general/Confirm.svelte";
import type { Setting } from "../../types/store";

export async function set_and_save(this_setting: Setting, value: any) {
	if ("id" in this_setting && this_setting.id) {
		await save_to_storage(this_setting.id, value);
	}
}

export const settings_ui = {
	...main_setting_ui,
	...advance_setting_ui,
	...developer_setting_ui,
	render_setting: function (
		setting: Setting,
		on_update?: (value: any) => void,
		target: HTMLElement = document.createElement("div"),
	) {
		mount(SettingRenderer as any, {
			target,
			props: { setting, onUpdate: on_update } as any,
		});
		return (target.firstElementChild as HTMLElement) || target;
	},
	render_component: function (component: any, props: any = {}, target: HTMLElement = document.createElement("div")) {
		mount(component, {
			target,
			props,
		});
		return (target.firstElementChild as HTMLElement) || target;
	},
	confirm: function (props: any, target: HTMLElement = document.createElement("div")) {
		return mount(Confirm as any, {
			target,
			intro: true,
			props,
		});
	},
	settings_window: function (props: any, target: HTMLElement) {
		return mount(SettingsWindow as any, {
			target,
			intro: true,
			props,
		});
	},
	config_window: function (props: any, target: HTMLElement) {
		return mount(ConfigWindow as any, {
			target,
			intro: true,
			props,
		});
	},
	config_editor_renderer: function (props: any, target: HTMLElement) {
		return mount(ConfigEditorRenderer as any, {
			target,
			intro: true,
			props,
		});
	},
};
