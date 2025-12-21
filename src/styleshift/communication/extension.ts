import * as StyleShift_Functions from "../build-in-functions/extension";
import { on_function_event } from "../build-in-functions/normal";

// function Clear_Bloat(thisSetting: any): any | null {
// 	const settingtype = thisSetting.type;

// 	const Setting_Properties = styleshift_property_list[settingtype];

// 	if (!Setting_Properties) {
// 		return null;
// 	}

// 	const cleanedSetting: any = {};
// 	for (const key of Setting_Properties) {
// 		if (key in thisSetting) {
// 			cleanedSetting[key] = thisSetting[key];
// 		}
// 	}

// 	return cleanedSetting;
// }

for (const this_function_name of Object.keys(StyleShift_Functions)) {
	on_function_event("StyleShift", this_function_name, StyleShift_Functions[this_function_name]);
}
