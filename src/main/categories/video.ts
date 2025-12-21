import { Category } from "../../styleshift/types/store";
import { setup_auto_theater, setup_remove_ambient } from "../features/video/general";
import { setup_auto_pip, setup_auto_exit_pip } from "../features/video/pip";
import { setup_update_timestamp } from "../features/video/timestamp";
import { setup_video_animations } from "../features/video/animations";

export const video_category: Category = {
	category: "📺 Video",
	selector: "#ytd-player",
	settings: [
		{
			type: "number_slide",
			id: "PlayerEdge",
			name: "Round edges amount",
			description: "Controls the roundness of the video player's corners.",
			value: 20,
			min: 0,
			max: 60,
			step: 1,
			var_css: "--player-edge-radius",
			constant_css: `
      .html5-video-player {
        border-radius: var(--player-edge-radius, 20px) !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "VdoAnim",
			name: "Enable Chaning Video transition",
			description: "Enable transition animation when the video starts.",
			value: true,
			enable_css: `
      div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed) .html5-video-container {
        transition: all 1s, background 0.1s;
      }
      div.ended-mode .html5-video-container,
      div.unstarted-mode:not(.ytp-small-mode) .html5-video-container {
        transform: scale(0.5);
        opacity: 0 !important;
      }
    `,
		},
		{
			type: "color",
			id: "Time-LineBG",
			name: "Time-line background color",
			description: "color of the timeline background.",
			value: "#ffffff20",
			var_css: "--timeline-bg-color",
			constant_css: `
      .ytp-progress-bar {
        background-color: var(--timeline-bg-color, #ffffff20) !important;
      }
    `,
		},
		{
			type: "color",
			id: "TimeLoaded",
			name: "Time-line loaded color",
			description: "color of the loaded progress on the timeline.",
			value: "#ffffff50",
			var_css: "--timeline-load-color",
			constant_css: `
      .ytp-load-progress {
        background: var(--timeline-load-color, #ffffff50) !important;
      }
    `,
		},
		{
			type: "color",
			id: "EndBG",
			name: "End of video chanel hover background color",
			description: "Background color when hovering over suggested videos at the end.",
			value: "#00000050",
			var_css: "--end-bg-hover-color",
			constant_css: `
      .ytp-videowall-still:hover .ytp-videowall-still-info-content {
        background: var(--end-bg-hover-color, #00000050) !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "CenterUD",
			name: "(Under Video) Move tittle to the center",
			description: "Moves the video title to the center when in normal view.",
			value: true,
			enable_css: `
      #title.ytd-watch-metadata, #container.ytd-video-primary-info-renderer {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-block: 30px;
      }
      ytd-watch-metadata.ytd-watch-flexy {
        display: flex;
        flex-direction: column;
      }
      h1.ytd-watch-metadata {
        text-align: center;
      }
    `,
		},
		{
			type: "checkbox",
			id: "CenterUDF",
			name: "(Fullscreen) Move tittle to the center",
			description: "Moves the video title to the center when in fullscreen/theater mode.",
			value: true,
			enable_css: `
      .ytp-big-mode .ytp-title-text {
        text-align: center;
      }
    `,
		},
		{
			type: "checkbox",
			id: "AutoTheater",
			name: "Auto Enter Theater Mode",
			description:
				"Automatically enters theater mode when you open a video. (May require a page reload to take effect)",
			value: false,
			enable_function: setup_auto_theater,
		},
		{
			type: "checkbox",
			id: "FullTheater",
			name: "Enable Full Theater (In Theater Mode)",
			description: "Makes the video player take up the full height of the screen in theater mode.",
			value: false,
			enable_css: `
      ytd-watch-flexy[theater] #full-bleed-container.ytd-watch-flexy {
        height: calc(100vh - 56px) !important;
        max-height: unset !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "AutoPIP",
			name: "Auto Pictue In Pictue mode",
			description: "Automatically enters Picture-in-Picture mode when you switch tabs or minimize the window.",
			value: true,
			enable_function: setup_auto_pip,
		},
		{
			type: "checkbox",
			id: "AutoEXPIP",
			name: "Auto exit Pictue In Pictue mode",
			description: "Automatically exits Picture-in-Picture mode when you return to the tab.",
			value: true,
			enable_function: setup_auto_exit_pip,
		},
		{
			type: "number_slide",
			id: "BelowSpace",
			name: "Space at Under of video",
			description: "Adds extra space below the video player.",
			value: 0,
			min: 0,
			max: 200,
			step: 5,
			var_css: "--below-video-space",
			constant_css: `
      #player-container.ytd-watch-flexy {
        margin-bottom: var(--below-video-space, 0px);
      }
    `,
		},
		{
			type: "checkbox",
			id: "RemoveAmbient",
			name: "Auto Remove YouTube's Ambient Mode",
			description: "Automatically turns off YouTube's built-in ambient mode feature.",
			value: true,
			enable_function: setup_remove_ambient,
		},
		// Kept these as they fit in Video or can be moved to Enhancement if strict strict
		{
			type: "checkbox",
			id: "UpdateTimeStamp",
			name: "Update URL Timestamp",
			description: "Updates the URL with the current video timestamp every 10 seconds and on pause.",
			value: false,
			enable_function: setup_update_timestamp,
		},
		{
			type: "checkbox",
			id: "NewVDOanima",
			name: "New video animation (Volume, Play/Pause)",
			description: "Custom volume indicator and enhanced play/pause animations.",
			value: true,
			enable_function: setup_video_animations,
			enable_css: `
      .newtube-vol-indicator {
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        opacity: 0;
        transition: opacity 0.3s, top 0.3s;
        pointer-events: none;
        z-index: 50;
        backdrop-filter: blur(5px);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
      }
      .newtube-vol-indicator.show {
        opacity: 1;
        top: 15%;
      }

      /* Youtube Bezel (Play/Pause/Seek arrows) Customization */
      .ytp-bezel-text-wrapper {
        display: none !important;
      }
      .ytp-bezel {
        background: rgba(0, 0, 0, 0.7) !important;
        border-radius: 50% !important;
        backdrop-filter: blur(4px);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
      }
      .ytp-bezel-icon {
        fill: white !important;
      }
      `,
		},
	],
};
