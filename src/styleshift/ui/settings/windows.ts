import { mount } from "svelte";
import SettingsWindow from "./components/main/SettingsWindow.svelte";
import ConfigWindow from "./components/dev/ConfigWindow.svelte";
import ConfigEditorRenderer from "./components/dev/ConfigEditorRenderer.svelte";

export function settingsWindow(props: any, target: HTMLElement) {
	return mount(SettingsWindow as any, {
		target,
		intro: true,
		props,
	});
}

export function configWindow(props: any, target: HTMLElement) {
	return mount(ConfigWindow as any, {
		target,
		intro: true,
		props,
	});
}

export function configEditorRenderer(props: any, target: HTMLElement) {
	return mount(ConfigEditorRenderer as any, {
		target,
		intro: true,
		props,
	});
}
