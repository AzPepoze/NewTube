import { describe, expect, test } from "bun:test";
import { clickTextScript, hasTextScript, waitFor } from "./driver";
import { parseArgs } from "./cli";

describe("parseArgs", () => {
	test("defaults to Chromium and the YouTube home page", () => {
		const options = parseArgs(["shot"]);

		expect(options.command).toBe("shot");
		expect(options.browser).toBe("chromium");
		expect(options.url).toBe("https://www.youtube.com/");
		expect(options.out).toBeUndefined();
	});

	test("reads --browser, --url and --out wherever they appear", () => {
		const options = parseArgs(["scenario", "--browser", "firefox", "welcome", "--out", "a.png", "--url", "https://x.test/"]);

		expect(options.command).toBe("scenario");
		expect(options.positional).toEqual(["welcome"]);
		expect(options.browser).toBe("firefox");
		expect(options.out).toBe("a.png");
		expect(options.url).toBe("https://x.test/");
	});

	test("keeps every positional word for eval", () => {
		expect(parseArgs(["eval", "document.title", "+", "1"]).positional).toEqual(["document.title", "+", "1"]);
	});

	test("rejects an unknown browser", () => {
		expect(() => parseArgs(["shot", "--browser", "safari"])).toThrow('Unknown browser "safari"');
	});

	test("rejects a flag without a value", () => {
		expect(() => parseArgs(["shot", "--out"])).toThrow("--out needs a value");
	});
});

describe("waitFor", () => {
	test("resolves with the first truthy value", async () => {
		let calls = 0;
		const value = await waitFor(
			async () => {
				calls++;
				return calls >= 3 ? "ready" : false;
			},
			{ label: "ready", intervalMs: 1 },
		);

		expect(value).toBe("ready");
		expect(calls).toBe(3);
	});

	test("throws with the label after the timeout", async () => {
		await expect(waitFor(async () => false, { label: "never", timeoutMs: 20, intervalMs: 5 })).rejects.toThrow(
			"Timed out after 20ms waiting for never",
		);
	});
});

describe("page scripts", () => {
	test("click and check scripts embed the text as a JSON string", () => {
		const text = 'Uh.. "Yes"?';

		expect(clickTextScript(text)).toContain(JSON.stringify(text));
		expect(hasTextScript(text)).toContain(JSON.stringify(text));
	});
});
