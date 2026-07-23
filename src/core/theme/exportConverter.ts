import type { Setting } from "@/settings/types/styleshiftTypes";
import { styleshiftPropertyList, typeConvertTable } from "@settings/registry/defaultItems";

export async function convertToExportSetting(
	thisSetting: Setting,
	createFileFunction: (fileName: string, fileData: string) => Promise<void>,
) {
	const properties =
		styleshiftPropertyList[thisSetting.type] ||
		styleshiftPropertyList[thisSetting.type.charAt(0).toUpperCase() + thisSetting.type.slice(1)];
	if (properties) {
		for (const thisProperty of properties) {
			if ((thisProperty.includes("_css") || thisProperty.includes("_function")) && !(thisProperty in thisSetting)) {
				thisSetting[thisProperty] = "";
			}
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
