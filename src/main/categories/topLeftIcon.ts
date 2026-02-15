import { Category } from "../../styleshift/types/store";
import "../features/topLeftIcon"; // Import side-effects

export const topLeftIconCategory: Category = {
	category: "💠 Top-Left Icon",
	settings: [
		{
			type: "checkbox",
			id: "EnableCustomTopLeftIcon",
			name: "Custom Logo",
			description: "Replaces the default YouTube logo in the top-left corner with your own image or animated GIF.",
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
			type: "checkbox",
			id: "EnableTopLeftIconSyncTheme",
			name: "Sync Logo Color",
			description: "Makes the default YouTube logo match your main theme color. This setting is ignored if a 'Custom Logo' is enabled.",
			value: true,
			enableCss: `
                #logo-icon.ytd-topbar-logo-renderer .yt-spec-icon-shape-fill {
                    fill: var(--nt-theme-color, #FF0000) !important;
                }
            `,
		},
		{
			type: "imageInput",
			id: "TopLeftIconImageUrl",
			name: "Logo Image",
			description: "Upload or paste a URL for your custom logo. Transparent PNGs or GIFs work best.",
			value: "https://i.gifer.com/17xo.gif",
			maxFileSize: 2000000,
			require: { EnableCustomTopLeftIcon: true }
		},
		{
			type: "numberSlide",
			id: "TopLeftIconSize",
			name: "Logo Size",
			description: "Adjusts the scale of your custom logo to fit perfectly within the header bar.",
			value: 100,
			min: 10,
			max: 300,
			step: 5,
			varCss: "--nt-top-icon-size",
			require: { EnableCustomTopLeftIcon: true }
		},
		{
			type: "numberSlide",
			id: "TopLeftIconPositionX",
			name: "Position X",
			description: "Fine-tune the horizontal alignment of the custom logo.",
			value: 50,
			min: 0,
			max: 100,
			step: 1,
			varCss: "--nt-top-icon-x",
			require: { EnableCustomTopLeftIcon: true }
		},
		{
			type: "numberSlide",
			id: "TopLeftIconPositionY",
			name: "Position Y",
			description: "Fine-tune the vertical alignment of the custom logo.",
			value: 50,
			min: 0,
			max: 100,
			step: 1,
			varCss: "--nt-top-icon-y",
			require: { EnableCustomTopLeftIcon: true }
		},
		{
			type: "checkbox",
			id: "EnableTopLeftIconFlip",
			name: "Flip Logo",
			description: "Mirror your custom logo horizontally.",
			value: false,
			enableCss: `ytd-topbar-logo-renderer { --nt-top-icon-flip: scaleX(-1); }`,
			disableCss: `ytd-topbar-logo-renderer { --nt-top-icon-flip: scaleX(1); }`,
			require: { EnableCustomTopLeftIcon: true }
		},
		{
			type: "checkbox",
			id: "EnableTopLeftIconRepeat",
			name: "Repeat Logo",
			description: "Tiles the custom logo image. Useful for small textures or patterns.",
			value: false,
			enableCss: `ytd-topbar-logo-renderer { --nt-top-icon-repeat: repeat; }`,
			disableCss: `ytd-topbar-logo-renderer { --nt-top-icon-repeat: no-repeat; }`,
			require: { EnableCustomTopLeftIcon: true }
		},
	],
};
