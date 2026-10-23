import { type CategoryNameWithIcon } from "@settings/types/styleshiftTypes";

/**
 * Resolves a potentially relative asset path to a full chrome-extension:// URL.
 * If the path is already a full URL or a data URL, it returns it as-is.
 */
export function getAssetUrl(path: string): string {
	if (!path) return "";
	if (path.includes("://") || path.startsWith("data:")) return path;

	let cleanPath = path.startsWith("/") ? path.slice(1) : path;

	const shortcuts: Record<string, string> = {
		"icon/": "assets/branding/",
		"128.png": "assets/branding/128.png",
	};

	for (const [prefix, replacement] of Object.entries(shortcuts)) {
		if (cleanPath === prefix || cleanPath.startsWith(prefix)) {
			return chrome.runtime.getURL(cleanPath.replace(prefix, replacement));
		}
	}

	const rootDirectories = ["assets/", "modules/", "types/", "setting/"];
	const isRootPath = rootDirectories.some((dir) => cleanPath.startsWith(dir));

	if (!isRootPath) {
		cleanPath = "assets/" + cleanPath;
	}

	return chrome.runtime.getURL(cleanPath);
}

/**
 * Parses a category string or object into its icon and text components.
 */
export function getCategoryParts(category: string | CategoryNameWithIcon) {
	if (!category) {
		return { icon: "", text: "" };
	}

	if (typeof category === "object") {
		return {
			icon: category.icon || "",
			text: category.label || "",
		};
	}

	// Older categories store the icon as a leading emoji.
	const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji})/u;
	const match = String(category).match(emojiRegex);
	if (match) {
		const icon = match[0];
		const text = String(category).slice(icon.length).trim();
		return { icon, text };
	}

	return { icon: "", text: String(category) };
}
