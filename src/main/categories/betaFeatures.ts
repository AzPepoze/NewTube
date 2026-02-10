import { Category } from "../../styleshift/types/store";
import { enableNewYoutubeLayout, disableNewYoutubeLayout } from "../features/beta";
import { setupAudioVisualizer, destroyAudioVisualizer } from "../features/visualizer";

export const betaFeaturesCategory: Category = {
	category: "🌠 Beta features!",
	settings: [
		{
			type: "text",
			html: "Warning: These features are experimental and may not work as expected. A page reload is often required.",
		},
		{
			type: "checkbox",
			id: "NewYoutubeLayout",
			name: "Force Enable New YouTube Layout",
			description: "Tries to force YouTube to use its newer, experimental ui layout. Requires a page reload.",
			value: false,
			enableFunction: enableNewYoutubeLayout,
			disableFunction: disableNewYoutubeLayout,
		},
		{
			type: "checkbox",
			id: "Visualizer",
			name: "Audio Visualizer",
			description: "Displays a real-time audio spectrum visualizer at the bottom of the screen.",
			value: false,
			enableFunction: setupAudioVisualizer,
			disableFunction: destroyAudioVisualizer,
		},
	],
};
