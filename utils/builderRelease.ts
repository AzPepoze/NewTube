const fs = require("fs");
const path = require("path");
const jsZip = require("jszip");

const RELEASE_DIR = path.join(__dirname, "../out/release");
if (!fs.existsSync(RELEASE_DIR)) {
	fs.mkdirSync(RELEASE_DIR, { recursive: true });
}

async function addDirToZip(zip, dirPath, basePath = "") {
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

async function zip(inputDir, output) {
	const zip = new jsZip();
	await addDirToZip(zip, inputDir);
	const content = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
	fs.writeFileSync(output, content);
	console.log(`Created zip file: ${output} (${content.length} total bytes)`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/extension/manifest.json"), "utf8"));
const version = manifest.version;

async function main() {
	const distDir = path.join(__dirname, "../out/dist");
	const dirs = fs.readdirSync(distDir);
	for (const file of dirs) {
		const filePath = path.join(distDir, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			await zip(filePath, path.join(RELEASE_DIR, `newtube_${file}_${version}.zip`));
		}
	}
}

main().catch(console.error);

export { };
