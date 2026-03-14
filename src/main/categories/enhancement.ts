import { Category } from "../../styleshift/types/styleshiftTypes";
import { enableFlyout } from "../features/video/flyout";
import { setupAutoShowChatReplay } from "../features/video/chat";

export const enhancementCategory: Category = {
	category: { icon: "camera_enhance", label: "Enhancement" },
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
                #secondary {
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
                html, body {
                    overflow: hidden !important;
                }
                ytd-app {
                    height: 100vh !important;
                    overflow: hidden !important;
                }
                #columns {
                    height: calc(100vh - 56px) !important;
                    overflow: hidden !important;
                }
                #primary {
                    height: 100% !important;
                    overflow-y: auto !important;
                    padding-right: 10px !important;
                    scrollbar-width: thin;
                }
                #secondary {
                    height: 100% !important;
                    overflow-y: auto !important;
                    scrollbar-width: thin;
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
			enableCss: `
      .newtube-flyout-mode {
        position: fixed !important;
        z-index: 2000 !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 400px !important;
        height: 225px !important; /* 16:9 aspect ratio of 400px */
        top: unset !important;
        left: unset !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 20px rgba(0,0,0,0.6) !important;
        overflow: hidden !important;
        transition: all 0.3s ease !important;
      }
      
      .newtube-flyout-mode .html5-video-container {
        width: 100% !important;
        height: 100% !important;
      }
      
      .newtube-flyout-mode video {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
      }

      /* Hide some controls in flyout mode to keep it clean */
      .newtube-flyout-mode .ytp-chrome-bottom {
        width: 100% !important;
        left: 0 !important;
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
		},
	],
};
