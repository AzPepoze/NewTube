import { spawnSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { ROOT, extensionConfig } from "./shared/paths";
import { log } from "./shared/logger";

function getBinaryPath(binaryName: string): string {
	const binPath = path.join(ROOT, "node_modules/.bin", binaryName);
	if (fs.existsSync(binPath)) return binPath;
	return binaryName;
}

function runTask(command: string, args: string[], description: string) {
	log.info(description);
	const binPath = getBinaryPath(command);
	
	const result = spawnSync(binPath, args, { stdio: "inherit", shell: true, cwd: ROOT });

	if (result.status !== 0) {
		log.error(`Task failed: ${description}`);
		process.exit(result.status || 1);
	}
	log.success(`Task complete: ${description}`);
}

async function runCheck() {
	log.header(`${extensionConfig.name} - Codebase Health Check`);

	const startTime = Date.now();

	runTask("eslint", ["--fix", "src", "utils"], "ESLint - Auto-fixing issues");
	runTask("svelte-check", ["--tsconfig", "./tsconfig.json"], "Svelte-Check - Verifying types & Svelte logic");
	runTask("tsc", ["--noEmit", "--noUnusedLocals", "--noUnusedParameters"], "TypeScript - Checking for unused variables and parameters");
	runTask("eslint", ["src", "utils"], "ESLint - Final validation");

	const duration = ((Date.now() - startTime) / 1000).toFixed(2);
	log.header(`✨ Health check passed in ${duration}s!`);
	console.log("🚀 The codebase is clean and ready for development.");
}

runCheck().catch((error) => {
	log.error("Fatal error during check:", error);
	process.exit(1);
});

export {};
