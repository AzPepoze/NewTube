import { openSettingPage } from "../styleshift/buildInFunctions/extension";
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
				id: "Enable_Extension",
				name: "Enable",
				type: "checkbox",
				value: true,
				disableFunction: "disableExtension()",
				enableFunction: "enableExtension()",
			},
			{
				id: "Realtime_Extension",
				name: "Realtime Changing",
				type: "checkbox",
				value: false,
			},
			{
				id: "App_Light_Theme",
				name: "Light Theme",
				description: "Switch the extension UI to a light theme.",
				type: "checkbox",
				value: false,
			},
			{
				type: "checkbox",
				id: "Setting_BG_Transparent",
				name: "Enable Blur Background",
				description: "Makes the settings menu background transparent and blurred.",
				value: true,
			},
			{
				type: "numberSlide",
				id: "Setting_BG_Blur_Amount",
				name: "Background Blur Amount",
				description: "Adjusts the blur amount for the settings menu background.",
				value: 10,
				min: 0,
				max: 50,
				step: 1,
				varCss: "--setting-bg-blur-amount",
			},
			{
				clickFunction: openSettingPage,
				color: "#646464ff",
				description: "Description of this button",
				fontSize: 15,
				icon: "",
				id: "Test_button",
				name: "Open settings page!",
				align: "center",
				type: "button",
			},
			{
				clickFunction: 'window.open("https://github.com/AzPepoze/Newtube");',
				color: "#2e16feff",
				description: "Description of this button",
				fontSize: 15,
				icon: "https://pbs.twimg.com/profile_images/1372304699601285121/5yBS6_3F_400x400.jpg",
				id: "Test_button",
				name: "Github",
				align: "left",
				type: "button",
			},
			{
				clickFunction: 'window.open("https://discord.gg/BgxvVqap4G");',
				color: "#e60005ff",
				description: "Description of this button",
				fontSize: 15,
				id: "Test_button",
				name: "❗Report bugs / Issues❗\n",
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
				description: "",
				fontSize: 15,
				icon: "",
				id: "",
				name: 'Export "NewTube Data" (Clipboard)',
				align: "center",
				type: "button",
			},
			{
				clickFunction: `const Data = await enterTextPrompt({ title : 'Import_NewTube Data', placeholder : 'Paste NewTube data text here.'});
                    await importStyleshiftJsonText(Data);
                    `,
				color: "#1932ffff",
				description: "",
				fontSize: 15,
				icon: "",
				id: "",
				name: 'Import "NewTube Data"',
				align: "center",
				type: "button",
			},
		],
	},
];

export function getStyleshiftDefaultItems() {
	return defaultStyleshiftItems;
}
