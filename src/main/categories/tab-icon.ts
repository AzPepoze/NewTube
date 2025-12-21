import { load } from "../../styleshift/core/save";
import { Category } from "../../styleshift/types/store";
import { setup_tab_icon_changer, disable_tab_icon_changer } from "../features/tab-icon";

export const tab_icon_category: Category = {
	category: "🔶 Tab icon",
	settings: [
		{
			type: "checkbox",
			id: "CustomIcon",
			name: "Enable Custom Tab icon",
			description: "replaces the YouTube browser tab icon (favicon) with a custom image.",
			value: true,
			setup_function: setup_tab_icon_changer,
			disable_function: disable_tab_icon_changer,
		},
		        {
		            type: "image_input",
		            id: "iconURL",
		            name: "Tab icon URL",
		            description: "URL for the custom tab icon image.",
		            value: "https://i.ibb.co/tD2VTyg/1705431438657.png",
		            max_file_size: 1000000,
		        },
		    ],
		};
