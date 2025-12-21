import { Category } from "../../styleshift/types/store";

export const blur_category: Category = {
	category: "🪟 Blur",
	settings: [
		{
			type: "number_slide",
			id: "BlurAm",
			name: "Blur Amount",
			description: "Global blur intensity.",
			value: 5,
			min: 0,
			max: 50,
			step: 1,
			var_css: "--global-blur-amount",
		},
		{
			type: "dropdown",
			id: "BlurWhat",
			name: "Things to blur",
			value: "none",
			options: {
				all: {
					enable_css: `
                        #masthead > #background,
                        ytd-multi-page-menu-renderer,
                        .ytp-popup,
                        .ytp-tooltip,
                        #guide-content,
                        ytd-mini-guide-renderer,
                        .sbdd_b,
                        .ytp-settings-menu,
                        #chips-wrapper
                        {
                            backdrop-filter: blur(var(--global-blur-amount)) !important;
                        }
                    `,
				},
				main: {
					enable_css: `
                        #masthead > #background,
                        #guide-content
                        {
                            backdrop-filter: blur(var(--global-blur-amount)) !important;
                        }
                    `,
				},
				none: { enable_css: "" },
			},
		},
	],
};
