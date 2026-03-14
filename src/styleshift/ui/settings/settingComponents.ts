import { saveToStorage } from "@/styleshift/core/storageManager";
import * as advanceSettingUi from "./components/advance/advance";
import * as developerSettingUi from "./components/dev/dev";
import * as mainSettingUi from "./components/main/main";
import type { Setting } from "../../types/styleshiftTypes";
import * as render from "./render";
import * as windows from "./windows";

export async function setAndSave(thisSetting: Setting, value: any) {
	if ("id" in thisSetting && thisSetting.id) {
		await saveToStorage(thisSetting.id, value);
	}
}

export const settingsUi = {
	...mainSettingUi,
	...advanceSettingUi,
	...developerSettingUi,
	...render,
	...windows,
	group: advanceSettingUi.subTitle,
};
