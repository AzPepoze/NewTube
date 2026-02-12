import { BarDetectionData, calculateVdoHeight, detectBlackBars } from "./removeBlackBarsLogic";

self.onmessage = (e) => {
	const { type, data } = e.data;

	if (type === "detect") {
		const heightsFound = detectBlackBars(data as BarDetectionData);
		self.postMessage({ type: "detected", data: { heightsFound } });
	} else if (type === "calculate") {
		const { heights, currentLastHeight } = data;
		const result = calculateVdoHeight(heights, currentLastHeight);
		self.postMessage({ type: "calculated", data: { result } });
	}
};
