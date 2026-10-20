import path from "path";
import { type Driver, waitFor } from "./driver";
import { REPO, PORTS, portOpen } from "./launch-shared";

const FIREFOX_BIN = process.env.FIREFOX_BIN ?? "/usr/bin/firefox";
const EXTENSION_DIR = path.join(REPO, "out/dist/firefox");
const WEB_EXT = path.join(REPO, "node_modules/.bin/web-ext");

/** Starts headless Firefox through web-ext (fresh temp profile) with the built extension installed. */
export async function launchFirefox(): Promise<() => Promise<void>> {
	if (await portOpen(PORTS.firefox))
		throw new Error(`Port ${PORTS.firefox} is already in use. Close the other browser first.`);

	const proc = Bun.spawn(
		[
			WEB_EXT,
			"run",
			"--source-dir",
			EXTENSION_DIR,
			"--target=firefox-desktop",
			"--firefox-binary",
			FIREFOX_BIN,
			"--no-input",
			"--no-reload",
			"--start-url",
			"about:blank",
			"--arg=--headless",
			`--arg=--remote-debugging-port=${PORTS.firefox}`,
			"--arg=--window-size=1920,1080",
		],
		{ cwd: REPO, stdout: "ignore", stderr: "ignore" },
	);

	await waitFor(() => portOpen(PORTS.firefox), { label: "Firefox debug port", timeoutMs: 60000 });
	return async () => {
		proc.kill();
		await proc.exited;
		// web-ext leaves the Firefox process running, so stop it through its debug-port argument.
		const firefoxPids = Bun.spawnSync(["pgrep", "-f", `remote-debugging-port=${PORTS.firefox}`])
			.stdout.toString()
			.trim();
		for (const pid of firefoxPids.split("\n").filter(Boolean)) process.kill(Number(pid));
	};
}

/** Unwraps a WebDriver BiDi remote value into a plain JS value. */
function unwrap(result: any): any {
	const value = result?.result;
	if (!value || value.type === "undefined") return undefined;
	if (value.type === "null") return null;
	return value.value;
}

/** Connects to the first top-level tab over WebDriver BiDi. Dark YouTube via its preference cookie. */
export async function connectFirefox(): Promise<Driver> {
	const ws = new WebSocket(`ws://127.0.0.1:${PORTS.firefox}/session`);
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
		new Promise<any>((resolve, reject) => {
			const id = ++nextId;
			pending.set(id, (message) => {
				pending.delete(id);
				if (message.type === "error") reject(new Error(`${method}: ${message.error} ${message.message}`));
				else resolve(message.result);
			});
			ws.send(JSON.stringify({ id, method, params }));
		});

	await send("session.new", { capabilities: {} });
	const tree = await send("browsingContext.getTree", {});
	const context: string = tree.contexts[0].context;

	await send("browsingContext.setViewport", { context, viewport: { width: 1920, height: 1080 } });

	await send("storage.setCookie", {
		cookie: { name: "PREF", value: { type: "string", value: "f6=400&hl=en" }, domain: ".youtube.com", path: "/" },
		partition: { type: "storageKey", userContext: "default" },
	});

	return {
		async goto(url) {
			await send("browsingContext.navigate", { context, url, wait: "complete" });
		},
		async evaluate<T>(expression: string) {
			const result = await send("script.evaluate", {
				expression,
				target: { context },
				awaitPromise: true,
				resultOwnership: "none",
			});
			if (result.type === "exception") throw new Error(`Page script failed: ${result.exceptionDetails?.text}`);
			return unwrap(result) as T;
		},
		async setViewport(width, height) {
			await send("browsingContext.setViewport", { context, viewport: { width, height } });
		},
		async screenshot(file) {
			const shot = await send("browsingContext.captureScreenshot", { context });
			await Bun.write(file, Buffer.from(shot.data, "base64"));
		},
		async close() {
			await send("session.end", {});
			ws.close();
		},
	};
}
