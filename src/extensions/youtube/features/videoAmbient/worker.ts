import { logger } from "@shared/logger";
import { VideoBGRenderer } from "./renderer";

logger.info("video-bg-worker", "Worker script starting...");

let renderer = new VideoBGRenderer();

self.onmessage = (e) => {
	try {
		const { type, data } = e.data;

		if (type !== "render") {
			logger.debug("video-bg-worker", `Received message: ${type}`, data);
		}

		switch (type) {
			case "init":
				if (data.canvas) {
					logger.info("video-bg-worker", "Initializing renderer with canvas");
					renderer.init(data.canvas, data.settings);
					self.postMessage({ type: "initialized" });
				}
				break;
			case "updateSettings":
				renderer.updateSettings(data);
				break;
			case "render":
				if (data.bitmap) {
					renderer.render(data.bitmap);
					self.postMessage({ type: "rendered" });
				} else {
					logger.warn("video-bg-worker", "Received render message without bitmap");
					self.postMessage({ type: "rendered" });
				}
				break;
		}
	} catch (err) {
		logger.error("video-bg-worker", "Error in worker onmessage:", err);
		self.postMessage({ type: "rendered", error: true });
	}
};
