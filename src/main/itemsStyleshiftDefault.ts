import { openSettingPage } from "../styleshift/shared/extension";
import { Category } from "../styleshift/types/store";

const defaultStyleshiftItems: Category[] = [
	{
		category: "☕ Buy me a chocolate mlik! (I don't drink a coffee)",
		rainbow: true,
		settings: [
			{
				clickFunction: 'window.open("https://www.paypal.com/paypalme/jakkritportraitist");',
				color: "#0471ffff",
				fontSize: 15,
				icon: "https://upload.wikimedia.org/wikipedia/commons/b/b7/PayPal_Logo_Icon_2014.svg",
				name: "Paypal",
				align: "left",
				type: "button",
			},
		],
		selector: "",
	},
	{
		category: "🎉 Join my Discord!",
		rainbow: true,
		settings: [
			{
				clickFunction: 'window.open("https://discord.gg/BgxvVqap4G");',
				color: "#1932ffff",
				fontSize: 15,
				icon: "https://brandlogos.net/wp-content/uploads/2021/11/discord-logo.png",
				name: "NEWTUBE",
				align: "left",
				type: "button",
			},
		],
	},
	{
		category: "⚙️ Extention's settings",
		settings: [
			{
				id: "EnableExtension",
				name: "Enable Extension",
				type: "checkbox",
				value: true,
				disableFunction: "disableExtension()",
				enableFunction: "enableExtension()",
			},
			{
				id: "EnableRealtimeExtension",
				name: "Realtime Updating",
				description:
					"Instantly applies visual changes as you move sliders or pick colors without needing to save.",
				type: "checkbox",
				value: false,
			},
			{
				type: "checkbox",
				id: "EnableSettingsBackgroundBlur",
				name: "Glass UI",
				description: "Applies a frosted-glass blur effect to the background of this settings window.",
				value: true,
			},
			{
				type: "numberSlide",
				id: "SettingsBackgroundBlurAmount",
				name: "Glass Intensity",
				description: "Adjusts the strength of the background blur for the settings menu.",
				value: 10,
				min: 0,
				max: 50,
				step: 1,
				varCss: "--setting-bg-blur-amount",
				require: { EnableSettingsBackgroundBlur: true },
			},
			{
				clickFunction: openSettingPage,
				color: "#646464ff",
				description: "Opens the full-page settings dashboard in a new tab.",
				fontSize: 15,
				icon: "",
				id: "OpenDashboardButton",
				name: "Full Settings Page",
				align: "center",
				type: "button",
			},
			{
				clickFunction: 'window.open("https://github.com/AzPepoze/Newtube");',
				color: "#2e16feff",
				description: "View the source code, contribute, or check for updates on GitHub.",
				fontSize: 15,
				icon: "https://pbs.twimg.com/profile_images/1372304699601285121/5yBS6_3F_400x400.jpg",
				id: "GithubButton",
				name: "GitHub Repository",
				align: "left",
				type: "button",
			},
			{
				clickFunction: 'window.open("https://discord.gg/BgxvVqap4G");',
				color: "#e60005ff",
				description: "Found a bug? Have a suggestion? Join our Discord community!",
				fontSize: 15,
				id: "ReportBugButton",
				name: "❗Report Bugs & Issues❗\n",
				align: "center",
				type: "button",
			},
		],
	},
	{
		category: "↕️ Import / Export Theme",
		settings: [
			{
				clickFunction:
					'await copyToClipboard(await exportStyleshiftJsonText());\n\ncreateNotification({\nicon : "✅",\ntitle : "NewTube",\ncontent : "Copied to clipboard!"\n})',
				color: "#1932ffff",
				description: "Copies your current theme and settings as a text code to your clipboard.",
				fontSize: 15,
				icon: "",
				id: "ExportDataButton",
				name: "Export Data (Clipboard)",
				align: "center",
				type: "button",
			},
			{
				clickFunction: `const Data = await enterTextPrompt({ title : 'Import_NewTube Data', placeholder : 'Paste NewTube data text here.'});
                    await importStyleshiftJsonText(Data);
                    `,
				color: "#1932ffff",
				description: "Paste a NewTube theme code to instantly apply it.",
				fontSize: 15,
				icon: "",
				id: "ImportDataButton",
				name: "Import Data",
				align: "center",
				type: "button",
			},
		],
	},
	{
		category: "⚡ Performance",
		settings: [
			{
				type: "checkbox",
				id: "EnablePerformanceMode",
				name: "Performance Mode",
				description:
					"Disables all heavy visual effects like blurs, filters, transitions, and animations. Highly recommended for low-end PCs or to save battery.",
				value: false,
				enableCss: `
                * {
                    backdrop-filter: none !important;
                    transition: none !important;
                    animation: none !important;
                }
            `,
			},
		],
	},
];

export function getStyleshiftDefaultItems() {
	return defaultStyleshiftItems;
}
