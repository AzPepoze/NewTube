import * as path from "path";
import * as fs from "fs";

export const ROOT = path.resolve(__dirname, "../../");
export const SRC = path.join(ROOT, "src");
export const UTILS = path.join(ROOT, "utils");
export const OUT = path.join(ROOT, "out");
export const BUILD = path.join(OUT, "build");
export const TEMP = path.join(ROOT, "temp");
export const TEMPLATE = path.join(OUT, "template");
export const DIST_CHROMIUM = path.join(OUT, "dist/chromium");
export const DIST_FIREFOX = path.join(OUT, "dist/firefox");
export const RELEASE = path.join(OUT, "release");

export const ENTRYPOINTS = path.join(SRC, "entrypoints");
export const STYLES = path.join(SRC, "styles");

export const CONFIG_FILE = path.join(ROOT, "extension.config.json");
export const extensionConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));

export function ensureDir(dir: string) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

export function getFileName(filePath: string) {
	return path.basename(filePath);
}

export function getBinaryPath(binaryName: string): string {
	const binPath = path.join(ROOT, "node_modules/.bin", binaryName);
	if (fs.existsSync(binPath)) return binPath;
	return binaryName;
}
