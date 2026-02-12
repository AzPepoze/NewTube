import { VideoBGRenderer } from "./videoBackgroundRenderer";
import { logger } from "../../shared/logger";

let renderer = new VideoBGRenderer();

self.onmessage = (e) => {
	const { type, data } = e.data;

	if (type !== "render") {
		logger.debug("video-bg-worker", `Received message: ${type}`, data);
	}

	switch (type) {
		case "init":
			if (data.canvas) {
				renderer.init(data.canvas, data.settings);
			}
			break;
		case "updateSettings":
			renderer.updateSettings(data);
			break;
		case "render":
			renderer.render(data.bitmap);
			break;
	}
};
