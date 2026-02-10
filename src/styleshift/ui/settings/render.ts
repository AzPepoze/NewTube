import { mount } from "svelte";
import Window from "../components/general/Window.svelte";
import Taskbar from "../components/general/Taskbar.svelte";
import SettingRenderer from "./components/main/SettingRenderer.svelte";
import Confirm from "../components/general/Confirm.svelte";
import type { Setting } from "../../types/store";

export function renderWindow(props: any, target: HTMLElement = document.createElement("div")) {
	return mount(Window as any, {
		target,
		intro: true,
		props,
	});
}

export function renderTaskbar(target: HTMLElement = document.createElement("div")) {
	return mount(Taskbar as any, {
		target,
		intro: true,
	});
}

export function renderSetting(
	setting: Setting,
	onUpdate?: (value: any) => void,
	target: HTMLElement = document.createElement("div"),
) {
	mount(SettingRenderer as any, {
		target,
		props: { setting, onUpdate: onUpdate } as any,
	});
	return (target.firstElementChild as HTMLElement) || target;
}

export function renderComponent(component: any, props: any = {}, target: HTMLElement = document.createElement("div")) {
	mount(component, {
		target,
		props,
	});
	return (target.firstElementChild as HTMLElement) || target;
}

export function confirm(props: any, target: HTMLElement = document.createElement("div")) {
	return mount(Confirm as any, {
		target,
		intro: true,
		props,
	});
}
