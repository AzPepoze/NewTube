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
			type: "number_slide",
			id: "ScWidth",
			name: "Scrollbar width (Legacy)",
			description: "Adjusts the scrollbar width for webkit browsers (Chrome, Safari).",
			value: 10,
			min: 0,
			max: 30,
			step: 1,
			var_css: "--scrollbar-width",
			constant_css: `
                ::-webkit-scrollbar {
                    width: var(--scrollbar-width, 10px) !important;
                    height: var(--scrollbar-width, 10px) !important;
                }
            `,
		},
		{
			type: "color",
			id: "BGC",
			name: "Scrollbar track Background",
			description: "Changes the color of the scrollbar track (the part behind the handle).",
			value: "#00000000",
			var_css: "--scrollbar-track-color",
			constant_css: `
                body::-webkit-scrollbar-track {
                    background: var(--scrollbar-track-color, #00000000) !important;
                }
                @supports (scrollbar-width: thin) {
                    * {
                        scrollbar-color: var(--theme-color) var(--scrollbar-track-color, transparent) !important;
                    }
                }
            `,
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
		{
			type: "checkbox",
			id: "HideShorts",
			name: "hide Shorts Section/Link",
			description: "hides the Shorts link from the sidebar and Shorts sections from the feed.",
			value: false,
			enable_css: `
                ytd-guide-entry-renderer:has(path[d^="M10 14.65v-5.3L15 12l-5 2.65"]),
                ytd-rich-shelf-renderer[is-shorts],
                ytd-reel-shelf-renderer {
                    display: none !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "HideExplore",
			name: "hide Explore Section",
			description: "hides the Explore (Trending, Music, etc.) section from the sidebar.",
			value: false,
			enable_css: `
                ytd-guide-section-renderer:has(path[d^="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2"]) {
                    display: none !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "HideMoreFromYT",
			name: "hide 'More from YouTube'",
			description: "hides the 'More from YouTube' section from the sidebar.",
			value: false,
			enable_css: `
                ytd-guide-section-renderer:has(#guide-section-title:contains("More from YouTube")) {
                    display: none !important;
                }
            `,
		},
	],
};
