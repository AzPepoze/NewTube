import { Category } from "../../styleshift/types/store";
import { setupAutoTheater, setupRemoveAmbient } from "../features/video/general";
import { setupAutoPip, setupAutoExitPip } from "../features/video/pip";
import { setupUpdateTimestamp } from "../features/video/timestamp";
import { setupVideoAnimations } from "../features/video/animations";

export const videoCategory: Category = {
	category: "📺 Video",
	selector: "#ytd-player",
	settings: [
		{
			type: "checkbox",
			id: "VBG",
			name: "Transparent Video Player Background",
			description: "Makes the video player background transparent (useful for custom backgrounds).",
			value: true,
			enableCss: `.html5-video-player { background: transparent !important; }`,
		},
		{
			type: "color",
			id: "PlaylistBG",
			name: "Playlist items hover background",
			description: "Background color of playlist items when you hover over them.",
			value: "#659aff33",
			varCss: "--nt-playlist-hover-bg",
		},
		{
			type: "numberSlide",
			id: "PlayerEdge",
			name: "Round edges amount",
			description: "Controls the roundness of the video player's corners.",
			value: 20,
			min: 0,
			max: 60,
			step: 1,
			varCss: "--nt-player-radius",
			constantCss: `
      .html5-video-player {
        border-radius: var(--nt-player-radius, 20px) !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "VdoAnim",
			name: "Enable Chaning Video transition",
			description: "Enable transition animation when the video starts.",
			value: true,
			enableCss: `
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
			varCss: "--nt-timeline-bg",
			constantCss: `
      .ytp-progress-bar {
        background-color: var(--nt-timeline-bg, #ffffff20) !important;
      }
    `,
		},
		{
			type: "color",
			id: "TimeLoaded",
			name: "Time-line loaded color",
			description: "color of the loaded progress on the timeline.",
			value: "#ffffff50",
			varCss: "--nt-timeline-load",
			constantCss: `
      .ytp-load-progress {
        background: var(--nt-timeline-load, #ffffff50) !important;
      }
    `,
		},
		{
			type: "color",
			id: "VideoEndHover",
			name: "End of video chanel hover background color",
			description: "Background color when hovering over suggested videos at the end.",
			value: "#00000050",
			varCss: "--nt-endscreen-hover-bg",
			constantCss: `
      .ytp-videowall-still:hover .ytp-videowall-still-info-content {
        background: var(--nt-endscreen-hover-bg, #00000050) !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "CenterUD",
			name: "(Under Video) Move tittle to the center",
			description: "Moves the video title to the center when in normal view.",
			value: true,
			enableCss: `
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
			enableCss: `
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
			enableFunction: setupAutoTheater,
		},
		{
			type: "checkbox",
			id: "FullTheater",
			name: "Enable Full Theater (In Theater Mode)",
			description: "Makes the video player take up the full height of the screen in theater mode.",
			value: false,
			enableCss: `
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
			enableFunction: setupAutoPip,
		},
		{
			type: "checkbox",
			id: "AutoEXPIP",
			name: "Auto exit Pictue In Pictue mode",
			description: "Automatically exits Picture-in-Picture mode when you return to the tab.",
			value: true,
			enableFunction: setupAutoExitPip,
		},
		{
			type: "numberSlide",
			id: "BelowSpace",
			name: "Space at Under of video",
			description: "Adds extra space below the video player.",
			value: 0,
			min: 0,
			max: 200,
			step: 5,
			varCss: "--nt-video-bottom-space",
			constantCss: `
      #below {
        margin-top: var(--nt-video-bottom-space, 0px) !important;
      }
    `,
		},
		{
			type: "numberSlide",
			id: "WatchZoom",
			name: "Watch page zoom",
			description: "Zooms in or out on the watch page (video and details).",
			value: 1,
			min: 0.5,
			max: 1.5,
			step: 0.05,
			varCss: "--nt-watch-zoom",
			constantCss: `
      #columns.ytd-watch-flexy {
        zoom: var(--nt-watch-zoom, 1) !important;
      }
    `,
		},
		{
			type: "numberSlide",
			id: "PlaylistH",
			name: "Playlist panel max height",
			description: "Sets the maximum height of the playlist item list on the watch page.",
			value: 600,
			min: 200,
			max: 2000,
			step: 10,
			varCss: "--nt-playlist-height-normal",
			constantCss: `
      #items.ytd-playlist-panel-renderer {
        max-height: var(--nt-playlist-height-normal, 600px) !important;
      }
    `,
		},
		{
			type: "numberSlide",
			id: "PlaylistHFull",
			name: "Playlist panel max height (Theater)",
			description: "Sets the maximum height of the playlist item list when in theater mode.",
			value: 800,
			min: 200,
			max: 2000,
			step: 10,
			varCss: "--nt-playlist-height-theater",
			constantCss: `
      ytd-watch-flexy[theater] #items.ytd-playlist-panel-renderer {
        max-height: var(--nt-playlist-height-theater, 800px) !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "RemoveAmbient",
			name: "Auto Remove YouTube's Ambient Mode",
			description: "Automatically turns off YouTube's built-in ambient mode feature.",
			value: true,
			enableFunction: setupRemoveAmbient,
		},
		// Kept these as they fit in Video or can be moved to Enhancement if strict strict
		{
			type: "checkbox",
			id: "UpdateTimeStamp",
			name: "Update URL Timestamp",
			description: "Updates the URL with the current video timestamp every 10 seconds and on pause.",
			value: false,
			enableFunction: setupUpdateTimestamp,
		},
		{
			type: "checkbox",
			id: "NewVDOanima",
			name: "New video animation (Volume, Play/Pause)",
			description: "Custom volume indicator and enhanced play/pause animations.",
			value: true,
			enableFunction: setupVideoAnimations,
			enableCss: `
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
