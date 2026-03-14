import { Category } from "../../styleshift/types/styleshiftTypes";

export const subscribeButtonCategory: Category = {
	category: { icon: "notifications_active", label: "Subscribe Button" },
	settings: [
		{
			type: "checkbox",
			id: "EnableCustomSubscribeButton",
			name: "Custom Styling",
			description: "Enables independent color and shape customization for the YouTube subscribe button, overriding the default YouTube branding.",
			value: false,
			enableCss: `
                .ytd-subscribeButton-renderer button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
                    background: var(--nt-subscribe-bg) !important;
                    color: var(--nt-subscribe-text) !important;
                    border-radius: var(--nt-border-radius) !important;
                }
            `,
		},
		{
			type: "color",
			id: "SubscribeButtonBackgroundColor",
			name: "Button Color",
			description: "Sets the background fill color for the subscribe button. Traditionally red, but can be any color to match your theme.",
			value: "#ff0000ff",
			varCss: "--nt-subscribe-bg",
			require: { EnableCustomSubscribeButton: true }
		},
		{
			type: "color",
			id: "SubscribeButtonTextColor",
			name: "Text Color",
			description: "Changes the color of the 'Subscribe' or 'Subscribed' text inside the button.",
			value: "#ffffffff",
			varCss: "--nt-subscribe-text",
			require: { EnableCustomSubscribeButton: true }
		},
		{
			type: "checkbox",
			id: "EnableSubscribeButtonBorder",
			name: "Borders & Shadows",
			description: "Applies your global outline or glow shadow settings specifically to the subscribe button.",
			value: false,
			enableCss: `
                .ytd-subscribe-button-renderer button {
                    box-shadow: var(--nt-global-shadow) !important;
                    border: var(--nt-global-outline) !important;
                }
            `,
			require: { EnableCustomSubscribeButton: true }
		},
	],
};
