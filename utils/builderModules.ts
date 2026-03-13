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

	// Copy Material Icons fonts to output directory (used by injectMaterialIconsStyles in styleSheet.ts)
	const fontsDir = path.join(__dirname, "../node_modules/material-icons/iconfont");
	const outFontsDir = path.join(__dirname, "../out/build/assets/fonts");

	// Ensure fonts directory exists
	if (!fs.existsSync(outFontsDir)) {
		fs.mkdirSync(outFontsDir, { recursive: true });
	}

	// Copy Material Icons font files
	const fontFiles = fs.readdirSync(fontsDir).filter(f => f.match(/\.(woff|woff2|ttf)$/));
	fontFiles.forEach(file => {
		const src = path.join(fontsDir, file);
		const dst = path.join(outFontsDir, file);
		fs.copyFileSync(src, dst);
	});

	console.log(`✓ Copied ${fontFiles.length} Material Icons font files to assets/fonts`);
})();

export { };
