import { type BarDetectionData, calculateVdoHeight, calculateVdoWidth, detectBlackBars } from "./helpers";

self.onmessage = async (e) => {
	try {
		const { type, data } = e.data;

		if (type === "detect") {
			const { heightsFound, widthsFound } = await detectBlackBars(data as BarDetectionData);
			const heightResult = calculateVdoHeight(heightsFound, data.currentLastHeight ?? 0);
			const widthResult = calculateVdoWidth(widthsFound, data.currentLastWidth ?? 0);
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
