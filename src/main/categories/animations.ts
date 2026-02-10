import { Category } from "../../styleshift/types/store";

export const animationCategory: Category = {
	category: "🚶 Animations",
	settings: [
		{
			type: "checkbox",
			id: "Ptran",
			name: "Enable Page Transition",
			description: "Adds a fade-in and slide-in animation when navigating between video pages.",
			value: true,
			enableCss: `
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
		{
			type: "checkbox",
			id: "SearchIconAni",
			name: "Enable Search icon moving animation",
			description: "Adds a subtle moving animation to the search icon.",
			value: false,
			enableCss: `
                #search-icon-legacy[ytd-searchbox].ytd-searchbox:not([is-iconbox]) yt-icon.ytd-searchbox {
                    animation: SearchIconMove 2s infinite;
                }
                @keyframes SearchIconMove {
                    0% { transform: scale(1) translate(0px, 0px) rotate(0deg); }
                    30% { transform: scale(1) translate(2px, 2px) rotate(4deg); }
                    60% { transform: scale(1) translate(-2px, -2px) rotate(-4deg); }
                    100% { transform: scale(1) translate(0px, 0px) rotate(0deg); }
                }
            `,
		},
		{
			type: "checkbox",
			id: "MenuAnim",
			name: "Enable Menu Fade-in Animation",
			description: "Adds a smooth fade and scale effect to YouTube dropdown menus and popups.",
			value: true,
			enableCss: `
                @keyframes show-box {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }

                tp-yt-iron-dropdown {
                    transition: transform .4s, opacity .4s;
                    display: flex !important;
                }

                tp-yt-iron-dropdown:not([aria-hidden="true"]) {
                    animation: show-box .4s;
                }

                tp-yt-iron-dropdown[aria-hidden="true"] {
                    pointer-events: none;
                    opacity: 0 !important;
                    transform: scale(0.9) !important;
                }
            `,
		},
	],
};
