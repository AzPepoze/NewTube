import { Category } from "../../styleshift/types/store";
import { setupRemoveBlackBars, destroyRemoveBlackBars } from "../features/removeBlackBars";

export const removeBlackBarsCategory: Category = {
	category: "🔳 Remove black bars on video",
	settings: [
		{
			type: "checkbox",
			id: "DelBar",
			name: "Remove black bars top-bottom",
			description: "Analyzes the video to automatically crop out horizontal black bars.",
			value: false,
			enableFunction: setupRemoveBlackBars,
			disableFunction: destroyRemoveBlackBars,
		},
		{
			type: "checkbox",
			id: "UltraWide",
			name: "Fit ultrawide video",
			description: "Helps to fit ultrawide (21:9) videos better.",
			value: true,
		},
		{
			type: "checkbox",
			id: "DropFrame",
			name: "Lazy Check (Drop Frame)",
			description: "A performance-saving option that skips checks on some frames.",
			value: false,
		},
		{
			type: "numberSlide",
			id: "LazyAmount",
			name: "Lazy Check Cooldown",
			description: "Adjusts how often the check is performed (higher is lazier).",
			value: 50,
			min: -1,
			max: 200,
			step: 1,
		},
		{
			type: "checkbox",
			id: "DelBarDebug",
			name: "Debug Canvas",
			description: "Shows the analysis canvas for debugging black bar detection.",
			value: false,
		},
		{
			type: "checkbox",
			id: "DelBarDebugInfo",
			name: "Debug Info",
			description: "Shows technical information over the video player.",
			value: false,
		},
	],
};
