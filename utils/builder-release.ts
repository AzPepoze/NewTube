import * as fs from "fs-extra";
import * as path from "path";
import jsZip from "jszip";
import { RELEASE, OUT, ENTRYPOINTS, extensionConfig, ensureDir } from "./shared/paths";
import { log } from "./shared/logger";

async function addDirToZip(zip: jsZip, dirPath: string, basePath = "") {
	const files = fs.readdirSync(dirPath);
	for (const file of files) {
		const filePath = path.join(dirPath, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			await addDirToZip(zip, filePath, path.join(basePath, file));
		} else {
			const content = fs.readFileSync(filePath);
			zip.file(path.join(basePath, file), content);
		}
	}
}

async function createZip(inputDir: string, output: string) {
	const zip = new jsZip();
	await addDirToZip(zip, inputDir);
	const content = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
	fs.writeFileSync(output, content);
	log.success(`Created zip file: ${path.basename(output)} (${content.length} total bytes)`);
}

export async function buildRelease() {
	log.step("Building release packages...");
	ensureDir(RELEASE);

	const manifestPath = path.join(ENTRYPOINTS, "manifest.json");
	const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
	const version = extensionConfig.version || manifest.version;

	const distDir = path.join(OUT, "dist");
	if (!fs.existsSync(distDir)) {
		log.error("Dist directory does not exist. Build first.");
		return;
	}

	const dirs = fs.readdirSync(distDir);
	for (const file of dirs) {
		const filePath = path.join(distDir, file);
		if (fs.statSync(filePath).isDirectory()) {
			const zipName = `${extensionConfig.name.toLowerCase()}_${file}_${version}.zip`;
			await createZip(filePath, path.join(RELEASE, zipName));
		}
	}
}

if (require.main === module) {
	buildRelease().catch((err) => log.error("Release build failed", err));
}
