import { Category } from "../../styleshift/types/styleshiftTypes";

export const subtitlesCategory: Category = {
	category: { icon: "closed_caption", label: "Subtitles & Captions" },
	settings: [
		{
			type: "checkbox",
			id: "EnableCustomSubtitles",
			name: "Custom Subtitles",
			description: "Enables advanced styling for YouTube's closed captions. When active, you can customize colors, fonts, and shadows to make text easier to read.",
			value: true,
			enableCss: `
                .ytp-caption-segment {
                    background: transparent !important;
                    filter: drop-shadow(var(--nt-subtitle-shadow-offset, 0px) var(--nt-subtitle-shadow-offset, 0px) var(--nt-subtitle-shadow-blur, 2px) var(--nt-subtitle-shadow-color, #000));
                    font-weight: var(--nt-subtitle-font-weight, 700);
                    letter-spacing: var(--nt-subtitle-letter-spacing, 2px);
                    color: var(--nt-subtitle-color, #fff) !important;
                }
                .captions-text {
                    background: var(--nt-subtitle-bg, #00000000) !important;
                }
                .caption-window {
                    background: transparent !important;
                }
            `,
		},
		{
			type: "color",
			id: "SubtitleTextColor",
			name: "Text Color",
			description: "Sets the primary color of the caption text.",
			value: "#ffffffff",
			varCss: "--nt-subtitle-color",
			require: { EnableCustomSubtitles: true },
		},
		{
			type: "color",
			id: "SubtitleBackgroundColor",
			name: "Background Color",
			description: "Changes the color of the box behind the subtitle text. Set to transparent for a floating text look.",
			value: "#00000000",
			varCss: "--nt-subtitle-bg",
			require: { EnableCustomSubtitles: true },
		},
		{
			type: "numberSlide",
			id: "SubtitleFontWeight",
			name: "Font Weight",
			description: "Adjusts the boldness of the subtitle font. Higher values make the text thicker and more prominent.",
			value: 700,
			min: 100,
			max: 900,
			step: 100,
			varCss: "--nt-subtitle-font-weight",
			require: { EnableCustomSubtitles: true },
		},
		{
			type: "numberSlide",
			id: "SubtitleLetterSpacing",
			name: "Letter Spacing",
			description: "Increases or decreases the horizontal space between each character in the subtitles.",
			value: 2,
			min: 0,
			max: 10,
			step: 1,
			varCss: "--nt-subtitle-letter-spacing",
			require: { EnableCustomSubtitles: true },
		},
		{
			type: "color",
			id: "SubtitleShadowColor",
			name: "Shadow Color",
			description: "Sets the color of the drop shadow behind the subtitle text, helping it stand out against any background.",
			value: "#000000ff",
			varCss: "--nt-subtitle-shadow-color",
			require: { EnableCustomSubtitles: true },
		},
		{
			type: "numberSlide",
			id: "SubtitleShadowBlur",
			name: "Shadow Blur",
			description: "Adjusts the softness of the subtitle shadow. Higher values create a soft glow, while lower values keep it sharp.",
			value: 2,
			min: 0,
			max: 20,
			step: 1,
			varCss: "--nt-subtitle-shadow-blur",
			require: { EnableCustomSubtitles: true },
		},
		{
			type: "numberSlide",
			id: "SubtitleShadowOffset",
			name: "Shadow Distance",
			description: "Shifts the shadow position diagonally. Use this to create a 3D depth effect for your captions.",
			value: 0,
			min: -10,
			max: 10,
			step: 1,
			varCss: "--nt-subtitle-shadow-offset",
			require: { EnableCustomSubtitles: true },
		},
		{
			type: "checkbox",
			id: "EnableSubtitleBlur",
			name: "Glass Background",
			description: "Applies a modern frosted-glass blur effect to the subtitle window background.",
			value: false,
			enableCss: `
                .caption-window.ytp-caption-window-bottom {
                    backdrop-filter: blur(var(--nt-subtitle-blur-amount, 5px)) !important;
                }
            `,
			require: { EnableCustomSubtitles: true },
		},
		{
			type: "numberSlide",
			id: "SubtitleBlurAmount",
			name: "Glass Intensity",
			description: "Controls the strength of the frosted-glass blur effect behind the subtitles.",
			value: 5,
			min: 0,
			max: 50,
			step: 1,
			varCss: "--nt-subtitle-blur-amount",
			require: { EnableCustomSubtitles: true, EnableSubtitleBlur: true },
		},
		{
			type: "checkbox",
			id: "EnableSubtitleBorder",
			name: "Borders & Shadows",
			description: "Applies your global outline or glow settings to the subtitle window for a consistent look.",
			value: false,
			enableCss: `
                .caption-window.ytp-caption-window-bottom {
                    box-shadow: 0 0 var(--nt-border-width, 8px) var(--nt-border-color, #099DFF80) !important;
                    border: 1px solid var(--nt-border-color, #099DFF80) !important;
                }
            `,
			require: { EnableCustomSubtitles: true },
		},
	],
};
