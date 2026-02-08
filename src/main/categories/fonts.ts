import { Category } from "../../styleshift/types/store";
import { settings_ui } from "../../styleshift/ui/settings/setting-components";
import FontManager from "../features/fonts/FontManager.svelte";

export const fonts_category: Category = {
	category: "🔠 Fonts",
	settings: [
		{
			type: "custom",
			id: "FontManager",
			ui_function: function (frame: HTMLElement) {
				settings_ui.render_component(FontManager, { setting: this }, frame);
			},
			constant_css: (value) => {
				if (!Array.isArray(value)) return "";
				const enabled_fonts = value.filter((f) => f.enabled && f.fontName && f.importUrl);
				if (enabled_fonts.length === 0) return "";

				// Deduplicate imports by URL
				const unique_urls = [...new Set(enabled_fonts.map((f) => f.importUrl))];
				const imports = unique_urls.map((url) => `@import url('${url}');`).join("\n");
				
				// Generate font stack.
				const font_stack = enabled_fonts
					.map((f) =>
						f.fontName
							.split(",")
							.map((name) => {
								const trimmed = name.trim();
								return trimmed.startsWith("'") || trimmed.startsWith('"') ? trimmed : `'${trimmed}'`;
							})
							.join(", "),
					)
					.join(", ");

				return `
                    ${imports}
                    body, #masthead, .ytd-app, button, input, textarea, select, * { 
                        font-family: ${font_stack}, Roboto, Arial, sans-serif !important; 
                    }
                `;
			},
		}
	],
};
