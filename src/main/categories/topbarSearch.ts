import { Category } from "../../styleshift/types/store";
import { enableSettingsButton, disableSettingsButton } from "../features/newtubeSettingsButton";

export const topbarSearchCategory: Category = {
	category: "🔎 Topbar & Search",
	settings: [
		{
			type: "checkbox",
			id: "Enable_Settings_Button",
			name: "Show NewTube Settings Button (✦)",
			description: "Adds a star icon to the top right of the page to quickly open NewTube settings.",
			value: true,
			enableFunction: enableSettingsButton,
			disableFunction: disableSettingsButton,
		},
		{
			type: "checkbox",
			id: "Scroll",
			name: "Auto-Transparent Topbar",
			description: "Makes the topbar transparent when scrolled down.",
			value: true,
			enableFunction: function () {
				const masthead = document.querySelector("#masthead") as HTMLElement;
				if (!masthead) return;

				const handleScroll = () => {
					if (window.scrollY > 0) {
						masthead.classList.add("scrolled");
					} else {
						masthead.classList.remove("scrolled");
					}
				};

				window.addEventListener("scroll", handleScroll);
				// Also remove listener when disabled if we add a disableFunction
			},
			enableCss: `
                #masthead {
                    transition: background-color 0.3s ease !important;
                }
                #masthead.scrolled {
                    background-color: var(--nt-topbar-bg, #00000080) !important;
                }
            `,
		},
		{
			type: "color",
			id: "ThemeSnd",
			name: "Topbar color",
			description: "The background color of the topbar when scrolled.",
			value: "#00000080",
			varCss: "--nt-topbar-bg",
		},
		{
			type: "color",
			id: "Themehover",
			name: "Search suggestion hover color",
			description: "Background color of the search suggestions when hovered.",
			value: "#ffffffff",
			varCss: "--nt-search-bg-hover",
		},
		{
			type: "checkbox",
			id: "TopOut",
			name: "Topbar Borders/Shadows",
			description: "Adds borders or shadows to the topbar.",
			value: true,
			enableCss: `
                #masthead > #background {
                    box-shadow: var(--nt-global-shadow) !important;
                    border-bottom: var(--nt-global-outline) !important;
                }
            `,
		},
		{
			type: "color",
			id: "ThemeChips",
			name: "Chips Bar color",
			description: "Background color for the topic chips bar below the topbar.",
			value: "#00000080",
			varCss: "--nt-chips-bg",
			constantCss: `
                #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
                    background-color: var(--nt-chips-bg) !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "SndOut",
			name: "Chips Bar Borders/Shadows",
			description: "Adds borders or shadows to the chips bar.",
			value: false,
			enableCss: `
                #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
                    box-shadow: var(--nt-global-shadow) !important;
                    border-bottom: var(--nt-global-outline) !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "SearchAnim",
			name: "Enable Search Animation",
			description: "Adds a slide-in animation to the search suggestion box.",
			value: true,
			enableCss: `
                div.gstl50.sbddA {
                    display: block !important;
                    overflow: hidden;
                    transition: all 0.4s ease;
                    transform: translate(50px, 0);
                    pointer-events: none;
                    opacity: 0;
                }
                html:has(input#search:focus) div.gstl50.sbddA {
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
               
                .sbsbI {
                    background: black;
                    padding: 5px 10px;
                    border-radius: var(--nt-border-radius);
                    outline: solid white 1px;
                    color: white !important;
                    transition: all 0.2s;
                }
                .sbsbI:hover {
                    background: white !important;
                    color: black !important;
                }
                .sbpqsA:before {
                    filter: invert(0.5);
                }
                .ytSearchboxComponentInputBox::placeholder {
                    color: var(--nt-text-secondary) !important;
                }
            `,
		},
	],
};
