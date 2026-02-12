/**
 * Offscreen Document Script
 * Runs in a DOM context where Web Workers are available
 */

import { logger } from "@/shared/logger";
import type { OffscreenMessage } from "./workerManager";

// Store workers by their composite key
const workers = new Map<string, Worker>();

function createWorker(workerId: string, scriptUrl: string): boolean {
	logger.info("worker", `Creating worker ${workerId} with URL ${scriptUrl}`);

	if (workers.has(workerId)) {
		logger.info("worker", `Terminating existing worker ${workerId}`);
		workers.get(workerId)?.terminate();
		workers.delete(workerId);
	}

	try {
		const worker = new Worker(scriptUrl);

		worker.onmessage = (event) => {
			chrome.runtime.sendMessage<OffscreenMessage>({
				target: "background",
				command: "workerMessage",
				workerId: workerId,
				data: event.data,
			});
		};

		worker.onerror = (error) => {
			logger.error("worker", `Worker ${workerId} error:`, error);
			chrome.runtime.sendMessage<OffscreenMessage>({
				target: "background",
				command: "workerError",
				workerId: workerId,
				error: error.message || "Worker error",
			});
		};

		workers.set(workerId, worker);
		logger.info("worker", `Worker ${workerId} created successfully`);
		return true;
	} catch (error) {
		logger.error("worker", `Failed to create worker ${workerId}:`, error);
		return false;
	}
}

function postMessageToWorker(workerId: string, message: any): boolean {
	const worker = workers.get(workerId);
	if (worker) {
		try {
			logger.debug("worker", `Offscreen posting message to worker ${workerId}:`, message);
			worker.postMessage(message);
			return true;
		} catch (error) {
			logger.error("worker", `Failed to post message to worker ${workerId}:`, error);
			return false;
		}
	}
	logger.error("worker", `Worker ${workerId} not found`);
	return false;
}

function terminateWorker(workerId: string): boolean {
	const worker = workers.get(workerId);
	if (worker) {
		worker.terminate();
		workers.delete(workerId);
		logger.info("worker", `Worker ${workerId} terminated`);

		if (workers.size === 0) {
			logger.info("offscreen", "No more workers, closing offscreen document");
			window.close();
		}

		return true;
	}
	return false;
}

chrome.runtime.onMessage.addListener((message: OffscreenMessage, _sender, sendResponse) => {
	if (message.target !== "offscreen") return;

	switch (message.command) {
		case "createWorker": {
			const { workerId, scriptUrl } = message;
			const success = createWorker(workerId!, scriptUrl!);
			sendResponse(success);
			break;
		}
		case "postMessage": {
			const { workerId, message: msg } = message;
			const success = postMessageToWorker(workerId!, msg);
			sendResponse(success);
			break;
		}
		case "terminateWorker": {
			const { workerId } = message;
			const success = terminateWorker(workerId!);
			sendResponse(success);
			break;
		}
	}

	return true;
});

logger.info("offscreen", "Offscreen document initialized");
