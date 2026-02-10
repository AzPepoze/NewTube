import { Category } from "../../styleshift/types/store";

export const subtitlesCategory: Category = {
	category: "🔤 Subtitles/Captions",
	settings: [
		{
			type: "checkbox",
			id: "NewSub",
			name: "Enable Custom Subtitle Styles",
			description: "Toggles all custom subtitle styles on or off.",
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
			id: "Subtitle",
			name: "Subtitle color",
			description: "The main text color of the subtitles.",
			value: "#ffffffff",
			varCss: "--nt-subtitle-color",
		},
		{
			type: "color",
			id: "CapBG",
			name: "Subtitle Background color",
			description: "The background color of the caption box.",
			value: "#00000000",
			varCss: "--nt-subtitle-bg",
		},
		{
			type: "numberSlide",
			id: "subWidth",
			name: "Subtitle Weight",
			description: "Controls the font weight (boldness) of the subtitle text.",
			value: 700,
			min: 100,
			max: 900,
			step: 100,
			varCss: "--nt-subtitle-font-weight",
		},
		{
			type: "numberSlide",
			id: "subSpace",
			name: "Subtitle Letter Spacing",
			description: "Controls the space between letters.",
			value: 2,
			min: 0,
			max: 10,
			step: 1,
			varCss: "--nt-subtitle-letter-spacing",
		},
		{
			type: "color",
			id: "subShaColor",
			name: "Subtitle Shadow color",
			description: "The color of the drop shadow behind the text.",
			value: "#000000ff",
			varCss: "--nt-subtitle-shadow-color",
		},
		{
			type: "numberSlide",
			id: "subShaBlur",
			name: "Subtitle Shadow Blur",
			description: "The amount of blur for the drop shadow.",
			value: 2,
			min: 0,
			max: 20,
			step: 1,
			varCss: "--nt-subtitle-shadow-blur",
		},
		{
			type: "numberSlide",
			id: "subShaWidth",
			name: "Subtitle Shadow Width",
			description: "Offset/Width of the drop shadow.",
			value: 0,
			min: -10,
			max: 10,
			step: 1,
			varCss: "--nt-subtitle-shadow-offset",
		},
		{
			type: "checkbox",
			id: "BlurSub",
			name: "Blur Subtitle Background",
			description: "Applies a blur effect to the area behind the subtitles.",
			value: false,
			enableCss: `
                .caption-window.ytp-caption-window-bottom {
                    backdrop-filter: blur(var(--nt-subtitle-blur-amount, 5px)) !important;
                }
            `,
		},
		{
			type: "numberSlide",
			id: "SubBgBlurAmount",
			name: "Subtitle Background Blur Amount",
			description: "Adjusts the blur amount for the subtitle background.",
			value: 5,
			min: 0,
			max: 50,
			step: 1,
			varCss: "--nt-subtitle-blur-amount",
		},
		{
			type: "checkbox",
			id: "CapOut",
			name: "Enable Borders/Shadows",
			description: "Adds borders or shadows to the caption window.",
			value: false,
			enableCss: `
                .caption-window.ytp-caption-window-bottom {
                    box-shadow: 0 0 var(--nt-border-width, 8px) var(--nt-border-color, #099DFF80) !important;
                    border: 1px solid var(--nt-border-color, #099DFF80) !important;
                }
            `,
		},
	],
};
