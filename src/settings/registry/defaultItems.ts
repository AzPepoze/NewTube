import {
	SettingType,
	type Category,
	type Setting,
	type SettingByType,
	type SettingField,
	type SettingKind,
} from "@settings/types/styleshiftTypes";

export type SettingDefinition<T extends SettingKind> = {
	createDefault: () => SettingByType<T>;
	exportFields: readonly SettingField<T>[];
};

type SettingDefinitionRegistry = {
	[T in SettingKind]: SettingDefinition<T>;
};

export const settingDefinitions = {
	[SettingType.Text]: {
		createDefault: () => ({
			type: SettingType.Text,
			id: "Test_text",
			html: "Test text",
			align: "left",
			fontSize: 14,
		}),
		exportFields: ["type", "id", "html", "align", "color", "fontSize", "editable"],
	},
	[SettingType.SubText]: {
		createDefault: () => ({
			type: SettingType.SubText,
			id: "Test_Sub_title",
			text: "Test Setting Sub title",
			align: "left",
			color: "#ffffff",
			fontSize: 14,
		}),
		exportFields: ["type", "id", "text", "align", "color", "fontSize", "editable"],
	},
	[SettingType.Button]: {
		createDefault: () => ({
			type: SettingType.Button,
			id: "Test_button",
			name: "button",
			description: "",
			icon: "",
			align: "center",
			color: "#00FF99",
			fontSize: 15,
		}),
		exportFields: [
			"type",
			"id",
			"name",
			"description",
			"icon",
			"iconSize",
			"iconScale",
			"align",
			"color",
			"fontSize",
			"clickFunction",
			"editable",
		],
	},
	[SettingType.Checkbox]: {
		createDefault: () => ({
			type: SettingType.Checkbox,
			id: "Test_checkbox",
			name: "Some checkbox",
			description: "",
			value: false,
		}),
		exportFields: [
			"type",
			"id",
			"name",
			"description",
			"value",
			"constantCss",
			"setupFunction",
			"updateFunction",
			"enableCss",
			"enableFunction",
			"disableCss",
			"disableFunction",
			"editable",
		],
	},
	[SettingType.NumberSlide]: {
		createDefault: () => ({
			type: SettingType.NumberSlide,
			id: "Test_number_slide",
			name: "Just Number Slide",
			description: "",
			min: 0,
			max: 100,
			step: 1,
			value: 50,
		}),
		exportFields: [
			"type",
			"id",
			"name",
			"description",
			"min",
			"max",
			"step",
			"value",
			"unit",
			"varCss",
			"setupFunction",
			"constantCss",
			"updateFunction",
			"editable",
		],
	},
	[SettingType.Dropdown]: {
		createDefault: () => ({
			type: SettingType.Dropdown,
			id: "Test_dropdown",
			name: "Just dropdown",
			description: "",
			value: "Item_1",
			options: [
				{ label: "Item 1", value: "Item_1" },
				{ label: "Item 2", value: "Item_2" },
				{ label: "Item 3", value: "Item_3" },
			],
		}),
		exportFields: [
			"type",
			"id",
			"name",
			"description",
			"value",
			"constantCss",
			"setupFunction",
			"updateFunction",
			"options",
			"editable",
		],
	},
	[SettingType.Color]: {
		createDefault: () => ({
			type: SettingType.Color,
			id: "Test_color",
			name: "Just color Selector",
			description: "",
			showAlphaSlider: true,
			value: "#FF0000FF",
		}),
		exportFields: [
			"type",
			"id",
			"name",
			"description",
			"showAlphaSlider",
			"value",
			"varCss",
			"setupFunction",
			"constantCss",
			"updateFunction",
			"editable",
		],
	},
	[SettingType.TextInput]: {
		createDefault: () => ({
			type: SettingType.TextInput,
			id: "Test_text_input",
			name: "Text input",
			description: "",
			value: "",
		}),
		exportFields: ["type", "id", "name", "description", "value", "updateFunction", "editable"],
	},
	[SettingType.ImageInput]: {
		createDefault: () => ({
			type: SettingType.ImageInput,
			id: "Test_image_input",
			name: "Just image Input",
			description: "",
			value: "",
			maxFileSize: 1_000_000,
		}),
		exportFields: ["type", "id", "name", "description", "value", "maxFileSize", "editable"],
	},
	[SettingType.PreviewImage]: {
		createDefault: () => ({ type: SettingType.PreviewImage, id: "Test_preview_image" }),
		exportFields: ["type", "id", "title", "preset", "settingIds", "editable"],
	},
	[SettingType.Custom]: {
		createDefault: () => ({
			type: SettingType.Custom,
			id: "Test_Custom",
			setupFunction: "",
			constantCss: "",
			uiFunction: "",
		}),
		exportFields: [
			"type",
			"id",
			"name",
			"description",
			"value",
			"constantCss",
			"setupFunction",
			"uiFunction",
			"transparent",
			"editable",
		],
	},
	[SettingType.CombineSetting]: {
		createDefault: () => ({
			type: SettingType.CombineSetting,
			id: "Test_combine_setting",
			name: "Combined settings",
			description: "",
			settingIds: [],
		}),
		exportFields: ["type", "id", "name", "description", "settingIds", "updateFunction", "editable"],
	},
	[SettingType.ConditionSetting]: {
		createDefault: () => ({
			type: SettingType.ConditionSetting,
			id: "Test_condition_setting",
			name: "Conditional setting",
			description: "",
			condition: {},
		}),
		exportFields: [
			"type",
			"id",
			"name",
			"description",
			"condition",
			"enableCss",
			"disableCss",
			"enableFunction",
			"disableFunction",
			"editable",
		],
	},
	[SettingType.KeyboardShortcuts]: {
		createDefault: () => ({
			type: SettingType.KeyboardShortcuts,
			id: "Test_keyboard_shortcuts",
			name: "Keyboard shortcuts",
			description: "",
		}),
		exportFields: ["type", "id", "name", "description", "editable"],
	},
	[SettingType.Group]: {
		createDefault: () => ({ type: SettingType.Group, id: "Test_group", text: "Setting group" }),
		exportFields: ["type", "id", "text", "leftSeparator", "editable"],
	},
	[SettingType.SelectorInput]: {
		createDefault: () => ({
			type: SettingType.SelectorInput,
			id: "Test_selector_input",
			name: "Selector",
			description: "",
			value: "",
		}),
		exportFields: ["type", "id", "name", "description", "value", "updateFunction", "editable"],
	},
} satisfies SettingDefinitionRegistry;

export function isSettingKind(value: string): value is SettingKind {
	return Object.hasOwn(settingDefinitions, value);
}

export function createSettingPreset<T extends SettingKind>(type: T): SettingByType<T> {
	return settingDefinitions[type].createDefault() as SettingByType<T>;
}

export function getSettingExportFields<T extends SettingKind>(type: T): readonly SettingField<T>[] {
	return settingDefinitions[type].exportFields as unknown as readonly SettingField<T>[];
}

export function createAllSettingPresets(): readonly Setting[] {
	return Object.values(settingDefinitions).map((definition) => definition.createDefault());
}

export const styleshiftCategoryList: Category = { category: "Category", selector: "", rainbow: false, settings: [] };

export const typeConvertTable = {
	Function: "js",
	Css: "css",
} as const;
