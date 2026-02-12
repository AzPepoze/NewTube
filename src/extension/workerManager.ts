/**
 * Worker Manager
 * Manages Web Workers running in the offscreen document
 */

import { logger } from "@/shared/logger";
import { setupOffscreenDocument, closeOffscreenDocument } from "./offscreenManager";

export interface WorkerInfo {
	scriptUrl: string;
	tabId: number;
}

export interface OffscreenMessage {
	target: string;
	command: string;
	workerId?: string;
	scriptUrl?: string;
	message?: any;
	error?: string;
	data?: any;
}

// Store worker info by composite key "tabId:workerId"
const workers = new Map<string, WorkerInfo>();

function getWorkerKey(tabId: number, workerId: string): string {
	return `${tabId}:${workerId}`;
}

/**
 * Create a new worker in the offscreen document
 */
export async function createWorker(tabId: number, workerId: string, scriptUrl: string): Promise<boolean> {
	logger.info("worker", `Creating worker ${workerId} for tab ${tabId} with URL ${scriptUrl}`);
	const key = getWorkerKey(tabId, workerId);

	await setupOffscreenDocument("offscreen.html");

	if (workers.has(key)) {
		logger.info("worker", `Terminating existing worker ${workerId}`);
		chrome.runtime.sendMessage<OffscreenMessage>({
			target: "offscreen",
			command: "terminateWorker",
			workerId: key,
		});
		workers.delete(key);
	}

	try {
		workers.set(key, { scriptUrl, tabId });

		// Wait for offscreen document to be ready
		let attempts = 0;
		let success = false;

		while (attempts < 10 && !success) {
			await new Promise((resolve) => setTimeout(resolve, 50));

			try {
				success = await chrome.runtime.sendMessage<OffscreenMessage, boolean>({
					target: "offscreen",
					command: "createWorker",
					workerId: key,
					scriptUrl: scriptUrl,
				});
			} catch (err) {
				logger.warn("worker", `Attempt ${attempts + 1} failed for ${workerId}: ${err}`);
			}
			attempts++;
		}

		if (success) {
			logger.info(
				"worker",
				`Worker ${workerId} created successfully after ${attempts} attempts. Total workers: ${workers.size}`,
			);
		} else {
			logger.error(
				"worker",
				`Worker ${workerId} creation failed in offscreen document after ${attempts} attempts`,
			);
			workers.delete(key);
		}
		return success;
	} catch (error) {
		logger.error("worker", `Failed to create worker ${workerId}:`, error);
		workers.delete(key);
		return false;
	}
}

/**
 * Post a message to a worker
 */
export function postMessageToWorker(tabId: number, workerId: string, message: any): boolean {
	const key = getWorkerKey(tabId, workerId);
	const worker = workers.get(key);
	if (worker) {
		try {
			logger.debug("worker", `Sending message to offscreen for worker ${key}:`, message);
			chrome.runtime.sendMessage<OffscreenMessage>({
				target: "offscreen",
				command: "postMessage",
				workerId: key,
				message: message,
			});
			return true;
		} catch (error) {
			logger.error("worker", `Failed to post message to worker ${workerId}:`, error);
			return false;
		}
	}
	logger.warn("worker", `Worker ${workerId} not found for tab ${tabId}`);
	return false;
}

/**
 * Terminate a worker
 */
export function terminateWorker(tabId: number, workerId: string): boolean {
	const key = getWorkerKey(tabId, workerId);
	const worker = workers.get(key);
	if (worker) {
		chrome.runtime.sendMessage<OffscreenMessage>({
			target: "offscreen",
			command: "terminateWorker",
			workerId: key,
		});
		workers.delete(key);
		logger.info("worker", `Terminated worker ${workerId} for tab ${tabId}`);

		if (workers.size === 0) {
			closeOffscreenDocument();
		}

		return true;
	}
	return false;
}

/**
 * Clean up all workers for a specific tab
 */
export function cleanupWorkersForTab(tabId: number): void {
	for (const key of workers.keys()) {
		if (key.startsWith(`${tabId}:`)) {
			chrome.runtime.sendMessage<OffscreenMessage>({
				target: "offscreen",
				command: "terminateWorker",
				workerId: key,
			});
			workers.delete(key);
			logger.info("worker", `Cleaned up worker for closed tab ${tabId}`);
		}
	}

	if (workers.size === 0) {
		closeOffscreenDocument();
	}
}

/**
 * Get the number of active workers
 */
export function getWorkerCount(): number {
	return workers.size;
}
