import { Category } from "../../styleshift/types/store";

export const bordersShadowsCategory: Category = {
	category: "🔳 Borders / Shadows",
	settings: [
		{
			type: "dropdown",
			id: "OutOrSha",
			name: "Style type",
			description: "Choose between outlines (borders), shadows, or none for applicable elements.",
			value: "Sha",
			options: {
				Out: {
					enableCss: `
                        :root {
                            --nt-global-outline: var(--nt-border-width, 1px) solid var(--nt-border-color, #099DFF80);
                            --nt-global-shadow: none;
                        }
                    `,
				},
				Sha: {
					enableCss: `
                        :root {
                            --nt-global-outline: none;
                            --nt-global-shadow: 0 0 var(--nt-border-width, 8px) var(--nt-border-color, #099DFF80);
                        }
                    `,
				},
				None: {
					enableCss: `
                        :root {
                            --nt-global-outline: none;
                            --nt-global-shadow: none;
                        }
                    `,
				},
			},
		},
		{
			type: "numberSlide",
			id: "Border",
			name: "width / size",
			description: "Adjusts the width of the border or the size of the shadow.",
			value: 8,
			min: 1,
			max: 50,
			step: 1,
			varCss: "--nt-border-width",
		},
		{
			type: "color",
			id: "OutSha",
			name: "color",
			description: "The color of the border or shadow.",
			value: "#099DFF80",
			varCss: "--nt-border-color",
		},
		{
			type: "numberSlide",
			id: "Edge",
			name: "Corner Radius",
			description: "Global corner roundness for UI elements.",
			value: 10,
			min: 0,
			max: 100,
			step: 1,
			varCss: "--nt-border-radius",
		},
	],
};
