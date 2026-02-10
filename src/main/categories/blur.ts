import { Category } from "../../styleshift/types/store";

export const blurCategory: Category = {
	category: "🪟 Blur",
	settings: [
		{
			type: "numberSlide",
			id: "BlurAm",
			name: "Blur Amount",
			description: "Global blur intensity.",
			value: 5,
			min: 0,
			max: 50,
			step: 1,
			varCss: "--nt-general-blur-amount",
		},
		{
			type: "dropdown",
			id: "BlurWhat",
			name: "Things to blur",
			value: "none",
			options: {
				all: {
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
					enableCss: `
                        #masthead > #background,
                        #guide-content
                        {
                            backdrop-filter: blur(var(--nt-general-blur-amount)) !important;
                        }
                    `,
				},
				none: { enableCss: "" },
			},
		},
	],
};
