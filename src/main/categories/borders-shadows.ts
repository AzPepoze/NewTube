import { Category } from "../../styleshift/types/store";

export const borders_shadows_category: Category = {
	category: "🔳 Borders / Shadows",
	settings: [
		{
			type: "dropdown",
			id: "OutOrSha",
			name: "Style type",
			description: "Choose between outlines (borders), shadows, or none for applicable elements.",
			value: "Shadows",
			options: {
				Borders: {
					enable_css: `
                        :root {
                            --global-style-outline: var(--global-border-width, 1px) solid var(--global-border-color, #099DFF80);
                            --global-style-shadow: none;
                        }
                    `,
				},
				Shadows: {
					enable_css: `
                        :root {
                            --global-style-outline: none;
                            --global-style-shadow: 0 0 var(--global-border-width, 8px) var(--global-border-color, #099DFF80);
                        }
                    `,
				},
				None: {
					enable_css: `
                        :root {
                            --global-style-outline: none;
                            --global-style-shadow: none;
                        }
                    `,
				},
			},
		},
		{
			type: "number_slide",
			id: "Border",
			name: "width / size",
			description: "Adjusts the width of the border or the size of the shadow.",
			value: 8,
			min: 1,
			max: 50,
			step: 1,
			var_css: "--global-border-width",
		},
		{
			type: "color",
			id: "OutSha",
			name: "color",
			description: "The color of the border or shadow.",
			value: "#099DFF80",
			var_css: "--global-border-color",
		},
	],
};
