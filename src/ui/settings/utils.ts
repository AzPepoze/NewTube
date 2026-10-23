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

export function getTextAlign(align: string = "center"): "start" | "center" | "end" {
	return TEXT_ALIGN_MAP[align] || "left";
}

export function getFlexAlign(align: string = "center"): "flex-start" | "center" | "flex-end" {
	return FLEX_ALIGN_MAP[align] || "flex-start";
}

export function getJustifyContent(align: string = "center"): "flex-start" | "center" | "flex-end" {
	return JUSTIFY_CONTENT_MAP[align] || "left";
}
