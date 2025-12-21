import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import * as editorWorker from "monaco-editor/esm/vs/editor/editor.worker.js";
const monaco_themes = "monaco_All_Themes";

function run() {
	if (window["StyleShift"] == null) {
		setTimeout(run, 1);
		return;
	}

	window["StyleShift"]["Build-in"]["monaco"] = monaco;
	window["StyleShift"]["Build-in"]["monaco_themes"] = monaco_themes;

	self.monacoEnvironment = {
		getWorkerUrl: function (module_id, label) {
			switch (label) {
				case "css":
					return "./monaco/language/css/css.worker.js";
				case "javascript":
					return "./monaco/language/typescript/ts.worker.js";
				default:
					return editorWorker.initialize();
			}
		},
	};
}

run();

export { monaco, monaco_themes };
