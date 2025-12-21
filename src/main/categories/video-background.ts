import { Category } from "../../styleshift/types/store";
import { setup_video_background, disable_video_background, update_video_bg_settings } from "../features/video-background";

export const video_background_category: Category = {
	category: "🎆 Background Video",
	settings: [
		{
			type: "checkbox",
			id: "EnaVDOBG",
			name: "Enable Background Video",
			description: "Uses the current video as the page background. (May impact performance)",
			value: false,
			enable_function: setup_video_background,
			disable_function: disable_video_background,
		},
        {
            type: "number_slide",
            id: "VideoBGBlur",
            name: "Blur Amount",
            description: "Applies a blur effect to the background video.",
            value: 30,
            min: 0,
            max: 100,
            step: 1,
            update_function: update_video_bg_settings
        },
        {
            type: "number_slide",
            id: "VideoBGQuality",
            name: "Quality (%)",
            description: "Adjusts the rendering resolution. Lower values improve performance.",
            value: 50,
            min: 10,
            max: 100,
            step: 10,
            update_function: update_video_bg_settings
        },
        {
            type: "number_slide",
            id: "VideoBGBrightness",
            name: "Brightness (%)",
            description: "Adjusts the brightness of the background video.",
            value: 100,
            min: 0,
            max: 200,
            step: 5,
            update_function: update_video_bg_settings
        },
        {
            type: "number_slide",
            id: "VideoBGContrast",
            name: "Contrast (%)",
            description: "Adjusts the contrast of the background video.",
            value: 100,
            min: 0,
            max: 200,
            step: 5,
            update_function: update_video_bg_settings
        },
        {
            type: "number_slide",
            id: "VideoBGSize",
            name: "Scale / Size",
            description: "Zooms the background video in or out.",
            value: 2.2,
            min: 1,
            max: 4,
            step: 0.1,
            update_function: update_video_bg_settings
        },
        {
            type: "number_slide",
            id: "VideoBGSmooth",
            name: "Smooth Frame (Skip)",
            description: "Skips frames to reduce CPU usage. Higher values = less smooth but better performance.",
            value: 1,
            min: 1,
            max: 10,
            step: 1,
            update_function: update_video_bg_settings
        }
	],
};
