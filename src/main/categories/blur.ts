import { Category } from "../../styleshift/types/store";

export const blurCategory: Category = {
	category: "🪟 Blur",
	settings: [
		{
			type: "numberSlide",
			id: "GlobalBlurAmount",
			name: "Blur Intensity",
			description:
				"Adjusts the overall strength of the blur effect applied to various YouTube interface elements. Higher values create a more pronounced frosted-glass look.",
			value: 5,
			min: 0,
			max: 50,
			step: 1,
			varCss: "--nt-general-blur-amount",
		},
		{
			type: "dropdown",
			id: "BlurTargetSelection",
			name: "Apply Blur To",
			description: "Choose which parts of the YouTube interface should have the blur effect applied to them.",
			value: "none",
			options: {
				all: {
					name: "Everything",
					enableCss: `
                        #masthead > #background,
                        ytd-multi-page-menu-renderer,
                        .ytp-popup,
                        .ytp-tooltip,
                        #guide-content,
                        ytd-mini-guide-renderer,
                        .sbddB,
                        .ytp-settings-menu,
                        #chips-wrapper
                        {
                            backdrop-filter: blur(var(--nt-general-blur-amount)) !important;
                        }
                    `,
				},
				main: {
					name: "Main Interfaces",
					enableCss: `
                        #masthead > #background,
                        #guide-content
                        {
                            backdrop-filter: blur(var(--nt-general-blur-amount)) !important;
                        }
                    `,
				},
				none: {
					name: "None",
					enableCss: "",
				},
			},
		},
	],
};
