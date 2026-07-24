import { execFileSync } from "child_process";
import { existsSync } from "fs";
import path from "path";

async function storeFirefox() {
	const apiKey = process.env.AMO_JWT_ISSUER;
	const apiSecret = process.env.AMO_JWT_SECRET;
	const sourceDir = path.resolve("out/dist/firefox");

	if (!apiKey || !apiSecret || !existsSync(sourceDir)) {
		console.error("Missing environment variables for Firefox Add-ons upload.");
		process.exit(1);
	}

	console.log(`Starting Firefox Add-ons upload from: ${sourceDir}`);

	try {
		// Using bun x to ensure we use the project's web-ext version
		const args = [
			"x",
			"web-ext",
			"sign",
			"--api-key",
			apiKey,
			"--api-secret",
			apiSecret,
			"--source-dir",
			sourceDir,
			"--artifacts-dir",
			"out/signed",
			"--channel",
			"listed",
		];

		console.log("Executing web-ext sign...");
		execFileSync("bun", args, { stdio: "inherit" });
		console.log("Successfully signed and uploaded to Firefox Add-ons!");
	} catch (_error) {
		console.error("Firefox Add-ons upload failed.");
		process.exit(1);
	}
}

storeFirefox().catch((err) => {
	console.error("Fatal error in Firefox Add-ons upload:", err);
	process.exit(1);
});
