import { Category } from "../../styleshift/types/styleshiftTypes";
import { setupAudioVisualizer, destroyAudioVisualizer } from "../features/visualizer";
import { setupBlackToTransparent, destroyBlackToTransparent } from "../features/video/blackToTransparent";

export const betaFeaturesCategory: Category = {
	category: { icon: "new_label", label: "Beta features!" },
	settings: [
		{
			type: "text",
			html: "Warning: These features are experimental and may not work as expected. A page reload is often required.",
		},
		{
			id: "EnableAppLightTheme",
			name: "Light Theme",
			description: "Switches the NewTube settings interface to a bright light theme.",
			type: "checkbox",
			value: false,
		},
		{
			type: "checkbox",
			id: "ExperimentalBlackToTransparent",
			name: "Black to Transparent",
			description: "Makes all black colors in the video perfectly transparent. This is great for videos with black backgrounds that you want to blend into your page background.",
			value: false,
			enableFunction: setupBlackToTransparent,
			disableFunction: destroyBlackToTransparent,
		},
		{
			type: "checkbox",
			id: "ExperimentalAudioVisualizer",
			name: "Audio Visualizer",
			description: "Displays a real-time reactive audio spectrum visualizer at the bottom of the player. It pulses and moves to the beat of the music.",
			value: false,
			enableFunction: setupAudioVisualizer,
			disableFunction: destroyAudioVisualizer,
		},
	],
};
