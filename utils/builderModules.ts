const esbuild = require("esbuild");
const path = require("path");

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
