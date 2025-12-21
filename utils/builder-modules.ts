const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

function file_content_replace(file_path, search_regex, replacement) {
	try {
		let content = fs.readFileSync(file_path, "utf8");
		content = content.replace(search_regex, replacement);
		fs.writeFileSync(file_path, content, "utf8");
		console.log(`Updated content in ${file_path}`);
	} catch (err) {
		console.error(`Error updating file ${file_path}:`, err);
	}
}

const worker_entry_points = [
	"vs/editor/editor.worker.js",
	"vs/language/css/css.worker.js",
	"vs/language/typescript/ts.worker.js",
];

(async () => {
	await esbuild.build({
		entryPoints: worker_entry_points.map((entry) =>
			path.join(__dirname, `../node_modules/monaco-editor/esm/${entry}`)
		),
		bundle: true,
		format: "iife",
		outdir: path.join(__dirname, "../out/build/modules/monaco"),
		minify: true,
		loader: {
			".ttf": "file",
		},
	});

	await esbuild.build({
		entryPoints: [path.join(__dirname, "../src/extension/modules/monaco.js")],
		bundle: true,
		format: "esm",
		outfile: path.join(__dirname, "../out/build/modules/monaco.js"),
		minify: false,
		loader: {
			".ttf": "file",
		},
	});

	await esbuild.build({
		entryPoints: [path.join(__dirname, "../src/extension/modules/jszip.js")],
		bundle: true,
		format: "esm",
		outfile: path.join(__dirname, "../out/build/modules/jszip.js"),
		minify: true,
	});

	function get_local_themes() {
		const themes_dir = path.join(__dirname, "../node_modules/monaco-themes/themes");
		const themes = {};

		fs.readdirSync(themes_dir).forEach((file) => {
			if (file.endsWith(".json") && file != "themelist.json") {
				const theme_content = JSON.parse(fs.readFileSync(path.join(themes_dir, file), "utf8"));
				themes[file.replace(".json", "")] = theme_content;
			}
		});

		return themes;
	}

	file_content_replace(
		path.join(__dirname, "../out/build/modules/monaco.js"),
		/"Monaco_All_Themes"/g,
		JSON.stringify(get_local_themes())
	);
})();

export {};
