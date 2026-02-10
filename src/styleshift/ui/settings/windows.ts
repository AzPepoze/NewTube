import { mount } from "svelte";
import SettingsWindow from "./components/main/SettingsWindow.svelte";
import ConfigWindow from "./components/dev/ConfigWindow.svelte";
import ConfigEditorRenderer from "./components/dev/ConfigEditorRenderer.svelte";

export function settings_window(props: any, target: HTMLElement) {
	return mount(SettingsWindow as any, {
		target,
		intro: true,
		props,
	});
}

export function config_window(props: any, target: HTMLElement) {
	return mount(ConfigWindow as any, {
		target,
		intro: true,
		props,
	});
}

export function config_editor_renderer(props: any, target: HTMLElement) {
	return mount(ConfigEditorRenderer as any, {
		target,
		intro: true,
		props,
	});
}
