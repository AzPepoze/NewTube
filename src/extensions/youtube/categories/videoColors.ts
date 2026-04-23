import { type Category } from "@settings/types/styleshiftTypes";

export const videoColorsCategory: Category = {
	category: { icon: "format_paint", label: "Video Colors" },
	selector: "#movie_player",
	settings: [
		{
			type: "color",
			id: "TimelineBackgroundColor",
			name: "Timeline Track",
			description: "Sets the color of the unplayed/background portion of the video progress bar.",
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
			id: "TimelineLoadedColor",
			name: "Timeline Buffer",
			description: "Sets the color of the buffered/loaded portion of the progress bar.",
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
			id: "EndScreenVideoHoverColor",
			name: "Endscreen Hover",
			description: "The highlight color that appears when hovering over suggested videos at the end of a playback.",
			value: "#00000050",
			varCss: "--nt-endscreen-hover-bg",
			constantCss: `
      .ytp-videowall-still:hover .ytp-videowall-still-info-content {
        background: var(--nt-endscreen-hover-bg, #00000050) !important;
      }
    `,
		},
	],
};
