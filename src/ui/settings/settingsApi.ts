import { saveToStorage } from "@core/storage/manager";
import type { Setting } from "@settings/types/styleshiftTypes";
import * as mainSettingUi from "./components/controls/controls";
import * as developerSettingUi from "./components/developer/developer";
import * as advanceSettingUi from "./components/primitives/primitives";
import * as render from "./renderer";
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
