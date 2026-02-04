import { Category } from "../../styleshift/types/store";
import { enable_settings_button, disable_settings_button } from "../features/newtube-settings-button";

export const topbar_search_category: Category = {
	category: "🔎 Topbar & Search",
	settings: [
		{
			type: "checkbox",
			id: "Enable_Settings_Button",
			name: "Show NewTube Settings Button (✦)",
			description: "Adds a star icon to the top right of the page to quickly open NewTube settings.",
			value: true,
			enable_function: enable_settings_button,
			disable_function: disable_settings_button,
		},
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

                /* Search Icon Animation & Suggestion Styling */
                @keyframes show-searchIcon {
                    0% { opacity: 0; left: 20px; }
                    100% { opacity: 1; left: 0px; }
                }

                yt-searchbox [class*="SearchIcon"] {
                    display: block !important;
                    width: 20px !important;
                    position: absolute;
                    animation: show-searchIcon 0.4s;
                }
               
                .sbsb_i {
                    background: black;
                    padding: 5px 10px;
                    border-radius: var(--theme-radius);
                    outline: solid white 1px;
                    color: white !important;
                    transition: all 0.2s;
                }
                .sbsb_i:hover {
                    background: white !important;
                    color: black !important;
                }
                .sbpqs_a:before {
                    filter: invert(0.5);
                }
                .ytSearchboxComponentInputBox::placeholder {
                    color: var(--secondary-text-color) !important;
                }
            `,
		},
	],
};
