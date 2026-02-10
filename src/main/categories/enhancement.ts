import { Category } from "../../styleshift/types/store";
import { setupFlyout } from "../features/video/flyout";
import { setupAutoShowChatReplay } from "../features/video/chat";

export const enhancementCategory: Category = {
	category: "🎇 Enhancement",
	settings: [
		{
			type: "checkbox",
			id: "SwapRow",
			name: "Swap left-right row (In watching mode)",
			description: "Moves the sidebar (recommendations/chat) to the left side.",
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
			id: "SrollRow",
			name: "Srollable row",
			description:
				"Allows the sidebar and comments to scroll independently from the video player. (Flyout will not working)",
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
			id: "Flyout",
			name: "Enable Flyout Video (Show video after scroll down)",
			description: "Keeps the video player visible in the corner when scrolling down.",
			value: false,
			enableFunction: setupFlyout,
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
			id: "ChatReplay",
			name: "Auto show chat replay",
			description: "Automatically expands the chat replay on videos.",
			value: false,
			enableFunction: setupAutoShowChatReplay,
		},
	],
};
