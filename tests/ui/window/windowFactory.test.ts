// @ts-nocheck
import { expect, test } from "bun:test";

const source = await Bun.file("src/ui/window/windowFactory.ts").text();
const factoryCode = new Bun.Transpiler({ loader: "ts" }).transformSync(
	source
		.slice(
			source.indexOf("export async function createStyleShiftWindow"),
			source.indexOf("export let globalNotificationContainer"),
		)
		.replace("export ", ""),
);
const deferred = () => {
	let resolve;
	const promise = new Promise((yes) => {
		resolve = yes;
	});
	return { promise, resolve };
};

test("factory close is idempotent and cancels a pending show before attachment", async () => {
	const frame = deferred();
	const hide = deferred();
	let attachments = 0,
		removals = 0,
		unmounts = 0,
		closing = 0,
		closed = 0,
		shows = 0;
	const element = { style: {}, querySelector: () => ({}) };
	const create = new Function("deps", `with (deps) { ${factoryCode}; return createStyleShiftWindow; }`)({
		getRootValue: async () => false,
		logger: { info: () => {} },
		getDocumentHead: async () => {},
		getDocumentBody: async () => ({
			appendChild: () => {
				attachments++;
			},
		}),
		document: { createElement: () => ({ querySelector: () => element }) },
		settingsUi: {
			fillScreen: () => ({
				style: {},
				appendChild: () => {},
				remove: () => {
					removals++;
				},
			}),
			renderWindow: () => ({}),
		},
		applyThemeToElement: async () => {},
		waitOneFrame: () => frame.promise,
		triggerWindowHideAnimation: () => hide.promise,
		triggerWindowShowAnimation: async () => {
			shows++;
		},
		unmount: async () => {
			unmounts++;
		},
	});
	const win = await create({
		onWindowClosing: () => {
			closing++;
		},
		onWindowClosed: () => {
			closed++;
		},
	});
	const first = win.closeWindowHandler();
	expect(win.closeWindowHandler()).toBe(first);
	frame.resolve();
	await win.opened;
	expect(attachments).toBe(0);
	expect(shows).toBe(0);
	expect(unmounts).toBe(0);
	hide.resolve();
	await first;
	expect({ removals, unmounts, closing, closed }).toEqual({ removals: 1, unmounts: 1, closing: 1, closed: 1 });
});

const animationCode = new Bun.Transpiler({ loader: "ts" }).transformSync(
	source
		.slice(source.indexOf("export const DEFAULT_ANIMATION_DURATION_MS"), source.indexOf("/**\n * Internal helper"))
		.replace(/^export /gm, ""),
);

function animationTarget() {
	const target = new EventTarget();
	target.style = {};
	target.end = (name, type = "animationend") => {
		const event = new Event(type);
		event.animationName = name;
		target.dispatchEvent(event);
	};
	return target;
}

test("animation completes on its own event and ignores unrelated animations", async () => {
	const play = new Function("waitOneFrame", `${animationCode}; return playUiAnimation;`)(async () => {});
	const target = animationTarget();
	let finished = false;
	const animation = play(target, "Show-Pop-Animation").then(() => {
		finished = true;
	});
	await Promise.resolve();
	target.end("unrelated");
	await Promise.resolve();
	expect(finished).toBe(false);
	target.end("styleshift-show-pop-animation");
	await animation;
	expect(target.style.opacity).toBe("1");
	expect(target.style.animation).toBe("");
});

test("pending show cannot overwrite hide styles", async () => {
	const frame = deferred();
	const play = new Function("waitOneFrame", `${animationCode}; return playUiAnimation;`)(() => frame.promise);
	const target = animationTarget();
	const show = play(target, "Show-Pop-Animation");
	const hide = play(target, "Hide-Pop-Animation");
	frame.resolve();
	await show;
	expect(target.style.animation).toContain("styleshift-hide-pop-animation");
	target.end("styleshift-hide-pop-animation");
	await hide;
	expect(target.style.animation).toContain("styleshift-hide-pop-animation");
});

test("missing animation events use the timeout fallback", async () => {
	const play = new Function("waitOneFrame", `${animationCode}; return playUiAnimation;`)(async () => {});
	const target = animationTarget();
	await play(target, "Show-Pop-Animation");
	expect(target.style.opacity).toBe("1");
});
