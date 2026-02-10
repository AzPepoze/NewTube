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
const TYPES_OUT_DIR = path.join(TEMPLATE_DIR, "types");
const PROD_TYPES_DIR = path.join(OUT_DIR, "types");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../extension.config.json"), "utf8"));

const TYPE_FILE_NAME = `${config.name}.d.ts`;
const METADATA_FILE_NAME = `${config.name}-Metadata.json`;

/*
-------------------------------------------------------
Helper Functions
-------------------------------------------------------
*/
function ensure_dir(dir: string) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

async function create_setting_folder(category_folder_path: string, this_setting: any) {
	// Standardize folder name: lowercase and replace spaces
	const setting_folder_name = this_setting.type.toLowerCase().replace(/\s+/g, "-");
	const settings_folder_path = path.join(category_folder_path, setting_folder_name);

	ensure_dir(settings_folder_path);

	await convertToExportSetting(this_setting, async (file_name, file_data) => {
		fs.writeFileSync(path.join(settings_folder_path, file_name), file_data);
	});

	fs.writeFileSync(path.join(settings_folder_path, "config.json"), JSON.stringify(this_setting, null, 2));
}

function extract_metadata(content: string) {
	const metadata: any[] = [];
	// Regex to capture JSDoc + Exported function
	const regex = /\/\*\*([\s\S]*?)\*\/[\s\r\n]*export\s+(async\s+)?function\s+(\w+)\s*\((.*?)\)/g;
	let match;
	while ((match = regex.exec(content)) !== null) {
		const [full, jsdoc, isAsync, name, params] = match;
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
	ensure_dir(SETTINGS_OUT_DIR);
	for (const this_preset of uiPreset) {
		await create_setting_folder(SETTINGS_OUT_DIR, this_preset);
	}

	// 2. Build Type Definitions & Metadata
	console.log("📝 Generating Type Definitions...");
	const styleshift_dir = path.join(SRC_DIR, "styleshift");
	const build_in_functions_dir = path.join(styleshift_dir, "buildInFunctions");

	const source_files = [
		path.join(build_in_functions_dir, "normal.ts"),
		path.join(build_in_functions_dir, "extension.ts"),
		path.join(styleshift_dir, "communication/webPage.ts"),
	];

	let all_metadata: any[] = [];
	for (const file_path of source_files) {
		if (fs.existsSync(file_path)) {
			const content = fs.readFileSync(file_path, "utf-8");
			all_metadata = [...all_metadata, ...extract_metadata(content)];
		}
	}

	// Add manual internal entries
	all_metadata.push(
		{
			label: "set_value",
			type: "function",
			detail: "(id: string, value: any) => void",
			info: `Sets a value in the ${config.name} storage.`,
		},
		{
			label: "get_value",
			type: "function",
			detail: "(id: string) => any",
			info: `Gets a value from the ${config.name} storage.`,
		},
	);

	// Generate Signature string for .d.ts
	const combined_signatures = all_metadata
		.map((m) => `    /** ${m.info || m.label} */\n    function ${m.label}${m.detail.replace(" => ", ": ")};`)
		.join("\n");

	const d_ts_content = `/**\n * ${config.name} Global API\n * These functions are available in the advanced script editor.\n */\ndeclare global {\n${combined_signatures}\n}\nexport {};`;

	// 3. Write Output Files
	const metadata_json = JSON.stringify(all_metadata, null, 2);

	// Write to /out/template (Dev)
	ensure_dir(TEMPLATE_DIR);
	fs.writeFileSync(path.join(TEMPLATE_DIR, TYPE_FILE_NAME), d_ts_content);

	// Generate a tsconfig.json for the template directory
	const template_tsconfig = {
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
	fs.writeFileSync(path.join(TEMPLATE_DIR, "tsconfig.json"), JSON.stringify(template_tsconfig, null, 2));

	// Write to /out/build/types (Production)
	ensure_dir(PROD_TYPES_DIR);
	fs.writeFileSync(path.join(PROD_TYPES_DIR, METADATA_FILE_NAME), metadata_json);
	fs.writeFileSync(path.join(PROD_TYPES_DIR, TYPE_FILE_NAME), d_ts_content);

	console.log(`✅ Build complete!`);
	console.log(`- Templates: ${SETTINGS_OUT_DIR}`);
	console.log(`- Types:     ${path.join(TEMPLATE_DIR, TYPE_FILE_NAME)}`);
})();

export {};
