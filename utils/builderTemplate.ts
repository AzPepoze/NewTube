import { convertToExportSetting } from "../src/styleshift/core/exportConverter";
import { uiPreset } from "../src/styleshift/settings/defaultItems";
import * as fs from "fs";
import * as path from "path";

/*
-------------------------------------------------------
Configuration & Paths
-------------------------------------------------------
*/
const SRC_DIR = path.join(__dirname, "../src");
const OUT_DIR = path.join(__dirname, "../out/build");
const TEMPLATE_DIR = path.join(__dirname, "../out/template");

const SETTINGS_OUT_DIR = path.join(TEMPLATE_DIR, "settings");
const PROD_TYPES_DIR = path.join(OUT_DIR, "types");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../extension.config.json"), "utf8"));

const TYPE_FILE_NAME = `${config.name}.d.ts`;
const METADATA_FILE_NAME = `${config.name}-Metadata.json`;

/*
-------------------------------------------------------
Helper Functions
-------------------------------------------------------
*/
function ensureDir(dir: string) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

async function createSettingFolder(categoryFolderPath: string, thisSetting: any) {
	// Standardize folder name: lowercase and replace spaces
	const settingFolderName = thisSetting.type.toLowerCase().replace(/\s+/g, "-");
	const settingsFolderPath = path.join(categoryFolderPath, settingFolderName);

	ensureDir(settingsFolderPath);

	await convertToExportSetting(thisSetting, async (fileName, fileData) => {
		fs.writeFileSync(path.join(settingsFolderPath, fileName), fileData);
	});

	fs.writeFileSync(path.join(settingsFolderPath, "config.json"), JSON.stringify(thisSetting, null, 2));
}

function extractMetadata(content: string) {
	const metadata: any[] = [];
	// Regex to capture JSDoc + Exported function
	const regex = /\/\*\*([\s\S]*?)\*\/[\s\r\n]*export\s+(async\s+)?function\s+(\w+)\s*\((.*?)\)/g;
	let match;
	while ((match = regex.exec(content)) !== null) {
		const [_full, jsdoc, isAsync, name, params] = match;
		metadata.push({
			label: name,
			type: "function",
			detail: `(${params}) => ${isAsync ? "Promise<any>" : "any"}`,
			info: jsdoc
				.replace(/\*\/$/, "")
				.replace(/^\/\*\*/, "")
				.replace(/^\s*\* ?/gm, "")
				.trim(),
		});
	}

	// Catch functions without JSDoc
	const simpleRegex = /(?<!\/\*\*[\s\S]*?)\bexport\s+(async\s+)?function\s+(\w+)\s*\((.*?)\)/g;
	while ((match = simpleRegex.exec(content)) !== null) {
		const [_, isAsync, name, params] = match;
		if (!metadata.find((m) => m.label === name)) {
			metadata.push({
				label: name,
				type: "function",
				detail: `(${params}) => ${isAsync ? "Promise<any>" : "any"}`,
			});
		}
	}
	return metadata;
}

/*
-------------------------------------------------------
Main Runner
-------------------------------------------------------
*/
(async () => {
	console.log(`🚀 Starting ${config.name} Builder...`);

	// 1. Build Templates
	console.log("📦 Generating UI Templates...");
	ensureDir(SETTINGS_OUT_DIR);
	for (const thisPreset of uiPreset) {
		await createSettingFolder(SETTINGS_OUT_DIR, thisPreset);
	}

	// 2. Build Type Definitions & Metadata
	console.log("📝 Generating Type Definitions...");
	const styleshiftDir = path.join(SRC_DIR, "styleshift");
	const sharedFunctionsDir = path.join(styleshiftDir, "shared");

	const sourceFiles = [
		path.join(sharedFunctionsDir, "normal.ts"),
		path.join(sharedFunctionsDir, "extension.ts"),
		path.join(styleshiftDir, "communication/webPage.ts"),
	];

	let allMetadata: any[] = [];
	for (const filePath of sourceFiles) {
		if (fs.existsSync(filePath)) {
			const content = fs.readFileSync(filePath, "utf-8");
			allMetadata = [...allMetadata, ...extractMetadata(content)];
		}
	}

	// Add manual internal entries
	allMetadata.push(
		{
			label: "setValue",
			type: "function",
			detail: "(id: string, value: any) => void",
			info: `Sets a value in the ${config.name} storage.`,
		},
		{
			label: "getValue",
			type: "function",
			detail: "(id: string) => any",
			info: `Gets a value from the ${config.name} storage.`,
		},
	);

	// Generate Signature string for .d.ts
	const combinedSignatures = allMetadata
		.map((m) => `    /** ${m.info || m.label} */\n    function ${m.label}${m.detail.replace(" => ", ": ")};`)
		.join("\n");

	const dTsContent = `/**\n * ${config.name} Global API\n * These functions are available in the advanced script editor.\n */\ndeclare global {\n${combinedSignatures}\n}\nexport {};`;

	// 3. Write Output Files
	const metadataJson = JSON.stringify(allMetadata, null, 2);

	// Write to /out/template (Dev)
	ensureDir(TEMPLATE_DIR);
	fs.writeFileSync(path.join(TEMPLATE_DIR, TYPE_FILE_NAME), dTsContent);

	// Generate a tsconfig.json for the template directory
	const templateTsconfig = {
		compilerOptions: {
			target: "es2022",
			module: "esnext",
			moduleResolution: "node",
			strict: true,
			skipLibCheck: true,
			lib: ["es2022", "dom"],
			ignoreDeprecations: "6.0",
		},
		include: ["**/*.js", "**/*.ts", TYPE_FILE_NAME],
	};
	fs.writeFileSync(path.join(TEMPLATE_DIR, "tsconfig.json"), JSON.stringify(templateTsconfig, null, 2));

	// Write to /out/build/types (Production)
	ensureDir(PROD_TYPES_DIR);
	fs.writeFileSync(path.join(PROD_TYPES_DIR, METADATA_FILE_NAME), metadataJson);
	fs.writeFileSync(path.join(PROD_TYPES_DIR, TYPE_FILE_NAME), dTsContent);

	console.log(`✅ Build complete!`);
	console.log(`- Templates: ${SETTINGS_OUT_DIR}`);
	console.log(`- Types:     ${path.join(TEMPLATE_DIR, TYPE_FILE_NAME)}`);
})();

export { };
