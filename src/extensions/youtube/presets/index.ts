import type { Theme } from "@core/theme/manager";
import { currentLookSettings } from "../defaultSettings";
import { presetColors } from "./colors";
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

function solidBackground(): PresetOverrides {
	return { EnableBackground: true, BackgroundMode: "Solid" };
}

export const PRESET_THEMES: Theme[] = [
	createPreset("normal-youtube", "Normal YouTube", normalYoutubeSettings),
	createPreset("glass", "I'm using :D", {
		...presetColors({ accent: "#9c80ea", surface: "#000000", link: "#a270ff" }),
		BackgroundTintColor: currentLookSettings.BackgroundTintColor,
		TopbarBackgroundColor: currentLookSettings.TopbarBackgroundColor,
	}),
	createPreset("clean-dark", "Clean Dark", {
		...solidBackground(),
		...presetColors({ accent: "#3ea6ff", surface: "#0f0f0f" }),
		GlobalCornerRadius: 12,
	}),
	createPreset("minimal-focus", "Minimal Focus", {
		...solidBackground(),
		...presetColors({ accent: "#e0e0e0", surface: "#121212" }),
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
		...solidBackground(),
		...presetColors({ accent: "#ff6ec7", surface: "#14082e", link: "#7afcff", detail: "#7afcff" }),
		GlobalCornerRadius: 16,
		VideoPlayerCornerRadius: 16,
		EnableBorderRadius: true,
		EnableShadowsOutlines: true,
		EnableTopbarTransparency: true,
		EnableTopbarBorder: true,
	}),
	createPreset("pastel-cute", "Pastel Cute", {
		...solidBackground(),
		...presetColors({
			accent: "#a83d7b",
			surface: "#fff0f7",
			text: "#5a3b58",
			secondaryText: "#795976",
			link: "#7950b3",
			detail: "#c3b1ff",
			controls: "#5a3b58",
		}),
		GlobalCornerRadius: 18,
		VideoPlayerCornerRadius: 18,
		EnableTopbarTransparency: true,
	}),
	createPreset("lavender-dream", "Lavender Dream", {
		...solidBackground(),
		...presetColors({
			accent: "#7950c7",
			surface: "#f3efff",
			text: "#3b2a66",
			secondaryText: "#6e5d99",
			link: "#7043df",
			detail: "#b197fc",
			controls: "#3b2a66",
		}),
		GlobalCornerRadius: 16,
		VideoPlayerCornerRadius: 16,
	}),
	createPreset("sakura", "Sakura", {
		...solidBackground(),
		...presetColors({ accent: "#ff9ec7", surface: "#2a1520", link: "#ffc2dc" }),
		GlobalCornerRadius: 14,
	}),
	createPreset("midnight-neon", "Midnight Neon", {
		...solidBackground(),
		...presetColors({ accent: "#00e5ff", surface: "#05060f", link: "#b388ff" }),
	}),
	createPreset("ocean", "Ocean", {
		...solidBackground(),
		...presetColors({ accent: "#4fd1c5", surface: "#06202e", link: "#63b3ed" }),
	}),
	createPreset("forest", "Forest", {
		...solidBackground(),
		...presetColors({ accent: "#7bd389", surface: "#10231a", link: "#a7f3a1" }),
	}),
	createPreset("sunset", "Sunset", {
		...solidBackground(),
		...presetColors({ accent: "#ff8a4c", surface: "#2a1220", link: "#ffc857" }),
	}),
	createPreset("paper-light", "Paper Light", {
		...solidBackground(),
		...presetColors({
			accent: "#3d3d3d",
			surface: "#f5f5f0",
			text: "#1a1a1a",
			secondaryText: "#5c5c5c",
			controls: "#1a1a1a",
		}),
		EnableAppLightTheme: true,
		GlobalCornerRadius: 8,
		EnableShadowsOutlines: false,
	}),
];

export function mergeBundledPresets(savedThemes: unknown): Theme[] {
	const themes: Theme[] = Array.isArray(savedThemes) ? savedThemes : [];
	const savedIds = new Set(themes.map((theme) => theme.themeId));
	return [...themes, ...PRESET_THEMES.filter((preset) => !savedIds.has(preset.themeId))];
}

/**
 * Replaces the saved copies of bundled presets with the current data.
 * User themes and presets the user deleted stay untouched.
 */
export function refreshBundledPresetList(savedThemes: unknown): Theme[] {
	const themes: Theme[] = Array.isArray(savedThemes) ? savedThemes : [];
	const presets = new Map(PRESET_THEMES.map((preset) => [preset.themeId, preset]));
	return themes.map((theme) => presets.get(theme.themeId) ?? theme);
}
