import { Category } from "../../styleshift/types/store";

export const animationCategory: Category = {
	category: "🚶 Animations",
	settings: [
		{
			type: "checkbox",
			id: "GlobalAnimations",
			name: "Global Animations",
			description: "Enable or disable all added animations.",
			enableCss: `
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fadeInLeft {
					from {
						opacity: 0;
						transform: translateX(-10px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes fadeInRight {
					from {
						opacity: 0;
						transform: translateX(10px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes fadeOutDown {
					from {
						opacity: 1;
						transform: translateY(0);
					}
					to {
						opacity: 0;
						transform: translateY(10px);
					}
				}
					
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes fadeOut {
					from {
						opacity: 1;
					}
					to {
						opacity: 0;
					}
				}

				@keyframes scaleIn {
					from {
						opacity: 0;
						transform: scale(0.95);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}

				@keyframes scaleOut {
					from {
						opacity: 1;
						transform: scale(1);
					}
					to {
						opacity: 0;
						transform: scale(0.95);
					}
				}
					
				@keyframes slideIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes slideOut {
					from {
						opacity: 1;
						transform: translateY(0);
					}
					to {
						opacity: 0;
						transform: translateY(10px);
					}
				}
			`,
			value: true,
		},
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
                tp-yt-iron-dropdown {
                    transition: transform .4s, opacity .4s;
                    display: flex !important;
                }

                tp-yt-iron-dropdown:not([aria-hidden="true"]) {
                    animation: scaleIn .4s;
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
			id: "SearchAnimation",
			name: "Search Animation",
			description: "Adds a subtle animation to the search bar and search suggestions.",
			value: true,
			enableCss: `
                .ytSearchboxComponentInnerSearchIcon {
					animation: fadeInRight 0.2s ease-out forwards;
				}

				.ytSearchboxComponentSuggestionsContainer {
					opacity: 0;
					display: block !important;
					animation: fadeInUp 0.3s ease-out forwards;
				}

				.ytSearchboxComponentSuggestionsContainer[hidden] {
					animation: fadeOutDown 0.3s ease-out forwards;
					pointer-events: none;
				}

				.ytSearchboxComponentClearButtonWrapper {
					animation: scaleIn 0.2s ease-out forwards;
				}
            `,
		},
		{
			type: "checkbox",
			id: "EnableVideoPageTransitions",
			name: "Smooth Loading",
			description:
				"Adds a subtle fade and scale animation when a new video starts playing, making the transition between videos feel more premium.",
			value: true,
			enableCss: `
				.html5-video-container {
					transition: all 1s, background 0.1s;
				}
					
				div.ended-mode .html5-video-container,
				div.unstarted-mode:not(.ytp-small-mode) .html5-video-container {
					opacity: 0 !important;
				}
			`,
		},
		{
			type: "checkbox",
			id: "EnableThumbnailPreviewAnimations",
			name: "Thumbnail Previews Animation",
			description: "Adds a subtle fade-in animation to thumbnail previews.",
			value: true,
			enableCss: `
				animated-thumbnail-overlay-view-model {
					animation: fadeIn 0.2s forwards;
				}
			`
		},
		{
			type: "checkbox",
			id: "EnableThumbnailButtonAnimations",
			name: "Enhanced UI",
			description: "Adds a subtle slide animation to thumbnail buttons.",
			value: true,
			enableCss: `

				@keyframes thumbnailButtonShow {
					from {
						opacity: 0;
						transform: translateX(40px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				yt-thumbnail-hover-overlay-toggle-actions-view-model {
					opacity: 0;
					animation: thumbnailButtonShow 0.3s ease-out forwards;
				}
			`
		}
	],
};
