import { Category } from "../../styleshift/types/store";

export const scrollbarCategory: Category = {
	category: "📜 Scrollbar",
	settings: [
		{
			type: "dropdown",
			id: "ScrollbarWidthStandard",
			name: "Scrollbar Width",
			description: "Changes the thickness of the browser scrollbar on the YouTube website. Best for modern browsers like Firefox.",
			value: "thin",
			options: {
				auto: { name: "Default", enableCss: `html { scrollbar-width: auto; }` },
				thin: { name: "Thin", enableCss: `html { scrollbar-width: thin; }` },
				none: { name: "Hidden", enableCss: `html { scrollbar-width: none; }` },
			},
		},
		{
			type: "numberSlide",
			id: "ScrollbarWidthLegacy",
			name: "Legacy Width",
			description: "Adjusts the scrollbar width for Chromium-based browsers (Chrome, Edge, Opera).",
			value: 10,
			min: 0,
			max: 30,
			step: 1,
			varCss: "--nt-scrollbar-width",
			constantCss: `
                ::-webkit-scrollbar {
                    width: var(--nt-scrollbar-width, 10px) !important;
                    height: var(--nt-scrollbar-width, 10px) !important;
                }
            `,
		},
		{
			type: "color",
			id: "ScrollbarTrackColor",
			name: "Track Color",
			description: "Sets the background color of the scrollbar track (the area behind the scrolling handle).",
			value: "#00000000",
			varCss: "--nt-scrollbar-track-color",
			constantCss: `
                body::-webkit-scrollbar-track {
                    background: var(--nt-scrollbar-track-color, #00000000) !important;
                }
                @supports (scrollbar-width: thin) {
                    * {
                        scrollbar-color: var(--nt-theme-color) var(--nt-scrollbar-track-color, transparent) !important;
                    }
                }
            `,
		},
	],
};
