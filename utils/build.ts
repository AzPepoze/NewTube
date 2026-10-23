import { spawnSync } from "child_process";
import * as fs from "fs-extra";
import { buildExtension } from "./builder-extension";
import { buildModules } from "./builder-modules";
import { buildRelease } from "./builder-release";
import { buildTemplates } from "./builder-template";
import { log } from "./shared/logger";
import { BUILD, extensionConfig, getBinaryPath, ROOT } from "./shared/paths";

const args = process.argv.slice(2);
const isProduction = args.includes("--production") || args.includes("--release");
const isRelease = args.includes("--release");

async function main() {
	log.header(`${extensionConfig.name} - Build Orchestrator`);
	const startTime = Date.now();

	try {
		fs.emptyDirSync(BUILD);

		log.step("Building CSS...");
		const sassResult = spawnSync(
			getBinaryPath("sass"),
			[
				"src/styles/setting.scss",
				"out/build/style.css",
				"--style=compressed",
				"--no-source-map",
				"--load-path=node_modules",
			],
			{ stdio: "inherit", shell: true, cwd: ROOT },
		);

		if (sassResult.status !== 0) throw new Error("CSS build failed");
		log.success("CSS build completed.");

		await buildModules();

		log.step("Building Templates & Types...");
		const tscResult = spawnSync(getBinaryPath("tsc"), ["-p", "utils/tsconfigBuilderTypes.json"], {
			stdio: "inherit",
			shell: true,
			cwd: ROOT,
		});
		if (tscResult.status !== 0) throw new Error("Type generation failed");
		await buildTemplates();
		log.success("Templates & Types built.");

		if (isProduction) process.argv.push("--production");
		process.argv.push("--once");
		await buildExtension();

		if (isRelease) {
			await buildRelease();
		}

		const duration = ((Date.now() - startTime) / 1000).toFixed(2);
		log.header(`🚀 Build finished in ${duration}s!`);
	} catch (error: any) {
		log.error("Build failed", error.message);
		process.exit(1);
	}
}

main();
