
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

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

	const fontsDir = path.join(__dirname, "../node_modules/material-icons/iconfont");
	const outFontsDir = path.join(__dirname, "../out/build/assets/fonts");

	// Ensure fonts directory exists
	if (!fs.existsSync(outFontsDir)) {
		fs.mkdirSync(outFontsDir, { recursive: true });
	}

	try {
		const src = path.join(fontsDir, "material-icons.woff2");
		const dst = path.join(outFontsDir, "material-icons.woff2");
		fs.copyFileSync(src, dst);
		console.log(`✓ Copied material-icons.woff2 to assets/fonts`);
	} catch (err: any) {
		console.error(`✗ Failed to copy material-icons.woff2:`, err.message);
	}
})();

export { };
