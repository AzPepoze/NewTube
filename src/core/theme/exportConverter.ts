import type { Category, Setting } from "@/settings/types/styleshiftTypes";
import type { JsonValue, PersistedCategory, PersistedSetting } from "@/settings/types/persistedSettings";
import { getSettingExportFields, typeConvertTable } from "@settings/registry/defaultItems";

const LEGACY_PERSISTED_FIELDS = ["Highlight_color", "Selector"] as const;
type LegacyPersistedField = (typeof LEGACY_PERSISTED_FIELDS)[number];

export class PersistedSchemaMigrationError extends Error {
	readonly field: LegacyPersistedField;

	constructor(field: LegacyPersistedField) {
		super(`Migration required: legacy persisted field "${field}" is not supported.`);
		this.name = "PersistedSchemaMigrationError";
		this.field = field;
	}
}

function assertNoLegacyPersistedFields(value: unknown): void {
	if (Array.isArray(value)) {
		for (const item of value) assertNoLegacyPersistedFields(item);
		return;
	}

	if (!value || typeof value !== "object") return;

	for (const [key, child] of Object.entries(value)) {
		if ((LEGACY_PERSISTED_FIELDS as readonly string[]).includes(key)) {
			throw new PersistedSchemaMigrationError(key as LegacyPersistedField);
		}
		assertNoLegacyPersistedFields(child);
	}
}

function toJsonSafeValue(value: unknown): JsonValue | undefined {
	if (value === undefined) return undefined;
	if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
		return value as JsonValue;
	}
	if (typeof value === "function") return value.toString();
	if (Array.isArray(value)) {
		return value.reduce<JsonValue[]>((result, item) => {
			const converted = toJsonSafeValue(item);
			if (converted !== undefined) result.push(converted);
			return result;
		}, []);
	}
	if (typeof value !== "object") {
		throw new TypeError(`Cannot persist value of type ${typeof value}.`);
	}

	const result: Record<string, JsonValue> = {};
	for (const [key, child] of Object.entries(value)) {
		const converted = toJsonSafeValue(child);
		if (converted !== undefined) result[key] = converted;
	}
	return result;
}

function clonePersistedValue<T>(value: T): T {
	if (Array.isArray(value)) return value.map(clonePersistedValue) as T;
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clonePersistedValue(child)])) as T;
}

export function toPersistedSetting(setting: Setting): PersistedSetting {
	assertNoLegacyPersistedFields(setting);
	return toJsonSafeValue(setting) as PersistedSetting;
}

export function fromPersistedSetting(setting: PersistedSetting): Setting {
	assertNoLegacyPersistedFields(setting);
	return clonePersistedValue(setting) as Setting;
}

export function toPersistedCategory(category: Category): PersistedCategory {
	assertNoLegacyPersistedFields(category);
	const jsonCategory = toJsonSafeValue(category);
	if (!jsonCategory || Array.isArray(jsonCategory) || typeof jsonCategory !== "object") {
		throw new TypeError("Category must serialize to an object.");
	}
	return {
		...jsonCategory,
		settings: category.settings.map(toPersistedSetting),
	} as PersistedCategory;
}

export function fromPersistedCategory(category: PersistedCategory): Category {
	assertNoLegacyPersistedFields(category);
	return {
		...clonePersistedValue(category),
		settings: category.settings.map(fromPersistedSetting),
	} as Category;
}

export async function convertToExportSetting(
	thisSetting: Setting,
	createFileFunction: (fileName: string, fileData: string) => Promise<void>,
): Promise<PersistedSetting> {
	const persistedSetting = toPersistedSetting(thisSetting);
	const persistedRecord = persistedSetting as unknown as Record<string, unknown>;

	for (const thisProperty of getSettingExportFields(thisSetting.type)) {
		if ((thisProperty.includes("_css") || thisProperty.includes("_function")) && !(thisProperty in persistedRecord)) {
			persistedRecord[thisProperty] = "";
		}
	}

	for (const thisKey of Object.keys(persistedRecord)) {
		for (const [styleshiftType, convertedType] of Object.entries(typeConvertTable)) {
			if (!thisKey.endsWith(styleshiftType)) continue;
			const value = persistedRecord[thisKey];
			if (typeof value !== "string") {
				throw new TypeError(`Persisted executable field "${thisKey}" must be a source string.`);
			}
			await createFileFunction(`${thisKey}.${convertedType}`, value);
			delete persistedRecord[thisKey];
		}
	}

	return persistedSetting;
}
