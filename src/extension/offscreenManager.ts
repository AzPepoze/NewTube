/**
 * Offscreen Document Manager
 * Manages the lifecycle of the offscreen document for running Web Workers
 */

import { logger } from "@/shared/logger";

// Type declarations for Service Worker APIs
declare const clients: {
	matchAll(): Promise<Array<{ url: string }>>;
};

let offscreenDocumentPath: string | null = null;
let offscreenDocumentCreating = false;

/**
 * Check if offscreen document already exists
 */
export async function hasOffscreenDocument(): Promise<boolean> {
	if (!offscreenDocumentPath) return false;
	const matchedClients = await clients.matchAll();
	return matchedClients.some((client) => client.url.endsWith(offscreenDocumentPath));
}

/**
 * Create offscreen document if it doesn't exist
 */
export async function setupOffscreenDocument(path: string): Promise<void> {
	if (await hasOffscreenDocument()) {
		return;
	}

	if (offscreenDocumentCreating) {
		while (offscreenDocumentCreating) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		return;
	}

	offscreenDocumentCreating = true;
	offscreenDocumentPath = path;

	try {
		await chrome.offscreen.createDocument({
			url: path,
			reasons: [chrome.offscreen.Reason.WORKERS],
			justification: "Run Web Workers for video processing",
		});
		logger.info("offscreen", "Offscreen document created successfully");
	} catch (error) {
		logger.error("offscreen", "Failed to create offscreen document:", error);
	} finally {
		offscreenDocumentCreating = false;
	}
}

/**
 * Close offscreen document if it exists
 */
export async function closeOffscreenDocument(): Promise<void> {
	if (await hasOffscreenDocument()) {
		await chrome.offscreen.closeDocument();
		logger.info("offscreen", "Offscreen document closed");
	}
}
