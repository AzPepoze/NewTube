import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";

async function deployFirefox() {
	const apiKey = process.env.AMO_JWT_ISSUER;
	const apiSecret = process.env.AMO_JWT_SECRET;
	const filePath = process.env.FIREFOX_FILE_PATH;

	if (!apiKey || !apiSecret || !filePath) {
		console.error("Missing environment variables for Firefox deployment.");
		process.exit(1);
	}

	console.log(`Starting Firefox deployment for: ${filePath}`);

	// web-ext sign requires a source-dir even when using --upload-file
	const dummyDir = path.resolve("temp/dummy-firefox");
	if (!existsSync(dummyDir)) {
		mkdirSync(dummyDir, { recursive: true });
	}

	try {
		// Using bun x to ensure we use the project's web-ext version
		const cmd = [
			"bun x web-ext sign",
			`--api-key ${apiKey}`,
			`--api-secret ${apiSecret}`,
			`--source-dir ${dummyDir}`,
			"--artifacts-dir out/signed",
			`--upload-file ${filePath}`,
			"--channel listed"
		].join(" ");

		console.log("Executing web-ext sign...");
		execSync(cmd, { stdio: "inherit" });
		console.log("Successfully signed and uploaded to Firefox Add-ons!");
	} catch (_error) {
		console.error("Firefox deployment failed.");
		process.exit(1);
	}
}

deployFirefox().catch(err => {
	console.error("Fatal error in Firefox deployment:", err);
	process.exit(1);
});
