import { detectBlackBars } from "./helpers";
import type { BarDetectionData } from "./types";

self.onmessage = async (e) => {
	try {
		const { type, data } = e.data;

		if (type === "detect") {
			const { heightResult, widthResult } = await detectBlackBars(data as BarDetectionData);
			self.postMessage({ type: "result", data: { heightResult, widthResult } });
		}
	} catch (err) {
		self.postMessage({
			type: "log",
			data: {
				level: "error",
				category: "remove-black-bars-worker",
				args: ["Error in worker:", err],
			},
		});
		self.postMessage({ type: "result", data: { result: 0 }, error: true });
	}
};
