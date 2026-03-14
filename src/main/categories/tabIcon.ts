import { Category } from "../../styleshift/types/styleshiftTypes";
import { setupTabIconChanger, disableTabIconChanger } from "../features/tabIcon";

export const tabIconCategory: Category = {
	category: { icon: "tab", label: "Tab Icon" },
	settings: [
		{
			type: "checkbox",
			id: "EnableCustomTabIcon",
			name: "Custom Favicon",
			description: "Replaces the default YouTube logo in your browser tab with a custom image of your choice.",
			value: true,
			setupFunction: setupTabIconChanger,
			disableFunction: disableTabIconChanger,
		},
		{
			type: "imageInput",
			id: "TabIconImageUrl",
			name: "Icon Image",
			description: "Upload or paste a URL for the image you want to use as your browser tab icon. Works best with square PNG or ICO files.",
			value: "https://i.ibb.co/tD2VTyg/1705431438657.png",
			maxFileSize: 1000000,
			require: { EnableCustomTabIcon: true }
		},
	],
};
