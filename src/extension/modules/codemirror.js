import { EditorView, basicSetup } from "codemirror";
import { hoverTooltip, tooltips } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState } from "@codemirror/state";
import { autocompletion } from "@codemirror/autocomplete";

export default {
	EditorView,
	basicSetup,
	javascript,
	css,
	oneDark,
	EditorState,
	autocompletion,
	hoverTooltip,
	tooltips,
};
