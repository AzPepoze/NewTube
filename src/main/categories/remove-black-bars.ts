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
			name: "Fit ultrawide video (Not Implemented)",
			description:
				"Helps to fit ultrawide (21:9) videos better. This specific sub-feature is not yet implemented.",
			value: true,
		},
		{
			type: "checkbox",
			id: "Dropframe",
			name: "Lazy Check (Not Implemented)",
			description: "A performance-saving option. This specific sub-feature is not yet implemented.",
			value: false,
		},
		{
			type: "number_slide",
			id: "LazyAmount",
			name: "Lazy Check Cooldown (Not Implemented)",
			description:
				"Adjusts how often the check is performed. This specific sub-feature is not yet implemented.",
			value: 50,
			min: -1,
			max: 200,
			step: 1,
		},
	],
};
