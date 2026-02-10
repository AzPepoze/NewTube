import * as StyleShift_Functions from "../buildInFunctions/extension";
import { onFunctionEvent } from "../buildInFunctions/normal";

// function Clear_Bloat(thisSetting: any): any | null {
// 	const settingtype = thisSetting.type;

// 	const Setting_Properties = styleshiftPropertyList[settingtype];

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

for (const thisFunctionName of Object.keys(StyleShift_Functions)) {
	onFunctionEvent("StyleShift", thisFunctionName, StyleShift_Functions[thisFunctionName]);
}
