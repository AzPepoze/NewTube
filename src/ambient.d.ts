declare module "*.svelte" {
	import { Component } from "svelte";
	const component: Component<any, any, any>;
	export default component;
}

declare module "*.svg" {
	const content: string;
	export default content;
}

declare module "*.png" {
	const content: string;
	export default content;
}

interface Window {
	webkitAudioContext: typeof AudioContext;
}
