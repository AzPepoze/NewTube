export const CATEGORY_PALETTE = [
	"#ff6d6d", // Red
	"#a7f2ff", // Cyan
	"#ffa7f8", // Pink
	"#bca7ff", // Purple
	"#fff1a7", // Yellow
	"#a7ffb5", // Green
	"#ffc4a7", // Orange
	"#a7d1ff", // Blue
];

/**
 * Generates a consistent color for a given string.
 * This is self-contained to avoid circular dependencies and work in all contexts.
 */
export function stringToColor(str: string): string {
	if (str.toUpperCase() === "STORAGE") {
		return "color: #ffca28; font-weight: bold;";
	}

	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % CATEGORY_PALETTE.length;
	return `color: ${CATEGORY_PALETTE[index]}; font-weight: bold; text-shadow: 1px 1px 1px rgba(0,0,0,0.2);`;
}
