import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import chokidar from "chokidar";
import fs from "fs-extra";
import path from "path";
import { createHash } from "crypto";
import dotenv from "dotenv";

dotenv.config();

import config from "../extension.config.json";

/*
-------------------------------------------------------
Configuration & Globals
-------------------------------------------------------
*/
const args = process.argv.slice(2);
const isProduction = args.includes("--production");
const isOnce = args.includes("--once");

const BUILD_PATH = path.join(__dirname, "../out/build");
const TEMP_PATH = path.join(__dirname, "../temp");
const CHROMIUM_PATH = path.join(__dirname, "../out/dist/chromium");
const FIREFOX_PATH = path.join(__dirname, "../out/dist/firefox");
const REPO_ROOT = path.resolve(__dirname, "..");

/*
-------------------------------------------------------
Plugins & Utils
-------------------------------------------------------
*/
const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	cyan: "\x1b[36m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	magenta: "\x1b[35m",
};

const log = {
	info: (msg: string) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
	success: (msg: string) => console.log(`${colors.green}✔${colors.reset} ${msg}`),
	warn: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
	error: (msg: string, err?: any) => {
		console.error(`${colors.red}✘${colors.reset} ${msg}`);
		if (err) console.error(err);
	},
	step: (msg: string) => console.log(`${colors.bright}${colors.magenta}➜${colors.reset} ${msg}`),
};


function getFileNameFromPath(filePath) {
	const parts = filePath.split("/");
	return parts[parts.length - 1];
}

async function replaceBranding(content: string): Promise<string> {
	return content
		.replace(/STYLESHIFT/g, config.code_name)
		.replace(/StyleShift/g, config.name)
		.replace(/styleshift/g, config.name.toLowerCase());
}

async function replaceForFirefoxText(content: string): Promise<string> {
	const replacements = [
		{ from: /webkit-fill/g, to: "moz" },
		{ from: /-webkit-mask-box/g, to: "mask" },
		{ from: /webkit-slider-runnable-track/g, to: "moz-range-track" },
		{ from: /webkit-slider-thumb/g, to: "moz-range-thumb" },
		{ from: /webkit/g, to: "moz" },
		{ from: /nowrap/g, to: "pre" },
	];
	return replacements.reduce((text, { from, to }) => text.replace(from, to), content);
}

const commonLoader = {
	".ttf": "file",
	".woff": "file",
	".woff2": "file",
	".eot": "file",
	".png": "file",
} as const;

const commonAlias = {
	"@": path.join(__dirname, "../src"),
	"@main": path.join(__dirname, "../src"),
	"@styleshift": path.join(__dirname, "../src/styleshift"),
	"@core": path.join(__dirname, "../src/styleshift/core"),
	"@ui": path.join(__dirname, "../src/styleshift/ui"),
	"@settings": path.join(__dirname, "../src/styleshift/settings"),
	"@functions": path.join(__dirname, "../src/styleshift/shared"),
};

function createSvelteCompilerOptions() {
	const getStableSvelteHashInput = (filename: string, name: string, css: string): string => {
		const normalizedFilename = filename.replace(/\\/g, "/").toLowerCase();
		let normalizedPath = normalizedFilename;

		if (path.isAbsolute(filename)) {
			const relativePath = path.relative(REPO_ROOT, filename).replace(/\\/g, "/").toLowerCase();
			if (!relativePath.startsWith("..")) normalizedPath = relativePath;
		}

		return `${normalizedPath}|${name}|${css}`;
	};

	return {
		css: "injected" as const,
		cssHash: ({ filename, name, css }: { filename: string; name: string; css: string }) => {
			const seed = getStableSvelteHashInput(filename, name, css);
			const stableHash = createHash("sha256").update(seed).digest("hex").slice(0, 8);
			return `svelte-${stableHash}`;
		},
	};
}

/*
-------------------------------------------------------
Build Helpers
-------------------------------------------------------
*/
async function generateBuildInFunctions(_buildPath) {
	const functionsListPath = path.join(__dirname, "../src/styleshift/shared/extension.ts");
	let functionsListData = "";

	if (fs.existsSync(functionsListPath)) {
		const functionsList = fs.readFileSync(functionsListPath, "utf8");
		const functionNames = [...new Set([...functionsList.matchAll(/\bexport\s+(?:async\s+)?function\s+(\w+)\s*\(/g)].map((x) => x[1]))];
		const wrappableFunctions = functionNames.filter((name) => !new Set(["_call_function", "fireFunctionEventWithReturn", "onFunctionEvent"]).has(name));

		functionsListData = wrappableFunctions
			.map((name) => `StyleShift["buildIn"]["${name}"] = async function(...args){return await StyleShift["buildIn"]["_call_function"]("${name}",...args)};`)
			.join("\n");
	}

	const sharedJsPath = path.join(TEMP_PATH, "shared_bundled.js");
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
	
	// Inject Bundled Shared & WebPage Logic
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

async function processFileReplacements(filePath, isFirefox = false) {
	try {
		let content = await fs.readFile(filePath, "utf8");
		if (![".css", ".js", ".json", ".html"].some(fileExtension => filePath.endsWith(fileExtension))) return;

		content = await replaceBranding(content);
		if (isFirefox) {
			if (filePath.endsWith(".css") || filePath.endsWith(".js")) content = await replaceForFirefoxText(content);
			if (filePath.endsWith("manifest.json")) {
				const manifest = JSON.parse(content);
				if (manifest.background?.service_worker) {
					manifest.background.scripts = [manifest.background.service_worker];
					delete manifest.background.service_worker;
				}
				if (manifest.web_accessible_resources?.[0]) {
					if (!manifest.web_accessible_resources[0].resources.includes("workers/*")) {
						manifest.web_accessible_resources[0].resources.push("workers/*");
					}
				}
				content = JSON.stringify(manifest, null, "\t");
			}
		}
		await fs.writeFile(filePath, content, "utf8");
	} catch (err: any) {
		log.error(`Error processing ${filePath}:`, err.message);
	}
}

/*
-------------------------------------------------------
Main Build Function
-------------------------------------------------------
*/
let isBuilding = false;

async function build() {
	if (isBuilding) return;
	isBuilding = true;
	log.step("Initializing build...");

	try {
		fs.ensureDirSync(BUILD_PATH);
		fs.ensureDirSync(TEMP_PATH);
		fs.ensureDirSync(path.join(BUILD_PATH, "assets/icons"));
		fs.ensureDirSync(path.join(BUILD_PATH, "assets/fonts"));
		fs.ensureDirSync(path.join(BUILD_PATH, "modules"));

		// 1. Background script
		log.info("Building background script...");
		const backgroundPath = path.join(BUILD_PATH, "background.js");
		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/extension/background.ts")],
			bundle: true,
			outfile: backgroundPath,
			platform: "browser",
			minify: isProduction,
		});
		log.success(`Background script built: ${getFileNameFromPath(backgroundPath)}`);

		// 2. Shared & Communication Functions (Bundled together)
		log.info("Processing shared and communication functions...");
		const sharedEntryTs = path.join(TEMP_PATH, "shared_entry.ts");
		const sharedBundledJs = path.join(TEMP_PATH, "shared_bundled.js");

		const entryContent = `
			export * from "@functions/normal";
			export * from "@functions/advance";
			export * from "@styleshift/communication/webPage";
		`;
		fs.outputFileSync(sharedEntryTs, entryContent);

		await esbuild.build({
			entryPoints: [sharedEntryTs],
			bundle: true,
			outfile: sharedBundledJs,
			platform: "browser",
			minify: isProduction,
			alias: commonAlias,
			keepNames: true,
			format: "iife",
			globalName: "SharedScope",
		});
		log.success("Shared logic bundled.");

		// 3. Build-in.js Generation
		const buildInPath = path.join(BUILD_PATH, "build-in.js");
		const buildInContent = await generateBuildInFunctions(BUILD_PATH);
		await fs.writeFile(buildInPath, buildInContent, "utf8");
		log.success(`Build-in script generated: ${getFileNameFromPath(buildInPath)}`);

		// 4. Main script bundle
		const mainScriptName = `${config.name.toLowerCase()}.js`;
		log.info(`Bundling main script: ${mainScriptName}`);
		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/styleshift/index.ts")],
			bundle: true,
			outfile: path.join(BUILD_PATH, mainScriptName),
			platform: "browser",
			minify: isProduction,
			publicPath: "/",
			external: [
				"jszip",
				"codemirror",
				"@codemirror/view",
				"@codemirror/state",
				"@codemirror/lang-javascript",
				"@codemirror/lang-css",
				"@codemirror/theme-one-dark",
				"@codemirror/autocomplete",
			],
			alias: commonAlias,
			plugins: [esbuildSvelte({ compilerOptions: createSvelteCompilerOptions() })],
			define: { imgbb_api_key: JSON.stringify(process.env.IMGBB_API_KEY || "") },
			loader: commonLoader,
			assetNames: "assets/[name]",
		});
		log.success("Main script bundled with Svelte components.");

		// 5. Assets and Extension files
		log.info("Copying assets and extension files...");
		fs.copySync(path.join(__dirname, "../src/extension"), BUILD_PATH, {
			filter: (src) => !path.relative(path.join(__dirname, "../src/extension"), src).startsWith("modules") && !src.endsWith(".ts"),
		});
		if (fs.existsSync(path.join(__dirname, "../src/assets"))) {
			fs.copySync(path.join(__dirname, "../src/assets"), path.join(BUILD_PATH, "assets"));
		}

		// 6. Distribution
		log.info("Deploying to distribution folders...");
		fs.copySync(BUILD_PATH, CHROMIUM_PATH);
		fs.copySync(BUILD_PATH, FIREFOX_PATH);
		log.info("Processed Chromium and Firefox distributions.");

		const firefoxWorkersPath = path.join(FIREFOX_PATH, "workers");
		fs.ensureDirSync(firefoxWorkersPath);
		const workerEntries = [
			{ src: "../src/main/features/videoAmbient/worker.ts", out: "videoAmbientWorker.js" },
			{ src: "../src/main/features/removeBlackBars/worker.ts", out: "removeBlackBarsWorker.js" }
		];
		for (const entry of workerEntries) {
			const entryPath = path.join(__dirname, entry.src);
			if (fs.existsSync(entryPath)) {
				await esbuild.build({
					entryPoints: [entryPath],
					bundle: true,
					outfile: path.join(firefoxWorkersPath, entry.out),
					platform: "browser",
					minify: isProduction,
				});
			}
		}

		const processDir = async (dir, isFirefox) => {
			for (const file of fs.readdirSync(dir)) {
				const fullPath = path.join(dir, file);
				if (fs.statSync(fullPath).isDirectory()) await processDir(fullPath, isFirefox);
				else {
					await processFileReplacements(fullPath, isFirefox);
					if (file.includes("styleshift")) {
						fs.renameSync(fullPath, path.join(dir, file.replace("styleshift", config.name.toLowerCase())));
					}
				}
			}
		};
		await processDir(CHROMIUM_PATH, false);
		await processDir(FIREFOX_PATH, true);

		log.success("Build completed successfully!");
	} catch (error) {
		log.error("Build failed:", error);
		if (!isOnce) {
			log.info("Retrying in 1s...");
			setTimeout(build, 1000);
		}
	} finally {
		try {
			fs.removeSync(TEMP_PATH);
		} catch (e) {
			log.warn("Failed to remove temp directory:" + e);
		}
		isBuilding = false;
	}
}

/*
-------------------------------------------------------
Build Process Initialization
-------------------------------------------------------
*/
if (isOnce) build();
else {
	chokidar.watch(path.join(__dirname, "../src")).on("all", async (event, pathInstance) => {
		if (isBuilding) return;
		console.log(`${colors.dim}[${event}]${colors.reset} ${getFileNameFromPath(pathInstance)}`);
		await build();
	});
}

export { };
