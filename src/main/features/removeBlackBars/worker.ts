import { BarDetectionData, calculateVdoHeight, detectBlackBars } from "./helpers";

self.onmessage = (e) => {
	const { type, data } = e.data;

	if (type === "detect") {
		const heightsFound = detectBlackBars(data as BarDetectionData);
		self.postMessage({ type: "detected", data: { heightsFound } });
	} else if (type === "calculate") {
		const result = calculateVdoHeight(data.heights, data.currentLastHeight);
		self.postMessage({ type: "calculated", data: { result } });
	}
};
