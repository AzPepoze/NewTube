/**
 * Resolves a potentially relative asset path to a full chrome-extension:// URL.
 * If the path is already a full URL or a data URL, it returns it as-is.
 */
export function getAssetUrl(path: string): string {
    if (!path) return "";
    if (path.includes("://") || path.startsWith("data:")) return path;
    
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return chrome.runtime.getURL(cleanPath);
}
