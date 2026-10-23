import { quintOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

/** Shared length of the dialog intro and outro, in milliseconds. */
export const MODAL_TRANSITION_MS = 320;

const DEFAULT_DURATION = MODAL_TRANSITION_MS;

function prefersReducedMotion() {
	return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Fades the dialog backdrop. Opacity is composited, so the backdrop blur is filtered once
 * instead of being recomputed every frame the way an animated blur radius is.
 */
export function backdropFade(
	node: HTMLElement,
	{ duration = DEFAULT_DURATION }: { duration?: number } = {},
): TransitionConfig {
	return {
		duration: prefersReducedMotion() ? 0 : duration,
		tick: (t) => {
			node.style.opacity = t === 1 ? "" : `${t}`;
		},
	};
}

/** Scales and fades the dialog card so it leaves together with the backdrop. */
export function modalPop(
	node: HTMLElement,
	{ duration = DEFAULT_DURATION, start = 0.92 }: { duration?: number; start?: number } = {},
): TransitionConfig {
	return {
		duration: prefersReducedMotion() ? 0 : duration,
		easing: quintOut,
		tick: (t) => {
			if (t === 1) {
				node.style.opacity = "";
				node.style.transform = "";
				return;
			}
			node.style.opacity = `${t}`;
			node.style.transform = `scale(${start + (1 - start) * t})`;
		},
	};
}

/** Keeps an element mounted for its outro without animating its own styles. */
export function holdOpen(
	_node: HTMLElement,
	{ duration = DEFAULT_DURATION }: { duration?: number } = {},
): TransitionConfig {
	return { duration: prefersReducedMotion() ? 0 : duration, tick: () => {} };
}
