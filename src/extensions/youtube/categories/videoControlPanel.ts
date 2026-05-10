import { type Category } from "@settings/types/styleshiftTypes";
import {
	ytPlayerWatchMode,
	ytTheaterModeContainer,
	ytVideoContainerWatchMode,
	ytdPlayerWatchMode,
} from "../modules/youtube";

export const videoControlPanelCategory: Category = {
	category: { icon: "settings_input_component", label: "Video Control Panel" },
	selector: "#movie_player",
	settings: [
		{
			type: "checkbox",
			id: "EnableControlsBelowVideo",
			name: "Detach Controls",
			description:
				"Moves the entire video control bar (play, volume, settings) from an overlay on top of the video to a dedicated space directly underneath it.",
			value: true,
			enableCss: `
				${ytdPlayerWatchMode},
				${ytPlayerWatchMode}
				{
					padding-bottom: var(--nt-player-below-space, 70px) !important;
				}

				${ytTheaterModeContainer} {
					margin-bottom: var(--nt-player-below-space, 70px) !important;
				}

				${ytVideoContainerWatchMode} {
					overflow: visible !important;
				}

				${ytVideoContainerWatchMode} .ytp-chrome-bottom,
				${ytVideoContainerWatchMode} .ytp-gradient-bottom,
				${ytVideoContainerWatchMode} .ytp-tooltip {
					overflow: visible !important;
					transform: translateY(var(--nt-player-below-space, 70px)) !important;
				}

				${ytVideoContainerWatchMode} .ytp-chrome-bottom {
					padding-top: 0px !important;
				}

				${ytVideoContainerWatchMode} #ytp-caption-window-container,
				${ytVideoContainerWatchMode} .ytp-overlays-container {
					height: 100% !important;
				}

				${ytVideoContainerWatchMode} .caption-window.ytp-caption-window-bottom {
					margin-bottom: 0px !important;
				}
			`,
		},
		{
			type: "numberSlide",
			id: "ControlsBelowVideoDistance",
			name: "Detach Gap",
			description: "Adjusts the vertical distance between the video player and the detached control bar.",
			value: 75,
			min: 30,
			max: 200,
			step: 1,
			varCss: "--nt-player-below-space",
			require: { EnableControlsBelowVideo: true },
		},
		{
			type: "checkbox",
			id: "EnableCenteredControls",
			name: "Center Buttons",
			description: "Re-aligns the play, volume, and playback buttons to the exact center of the control bar.",
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
			type: "checkbox",
			id: "EnableControlPanelAutohide",
			name: "Auto-Hide Bar",
			description: "Automatically hides the control bar when your mouse is not moving over the player.",
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
			id: "EnableControlPanelButtonHoverScale",
			name: "Button Pop",
			description: "Makes control icons grow slightly when you hover over them for better interactive feedback.",
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
            `,
		},
		{
			type: "color",
			id: "ControlPanelBackgroundColor",
			name: "Bar Color",
			description: "Sets the background color of the main video control strip.",
			value: "#00000080",
			varCss: "--nt-player-bg",
			constantCss: `
			.ytp-gradient-bottom {
				background-color: var(--nt-player-bg) !important;
			}
			`,
		},
		{
			type: "checkbox",
			id: "EnableControlPanelBlur",
			name: "Glass Effect",
			description: "Applies a frosted-glass blur effect to the background of the video control bar.",
			value: true,
			enableCss: `
                .ytp-gradient-bottom {
                    backdrop-filter: blur(var(--nt-player-blur-amount, 10px)) !important;
                }
            `,
		},
		{
			type: "numberSlide",
			id: "ControlPanelBlurAmount",
			name: "Glass Intensity",
			description: "Adjusts the strength of the frosted-glass effect on the control bar.",
			value: 10,
			min: 0,
			max: 50,
			step: 1,
			varCss: "--nt-player-blur-amount",
			require: { EnableControlPanelBlur: true },
		},
		{
			type: "checkbox",
			id: "EnableControlPanelRemoveGradient",
			name: "Remove Default Gradient",
			description: "Removes the default dark gradient at the bottom of the video player.",
			value: false,
			enableCss: `.ytp-gradient-bottom { background-image: none !important; }`,
		},
		{
			type: "color",
			id: "ControlPanelTextColor",
			name: "Icon Color",
			description: "Changes the color of the icons and timestamps within the video control bar.",
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
			id: "ControlPanelButtonGroupColor",
			name: "Button Group Color",
			description:
				"Sets the background color for groups of buttons within the control bar, such as the play button or volume control.",
			value: "#5bbdff20",
			varCss: "--nt-theme-control-panel-button-group",
			constantCss: `
				:root {
					--yt-spec-overlay-background-medium-light: var(--nt-theme-control-panel-button-group) !important;
				}
    		`,
		},
		{
			type: "color",
			id: "ControlPanelButtonHoverColor",
			name: "Hover Glow",
			description: "Sets the background highlight color when you hover over any button in the control bar.",
			value: "#5bbdff20",
			varCss: "--nt-theme-control-panel-hover",
			constantCss: `
				:root {
					--yt-spec-overlay-button-secondary: var(--nt-theme-control-panel-hover) !important;
				}
    		`,
		},
		{
			type: "color",
			id: "ControlPanelPopupBackgroundColor",
			name: "Popup Color",
			description: "Customizes the background color for all in-player popups.",
			value: "#00000080",
			varCss: "--nt-timestamp-bg",
		},
		{
			type: "numberSlide",
			id: "ControlPanelBackgroundHeight",
			name: "Bar Height",
			description: "Increases or decreases the height of the control bar's background.",
			value: 70,
			min: 30,
			max: 150,
			step: 1,
			varCss: "--nt-player-bg-height",
			constantCss: `
                .ytp-gradient-bottom { height: var(--nt-player-bg-height, 60px) !important; }
            `,
		},
		{
			type: "checkbox",
			id: "EnableControlPanelBorder",
			name: "Borders & Shadows",
			description: "Applies your global outline or glow shadow settings to the video control bar.",
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
			id: "ControlPanelBorderWidth",
			name: "Local Border Width",
			description: "Overrides the global border width specifically for the video player's controls.",
			value: 1,
			min: 0,
			max: 20,
			step: 1,
			varCss: "--nt-player-border-width",
			require: { EnableControlPanelBorder: true },
		},
	],
};
