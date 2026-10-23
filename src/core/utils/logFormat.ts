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

/** Keep this dependency-free so page scripts and extension code can share log colors. */
export function categoryToLogStyle(category: string): string {
	if (category.toUpperCase() === "STORAGE") {
		return "color: #ffca28; font-weight: bold;";
	}

	let hash = 0;
	for (let i = 0; i < category.length; i++) {
		hash = category.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % CATEGORY_PALETTE.length;
	return `color: ${CATEGORY_PALETTE[index]}; font-weight: bold; text-shadow: 1px 1px 1px rgba(0,0,0,0.2);`;
}
