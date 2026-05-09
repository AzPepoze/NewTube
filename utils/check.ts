import { spawn, spawnSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { ROOT, extensionConfig } from "./shared/paths";
import { log } from "./shared/logger";

interface TaskResult {
	description: string;
	duration: number;
	success: boolean;
}

const taskResults: TaskResult[] = [];

function getBinaryPath(binaryName: string): string {
	const binPath = path.join(ROOT, "node_modules/.bin", binaryName);
	if (fs.existsSync(binPath)) return binPath;
	return binaryName;
}

function runTaskSync(command: string, args: string[], description: string) {
	log.info(description);
	const startTime = Date.now();
	const binPath = getBinaryPath(command);
	
	const result = spawnSync(binPath, args, { stdio: "inherit", shell: true, cwd: ROOT });
	const duration = (Date.now() - startTime) / 1000;

	if (result.status !== 0) {
		log.error(`Task failed: ${description}`);
		taskResults.push({ description, duration, success: false });
		process.exit(result.status || 1);
	}
	
	log.success(`Task complete: ${description} (${duration.toFixed(2)}s)`);
	taskResults.push({ description, duration, success: true });
}

async function runTaskAsync(command: string, args: string[], description: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();
		const binPath = getBinaryPath(command);
		const child = spawn(binPath, args, { shell: true, cwd: ROOT });
		
		let output = "";
		
		child.stdout?.on("data", (data) => {
			output += data.toString();
		});
		
		child.stderr?.on("data", (data) => {
			output += data.toString();
		});
		
		child.on("close", (code) => {
			const duration = (Date.now() - startTime) / 1000;
			console.log(`\n--- ${description} ---`);
			process.stdout.write(output);
			
			if (code !== 0) {
				log.error(`Task failed: ${description} (Exit code: ${code})`);
				taskResults.push({ description, duration, success: false });
				reject(new Error(`Task failed: ${description}`));
			} else {
				log.success(`Task complete: ${description} (${duration.toFixed(2)}s)`);
				taskResults.push({ description, duration, success: true });
				resolve();
			}
		});
		
		child.on("error", (err) => {
			log.error(`Failed to start task: ${description}`);
			reject(err);
		});
	});
}

function printSummary() {
	log.header("Health Check Summary");
	console.log(`${"Task".padEnd(50)} | ${"Status".padEnd(10)} | ${"Duration"}`);
	console.log("-".repeat(75));
	
	taskResults.forEach(res => {
		const status = res.success ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";
		console.log(`${res.description.padEnd(50)} | ${status.padEnd(19)} | ${res.duration.toFixed(2)}s`);
	});
	console.log("-".repeat(75));
}

async function runCheck() {
	log.header(`${extensionConfig.name} - Codebase Health Check`);

	const args = process.argv.slice(2);
	const hasFilters = args.some(a => a.startsWith("--"));
	
	const shouldRunFix = !hasFilters || args.includes("--fix");
	const shouldRunSvelte = !hasFilters || args.includes("--svelte");
	const shouldRunTsc = !hasFilters || args.includes("--tsc");
	const shouldRunEslint = !hasFilters || args.includes("--eslint");

	const startTime = Date.now();

	// Step 1: Sequential auto-fix
	if (shouldRunFix) {
		runTaskSync("eslint", ["--fix", "src", "utils"], "ESLint - Auto-fixing issues");
	}

	// Step 2: Parallel checks
	const parallelTasks: Promise<void>[] = [];
	
	if (shouldRunSvelte) {
		parallelTasks.push(runTaskAsync("svelte-check", ["--tsconfig", "./tsconfig.json", "--compiler-warnings", "css_unused_selector:error"], "Svelte-Check - Verifying types & Svelte logic"));
	}
	
	if (shouldRunTsc) {
		parallelTasks.push(runTaskAsync("tsc", ["--noEmit", "--noUnusedLocals", "--noUnusedParameters"], "TypeScript - Checking for unused variables and parameters"));
	}
	
	if (shouldRunEslint) {
		parallelTasks.push(runTaskAsync("eslint", ["src", "utils"], "ESLint - Final validation"));
	}

	if (parallelTasks.length > 0) {
		log.info(`Starting ${parallelTasks.length} parallel checks...`);
		try {
			await Promise.all(parallelTasks);
		} catch (_error) {
			printSummary();
			process.exit(1);
		}
	}

	printSummary();
	const duration = ((Date.now() - startTime) / 1000).toFixed(2);
	log.header(`✨ Health check passed in ${duration}s!`);
	console.log("🚀 The codebase is clean and ready for development.");
}

runCheck().catch((_error) => {
	log.error("Fatal error during check:", _error);
	process.exit(1);
});

export {};
