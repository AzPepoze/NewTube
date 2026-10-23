import { convertToExportSetting } from "../src/core/theme/exportConverter";
import { createAllSettingPresets } from "../src/settings/registry/defaultItems";
import { signatureFor } from "../src/ui/docs/apiReferenceData";
import * as fs from "fs-extra";
import * as path from "path";
import ts from "typescript";
import { SRC, BUILD, TEMPLATE, ROOT, extensionConfig, ensureDir } from "./shared/paths";
import { log } from "./shared/logger";

const SETTINGS_OUT_DIR = path.join(TEMPLATE, "settings");
const PROD_TYPES_DIR = path.join(BUILD, "types");
const TYPE_FILE_NAME = `${extensionConfig.name}.d.ts`;
const METADATA_FILE_NAME = `${extensionConfig.name}-Metadata.json`;
const TSCONFIG_PATH = path.join(ROOT, "tsconfig.json");
const TYPE_FORMAT_FLAGS = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
const VOID_RETURN = /\) => (Promise<void>|void)$/;

export interface MetadataEntry {
	label: string;
	type: "function";
	file: string;
	detail: string;
	info: string;
}

type ExportedFunction = ts.FunctionDeclaration & { name: ts.Identifier };

async function createSettingFolder(categoryFolderPath: string, thisSetting: any) {
	const settingFolderName = thisSetting.type.toLowerCase().replace(/\s+/g, "-");
	const settingsFolderPath = path.join(categoryFolderPath, settingFolderName);

	ensureDir(settingsFolderPath);

	await convertToExportSetting(thisSetting, async (fileName, fileData) => {
		fs.writeFileSync(path.join(settingsFolderPath, fileName), fileData);
	});

	fs.writeFileSync(path.join(settingsFolderPath, "config.json"), JSON.stringify(thisSetting, null, 2));
}

function createCheckedProgram(filePaths: string[]): ts.Program {
	const config = ts.readConfigFile(TSCONFIG_PATH, ts.sys.readFile);
	const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, ROOT);
	return ts.createProgram(filePaths, parsed.options);
}

function isExported(fn: ts.FunctionDeclaration): boolean {
	return ts.getModifiers(fn)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function exportedFunctions(sourceFile: ts.SourceFile): ExportedFunction[] {
	return sourceFile.statements.filter(
		(statement): statement is ExportedFunction =>
			ts.isFunctionDeclaration(statement) && statement.name !== undefined && isExported(statement),
	);
}

/** Uses the written annotation when present, otherwise the type the checker infers. */
function typeText(annotation: ts.TypeNode | undefined, sourceFile: ts.SourceFile, inferred: () => string): string {
	const text = annotation ? annotation.getText(sourceFile) : inferred();
	return text.replace(/\s+/g, " ").trim();
}

function inferredTypeOf(node: ts.Node, checker: ts.TypeChecker): string {
	return checker.typeToString(checker.getTypeAtLocation(node), undefined, TYPE_FORMAT_FLAGS);
}

/** Destructured parameters are named "options" so the signature stays readable. */
function paramDeclaration(param: ts.ParameterDeclaration, sourceFile: ts.SourceFile, checker: ts.TypeChecker): string {
	const name = ts.isIdentifier(param.name) ? param.name.text : "options";
	const rest = param.dotDotDotToken ? "..." : "";
	const optional = param.questionToken || param.initializer ? "?" : "";
	const type = typeText(param.type, sourceFile, () => inferredTypeOf(param, checker));
	return `${rest}${name}${optional}: ${type}`;
}

function functionDetail(fn: ExportedFunction, sourceFile: ts.SourceFile, checker: ts.TypeChecker): string {
	const params = fn.parameters.map((param) => paramDeclaration(param, sourceFile, checker)).join(", ");
	const returnType = typeText(fn.type, sourceFile, () =>
		checker.typeToString(checker.getSignatureFromDeclaration(fn)!.getReturnType(), undefined, TYPE_FORMAT_FLAGS),
	);
	return `(${params}) => ${returnType}`;
}

function cleanJsDoc(raw: string): string {
	return raw
		.replace(/\*\/$/, "")
		.replace(/^\/\*\*/, "")
		.replace(/^\s*\* ?/gm, "")
		.trim();
}

function functionInfo(fn: ExportedFunction, sourceFile: ts.SourceFile): string {
	const doc = ts.getJSDocCommentsAndTags(fn).filter(ts.isJSDoc).at(-1);
	return doc ? cleanJsDoc(doc.getText(sourceFile)) : "";
}

function metadataFor(sourceFile: ts.SourceFile, checker: ts.TypeChecker): MetadataEntry[] {
	return exportedFunctions(sourceFile).map((fn): MetadataEntry => ({
		label: fn.name.text,
		type: "function",
		file: path.basename(sourceFile.fileName),
		detail: functionDetail(fn, sourceFile, checker),
		info: functionInfo(fn, sourceFile),
	}));
}

export function extractMetadata(filePaths: string[]): MetadataEntry[] {
	const program = createCheckedProgram(filePaths);
	const checker = program.getTypeChecker();
	return filePaths.flatMap((filePath) => {
		const sourceFile = program.getSourceFile(filePath);
		return sourceFile ? metadataFor(sourceFile, checker) : [];
	});
}

function summaryOf(info: string): string {
	const lines = info.split("\n");
	const tagStart = lines.findIndex((line) => line.trim().startsWith("@"));
	const summaryLines = tagStart === -1 ? lines : lines.slice(0, tagStart);
	return summaryLines.join(" ").trim();
}

function missingDocParts(entry: MetadataEntry): string[] {
	const missing: string[] = [];
	if (!summaryOf(entry.info)) missing.push("a summary");
	if (!entry.info.includes("@example")) missing.push("@example");
	if (!VOID_RETURN.test(entry.detail) && !entry.info.includes("@returns")) missing.push("@returns");
	return missing;
}

function warnMissingDocs(entry: MetadataEntry) {
	const missing = missingDocParts(entry);
	if (missing.length) log.warn(`${entry.label} (${entry.file}) is missing ${missing.join(", ")}`);
}

/** Functions that live on the page world object, so they are not in a source file. */
const STORAGE_ENTRIES: MetadataEntry[] = [
	{
		label: "setValue",
		type: "function",
		file: "webPage.ts",
		detail: "(id: string, value: any) => void",
		info: `Sets a value in the ${extensionConfig.name} storage.\n\n@param {string} id - The storage key.\n@param {any} value - The value to save.\n\n@example\nsetValue("myCounter", 3);`,
	},
	{
		label: "getValue",
		type: "function",
		file: "webPage.ts",
		detail: "(id: string) => any",
		info: `Gets a value from the ${extensionConfig.name} storage.\n\n@param {string} id - The storage key.\n@returns {any} The saved value, or undefined when the key was never set.\n\n@example\nconst counter = getValue("myCounter");`,
	},
];

export async function buildTemplates() {
	log.info("Generating UI Templates...");
	ensureDir(SETTINGS_OUT_DIR);
	for (const thisPreset of createAllSettingPresets()) {
		await createSettingFolder(SETTINGS_OUT_DIR, thisPreset);
	}

	log.info("Generating Type Definitions...");
	const sharedFunctionsDir = path.join(SRC, "core/shared");
	const commDir = path.join(SRC, "core/communication");

	const sourceFiles = [
		path.join(sharedFunctionsDir, "domHelpers.ts"),
		path.join(sharedFunctionsDir, "extensionHelpers.ts"),
		path.join(sharedFunctionsDir, "notifications.ts"),
		path.join(sharedFunctionsDir, "dialogs.ts"),
		path.join(sharedFunctionsDir, "importExport.ts"),
		path.join(sharedFunctionsDir, "webPageLogger.ts"),
		path.join(sharedFunctionsDir, "utilities.ts"),
		path.join(sharedFunctionsDir, "colorConversion.ts"),
		path.join(commDir, "webPage.ts"),
	];

	const missingSourceFiles = sourceFiles.filter((filePath) => !fs.existsSync(filePath));
	missingSourceFiles.forEach((filePath) => log.warn(`API source file not found: ${filePath}`));
	const allMetadata = extractMetadata(sourceFiles.filter((filePath) => fs.existsSync(filePath)));
	allMetadata.forEach(warnMissingDocs);
	allMetadata.push(...STORAGE_ENTRIES);

	const combinedSignatures = allMetadata
		.map((m) => `    /** ${summaryOf(m.info) || m.label} */\n    ${signatureFor(m)}`)
		.join("\n");

	const dTsContent = `/**\n * ${extensionConfig.name} Global API\n */\ndeclare global {\n${combinedSignatures}\n}\nexport {};`;
	const metadataJson = JSON.stringify(allMetadata, null, 2);

	ensureDir(TEMPLATE);
	fs.writeFileSync(path.join(TEMPLATE, TYPE_FILE_NAME), dTsContent);

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
	fs.writeFileSync(path.join(TEMPLATE, "tsconfig.json"), JSON.stringify(templateTsconfig, null, 2));

	ensureDir(PROD_TYPES_DIR);
	fs.writeFileSync(path.join(PROD_TYPES_DIR, METADATA_FILE_NAME), metadataJson);
	fs.writeFileSync(path.join(PROD_TYPES_DIR, TYPE_FILE_NAME), dTsContent);
}

if (require.main === module) {
	buildTemplates().catch((err) => log.error("Templates build failed", err));
}
