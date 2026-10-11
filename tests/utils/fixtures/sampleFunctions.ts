/**
 * Adds two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum.
 *
 * @example
 * add(1, 2); // 3
 */
export function add(a: number, b: number): number {
	return a + b;
}

export async function wait(ms = 100): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export function notify({ title = "Hi", content }: { title?: string; content?: string }): void {
	console.log(title, content);
}

export function onDone(callback: (value: string) => void): void {
	callback("done");
}

function hidden(): void {}

export function callsHidden(): void {
	hidden();
}
