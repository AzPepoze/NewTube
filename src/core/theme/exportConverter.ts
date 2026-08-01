import type { Setting } from "@/settings/types/styleshiftTypes";
import { getSettingExportFields, typeConvertTable } from "@settings/registry/defaultItems";

export async function convertToExportSetting(
	thisSetting: Setting,
	createFileFunction: (fileName: string, fileData: string) => Promise<void>,
) {
	for (const thisProperty of getSettingExportFields(thisSetting.type)) {
		if ((thisProperty.includes("_css") || thisProperty.includes("_function")) && !(thisProperty in thisSetting)) {
			(thisSetting as unknown as Record<string, unknown>)[thisProperty] = "";
		}
	}

	//-----------------------------------

	for (const thisKey of Object.keys(thisSetting)) {
		for (const [styleshiftType, convertedType] of Object.entries(typeConvertTable)) {
			if (thisKey.endsWith(styleshiftType)) {
				await createFileFunction(`${thisKey}.${convertedType}`, thisSetting[thisKey]);
				delete thisSetting[thisKey];
			}
		}
	}
}
