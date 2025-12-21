import { Category } from "../../styleshift/types/store";

export const thumbnail_category: Category = {
	category: "📰 Thumbnail/Clip cover",
	settings: [
		{
			type: "number_slide",
			id: "TimeEdge",
			name: "timestamp Corner Radius",
			description: "Adjusts the corner roundness of the video duration timestamp on thumbnails.",
			value: 10,
			min: 0,
			max: 30,
			step: 1,
			var_css: "--thumb-time-radius",
			constant_css: `ytd-thumbnail-overlay-time-status-renderer { border-radius: var(--thumb-time-radius, 10px) !important; }`,
		},
		{
			type: "color",
			id: "TimeBG",
			name: "timestamp Background color",
			description: "Sets the background color of the video duration timestamp.",
			value: "#00000080",
			var_css: "--thumb-time-bg",
			constant_css: `ytd-thumbnail-overlay-time-status-renderer { background-color: var(--thumb-time-bg, #00000080) !important; }`,
		},
		{
			type: "checkbox",
			id: "TimeOut",
			name: "Time Borders/Shadows",
			description: "Adds borders or shadows to the time indicator on thumbnails.",
			value: true,
			enable_css: `
                ytd-thumbnail-overlay-time-status-renderer {
                    box-shadow: var(--global-style-shadow) !important;
                    border: var(--global-style-outline) !important;
                }
            `,
		},
		{
			type: "number_slide",
			id: "HoverBorder",
			name: "Hover Border Width",
			description: "Width of the border when hovering over a thumbnail.",
			value: 1,
			min: 0,
			max: 10,
			step: 1,
			var_css: "--thumb-hover-border-width",
		},
		{
			type: "color",
			id: "ThumbHoverColor",
			name: "Hover Border Color",
			description: "Color of the border/shadow when hovering.",
			value: "#659affff",
			var_css: "--thumb-hover-color",
		},
		{
			type: "color",
			id: "ThumbClick",
			name: "Click Border Color",
			description: "Color of the border/shadow when clicked.",
			value: "#ffffffff",
			var_css: "--thumb-click-color",
		},
		{
			type: "dropdown",
			id: "ThumbHover",
			name: "hover Animation Style",
			description: "The animation effect when hovering over a video thumbnail.",
			value: "Slide",
			options: {
				Slide: {
					enable_css: `
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
					enable_css: `
                        ytd-thumbnail:not(.ytd-playlist-panel-video-renderer):hover,
                        ytd-playlist-thumbnail:hover {
                            transform: scale(var(--thumb-zoom-scale, 1.075)) !important;
                            z-index: 400;
                        }
                    `,
				},
				"Slide&Zoom": {
					enable_css: `
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
                            transform: scale(var(--thumb-zoom-scale, 1.075)) !important;
                            z-index: 400;
                        }
                    `,
				},
				None: {
					enable_css: ``,
				},
			},
		},
		{
			type: "number_slide",
			id: "Zoom",
			name: "Zoom Amount",
			description: "Adjusts the zoom scale for the 'Zoom' hover animation.",
			value: 1.075,
			min: 1,
			max: 1.5,
			step: 0.005,
			var_css: "--thumb-zoom-scale",
		},
		{
			type: "checkbox",
			id: "TimeAni",
			name: "hide timestamp on hover",
			description: "hides the video duration timestamp when you hover over a thumbnail.",
			value: true,
			enable_css: `
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
			enable_css: `
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
			enable_css: `
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
