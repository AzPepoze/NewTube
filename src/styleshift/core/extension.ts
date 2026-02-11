import { createNotification } from "../shared/extension";
import { sleep } from "../shared/normal";
import { logger } from "../utils/logger";
import { isSafeCode } from "../utils/security";
import { IS_IN_EXTENSION_SETTINGS_PAGE } from "../run";

let styleshiftFunctionsList = {};

const getFunctionListScript = `
function runStyleshiftFunctionsList(){

	if(window["StyleShift"] == null) {
		setTimeout(runStyleshiftFunctionsList, 1);
		return;
	}

	let Get_functions_list = {};

	for (const [key, value] of Object.entries(window["StyleShift"])) {
		Get_functions_list[key] = Object.keys(value);
	}

	window["StyleShift"].logger.info("Avaliable StyleShift functions", Get_functions_list);

	window.dispatchEvent(
		new CustomEvent("Sent_styleshift_functions_list", {
			detail: Get_functions_list,
		})
	);
}

runStyleshiftFunctionsList();`;

export async function updateStyleshiftFunctionsList() {
	if (IS_IN_EXTENSION_SETTINGS_PAGE) {
		while (window["StyleShift"] == null) {
			await sleep(1);
		}

		for (const [key, value] of Object.entries(window["StyleShift"])) {
			styleshiftFunctionsList[key] = Object.keys(value);
		}
		return;
	}

	return new Promise((resolve, _reject) => {
		window.addEventListener(
			"Sent_styleshift_functions_list",
			function (event) {
				logger.info("extension", "Recived", event);
				//@ts-ignore
				styleshiftFunctionsList = event.detail;
				resolve(true);
			},
			{ once: true },
		);

		runTextScript({
			text: getFunctionListScript,
			replace: false,
		});
	});
}

export async function getGlobalData(mode: "build-in" | "custom", functionName) {
	if (
		(window["StyleShift"] && window["StyleShift"][mode] == null) ||
		window["StyleShift"][mode][functionName] == null
	) {
		await sleep(0);
		return await getGlobalData(mode, functionName);
	} else {
		logger.info("extension", window["StyleShift"][mode], window["StyleShift"][mode][functionName]);
		return window["StyleShift"][mode][functionName];
	}
}

export async function runTextScript({
	text = null as string | Function,
	replace = true,
	codeName = "StyleShift",
	args = "",
}) {
	logger.info("extension", "Trying to run script");
	logger.info("extension", text);

	if (typeof text == "function") {
		text();
	} else {
		if (text != null && text != "") {
			//--------------------------------

			if (replace) {
				if (isSafeCode(text, codeName)) {
					for (const [functionMode, functionsList] of Object.entries(styleshiftFunctionsList) as [
						string,
						Array<string>,
					][]) {
						for (const functionName of functionsList) {
							text = text.replace(
								new RegExp(`\\b${functionName}\\b`, "g"),
								`window["StyleShift"]["${functionMode}"]["${functionName}"]`,
							);
						}
					}
				} else {
					return;
				}
			}

			//--------------------------------

			if (!IS_IN_EXTENSION_SETTINGS_PAGE) {
				chrome.runtime.sendMessage({
					Command: "runScript",
					Script: text,
					args: args,
				});
			}
		}
	}
}

export function runTextScriptFromSetting(thisSetting, functionName: string = "script") {
	runTextScript({
		text: thisSetting[functionName],
		codeName: `${thisSetting.id} : ${functionName}`,
		args: JSON.stringify({ settingId: thisSetting.id }),
	});
}

export let loadedDeveloperModules = false;
export let tryLoadedDeveloperModules = false;

export let jszip: any;
export let codemirror: any;

export const globalFunctionsMetadata: any[] = [];

export async function loadDeveloperModules() {
	if (tryLoadedDeveloperModules || loadedDeveloperModules) {
		return;
	}

	tryLoadedDeveloperModules = true;

	const loadingUi = await createNotification({
		icon: "🔃",
		title: "StyleShift - loading Developer Modules",
		content: "loading...",
		timeout: -1,
	});

	try {
		loadingUi.setContent("Preparing : Metadata (Code Autocomplete)");
		const metadataRes = await fetch(chrome.runtime.getURL("types/StyleShift-Metadata.json"));
		const metadataData = await metadataRes.json();
		globalFunctionsMetadata.length = 0;
		globalFunctionsMetadata.push(...metadataData);

		loadingUi.setContent("Preparing : Jzip (Export theme as zip)");
		const jszipModule = await import(chrome.runtime.getURL("modules/jszip.js"));
		jszip = jszipModule.default.default || jszipModule.default;

		loadingUi.setContent("Preparing : Codemirror (Code Editor)");
		const codemirrorModule = await import(chrome.runtime.getURL("modules/codemirror.js"));
		codemirror = codemirrorModule.default.default || codemirrorModule.default;

		logger.info("extension", "jszip:", jszip);
		logger.info("extension", "codemirror:", codemirror);

		loadingUi.setIcon("✅");
		loadingUi.setTitle("StyleShift - loaded Developer Modules");
		loadingUi.setContent("");

		setTimeout(() => {
			loadingUi.close();
		}, 4000);
		loadedDeveloperModules = true;
	} catch (error) {
		logger.error("extension", error);
		loadingUi.setIcon("⚠️");
		loadingUi.setTitle("StyleShift - Error loading Developer Modules");
		loadingUi.setContent((error as Error).message);
		setTimeout(() => {
			loadingUi.close();
		}, 4000);
		loadedDeveloperModules = true; // Mark as loaded even if it failed
	}
}
