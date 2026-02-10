const esbuild = require("esbuild");
const esbuild_svelte = require("esbuild-svelte");
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
const is_production = args.includes("--production");
const is_once = args.includes("--once");

/*
-------------------------------------------------------
Utils Functions
-------------------------------------------------------
*/
function get_file_name_from_path(file_path) {
	const parts = file_path.split("/");
	return parts[parts.length - 1];
}

async function replace_branding(content: string): Promise<string> {
	return content
		.replace(/STYLESHIFT/g, config.code_name)
		.replace(/StyleShift/g, config.name);
}

/*
-------------------------------------------------------
Firefox Compatibility Functions
-------------------------------------------------------
*/
async function replace_for_firefox_text(content: string): Promise<string> {
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

async function process_file_replacements(file_path, is_firefox = false) {
	try {
		let content = await fs.readFile(file_path, "utf8");

		if (!file_path.endsWith(".css") && !file_path.endsWith(".js") && !file_path.endsWith(".json") && !file_path.endsWith(".html")) {
			return;
		}

		// Always replace branding
		content = await replace_branding(content);

		// Firefox specific
		if (is_firefox && (file_path.endsWith(".css") || file_path.endsWith(".js"))) {
			content = await replace_for_firefox_text(content);
		}

		await fs.writeFile(file_path, content, "utf8");
		console.log(`Processed: ${get_file_name_from_path(file_path)} ${is_firefox ? "(Firefox)" : ""}`);
	} catch (err: any) {
		console.error("Error processing file:", err.message);
	}
}

/*
-------------------------------------------------------
Build Functions
-------------------------------------------------------
*/
async function process_functions(code_path) {
	let code = await fs.readFile(code_path, "utf8");
	const function_names = [];

	code = code.replace(/\bexport\s+(async\s+)?function\s+([\w$]+)\s*\(/g, (_, async_keyword, name) => {
		function_names.push(name);
		return `${async_keyword || ""}function ${name}(`;
	});

	function_names.forEach((name) => {
		const wrap_regex = new RegExp(`\\b(async\\s+)?function\\s+${name}\\s*\\(`, "g");
		const call_regex = new RegExp(`\\b${name}\\s*\\(`, "g");
		code = code
			.replace(
				wrap_regex,
				(_, async_keyword) => `StyleShift["build-in"]["${name}"] = ${async_keyword || ""}function (`,
			)
			.replace(call_regex, `StyleShift["build-in"]["${name}"](`);
	});

	return code;
}

async function generate_build_in_functions(build_path) {
	const functions_list = fs.readFileSync(
		path.join(__dirname, "../src/styleshift/buildInFunctions/extension.ts"),
		"utf-8",
	);

	const function_names = [
		...new Set([...functions_list.matchAll(/\bexport (async\s*function|function)?\s*(\w+)\(/g)].map((x) => x[2])),
	];

	const functions_list_data = function_names
		.map(
			(name) =>
				`StyleShift["build-in"]["${name}"] = async function(...args){return await StyleShift["build-in"]["_call_function"]("${name}",...args)};`,
		)
		.join("");

	const normal_functions = await fs.readFile(path.join(__dirname, "../temp/normal.js"), "utf8");
	const build_in_functions = await fs.readFile(path.join(build_path, "build-in.js"), "utf8");

	return `var StyleShift = window.StyleShift || {
		"build-in":{},
		"Custom":{},
		"logger": {
			info: (category, ...args) => console.log("%c StyleShift %c [INFO] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #00ffff", "color: #6a6a6a", ...args),
			warn: (category, ...args) => console.warn("%c StyleShift %c [WARN] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #ffae00", "color: #6a6a6a", ...args),
			error: (category, ...args) => console.error("%c StyleShift %c [ERROR] %c [" + category.toUpperCase() + "]", "color: #bada55", "color: #ff0000", "color: #6a6a6a", ...args),
		}
	};
	(() => { ${normal_functions} })();
	(() => { ${build_in_functions} })();
	${functions_list_data}
	window['StyleShift'] = StyleShift;`;
}

/*
-------------------------------------------------------
Main Build Process
-------------------------------------------------------
*/
let is_building = false;

async function build() {
	if (is_building) return;
	is_building = true;

	try {
		console.log("Building");
		const build_path = path.join(__dirname, "../out/build");
		const temp_path = path.join(__dirname, "../temp");

		// Copy extension files
		fs.copySync(path.join(__dirname, "../src/extension"), build_path, {
			filter: (src) => {
				const relative_path = path.relative(path.join(__dirname, "../src/extension"), src);
				return !relative_path.startsWith("modules");
			},
		});

		// Build main bundle
		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/styleshift/run.ts")],
			bundle: true,
			outfile: path.join(build_path, "styleshift.js"),
			platform: "browser",
			minify: is_production,
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
				"@main": path.join(__dirname, "../src/main"),
				"@styleshift": path.join(__dirname, "../src/styleshift"),
				"@core": path.join(__dirname, "../src/styleshift/core"),
				"@ui": path.join(__dirname, "../src/styleshift/ui"),
				"@settings": path.join(__dirname, "../src/styleshift/settings"),
				"@functions": path.join(__dirname, "../src/styleshift/buildInFunctions"),
			},
			plugins: [
				esbuild_svelte({
					compilerOptions: {
						css: "injected",
					},
				}),
			],
			define: {
				imgbb_api_key: JSON.stringify(process.env.IMGBB_API_KEY || ""),
			},
			loader: {
				".ttf": "file",
				".svg": "file",
			},
		});

		// Process functions
		fs.copySync(
			path.join(__dirname, "../src/styleshift/buildInFunctions/normal.ts"),
			path.join(temp_path, "normal.ts"),
		);

		const code_path = path.join(temp_path, "normal.ts");
		const processed_code = await process_functions(code_path);
		fs.writeFileSync(code_path, processed_code);

		// Build processed functions
		await esbuild.build({
			entryPoints: [path.join(temp_path, "normal.ts")],
			bundle: false,
			outfile: path.join(temp_path, "normal.js"),
			platform: "browser",
			minify: is_production,
			keepNames: true,
		});

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/styleshift/communication/webPage.ts")],
			bundle: false,
			outfile: path.join(build_path, "build-in.js"),
			platform: "browser",
		});

		// Generate and write build-in functions
		const build_in_functions_data = await generate_build_in_functions(build_path);
		await fs.writeFile(path.join(build_path, "build-in.js"), build_in_functions_data, "utf8");

		// Create distribution builds
		const chromium_path = path.join(__dirname, "../out/dist/chromium");
		const firefox_path = path.join(__dirname, "../out/dist/firefox");

		fs.copySync(build_path, chromium_path);
		fs.copySync(build_path, firefox_path);

		// Post-process distribution files
		async function process_dir(dir, is_firefox) {
			const files = fs.readdirSync(dir);
			for (const file of files) {
				const full_path = path.join(dir, file);
				if (fs.statSync(full_path).isDirectory()) {
					await process_dir(full_path, is_firefox);
				} else {
					await process_file_replacements(full_path, is_firefox);
				}
			}
		}

		await process_dir(chromium_path, false);
		await process_dir(firefox_path, true);

		console.log("Built!");
		console.log("--------------------------------");
	} catch (error) {
		console.error("Build Error:", error);
		console.log("Retrying build in 500ms...");
		setTimeout(build, 500);
	} finally {
		is_building = false;
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
if (is_once) {
	build();
} else {
	chokidar.watch(path.join(__dirname, "../src")).on("all", async (event, path: string) => {
		console.log(event, get_file_name_from_path(path));
		await build();
	});
}

export {};
