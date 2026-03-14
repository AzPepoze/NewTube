import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { hoverTooltip, tooltips } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
import { search } from "@codemirror/search";
import {
	javascript,
	javascriptLanguage,
	localCompletionSource,
	scopeCompletionSource,
} from "@codemirror/lang-javascript";
import { css, cssLanguage, cssCompletionSource } from "@codemirror/lang-css";
import { dracula } from "@uiw/codemirror-theme-dracula";

export default {
	EditorView,
	basicSetup,
	javascript,
	javascriptLanguage,
	localCompletionSource,
	scopeCompletionSource,
	css,
	cssLanguage,
	cssCompletionSource,
	dracula,
	EditorState,
	autocompletion,
	search,
	hoverTooltip,
	tooltips,
};
