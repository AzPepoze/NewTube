import { Category } from "../../styleshift/types/store";
import { setup_remove_black_bars, destroy_remove_black_bars } from "../features/remove-black-bars";

export const remove_black_bars_category: Category = {
	category: "🔳 Remove black bars on video",
	settings: [
		{
			type: "checkbox",
			id: "DelBar",
			name: "Remove black bars top-bottom",
			description: "Analyzes the video to automatically crop out horizontal black bars.",
			value: false,
			enable_function: setup_remove_black_bars,
			disable_function: destroy_remove_black_bars,
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
			type: "number_slide",
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
			name: "Remove black bars Debug",
			description: "Shows the analysis canvas for debugging black bar detection.",
			value: false,
		},
	],
};
