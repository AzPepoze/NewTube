import { BarDetectionData, calculateVdoHeight, detectBlackBars } from "./helpers";

self.onmessage = async (e) => {
	const { type, data } = e.data;

	if (type === "detect") {
		const heightsFound = await detectBlackBars(data as BarDetectionData);
		const result = calculateVdoHeight(heightsFound, data.currentLastHeight);
		self.postMessage({ type: "result", data: { result } });
	}
};
