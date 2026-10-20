/** What every browser driver offers to the scenarios. */
export interface Driver {
	goto(url: string): Promise<void>;
	evaluate<T = unknown>(expression: string): Promise<T>;
	setViewport(width: number, height: number): Promise<void>;
	screenshot(path: string): Promise<void>;
	close(): Promise<void>;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Polls `read` until it returns a truthy value, or throws after `timeoutMs`. */
export async function waitFor<T>(
	read: () => Promise<T | null | undefined | false>,
	{ label, timeoutMs = 15000, intervalMs = 250 }: { label: string; timeoutMs?: number; intervalMs?: number },
): Promise<T> {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const value = await read();
		if (value) return value;
		await sleep(intervalMs);
	}
	throw new Error(`Timed out after ${timeoutMs}ms waiting for ${label}`);
}

/**
 * Script that finds the innermost visible element whose text is exactly `text`.
 * StyleShift's own buttons are often a <span> inside a clickable <div>, so this is not limited to <button>.
 */
function findByTextScript(text: string): string {
	return `(() => {
		const wanted = ${JSON.stringify(text)};
		const matches = [...document.querySelectorAll('body *')].filter(
			(el) => el.textContent.trim() === wanted && el.getClientRects().length > 0 && ![...el.children].some((child) => child.textContent.trim() === wanted),
		);
		return matches.at(-1) ?? null;
	})()`;
}

/** Script that clicks the innermost visible element with exactly `text`. Returns true when clicked. */
export function clickTextScript(text: string): string {
	return `(() => {
		const element = ${findByTextScript(text)};
		if (!element) return false;
		element.click();
		return true;
	})()`;
}

/** Script that returns true when a visible element with exactly `text` exists. */
export function hasTextScript(text: string): string {
	return `${findByTextScript(text)} !== null`;
}
