import { mount } from "svelte";

/**
 * Generic component renderer that mounts a Svelte component and returns the first element
 */
export function renderComponent(component: any, props: any = {}, target: HTMLElement = document.createElement("div")) {
	mount(component, {
		target,
		intro: true,
		props,
	});
	return (target.firstElementChild as HTMLElement) || target;
}

/**
 * Mounts a Svelte component and returns the instance
 */
export function mountComponent(component: any, props: any = {}, target: HTMLElement = document.createElement("div")) {
	return mount(component, {
		target,
		intro: true,
		props,
	});
}
