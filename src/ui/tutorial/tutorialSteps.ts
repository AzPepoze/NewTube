import type { ShortcutCommand } from "./tutorialShortcuts";

export type TutorialTier = "core" | "optional";

export const PANEL_CATEGORY = {
	quickPalette: "Quick Palette",
	customElements: "Custom Elements",
	importExport: "Import / Export Theme",
	extensionSettings: "Extension's settings",
} as const;

export interface TutorialChoice {
	/** Label of the button that continues into the branched content. */
	acceptLabel: string;
	/** Label of the button that skips the branched content. */
	declineLabel: string;
	/**
	 * Step id to jump to when the user declines. When omitted, declining ends
	 * the tutorial with a celebration instead.
	 */
	declineToId?: string;
}

export interface KeyHint {
	command: ShortcutCommand;
	label: string;
}

/** Small diagram shown under the step text instead of a paragraph. */
export type TutorialVisual =
	{ kind: "keys"; items: KeyHint[] } | { kind: "flow"; items: string[] } | { kind: "layout" };

export interface TutorialStep {
	id: string;
	tier: TutorialTier;
	title: string;
	accent: string;
	body: string;
	bullets: string[];
	visual?: TutorialVisual;
	shortcut?: KeyHint;
	panelCategory?: string;
	actionLabel?: string;
	targetSelector?: string;
	spotlight?: boolean;
	requiresDeveloperMode?: boolean;
	choice?: TutorialChoice;
	show?: {
		panelCategory?: string;
		themeTab?: "installed" | "store";
		docs?: boolean;
	};
	secondaryShow?: {
		label: string;
		themeTab?: "installed" | "store";
	};
	try?: "quickCustomize" | "customize" | "themeManager";
}

export function requiresSettingsPanel(step: TutorialStep): boolean {
	return step.panelCategory !== undefined || step.show?.panelCategory !== undefined;
}

export function hasSpotlight(step: TutorialStep): boolean {
	return step.spotlight !== false && step.targetSelector !== undefined;
}

export function needsDeveloperMode(step: TutorialStep): boolean {
	return step.requiresDeveloperMode === true;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
	{
		id: "open-panel",
		tier: "core",
		title: "Open the panel",
		accent: "#7f5db7",
		body: "Click the ✦ button at the top-right of YouTube.",
		bullets: [],
		visual: { kind: "keys", items: [{ command: "toggle_settings", label: "Also opens it" }] },
		targetSelector: "#NEWTUBESET",
		show: {},
		actionLabel: "Open the panel",
	},
	{
		id: "panel-tour",
		tier: "core",
		title: "Your settings panel",
		accent: "#38bdf8",
		body: "Pick a section on the left. Change its settings on the right.",
		bullets: [],
		visual: { kind: "layout" },
		targetSelector: ".styleshift-settings-main",
		panelCategory: PANEL_CATEGORY.quickPalette,
	},
	{
		id: "panel-search",
		tier: "core",
		title: "Search",
		accent: "#fb923c",
		body: "Click the box and type to filter every setting.",
		bullets: [],
		targetSelector: ".styleshift-search-wrapper",
		panelCategory: PANEL_CATEGORY.quickPalette,
	},
	{
		id: "customize-element",
		tier: "core",
		title: "Customize Elements",
		accent: "#3eadad",
		body: "Hover the page, click a part, then edit it.",
		bullets: [],
		shortcut: { command: "toggle_customize", label: "Turn it on or off" },
		visual: { kind: "flow", items: ["Hover", "Click", "Edit"] },
		targetSelector: "#StyleShiftToggleCustomize",
		panelCategory: PANEL_CATEGORY.quickPalette,
		show: {
			panelCategory: PANEL_CATEGORY.quickPalette,
		},
		try: "customize",
		actionLabel: "Show Quick Palette",
	},
	{
		id: "quick-customize",
		tier: "core",
		title: "Quick Customize",
		accent: "#e45eff",
		body: "Click an element, style it, then save.",
		bullets: ["Saves appear under Custom Elements"],
		visual: { kind: "flow", items: ["Click", "Style", "Save"] },
		targetSelector: "#StyleShiftQuickCustomize",
		panelCategory: PANEL_CATEGORY.quickPalette,
		show: {
			panelCategory: PANEL_CATEGORY.quickPalette,
		},
		try: "quickCustomize",
		actionLabel: "Show Quick Palette",
	},
	{
		id: "themes-store",
		tier: "core",
		title: "Themes and the store",
		accent: "#ff6d6d",
		body: "Get a theme from the store, then save it to your collection.",
		bullets: ["Share Your Theme uploads yours"],
		visual: { kind: "flow", items: ["Store", "Get", "Save"] },
		targetSelector: "#OpenThemeManagerButton",
		panelCategory: PANEL_CATEGORY.quickPalette,
		show: {
			panelCategory: PANEL_CATEGORY.quickPalette,
		},
		try: "themeManager",
		actionLabel: "Show Themes",
	},
	{
		id: "save-export",
		tier: "core",
		title: "Auto-save, export and import",
		accent: "#1932ff",
		body: "Settings save as you change them. No Save button needed.",
		bullets: ["Export copies your setup", "Import loads one back in"],
		targetSelector: "#ImportDataButton",
		panelCategory: PANEL_CATEGORY.importExport,
		show: {
			panelCategory: PANEL_CATEGORY.importExport,
		},
		actionLabel: "Show Import / Export",
	},
	{
		id: "keyboard-shortcuts",
		tier: "core",
		title: "Keyboard shortcuts",
		accent: "#4caf50",
		body: "Four keys do the main work.",
		bullets: ["Change them in your browser's extension shortcut settings"],
		visual: {
			kind: "keys",
			items: [
				{ command: "toggle_enable", label: "Toggle StyleShift" },
				{ command: "toggle_settings", label: "Open panel" },
				{ command: "toggle_customize", label: "Customize" },
				{ command: "toggle_dev_mode", label: "Developer Mode" },
			],
		},
		targetSelector: "#KeyboardShortcuts",
		panelCategory: PANEL_CATEGORY.extensionSettings,
		show: {
			panelCategory: PANEL_CATEGORY.extensionSettings,
		},
		actionLabel: "Show Extension's settings",
	},
	{
		id: "dev-bridge",
		tier: "core",
		title: "Explore Developer Mode?",
		accent: "#8b7cf6",
		body: "Build your own settings, styles and exports.",
		bullets: [],
		panelCategory: PANEL_CATEGORY.extensionSettings,
		spotlight: false,
		choice: {
			acceptLabel: "Go deeper",
			declineLabel: "Not now",
		},
	},
	{
		id: "developer-mode",
		tier: "core",
		title: "Developer Mode",
		accent: "#ffb020",
		body: "Turn it on to unlock the +, pencil and trash icons.",
		bullets: [],
		shortcut: { command: "toggle_dev_mode", label: "Flip it anytime" },
		targetSelector: "#developerMode",
		panelCategory: PANEL_CATEGORY.extensionSettings,
		show: {
			panelCategory: PANEL_CATEGORY.extensionSettings,
		},
		actionLabel: "Show Extension's settings",
		requiresDeveloperMode: true,
	},
	{
		id: "dev-add-category",
		tier: "core",
		title: "Add a category",
		accent: "#22d3ee",
		body: "Click + in the sidebar. It lands under ADD-ON.",
		bullets: ["You can reorder or remove it"],
		targetSelector: ".styleshift-add-category-button",
		panelCategory: PANEL_CATEGORY.quickPalette,
		show: {
			panelCategory: PANEL_CATEGORY.quickPalette,
		},
		actionLabel: "Show sidebar button",
		requiresDeveloperMode: true,
	},
	{
		id: "dev-add-setting",
		tier: "core",
		title: "Add a setting",
		accent: "#2dd4bf",
		body: "Inside ADD-ON, click + and pick a kind.",
		bullets: ["Pencil edits, trash deletes"],
		targetSelector: ".styleshift-add-setting-button-wrapper",
		panelCategory: PANEL_CATEGORY.quickPalette,
		show: {
			panelCategory: PANEL_CATEGORY.quickPalette,
		},
		actionLabel: "Show setting button",
		requiresDeveloperMode: true,
	},
	{
		id: "dev-code-zip",
		tier: "core",
		title: "Code it and pack it",
		accent: "#f43f5e",
		body: "Write CSS and JS with a config.json, then export.",
		bullets: ["Scope: Built-in, Add-ons or Both", "Output: Clipboard or ZIP"],
		visual: { kind: "flow", items: ["Code", "Export", "ZIP"] },
		targetSelector: "#ExportDataButton",
		panelCategory: PANEL_CATEGORY.importExport,
		show: {
			docs: true,
		},
		actionLabel: "Open API Reference",
	},
];
