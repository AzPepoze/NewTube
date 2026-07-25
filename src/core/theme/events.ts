/**
 * Theme Store Integration Event Enum
 * Defines standard custom window event names for communication between the Theme Store and Extension.
 */
export enum ThemeStoreEvent {
	INSTALL = "install_styleshift_theme",
	SAVE = "save_styleshift_theme",
	CHECK_INSTALL = "is_styleshift_theme_installed",
	READY = "styleshift_is_ready",
	INSTALL_STATUS = "styleshift_theme_install_status",
	CHECK_EXTENSION = "check_styleshift_extension",
}
