import { spawnSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

function getBinaryPath(binaryName: string): string {
	const binPath = path.join(__dirname, "../node_modules/.bin", binaryName);
	if (fs.existsSync(binPath)) {
		return binPath;
	}
	return binaryName;
}

function runTask(command: string, args: string[], description: string) {
	console.log(`\n[${description}]`);
	const binPath = getBinaryPath(command);
	console.log(`> ${command} ${args.join(" ")}`);

	const result = spawnSync(binPath, args, {
		stdio: "inherit",
		shell: true,
	});

	if (result.status !== 0) {
		console.error(`\n❌ Task failed: ${description}`);
		process.exit(result.status || 1);
	}
	console.log(`✅ Task complete: ${description}`);
}

async function runCheck() {
	console.log("\n-----------------------------------------");
	console.log("🔍 StyleShift - Codebase Health Check");
	console.log("-----------------------------------------");

	const startTime = Date.now();

	// 1. ESLint Auto-Fix
	runTask("eslint", ["--fix", "src", "utils"], "ESLint - Auto-fixing issues");

	// 2. Svelte-Check (Type Checking)
	runTask("svelte-check", ["--tsconfig", "./tsconfig.json"], "Svelte-Check - Verifying types & Svelte logic");

	// 3. TypeScript Unused Check
	runTask(
		"tsc",
		["--noEmit", "--noUnusedLocals", "--noUnusedParameters"],
		"TypeScript - Checking for unused variables and parameters",
	);

	// 4. Final ESLint Validation
	runTask("eslint", ["src", "utils"], "ESLint - Final validation");

	const duration = ((Date.now() - startTime) / 1000).toFixed(2);
	console.log("\n-----------------------------------------");
	console.log(`✨ Health check passed in ${duration}s!`);
	console.log("🚀 The codebase is clean and ready for development.");
	console.log("-----------------------------------------\n");
}

runCheck().catch((error) => {
	console.error("Fatal error during check:", error);
	process.exit(1);
});

export {};
