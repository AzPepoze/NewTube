import { Category } from "../../styleshift/types/styleshiftTypes";
import { enableFlyout, disableFlyout } from "../features/video/flyout";
import { setupAutoShowChatReplay, disableAutoShowChatReplay } from "../features/video/chat";

const primaryContainer = "ytd-watch-flexy #primary.ytd-watch-flexy";
const primaryInnerContainer = "ytd-watch-flexy #primary-inner.ytd-watch-flexy";
const secondaryContainer = "ytd-watch-flexy #secondary.ytd-watch-flexy";
const secondaryInnerContainer = "ytd-watch-flexy #secondary-inner.ytd-watch-flexy";

export const enhancementCategory: Category = {
	category: { icon: "auto_fix_high", label: "Enhancement" },
	settings: [
		{
			type: "checkbox",
			id: "EnhancementSwapLayout",
			name: "Swap Sidebar",
			description: "Swaps the positions of the video player and the sidebar (recommendations/chat). Moves the sidebar to the left and the video to the right.",
			value: false,
			enableCss: `
                #columns {
                    display: flex !important;
                    flex-direction: row-reverse !important;
                }
                ${primaryContainer} {
                    margin-right: 0 !important;
                    margin-left: 24px !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "EnhancementIndependentScroll",
			name: "Independent Scroll",
			description: "Allows you to scroll through the sidebar and comments independently without moving the video player. Note: This feature is incompatible with Flyout Player.",
			value: false,
			enableCss: `
                ytd-watch-flexy #columns {
                    height: calc(100vh - 56px) !important;
                    overflow: hidden !important;
                }

                ${primaryContainer} {
                    height: 100% !important;
                    overflow-y: auto !important;
                    padding-right: 10px !important;
                    scrollbar-width: thin;
					transform: translateZ(0);
                }

                ${secondaryContainer} {
                    height: 100% !important;
                    overflow-y: auto !important;
                    scrollbar-width: thin;
					transform: translateZ(0);
                }
            `,
		},
		{
			type: "checkbox",
			id: "EnhancementIndependentScrollFadeBorder",
			name: "Independent Scroll Fade Border",
			description: "Adds a fade effect to the top and bottom of the sidebar when Independent Scroll is enabled.",
			value: true,
			enableCss: `
				:root {
					--newtube-fade-border: linear-gradient(to bottom, transparent, black 20px, black 95%, transparent);
				}

				${secondaryContainer},
				${primaryContainer} {
					mask-image: var(--newtube-fade-border) !important;
					-webkit-mask-image: var(--newtube-fade-border) !important;
				}
			`,
			require: {
				"EnhancementIndependentScroll": true
			}
		},
		{
			type: "conditionSetting",
			id: "EnhancementIndependentScrollLayout-Video-Side",
			name: "Independent Scroll Layout - Video | Sidebar",
			condition: {
				"EnhancementSwapLayout": false,
				"EnhancementIndependentScroll": true
			},
			enableCss: `
				${primaryContainer} {
					direction: rtl;
					padding: 10px !important;
					margin: 0px !important;
				}
				${primaryInnerContainer} {
					direction: ltr;
				}
				${secondaryContainer} {
					padding-left: 20px !important;
					margin-left: -20px !important;
				}
			`,
		},
		{
			type: "conditionSetting",
			id: "EnhancementIndependentScrollLayout-Side-Video",
			name: "Independent Scroll Layout - Sidebar | Video",
			condition: {
				"EnhancementSwapLayout": true,
				"EnhancementIndependentScroll": true
			},
			enableCss: `
				${secondaryContainer} {
					direction: rtl;
					padding: 10px !important;
					margin: 0px !important;
				}
				${secondaryInnerContainer} {
					direction: ltr;
				}
				${primaryContainer} {
					margin: 0px !important;
				}
			`,
		},
		{
			type: "checkbox",
			id: "EnhancementFlyoutPlayer",
			name: "Flyout Player",
			description: "Attaches a small, persistent version of the video player to the corner of your screen when you scroll down to read comments. Keeps the video visible at all times.",
			value: false,
			enableFunction: enableFlyout,
			disableFunction: disableFlyout,
			enableCss: `
				#player-container {
					z-index: 2000 !important;
				}

				.newtube-flyout-mode {
					--nt-player-below-space: 0px !important;

					position: fixed !important;
					z-index: 2000 !important;
					bottom: 24px !important;
					right: 24px !important;
					width: 420px !important;
					aspect-ratio: 16 / 9 !important;
					height: auto !important;
					top: unset !important;
					left: unset !important;
					border-radius: 16px !important;
					box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.1) !important;
					overflow: hidden !important;
					transition:
							opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
							scale 0.4s cubic-bezier(0.16, 1, 0.3, 1)
							!important;
                    animation: flyout-slide-in 1s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    cursor: move !important;
                    user-select: none !important;
				}

                @keyframes flyout-slide-in {
                    from {
                        opacity: 0;
						margin-bottom: -20px;
                    }
                    to {
                        opacity: 1;
						margin-bottom: 0;
                    }
                }
				
				.newtube-flyout-mode .html5-video-container {
					width: 100% !important;
					height: 100% !important;
				}
				
				.newtube-flyout-mode video {
					width: 100% !important;
					height: 100% !important;
					object-fit: cover !important;
				}

                .newtube-flyout-close {
                    position: absolute !important;
                    top: 12px !important;
                    right: 12px !important;
                    width: 32px !important;
                    height: 32px !important;
                    border-radius: 50% !important;
                    background: rgba(0, 0, 0, 0.5) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer !important;
                    z-index: 2001 !important;
                    opacity: 0;
                    transition: opacity 0.2s, background 0.2s !important;
                    backdrop-filter: blur(4px) !important;
                }

                .newtube-flyout-mode:hover .newtube-flyout-close {
                    opacity: 1;
                }

                .newtube-flyout-close:hover {
                    background: rgba(255, 0, 0, 0.6) !important;
                }

                .newtube-flyout-close .material-icons {
                    font-size: 18px !important;
                }

				.newtube-flyout-mode .ytp-chrome-bottom {
					width: 100% !important;
					left: 0 !important;
                    background: linear-gradient(transparent, rgba(0,0,0,0.7)) !important;
                    padding-bottom: 4px !important;
				}

				.newtube-flyout-mode .ytp-overlay-bottom-right {
					display: none !important;
				}
				
				.newtube-flyout-mode .ytp-size-button,
				.newtube-flyout-mode .ytp-fullscreen-button,
				.newtube-flyout-mode .ytp-settings-button,
				.newtube-flyout-mode .ytp-subtitles-button,
				.newtube-flyout-mode .ytp-miniplayer-button,
				.newtube-flyout-mode .ytp-remote-button,
				.newtube-flyout-mode .ytp-chapter-container {
					display: none !important;
				}
      		`,
		},
		{
			type: "checkbox",
			id: "EnhancementAutoChatReplay",
			name: "Auto Chat Replay",
			description: "Automatically enables and expands the 'Chat Replay' window for premiered videos and past livestreams.",
			value: false,
			enableFunction: setupAutoShowChatReplay,
			disableFunction: disableAutoShowChatReplay,
		},
	],
};
