const esbuild = require("esbuild");
const esbuildSvelte = require("esbuild-svelte");
const chokidar = require("chokidar");
const fs = require("fs-extra");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const config = require("../extension.config.json");

/*
-------------------------------------------------------
Configuration
-------------------------------------------------------
*/
const args = process.argv.slice(2);
const isProduction = args.includes("--production");
const isOnce = args.includes("--once");

/*
-------------------------------------------------------
Utils Functions
-------------------------------------------------------
*/
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

/*
-------------------------------------------------------
Firefox Compatibility Functions
-------------------------------------------------------
*/
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

async function processFileReplacements(filePath, isFirefox = false) {
	try {
		let content = await fs.readFile(filePath, "utf8");

		if (
			!filePath.endsWith(".css") &&
			!filePath.endsWith(".js") &&
			!filePath.endsWith(".json") &&
			!filePath.endsWith(".html")
		) {
			return;
		}

		// Always replace branding
		content = await replaceBranding(content);

		// Firefox specific
		if (isFirefox) {
			if (filePath.endsWith(".css") || filePath.endsWith(".js")) {
				content = await replaceForFirefoxText(content);
			}

			if (filePath.endsWith("manifest.json")) {
				const manifest = JSON.parse(content);
				if (manifest.background && manifest.background.service_worker) {
					manifest.background.scripts = [manifest.background.service_worker];
					delete manifest.background.service_worker;
				}
				content = JSON.stringify(manifest, null, "\t");
			}
		}

		await fs.writeFile(filePath, content, "utf8");
		console.log(`Processed: ${getFileNameFromPath(filePath)} ${isFirefox ? "(Firefox)" : ""}`);
	} catch (err: any) {
		console.error("Error processing file:", err.message);
	}
}

/*
-------------------------------------------------------
Build Functions
-------------------------------------------------------
*/
async function processFunctions(codePath) {
	let code = await fs.readFile(codePath, "utf8");
	const functionNames = [];

	code = code.replace(/\bexport\s+(async\s+)?function\s+([\w$]+)\s*\(/g, (_, asyncKeyword, name) => {
		functionNames.push(name);
		return `${asyncKeyword || ""}function ${name}(`;
	});

	functionNames.forEach((name) => {
		const wrapRegex = new RegExp(`\\b(async\\s+)?function\\s+${name}\\s*\\(`, "g");
		const callRegex = new RegExp(`\\b${name}\\s*\\(`, "g");
		code = code
			.replace(
				wrapRegex,
				(_, asyncKeyword) => `StyleShift["build-in"]["${name}"] = ${asyncKeyword || ""}function (`,
			)
			.replace(callRegex, `StyleShift["build-in"]["${name}"](`);
	});

	return code;
}

async function generateBuildInFunctions(buildPath) {
	const functionsList = fs.readFileSync(path.join(__dirname, "../src/styleshift/shared/extension.ts"), "utf-8");

	const functionNames = [
		...new Set([...functionsList.matchAll(/\bexport\s+(?:async\s+)?function\s+(\w+)\s*\(/g)].map((x) => x[1])),
	];

	const functionsListData = functionNames
		.map(
			(name) =>
				`StyleShift["build-in"]["${name}"] = async function(...args){return await StyleShift["build-in"]["_call_function"]("${name}",...args)};`,
		)
		.join("");

	const normalFunctions = await fs.readFile(path.join(__dirname, "../temp/normal.js"), "utf8");
	const buildInFunctions = await fs.readFile(path.join(buildPath, "build-in.js"), "utf8");

	return `var StyleShift = window.StyleShift || {};
	StyleShift["build-in"] = StyleShift["build-in"] || {};
	StyleShift["Custom"] = StyleShift["Custom"] || {};
	StyleShift["logger"] = StyleShift["logger"] || {
			info: (category, ...args) => console.log("%c StyleShift %c [INFO] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #00ffff", "color: #6a6a6a", ...args),
			warn: (category, ...args) => console.warn("%c StyleShift %c [WARN] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #ffae00", "color: #6a6a6a", ...args),
			error: (category, ...args) => console.error("%c StyleShift %c [ERROR] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #ff0000", "color: #6a6a6a", ...args),
			debug: (category, ...args) => console.debug("%c StyleShift %c [DEBUG] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #888888", "color: #6a6a6a", ...args),
		};
	(() => { ${normalFunctions} })();
	(() => { ${buildInFunctions} })();
	${functionsListData}
	window['StyleShift'] = StyleShift;`;
}

/*
-------------------------------------------------------
Main Build Process
-------------------------------------------------------
*/
let isBuilding = false;

async function build() {
	if (isBuilding) return;
	isBuilding = true;

	try {
		console.log("Building");
		const buildPath = path.join(__dirname, "../out/build");
		const tempPath = path.join(__dirname, "../temp");

		// Ensure directories exist
		fs.ensureDirSync(path.join(buildPath, "workers"));
		fs.ensureDirSync(path.join(buildPath, "assets/icons"));
		fs.ensureDirSync(path.join(buildPath, "modules"));

		// Copy extension files (excluding modules, they are handled separately or by builderModules)
		fs.copySync(path.join(__dirname, "../src/extension"), buildPath, {
			filter: (src) => {
				const relativePath = path.relative(path.join(__dirname, "../src/extension"), src);
				return (
					!relativePath.startsWith("modules") &&
					!relativePath.startsWith("icon") &&
					!relativePath.startsWith("asset")
				);
			},
		});

		// Copy icons and assets to the new structure
		if (fs.existsSync(path.join(__dirname, "../src/extension/icon"))) {
			fs.copySync(path.join(__dirname, "../src/extension/icon"), path.join(buildPath, "assets/icons"));
		}
		if (fs.existsSync(path.join(__dirname, "../src/extension/asset"))) {
			fs.copySync(path.join(__dirname, "../src/extension/asset"), path.join(buildPath, "assets"));
		}

		// Build main bundle
		const brandingPlugin = {
			name: "branding",
			setup(buildInstance) {
				buildInstance.onEnd(async (_result) => {
					const outfile = buildInstance.initialOptions.outfile;
					if (outfile && fs.existsSync(outfile)) {
						let content = await fs.readFile(outfile, "utf8");
						content = content.replace(/StyleShift/g, config.name);
						content = content.replace(/STYLESHIFT/g, config.code_name);
						content = content.replace(/styleshift/g, config.name.toLowerCase());
						await fs.writeFile(outfile, content, "utf8");
					}
				});
			},
		};

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/styleshift/run.ts")],
			bundle: true,
			outfile: path.join(buildPath, `${config.name.toLowerCase()}.js`),
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
			],
			alias: {
				"@": path.join(__dirname, "../src"),
				"@main": path.join(__dirname, "../src"), // Replaced @main with root src for consistency
				"@styleshift": path.join(__dirname, "../src/styleshift"),
				"@core": path.join(__dirname, "../src/styleshift/core"),
				"@ui": path.join(__dirname, "../src/styleshift/ui"),
				"@settings": path.join(__dirname, "../src/styleshift/settings"),
				"@functions": path.join(__dirname, "../src/styleshift/shared"),
			},
			plugins: [
				esbuildSvelte({
					compilerOptions: {
						css: "injected",
					},
				}),
				brandingPlugin,
			],
			define: {
				imgbb_api_key: JSON.stringify(process.env.IMGBB_API_KEY || ""),
			},
			loader: {
				".ttf": "file",
				".svg": "file",
				".png": "file",
			},
			assetNames: "assets/[name]",
		});

		// Build video background worker
		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/main/features/videoBackgroundWorker.ts")],
			bundle: true,
			outfile: path.join(buildPath, "workers/videoBackgroundWorker.js"),
			platform: "browser",
			minify: isProduction,
			plugins: [brandingPlugin],
		});

		// Build remove black bars worker
		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/main/features/removeBlackBarsWorker.ts")],
			bundle: true,
			outfile: path.join(buildPath, "workers/removeBlackBarsWorker.js"),
			platform: "browser",
			minify: isProduction,
			plugins: [brandingPlugin],
		});

		// Process functions
		fs.copySync(path.join(__dirname, "../src/styleshift/shared/normal.ts"), path.join(tempPath, "normal.ts"));

		const codePath = path.join(tempPath, "normal.ts");
		const processedCode = await processFunctions(codePath);
		fs.writeFileSync(codePath, processedCode);

		// Build processed functions
		await esbuild.build({
			entryPoints: [path.join(tempPath, "normal.ts")],
			bundle: false,
			outfile: path.join(tempPath, "normal.js"),
			platform: "browser",
			minify: isProduction,
			keepNames: true,
		});

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/styleshift/communication/webPage.ts")],
			bundle: false,
			outfile: path.join(buildPath, "build-in.js"),
			platform: "browser",
		});

		// Generate and write build-in functions
		const buildInFunctionsData = await generateBuildInFunctions(buildPath);
		await fs.writeFile(path.join(buildPath, "build-in.js"), buildInFunctionsData, "utf8");

		// Create distribution builds
		const chromiumPath = path.join(__dirname, "../out/dist/chromium");
		const firefoxPath = path.join(__dirname, "../out/dist/firefox");

		fs.copySync(buildPath, chromiumPath);
		fs.copySync(buildPath, firefoxPath);

		// Post-process distribution files
		async function processDir(dir, isFirefox) {
			const files = fs.readdirSync(dir);
			for (const file of files) {
				const fullPath = path.join(dir, file);
				if (fs.statSync(fullPath).isDirectory()) {
					await processDir(fullPath, isFirefox);
				} else {
					await processFileReplacements(fullPath, isFirefox);

					// Rename file if it contains 'styleshift'
					if (file.includes("styleshift")) {
						const newFileName = file.replace("styleshift", config.name.toLowerCase());
						const newPath = path.join(dir, newFileName);
						fs.renameSync(fullPath, newPath);
					}
				}
			}
		}

		await processDir(chromiumPath, false);
		await processDir(firefoxPath, true);

		console.log("Built!");
		console.log("--------------------------------");
	} catch (error) {
		console.error("Build Error:", error);
		console.log("Retrying build in 500ms...");
		setTimeout(build, 500);
	} finally {
		isBuilding = false;
		try {
			fs.removeSync(path.join(__dirname, "../temp"));
		} catch (error) {
			console.error("Cleanup Error:", error);
			setTimeout(() => fs.removeSync(path.join(__dirname, "../temp")), 500);
		}
	}
}

/*
-------------------------------------------------------
Build Process Initialization
-------------------------------------------------------
*/
if (isOnce) {
	build();
} else {
	chokidar.watch(path.join(__dirname, "../src")).on("all", async (event, pathInstance: string) => {
		console.log(event, getFileNameFromPath(pathInstance));
		await build();
	});
}

export {};
