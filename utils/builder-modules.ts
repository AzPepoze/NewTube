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

(async () => {
	await esbuild.build({
		entryPoints: [path.join(__dirname, "../src/extension/modules/jszip.js")],
		bundle: true,
		format: "esm",
		outfile: path.join(__dirname, "../out/build/modules/jszip.js"),
		minify: true,
	});

	await esbuild.build({
		entryPoints: [path.join(__dirname, "../src/extension/modules/codemirror.js")],
		bundle: true,
		format: "esm",
		outfile: path.join(__dirname, "../out/build/modules/codemirror.js"),
		minify: true,
	});
})();

export {};
