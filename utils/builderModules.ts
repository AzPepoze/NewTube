import * as esbuild from "esbuild";
import * as path from "path";
import * as fs from "fs-extra";
import { ENTRYPOINTS, BUILD, ROOT, ensureDir } from "./shared/paths";
import { log } from "./shared/logger";

export async function buildModules() {
	log.info("Building external modules...");
	
	const modules = [
		{ name: "jszip", entry: "modules/jszip.js" },
		{ name: "codemirror", entry: "modules/codemirror.js" }
	];

	for (const mod of modules) {
		await esbuild.build({
			entryPoints: [path.join(ENTRYPOINTS, mod.entry)],
			bundle: true,
			format: "esm",
			outfile: path.join(BUILD, "modules", `${mod.name}.js`),
			minify: true,
		});
	}

	log.info("Copying fonts...");
	const fontsDir = path.join(ROOT, "node_modules/material-icons/iconfont");
	const outFontsDir = path.join(BUILD, "assets/fonts");

	ensureDir(outFontsDir);

	try {
		const src = path.join(fontsDir, "material-icons.woff2");
		const dst = path.join(outFontsDir, "material-icons.woff2");
		fs.copyFileSync(src, dst);
		log.success("Copied material-icons.woff2 to assets/fonts");
	} catch (err: any) {
		log.error(`Failed to copy material-icons.woff2:`, err.message);
	}
}

if (require.main === module) {
	buildModules().catch(err => log.error("Modules build failed", err));
}
