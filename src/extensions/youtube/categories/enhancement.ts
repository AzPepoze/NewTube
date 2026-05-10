import { type Category } from "@settings/types/styleshiftTypes";
import { disableFlyout, enableFlyout } from "../features/flyout/flyout";
import { disableAutoShowChatReplay, setupAutoShowChatReplay } from "../features/video/chat";

export const primaryContainer = "ytd-watch-flexy #primary.ytd-watch-flexy";
export const primaryInnerContainer = "ytd-watch-flexy #primary-inner.ytd-watch-flexy";
export const secondaryContainer = "ytd-watch-flexy #secondary.ytd-watch-flexy";
export const secondaryInnerContainer = "ytd-watch-flexy #secondary-inner.ytd-watch-flexy";

export const enhancementCategory: Category = {
	category: { icon: "auto_fix_high", label: "Enhancement" },
	settings: [
		{
			type: "checkbox",
			id: "EnhancementSwapLayout",
			name: "Swap Sidebar",
			description:
				"Swaps the positions of the video player and the sidebar (recommendations/chat). Moves the sidebar to the left and the video to the right.",
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
			description:
				"Allows you to scroll through the sidebar and comments independently without moving the video player. Note: This feature is incompatible with Flyout Player.",
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
				EnhancementIndependentScroll: true,
			},
		},
		{
			type: "conditionSetting",
			id: "EnhancementIndependentScrollLayout-Video-Side",
			name: "Independent Scroll Layout - Video | Sidebar",
			condition: {
				EnhancementSwapLayout: false,
				EnhancementIndependentScroll: true,
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
			`,
		},
		{
			type: "conditionSetting",
			id: "EnhancementIndependentScrollLayout-Side-Video",
			name: "Independent Scroll Layout - Sidebar | Video",
			condition: {
				EnhancementSwapLayout: true,
				EnhancementIndependentScroll: true,
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
			description:
				"Attaches a small, persistent version of the video player to the corner of your screen when you scroll down to read comments. Keeps the video visible at all times.",
			value: true,
			enableFunction: enableFlyout,
			disableFunction: disableFlyout,
			enableCss: `
				#player-container {
					z-index: 2000 !important;
				}
      		`,
		},
		{
			type: "checkbox",
			id: "EnhancementAutoChatReplay",
			name: "Auto Chat Replay",
			description:
				"Automatically enables and expands the 'Chat Replay' window for premiered videos and past livestreams.",
			value: false,
			enableFunction: setupAutoShowChatReplay,
			disableFunction: disableAutoShowChatReplay,
		},
	],
};
