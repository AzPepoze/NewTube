import { readFileSync } from "fs";

async function storeChrome() {
	const clientId = process.env.CHROME_CLIENT_ID;
	const clientSecret = process.env.CHROME_CLIENT_SECRET;
	const refreshToken = process.env.CHROME_REFRESH_TOKEN;
	const extensionId = process.env.CHROME_EXTENSION_ID;
	const publisherId = process.env.CHROME_PUBLISHER_ID;
	const filePath = process.env.CHROME_FILE_PATH;

	if (!clientId || !clientSecret || !refreshToken || !extensionId || !publisherId || !filePath) {
		console.error("Missing environment variables for Chrome Web Store upload.");
		process.exit(1);
	}

	console.log(`Starting Chrome Web Store upload for extension: ${extensionId}`);

	// 1. Exchange Refresh Token for Access Token
	console.log("Refreshing access token...");
	const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		}),
	});

	if (!tokenResponse.ok) {
		console.error("Failed to refresh access token:", await tokenResponse.text());
		process.exit(1);
	}

	const { access_token: accessToken } = (await tokenResponse.json()) as { access_token: string };
	console.log("Access token acquired.");

	// 2. Upload the ZIP file
	console.log(`Uploading ${filePath}...`);
	const fileBuffer = readFileSync(filePath);
	const boundary = `----NewTube${crypto.randomUUID()}`;
	const multipartBody = new Blob([
		`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{}\r\n--${boundary}\r\nContent-Type: application/zip\r\n\r\n`,
		fileBuffer,
		`\r\n--${boundary}--\r\n`,
	]);
	const uploadUrl = `https://chromewebstore.googleapis.com/upload/v2/publishers/${publisherId}/items/${extensionId}:upload`;

	const uploadResponse = await fetch(uploadUrl, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": `multipart/related; boundary=${boundary}`,
		},
		body: multipartBody,
	});

	if (!uploadResponse.ok) {
		console.error("Upload failed:", await uploadResponse.text());
		process.exit(1);
	}

	console.log("Upload successful.");

	// 3. Publish the item
	console.log("Publishing extension...");
	const publishUrl = `https://chromewebstore.googleapis.com/v2/publishers/${publisherId}/items/${extensionId}:publish`;

	const publishResponse = await fetch(publishUrl, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Length": "0",
		},
	});

	if (!publishResponse.ok) {
		console.error("Publish failed:", await publishResponse.text());
		process.exit(1);
	}

	console.log("Successfully submitted for review/published!");
}

storeChrome().catch((err) => {
	console.error("Chrome Web Store upload failed:", err);
	process.exit(1);
});
