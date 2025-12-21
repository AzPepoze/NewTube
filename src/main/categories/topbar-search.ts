import { Category } from "../../styleshift/types/store";

export const topbar_search_category: Category = {
	category: "🔎 Topbar & Search",
	settings: [
		{
			type: "checkbox",
			id: "Scroll",
			name: "Auto-Transparent Topbar",
			description: "Makes the topbar transparent when scrolled down.",
			value: true,
			enable_function: function () {
				const masthead = document.querySelector("#masthead") as HTMLElement;
				if (!masthead) return;

				const handle_scroll = () => {
					if (window.scrollY > 0) {
						masthead.classList.add("scrolled");
					} else {
						masthead.classList.remove("scrolled");
					}
				};

				window.addEventListener("scroll", handle_scroll);
				// Also remove listener when disabled if we add a disable_function
			},
			enable_css: `
                #masthead {
                    transition: background-color 0.3s ease !important;
                }
                #masthead.scrolled {
                    background-color: var(--topbar-color, #00000080) !important;
                }
            `,
		},
		{
			type: "color",
			id: "ThemeSnd",
			name: "Topbar color",
			description: "The background color of the topbar when scrolled.",
			value: "#00000080",
			var_css: "--topbar-color",
		},
		{
			type: "checkbox",
			id: "TopOut",
			name: "Topbar Borders/Shadows",
			description: "Adds borders or shadows to the topbar.",
			value: true,
			enable_css: `
                #masthead > #background {
                    box-shadow: var(--global-style-shadow) !important;
                    border-bottom: var(--global-style-outline) !important;
                }
            `,
		},
		{
			type: "color",
			id: "ThemeChips",
			name: "Chips Bar color",
			description: "Background color for the topic chips bar below the topbar.",
			value: "#00000080",
			var_css: "--chips-color",
			constant_css: `
                #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
                    background-color: var(--chips-color) !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "SndOut",
			name: "Chips Bar Borders/Shadows",
			description: "Adds borders or shadows to the chips bar.",
			value: false,
			enable_css: `
                #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
                    box-shadow: var(--global-style-shadow) !important;
                    border-bottom: var(--global-style-outline) !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "SearchAnim",
			name: "Enable Search Animation",
			description: "Adds a slide-in animation to the search suggestion box.",
			value: true,
			enable_css: `
                div.gstl_50.sbdd_a {
                    display: block !important;
                    overflow: hidden;
                    transition: all 0.4s ease;
                    transform: translate(50px, 0);
                    pointer-events: none;
                    opacity: 0;
                }
                html:has(input#search:focus) div.gstl_50.sbdd_a {
                    transform: none !important;
                    pointer-events: visible !important;
                    opacity: 1 !important;
                }
            `,
		},
	],
};
