import { Category } from "../../styleshift/types/store";

export const animationCategory: Category = {
	category: "🚶 Animations",
	settings: [
		{
			type: "checkbox",
			id: "PageTransitions",
			name: "Page Transitions",
			description: "Adds a smooth fade-in and slide-in motion effect when navigating between different video pages or search results.",
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
			id: "MenuAnimations",
			name: "Menu Animations",
			description: "Applies a polished fade and scale-up animation to all dropdown menus, context menus, and popup windows.",
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
		{
			type: "checkbox",
			id: "SearchIconAnimation",
			name: "Search Icon",
			description: "Adds a subtle, continuous floating movement to the magnifying glass icon in the search bar.",
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
	],
};
