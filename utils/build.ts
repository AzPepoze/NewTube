import { spawnSync } from "child_process";
import { buildModules } from "./builder-modules";
import { buildTemplates } from "./builder-template";
import { buildExtension } from "./builder-extension";
import { buildRelease } from "./builder-release";
import { log } from "./shared/logger";
import { extensionConfig, ROOT } from "./shared/paths";

const args = process.argv.slice(2);
const isProduction = args.includes("--production") || args.includes("--release");
const isRelease = args.includes("--release");

async function main() {
	log.header(`${extensionConfig.name} - Build Orchestrator`);
	const startTime = Date.now();

	try {
		// 1. Build CSS
		log.step("Building CSS...");
		const sassResult = spawnSync(
			"sass",
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

		// 2. Build Modules
		await buildModules();

		// 3. Build Templates & Types
		log.step("Building Templates & Types...");
		const tscResult = spawnSync("tsc", ["-p", "utils/tsconfigBuilderTypes.json"], {
			stdio: "inherit",
			shell: true,
			cwd: ROOT,
		});
		if (tscResult.status !== 0) throw new Error("Type generation failed");
		await buildTemplates();
		log.success("Templates & Types built.");

		// 4. Build Extension
		// Pass --production flag if needed
		if (isProduction) process.argv.push("--production");
		process.argv.push("--once");
		await buildExtension();

		// 5. Build Release
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
