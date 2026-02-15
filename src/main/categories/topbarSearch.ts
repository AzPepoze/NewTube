import { Category } from "../../styleshift/types/store";
import { enableSettingsButton, disableSettingsButton } from "../features/newtubeSettingsButton";

export const topbarSearchCategory: Category = {
	category: "🔎 Topbar & Search",
	settings: [
		{
			type: "checkbox",
			id: "EnableSettingsButton",
			name: "NewTube Settings Button",
			description: "Adds a stylized NewTube (✦) icon to the top-right header for instant access to these settings without leaving the page.",
			value: true,
			enableFunction: enableSettingsButton,
			disableFunction: disableSettingsButton,
		},
		{
			type: "checkbox",
			id: "EnableTopbarTransparency",
			name: "Adaptive Topbar",
			description: "Makes the top header bar transparent by default and applies your custom background color only when you begin to scroll down.",
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
			id: "TopbarBackgroundColor",
			name: "Topbar Color",
			description: "Customizes the background color of the top header. Best used with 'Adaptive Topbar' for a smooth transition while scrolling.",
			value: "#00000080",
			varCss: "--nt-topbar-bg",
			require: { EnableTopbarTransparency: true },
		},
		{
			type: "color",
			id: "SearchSuggestionHoverColor",
			name: "Search Hover",
			description: "Sets the background highlight color when navigating through the search suggestion dropdown menu.",
			value: "#ffffffff",
			varCss: "--nt-search-bg-hover",
		},
		{
			type: "checkbox",
			id: "EnableTopbarBorder",
			name: "Topbar Borders",
			description: "Applies your global outline or shadow settings to the bottom of the top navigation bar.",
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
			id: "ChipsBarBackgroundColor",
			name: "Chips Bar Color",
			description: "Changes the background color of the horizontal category list (the 'chips') found at the top of the home and search feeds.",
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
			id: "EnableChipsBarBorder",
			name: "Chips Bar Borders",
			description: "Adds global outlines or shadows to the horizontal category chips bar.",
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
			id: "EnableSearchAnimation",
			name: "Search Animation",
			description: "Adds a sleek slide-in and fade animation when the search bar is focused, enhancing the overall feel of the header.",
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
