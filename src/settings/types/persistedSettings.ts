import type { SettingKind } from "./styleshiftTypes";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type PersistedSetting = { type: SettingKind; id?: string } & Record<string, JsonValue>;
export type PersistedCategory = {
	category: string | { icon: string; label: string };
	settings: PersistedSetting[];
	selector?: string;
	highlightColor?: string;
} & Record<string, JsonValue>;

const LEGACY_FIELDS = new Map([
	["Selector", "selector"],
	["Highlight_color", "highlightColor"],
	["setup_", "setupFunction"],
]);

export function assertCanonicalPersistedItems(
	value: unknown,
	path = "addOnStyleShiftItems",
): asserts value is PersistedCategory[] {
	if (!Array.isArray(value)) throw new Error(`${path} must be an array of categories.`);
	for (const [categoryIndex, category] of value.entries()) {
		if (!category || typeof category !== "object" || Array.isArray(category)) {
			throw new Error(`${path}[${categoryIndex}] must be a category object.`);
		}
		assertNoLegacyFields(category as Record<string, unknown>, `${path}[${categoryIndex}]`);
		const settings = (category as { settings?: unknown }).settings;
		if (!Array.isArray(settings)) throw new Error(`${path}[${categoryIndex}].settings must be an array.`);
		for (const [settingIndex, setting] of settings.entries()) {
			if (!setting || typeof setting !== "object" || Array.isArray(setting)) {
				throw new Error(`${path}[${categoryIndex}].settings[${settingIndex}] must be a setting object.`);
			}
			assertNoLegacyFields(setting as Record<string, unknown>, `${path}[${categoryIndex}].settings[${settingIndex}]`);
		}
	}
}

function assertNoLegacyFields(value: Record<string, unknown>, path: string) {
	for (const [legacy, canonical] of LEGACY_FIELDS) {
		if (legacy in value) throw new Error(`${path}.${legacy} is no longer supported. Rename it to ${canonical}.`);
	}
}
