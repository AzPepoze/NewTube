import * as fs from "fs-extra";
import * as path from "path";
import { extensionConfig } from "./paths";
import { log } from "./logger";

export function applyBranding(content: string): string {
	return content
		.replace(/STYLESHIFT/g, extensionConfig.code_name)
		.replace(/StyleShift/g, extensionConfig.name)
		.replace(/styleshift/g, extensionConfig.name.toLowerCase());
}

export function applyFirefoxCompatibility(content: string): string {
	const replacements = [
		{ from: /webkit-fill/g, to: "moz" },
		{ from: /-webkit-mask-box/g, to: "mask" },
		{ from: /webkit-slider-runnable-track/g, to: "moz-range-track" },
		{ from: /webkit-slider-thumb/g, to: "moz-range-thumb" },
		{ from: /webkit/g, to: "moz" },
		{ from: /nowrap/g, to: "pre" },
	];
	return replacements.reduce((text, { from, to }) => text.replace(from, to), content);
}

export async function processOutputFile(filePath: string, isFirefox = false) {
	try {
		let content = await fs.readFile(filePath, "utf8");
		if (![".css", ".js", ".json", ".html"].some((ext) => filePath.endsWith(ext))) return;

		content = applyBranding(content);
		if (isFirefox) {
			if (filePath.endsWith(".css") || filePath.endsWith(".js")) {
				content = applyFirefoxCompatibility(content);
			}
			if (filePath.endsWith("manifest.json")) {
				const manifest = JSON.parse(content);
				if (manifest.background?.service_worker) {
					manifest.background.scripts = [manifest.background.service_worker];
					delete manifest.background.service_worker;
				}
				if (manifest.web_accessible_resources?.[0]) {
					if (!manifest.web_accessible_resources[0].resources.includes("workers/*")) {
						manifest.web_accessible_resources[0].resources.push("workers/*");
					}
				}
				content = JSON.stringify(manifest, null, "\t");
			}
		}
		await fs.writeFile(filePath, content, "utf8");
	} catch (err: any) {
		log.error(`Error processing ${filePath}:`, err.message);
	}
}

export async function processOutputDirectory(dir: string, isFirefox = false) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			await processOutputDirectory(fullPath, isFirefox);
		} else {
			await processOutputFile(fullPath, isFirefox);
			if (file.includes("styleshift")) {
				const newName = file.replace("styleshift", extensionConfig.name.toLowerCase());
				fs.renameSync(fullPath, path.join(dir, newName));
			}
		}
	}
}
