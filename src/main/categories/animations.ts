import { Category } from "../../styleshift/types/store";

export const animation_category: Category = {
	category: "🚶 Animations",
	settings: [
		{
			type: "checkbox",
			id: "Ptran",
			name: "Enable Page Transition",
			description: "Adds a fade-in and slide-in animation when navigating between video pages.",
			value: true,
			enable_css: `
                ytd-page-manager:has(div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode)) {
                    transition: all 0.5s;
                }

                ytd-watch-flexy:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) #secondary,
                ytd-watch-flexy:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) #below {
                    transition: all 0.5s !important;
                    opacity: 0 !important;
                }

                ytd-watch-flexy:not(:has(div.ytp-offline-slate)):has(div.html5-video-player.unstarted-mode:not(.ytp-small-mode)) #below {
                    margin-top: 100px;
                }

                #secondary,
                #below {
                    transition: margin-top 1.5s, opacity 1.5s;
                }
            `,
		},
	],
};
