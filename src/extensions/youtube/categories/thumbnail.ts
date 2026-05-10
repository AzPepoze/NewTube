import { type Category } from "@settings/types/styleshiftTypes";

export const thumbnailCategory: Category = {
	category: { icon: "image_search", label: "Thumbnail & Clip Cover" },
	settings: [
		{
			type: "numberSlide",
			id: "ThumbnailTimeCornerRadius",
			name: "Time Corner Radius",
			description: "Adjusts the corner roundness of the video duration timestamp shown on thumbnails.",
			value: 10,
			min: 0,
			max: 30,
			step: 1,
			varCss: "--nt-timestamp-radius",
			constantCss: `yt-thumbnail-bottom-overlay-view-model { border-radius: var(--nt-timestamp-radius, 10px) !important; }`,
		},
		{
			type: "color",
			id: "ThumbnailTimeBackgroundColor",
			name: "Time Background",
			description: "Sets the background color of the duration timestamp on video thumbnails.",
			value: "#00000080",
			varCss: "--nt-timestamp-bg",
			constantCss: `.yt-badge-shape--thumbnail-default { background-color: var(--nt-timestamp-bg, #00000080) !important; }`,
		},
		{
			type: "numberSlide",
			id: "ThumbnailTimeHeight",
			name: "Time Height",
			description: "Adjusts the vertical size of the timestamp indicator.",
			value: 20,
			min: 0,
			max: 100,
			step: 1,
			varCss: "--nt-timestamp-height",
			unit: "px",
			constantCss: `
                ytd-thumbnail-overlay-time-status-renderer,
                ytd-thumbnail-overlay-bottom-panel-renderer {
                    height: var(--nt-timestamp-height, 12px) !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "ThumbnailTimeBorderEnabled",
			name: "Time Borders",
			description: "Applies borders or shadows to the thumbnail time indicator based on your global settings.",
			value: true,
			enableCss: `
                ytd-thumbnail-overlay-time-status-renderer {
                    box-shadow: var(--nt-global-shadow) !important;
                    border: var(--nt-global-outline) !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "ThumbnailTimeHideOnHover",
			name: "Hide Time on Hover",
			description:
				"Automatically fades out the duration timestamp when you hover over a thumbnail, keeping the image clear.",
			value: true,
			enableCss: `
                yt-thumbnail-bottom-overlay-view-model {
                    transition: all .2s ease-out;
                }
                yt-thumbnail-view-model:hover yt-thumbnail-bottom-overlay-view-model {
                    opacity: 0 !important;
					transform: translateY(5px) !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "ThumbnailTimeCenterEnabled",
			name: "Center Time Overlay",
			description:
				"Centers the duration timestamp and bottom panel on thumbnails instead of keeping them in the corner.",
			value: true,
			enableCss: `
				yt-thumbnail-bottom-overlay-view-model {
					z-index: 1;
					border-radius: var(--nt-timestamp-radius, 10px) !important;
				}
				
                yt-thumbnail-bottom-overlay-view-model,
                yt-thumbnail-bottom-overlay-view-model .ytThumbnailBottomOverlayViewModelBadgeContainer,
                yt-thumbnail-bottom-overlay-view-model yt-thumbnail-badge-view-model,
				yt-thumbnail-bottom-overlay-view-model badge-shape {
                    width: 100% !important;
                    margin: 0px !important;
                    padding: 0px !important;
                    bottom: 0px;
                    justify-content: center !important;
					text-align: center !important;
					position: absolute;
                }
            `,
		},
		{
			type: "checkbox",
			id: "ThumbnailHoverOverlayEnabled",
			name: "Hover Glow Effect",
			description: "Adds a subtle color overlay and glowing border when you hover over a video thumbnail.",
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
			type: "color",
			id: "ThumbnailHoverBorderColor",
			name: "Hover Glow Color",
			description: "Sets the color of the glow and outline when a thumbnail is hovered.",
			value: "#659affff",
			varCss: "--nt-hover-color",
			require: { ThumbnailHoverOverlayEnabled: true },
		},
		{
			type: "color",
			id: "ThumbnailClickBorderColor",
			name: "Click Glow Color",
			description: "Sets the color of the border at the moment you click a thumbnail.",
			value: "#ffffffff",
			varCss: "--nt-click-color",
			require: { ThumbnailHoverOverlayEnabled: true },
		},
		{
			type: "numberSlide",
			id: "ThumbnailHoverBorderWidth",
			name: "Glow Border Width",
			description: "Adjusts the thickness of the hover glow border.",
			value: 1,
			min: 0,
			max: 10,
			step: 1,
			varCss: "--nt-hover-border-width",
			require: { ThumbnailHoverOverlayEnabled: true },
		},
		{
			type: "numberSlide",
			id: "ThumbnailHoverZoomScale",
			name: "Zoom Intensity",
			description: "Adjusts how much the thumbnail grows when 'Zoom' animation is selected.",
			value: 1.075,
			min: 1,
			max: 1.5,
			step: 0.005,
			varCss: "--nt-zoom-scale",
			require: { ThumbnailHoverAnimationStyle: ["Zoom", "Slide&Zoom"] },
		},
		{
			type: "checkbox",
			id: "ThumbnailLoadAnimationEnabled",
			name: "Load Animation",
			description: "Adds a smooth fade and lift effect when thumbnails first appear on the page.",
			value: true,
			enableCss: `
				@keyframes thumbnailXLoadAnimation {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				yt-lockup-view-model,
				ytd-video-renderer {
					opacity: 0;
				}

                yt-lockup-view-model:has(.ytCoreImageLoaded),
				ytd-video-renderer:has(.ytCoreImageLoaded) {
                    animation: thumbnailXLoadAnimation 0.5s forwards;
				}
            `,
		},
	],
};
