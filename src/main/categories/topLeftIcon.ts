import { Category } from "../../styleshift/types/store";
import "../features/topLeftIcon"; // Import side-effects

export const topLeftIconCategory: Category = {
	category: "💠 Top-Left icon",
	settings: [
		{
			type: "checkbox",
			id: "ReplaceYT",
			name: "Enable Custom Top-Left icon",
			description: "replaces the YouTube logo with a custom image.",
			value: false,
			enableCss: `
                ytd-topbar-logo-renderer #logo-icon {
                    display: none !important;
                }
                ytd-topbar-logo-renderer {
                    background-image: var(--nt-top-icon-url) !important;
                    background-position: var(--nt-top-icon-x, 50%) var(--nt-top-icon-y, 50%) !important;
                    background-size: var(--nt-top-icon-size, 100%) !important;
                    background-repeat: var(--nt-top-icon-repeat, no-repeat) !important;
                    transform: var(--nt-top-icon-flip, scaleX(1));
                }
            `,
		},
		{
			type: "imageInput",
			id: "ReplaceYTURL",
			name: "icon image URL",
			description: "URL for the custom icon image.",
			value: "https://i.gifer.com/17xo.gif",
			maxFileSize: 2000000,
		},
		{
			type: "numberSlide",
			id: "TopIconX",
			name: "image Position X",
			description: "Horizontal position of the custom icon.",
			value: 50,
			min: 0,
			max: 100,
			step: 1,
			varCss: "--nt-top-icon-x",
		},
		{
			type: "numberSlide",
			id: "TopIconY",
			name: "image Position Y",
			description: "Vertical position of the custom icon.",
			value: 50,
			min: 0,
			max: 100,
			step: 1,
			varCss: "--nt-top-icon-y",
		},
		{
			type: "numberSlide",
			id: "YTSize",
			name: "image size",
			description: "size of the custom icon.",
			value: 100,
			min: 10,
			max: 300,
			step: 5,
			varCss: "--nt-top-icon-size",
		},
		{
			type: "checkbox",
			id: "TopIconFlip",
			name: "Flip image",
			description: "Flips the custom icon horizontally.",
			value: false,
			enableCss: `ytd-topbar-logo-renderer { --nt-top-icon-flip: scaleX(-1); }`,
			disableCss: `ytd-topbar-logo-renderer { --nt-top-icon-flip: scaleX(1); }`,
		},
		{
			type: "checkbox",
			id: "TopIconRepeat",
			name: "Repeat image",
			description: "Repeats the custom icon image.",
			value: false,
			enableCss: `ytd-topbar-logo-renderer { --nt-top-icon-repeat: repeat; }`,
			disableCss: `ytd-topbar-logo-renderer { --nt-top-icon-repeat: no-repeat; }`,
		},
		{
			type: "checkbox",
			id: "IconFill",
			name: "Sync icon color with Theme",
			description:
				"Makes the default YouTube icon color match the main theme color. Does not work if custom icon is enabled.",
			value: true,
			enableCss: `
                #logo-icon.ytd-topbar-logo-renderer .yt-spec-icon-shape-fill {
                    fill: var(--nt-theme-color, #FF0000) !important;
                }
            `,
		},
	],
};
