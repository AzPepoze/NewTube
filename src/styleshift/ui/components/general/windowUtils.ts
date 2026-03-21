export function constrainWindowPosition(
	left: number,
	top: number,
	width: number,
	height: number,
	minVisibleRatio: number,
) {
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	const minVisibleWidth = width * minVisibleRatio;
	const minVisibleHeight = Math.max(40, height * minVisibleRatio);

	let newLeft = left;
	let newTop = top;

	if (newLeft < -width + minVisibleWidth) {
		newLeft = -width + minVisibleWidth;
	}
	if (newTop < 0) {
		newTop = 0;
	}
	if (newLeft > viewportWidth - minVisibleWidth) {
		newLeft = viewportWidth - minVisibleWidth;
	}
	if (newTop > viewportHeight - minVisibleHeight) {
		newTop = viewportHeight - minVisibleHeight;
	}

	return {
		left: Math.round(newLeft),
		top: Math.round(newTop),
	};
}
