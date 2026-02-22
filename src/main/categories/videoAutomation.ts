import { Category } from "../../styleshift/types/store";
import { setupAutoTheater, enableAutoRemoveAmbient } from "../features/video/general";
import { setupAutoPip, setupAutoExitPip } from "../features/video/pip";
import { setupUpdateTimestamp } from "../features/video/timestamp";

export const videoAutomationCategory: Category = {
	category: "🤖 Video Automation",
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
      ytd-watch-flexy[theater] #full-bleed-container.ytd-watch-flexy {
        height: calc(100vh - 56px) !important;
        max-height: unset !important;
      }
    `,
			require: { EnableAutoTheaterMode: true },
		},
		{
			type: "checkbox",
			id: "EnableAutoPictureInPicture",
			name: "Auto PiP",
			description: "Automatically shrinks the video into a small floating window when you switch browser tabs.",
			value: true,
			enableFunction: setupAutoPip,
		},
		{
			type: "checkbox",
			id: "EnableAutoExitPictureInPicture",
			name: "Auto Exit PiP",
			description: "Automatically restores the video to the main page as soon as you return to the tab.",
			value: true,
			enableFunction: setupAutoExitPip,
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
