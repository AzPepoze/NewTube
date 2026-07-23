import { autocompletion } from "@codemirror/autocomplete";
import { css, cssCompletionSource, cssLanguage } from "@codemirror/lang-css";
import {
	javascript,
	javascriptLanguage,
	localCompletionSource,
	scopeCompletionSource,
} from "@codemirror/lang-javascript";
import { search } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import { hoverTooltip, tooltips } from "@codemirror/view";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { EditorView, basicSetup } from "codemirror";

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
