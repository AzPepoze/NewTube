import { Category } from "../../styleshift/types/store";
import { setupVideoAnimations } from "../features/video/animations";

export const videoPlayerCategory: Category = {
	category: "📺 Video Player",
	settings: [
		{
			type: "checkbox",
			id: "TransparentVideoPlayerBackground",
			name: "Glass Player",
			description:
				"Makes the video player's base background transparent. Essential for seeing custom page backgrounds and 'Background Video' effects behind the player.",
			value: true,
			enableCss: `.html5-video-player { background: transparent !important; }`,
		},
		{
			type: "numberSlide",
			id: "VideoPlayerCornerRadius",
			name: "Player Roundness",
			description:
				"Controls how rounded the corners of the main video player are. Higher values create a softer, more modern look.",
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
			id: "EnableVideoPageTransitions",
			name: "Smooth Loading",
			description:
				"Adds a subtle fade and scale animation when a new video starts playing, making the transition between videos feel more premium.",
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
			type: "checkbox",
			id: "EnableEnhancedVideoAnimations",
			name: "Enhanced UI",
			description:
				"Replaces standard YouTube volume and play/pause indicators with modern, high-quality animated versions.",
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
		{
			type: "numberSlide",
			id: "WatchPageZoomLevel",
			name: "Player Zoom",
			description:
				"Scales the entire watch area (video and details) up or down to better fit your screen preferences.",
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
	],
};
