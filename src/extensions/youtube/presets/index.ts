import type { Theme } from "@core/theme/manager";
import { currentLookSettings } from "../defaultSettings";
import { normalYoutubeSettings } from "./normalYoutube";

type PresetOverrides = Record<string, string | number | boolean>;

/** Each preset is a full settings map, so applying one replaces every visual setting. */
function createPreset(slug: string, name: string, overrides: PresetOverrides): Theme {
	return {
		themeId: `preset-${slug}`,
		themeName: name,
		currentSettings: { ...currentLookSettings, ...overrides } as Theme["currentSettings"],
	};
}

/** Solid background settings, shared by most presets. */
function solidBackground(color: string): PresetOverrides {
	return {
		EnableBackground: true,
		BackgroundMode: "Solid",
		BackgroundTintColor: color,
	};
}

export const PRESET_THEMES: Theme[] = [
	createPreset("normal-youtube", "Normal YouTube", normalYoutubeSettings),
	createPreset("glass", "I'm using :D", {}),
	createPreset("clean-dark", "Clean Dark", {
		...solidBackground("#0f0f0fff"),
		MainThemeColor: "#3ea6ffff",
		ThemeAccentColor: "#3ea6ff66",
		GlobalBorderColor: "#3ea6ff66",
		GlobalCornerRadius: 12,
		TopbarBackgroundColor: "#0f0f0fe6",
		LinkTextColor: "#3ea6ffff",
	}),
	createPreset("minimal-focus", "Minimal Focus", {
		...solidBackground("#121212ff"),
		MainThemeColor: "#e0e0e0ff",
		ThemeAccentColor: "#e0e0e033",
		GlobalBorderColor: "#e0e0e033",
		GlobalCornerRadius: 6,
		EnableUICleanup: true,
		EnableCenteredControls: true,
		EnableFloatSidebar: false,
		EnableShadowsOutlines: false,
		EnableTopbarTransparency: false,
		EnableAnimationsTransitions: false,
		AnimationsGlobal: false,
		ThumbnailHoverOverlayEnabled: false,
		ThumbnailLoadAnimationEnabled: false,
		ThumbnailSlideOnHoverAnimation: false,
		HideShortsEverywhere: true,
		HideSidebarExplore: true,
		HideSidebarMoreFromYouTube: true,
	}),
	createPreset("anime-neon", "Anime Neon", {
		...solidBackground("#14082eff"),
		MainThemeColor: "#ff6ec7ff",
		ThemeAccentColor: "#ff6ec766",
		GlobalBorderColor: "#ff6ec7aa",
		GlobalHoverBackgroundColor: "#ff6ec733",
		LinkTextColor: "#7afcffff",
		ThumbnailHoverBorderColor: "#7afcffff",
		ThumbnailLiveBadgeBackgroundColor: "#ff6ec7ff",
		TimelineLoadedColor: "#ff6ec7ff",
		TopbarBackgroundColor: "#14082e99",
		GlobalCornerRadius: 16,
		VideoPlayerCornerRadius: 16,
		EnableBorderRadius: true,
		EnableShadowsOutlines: true,
		EnableTopbarTransparency: true,
		EnableTopbarBorder: true,
	}),
	createPreset("pastel-cute", "Pastel Cute", {
		...solidBackground("#fff0f7ff"),
		MainThemeColor: "#f7a8d6ff",
		ThemeAccentColor: "#c3b1ff66",
		GlobalBorderColor: "#f7a8d6aa",
		GlobalHoverBackgroundColor: "#ffd6ec80",
		LinkTextColor: "#9b8cffff",
		PrimaryTextColor: "#5a3b58ff",
		SecondaryTextColor: "#8a6d88ff",
		ChannelNameColor: "#5a3b58ff",
		ControlPanelTextColor: "#5a3b58ff",
		ControlPanelBackgroundColor: "#fff0f7cc",
		TopbarBackgroundColor: "#fff0f7e6",
		ChipsBarBackgroundColor: "#fff0f7cc",
		ThumbnailHoverBorderColor: "#f7a8d6ff",
		ThumbnailLiveBadgeBackgroundColor: "#f7a8d6ff",
		ThumbnailLiveBadgeTextColor: "#ffffffff",
		TimelineLoadedColor: "#f7a8d6ff",
		GlobalCornerRadius: 18,
		VideoPlayerCornerRadius: 18,
		EnableTopbarTransparency: true,
	}),
	createPreset("lavender-dream", "Lavender Dream", {
		...solidBackground("#f3efffff"),
		MainThemeColor: "#b197fcff",
		ThemeAccentColor: "#b197fc66",
		GlobalBorderColor: "#b197fcaa",
		GlobalHoverBackgroundColor: "#d0bfff80",
		LinkTextColor: "#7950f2ff",
		PrimaryTextColor: "#3b2a66ff",
		SecondaryTextColor: "#6e5d99ff",
		ChannelNameColor: "#3b2a66ff",
		ControlPanelTextColor: "#3b2a66ff",
		TopbarBackgroundColor: "#f3efffe6",
		GlobalCornerRadius: 16,
		VideoPlayerCornerRadius: 16,
	}),
	createPreset("sakura", "Sakura", {
		...solidBackground("#2a1520ff"),
		MainThemeColor: "#ff9ec7ff",
		ThemeAccentColor: "#ff9ec766",
		GlobalBorderColor: "#ff9ec7aa",
		LinkTextColor: "#ffc2dcff",
		GlobalCornerRadius: 14,
	}),
	createPreset("midnight-neon", "Midnight Neon", {
		...solidBackground("#05060fff"),
		MainThemeColor: "#00e5ffff",
		ThemeAccentColor: "#00e5ff55",
		GlobalBorderColor: "#00e5ffaa",
		LinkTextColor: "#b388ffff",
		ThumbnailHoverBorderColor: "#00e5ffff",
		TimelineLoadedColor: "#00e5ffff",
	}),
	createPreset("ocean", "Ocean", {
		...solidBackground("#06202eff"),
		MainThemeColor: "#4fd1c5ff",
		ThemeAccentColor: "#4fd1c566",
		GlobalBorderColor: "#4fd1c5aa",
		LinkTextColor: "#63b3edff",
	}),
	createPreset("forest", "Forest", {
		...solidBackground("#10231aff"),
		MainThemeColor: "#7bd389ff",
		ThemeAccentColor: "#7bd38966",
		GlobalBorderColor: "#7bd389aa",
		LinkTextColor: "#a7f3a1ff",
	}),
	createPreset("sunset", "Sunset", {
		...solidBackground("#2a1220ff"),
		MainThemeColor: "#ff8a4cff",
		ThemeAccentColor: "#ff8a4c66",
		GlobalBorderColor: "#ff8a4caa",
		LinkTextColor: "#ffc857ff",
	}),
	createPreset("paper-light", "Paper Light", {
		...solidBackground("#f5f5f0ff"),
		EnableAppLightTheme: true,
		MainThemeColor: "#3d3d3dff",
		ThemeAccentColor: "#3d3d3d33",
		GlobalBorderColor: "#3d3d3d55",
		PrimaryTextColor: "#1a1a1aff",
		SecondaryTextColor: "#5c5c5cff",
		ChannelNameColor: "#1a1a1aff",
		TopbarBackgroundColor: "#f5f5f0e6",
		GlobalCornerRadius: 8,
		EnableShadowsOutlines: false,
	}),
];

/** Adds the bundled presets missing from the saved list. The user's own themes stay first. */
export function mergeBundledPresets(savedThemes: unknown): Theme[] {
	const themes: Theme[] = Array.isArray(savedThemes) ? savedThemes : [];
	const savedIds = new Set(themes.map((theme) => theme.themeId));
	return [...themes, ...PRESET_THEMES.filter((preset) => !savedIds.has(preset.themeId))];
}

/** Bump when the bundled preset data changes, so existing installs refresh their saved copies. */
export const BUNDLED_PRESETS_VERSION = 1;

/**
 * Replaces the saved copies of bundled presets with the current data.
 * User themes and presets the user deleted stay untouched.
 */
export function refreshBundledPresetList(savedThemes: unknown): Theme[] {
	const themes: Theme[] = Array.isArray(savedThemes) ? savedThemes : [];
	const presets = new Map(PRESET_THEMES.map((preset) => [preset.themeId, preset]));
	return themes.map((theme) => presets.get(theme.themeId) ?? theme);
}
