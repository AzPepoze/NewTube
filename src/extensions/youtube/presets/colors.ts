interface PresetPalette {
	accent: string;
	surface: string;
	text?: string;
	secondaryText?: string;
	link?: string;
	detail?: string;
	controls?: string;
}

/** Complete preset colors from opaque six-digit palette colors, before per-theme overrides. */
export function presetColors({
	accent,
	surface,
	text = "#ffffff",
	secondaryText = "#c4c4c4",
	link = accent,
	detail = accent,
	controls = accent,
}: PresetPalette) {
	return {
		BackgroundTintColor: `${surface}ff`,
		ChannelNameColor: `${text}ff`,
		ChipsBarBackgroundColor: `${surface}e6`,
		ControlPanelBackgroundColor: `${surface}e6`,
		ControlPanelButtonGroupColor: `${accent}20`,
		ControlPanelButtonHoverColor: `${accent}33`,
		ControlPanelPopupBackgroundColor: `${surface}ff`,
		ControlPanelTextColor: `${controls}ff`,
		EndScreenOverlayColor: `${surface}e6`,
		EndScreenVideoHoverColor: `${accent}33`,
		GlobalBorderColor: `${detail}80`,
		GlobalClickBorderColor: `${text}ff`,
		GlobalHoverBackgroundColor: `${accent}26`,
		GlobalHoverBorderColor: `${detail}ff`,
		LinkTextColor: `${link}ff`,
		MainThemeColor: `${accent}ff`,
		PlaylistHoverBackgroundColor: `${accent}26`,
		PrimaryTextColor: `${text}ff`,
		ScrollbarTrackColor: `${surface}00`,
		SearchSuggestionHoverColor: `${accent}26`,
		SecondaryTextColor: `${secondaryText}ff`,
		SidebarBackgroundColor: `${surface}00`,
		SubtitleBackgroundColor: "#00000000",
		SubtitleShadowColor: "#000000ff",
		SubtitleTextColor: "#ffffffff",
		ThemeAccentColor: `${detail}66`,
		ThemeOverlayColor: `${accent}20`,
		ThemeShadowColor: `${detail}80`,
		ThumbnailClickBorderColor: `${text}ff`,
		ThumbnailHoverBorderColor: `${detail}ff`,
		ThumbnailLiveBadgeBackgroundColor: `${accent}ff`,
		ThumbnailLiveBadgeTextColor: `${surface}ff`,
		ThumbnailTimeBackgroundColor: "#000000cc",
		TimelineBackgroundColor: `${text}20`,
		TimelineLoadedColor: `${accent}80`,
		TimestampTextColor: "#ffffffff",
		TopLeftIconPlayTriangleColor: `${accent}ff`,
		TopbarBackgroundColor: `${surface}e6`,
		TransparentThemeColor: `${accent}33`,
	};
}
