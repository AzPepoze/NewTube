import { Category } from "../../styleshift/types/store";
import { setupTabIconChanger, disableTabIconChanger } from "../features/tabIcon";

export const tabIconCategory: Category = {
	category: "🔶 Tab icon",
	settings: [
		{
			type: "checkbox",
			id: "CustomIcon",
			name: "Enable Custom Tab icon",
			description: "replaces the YouTube browser tab icon (favicon) with a custom image.",
			value: true,
			setupFunction: setupTabIconChanger,
			disableFunction: disableTabIconChanger,
		},
		{
			type: "imageInput",
			id: "iconURL",
			name: "Tab icon URL",
			description: "URL for the custom tab icon image.",
			value: "https://i.ibb.co/tD2VTyg/1705431438657.png",
			maxFileSize: 1000000,
		},
	],
};
