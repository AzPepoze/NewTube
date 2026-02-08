declare module "*.svelte" {
	const component: any;
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
