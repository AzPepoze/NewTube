export function setPickingMode(picking: boolean) {
	window.dispatchEvent(
		new CustomEvent("styleshift-picker-state", {
			detail: { picking },
		}),
	);
}
