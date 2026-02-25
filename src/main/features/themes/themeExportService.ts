import { copyToClipboard, downloadFile, createNotification, createError } from "@/styleshift/shared/extension";
import { jszipInstance, initializeDeveloperEnvironment } from "@/styleshift/core/runtimeController";
import { logger } from "@/shared/logger";

/**
 * Copies a single theme's data to the clipboard as a JSON string.
 */
export function exportThemeToClipboard(name: string, themeData: any) {
    const jsonText = JSON.stringify(themeData, null, 2);
    copyToClipboard(jsonText);

    createNotification({
        icon: "📋",
        title: "Theme Exported",
        content: `"${name}" copied to clipboard.`,
    });
}

/**
 * Downloads a single theme as a ZIP file.
 */
export async function exportThemeAsZip(name: string, themeData: any) {
    const notification = await createNotification({
        icon: "📦",
        title: "Preparing Export",
        content: "Initializing ZIP generation...",
        timeout: -1,
    });

    try {
        await initializeDeveloperEnvironment();

        if (!jszipInstance) {
            throw new Error("JSZip failed to load.");
        }

        const zip = new (jszipInstance as any)();
        const rootFolder = zip.folder(name.replace(/\/|\n/g, "_"));

        // Map the single theme into categories/settings if we wanted to be compatible with importStyleshiftZip
        // But for a single theme (which is a flat object of settings), we'll just put it in a Config.json 
        // similar to how settings are exported in categories.

        // Actually, to make it compatible with the existing importer, we should wrap it.
        // But the user just wants "the clipboard and the zip". 
        // Usually for individual themes, a flat JSON is enough.

        // Let's create a structure that looks like a single category with settings
        // so it can be re-imported easily if needed, or just a flat config.

        const configJson = JSON.stringify(themeData, null, 2);
        rootFolder.file("ThemeConfig.json", configJson);

        // If we want to export files separately (CSS/JS) like the full export does:
        for (const [key, value] of Object.entries(themeData)) {
            if (typeof value === "string" && (key.endsWith("Css") || key.endsWith("Function") || key.endsWith("Script"))) {
                rootFolder.file(`${key}.js`, value);
            }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadFile(zipBlob, `${name}.zip`);

        notification.setIcon("✅");
        notification.setTitle("Theme Exported");
        notification.setContent(`"${name}.zip" has been downloaded.`);
        setTimeout(() => notification.close(), 3000);

    } catch (error) {
        notification.close();
        logger.error("export", "ZIP Export Failed", error);
        createError(`Failed to export theme as ZIP: ${error instanceof Error ? error.message : String(error)}`);
    }
}
