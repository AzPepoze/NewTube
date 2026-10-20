import { mkdirSync } from "fs";
import path from "path";
import { connectChromium, launchChromium } from "./chromium";
import { connectFirefox, launchFirefox } from "./firefox";
import { type Driver, sleep } from "./driver";
import { type BrowserName, PORTS } from "./launch-shared";
import { SCENARIOS, SHOTS_DIR, YOUTUBE_URL, type ScenarioName, expect } from "./scenarios";

export interface CliOptions {
	command: string | undefined;
	positional: string[];
	browser: BrowserName;
	url: string;
	out: string | undefined;
}

const BROWSERS: BrowserName[] = ["chromium", "firefox"];

/** Parses `<command> [positional...] [--browser x] [--url x] [--out x]`. Throws on unknown browsers. */
export function parseArgs(argv: string[]): CliOptions {
	const options: CliOptions = { command: undefined, positional: [], browser: "chromium", url: YOUTUBE_URL, out: undefined };
	for (let index = 0; index < argv.length; index++) {
		const arg = argv[index];
		if (arg === "--browser" || arg === "--url" || arg === "--out") {
			const value = argv[++index];
			if (value === undefined) throw new Error(`${arg} needs a value`);
			if (arg === "--browser") {
				if (!BROWSERS.includes(value as BrowserName)) throw new Error(`Unknown browser "${value}". Use chromium or firefox.`);
				options.browser = value as BrowserName;
			} else if (arg === "--url") options.url = value;
			else options.out = value;
		} else if (options.command === undefined) {
			options.command = arg;
		} else {
			options.positional.push(arg);
		}
	}
	return options;
}

async function withBrowser<T>(browser: BrowserName, run: (driver: Driver) => Promise<T>): Promise<T> {
	const stop = browser === "chromium" ? await launchChromium() : await launchFirefox();
	const driver = browser === "chromium" ? await connectChromium() : await connectFirefox();
	try {
		return await run(driver);
	} finally {
		await driver.close().catch(() => {});
		await stop();
	}
}

async function main(argv: string[]): Promise<number> {
	const options = parseArgs(argv);
	const { command, positional, browser } = options;

	if (command === "shot") {
		const out = options.out ?? path.join(SHOTS_DIR, `shot-${browser}.png`);
		mkdirSync(path.dirname(out), { recursive: true });
		await withBrowser(browser, async (driver) => {
			await driver.goto(options.url);
			await sleep(2000);
			await driver.screenshot(out);
		});
		console.log(`saved ${out}`);
		return 0;
	}

	if (command === "eval") {
		const expression = positional.join(" ");
		expect(expression, "an expression to evaluate");
		const value = await withBrowser(browser, async (driver) => {
			await driver.goto(options.url);
			await sleep(2000);
			return driver.evaluate(expression);
		});
		console.log(JSON.stringify(value, null, 2));
		return 0;
	}

	if (command === "scenario") {
		const name = positional[0] as ScenarioName;
		if (!(name in SCENARIOS)) throw new Error(`Unknown scenario "${name}". Use one of: ${Object.keys(SCENARIOS).join(", ")}.`);
		const files = await withBrowser(browser, (driver) => SCENARIOS[name](driver));
		console.log(`scenario ${name} passed on ${browser}. Screenshots: ${files.map((f) => path.join(SHOTS_DIR, f)).join(", ")}`);
		return 0;
	}

	console.log(
		[
			"Usage:",
			"  bun .agents/browser/cli.ts shot [--browser chromium|firefox] [--url URL] [--out FILE]",
			"  bun .agents/browser/cli.ts eval \"<js>\" [--browser ...] [--url URL]",
			"  bun .agents/browser/cli.ts scenario home|welcome|themes [--browser ...]",
			`Ports: chromium ${PORTS.chromium}, firefox ${PORTS.firefox}. Build first with bun run build.`,
		].join("\n"),
	);
	return command ? 1 : 0;
}

if (import.meta.main) {
	main(process.argv.slice(2))
		.then((code) => process.exit(code))
		.catch((error) => {
			console.error(`✘ ${error instanceof Error ? error.message : error}`);
			process.exit(1);
		});
}
