import { open_setting_page } from "../styleshift/build-in-functions/extension";
import { Category } from "../styleshift/types/store";

const default_styleshift_items: Category[] = [
	{
		category: "☕ Buy me a chocolate mlik! (I don't drink a coffee)",
		rainbow: true,
		settings: [
			{
				click_function: 'window.open("https://www.paypal.com/paypalme/jakkritportraitist");',
				color: "#0471ffff",
				font_size: 15,
				icon: "https://upload.wikimedia.org/wikipedia/commons/b/b7/PayPal_Logo_Icon_2014.svg",
				name: "Paypal",
				text_align: "left",
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
				click_function: 'window.open("https://discord.gg/BgxvVqap4G");',
				color: "#1932ffff",
				font_size: 15,
				icon: "https://brandlogos.net/wp-content/uploads/2021/11/discord-logo.png",
				name: "NEWTUBE",
				text_align: "left",
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
				disable_function: "disable_extension_function()",
				enable_function: "enable_extension_function()",
				// enable_css: main_css,
			},
			{
				id: "Realtime_Extension",
				name: "Realtime Changing",
				type: "checkbox",
				value: false,
			},
			{
				type: "checkbox",
				id: "Setting_BG_Transparent",
				name: "Enable Blur Background",
				description: "Makes the settings menu background transparent and blurred.",
				value: true,
				enable_css: `
			      .STYLESHIFT-Window {
			        background-color: rgba(30, 30, 30, 0.95) !important;
			        backdrop-filter: blur(var(--setting-bg-blur-amount, 10px)) !important;
			        transition: background-color 0.3s, backdrop-filter 0.3s;
			      }
			    `,
			},
			{
				type: "number_slide",
				id: "Setting_BG_Blur_Amount",
				name: "Background Blur Amount",
				description: "Adjusts the blur amount for the settings menu background.",
				value: 10,
				min: 0,
				max: 50,
				step: 1,
				var_css: "--setting-bg-blur-amount",
			},
			{
				click_function: open_setting_page,
				color: "#646464ff",
				description: "Description of this button",
				font_size: 15,
				icon: "",
				id: "Test_button",
				name: "Open settings page!",
				text_align: "center",
				type: "button",
			},
			{
				click_function: 'window.open("https://github.com/AzPepoze/Newtube");',
				color: "#2e16feff",
				description: "Description of this button",
				font_size: 15,
				icon: "https://pbs.twimg.com/profile_images/1372304699601285121/5yBS6_3F_400x400.jpg",
				id: "Test_button",
				name: "Github",
				text_align: "left",
				type: "button",
			},
			{
				click_function: 'window.open("https://discord.gg/BgxvVqap4G");',
				color: "#e60005ff",
				description: "Description of this button",
				font_size: 15,
				id: "Test_button",
				name: "❗Report bugs / Issues❗\n",
				text_align: "center",
				type: "button",
			},
		],
	},
	{
		category: "↕️ Import / Export Theme",
		settings: [
			{
				click_function:
					'await copy_to_clipboard(await export_styleshift_json_text());\n\ncreate_notification({\nicon : "✅",\ntitle : "StyleShift",\ncontent : "Copied to clipboard!"\n})',
				color: "#1932ffff",
				description: "",
				font_size: 15,
				icon: "",
				id: "",
				name: 'Export "StyleShift Data" (Clipboard)',
				text_align: "center",
				type: "button",
			},
			{
				click_function: `const Data = await enter_text_prompt({ title : 'Import_StyleShift Data', placeholder : 'Paste StyleShift data text here.'});
                    await import_styleshift_json_text(Data);
                    `,
				color: "#1932ffff",
				description: "",
				font_size: 15,
				icon: "",
				id: "",
				name: 'Import "StyleShift Data"',
				text_align: "center",
				type: "button",
			},
		],
	},
];

export function get_styleshift_default_items() {
	return default_styleshift_items;
}
