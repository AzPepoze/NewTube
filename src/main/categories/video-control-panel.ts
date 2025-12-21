import { Category } from "../../styleshift/types/store";

export const video_control_panel_category: Category = {
	category: "🎚️ Video control panel",
	settings: [
		{
			type: "color",
			id: "VDOTEXT",
			name: "Control Panel text",
			description: "color of the text on the video control panel (time, etc.).",
			value: "#ffffffff",
			var_css: "--control-text-color",
			constant_css: `
      .ytp-time-display, .ytp-button {
        color: var(--control-text-color) !important;
      }
    `,
		},
		{
			type: "color",
			id: "HBT",
			name: "Control Panel hover button",
			description: "Background color when hovering over buttons on the control panel.",
			value: "#ffffff20",
			var_css: "--control-hover-bg-color",
			constant_css: `
      .ytp-button:hover {
        background-color: var(--control-hover-bg-color) !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "ControlUnderVDO",
			name: "Move Controls Below Video",
			description: "Moves the video control panel to appear underneath the video player.",
			value: true,
			enable_css: `
      #player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode) {
        padding-bottom: var(--media-space, 70px);
      }
      div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode) .ytp-chrome-bottom {
        overflow: visible !important;
        padding-top: 0px !important;
      }
      #player-wide-container div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed) > .ytp-chrome-bottom {
        transform: translate(0px, var(--media-space, 70px));
      }
      #player:has(div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed)) {
        margin-bottom: var(--media-space, 70px);
      }
    `,
		},
		{
			type: "number_slide",
			id: "Mediaspace",
			name: "Controls-Below-Video Distance",
			description: "Adjusts the distance of the control panel when moved below the video.",
			value: 70,
			min: 30,
			max: 200,
			step: 1,
			var_css: "--media-space",
		},
		{
			type: "checkbox",
			id: "CenterMedia",
			name: "Center Control buttons",
			description: "Centers the buttons on the video control panel.",
			value: true,
			enable_css: `
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
			var_css: "--media-bg-color",
			constant_css: `
      .ytp-chrome-bottom {
        background-color: var(--media-bg-color) !important;
      }
    `,
		},
		{
			type: "checkbox",
			id: "MediaBlur",
			name: "Blur Control Panel Background",
			description: "Applies a blur effect to the control panel background.",
			value: true,
			enable_css: `
                .ytp-chrome-bottom {
                    backdrop-filter: blur(var(--media-blur-amount, 10px)) !important;
                }
            `,
		},
		{
			type: "number_slide",
			id: "MediaBlurAmount",
			name: "Control Panel Blur Amount",
			description: "Adjusts the amount of blur on the control panel.",
			value: 10,
			min: 0,
			max: 50,
			step: 1,
			var_css: "--media-blur-amount",
		},
		{
			type: "checkbox",
			id: "BottomG",
			name: "Remove Gradient",
			description: "Removes the default gradient from the video player bottom.",
			value: false,
			enable_css: `.ytp-gradient-bottom { background-image: none !important; }`,
		},
		{
			type: "number_slide",
			id: "MediaH",
			name: "Background Height",
			description: "Adjusts the height of the control panel background.",
			value: 60,
			min: 30,
			max: 150,
			step: 1,
			var_css: "--media-height",
			constant_css: `.ytp-chrome-bottom { height: var(--media-height, 60px) !important; }`,
		},
		{
			type: "checkbox",
			id: "PlayerOut",
			name: "Enable Borders/Shadows",
			description: "Adds borders/shadows to the control panel (uses Global Border Settings).",
			value: false,
			enable_css: `
                .ytp-chrome-bottom {
                    box-shadow: var(--global-style-shadow) !important;
                    border-top: var(--global-style-outline) !important;
                }
            `,
		},
		{
			type: "number_slide",
			id: "PlayerBorder",
			name: "Border/Shadow Width",
			description: "Specific width for the player border/shadow (overrides global if set separately).",
			value: 1,
			min: 0,
			max: 20,
			step: 1,
			var_css: "--player-border-width",
		},
		{
			type: "checkbox",
			id: "AutohideBar",
			name: "Autohide Controls",
			description: "Automatically hides the control panel when the mouse is inactive.",
			value: true,
			disable_css: `
                div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-gradient-bottom,
                div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed).ytp-autohide .ytp-chrome-bottom {
                    opacity: 1 !important;
                    display: block !important;
                }
            `,
		},
	],
};
