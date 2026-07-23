import { onFunctionEvent } from "@core/shared/eventHelpers";
import * as StyleShift_Functions from "@core/shared/extensionHelpers";

for (const thisFunctionName of Object.keys(StyleShift_Functions)) {
	onFunctionEvent("StyleShift", thisFunctionName, StyleShift_Functions[thisFunctionName]);
}

(window as any).StyleShift = (window as any).StyleShift || {};
(window as any).StyleShift.functions = StyleShift_Functions;
