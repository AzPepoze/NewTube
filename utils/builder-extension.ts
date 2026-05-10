import * as chokidar from "chokidar";
import dotenv from "dotenv";
import * as esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import * as fs from "fs-extra";
import * as path from "path";

import { esbuildAliases, esbuildExternals, esbuildLoaders } from "./shared/aliases";
import { processOutputDirectory } from "./shared/branding";
import { log } from "./shared/logger";
import { BUILD, DIST_CHROMIUM, DIST_FIREFOX, ensureDir, ENTRYPOINTS, extensionConfig, SRC, TEMP } from "./shared/paths";
import { createSvelteCompilerOptions } from "./shared/svelte";

dotenv.config();

const isProduction = () => process.argv.includes("--production") || process.argv.includes("--release");
const isOnce = () => process.argv.includes("--once") || process.argv.includes("--release");

let isBuilding = false;

async function generateBuildInFunctions() {
	const functionsListPath = path.join(SRC, "core/shared/extensionHelpers.ts");
	let functionsListData = "";

	if (fs.existsSync(functionsListPath)) {
		const functionsList = fs.readFileSync(functionsListPath, "utf8");
		const functionNames = [
			...new Set([...functionsList.matchAll(/\bexport\s+(?:async\s+)?function\s+(\w+)\s*\(/g)].map((x) => x[1])),
		];
		const wrappableFunctions = functionNames.filter(
			(name) => !new Set(["_call_function", "fireFunctionEventWithReturn", "onFunctionEvent"]).has(name),
		);

		functionsListData = wrappableFunctions
			.map(
				(name) =>
					`StyleShift["buildIn"]["${name}"] = async function(...args){return await StyleShift["buildIn"]["_call_function"]("${name}",...args)};`,
			)
			.join("\n");
	}

	const sharedJsPath = path.join(TEMP, "shared_bundled.js");
	let sharedCode = "";
	if (fs.existsSync(sharedJsPath)) {
		sharedCode = fs.readFileSync(sharedJsPath, "utf8");
	}

	return `(function() {
	var StyleShift = window.StyleShift || {};
	StyleShift["buildIn"] = StyleShift["buildIn"] || {};
	StyleShift["custom"] = StyleShift["custom"] || {};
	StyleShift["logger"] = StyleShift["logger"] || {
			info: (category, ...args) => console.log("%c StyleShift %c [INFO] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #00ffff", "color: #6a6a6a", ...args),
			warn: (category, ...args) => console.warn("%c StyleShift %c [WARN] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #ffae00", "color: #6a6a6a", ...args),
			error: (category, ...args) => console.error("%c StyleShift %c [ERROR] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #ff0000", "color: #6a6a6a", ...args),
			debug: (category, ...args) => console.debug("%c StyleShift %c [DEBUG] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #888888", "color: #6a6a6a", ...args),
		};
	var SharedScope = {};
	${sharedCode}
	if (typeof SharedScope === 'object') {
		for (var key in SharedScope) {
			if (typeof SharedScope[key] === 'function') StyleShift["buildIn"][key] = SharedScope[key];
		}
	}
	${functionsListData}
	window['StyleShift'] = StyleShift;
})();`;
}

export async function buildExtension() {
	log.step("Bundling extension...");

	try {
		ensureDir(BUILD);
		ensureDir(TEMP);
		ensureDir(path.join(BUILD, "assets/icons"));
		ensureDir(path.join(BUILD, "assets/fonts"));
		ensureDir(path.join(BUILD, "modules"));

		// 1. Background script
		log.info("Building background script...");
		await esbuild.build({
			entryPoints: [path.join(ENTRYPOINTS, "background.ts")],
			bundle: true,
			outfile: path.join(BUILD, "background.js"),
			platform: "browser",
			minify: isProduction(),
			alias: esbuildAliases,
		});

		// 2. Shared & Communication Functions
		log.info("Processing shared and communication functions...");
		const sharedEntryTs = path.join(TEMP, "shared_entry.ts");
		const sharedBundledJs = path.join(TEMP, "shared_bundled.js");
		const entryContent = `export * from "@core/shared/domHelpers";\nexport * from "@core/shared/eventHelpers";\nexport * from "@core/communication/webPage";`;
		fs.outputFileSync(sharedEntryTs, entryContent);

		await esbuild.build({
			entryPoints: [sharedEntryTs],
			bundle: true,
			outfile: sharedBundledJs,
			platform: "browser",
			minify: isProduction(),
			alias: esbuildAliases,
			keepNames: true,
			format: "iife",
			globalName: "SharedScope",
		});

		// 3. Build-in.js
		const buildInContent = await generateBuildInFunctions();
		await fs.writeFile(path.join(BUILD, "build-in.js"), buildInContent, "utf8");

		// 4. Main script bundle
		const mainScriptName = `${extensionConfig.name.toLowerCase()}.js`;
		log.info(`Bundling main script: ${mainScriptName}`);
		await esbuild.build({
			entryPoints: [path.join(SRC, "core/index.ts")],
			bundle: true,
			outfile: path.join(BUILD, mainScriptName),
			platform: "browser",
			minify: isProduction(),
			publicPath: "/",
			external: esbuildExternals,
			alias: esbuildAliases,
			plugins: [esbuildSvelte({ compilerOptions: createSvelteCompilerOptions() })],
			define: { imgbb_api_key: JSON.stringify(process.env.IMGBB_API_KEY || "") },
			loader: esbuildLoaders,
			assetNames: "assets/[name]",
		});

		// 5. Assets and Extension files
		log.info("Copying assets and extension files...");
		fs.copySync(ENTRYPOINTS, BUILD, {
			filter: (src) => !path.relative(ENTRYPOINTS, src).startsWith("modules") && !src.endsWith(".ts"),
		});
		if (fs.existsSync(path.join(SRC, "assets"))) {
			fs.copySync(path.join(SRC, "assets"), path.join(BUILD, "assets"));
		}

		// 6. Distribution
		log.info("Deploying to distribution folders...");
		fs.copySync(BUILD, DIST_CHROMIUM);
		fs.copySync(BUILD, DIST_FIREFOX);

		const firefoxWorkersPath = path.join(DIST_FIREFOX, "workers");
		ensureDir(firefoxWorkersPath);
		const workerEntries = [
			{ src: "extensions/youtube/features/videoAmbient/worker.ts", out: "videoAmbientWorker.js" },
			{ src: "extensions/youtube/features/removeBlackBars/worker.ts", out: "removeBlackBarsWorker.js" },
		];
		for (const entry of workerEntries) {
			const entryPath = path.join(SRC, entry.src);
			if (fs.existsSync(entryPath)) {
				await esbuild.build({
					entryPoints: [entryPath],
					bundle: true,
					outfile: path.join(firefoxWorkersPath, entry.out),
					platform: "browser",
					minify: isProduction(),
					alias: esbuildAliases,
				});
			}
		}

		await processOutputDirectory(DIST_CHROMIUM, false);
		await processOutputDirectory(DIST_FIREFOX, true);

		log.success("Extension build completed successfully!");
	} catch (error) {
		log.error("Build failed:", error);
		throw error;
	} finally {
		fs.removeSync(TEMP);
	}
}

async function build() {
	if (isBuilding) return;
	isBuilding = true;
	try {
		await buildExtension();
	} catch (_e) {}
	isBuilding = false;
}

export async function watchExtension() {
	log.info("Watching for changes...");
	chokidar.watch(SRC).on("all", async (event, pathInstance) => {
		console.log(`[${event}] ${path.basename(pathInstance)}`);
		await build();
	});
}

if (require.main === module) {
	if (isOnce()) {
		buildExtension().catch(() => process.exit(1));
	} else {
		build()
			.then(watchExtension)
			.catch(() => process.exit(1));
	}
}
