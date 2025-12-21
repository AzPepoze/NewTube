import { Category } from "../../styleshift/types/store";

export const hover_click_color_category: Category = {
	category: "🖱️ hover/Click color",
	settings: [
		{
			type: "color",
			id: "Themehover",
			name: "Main hover Background color",
			description:
				"The background color for most elements when you hover over them (e.g., menu items, buttons).",
			value: "#659aff80",
			var_css: "--theme-hover-bg-color",
			constant_css: `
                ytd-guide-entry-renderer:hover,
                tp-yt-paper-item:hover,
                .ytp-menuitem:hover,
                ytd-menu-popup-renderer:not([disable-upgrade]) tp-yt-paper-listbox.ytd-menu-popup-renderer .yt-spec-touch-feedback-shape--touch-response-inverse {
                    background-color: var(--theme-hover-bg-color) !important;
                }
            `,
		},
		{
			type: "color",
			id: "Playlisthover",
			name: "Playlist hover Background color",
			description: "The background color for videos in a playlist when you hover over them.",
			value: "#659aff80",
			var_css: "--playlist-hover-bg-color",
			constant_css: `
                ytd-playlist-panel-video-renderer:hover {
                    background-color: var(--playlist-hover-bg-color) !important;
                }
            `,
		},
	],
};
