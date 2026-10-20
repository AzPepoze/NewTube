import { mkdirSync } from "fs";
import path from "path";
import { PRESET_THEMES } from "../../src/extensions/youtube/presets/index";
import { type Driver, clickTextScript, hasTextScript, sleep, waitFor } from "./driver";
import { REPO } from "./launch-shared";

export const SHOTS_DIR = path.join(REPO, "out/shots");
export const YOUTUBE_URL = "https://www.youtube.com/";

export function expect(condition: unknown, message: string): void {
	if (!condition) throw new Error(`Assertion failed: ${message}`);
}

/**
 * Script that tells whether the page shows `text`. Whitespace is ignored on both sides,
 * because headings are split into one element per letter.
 */
function pageHasTextScript(text: string): string {
	const compact = text.replace(/\s+/g, "");
	return `document.body.innerText.replace(/\\s+/g, '').includes(${JSON.stringify(compact)})`;
}

/** Script that clicks the "Themes" label inside the settings row. Returns true when clicked. */
function clickThemesRowScript(): string {
	return `(() => {
		const row = document.getElementById('OpenThemeManagerButton');
		if (!row) return false;
		const label = [...row.querySelectorAll('*')].filter((el) => el.children.length === 0 && el.textContent.trim() === 'Themes').at(-1);
		if (!label) return false;
		label.click();
		return true;
	})()`;
}

/** On a fresh profile the first-run prompts open on top of the page. Each is answered with its "no" button. */
const FIRST_RUN_ANSWERS: [prompt: string, answer: string][] = [
	["Do you have a moment?", "Nope"],
	["Do you want to start the tutorial?", "Cancel"],
];

async function dismissFirstRunPrompts(driver: Driver): Promise<void> {
	for (const [prompt, answer] of FIRST_RUN_ANSWERS) {
		const appeared = await waitFor(() => driver.evaluate<boolean>(pageHasTextScript(prompt)), {
			label: prompt,
			timeoutMs: 8000,
		}).then(
			() => true,
			() => false,
		);
		if (appeared) {
			await clickText(driver, answer);
			await sleep(800);
		}
	}
}

/** Opens YouTube and waits until the StyleShift top-bar button is injected. */
async function openYoutube(driver: Driver): Promise<void> {
	await driver.goto(YOUTUBE_URL);
	await waitFor(() => driver.evaluate<boolean>("!!document.getElementById('NEWTUBESET')"), {
		label: "StyleShift button on YouTube",
	});
}

async function waitForText(driver: Driver, text: string): Promise<void> {
	await waitFor(() => driver.evaluate<boolean>(pageHasTextScript(text)), { label: `text "${text}"` });
}

async function clickText(driver: Driver, text: string): Promise<void> {
	await waitFor(() => driver.evaluate<boolean>(clickTextScript(text)), { label: `"${text}" to click` });
}

async function shot(driver: Driver, name: string): Promise<void> {
	mkdirSync(SHOTS_DIR, { recursive: true });
	await driver.screenshot(path.join(SHOTS_DIR, `${name}.png`));
}

/** Home page with the extension applied. */
export async function home(driver: Driver): Promise<string[]> {
	await openYoutube(driver);
	await sleep(1500);
	await shot(driver, "home");
	return ["home.png"];
}

/** First-run welcome: confirm, every step, then the tutorial prompt. Needs a fresh profile. */
export async function welcome(driver: Driver): Promise<string[]> {
	await openYoutube(driver);

	await waitForText(driver, "Do you have a moment?");
	await clickText(driver, "Uh.. Yes?");

	await waitFor(() => driver.evaluate<boolean>("!!document.querySelector('[id$=\"Welcome-Root\"]')"), {
		label: "welcome page",
	});
	await waitForText(driver, "Welcome to");
	await sleep(1500);
	await shot(driver, "welcome-1-hello");
	await clickText(driver, "YAY!");

	await waitForText(driver, "Pick your look");
	await sleep(900);
	await shot(driver, "welcome-2-look");
	expect(await driver.evaluate<boolean>(hasTextScript("Next")), "Next button on the look step");
	await clickText(driver, "Next");

	await waitForText(driver, "Enjoy your new experience!");
	await sleep(900);
	await shot(driver, "welcome-3-support");
	await clickText(driver, "Next");

	// The root element stays until the tutorial prompt is answered, so wait for the overlay to go.
	await waitFor(() => driver.evaluate<boolean>("!document.querySelector('.Welcome-Overlay')"), {
		label: "welcome overlay to close",
		timeoutMs: 20000,
	});
	await waitForText(driver, "tutorial");
	await shot(driver, "welcome-4-tutorial-prompt");
	return ["welcome-1-hello.png", "welcome-2-look.png", "welcome-3-support.png", "welcome-4-tutorial-prompt.png"];
}

/** Theme Manager: opens from settings, lists the installed presets, and each card renders the mock. */
export async function themes(driver: Driver): Promise<string[]> {
	await openYoutube(driver);
	await dismissFirstRunPrompts(driver);
	await driver.evaluate("document.getElementById('NEWTUBESET').click(), true");

	await waitFor(() => driver.evaluate<boolean>("!!document.getElementById('OpenThemeManagerButton')"), {
		label: "settings window",
	});
	// The row's click handler sits on the innermost "Themes" label, not on the row itself.
	await waitFor(() => driver.evaluate<boolean>(clickThemesRowScript()), { label: "Themes row in settings" });

	const mockCount = `document.querySelectorAll('.preview-area .preview .stage').length`;
	await waitFor(() => driver.evaluate<boolean>(`${mockCount} >= ${PRESET_THEMES.length}`), {
		label: "Theme Manager cards",
	});
	await sleep(1500);
	await shot(driver, "themes-installed");

	for (const preset of PRESET_THEMES) {
		expect(await driver.evaluate<boolean>(pageHasTextScript(preset.themeName)), `preset "${preset.themeName}" listed`);
	}
	const mocks = await driver.evaluate<number>(mockCount);
	expect(mocks >= PRESET_THEMES.length, `every preset card renders the YouTube mock (found ${mocks})`);
	return ["themes-installed.png"];
}

export const SCENARIOS = { home, welcome, themes } as const;
export type ScenarioName = keyof typeof SCENARIOS;
