import { Category } from "../../styleshift/types/store";

export const thumbnailCategory: Category = {
	category: "📰 Thumbnail/Clip cover",
	settings: [
		{
			type: "numberSlide",
			id: "TimeEdge",
			name: "timestamp Corner Radius",
			description: "Adjusts the corner roundness of the video duration timestamp on thumbnails.",
			value: 10,
			min: 0,
			max: 30,
			step: 1,
			varCss: "--nt-timestamp-radius",
			constantCss: `ytd-thumbnail-overlay-time-status-renderer { border-radius: var(--nt-timestamp-radius, 10px) !important; }`,
		},
		{
			type: "color",
			id: "TimeBG",
			name: "timestamp Background color",
			description: "Sets the background color of the video duration timestamp.",
			value: "#00000080",
			varCss: "--nt-timestamp-bg",
			constantCss: `ytd-thumbnail-overlay-time-status-renderer { background-color: var(--nt-timestamp-bg, #00000080) !important; }`,
		},
		{
			type: "numberSlide",
			id: "TimeH",
			name: "timestamp Height",
			description: "Adjusts the height of the video duration timestamp on thumbnails.",
			value: 12,
			min: 0,
			max: 100,
			step: 1,
			varCss: "--nt-timestamp-height",
			constantCss: `
                ytd-thumbnail-overlay-time-status-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer {
                    height: var(--nt-timestamp-height, 12px) !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "TimeOut",
			name: "Time Borders/Shadows",
			description: "Adds borders or shadows to the time indicator on thumbnails.",
			value: true,
			enableCss: `
                ytd-thumbnail-overlay-time-status-renderer {
                    box-shadow: var(--nt-global-shadow) !important;
                    border: var(--nt-global-outline) !important;
                }
            `,
		},
		{
			type: "numberSlide",
			id: "HoverBorder",
			name: "Hover Border Width",
			description: "Width of the border when hovering over a thumbnail.",
			value: 1,
			min: 0,
			max: 10,
			step: 1,
			varCss: "--nt-hover-border-width",
		},
		{
			type: "color",
			id: "ThumbHoverColorInput",
			name: "Hover Border Color",
			description: "Color of the border/shadow when hovering.",
			value: "#659affff",
			varCss: "--nt-hover-color",
		},
		{
			type: "color",
			id: "ThumbClickColorInput",
			name: "Click Border Color",
			description: "Color of the border/shadow when clicked.",
			value: "#ffffffff",
			varCss: "--nt-click-color",
		},
		{
			type: "checkbox",
			id: "ThumbActive",
			name: "Enable Hover Overlay",
			description: "Adds a glow effect and border when hovering over thumbnails.",
			value: true,
			enableCss: `
                ytd-thumbnail:hover, ytd-playlist-thumbnail:hover {
                    outline: var(--nt-hover-border-width, 1px) solid var(--nt-hover-color) !important;
                    box-shadow: 0 0 15px var(--nt-hover-color) !important;
                }
                ytd-thumbnail:active, ytd-playlist-thumbnail:active {
                    outline-color: var(--nt-click-color) !important;
                }
                #thumbnail:hover:after {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: var(--nt-hover-color);
                    opacity: 0.1;
                    pointer-events: none;
                    border-radius: var(--nt-border-radius);
                }
            `,
		},
		{
			type: "dropdown",
			id: "ThumbHover",
			name: "hover Animation Style",
			description: "The animation effect when hovering over a video thumbnail.",
			value: "Slide",
			options: {
				Slide: {
					enableCss: `
                        #dismissible.ytd-rich-grid-media:hover > ytd-thumbnail {
                            margin-block-start: -15px !important;
                            margin-block-end: 15px !important;
                        }
                        ytd-compact-video-renderer:hover {
                            margin-inline-start: -15px !important;
                        }
                        ytd-compact-video-renderer:hover > div > div > div > a {
                            margin-inline-end: 15px !important;
                        }
                    `,
				},
				Zoom: {
					enableCss: `
                        ytd-thumbnail:not(.ytd-playlist-panel-video-renderer):hover,
                        ytd-playlist-thumbnail:hover {
                            transform: scale(var(--nt-zoom-scale, 1.075)) !important;
                            z-index: 400;
                        }
                    `,
				},
				"Slide&Zoom": {
					enableCss: `
                        #dismissible.ytd-rich-grid-media:hover > ytd-thumbnail {
                            margin-block-start: -15px !important;
                            margin-block-end: 15px !important;
                        }
                        ytd-compact-video-renderer:hover {
                            margin-inline-start: -15px !important;
                        }
                        ytd-compact-video-renderer:hover > div > div > div > a {
                            margin-inline-end: 15px !important;
                        }
                        ytd-thumbnail:not(.ytd-playlist-panel-video-renderer):hover,
                        ytd-playlist-thumbnail:hover {
                            transform: scale(var(--nt-zoom-scale, 1.075)) !important;
                            z-index: 400;
                        }
                    `,
				},
				None: {
					enableCss: ``,
				},
			},
		},
		{
			type: "numberSlide",
			id: "ThZoom",
			name: "Zoom Amount",
			description: "Adjusts the zoom scale for the 'Zoom' hover animation.",
			value: 1.075,
			min: 1,
			max: 1.5,
			step: 0.005,
			varCss: "--nt-zoom-scale",
		},
		{
			type: "checkbox",
			id: "TimeAni",
			name: "hide timestamp on hover",
			description: "hides the video duration timestamp when you hover over a thumbnail.",
			value: true,
			enableCss: `
                ytd-thumbnail-overlay-time-status-renderer {
                    transition: all .2s;
                }
                #thumbnail:hover > #overlays > ytd-thumbnail-overlay-time-status-renderer {
                    opacity: 0 !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "ThumbAnim",
			name: "Thumbnail load Animation",
			description: "Adds a fade-in and slide-up animation when thumbnails load.",
			value: true,
			enableCss: `
                #dismissible:has(.yt-core-image) {
                    transition: all 0.5s ease;
                    opacity: 0 !important;
                }
                #dismissible:not(.ytd-reel-item-renderer):has(.yt-core-image) {
                    transform: translateY(50px);
                }
                #dismissible:has(.yt-core-image--loaded) {
                    transform: translateY(0px) !important;
                    opacity: 1 !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "CenterTime",
			name: "Center Time",
			description: "Moves the time position to the center.",
			value: true,
			enableCss: `
                ytd-thumbnail-overlay-time-status-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer {
                    width: 100% !important;
                    margin: 0px !important;
                    padding: 0px !important;
                    bottom: 0px;
                    justify-content: center !important;
                }
                
                #time-status #text {
                    margin-left: auto;
                    margin-right: auto;
                }
            
                #time-status {
                    width: 100% !important;
                    position: absolute !important;
                }
            
                .ytp-ce-video-duration {
                    width: 97% !important;
                    margin: -2px !important;
                    text-align: center !important;
                }
            `,
		},
	],
};
