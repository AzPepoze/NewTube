import { Category } from "../../styleshift/types/store";
import { enable_new_youtube_layout, disable_new_youtube_layout } from "../features/beta";
import { setup_audio_visualizer } from "../features/visualizer";

export const beta_features_category: Category = {
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
			enable_function: enable_new_youtube_layout,
			disable_function: disable_new_youtube_layout,
		},
		{
			type: "checkbox",
			id: "Visualizer",
			name: "Audio Visualizer",
			description: "Displays a real-time audio spectrum visualizer at the bottom of the screen.",
			value: false,
			enable_function: setup_audio_visualizer,
		},
	],
};
