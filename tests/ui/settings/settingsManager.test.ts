// @ts-nocheck
import { expect, test } from "bun:test";

// Inject UI dependencies without loading the extension bootstrap or Svelte compiler.
const source = await Bun.file("src/ui/settings/settingsManager.ts").text();
const code = new Bun.Transpiler({ loader: "ts" }).transformSync(
	source.replace(/^import .*;\n/gm, "").replace(/^export /gm, ""),
);
const deferred = () => {
	let resolve, reject;
	const promise = new Promise((yes, no) => {
		resolve = yes;
		reject = no;
	});
	return { promise, resolve, reject };
};

async function setup(options = {}) {
	const windows = [];
	const initialization = deferred();
	let unmounts = 0;
	let mounts = 0;
	const create = new Function("deps", `with (deps) { ${code}; return createMainSettingsUi; }`)({
		SvelteSet: Set,
		IS_IN_EXTENSION_SETTINGS_PAGE: false,
		isDevModulesLoaded: false,
		getAddOnItems: () => [],
		getRootValue: async () => false,
		createSettingsProps: (props) => ({ props }),
		settingsUi: {
			settingsWindow: () => {
				mounts++;
				return {};
			},
		},
		unmount: async () => {
			unmounts++;
		},
		createStyleShiftWindow: async (options) => {
			await initialization.promise;
			const show = deferred();
			const hide = deferred();
			let closing;
			const win = {
				windowElement: { style: {} },
				contentElement: {},
				opened: show.promise,
				show,
				hide,
				closeWindowHandler: (skip) => {
					if (closing) return closing;
					closing = (async () => {
						if (!skip) await hide.promise;
						await options.onWindowClosed();
					})();
					options.onWindowClosing();
					return closing;
				},
			};
			windows.push(win);
			return win;
		},
	});
	return { manager: await create(options), windows, initialization, counts: () => ({ mounts, unmounts }) };
}
const flush = async () => {
	for (let i = 0; i < 15; i++) await Promise.resolve();
};

test("concurrent opens and toggles wait for initialization and animation; close keeps content until cleanup", async () => {
	const { manager, windows, initialization, counts } = await setup();
	const first = manager.createUi();
	expect(manager.createUi()).toBe(first);
	await manager.toggle();
	initialization.resolve();
	await flush();
	expect(windows).toHaveLength(1);
	await manager.toggle();
	expect(counts()).toEqual({ mounts: 1, unmounts: 0 });
	windows[0].show.resolve();
	await first;
	const close = manager.removeUi();
	const repeated = manager.removeUi();
	await manager.toggle();
	await manager.createUi();
	expect(counts().unmounts).toBe(0);
	windows[0].hide.resolve();
	await Promise.all([close, repeated]);
	expect(counts().unmounts).toBe(1);
	const reopen = manager.createUi(true);
	await flush();
	windows[1].show.resolve();
	await reopen;
	await manager.removeUi(true);
	expect(counts()).toEqual({ mounts: 2, unmounts: 2 });
});

test("titlebar closing blocks toggles and permits reopening after cleanup", async () => {
	const { manager, windows, initialization, counts } = await setup();
	initialization.resolve();
	const first = manager.createUi();
	await flush();
	windows[0].show.resolve();
	await first;
	const close = windows[0].closeWindowHandler();
	await manager.toggle();
	expect(windows).toHaveLength(1);
	windows[0].hide.resolve();
	await close;
	await flush();
	const reopen = manager.createUi();
	await flush();
	expect(windows).toHaveLength(2);
	windows[1].show.resolve();
	await reopen;
	expect(counts()).toEqual({ mounts: 2, unmounts: 1 });
});

test("opening failure cleans up and allows retry", async () => {
	const { manager, windows, initialization, counts } = await setup();
	initialization.resolve();
	const first = manager.createUi();
	await flush();
	windows[0].show.reject(new Error("animation failed"));
	await expect(first).rejects.toThrow("animation failed");
	expect(counts().unmounts).toBe(1);
	const retry = manager.createUi();
	await flush();
	windows[1].show.resolve();
	await retry;
	expect(windows).toHaveLength(2);
});

test("titlebar close during delayed content initialization cannot mount orphaned content", async () => {
	const data = deferred();
	const { manager, windows, initialization, counts } = await setup({ getCategory: () => data.promise });
	initialization.resolve();
	const first = manager.createUi();
	await flush();
	const close = windows[0].closeWindowHandler();
	windows[0].hide.resolve();
	await close;
	await flush();
	const reopen = manager.createUi();
	await flush();
	data.resolve([]);
	windows[1].show.resolve();
	await Promise.all([first, reopen]);
	expect(windows).toHaveLength(2);
	expect(counts()).toEqual({ mounts: 1, unmounts: 0 });
});

test("initialization failure before a window exists leaves settings usable", async () => {
	const { manager, windows, initialization } = await setup();
	const first = manager.createUi();
	initialization.reject(new Error("initialization failed"));
	await expect(first).rejects.toThrow("initialization failed");
	const retry = manager.createUi();
	expect(retry).not.toBe(first);
	await expect(retry).rejects.toThrow("initialization failed");
	expect(windows).toHaveLength(0);
});
