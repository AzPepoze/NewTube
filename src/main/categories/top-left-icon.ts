import { Category } from "../../styleshift/types/store";
import "../features/top-left-icon"; // Import side-effects

export const top_left_icon_category: Category = {
	category: "💠 Top-Left icon",
	settings: [
		{
			type: "checkbox",
			id: "ReplaceYT",
			name: "Enable Custom Top-Left icon",
			description: "replaces the YouTube logo with a custom image.",
			value: false,
			enable_css: `
                ytd-topbar-logo-renderer #logo-icon {
                    display: none !important;
                }
                ytd-topbar-logo-renderer {
                    background-image: url(var(--top-icon-url)) !important;
                    background-position: var(--top-icon-x, 50%) var(--top-icon-y, 50%) !important;
                    background-size: var(--top-icon-size, 100%) !important;
                    background-repeat: var(--top-icon-repeat, no-repeat) !important;
                    transform: var("--top-icon-flip", scaleX(1));
                }
            `,
		},
		{
			type: "image_input",
			id: "ReplaceYTURL",
			name: "icon image URL",
			description: "URL for the custom icon image.",
			value: "https://i.gifer.com/17xo.gif",
			max_file_size: 2000000,
		},
		{
			type: "number_slide",
			id: "TopiconX",
			name: "image Position X",
			description: "Horizontal position of the custom icon.",
			value: 50,
			min: 0,
			max: 100,
			step: 1,
			var_css: "--top-icon-x",
		},
		{
			type: "number_slide",
			id: "TopiconY",
			name: "image Position Y",
			description: "Vertical position of the custom icon.",
			value: 50,
			min: 0,
			max: 100,
			step: 1,
			var_css: "--top-icon-y",
		},
		{
			type: "number_slide",
			id: "YTsize",
			name: "image size",
			description: "size of the custom icon.",
			value: 100,
			min: 10,
			max: 300,
			step: 5,
			var_css: "--top-icon-size",
		},
		{
			type: "checkbox",
			id: "TopiconFlip",
			name: "Flip image",
			description: "Flips the custom icon horizontally.",
			value: false,
			enable_css: `ytd-topbar-logo-renderer { --top-icon-flip: scaleX(-1); }`,
			disable_css: `ytd-topbar-logo-renderer { --top-icon-flip: scaleX(1); }`,
		},
		{
			type: "checkbox",
			id: "TopiconRepeat",
			name: "Repeat image",
			description: "Repeats the custom icon image.",
			value: false,
			enable_css: `ytd-topbar-logo-renderer { --top-icon-repeat: repeat; }`,
			disable_css: `ytd-topbar-logo-renderer { --top-icon-repeat: no-repeat; }`,
		},
		{
			type: "checkbox",
			id: "IconFill",
			name: "Sync icon color with Theme",
			description:
				"Makes the default YouTube icon color match the main theme color. Does not work if custom icon is enabled.",
			value: true,
			enable_css: `
                #logo-icon.ytd-topbar-logo-renderer .yt-spec-icon-shape-fill {
                    fill: var(--theme-color, #FF0000) !important;
                }
            `,
		},
	],
};
