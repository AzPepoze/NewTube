import { type Category } from "@settings/types/styleshiftTypes";

export const scrollbarCategory: Category = {
	category: { icon: "unfold_more", label: "Scrollbar" },
	settings: [
		{
			type: "dropdown",
			id: "ScrollbarWidthStandard",
			name: "Scrollbar Width",
			description: "Adjusts the scrollbar width for Chromium-based browsers (Chrome, Edge, Opera).",
			value: "thin",
			options: [
				{ label: "Default", value: "auto", enableCss: `html { scrollbar-width: auto; }` },
				{ label: "Thin", value: "thin", enableCss: `html { scrollbar-width: thin; }` },
				{ label: "Hidden", value: "none", enableCss: `html { scrollbar-width: none; }` },
			],
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
