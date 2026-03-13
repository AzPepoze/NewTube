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

	// Copy Material Icons fonts to output directory
	const fontsDir = path.join(__dirname, "../node_modules/material-icons/iconfont");
	const outFontsDir = path.join(__dirname, "../out/build/modules/fonts");

	// Ensure fonts directory exists
	if (!fs.existsSync(outFontsDir)) {
		fs.mkdirSync(outFontsDir, { recursive: true });
	}

	// Copy all font files
	const fontFiles = fs.readdirSync(fontsDir).filter(f => f.match(/\.(woff|woff2)$/));
	fontFiles.forEach(file => {
		const src = path.join(fontsDir, file);
		const dst = path.join(outFontsDir, file);
		fs.copyFileSync(src, dst);
	});

	// Build materialIcons module with modified CSS
	const materialIconsCss = fs.readFileSync(
		path.join(fontsDir, "material-icons.css"),
		"utf-8"
	);

	// Replace font paths to point to the fonts directory
	const updatedCss = materialIconsCss.replace(
		/url\("\.\/material-icons/g,
		'url("../modules/fonts/material-icons'
	);

	// Create a temporary JS file that exports the CSS
	const tempMaterialIconsJs = path.join(__dirname, "../src/extension/modules/.materialIconsTemp.js");
	fs.writeFileSync(
		tempMaterialIconsJs,
		`export default \`${updatedCss.replace(/`/g, "\\`")}\`;`
	);

	await esbuild.build({
		entryPoints: [tempMaterialIconsJs],
		bundle: true,
		format: "esm",
		outfile: path.join(__dirname, "../out/build/modules/materialIcons.js"),
		minify: true,
	});

	// Clean up temp file
	fs.unlinkSync(tempMaterialIconsJs);
})();

export { };
