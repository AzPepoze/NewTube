import { Category } from "../../styleshift/types/store";

export const fonts_category: Category = {
	category: "🔠 Fonts",
	settings: [
		{
			type: "custom",
			id: "FontManager",
			ui_function: async function (frame: HTMLElement) {
				frame.innerHTML = ""; // Clear previous ui
				frame.style.display = "flex";
				frame.style.flexDirection = "column";
				frame.style.gap = "10px";

				const font_name_label = document.createElement("label");
				font_name_label.textContent = 'Font name (e.g., "Roboto"):';
				const font_name_input = document.createElement("input");
				font_name_input.className = "STYLESHIFT-Text_input";
				font_name_input.placeholder = "Roboto";

				const font_url_label = document.createElement("label");
				font_url_label.textContent = "Font URL (e.g., from Google Fonts):";
				const font_url_input = document.createElement("input");
				font_url_input.className = "STYLESHIFT-Text_input";
				font_url_input.placeholder = "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2";

				const apply_button = document.createElement("div");
				apply_button.className = "STYLESHIFT-button";
				apply_button.textContent = "Apply Font";
				apply_button.style.textAlign = "center";

				frame.append(font_name_label, font_name_input, font_url_label, font_url_input, apply_button);

				apply_button.addEventListener("click", () => {
					const font_name = font_name_input.value;
					const font_url = font_url_input.value;

					if (!font_name || !font_url) {
						alert("Please provide both a font name and a URL.");
						return;
					}

					const style_id = "styleshift-custom-font-style";
					let style_tag = document.getElementById(style_id) as HTMLStyleElement;
					if (!style_tag) {
						style_tag = document.createElement("style");
						style_tag.id = style_id;
						document.head.appendChild(style_tag);
					}

					style_tag.innerHTML = `
                        @font-face {
                            font-family: '${font_name}';
                            src: url('${font_url}');
                        }
                        body, #masthead, .ytd-app, button, input, textarea, select {
                            font-family: '${font_name}', Roboto, Arial, sans-serif !important;
                        }
                    `;
					alert("Font applied!");
				});
			},
		},
		{
			type: "dropdown",
			id: "PredefinedFonts",
			name: "Select Popular Fonts",
			description: "Quickly apply popular fonts.",
			value: "Default",
			options: {
				Default: { enable_css: "" },
				"Noto Sans Thai": {
					enable_css: `
                        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;700&display=swap');
                        * { font-family: 'Noto Sans Thai', sans-serif !important; }
                    `,
				},
				"Noto Sans JP": {
					enable_css: `
                        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
                        * { font-family: 'Noto Sans JP', sans-serif !important; }
                    `,
				},
				"Noto Sans KR": {
					enable_css: `
                        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
                        * { font-family: 'Noto Sans KR', sans-serif !important; }
                    `,
				},
				"Roboto Mono": {
					enable_css: `
                        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;700&display=swap');
                        * { font-family: 'Roboto Mono', monospace !important; }
                    `,
				},
			},
		},
	],
};
