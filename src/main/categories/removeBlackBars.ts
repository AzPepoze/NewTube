import { Category } from "../../styleshift/types/store";
import {
	enableRemoveBlackBars,
	disableRemoveBlackBars,
	updateRemoveBlackBarsSettings,
} from "../features/removeBlackBars/main";

const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

export const removeBlackBarsCategory: Category = {
	category: "🔳 Remove black bars on video",
	selector: "#movie_player",
	settings: [
		{
			type: "checkbox",
			id: "RemoveBlackBars",
			name: "Remove Black Bars",
			description:
				"Automatically detects and crops out horizontal black bars (letterboxing) from the top and bottom of videos to fill your screen better.",
			value: false,
			enableFunction: enableRemoveBlackBars,
			disableFunction: disableRemoveBlackBars,
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsUltrawide",
			name: "Fit Ultrawide",
			description:
				"Optimizes the cropping logic specifically for ultrawide (21:9) monitors and videos, ensuring they fill the player correctly without stretching.",
			value: true,
			updateFunction: updateRemoveBlackBarsSettings,
			require: { RemoveBlackBars: true },
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsDisableFullscreen",
			name: "Disable in Fullscreen",
			description:
				"Automatically disables the black bar removal feature when the video player is in fullscreen mode. This can help prevent visual artifacts on some displays.",
			value: false,
			updateFunction: updateRemoveBlackBarsSettings,
			require: { RemoveBlackBars: true },
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsWorker",
			name: "Worker Thread",
			description:
				"Offloads the video analysis to a separate background thread. This prevents the main interface from stuttering or lagging during complex frame analysis.",
			value: true,
			lock: {
				condition: !isFirefox,
				message: "I didn't want to lock this feature for Firefox only, but Chromium browsers (Chrome, Edge, etc.) are making it really hard to get workers running correctly. Maybe I'm just stupid and can't make it work, but honestly, Chrome's rendering is already so fast that you won't see much of a performance boost anyway.",
			},
			updateFunction: updateRemoveBlackBarsSettings,
			require: { RemoveBlackBars: true },
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsLazyCheck",
			name: "Pixel Budget",
			description:
				"Limits the number of pixels analyzed in each frame. Spreads the detection process over multiple frames to prevent CPU spikes and interface lag.",
			value: true,
			updateFunction: updateRemoveBlackBarsSettings,
			require: { RemoveBlackBars: true },
		},
		{
			type: "numberSlide",
			id: "RemoveBlackBarsLazyAmount",
			name: "Budget Amount",
			description:
				"The maximum number of pixels to check per frame. Lower values are lighter on the CPU but take more frames (drops) to complete a full scan.",
			value: 50,
			min: 50,
			max: 10000,
			step: 50,
			updateFunction: updateRemoveBlackBarsSettings,
			require: { RemoveBlackBars: true },
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsDebugCanvas",
			name: "Debug Canvas",
			description:
				"Visualizes the analysis process by showing a small canvas in the corner. Green lines indicate where the black bars were detected and cropped.",
			value: false,
			updateFunction: updateRemoveBlackBarsSettings,
			require: { RemoveBlackBars: true },
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsDebugInfo",
			name: "Debug Info",
			description:
				"Displays real-time technical statistics such as analysis latency, frame drops, and detection coordinates directly over the video player.",
			value: false,
			updateFunction: updateRemoveBlackBarsSettings,
			require: { RemoveBlackBars: true },
		},
	],
};
