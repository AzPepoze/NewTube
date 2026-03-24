import { createNotification } from "../shared/extension";
import { sleep } from "../shared/normal";
import { refreshExtensionState, IS_IN_EXTENSION_SETTINGS_PAGE } from "..";
import { getCustomItems } from "../settings/items";
import { persistCachedDataToStorage, saveToStorage } from "./storageManager";
import { isSafeCode } from "../utils/security";
import { logger } from "../../shared/logger";

/**
 * Saves all cached data and triggers a global UI/state refresh.
 */
export async function saveAndRefreshAll(): Promise<void> {
	logger.info("STORAGE", "Saving structure and refreshing all...");
	await saveItems();
	refreshExtensionState();
}

/**
 * Saves custom items and cached data to storage without a full UI refresh.
 */
export async function saveItems(): Promise<void> {
	const customItems = getCustomItems();
	if (customItems && customItems.length > 0) {
		await saveToStorage("customStyleShiftItems", customItems, true);
	}
	await persistCachedDataToStorage();
}

let activeStyleshiftFunctions: Record<string, string[]> = {};

const FUNCTION_DISCOVERY_SCRIPT = `
(function discoverFunctions(){
	if(window["StyleShift"] == null) {
		setTimeout(discoverFunctions, 1);
		return;
	}

	let registry = {};
	for (const [scope, methods] of Object.entries(window["StyleShift"])) {
		registry[scope] = Object.keys(methods);
	}

	window["StyleShift"].logger.info("Function Discovery Complete", registry);

	window.dispatchEvent(
		new CustomEvent("StyleShift:FunctionsDiscovered", {
			detail: registry,
		})
	);
})();`;

/**
 * Synchronizes the list of available StyleShift functions from the page context.
 */
export async function synchronizeAvailableFunctions(): Promise<void> {
	if (IS_IN_EXTENSION_SETTINGS_PAGE) {
		while (window["StyleShift"] == null) {
			await sleep(1);
		}

		for (const [scope, methods] of Object.entries(window["StyleShift"])) {
			activeStyleshiftFunctions[scope] = Object.keys(methods as object);
		}
		return;
	}

	return new Promise((resolve) => {
		const listener = ((event: CustomEvent) => {
			logger.info("runtime", "Function registry received:", event.detail);
			activeStyleshiftFunctions = event.detail;
			resolve();
		}) as EventListener;

		window.addEventListener("StyleShift:FunctionsDiscovered", listener, { once: true });

		executeScriptString({
			scriptContent: FUNCTION_DISCOVERY_SCRIPT,
			shouldSanitize: false,
		});
	});
}

/**
 * Retrieves a specific function from the StyleShift global object in the page context.
 */
export async function fetchGlobalFunction(scope: "buildIn" | "custom", functionName: string): Promise<any> {
	if (!window["StyleShift"] || !window["StyleShift"][scope] || !window["StyleShift"][scope][functionName]) {
		await sleep(10);
		return await fetchGlobalFunction(scope, functionName);
	}
	return window["StyleShift"][scope][functionName];
}

interface ExecutionOptions {
	scriptContent: string | Function;
	shouldSanitize?: boolean;
	sourceIdentifier?: string;
	executionArguments?: string;
}

/**
 * Executes a script in the page context, optionally sanitizing it.
 */
export async function executeScriptString({
	scriptContent,
	shouldSanitize = true,
	sourceIdentifier = "StyleShift",
	executionArguments = "",
}: ExecutionOptions): Promise<void> {
	logger.debug("runtime", "Trying to run script from source:", sourceIdentifier);

	if (!scriptContent) {
		logger.debug("runtime", "Script content is empty for source:", sourceIdentifier);
		return;
	}

	if (typeof scriptContent === "function") {
		logger.debug("runtime", "Executing script as function");
		scriptContent();
		return;
	}

	let finalScript = scriptContent;
	logger.debug("runtime", "Original script content:", finalScript);

	if (shouldSanitize) {
		if (isSafeCode(finalScript, sourceIdentifier)) {
			logger.debug("runtime", "Script passed safety check, applying shorthand replacements");
			// Replace shorthand function calls with full global paths
			for (const [scope, methods] of Object.entries(activeStyleshiftFunctions)) {
				for (const methodName of methods) {
					const pattern = new RegExp(`\\b${methodName}\\b`, "g");
					if (pattern.test(finalScript)) {
						logger.debug(
							"runtime",
							`Replacing shorthand ${methodName} with window["StyleShift"]["${scope}"]["${methodName}"]`,
						);
						finalScript = finalScript.replace(
							pattern,
							`window["StyleShift"]["${scope}"]["${methodName}"]`,
						);
					}
				}
			}
		} else {
			logger.warn("runtime", "Script blocked by security policy:", sourceIdentifier);
			return;
		}
	}

	logger.debug("runtime", "Final script for execution:", finalScript);

	if (!IS_IN_EXTENSION_SETTINGS_PAGE) {
		logger.debug("runtime", "Sending runScript message to background for script execution");
		chrome.runtime.sendMessage({
			Command: "runScript",
			Script: finalScript,
			args: executionArguments,
		});
	} else {
		logger.debug("runtime", "In extension settings page, runScript message not sent");
	}
}

/**
 * Executes a script associated with a specific setting.
 */
export function executeSettingScript(settingObject: any, functionProperty: string = "script"): void {
	executeScriptString({
		scriptContent: settingObject[functionProperty],
		sourceIdentifier: `${settingObject.id} : ${functionProperty}`,
		executionArguments: JSON.stringify({ settingId: settingObject.id }),
	});
}

export let isDevModulesLoaded = false;
export let hasAttemptedDevModuleLoad = false;
export let jszipInstance: any;
export let codemirrorInstance: any;
export const globalMetadataCache: any[] = [];

/**
 * Lazy-loads heavy developer modules like CodeMirror and JSZip.
 */
export async function initializeDeveloperEnvironment(): Promise<void> {
	if (hasAttemptedDevModuleLoad || isDevModulesLoaded) return;

	hasAttemptedDevModuleLoad = true;

	const loaderUi = await createNotification({
		icon: "sync",
		title: "StyleShift - Loading Developer Modules",
		content: "Preparing environment...",
		timeout: -1,
	});

	try {
		logger.info("runtime", "Loading developer environment...");
		loaderUi.setContent("Fetching Metadata...");
		const metadataUrl = chrome.runtime.getURL("types/StyleShift-Metadata.json");
		logger.debug("runtime", "Fetching metadata from:", metadataUrl);

		const metadataResponse = await fetch(metadataUrl);
		const metadataData = await metadataResponse.json();
		globalMetadataCache.length = 0;
		globalMetadataCache.push(...metadataData);

		loaderUi.setContent("Loading JSZip...");
		const jszipUrl = chrome.runtime.getURL("modules/jszip.js");
		logger.debug("runtime", "Importing JSZip from:", jszipUrl);

		const jszipModule = await import(jszipUrl);
		jszipInstance = jszipModule.default.default || jszipModule.default;

		loaderUi.setContent("Loading CodeMirror...");
		const codemirrorUrl = chrome.runtime.getURL("modules/codemirror.js");
		logger.debug("runtime", "Importing CodeMirror from:", codemirrorUrl);

		const codemirrorModule = await import(codemirrorUrl);
		codemirrorInstance = codemirrorModule.default.default || codemirrorModule.default;

		logger.info("runtime", "Developer environment loaded successfully.");
		loaderUi.setIcon("check_circle");
		loaderUi.setTitle("Developer Environment Ready");
		loaderUi.setContent("");

		setTimeout(() => loaderUi.close(), 2000);
		isDevModulesLoaded = true;
	} catch (error) {
		const errorName = (error as any)?.name;
		const isAbort = errorName === "AbortError" || errorName === "NS_ERROR_ABORT";

		logger.error("runtime", "Failed to load developer modules:", error);

		loaderUi.setIcon("warning");
		if (isAbort) {
			loaderUi.setTitle("Load Aborted");
			loaderUi.setContent(
				"The operation was aborted by the browser. (This often happens if the page is navigated or reloaded during loading)",
			);
		} else {
			loaderUi.setTitle("Developer Module Error");
			const message = error instanceof Error ? error.message : String(error);
			loaderUi.setContent(`${message}\n(Check console for details)`);
		}

		setTimeout(() => loaderUi.close(), 10000);
		hasAttemptedDevModuleLoad = false;
	}
}

let workerPolicy: any = null;

function getWorkerPolicy() {
	if (workerPolicy) return workerPolicy;
	if (typeof window !== "undefined" && (window as any).trustedTypes && (window as any).trustedTypes.createPolicy) {
		try {
			workerPolicy = (window as any).trustedTypes.createPolicy("styleshift-worker-policy", {
				createScriptURL: (url: string) => url,
			});
		} catch (e) {
			logger.warn("runtime", "Failed to create Trusted Types policy:", e);
		}
	}
	return workerPolicy;
}

export async function loadWorker(fileName: string): Promise<Worker | null> {
	const scriptUrl = chrome.runtime.getURL(`workers/${fileName}`);
	logger.info("runtime", `Loading worker ${fileName}`);

	const policy = getWorkerPolicy();
	const trustedUrl = policy ? policy.createScriptURL(scriptUrl) : scriptUrl;

	try {
		const worker = new Worker(trustedUrl);
		logger.info("runtime", `Native Worker created successfully for ${fileName}`);
		return worker;
	} catch (error) {
		logger.warn("runtime", `Native Worker failed for ${fileName} with direct URL, trying Blob fallback:`, error);

		try {
			const response = await fetch(scriptUrl);
			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);
			const trustedBlobUrl = policy ? policy.createScriptURL(blobUrl) : blobUrl;
			const worker = new Worker(trustedBlobUrl);
			logger.info("runtime", `Worker created successfully via Blob for ${fileName}`);
			return worker;
		} catch (blobError) {
			logger.error("runtime", `All worker creation methods failed for ${fileName}:`, blobError);
			return null;
		}
	}
}
