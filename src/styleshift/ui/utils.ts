/**
 * Resolves a potentially relative asset path to a full chrome-extension:// URL.
 * If the path is already a full URL or a data URL, it returns it as-is.
 */
export function getAssetUrl(path: string): string {
	if (!path) return "";
	if (path.includes("://") || path.startsWith("data:")) return path;

	// Remove leading slash if present
	let cleanPath = path.startsWith("/") ? path.slice(1) : path;

	// Mapping for specific shortcuts
	const shortcuts: Record<string, string> = {
		"icon/": "assets/branding/",
	};

	for (const [prefix, replacement] of Object.entries(shortcuts)) {
		if (cleanPath.startsWith(prefix)) {
			return chrome.runtime.getURL(cleanPath.replace(prefix, replacement));
		}
	}

	// Automatically prefix with 'assets/' if not already prefixed with a known root directory
	const rootDirectories = ["assets/", "modules/", "types/", "setting/"];
	const isRootPath = rootDirectories.some((dir) => cleanPath.startsWith(dir));

	if (!isRootPath) {
		cleanPath = "assets/" + cleanPath;
	}

	return chrome.runtime.getURL(cleanPath);
}
