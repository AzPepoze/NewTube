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

/** Script that types `text` into the settings search box. Returns false when the box is missing. */
function searchSettingsScript(text: string): string {
	return `(() => {
		const input = document.querySelector('[class*="search-input"]');
		if (!input) return false;
		const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
		setValue.call(input, ${JSON.stringify(text)});
		input.dispatchEvent(new InputEvent('input', { bubbles: true }));
		return true;
	})()`;
}

/** Script that clicks the switch of the setting whose frame has `id`. */
function clickSettingSwitchScript(id: string): string {
	return `(() => {
		const frame = document.getElementById(${JSON.stringify(id)});
		if (!frame) return false;
		const box = frame.querySelector('input[type="checkbox"]');
		if (!box) return false;
		box.click();
		return true;
	})()`;
}

/**
 * Script that closes the open dialog and samples the outro. It reports the backdrop's classes,
 * the fade steps of its opacity, whether the overlay left the DOM, and the slow frames.
 */
function closeDialogScript(): string {
	return `(async () => {
		const modal = document.querySelector('[class*="-modal-content"]');
		if (!modal) return { error: 'no dialog' };
		const cancel = [...modal.querySelectorAll('*')]
			.filter((el) => el.textContent.trim() === 'Cancel' && el.getClientRects().length > 0)
			.at(-1);
		const backdrop = document.querySelector('[class*="-modal-backdrop"]');
		if (!backdrop || !cancel) return { error: 'dialog is incomplete' };

		const classes = backdrop.className;
		const filter = getComputedStyle(backdrop).backdropFilter;

		const frames = [];
		let stop = false;
		const onFrame = () => {
			frames.push(performance.now());
			if (!stop) requestAnimationFrame(onFrame);
		};
		requestAnimationFrame(onFrame);

		const clickAt = performance.now();
		cancel.click();

		const samples = [];
		const start = performance.now();
		while (performance.now() - start < 900) {
			const node = document.querySelector('[class*="-modal-backdrop"]');
			samples.push(node ? Number(getComputedStyle(node).opacity) : -1);
			await new Promise((resolve) => setTimeout(resolve, 15));
		}
		stop = true;

		// Offset of every gap over two frames, so a stall shows up with the moment it happened.
		const slow = frames
			.slice(1)
			.map((time, index) => ({ gap: time - frames[index], at: Math.round(time - clickAt) }))
			.filter((frame) => frame.gap > 34)
			.map((frame) => frame.at + 'ms:' + Math.round(frame.gap) + 'ms');
		const gaps = frames.slice(1).map((time, index) => time - frames[index]).sort((a, b) => a - b);
		return {
			classes,
			filter,
			fadeSteps: samples.filter((opacity) => opacity > 0.02 && opacity < 0.98).length,
			distinct: new Set(samples).size,
			overlayGone: !document.querySelector('[class*="-modal-overlay"]'),
			medianGap: gaps.at(Math.floor(gaps.length / 2)),
			maxGap: gaps.at(-1),
			slow,
		};
	})()`;
}

interface DialogCloseSample {
	classes: string;
	filter: string;
	fadeSteps: number;
	distinct: number;
	overlayGone: boolean;
	medianGap: number;
	maxGap: number;
	slow: string[];
	error?: string;
}

/** Opens the Theme Manager's Save prompt, closes it and returns the outro sample. */
async function closeSavePrompt(driver: Driver, shotName: string): Promise<DialogCloseSample> {
	await clickText(driver, "Save");
	await waitFor(() => driver.evaluate<boolean>("!!document.querySelector('[class*=\"-modal-content\"]')"), {
		label: "Save prompt",
	});
	// Let the intro finish so the sample only sees the outro.
	await sleep(600);
	await shot(driver, shotName);
	const sample = await driver.evaluate<DialogCloseSample>(closeDialogScript());
	if (sample.error) throw new Error(`dialog check failed: ${sample.error}`);
	console.log(
		`dialog close: blur=${sample.filter} fadeSteps=${sample.fadeSteps} overlayGone=${sample.overlayGone} frame=${sample.medianGap?.toFixed(1)}ms (max ${sample.maxGap?.toFixed(1)}ms) slow=${sample.slow?.join(", ") || "none"}`,
	);
	expect(sample.distinct > 3, "the backdrop fades instead of popping");
	expect(sample.fadeSteps >= 3, "backdrop opacity has intermediate values during the outro");
	expect(sample.overlayGone, "the dialog leaves the DOM after closing");
	return sample;
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

/** Dialog close: the prompt fades out, and its backdrop blur follows the Glass UI setting. */
export async function dialog(driver: Driver): Promise<string[]> {
	await openYoutube(driver);
	await dismissFirstRunPrompts(driver);
	await driver.evaluate("document.getElementById('NEWTUBESET').click(), true");
	await waitFor(() => driver.evaluate<boolean>("!!document.getElementById('OpenThemeManagerButton')"), {
		label: "settings window",
	});
	await waitFor(() => driver.evaluate<boolean>(clickThemesRowScript()), { label: "Themes row in settings" });
	await waitFor(() => driver.evaluate<boolean>(hasTextScript("Save")), { label: "Save button" });

	// Opaque theme: the backdrop carries the dim only, and it has to fade out.
	const opaque = await closeSavePrompt(driver, "dialog-opaque");
	expect(opaque.classes.includes("no-blur"), "an opaque theme skips the dialog backdrop blur");

	// Glass UI on: the same dialog blurs the page behind it.
	await waitFor(() => driver.evaluate<boolean>(searchSettingsScript("Glass UI")), { label: "settings search" });
	await waitFor(() => driver.evaluate<boolean>(clickSettingSwitchScript("EnableSettingsBackgroundBlur")), {
		label: "Glass UI switch",
	});
	await sleep(600);
	const glass = await closeSavePrompt(driver, "dialog-glass");
	expect(!glass.classes.includes("no-blur"), "a glass theme blurs the dialog backdrop");
	expect(glass.filter.includes("blur("), `the backdrop has a blur filter (${glass.filter})`);

	return ["dialog-opaque.png", "dialog-glass.png"];
}

export const SCENARIOS = { home, welcome, themes, dialog } as const;
export type ScenarioName = keyof typeof SCENARIOS;
