const esbuild = require("esbuild");
const chokidar = require("chokidar");
const fs = require("fs-extra");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

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

async function replace_for_firefox(file_path) {
	try {
		const data = await fs.readFile(file_path, "utf8");

		if (!file_path.endsWith(".css") && !file_path.endsWith(".js")) {
			console.log(`Skipping file '${file_path}'`);
			return;
		}

		const modified_content = await replace_for_firefox_text(data);
		await fs.writeFile(file_path, modified_content, "utf8");
		console.log(`File '${get_file_name_from_path(file_path)}' updated successfully!`);
	} catch (err: any) {
		console.error("Error:", err.message);
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
				(_, async_keyword) => `StyleShift["Build-in"]["${name}"] = ${async_keyword || ""}function (`
			)
			.replace(call_regex, `StyleShift["Build-in"]["${name}"](`);
	});

	return code;
}

async function generate_build_in_functions(build_path) {
	const functions_list = fs.readFileSync(
		path.join(__dirname, "../src/styleshift/build-in-functions/extension.ts"),
		"utf-8"
	);

	const function_names = [
		...new Set([...functions_list.matchAll(/\bexport (async\s*function|function)?\s*(\w+)\(/g)].map((x) => x[2])),
	];

	const functions_list_data = function_names
		.map(
			(name) =>
				`StyleShift["Build-in"]["${name}"] = async function(...args){return await StyleShift["Build-in"]["_Call_Function"]("${name}",...args)};`
		)
		.join("");

	const normal_functions = await fs.readFile(path.join(__dirname, "../temp/normal.js"), "utf8");
	const build_in_functions = await fs.readFile(path.join(build_path, "build-in.js"), "utf8");

	return `StyleShift = {"Build-in":{},"Custom":{}};${normal_functions}${build_in_functions.replace(
		/\n/g,
		""
	)}${functions_list_data}window['StyleShift'] = StyleShift;`;
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
			define: {
				imgbb_api_key: JSON.stringify(process.env.IMGBB_API_KEY || ""),
			},
			loader: {
				".ttf": "file",
			},
		});

		// Process functions
		fs.copySync(
			path.join(__dirname, "../src/styleshift/build-in-functions/normal.ts"),
			path.join(temp_path, "normal.ts")
		);

		const code_path = path.join(temp_path, "normal.ts");
		const processed_code = await process_functions(code_path);
		fs.writeFileSync(code_path, processed_code);

		// Build processed functions
		await esbuild.build({
			entryPoints: [path.join(temp_path, "normal.ts")],
			outfile: path.join(temp_path, "normal.js"),
			platform: "browser",
			minify: is_production,
			keepNames: true,
		});

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/styleshift/communication/web-page.ts")],
			outfile: path.join(build_path, "build-in.js"),
			platform: "browser",
		});

		// Generate and write build-in functions
		const build_in_functions_data = await generate_build_in_functions(build_path);
		await fs.writeFile(path.join(build_path, "build-in.js"), build_in_functions_data, "utf8");

		// Create distribution builds
		const chromium_path = path.join(__dirname, "../out/dist/chromium");
		const firefox_path = path.join(__dirname, "../out/dist/firefox");

		// fs.removeSync(chromium_path);
		// fs.removeSync(firefox_path);

		fs.copySync(build_path, chromium_path);
		fs.copySync(build_path, firefox_path);

		// Process Firefox-specific files
		await replace_for_firefox(path.join(firefox_path, "style.css"));
		await replace_for_firefox(path.join(firefox_path, "styleshift.js"));

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
