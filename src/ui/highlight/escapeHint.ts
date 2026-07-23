export function createEscapeHint(action = "cancel") {
	const element = document.createElement("div");
	element.className = "styleshift-exit-hint styleshift-main";
	element.append("Press ");
	const key = document.createElement("b");
	key.textContent = "ESC";
	element.append(key, ` to ${action}`);
	document.body.append(element);

	return {
		setVisible(visible: boolean) {
			element.hidden = !visible;
		},
		destroy() {
			element.remove();
		},
	};
}
