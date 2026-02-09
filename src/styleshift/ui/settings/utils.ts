/**
 * Global mappings for alignment properties to ensure consistency across components.
 */

export const TEXT_ALIGN_MAP = {
	left: "start",
	center: "center",
	right: "end",
} as const;

export const FLEX_ALIGN_MAP = {
	left: "flex-start",
	center: "center",
	right: "flex-end",
} as const;

export const JUSTIFY_CONTENT_MAP = {
	left: "flex-start",
	center: "center",
	right: "flex-end",
} as const;

/**
 * Maps internal alignment names to standard CSS text-align values.
 */
export function get_text_align(align: string = "center"): "start" | "center" | "end" {
	return TEXT_ALIGN_MAP[align] || "left";
}

/**
 * Maps internal alignment names to CSS flexbox align-items values.
 */
export function get_flex_align(align: string = "center"): "flex-start" | "center" | "flex-end" {
	return FLEX_ALIGN_MAP[align] || "flex-start";
}

/**
 * Maps internal alignment names to CSS flexbox justify-content values.
 */
export function get_justify_content(align: string = "center"): "flex-start" | "center" | "flex-end" {
	return JUSTIFY_CONTENT_MAP[align] || "left";
}
