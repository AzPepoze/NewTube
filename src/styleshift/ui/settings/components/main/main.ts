import { Setting } from "@styleshift/types/store";
import { settingsUi } from "@ui/settings/settingComponents";

export async function search(onInput: (value: string) => void) {
	// Search is a special utility, we'll keep its direct mount or update SettingRenderer to handle it
	return settingsUi.renderSetting({ type: "search" } as unknown as Setting, onInput);
}

export async function text(
	thisSetting: Partial<Extract<Setting, { type: "text" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function subText(
	thisSetting: Partial<Extract<Setting, { type: "subText" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function button(
	thisSetting: Partial<Extract<Setting, { type: "button" }>>,
	updateFunction?: (value: any) => void,
) {
	const button = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { button };
}

export async function checkbox(
	thisSetting: Partial<Extract<Setting, { type: "checkbox" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function numberSlide(
	thisSetting: Partial<Extract<Setting, { type: "numberSlide" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function dropdown(
	thisSetting: Partial<Extract<Setting, { type: "dropdown" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function color(
	thisSetting: Partial<Extract<Setting, { type: "color" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function textInput(
	thisSetting: Partial<Extract<Setting, { type: "textInput" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function imageInput(
	thisSetting: Partial<Extract<Setting, { type: "imageInput" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function previewImage(
	thisSetting: Partial<Extract<Setting, { type: "previewImage" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function custom(
	thisSetting: Partial<Extract<Setting, { type: "custom" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}

export async function combineSettings(
	thisSetting: Partial<Extract<Setting, { type: "combineSettings" }>>,
	updateFunction?: (value: any) => void,
) {
	const frame = settingsUi.renderSetting(thisSetting as any, updateFunction);
	return { frame };
}
