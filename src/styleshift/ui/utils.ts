/**
 * Resolves a potentially relative asset path to a full chrome-extension:// URL.
 * If the path is already a full URL or a data URL, it returns it as-is.
 */
export function getAssetUrl(path: string): string {
	if (!path) return "";
	if (path.includes("://") || path.startsWith("data:")) return path;

	// Remove leading slash if present
	let cleanPath = path.startsWith("/") ? path.slice(1) : path;

	// Redirect old paths to new structure for organization
	if (cleanPath.startsWith("icon/")) {
		cleanPath = cleanPath.replace("icon/", "assets/branding/");
	}

	return chrome.runtime.getURL(cleanPath);
}
