import { Category } from "../../styleshift/types/store";

export const videoControlPanelCategory: Category = {
	category: "🎚️ Video control panel",
	settings: [
		{
			type: "color",
			id: "TimeBG",
			name: "Timestamp/Popup Background",
			description: "Background color for video timestamps, settings popups, and preview tooltips.",
			value: "#00000080",
			varCss: "--nt-timestamp-bg",
		},
		{
			type: "color",
			id: "VDOTEXT",
			name: "Control Panel text",
			description: "color of the text on the video control panel (time, etc.).",
			value: "#ffffffff",
			varCss: "--nt-text-primary",
			constantCss: `
      .ytp-time-current, .ytp-time-separator, .ytp-time-duration, .ytp-button {
        color: var(--nt-text-primary) !important;
      }
    `,
		},
		{
			type: "color",
			id: "HBT",
			name: "Control Panel hover button",
			description: "Background color when hovering over buttons on the control panel.",
			value: "#ffffff20",
			varCss: "--nt-theme-transparent",
			constantCss: `
      .ytp-button:hover {
        background-color: var(--nt-theme-transparent) !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "ControlUnderVDO",
			name: "Move Controls Below Video",
			description: "Moves the video control panel to appear underneath the video player.",
			value: true,
			enableCss: `
      #player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode) {
        padding-bottom: var(--nt-player-below-space, 70px);
      }
      div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode) .ytp-chrome-bottom {
        overflow: visible !important;
        padding-top: 0px !important;
      }
      #player-wide-container div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed) > .ytp-chrome-bottom {
        transform: translate(0px, var(--nt-player-below-space, 70px));
      }
      #player:has(div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed)) {
        margin-bottom: var(--nt-player-below-space, 70px);
      }
    `,
		},
		{
			type: "numberSlide",
			id: "MediaSpace",
			name: "Controls-Below-Video Distance",
			description: "Adjusts the distance of the control panel when moved below the video.",
			value: 70,
			min: 30,
			max: 200,
			step: 1,
			varCss: "--nt-player-below-space",
		},
		{
			type: "checkbox",
			id: "CenterMedia",
			name: "Center Control buttons",
			description: "Centers the buttons on the video control panel.",
			value: true,
			enableCss: `
      .ytp-chrome-controls {
        display: flex !important;
        flex-direction: row !important;
        justify-content: center !important;
      }
      .ytp-left-controls, .ytp-chapter-title.ytp-button, .ytp-chapter-container {
        display: contents !important;
      }
    `,
		},
		{
			type: "color",
			id: "MediaBG",
			name: "Control Panel Background",
			description: "Background color of the video control panel.",
			value: "#00000080",
			varCss: "--nt-player-bg",
			constantCss: `
      .ytp-chrome-bottom, .ytp-gradient-bottom {
        background-color: var(--nt-player-bg) !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "MediaBlur",
			name: "Blur Control Panel Background",
			description: "Applies a blur effect to the control panel background.",
			value: true,
			enableCss: `
                .ytp-chrome-bottom, .ytp-gradient-bottom {
                    backdrop-filter: blur(var(--nt-player-blur-amount, 10px)) !important;
                }
            `,
		},
		{
			type: "numberSlide",
			id: "MediaBlurAmount",
			name: "Control Panel Blur Amount",
			description: "Adjusts the amount of blur on the control panel.",
			value: 10,
			min: 0,
			max: 50,
			step: 1,
			varCss: "--nt-player-blur-amount",
		},
		{
			type: "checkbox",
			id: "BottomG",
			name: "Remove Gradient",
			description: "Removes the default gradient from the video player bottom.",
			value: false,
			enableCss: `.ytp-gradient-bottom { background-image: none !important; }`,
		},
		{
			type: "numberSlide",
			id: "MediaH",
			name: "Background Height",
			description: "Adjusts the height of the control panel background.",
			value: 60,
			min: 30,
			max: 150,
			step: 1,
			varCss: "--nt-player-bg-height",
			constantCss: `
                .ytp-gradient-bottom { height: var(--nt-player-bg-height, 60px) !important; }
            `,
		},
		{
			type: "numberSlide",
			id: "MediaHFull",
			name: "(Full screen) Background height",
			description: "Adjusts the height of the control panel background when in fullscreen.",
			value: 70,
			min: 30,
			max: 150,
			step: 1,
			varCss: "--nt-player-bg-height-full",
			constantCss: `
                .ytp-fullscreen .ytp-gradient-bottom { height: var(--nt-player-bg-height-full, 70px) !important; }
            `,
		},
		{
			type: "checkbox",
			id: "PlayerOut",
			name: "Enable Borders/Shadows",
			description: "Adds borders/shadows to the control panel (uses Global Border Settings).",
			value: false,
			enableCss: `
                .ytp-chrome-bottom, .ytp-gradient-bottom {
                    box-shadow: var(--nt-global-shadow) !important;
                    border: var(--nt-global-outline) !important;
                }
            `,
		},
		{
			type: "numberSlide",
			id: "PlayerBorder",
			name: "Border/Shadow Width",
			description: "Specific width for the player border/shadow (overrides global if set separately).",
			value: 1,
			min: 0,
			max: 20,
			step: 1,
			varCss: "--nt-player-border-width",
		},
		{
			type: "checkbox",
			id: "AutohideBar",
			name: "Autohide Controls",
			description: "Automatically hides the control panel when the mouse is inactive.",
			value: true,
			disableCss: `
                div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-gradient-bottom,
                div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-chrome-bottom {
                    opacity: 1 !important;
                    display: block !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "VdoBtnHover",
			name: "Enlarge buttons on hover",
			description: "Makes video control buttons larger when you hover over them.",
			value: true,
			enableCss: `
                .ytp-chrome-bottom .ytp-button,
                .ytp-replay-button,
                .ytp-cards-button-icon {
                    transition: transform .2s !important;
                }
                .ytp-chrome-bottom .ytp-button:hover,
                .ytp-replay-button:hover,
                .ytp-cards-button-icon:hover {
                    transform: scale(1.5) !important;
                }
                
                /* Settings Menu Animation from Update.js */
                .html5-video-player .ytp-settings-menu:not(.ytpa-ambientlight-settings-menu) {
                    transition: opacity 0.5s, transform 0.25s !important;
                    margin-bottom: 20px !important;
                }
                .html5-video-player:not(.ytp-settings-shown) .ytp-settings-menu:not(.ytpa-ambientlight-settings-menu) {
                    transform: translateX(100px) !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }

                /* Central Play Button Styling */
                path.ytp-large-play-button-bg {
                    fill: black !important;
                    opacity: 0.7 !important;
                }
                .ytp-large-play-button.ytp-button:hover path.ytp-large-play-button-bg {
                    opacity: 1 !important;
                    filter: drop-shadow(0px 0px 6px black);
                }
            `,
		},
	],
};
