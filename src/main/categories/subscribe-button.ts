import { Category } from "../../styleshift/types/store";

export const subscribe_button_category: Category = {
	category: "▶️ Subscribe button",
	settings: [
		{
			type: "checkbox",
			id: "SPSubScribe",
			name: "Enable Custom Subscribe button colors",
			description: "Allows you to set separate colors for the subscribe button.",
			value: false,
			enable_css: `
                .ytd-subscribe-button-renderer button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
                    background: var(--subscribe-bg-color) !important;
                    color: var(--subscribe-text-color) !important;
                    border-radius: var(--theme-radius) !important;
                }
            `,
		},
		{
			type: "color",
			id: "SPSubScribeBG",
			name: "Subscribe button Background",
			description: "The background color of the subscribe button.",
			value: "#ff0000ff",
			var_css: "--subscribe-bg-color",
		},
		{
			type: "color",
			id: "SPSubScribeColor",
			name: "Subscribe button text color",
			description: "The text color of the subscribe button.",
			value: "#ffffffff",
			var_css: "--subscribe-text-color",
		},
		{
			type: "checkbox",
			id: "SubOut",
			name: "Enable Borders/Shadows",
			description: "Adds borders or shadows to the subscribe button.",
			value: false,
			enable_css: `
                .ytd-subscribe-button-renderer button {
                    box-shadow: var(--global-style-shadow) !important;
                    border: var(--global-style-outline) !important;
                }
            `,
		},
	],
};
