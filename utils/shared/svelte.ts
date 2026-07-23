import { createHash } from "crypto";
import * as path from "path";
import { ROOT } from "./paths";

export function createSvelteCompilerOptions() {
	const getStableSvelteHashInput = (filename: string, name: string, css: string): string => {
		const normalizedFilename = filename.replace(/\\/g, "/").toLowerCase();
		let normalizedPath = normalizedFilename;

		if (path.isAbsolute(filename)) {
			const relativePath = path.relative(ROOT, filename).replace(/\\/g, "/").toLowerCase();
			if (!relativePath.startsWith("..")) normalizedPath = relativePath;
		}

		return `${normalizedPath}|${name}|${css}`;
	};

	return {
		css: "injected" as const,
		cssHash: ({ filename, name, css }: { filename: string; name: string; css: string }) => {
			const seed = getStableSvelteHashInput(filename, name, css);
			const stableHash = createHash("sha256").update(seed).digest("hex").slice(0, 8);
			return `svelte-${stableHash}`;
		},
	};
}
