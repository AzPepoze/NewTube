import { Category } from "../../styleshift/types/store";
import { setupRemoveBlackBars, destroyRemoveBlackBars } from "../features/removeBlackBars";

const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

export const removeBlackBarsCategory: Category = {
	category: "🔳 Remove black bars on video",
	settings: [
		{
			type: "checkbox",
			id: "RemoveBlackBars",
			name: "Remove Black Bars",
			description: "Automatically detects and crops out horizontal black bars (letterboxing) from the top and bottom of videos to fill your screen better.",
			value: false,
			enableFunction: setupRemoveBlackBars,
			disableFunction: destroyRemoveBlackBars,
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsUltrawide",
			name: "Fit Ultrawide",
			description: "Optimizes the cropping logic specifically for ultrawide (21:9) monitors and videos, ensuring they fill the player correctly without stretching.",
			value: true,
			require: { RemoveBlackBars: true },
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsWorker",
			name: "Worker Thread",
			description: "Offloads the video analysis to a separate background thread. This prevents the main interface from stuttering or lagging during complex frame analysis.",
			value: true,
			lock: {
				condition: !isFirefox,
				message:
					"I didn't want to lock this feature for Firefox only, but Chromium browsers (Chrome, Edge, etc.) are making it really hard to get workers running correctly. Maybe I'm just stupid and can't make it work, but honestly, Chrome's rendering is already so fast that you won't see much of a performance boost anyway.",
			},
			require: { RemoveBlackBars: true },
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsLazyCheck",
			name: "Lazy Check",
			description: "Improves performance by skipping analysis on some frames. This significantly reduces CPU usage with minimal impact on how quickly black bars are detected.",
			value: false,
			require: { RemoveBlackBars: true },
		},
		{
			type: "numberSlide",
			id: "RemoveBlackBarsLazyAmount",
			name: "Check Interval",
			description: "Adjusts the delay between each black bar analysis. Higher values save more battery and CPU power but make the detection slightly slower to react to changes.",
			value: 50,
			min: -1,
			max: 200,
			step: 1,
			require: { RemoveBlackBars: true },
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsDebugCanvas",
			name: "Debug Canvas",
			description: "Visualizes the analysis process by showing a small canvas in the corner. Green lines indicate where the black bars were detected and cropped.",
			value: false,
			require: { RemoveBlackBars: true },
		},
		{
			type: "checkbox",
			id: "RemoveBlackBarsDebugInfo",
			name: "Debug Info",
			description: "Displays real-time technical statistics such as analysis latency, frame drops, and detection coordinates directly over the video player.",
			value: false,
			require: { RemoveBlackBars: true },
		},
	],
};
