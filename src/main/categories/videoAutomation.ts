import { Category } from "../../styleshift/types/store";
import { setupAutoTheater, enableAutoRemoveAmbient } from "../features/video/general";
import { enableAutoPip, enableAutoExitPip, disableAutoPip } from "../features/video/pip";
import { setupUpdateTimestamp } from "../features/video/timestamp";
import { IS_FIREFOX } from "../../styleshift/run";

export const videoAutomationCategory: Category = {
	category: { icon: "auto_awesome", label: "Video Automation" },
	settings: [
		{
			type: "checkbox",
			id: "EnableAutoTheaterMode",
			name: "Auto Theater",
			description: "Automatically switches the player to 'Theater Mode' every time you open a new video for a larger viewing area.",
			value: false,
			enableFunction: setupAutoTheater,
		},
		{
			type: "checkbox",
			id: "EnableFullTheaterMode",
			name: "Full-Height Mode",
			description: "Extends theater mode to fill the entire height of your window, hiding the header until you scroll.",
			value: false,
			enableCss: `
				ytd-watch-flexy[theater]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy {
					height: calc(100vh - 56px) !important;
					max-height: unset !important;
				}
			`,
		},
		{
			type: "checkbox",
			id: "EnableAutoPictureInPicture",
			name: "Auto PiP",
			description: "Automatically shrinks the video into a small floating window when you switch browser tabs.\n\nNote: Need to click somewhere on the page after back to the tab to make the Auto PiP work.\n(Security limitations sorry for inconvenience.)",
			value: true,
			enableFunction: enableAutoPip,
			disableFunction: disableAutoPip,
			lock: {
				condition: !IS_FIREFOX,
				message: "Picture-in-Picture functionality has security limitations in Firefox and has been disabled for your protection.",
			},
		},
		{
			type: "checkbox",
			id: "EnableAutoExitPictureInPicture",
			name: "Auto Exit PiP",
			description: "Automatically restores the video to the main page as soon as you return to the tab.",
			value: true,
			enableFunction: enableAutoExitPip,
			disableFunction: disableAutoPip,
			lock: {
				condition: !IS_FIREFOX,
				message: "Picture-in-Picture functionality has security limitations in Firefox and has been disabled for your protection.",
			},
		},
		{
			type: "checkbox",
			id: "AutoRemoveAmbientMode",
			name: "Auto Remove Ambient Mode",
			description: "Automatically disables YouTube's native ambient lighting effect to prevent visual conflicts.",
			value: true,
			enableFunction: enableAutoRemoveAmbient,
		},
		{
			type: "checkbox",
			id: "UpdateUrlTimestamp",
			name: "URL Time Sync",
			description: "Continuously updates the address bar URL with the current timestamp of the video you are watching.",
			value: false,
			enableFunction: setupUpdateTimestamp,
		},
	],
};
