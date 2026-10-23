import { rmSync } from "fs";
import path from "path";
import { type Driver, waitFor } from "./driver";
import { REPO, PORTS, freshProfileDir, portOpen } from "./launch-shared";

const CHROMIUM_BIN = process.env.CHROMIUM_BIN ?? "/usr/bin/chromium";
const EXTENSION_DIR = path.join(REPO, "out/dist/chromium");

/** Starts a throwaway headless Chromium with the built extension loaded. Returns the stop function. */
export async function launchChromium(): Promise<() => Promise<void>> {
	if (await portOpen(PORTS.chromium))
		throw new Error(`Port ${PORTS.chromium} is already in use. Close the other browser first.`);

	const profile = freshProfileDir("chromium");
	const proc = Bun.spawn(
		[
			CHROMIUM_BIN,
			"--headless=new",
			"--no-first-run",
			"--disable-gpu",
			"--window-size=1920,1080",
			`--remote-debugging-port=${PORTS.chromium}`,
			`--user-data-dir=${profile}`,
			`--load-extension=${EXTENSION_DIR}`,
			`--disable-extensions-except=${EXTENSION_DIR}`,
			"about:blank",
		],
		{ stdout: "ignore", stderr: "ignore" },
	);

	await waitFor(() => portOpen(PORTS.chromium), { label: "Chromium debug port", timeoutMs: 30000 });
	return async () => {
		proc.kill();
		await proc.exited;
		rmSync(profile, { recursive: true, force: true });
	};
}

/** Connects to the first page tab over CDP. Dark YouTube via its preference cookie. */
export async function connectChromium(): Promise<Driver> {
	const created = await (
		await fetch(`http://127.0.0.1:${PORTS.chromium}/json/new?about:blank`, { method: "PUT" })
	).json();
	const ws = new WebSocket(created.webSocketDebuggerUrl);
	await new Promise((resolve, reject) => {
		ws.onopen = resolve;
		ws.onerror = reject;
	});

	let nextId = 0;
	const pending = new Map<number, (message: any) => void>();
	ws.onmessage = (event) => {
		const message = JSON.parse(String(event.data));
		if (message.id && pending.has(message.id)) pending.get(message.id)!(message);
	};
	const send = (method: string, params: Record<string, unknown> = {}) =>
		new Promise<any>((resolve) => {
			const id = ++nextId;
			pending.set(id, (message) => {
				pending.delete(id);
				resolve(message.result ?? message);
			});
			ws.send(JSON.stringify({ id, method, params }));
		});

	await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
	await send("Network.enable");
	await send("Network.setCookie", { name: "PREF", value: "f6=400&hl=en", domain: ".youtube.com", path: "/" });
	await send("Page.enable");

	return {
		async goto(url) {
			await send("Page.navigate", { url });
			await waitFor(async () => (await this.evaluate<string>("document.readyState")) === "complete", {
				label: `load of ${url}`,
				timeoutMs: 30000,
			});
		},
		async evaluate<T>(expression: string) {
			const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
			if (result.exceptionDetails) throw new Error(`Page script failed: ${result.exceptionDetails.text}`);
			return result.result?.value as T;
		},
		async setViewport(width, height) {
			await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
		},
		async screenshot(file) {
			const shot = await send("Page.captureScreenshot", { format: "png" });
			await Bun.write(file, Buffer.from(shot.data, "base64"));
		},
		async close() {
			ws.close();
			await fetch(`http://127.0.0.1:${PORTS.chromium}/json/close/${created.id}`);
		},
	};
}
