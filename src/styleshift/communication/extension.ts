import { onFunctionEvent } from "../shared/advance";
import * as StyleShift_Functions from "../shared/extension";

for (const thisFunctionName of Object.keys(StyleShift_Functions)) {
	onFunctionEvent("StyleShift", thisFunctionName, StyleShift_Functions[thisFunctionName]);
}

(window as any).StyleShift = (window as any).StyleShift || {};
(window as any).StyleShift.functions = StyleShift_Functions;
