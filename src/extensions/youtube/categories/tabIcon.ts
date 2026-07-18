import { type Category } from "@settings/types/styleshiftTypes";
import { disableTabIconChanger, enableTabIconChanger } from "../features/tabIcon";
import { GLOBAL_VISUAL_PROXY_SELECTOR } from "./selectors";

export const tabIconCategory: Category = {
	category: { icon: "tab", label: "Tab Icon" },
	selector: GLOBAL_VISUAL_PROXY_SELECTOR,
	settings: [
		{
			type: "checkbox",
			id: "EnableCustomTabIcon",
			name: "Custom Favicon",
			description: "Replaces the default YouTube logo in your browser tab with a custom image of your choice.",
			value: true,
			setupFunction: enableTabIconChanger,
			disableFunction: disableTabIconChanger,
		},
		{
			type: "imageInput",
			id: "TabIconImageUrl",
			name: "Icon Image",
			description:
				"Upload or paste a URL for the image you want to use as your browser tab icon. Works best with square PNG or ICO files.",
			value: "https://newtube.azpepoze.com/favicon.ico",
			maxFileSize: 1000000,
			require: { EnableCustomTabIcon: true },
		},
	],
};
