type PreviewSettings = Record<string, string | number | boolean | undefined>;

export interface PreviewColors {
	page: string;
	text: string;
	secondaryText: string;
	accent: string;
	topbar: string;
	border: string;
	radius: number;
}

const STOCK_COLORS: PreviewColors = {
	page: "#0f0f0f",
	text: "#ffffff",
	secondaryText: "#aaaaaa",
	accent: "#ff0000",
	topbar: "#0f0f0f",
	border: "#303030",
	radius: 12,
};

const HEX_WITH_ALPHA = /^#([0-9a-f]{6})([0-9a-f]{2})$/i;

/** Turns `#rrggbbaa` into `rgba()`, since the preview is drawn with plain CSS colors. */
export function toCssColor(value: string): string {
	const match = HEX_WITH_ALPHA.exec(value);
	if (!match) return value;
	const [, rgb, alpha] = match;
	const red = parseInt(rgb.slice(0, 2), 16);
	const green = parseInt(rgb.slice(2, 4), 16);
	const blue = parseInt(rgb.slice(4, 6), 16);
	const opacity = (parseInt(alpha, 16) / 255).toFixed(3);
	return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function colorSetting(settings: PreviewSettings, key: string, fallback: string): string {
	const value = settings[key];
	return typeof value === "string" && value !== "" ? toCssColor(value) : fallback;
}

/** Maps a theme's settings to the colors the YouTube preview uses. Missing keys use stock YouTube colors. */
export function getPreviewColors(settings: PreviewSettings = {}): PreviewColors {
	const isSolidBackground = settings.EnableBackground === true && settings.BackgroundMode === "Solid";
	const isLight = settings.EnableAppLightTheme === true;
	const lightDefaults = isLight ? { page: "#ffffff", text: "#0f0f0f", secondaryText: "#606060" } : {};

	const page = isSolidBackground
		? colorSetting(settings, "BackgroundTintColor", STOCK_COLORS.page)
		: (lightDefaults.page ?? STOCK_COLORS.page);

	return {
		page,
		text: colorSetting(settings, "PrimaryTextColor", lightDefaults.text ?? STOCK_COLORS.text),
		secondaryText: colorSetting(
			settings,
			"SecondaryTextColor",
			lightDefaults.secondaryText ?? STOCK_COLORS.secondaryText,
		),
		accent: colorSetting(settings, "MainThemeColor", STOCK_COLORS.accent),
		topbar: colorSetting(settings, "TopbarBackgroundColor", page),
		border: colorSetting(settings, "GlobalBorderColor", STOCK_COLORS.border),
		radius: typeof settings.GlobalCornerRadius === "number" ? settings.GlobalCornerRadius : STOCK_COLORS.radius,
	};
}
