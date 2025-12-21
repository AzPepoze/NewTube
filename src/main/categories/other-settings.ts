import { Category } from "../../styleshift/types/store";

export const other_settings_category: Category = {
	category: "⚛️ Other settings",
	settings: [
		{
			type: "dropdown",
			id: "ScWidthNew",
			name: "Scrollbar width",
			description: "Changes the width of the browser scrollbar on YouTube.",
			value: "thin",
			options: {
				auto: { enable_css: `html { scrollbar-width: auto; }` },
				thin: { enable_css: `html { scrollbar-width: thin; }` },
				none: { enable_css: `html { scrollbar-width: none; }` },
			},
		},
		{
			type: "checkbox",
			id: "VBG",
			name: "Remove Theater Background",
			description: "Removes the black background behind the video in theater mode.",
			value: true,
			enable_css: `
                #full-bleed-container:has(div.html5-video-player:not(.ytp-fullscreen)) {
                    background-color: transparent !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "HideYourChannel",
			name: "hide 'Your channel' Link",
			description: "hides the 'Your channel' link from the left sidebar.",
			value: false,
			enable_css: `
                #section-items > ytd-guide-entry-renderer:nth-child(2) {
                    display: none !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "HideYourVID",
			name: "hide 'Your videos' Link",
			description: "hides the 'Your videos' link from the left sidebar.",
			value: false,
			enable_css: `
                #section-items > ytd-guide-entry-renderer:nth-child(4) {
                    display: none !important;
                }
            `,
		},
	],
};
