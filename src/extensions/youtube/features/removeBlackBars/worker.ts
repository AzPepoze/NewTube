import { type BarDetectionData, calculateVdoHeight, detectBlackBars } from "./helpers";

self.onmessage = async (e) => {
	try {
		const { type, data } = e.data;

		if (type === "detect") {
			const heightsFound = await detectBlackBars(data as BarDetectionData);
			const result = calculateVdoHeight(heightsFound, data.currentLastHeight);
			self.postMessage({ type: "result", data: { result } });
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
